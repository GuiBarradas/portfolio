// Package metrics collects cheap, real process stats and streams them over SSE.
// Nothing here is sampled or faked: every number comes from the running binary.
package metrics

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"sort"
	"sync"
	"sync/atomic"
	"time"
)

const (
	ringSize      = 1024 // last N request latencies kept for percentiles
	maxStreams    = 64   // concurrent SSE viewers; beyond this the HUD just says "busy"
	streamTick    = time.Second
	streamMaxLife = 10 * time.Minute
)

type Collector struct {
	start    time.Time
	requests atomic.Uint64
	bytesOut atomic.Uint64
	binSize  int64

	mu   sync.Mutex
	ring [ringSize]time.Duration
	idx  int
	fill int

	streams atomic.Int32

	// RPS window, guarded by mu.
	lastCount uint64
	lastAt    time.Time
}

func NewCollector() *Collector {
	c := &Collector{start: time.Now(), lastAt: time.Now()}
	if exe, err := os.Executable(); err == nil {
		if st, err := os.Stat(exe); err == nil {
			c.binSize = st.Size()
		}
	}
	return c
}

// Snapshot is what the HUD receives once per second.
type Snapshot struct {
	UptimeSec  int64   `json:"uptime_s"`
	Requests   uint64  `json:"requests"`
	BytesOut   uint64  `json:"bytes_out"`
	RPS        float64 `json:"rps"`
	P50Ms      float64 `json:"p50_ms"`
	P99Ms      float64 `json:"p99_ms"`
	HeapMB     float64 `json:"heap_mb"`
	SysMB      float64 `json:"sys_mb"`
	Goroutines int     `json:"goroutines"`
	GCPauseUs  float64 `json:"gc_pause_us"`
	NumGC      uint32  `json:"num_gc"`
	CPUUserMs  int64   `json:"cpu_user_ms"`
	CPUSysMs   int64   `json:"cpu_sys_ms"`
	BinaryMB   float64 `json:"binary_mb"`
	Viewers    int32   `json:"viewers"`
	GoVersion  string  `json:"go"`
	NumCPU     int     `json:"num_cpu"`
}

func (c *Collector) snapshot() Snapshot {
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)

	cpuUser, cpuSys := cpuTimes()

	now := time.Now()
	reqs := c.requests.Load()
	c.mu.Lock()
	elapsed := now.Sub(c.lastAt).Seconds()
	rps := 0.0
	if elapsed > 0 {
		rps = float64(reqs-c.lastCount) / elapsed
	}
	c.lastCount, c.lastAt = reqs, now
	c.mu.Unlock()

	p50, p99 := c.percentiles()
	var pause float64
	if ms.NumGC > 0 {
		pause = float64(ms.PauseNs[(ms.NumGC+255)%256]) / 1e3
	}

	return Snapshot{
		UptimeSec:  int64(now.Sub(c.start).Seconds()),
		Requests:   reqs,
		BytesOut:   c.bytesOut.Load(),
		RPS:        rps,
		P50Ms:      p50,
		P99Ms:      p99,
		HeapMB:     float64(ms.HeapAlloc) / 1024 / 1024,
		SysMB:      float64(ms.Sys) / 1024 / 1024,
		Goroutines: runtime.NumGoroutine(),
		GCPauseUs:  pause,
		NumGC:      ms.NumGC,
		CPUUserMs:  cpuUser,
		CPUSysMs:   cpuSys,
		BinaryMB:   float64(c.binSize) / 1024 / 1024,
		Viewers:    c.streams.Load(),
		GoVersion:  runtime.Version(),
		NumCPU:     runtime.NumCPU(),
	}
}

func (c *Collector) record(d time.Duration) {
	c.mu.Lock()
	c.ring[c.idx] = d
	c.idx = (c.idx + 1) % ringSize
	if c.fill < ringSize {
		c.fill++
	}
	c.mu.Unlock()
}

func (c *Collector) percentiles() (p50, p99 float64) {
	c.mu.Lock()
	n := c.fill
	buf := make([]time.Duration, n)
	copy(buf, c.ring[:n])
	c.mu.Unlock()
	if n == 0 {
		return 0, 0
	}
	sort.Slice(buf, func(i, j int) bool { return buf[i] < buf[j] })
	at := func(q float64) float64 {
		i := int(q*float64(n-1) + 0.5)
		return float64(buf[i].Microseconds()) / 1000
	}
	return at(0.50), at(0.99)
}

// Middleware counts requests and measures latency for everything except the SSE stream itself.
func (c *Collector) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/metrics/stream" {
			next.ServeHTTP(w, r)
			return
		}
		t := time.Now()
		cw := &countingWriter{ResponseWriter: w}
		next.ServeHTTP(cw, r)
		c.requests.Add(1)
		c.bytesOut.Add(uint64(cw.n))
		c.record(time.Since(t))
	})
}

type countingWriter struct {
	http.ResponseWriter
	n int
}

func (w *countingWriter) Write(b []byte) (int, error) {
	n, err := w.ResponseWriter.Write(b)
	w.n += n
	return n, err
}

// StreamHandler pushes one JSON snapshot per second over Server-Sent Events.
func (c *Collector) StreamHandler(w http.ResponseWriter, r *http.Request) {
	if c.streams.Load() >= maxStreams {
		http.Error(w, "hud busy, try again later", http.StatusTooManyRequests)
		return
	}
	fl, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}
	c.streams.Add(1)
	defer c.streams.Add(-1)

	h := w.Header()
	h.Set("Content-Type", "text/event-stream")
	h.Set("Cache-Control", "no-cache")
	h.Set("Connection", "keep-alive")
	h.Set("X-Accel-Buffering", "no")

	enc := json.NewEncoder(w)
	tick := time.NewTicker(streamTick)
	defer tick.Stop()
	deadline := time.After(streamMaxLife)

	send := func() bool {
		fmt.Fprint(w, "data: ")
		if err := enc.Encode(c.snapshot()); err != nil {
			return false
		}
		fmt.Fprint(w, "\n")
		fl.Flush()
		return true
	}
	if !send() {
		return
	}
	for {
		select {
		case <-r.Context().Done():
			return
		case <-deadline:
			return
		case <-tick.C:
			if !send() {
				return
			}
		}
	}
}
