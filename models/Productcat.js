const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Productcat = db.define('productcat', {
    product_name: {
        type: Sequelize.STRING
    }
});

module.exports = Productcat;
