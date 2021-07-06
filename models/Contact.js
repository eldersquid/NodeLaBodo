const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Contact = db.define('contact', {
    contact_name: {
        type: Sequelize.STRING
    },
    contact_email: {
        type: Sequelize.STRING
    },
    contact_subject: {
        type: Sequelize.STRING
    },
    contact_message: {
        type: Sequelize.STRING
    },
});

module.exports = Contact