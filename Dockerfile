FROM golang:1.23 AS build-stage
ARG VERSION=1.0.0

WORKDIR /app
ADD . .
RUN go mod download

COPY ./ ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /indicator

FROM build-stage AS run-test-stage
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
