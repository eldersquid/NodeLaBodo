const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Supplier = db.define('supplier', {
    company_name: {
		type: Sequelize.STRING
	},
	uen_number: {
		type: Sequelize.STRING(1000)
	},
	email: {
		type: Sequelize.STRING
	},
	
	office_number: {
		type: Sequelize.STRING
	},
	product_name: {
		type: Sequelize.STRING
	}
});

module.exports = Supplier;
