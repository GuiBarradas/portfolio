// Package radio is a Habbo-style station: one playlist, scheduled by the wall
// clock, so every listener hears the same track at the same offset. The
// schedule is a pure function of time, which means it survives restarts and
// is identical across replicas.
package radio

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"io/fs"
	"log"
	"net/http"
	"strings"
	"time"
)

// Epoch is when the station "went on air". Fixed so the schedule is deterministic.
var Epoch = time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)

type Track struct {
	Title     string  `json:"title"`
	Artist    string  `json:"artist"`
	File      string  `json:"file"`       // name under static/radio/
	DurationS float64 `json:"duration_s"` // optional for .ogg, read from the file
}

type Station struct {
	tracks []Track
	total  time.Duration
}

// Load reads static/radio/playlist.json from fsys and keeps the tracks that
// actually exist and have a known duration. Missing files are logged, not fatal.
func Load(fsys fs.FS) *Station {
	s := &Station{}
	raw, err := fs.ReadFile(fsys, "static/radio/playlist.json")
	if err != nil {
		log.Printf("radio: no playlist (%v), station is silent", err)
		return s
	}
	var m struct {
		Tracks []Track `json:"tracks"`
	}
	if err := json.Unmarshal(raw, &m); err != nil {
		log.Printf("radio: bad playlist: %v", err)
		return s
	}
	for _, t := range m.Tracks {
		path := "static/radio/" + t.File
		if _, err := fs.Stat(fsys, path); err != nil {
			log.Printf("radio: skipping %q: %v", t.Title, err)
			continue
		}
		if t.DurationS <= 0 && strings.HasSuffix(strings.ToLower(t.File), ".ogg") {
			if d, err := oggDuration(fsys, path); err == nil {
				t.DurationS = d.Seconds()
			}
		}
		if t.DurationS <= 0 {
			log.Printf("radio: skipping %q: unknown duration", t.Title)
			continue
		}
		s.tracks = append(s.tracks, t)
		s.total += time.Duration(t.DurationS * float64(time.Second))
	}
	log.Printf("radio: %d tracks, %s of programming", len(s.tracks), s.total.Round(time.Second))
	return s
}

// NowPlaying is what the client needs to tune in mid-song.
type NowPlaying struct {
	Index        int     `json:"index"`
	Title        string  `json:"title"`
	Artist       string  `json:"artist"`
	URL          string  `json:"url"`
	OffsetS      float64 `json:"offset_s"`
	DurationS    float64 `json:"duration_s"`
	Next         *Brief  `json:"next,omitempty"`
	Tracks       int     `json:"tracks"`
	ServerTimeMs int64   `json:"server_time_ms"`
}

type Brief struct {
	Title  string `json:"title"`
	Artist string `json:"artist"`
}

// At returns what is on air at time t. ok is false when the station is silent.
func (s *Station) At(t time.Time) (np NowPlaying, ok bool) {
	np.Tracks = len(s.tracks)
	np.ServerTimeMs = t.UnixMilli()
	if len(s.tracks) == 0 {
		return np, false
	}
	pos := t.Sub(Epoch) % s.total
	if pos < 0 {
		pos += s.total
	}
	for i, tr := range s.tracks {
		d := time.Duration(tr.DurationS * float64(time.Second))
		if pos < d {
			np.Index = i
			np.Title, np.Artist, np.URL = tr.Title, tr.Artist, "/static/radio/"+tr.File
			np.OffsetS = pos.Seconds()
			np.DurationS = tr.DurationS
			n := s.tracks[(i+1)%len(s.tracks)]
			np.Next = &Brief{n.Title, n.Artist}
			return np, true
		}
		pos -= d
	}
	return np, false // unreachable: pos < total
}

// Handler serves GET /radio/now.
func (s *Station) Handler(w http.ResponseWriter, _ *http.Request) {
	np, _ := s.At(time.Now())
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	_ = json.NewEncoder(w).Encode(np)
}

// PlaylistHandler serves GET /radio/playlist: the whole loop, for prev/next on the client.
func (s *Station) PlaylistHandler(w http.ResponseWriter, _ *http.Request) {
	type item struct {
		Title     string  `json:"title"`
		Artist    string  `json:"artist"`
		URL       string  `json:"url"`
		DurationS float64 `json:"duration_s"`
	}
	out := make([]item, 0, len(s.tracks))
	for _, t := range s.tracks {
		out = append(out, item{t.Title, t.Artist, "/static/radio/" + t.File, t.DurationS})
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	_ = json.NewEncoder(w).Encode(map[string]any{"tracks": out})
}

// oggDuration reads an Ogg Vorbis file: sample rate from the identification
// header, total samples from the granule position of the last page.
func oggDuration(fsys fs.FS, path string) (time.Duration, error) {
	b, err := fs.ReadFile(fsys, path)
	if err != nil {
		return 0, err
	}
	i := strings.Index(string(b[:min(len(b), 4096)]), "\x01vorbis")
	if i < 0 || i+16 > len(b) {
		return 0, errors.New("no vorbis header")
	}
	rate := binary.LittleEndian.Uint32(b[i+12 : i+16])
	last := strings.LastIndex(string(b), "OggS")
	if rate == 0 || last < 0 || last+14 > len(b) {
		return 0, errors.New("bad ogg")
	}
	granule := binary.LittleEndian.Uint64(b[last+6 : last+14])
	return time.Duration(float64(granule) / float64(rate) * float64(time.Second)), nil
}
