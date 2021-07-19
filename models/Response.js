const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Response = db.define('response', {
    toEmail: {
        type: Sequelize.STRING
    },
    toSubject: {
        type: Sequelize.STRING
    },
    toMessage: {
        type: Sequelize.STRING
    },
});

module.exports = Response