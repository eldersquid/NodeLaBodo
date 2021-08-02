const { admin } = require('googleapis/build/src/apis/admin');
const mySQLDB = require('./DBConfig');
// const user = require('../models/User');
// const admin = require('../models/Admin.js');
// const productcat = require('../models/Productcat.js');
// const supplier = require('../models/Supplier.js');
// const inventory = require('../models/Inventory.js');
// const order = require('../models/Order.js');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Hotel La Bodo database connected');
        })
        .then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            // user.hasMany(video);

            // Supplier
            // admin.hasMany(Supplier, {foreignKey: 'supplier_id'});
            // supplier.belongsTo(Admin, {foreignKey: 'supplier_id'});

            // supplier.hasMany(Productcat, {foreignKey: 'productcat_id'});
            // productcat.belongsTo(Supplier, {foreignKey: 'productcat_id'});

            // supplier.hasMany(Inventory, { foreignKey: 'inventory_id' });
            // inventory.belongsTo(Supplier, { foreignKey: 'inventory_id' });

            // // Inventory
            // admin.hasMany(Inventory, {foreignKey: 'inventory_id'});
            // inventory.belongsTo(Admin, {foreignKey: 'inventory_id'});

            // inventory.hasOne(Productcat, { foreignKey: 'productcat_id' });
            // productcat.belongsTo(Inventory, { foreignKey: 'productcat_id' });

            // inventory.hasOne(Supplier, { foreignKey: 'supplier_id' });
            // supplier.belongsTo(Inventory, { foreignKey: 'supplier_id' });

            // // Orders
            // admin.hasMany(Order, { foreignKey: 'order_id' });
            // order.belongsTo(Admin, { foreignKey: 'order_id' });

            // order.hasOne(Supplier, { foreignKey: 'supplier_id' });
            // supplier.belongsTo(Order, { foreignKey: 'supplier_id' });

            // order.hasOne(Inventory, { foreignKey: 'inventory_id' });
            // inventory.belongsTo(Order, { foreignKey: 'inventory_id' });

            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };