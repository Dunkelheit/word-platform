'use strict';

const d20 = require('d20');
const loremIpsum = require('lorem-ipsum');
const lynx = require('lynx');
const kafka = require('kafka-node');
const restify = require('restify');

console.log('Starting up word-producer');

const metrics = new lynx('metrics', 8125);

const Producer = kafka.Producer;
const client = new kafka.Client('zookeeper:2181', 'word-producer-client', {
    spinDelay: 1000,
    retries: 20
});

const producer = new Producer(client);

let messageRate = 200;
let intervalHandlerId;

function intervalHandler() {
    const payloads = [{
        topic: 'Words',
        messages: [loremIpsum({
            count: d20.roll('1d8'),
            units: 'sentences',
            format: 'plain'
        })]
    }];
    producer.send(payloads, function (err, data) {
        metrics.increment('messages.sent.word-producer');
        if (err) {
            console.log('An error has occurred!');
            console.log(err);
        }
        console.log(`Word producer sent some data: ${JSON.stringify(data)}`);
    });
}

producer.on('ready', function () {
    console.log('Producer ready');
    intervalHandlerId = setInterval(intervalHandler, messageRate);
});

producer.on('error', function (err) {
    console.log('Producer error');
    console.log(err);
});

const server = restify.createServer();
server.use(restify.bodyParser());

server.post('/messages/rate', function (req, res, next) {
    console.log('Received request to set new message rate');
    console.log(req.body);
    messageRate = parseInt(req.body.rate, 10);
    clearTimeout(intervalHandlerId);
    intervalHandlerId = setInterval(intervalHandler, messageRate);
    res.send(200, { messageRate });
    next();
});

server.listen(9091, function() {
    console.log('%s listening at %s', server.name, server.url);
});