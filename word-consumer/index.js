'use strict';

const kafka = require('kafka-node');

const log = require('./log');
const metrics = require('./metrics');

log.info('Starting up word-consumer');

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
    metrics.increment('messages.received.word-consumer');
    log.debug({ topic: message.topic, message: message.value }, 'Word consumer received a message');
    const messageObject = JSON.parse(message.value);
    const points = messageObject.message.split(' ').length;
    const userId = messageObject.userId;
    log.debug({ points, userId }, 'Word consumer transforms the message into points');
    if (!producerReady) {
        log.fatal('Producer is not ready yet!');
    }
    const payloadMessage = JSON.stringify({
        points,
        userId
    });
    const payloads = [{
        topic: 'Points',
        messages: [payloadMessage]
    }];

    producer.send(payloads, function (err, data) {
        metrics.increment('messages.sent.word-consumer');
        if (err) {
            log.error(err, 'An error has occurred!');
        }
        log.debug({ data, payloadMessage }, 'Word consumer sent some transformed data');
    });
});

producer.on('ready', function () {
    producerReady = true;
    log.info('Producer is ready');
});