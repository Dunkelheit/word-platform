# Word Platform

A platform of Node.js services using Kafka.

![screen shot 2017-06-13 at 15 05 23](https://user-images.githubusercontent.com/448131/27083768-e7f4c4a4-5049-11e7-9573-40a8df7ff47a.png)

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