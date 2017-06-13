'use strict';

const d20 = require('d20');
const kafka = require('kafka-node');
const request = require('request');

const log = require('./log');
const metrics = require('./metrics');

log.info('Starting up points-spender');

const points = {};

const Consumer = kafka.Consumer;
const Producer = kafka.Producer;

const client = new kafka.Client('zookeeper:2181', 'points-spender-client', {
    spinDelay: 1000,
    retries: 20
});

const producer = new Producer(client);
const consumer = new Consumer(client, [{ topic: 'Points', partition: 0 }], { autoCommit: false });

consumer.on('message', function (message) {
    metrics.increment('messages.received.points-spender');
    log.debug({ topic: message.topic, message: message.value }, 'Points spender received a message');
    if (d20.roll(20) > 16) {
        const messageObject = JSON.parse(message.value);
        if (messageObject.points < 0) {
            return;
        }
        request.get(`http://points-consumer:9091/points/${messageObject.userId}`, function (err, res, body) {
            body = JSON.parse(body);
            const points = body.points;
            const payloadMessage = JSON.stringify({
                userId: messageObject.userId,
                points: -d20.roll(`1d${points}`)
            });
            producer.send([{
                topic: 'Points',
                messages: [payloadMessage]
            }], function (err, data) {
                metrics.increment('messages.sent.points-spender');
                if (err) {
                    log.error(err, 'An error has occurred!');
                }
                log.debug({ data, payloadMessage }, 'Points spender sent some data');
            });
        });
    }
});
