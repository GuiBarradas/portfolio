// avatargen draws the pixel avatar (48x48, shown x4 with image-rendering:
// pixelated) into static/img/avatar.png, and the favicon (a 32x32 window on
// the face, before the hand is drawn) into static/img/favicon.png. Everything
// is rectangles and single pixels, so tweaking a feature is editing a line.
// Not part of the build.
//
//	go run ./cmd/avatargen   (or: make avatar)
package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"os"
)

const N = 48

var (
	O  = hex("0b0512") // outline, the site's slot-dark
	H  = hex("3a2a1e") // hair
	h  = hex("5a4430") // hair highlight
	d  = hex("241810") // hair shadow / part
	S  = hex("f2c8a2") // skin
	s  = hex("d9a57e") // skin shadow
	ss = hex("c08c68") // deep skin shadow (under the chin)
	b  = hex("eaa08e") // blush
	W  = hex("ffffff") // eye white
	I  = hex("5a3a22") // iris
	i2 = hex("3a2413") // iris, lower half
	P  = hex("120a06") // pupil
	E  = hex("2a1c12") // brows, moustache, beard
	Eh = hex("4a3423") // moustache highlight
	T  = hex("c9a07e") // stubble
	M  = hex("a86a5a") // mouth
	K  = hex("161616") // t-shirt
	G  = hex("3f5a3a") // jacket
	g  = hex("5b7a54") // jacket light / lapels
	D  = hex("2b3f28") // jacket dark
)

func hex(s string) (c color.NRGBA) {
	fmt.Sscanf(s, "%02x%02x%02x", &c.R, &c.G, &c.B)
	c.A = 255
	return c
}

var img = image.NewNRGBA(image.Rect(0, 0, N, N))

func px(x, y int, c color.NRGBA) {
	if x >= 0 && y >= 0 && x < N && y < N {
		img.SetNRGBA(x, y, c)
	}
}
func rect(x0, y0, x1, y1 int, c color.NRGBA) {
	for y := y0; y <= y1; y++ {
		for x := x0; x <= x1; x++ {
			px(x, y, c)
		}
	}
}
func row(y, x0, x1 int, c color.NRGBA) { rect(x0, y, x1, y, c) }

// outline paints O on every transparent pixel that touches a painted one.
func outline() {
	var todo [][2]int
	for y := 0; y < N; y++ {
		for x := 0; x < N; x++ {
			if img.NRGBAAt(x, y).A != 0 {
				continue
			}
			for _, n := range [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}} {
				nx, ny := x+n[0], y+n[1]
				if nx >= 0 && ny >= 0 && nx < N && ny < N && img.NRGBAAt(nx, ny).A != 0 && img.NRGBAAt(nx, ny) != O {
					todo = append(todo, [2]int{x, y})
					break
				}
			}
		}
	}
	for _, p := range todo {
		px(p[0], p[1], O)
	}
}

func head() {
	// skin, with the jaw tapering into the chin
	rect(16, 12, 37, 30, S)
	row(31, 17, 36, S)
	row(32, 18, 35, S)
	row(33, 20, 33, S)
	row(34, 22, 31, S)
	rect(16, 13, 16, 30, s) // shadow side of the face
	row(12, 17, 36, s)      // shadow under the fringe
	rect(38, 19, 39, 23, S) // ear
	rect(38, 20, 38, 22, s)

	// hair: a cap with a side part on the left and a quiff swept to the right
	row(2, 29, 33, H)
	row(3, 25, 35, H)
	row(4, 21, 37, H)
	row(5, 19, 38, H)
	row(6, 18, 39, H)
	rect(16, 7, 40, 10, H)
	row(11, 16, 41, H)
	row(12, 26, 41, H) // fringe over the right side of the forehead
	row(13, 30, 41, H)
	row(14, 33, 40, H)
	row(15, 35, 39, H)
	row(16, 37, 38, H)
	rect(16, 12, 17, 17, H) // short left side
	rect(36, 12, 37, 20, H) // right side, down to the ear
	rect(22, 4, 22, 9, d)   // the part
	row(11, 16, 25, d)      // dark under the cap on the left
	rect(26, 12, 28, 13, d) // underside of the fringe
	row(4, 24, 27, h)       // strands following the sweep
	row(5, 26, 30, h)
	row(6, 29, 33, h)
	row(7, 32, 36, h)
	row(6, 19, 20, h)
	row(7, 21, 23, h)
	row(8, 24, 27, h)
	row(9, 28, 31, h)
	row(10, 32, 36, h)
	row(12, 34, 38, h)
	row(8, 38, 39, h)
	px(41, 10, H) // a flyaway strand
	px(42, 9, H)

	// brows: the open eye's is flatter, the winking one arches up
	row(16, 18, 23, E)
	row(15, 19, 23, E)
	px(17, 17, E)
	row(14, 30, 33, E)
	row(15, 29, 34, E)
	px(28, 16, E)
	px(35, 16, E)

	// open eye
	row(18, 18, 22, E) // lid
	px(17, 19, E)
	px(23, 19, E)
	rect(18, 19, 22, 20, W)
	row(21, 19, 21, W)
	rect(20, 19, 21, 19, I)
	rect(20, 20, 21, 21, i2)
	px(21, 20, P)
	px(20, 19, W) // glint
	row(22, 19, 21, s)
	// wink: a happy arc
	px(28, 19, E)
	px(34, 19, E)
	px(29, 20, E)
	px(33, 20, E)
	row(21, 30, 32, E)

	// nose and blush
	rect(26, 20, 26, 23, s)
	px(25, 23, s)
	px(27, 23, s)
	px(26, 24, s)
	rect(17, 22, 19, 23, b)
	rect(34, 22, 36, 23, b)

	// the handlebar moustache, with a dip in the middle and the ends curling up
	px(18, 24, E)
	px(35, 24, E)
	row(25, 19, 20, E)
	row(25, 33, 34, E)
	row(25, 22, 25, E)
	row(25, 28, 31, E)
	rect(20, 26, 33, 27, E)
	row(28, 20, 23, E)
	row(28, 30, 33, E)
	row(25, 23, 24, Eh)
	row(25, 29, 30, Eh)
	px(21, 26, Eh)
	px(32, 26, Eh)

	// mouth, soul patch, goatee, stubble
	row(29, 24, 29, M)
	rect(26, 30, 27, 31, E)
	row(32, 24, 29, E)
	row(33, 25, 28, E)
	row(34, 26, 27, E)
	rect(17, 29, 19, 31, T)
	rect(34, 29, 36, 31, T)
	row(32, 18, 23, T)
	row(32, 30, 35, T)
	row(33, 20, 24, T)
	row(33, 29, 33, T)
	row(34, 22, 25, T)
	row(34, 28, 31, T)
}

