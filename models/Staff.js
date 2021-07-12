const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Staff = db.define('staff', {
    staff_name: {
        type: Sequelize.STRING
    },
    ID: {
        type: Sequelize.INTEGER
    },
    staff_email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
});

module.exports = Staff;