const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Signup = db.define('Signup', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    phone_num: {
        type: Sequelize.INTEGER
    },
    package_deal: {
        type: Sequelize.STRING
    },
});

module.exports = Signup