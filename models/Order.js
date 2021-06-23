const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Order = db.define('order', {
    item_name: {
        type: Sequelize.STRING
    },
    product_name: {
        type: Sequelize.STRING
    },
    supplier: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.STRING
    },
    remarks: {
        type: Sequelize.STRING
    }
});

module.exports = Order;
