# Word Platform

A platform of Node.js services using Kafka.

## Running

Using [Docker Compose](https://docs.docker.com/compose/):

```
> docker-compose up
```

## Services

### Word producer

Creates sentences with random length and sends them to the topic `Words`.

### Word consumer

Listens to messages in the `Words` topic, transforms them into points,
and sends the points to the `Points` topic. Each word is one point.

### Points consumer

Listens to messages in the `Points` topic.

### Points spender

Listens to messages in the `Points` topic and eventually spends those
useless points in booze. It will send a mutation to the `Points` topic.

## Metrics

There's also a Grafana / Graphite image included as part of the project.

Log in with `admin` / `admin` to http://localhost:80, add a new data source pointing to Graphite
using the URL `http://localhost:8000`, and load the dashboard present in the folder `metrics/`.

## Kafka manager

Kafka manager is also running on port `9000`.