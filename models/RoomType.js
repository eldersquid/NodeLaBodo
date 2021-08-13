const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

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

module.exports = RoomType;
