.PHONY: gen build run dev test docker avatar
avatar:
	go run ./cmd/avatargen
gen:
	templ generate
build: gen
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/server ./cmd/server
run: build
	./bin/server
dev:
	air
test: gen
	go vet ./... && go test ./...
docker:
	docker build -t faalldev .
