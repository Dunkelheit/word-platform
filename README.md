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

## Example output

```
word-consumer_1    | Word consumer received a message in the topic Words: Ullamco consequat quis deserunt minim sint aliquip et. Ullamco sit aliqua ipsum exercitation irure sit Lorem aliqua veniam ipsum.
word-consumer_1    | Word consumer transforms the message into points: 19
points-consumer_1  | Points consumer received a message in the topic Points: 19
word-consumer_1    | Word consumer sent some transformed data: {"Points":{"0":0}}
word-producer_1    | Word producer sent some data: {"Words":{"0":0}}
word-consumer_1    | Word consumer received a message in the topic Words: Reprehenderit non sit esse proident ipsum magna. Qui do ipsum elit veniam elit. Qui eu in veniam adipisicing id ipsum officia occaecat labore nisi. Tempor qui incididunt ipsum eiusmod non aute non voluptate. Sint veniam reprehenderit exercitation excepteur est veniam esse consectetur pariatur. Adipisicing ipsum id irure incididunt mollit.
word-consumer_1    | Word consumer transforms the message into points: 49
word-producer_1    | Word producer sent some data: {"Words":{"0":1}}
points-consumer_1  | Points consumer received a message in the topic Points: 49
word-consumer_1    | Word consumer sent some transformed data: {"Points":{"0":1}}
word-consumer_1    | Word consumer received a message in the topic Words: Exercitation dolore enim tempor aliquip amet ex adipisicing officia proident aute. Amet enim laborum enim enim labore nisi anim qui incididunt. Velit laboris qui excepteur proident est in qui commodo commodo.
word-consumer_1    | Word consumer transforms the message into points: 31
word-producer_1    | Word producer sent some data: {"Words":{"0":2}}
points-consumer_1  | Points consumer received a message in the topic Points: 31
word-consumer_1    | Word consumer sent some transformed data: {"Points":{"0":2}}
word-producer_1    | Word producer sent some data: {"Words":{"0":3}}
word-consumer_1    | Word consumer received a message in the topic Words: Labore nisi sint esse Lorem ex minim in excepteur amet est ad et. Velit amet proident esse do nostrud sint amet nostrud aliqua esse consequat. Anim id esse consectetur fugiat dolore. Sit quis esse excepteur veniam. Commodo sint voluptate aliquip dolor in consectetur. Ea ut incididunt non non nisi ad sit. Ex reprehenderit velit nostrud officia eiusmod proident nisi labore duis excepteur dolor.
word-consumer_1    | Word consumer transforms the message into points: 63
points-consumer_1  | Points consumer received a message in the topic Points: 63
word-consumer_1    | Word consumer sent some transformed data: {"Points":{"0":3}}
```