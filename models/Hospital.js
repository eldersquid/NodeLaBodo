const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Hospital = db.define('hospitals', {
photo: {
    type: Sequelize.BLOB("long")
},
hospitalName: {
type: Sequelize.STRING(2000)
},
address: {
type: Sequelize.STRING(2000)
},
contactNo: {
type: Sequelize.BIGINT
},
website: {
type: Sequelize.STRING(1000),
},
});
module.exports = Hospital;