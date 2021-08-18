const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');
const ChatQuestion = require('../models/ChatQuestion');
const ChatAnswer = require('../models/ChatAnswer');

const Chatbot = db.define('chatbot', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    Intent: {
        type: Sequelize.STRING
    },
    IntentPath : {
        type : Sequelize.STRING

    },

    // DisplayName :{
    //     type : Sequelize.STRING

    // }
    
});

Chatbot.hasMany(ChatQuestion, {
    foreignKey : "IntentID",
    onDelete : "CASCADE",
    onUpdate : "CASCADE"

});

Chatbot.hasMany(ChatAnswer, {
    foreignKey : "IntentID",
    onDelete : "CASCADE",
    onUpdate : "CASCADE"

});

module.exports = Chatbot