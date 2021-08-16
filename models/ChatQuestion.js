const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const ChatQuestion = db.define('chatquestion', {
    Question: {
        type: Sequelize.STRING
    }
    
});

module.exports = ChatQuestion