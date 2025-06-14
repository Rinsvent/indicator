FROM node:18.19.1-alpine3.19 AS frontend-stage
WORKDIR /app
ADD ./web .
RUN npm install
RUN npm run build

FROM golang:1.24 AS backend-stage
ARG VERSION=1.0.0

WORKDIR /app
ADD . .
COPY --from=frontend-stage /app/out /app/web/out
RUN go mod download

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/golangci-lint \
    CGO_ENABLED=0 GOOS=linux go build -o /indicator

FROM alpine:3.18 AS run-test-stage
WORKDIR /
COPY --from=backend-stage /indicator /indicator
#RUN go test -v ./...

#RUN --mount=type=cache,target=/go/pkg/mod \
#    --mount=type=cache,target=/root/.cache/golangci-lint \
#    cd ws && \
#    make install_go && \
#    make lint && \
#    make run_test && \
#    make check_coverage && \
#    make RELEASE=$VERSION build

CMD ["/indicator", "server:start"]
