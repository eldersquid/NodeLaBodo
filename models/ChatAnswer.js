const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const ChatAnswer = db.define('chatanswer', {
    Answer: {
        type: Sequelize.STRING
    }

});

module.exports = ChatAnswer