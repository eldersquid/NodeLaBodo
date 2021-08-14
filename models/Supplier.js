const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Supplier = db.define('supplier', {
	supplier_id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
		allowNull: false
	},
    company_name: {
		type: Sequelize.STRING
	},
	uen_number: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	},
	office_number: {
		type: Sequelize.STRING
	}
});

module.exports = Supplier;
