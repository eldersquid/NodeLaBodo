const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const FoodGallery = db.define('FoodGallery', {
    foodPhoto: {
        type: Sequelize.STRING(512)
    }
});

module.exports = FoodGallery;