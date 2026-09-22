FROM golang:1.24-alpine AS build
WORKDIR /src
RUN go install github.com/a-h/templ/cmd/templ@v0.2.747
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN templ generate && CGO_ENABLED=0 go build -ldflags="-s -w" -o /server ./cmd/server

FROM scratch
COPY --from=build /server /server
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/server"]
