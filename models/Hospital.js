const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Hospital = db.define('hospitals', {
id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
},
placeID : {
    type : Sequelize.STRING(1000)

},
photo: {
    type: Sequelize.STRING(512)
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