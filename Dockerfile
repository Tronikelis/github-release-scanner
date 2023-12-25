FROM node:20-alpine as frontend
WORKDIR /app

COPY . .
WORKDIR /app/client

RUN npm ci && npm run build

RUN rm -rf node_modules





FROM golang:1.21-alpine as backend

WORKDIR /
COPY --from=frontend . .

WORKDIR /app

RUN go mod download
RUN go build -o ./server-out

CMD [ "./server-out" ]

