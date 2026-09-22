package radio

import (
	"encoding/binary"
	"testing"
	"testing/fstest"
	"time"
)

func station(tracks ...Track) *Station {
	s := &Station{tracks: tracks}
	for _, t := range tracks {
		s.total += time.Duration(t.DurationS * float64(time.Second))
	}
	return s
}

func TestScheduleIsAFunctionOfTime(t *testing.T) {
	s := station(
		Track{Title: "a", File: "a.ogg", DurationS: 10},
		Track{Title: "b", File: "b.ogg", DurationS: 20},
	)
	cases := []struct {
		at     time.Duration
		title  string
		offset float64
	}{
		{0, "a", 0},
		{5 * time.Second, "a", 5},
		{10 * time.Second, "b", 0},
		{29*time.Second + 900*time.Millisecond, "b", 19.9},
		{30 * time.Second, "a", 0},
		{95 * time.Second, "a", 5},              // 3 full loops + 5s
		{-5 * time.Second, "b", 15},             // before epoch still lands somewhere sane
		{24*time.Hour + 12*time.Second, "b", 2}, // a day later: 86412 % 30 == 12
	}
	for _, c := range cases {
		np, ok := s.At(Epoch.Add(c.at))
		if !ok {
			t.Fatalf("at %v: station silent", c.at)
		}
		if np.Title != c.title || abs(np.OffsetS-c.offset) > 1e-6 {
			t.Errorf("at %v: got %s@%.3f, want %s@%.3f", c.at, np.Title, np.OffsetS, c.title, c.offset)
		}
		if np.Next == nil {
			t.Errorf("at %v: no next track", c.at)
		}
	}
}

func TestSilentStation(t *testing.T) {
	np, ok := station().At(time.Now())
	if ok || np.URL != "" || np.Tracks != 0 {
		t.Fatalf("empty station should be silent, got %+v", np)
	}
}

// A fake Ogg Vorbis: first page with an identification header at 44100 Hz,
// last page whose granule position is 3 s worth of samples.
func fakeOgg() []byte {
	page := func(granule uint64) []byte {
		p := []byte("OggS\x00\x02")
		p = append(p, make([]byte, 8)...)
		binary.LittleEndian.PutUint64(p[6:], granule)
		return append(p, make([]byte, 13)...) // serial, seq, crc, 0 segments
	}
	ident := append([]byte("\x01vorbis\x00\x00\x00\x00\x02"), 0x44, 0xac, 0, 0) // version, channels, rate 44100
	b := append(page(0), ident...)
	return append(b, page(3*44100)...)
}

func TestLoadSkipsMissingAndReadsOggDuration(t *testing.T) {
	fsys := fstest.MapFS{
		"static/radio/playlist.json": {Data: []byte(`{"tracks":[
			{"title":"one","file":"one.ogg"},
			{"title":"gone","file":"gone.ogg"},
			{"title":"nodur","file":"raw.bin"}
		]}`)},
		"static/radio/one.ogg": {Data: fakeOgg()},
		"static/radio/raw.bin": {Data: []byte("not audio")},
	}
	s := Load(fsys)
	if len(s.tracks) != 1 || s.tracks[0].DurationS != 3 {
		t.Fatalf("want just 'one' at 3s, got %+v", s.tracks)
	}
	np, _ := s.At(Epoch.Add(500 * time.Millisecond))
	if np.URL != "/static/radio/one.ogg" {
		t.Errorf("url: %s", np.URL)
	}
}

func abs(f float64) float64 {
	if f < 0 {
		return -f
	}
	return f
}
