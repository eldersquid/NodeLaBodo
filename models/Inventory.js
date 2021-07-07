const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Inventory = db.define('inventory', {
    item_name: {
        type: Sequelize.STRING
    },
    supplier: {
        type: Sequelize.STRING
    },
    product_name: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    selling_price: {
        type: Sequelize.INTEGER
    },
    cost_price: {
        type: Sequelize.INTEGER
    }
});

module.exports = Inventory;
