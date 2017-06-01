'use strict';

const bunyan = require('bunyan');
const lynx = require('lynx');
const kafka = require('kafka-node');

const config = require('./config');

const log = bunyan.createLogger({
    name: 'points-consumer',
    level: config.get('logging.level')
});

log.info('Starting up points-consumer');

const metrics = new lynx('metrics', 8125);

const Consumer = kafka.Consumer;
const client = new kafka.Client('zookeeper:2181', 'points-consumer-client', {
    spinDelay: 1000,
    retries: 20
});

const consumer = new Consumer(client, [{ topic: 'Points', partition: 0 }], { autoCommit: false });

consumer.on('message', function (message) {
    metrics.increment('messages.received.points-consumer');
    log.debug({ topic: message.topic, message: message.value }, 'Points consumer received a message');
});
