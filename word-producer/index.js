'use strict';

const kafka = require('kafka-node');
const d20 = require('d20');
const loremIpsum = require('lorem-ipsum');

console.log('Starting up word-producer');

const Producer = kafka.Producer;
const client = new kafka.Client('zookeeper:2181', 'word-producer-client', {
    spinDelay: 1000,
    retries: 20
});

const producer = new Producer(client);

producer.on('ready', function () {
    console.log('Producer ready');
    setInterval(function () {
        const payloads = [{
            topic: 'Words',
            messages: [loremIpsum({
                count: d20.roll('1d8'),
                units: 'sentences',
                format: 'plain'
            })]
        }];
        producer.send(payloads, function (err, data) {
            if (err) {
                console.log('An error has occurred!');
                console.log(err);
            }
            console.log(`Word producer sent some data: ${JSON.stringify(data)}`);
        });
    }, 2000);
});

producer.on('error', function (err) {
    console.log('Producer error');
    console.log(err);
});