func body() {
	// neck, darker right under the chin
	rect(22, 35, 31, 38, s)
	row(35, 23, 30, ss)
	// jacket: standing collar, shoulders, lapels folding down and out, folds
	rect(17, 32, 20, 36, D)
	rect(33, 32, 36, 36, D)
	row(33, 12, 16, G)
	row(33, 37, 41, G)
	row(34, 10, 17, G)
	row(34, 36, 43, G)
	rect(7, 35, 18, 47, G)
	rect(35, 35, 46, 47, G)
	row(35, 10, 15, g) // light on the shoulders
	row(35, 38, 43, g)
	rect(19, 35, 20, 36, g) // lapels
	rect(18, 37, 19, 39, g)
	rect(17, 40, 18, 42, g)
	rect(33, 35, 34, 36, g)
	rect(34, 37, 35, 39, g)
	rect(35, 40, 36, 42, g)
	rect(7, 43, 8, 47, D) // folds
	rect(45, 43, 46, 47, D)
	px(12, 44, D)
	px(13, 45, D)
	px(14, 46, D)
	px(41, 44, D)
	px(40, 45, D)
	px(39, 46, D)
	// t-shirt with a round neckline
	row(36, 19, 20, K)
	row(36, 33, 34, K)
	row(37, 19, 21, K)
	row(37, 32, 34, K)
	row(38, 19, 22, K)
	row(38, 31, 34, K)
	rect(19, 39, 34, 47, K)
	row(38, 23, 30, ss)
}

// hand draws the peace sign in front of the left cheek. Called twice: first
// with c set to paint a 1px outline around every shape, then for real.
func hand(outlineOnly bool) {
	shapes := [][4]int{
		{9, 12, 10, 15}, {10, 16, 11, 19}, // index finger, leaning out
		{14, 11, 15, 14}, {13, 15, 14, 18}, // middle finger
		{9, 19, 15, 26}, // palm
		{8, 21, 9, 25},  // thumb
	}
	if outlineOnly {
		for _, r := range shapes {
			rect(r[0]-1, r[1]-1, r[2]+1, r[3]+1, O)
		}
		return
	}
	for _, r := range shapes {
		rect(r[0], r[1], r[2], r[3], S)
	}
	px(11, 14, s) // finger shading
	px(11, 15, s)
	px(15, 14, s)
	px(15, 15, s)
	rect(13, 20, 16, 24, s) // folded ring and little fingers
	px(14, 20, S)           // knuckles catching light
	px(16, 21, S)
	px(12, 19, O) // the gap between the two raised fingers
	px(12, 18, O)
	rect(8, 22, 9, 25, s) // thumb across the palm
	px(8, 21, S)
	row(27, 8, 14, D) // cuff
	row(28, 7, 14, D)
	rect(4, 29, 12, 34, G) // sleeve
	rect(4, 35, 8, 36, G)
	row(29, 5, 11, g)
}

func main() {
	head()
	body()
	outline()

	// favicon: just the face, no hand, on the site's panel colour
	fav := image.NewNRGBA(image.Rect(0, 0, 32, 32))
	bg := color.NRGBA{0x1e, 0x10, 0x30, 255}
	for y := 0; y < 32; y++ {
		for x := 0; x < 32; x++ {
			c := img.NRGBAAt(x+11, y+3)
			if c.A == 0 {
				c = bg
			}
			fav.SetNRGBA(x, y, c)
		}
	}
	write("static/img/favicon.png", fav)

	hand(true)
	hand(false)
	outline()
	write("static/img/avatar.png", img)
}

func write(path string, m image.Image) {
	f, err := os.Create(path)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	if err := png.Encode(f, m); err != nil {
		log.Fatal(err)
	}
	b := m.Bounds()
	log.Printf("wrote %s (%dx%d)", path, b.Dx(), b.Dy())
}
