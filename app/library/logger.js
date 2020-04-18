import bunyan from 'bunyan';

const log = bunyan.createLogger({
    name: process.env.LOGGER_NAME || 'resourceguruapp',
    project_namespace: 'resourceguruapp',
    src: true,
    streams: [{
        type: 'file',
        path: './logs/error.log',
        period: '1d', // daily rotation
        count: 3, // keep 3 back copies
    },
    ],
});

module.exports = log;
