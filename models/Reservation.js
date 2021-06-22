const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Reservation = db.define('reservation', {
    cust_name: {
        type: Sequelize.STRING
    },
    cust_email: {
        type: Sequelize.STRING
    },
    cust_phone: {
        type: Sequelize.STRING
    },
    number_guest: {
        type: Sequelize.STRING
    },
    cust_date: {
        type: Sequelize.STRING
    },
    cust_time: {
        type: Sequelize.STRING
    },
    cust_message: {
        type: Sequelize.STRING
    }
});

module.exports = Reservation