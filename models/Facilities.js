const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Facilities = db.define('facilities', {
    fac_date: {
        type: Sequelize.STRING
    },
    fac_name: {
        type: Sequelize.STRING
    },
    fac_email: {
        type: Sequelize.STRING
    },
    fac_num: {
        type: Sequelize.STRING
    },
    fac_type: {
        type: Sequelize.STRING
    },
    fac_time: {
        type: Sequelize.STRING
    }
});

module.exports = Facilities;
