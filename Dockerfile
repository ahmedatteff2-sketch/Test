# Multi-stage build for the single merged service: the Next.js front-end is
# built to a static export, embedded into the Go binary, and served by the Go
# server alongside /api. The result is one small image — just the binary.
#
# Build from the repo root:  docker build -t eagle-coaching .

# ── Stage 1: build the front-end static export (apps/web → out/) ──────────────
FROM node:22-alpine AS web
WORKDIR /app/apps/web
# Install deps first (layer-cached until package.json changes).
COPY apps/web/package.json ./
RUN npm install
COPY apps/web/ ./
# `output: "export"` (next.config.ts) emits a fully static site to ./out
RUN npm run build

# ── Stage 2: build the Go binary with the export embedded ─────────────────────
FROM golang:1.26-alpine AS api
WORKDIR /src
# Download modules first (layer-cached until go.mod/go.sum change).
COPY apps/api/go.mod apps/api/go.sum ./
RUN go mod download
COPY apps/api/ ./
# Drop in the real front-end build so //go:embed all:dist bundles it into the
# binary (this overwrites the committed placeholder in internal/web/dist).
COPY --from=web /app/apps/web/out ./internal/web/dist
# Static binary (CGO off) so it runs on a minimal Alpine image.
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/server ./cmd/server

# ── Stage 3: minimal runtime ──────────────────────────────────────────────────
FROM alpine:3.20
# CA certs for the TLS connection to the managed PostgreSQL database.
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=api /bin/server /app/server
# Render injects PORT and overrides this; 8080 is the local/default fallback.
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/server"]
