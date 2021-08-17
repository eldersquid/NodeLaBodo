const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const PackageDeal = db.define('packagedeal', {
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
});

module.exports = PackageDeal;