const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const RoomType = require('../models/RoomType');

const Room = db.define('room', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    
    bookInDate: {
        type: Sequelize.DATEONLY
    },
    bookOutDate: {
        type: Sequelize.DATEONLY
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
    },
    nearbyHospital : {
        type : Sequelize.STRING
    }
});


module.exports = Room;
