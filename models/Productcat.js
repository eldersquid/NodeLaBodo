const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* 	Creates a user(s) table in MySQL Database. 
    Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Productcat = db.define('productcat', {
    product_name: {
        type: Sequelize.STRING
    }
});

module.exports = Productcat;