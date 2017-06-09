'use strict';

const kafka = require('kafka-node');

const log = require('./log');
const metrics = require('./metrics');

log.info('Starting up points-consumer');

const points = {};

const Consumer = kafka.Consumer;
const client = new kafka.Client('zookeeper:2181', 'points-consumer-client', {
    spinDelay: 1000,
    retries: 20
});

const consumer = new Consumer(client, [{ topic: 'Points', partition: 0 }], { autoCommit: false });

consumer.on('message', function (message) {
    metrics.increment('messages.received.points-consumer');
    log.debug({ topic: message.topic, message: message.value }, 'Points consumer received a message');
    const messageObject = JSON.parse(message.value);

    const userId = messageObject.userId;
    if (points[userId]) {
        points[userId] += messageObject.points;
    } else {
        points[userId] = messageObject.points;
    }
    metrics.gauge(`points.${messageObject.userId}`, `+${messageObject.points}`);
    log.info({ userId, mutation: messageObject.points, points: points[userId] }, 'Mutating user points');
});
