'use strict';

const bunyan = require('bunyan');
const lynx = require('lynx');
const kafka = require('kafka-node');

const config = require('./config');

const log = bunyan.createLogger({
    name: 'word-consumer',
    level: config.get('logging.level')
});

log.info('Starting up word-consumer');

const metrics = new lynx('metrics', 8125);

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
    const points = message.value.split(' ').length;
    log.debug({ points }, 'Word consumer transforms the message into points');
    if (!producerReady) {
        log.fatal('Producer is not ready yet!');
    }
    const payloads = [{
        topic: 'Points',
        messages: [points]
    }];

    producer.send(payloads, function (err, data) {
        metrics.increment('messages.sent.word-consumer');
        if (err) {
            log.error(err, 'An error has occurred!');
        }
        log.debug({ data }, 'Word consumer sent some transformed data');
    });
});

producer.on('ready', function () {
    producerReady = true;
    log.info('Producer is ready');
});