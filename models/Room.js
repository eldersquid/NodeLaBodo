const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Room = db.define('room', {
    bookInDate: {
        type: Sequelize.DATEONLY
    },
    bookOutDate: {
        type: Sequelize.DATEONLY
    },
    roomType: {
        type: Sequelize.STRING
    },
    addItems: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    package_deal: {
        type: Sequelize.STRING
    },
    roomNo: {
        type: Sequelize.INTEGER
    },
    price : {
        type : Sequelize.FLOAT
    },
    paid : {
        type : Sequelize.BOOLEAN
    }
});

module.exports = Room;
