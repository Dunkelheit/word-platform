'use strict';

const kafka = require('kafka-node');

console.log('Starting up word-consumer');

const Producer = kafka.Producer;
const Consumer = kafka.Consumer;

const client = new kafka.Client('zookeeper:2181', 'word-consumer-client', {
    spinDelay: 1000,
    retries: 20
});

const producer = new Producer(client);
const consumer = new Consumer(client, [{ topic: 'Words', partition: 0}], { autoCommit: false });

let producerReady = false;

consumer.on('message', function (message) {
    console.log(`Word consumer received a message in the topic ${message.topic}: ${message.value}`);
    const points = message.value.split(' ').length;
    console.log(`Word consumer transforms the message into points: ${points}`);
    if (!producerReady) {
        console.log('Producer is not ready yet!');
    }
    const payloads = [{
        topic: 'Points',
        messages: [points]
    }];

    producer.send(payloads, function (err, data) {
        if (err) {
            console.log('An error has occurred!');
            console.log(err);
        }
        console.log(`Word consumer sent some transformed data: ${JSON.stringify(data)}`);
    });
});

producer.on('ready', function () {
    producerReady = true;
});