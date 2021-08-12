const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const alertMessage = require('../helpers/messenger');


router.get('/view', async (req, res) => {
    const title = 'Inventory';

    const getInventoryData = () => {
        const inventory = Inventory.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['inventory_id', 'ASC']
            ],
            raw: true
        })
        return inventory
    };
    
    res.render('inventory/view', {
        layout: "admin",
        title: title,
        inventory: await getInventoryData()
    });
});

router.get('/showCreate', async (req, res) => {
    const title = 'Inventory';

    const getSupplierData = () => {
        const supplier = Supplier.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['supplier_id', 'ASC']
            ],
            raw: true
        })
        return supplier
    };

    res.render('inventory/create', {
        layout: "admin",
        title: title,
        supplier: await getSupplierData()
    });

});

router.post('/create', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let quantity = req.body.quantity;
    let selling_price = req.body.selling_price;
    let cost_price = req.body.cost_price;

    Inventory.findOne({
        where: {
            item_name,
            supplier
        }
    }).then(inventory => {
        if (inventory) {
            const title = 'Inventory';
            res.render('inventory/create', {
                layout: "admin",
                title: title,
                error: alertMessage(res, 'danger', ' ' + inventory.item_name + ' supplied by ' + inventory.supplier + ' is already in inventory.', 'fas fa-exclamation-circle', true)
            })

        } else {
            Inventory.create({
                item_name,
                supplier,
                quantity,
                selling_price,
                cost_price
            }).then(inventory => {
                alertMessage(res, 'success', ' ' + inventory.item_name + ' supplied by ' + inventory.supplier + ' has been added.', 'fas fa-sign-in-alt', true);
                res.redirect('/inventory/view');
            }).catch(err => console.log(err))
        }
    })
});

router.get('/showUpdate/:inventory_id/:quantity', (req, res) => {
    const title = 'Inventory';

    Inventory.findOne({
        where: {
            inventory_id: req.params.inventory_id
        },
        raw: true
    }).then((inventory) => {
        if (!inventory) {
            alertMessage(res, 'info', 'No such item', 'fas fa-exclamation-circle', true);
            res.redirect('/inventory/view');
        } else {
            // Only authorised admin who is owner of inventory can edit it
            // if (req.admin.id === inventory.adminId) {
            //     checkOptions(inventory);
            res.render('inventory/update', { 
                layout: "admin",
                title: title,
                inventory
            })
            .catch(err => console.log(err));

            // } else {
            //     alertMessage(res, 'danger', 'Unauthorised access to Inventory', 'fas fa-exclamation-circle', true);
            //     res.redirect('/logout');
            // }
        }
    }).catch(err => console.log(err));
});

router.put('/update/:inventory_id/:quantity', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let updateQuantity = parseInt(req.body.quantity);
    let currQuantity = parseInt(req.params.quantity);
    var quantity = updateQuantity + currQuantity;
    let selling_price = req.body.selling_price;
    let cost_price = req.body.cost_price;
    

    Inventory.update({
        item_name,
        supplier,
        quantity,
        selling_price,
        cost_price
    }, {
        where: {
            inventory_id: req.params.inventory_id
        }
    }).then((inventory) => {
        alertMessage(res, 'success', ' ' + inventory.item_name + ' supplied by ' + inventory.supplier + ' has been updated.', 'fas fa-sign-in-alt', true);
        res.redirect('/inventory/view');
    }).catch(err => console.log(err));
});

router.post('/delete/:inventory_id', (req, res) => {
    let inventory_id = req.params.inventory_id;
    // let adminId = req.admin.id;
    // Select * from inventory where inventory.id=inventoryID and inventory.adminId=adminID
    Inventory.findOne({
        where: {
            inventory_id,
            // adminId: adminId
        },
        // attributes: ['id', 'adminId']
        attributes: ['inventory_id']
    }).then((inventory) => {
        // if record is found, admin is owner of inventory
        if (inventory != null) {
            Inventory.destroy({
                where: {
                    inventory_id
                }
            }).then(() => {
                alertMessage(res, 'info', 'Item has been deleted', 'far fa-trash-alt', true);
                res.redirect('/inventory/view'); // To retrieve all inventory again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Inventory', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

module.exports = router;