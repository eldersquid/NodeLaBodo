const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Orders = db.define('orders', {
    orders_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    item_name: {
        type: Sequelize.STRING
    },
    supplier: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    remarks: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    }
});

module.exports = Orders;
