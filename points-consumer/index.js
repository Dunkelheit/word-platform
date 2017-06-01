'use strict';

const lynx = require('lynx');
const kafka = require('kafka-node');

console.log('Starting up points-consumer');

const metrics = new lynx('metrics', 8125);

const Consumer = kafka.Consumer;
const client = new kafka.Client('zookeeper:2181', 'points-consumer-client', {
    spinDelay: 1000,
    retries: 20
});

const consumer = new Consumer(client, [{ topic: 'Points', partition: 0 }], { autoCommit: false });

consumer.on('message', function (message) {
    metrics.increment('messages.received.points-consumer');
    console.log(`Points consumer received a message in the topic ${message.topic}: ${message.value}`);
});
