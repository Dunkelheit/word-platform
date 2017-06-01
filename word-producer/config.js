'use strict';

const convict = require('convict');

const config = convict({
    logging: {
        level: {
            doc: 'The bunyan logging level to use',
            format: String,
            default: 'INFO',
            env: 'LOGGING'
        }
    }
});

config.validate({allowed: 'strict'});

module.exports = config;
