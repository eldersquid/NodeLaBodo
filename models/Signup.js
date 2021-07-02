const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Signup = db.define('signup', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    phone_num: {
        type: Sequelize.INTEGER
    },
    password: {
        type: Sequelize.STRING
    },
    package_deal: {
        type: Sequelize.STRING
    },
});

module.exports = Signup;