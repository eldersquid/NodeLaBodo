const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Room = require('../models/Room');

const RoomType = db.define('roomType', {
    type_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING
    },
    roomImage: {
        type: Sequelize.STRING(512)
    },
    roomName: {
        type: Sequelize.STRING(2000)
        },
    description: {
        type: Sequelize.STRING(4000)
        },
    roomPrice: {
        type: Sequelize.INTEGER
    },
    minRoomNo: {
        type: Sequelize.INTEGER
    },
    maxRoomNo: {
        type: Sequelize.INTEGER
    }



});

RoomType.hasMany(Room, {
    foreignKey : "roomTypeID",
    onDelete : "CASCADE",
    onUpdate : "CASCADE"

});

module.exports = RoomType;
