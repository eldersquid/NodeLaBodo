const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Supplier = db.define('supplier', {
    company_name: {
		type: Sequelize.STRING
	},
	uen_number: {
		type: Sequelize.INTEGER
	},
	email: {
		type: Sequelize.STRING
	},
	office_number: {
		type: Sequelize.STRING
	},
	product_name: {
		type: Sequelize.JSON
	}
});

module.exports = Supplier;
