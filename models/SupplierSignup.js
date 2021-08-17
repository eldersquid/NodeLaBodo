const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const SupplierSignup = db.define('suppliersignup', {
    supplier_id: {
        type: Sequelize.STRING
    },
    company_name:{
        type: Sequelize.STRING
    },
    uen_number: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

module.exports = SupplierSignup;