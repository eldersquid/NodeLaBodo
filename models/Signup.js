const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Reservation = db.define('reservation', {
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
    points: {
        type: Sequelize.INTEGER
    },
});

module.exports = Signup