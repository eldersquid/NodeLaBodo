const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Chatbot = db.define('chatbot', {
    Question: {
        type: Sequelize.STRING
    },
    Intent: {
        type: Sequelize.STRING
    },
    Answer: {
        type: Sequelize.STRING
    },
    
});

module.exports = Chatbot