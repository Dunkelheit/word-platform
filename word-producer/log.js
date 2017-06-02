'use strict';

const bunyan = require('bunyan');

const config = require('./config');

const log = bunyan.createLogger({
    name: 'word-producer',
    level: config.get('logging.level')
});

module.exports = log;