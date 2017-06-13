'use strict';

const kafka = require('kafka-node');
const restify = require('restify');

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
    if (points[userId] < 0) {
        // TODO: Add message to error topic if it's going to be 0 or less
        points[userId] = 0;
    }
    const symbol = messageObject.points > 0 ? '+' : '';
    metrics.gauge(`points.${messageObject.userId}`, `${symbol}${messageObject.points}`);
    log.info({ userId, mutation: messageObject.points, points: points[userId] }, 'Mutating user points');
});

// Server

const server = restify.createServer();
server.use(restify.bodyParser());

server.get('/points/:userId', function (req, res, next) {
    // TODO: Check later if I can use some npm link magic to externalize common modules like logging or metrics
    const userId = req.params.userId;
    log.debug({ userId }, 'Received request to get user points');
    if (!points[userId]) {
        res.send(404, {
            error: 'User not found'
        });
        return next();
    }
    res.send(200, {
        userId,
        points: points[userId]
    });
    next();
});

server.listen(9091, function() {
    log.info({ name: server.name, url: server.url }, 'Server listening');
});