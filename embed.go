// Package portfolio embeds the static assets and the writing into the binary
// so the deploy is a single file.
package portfolio

import "embed"

//go:embed static
var Static embed.FS

//go:embed content
var Content embed.FS
