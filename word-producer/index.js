'use strict';

const _ = require('lodash');
const d20 = require('d20');
const loremIpsum = require('lorem-ipsum');
const kafka = require('kafka-node');
const restify = require('restify');

const log = require('./log');
const metrics = require('./metrics');

const USER_IDS = ['user1', 'user2', 'user3', 'user4', 'user5'];

log.info('Starting up word-producer');

const Producer = kafka.Producer;
const client = new kafka.Client('zookeeper:2181', 'word-producer-client', {
    spinDelay: 1000,
    retries: 20
});

const producer = new Producer(client);

let messageRate = 500;
let intervalHandlerId;

function intervalHandler() {
    const payloadMessage = JSON.stringify({
        message: loremIpsum({
            count: d20.roll('1d8'),
            units: 'sentences',
            format: 'plain'
        }),
        userId: _.sample(USER_IDS)
    });
    const payloads = [{
        topic: 'Words',
        messages: [payloadMessage]
    }];
    producer.send(payloads, function (err, data) {
        metrics.increment('messages.sent.word-producer');
        if (err) {
            log.error(err, 'An error has occurred!');
        }
        log.debug({ data, payloadMessage },'Word producer sent some data');
    });
}

producer.on('ready', function () {
    log.info('Producer ready');
    intervalHandlerId = setInterval(intervalHandler, messageRate);
});

producer.on('error', function (err) {
    log.error(err, 'Producer error');
});

// Server

const server = restify.createServer();
server.use(restify.bodyParser());

server.post('/messages/rate', function (req, res, next) {
    log.info({ body: req.body }, 'Received request to set new message rate');
    messageRate = parseInt(req.body.rate, 10);
    clearTimeout(intervalHandlerId);
    intervalHandlerId = setInterval(intervalHandler, messageRate);
    res.send(200, { messageRate });
    next();
});

server.listen(9091, function() {
    log.info({ name: server.name, url: server.url }, 'Server listening');
});