const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const FoodCart = db.define('FoodCart', {
    cardName: {
        type: Sequelize.STRING
    },
    cardPrice: {
        type: Sequelize.INTEGER
    },
    cardPhoto: {
        type: Sequelize.STRING(512)
    }
});

module.exports = FoodCart;