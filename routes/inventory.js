const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const alertMessage = require('../helpers/messenger.js');

// router.get('/view', (req, res) => {
//     const title = 'Inventory';

//     res.render('inventory/view', {
//         layout: "admin",
//         title: title
//     });

// });

router.get('/view', (req, res) => {
    const title = 'Inventory';
    Inventory.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((inventory) => {
            // pass object to listInventory.handlebar
            res.render('inventory/view', {
                layout: "admin",
                title: title,
                inventory: inventory
            });
        })
        .catch(err => console.log(err));
});

router.get('/showCreate', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/create', {
        layout: "admin",
        title: title
    });
});

router.post('/create', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let product_name = req.body.product_name;
    let quantity = req.body.quantity;

    Inventory.create({
        item_name,
        supplier,
        product_name,
        quantity
    }).then((inventory) => {
        res.redirect('/inventory/view');
    }).catch(err => console.log(err))
});

router.get('/showUpdate/:id', (req, res) => {
    Inventory.findOne({
        where: {
            id: req.params.id
        }
    }).then((inventory) => {
        if (!inventory) { // check inventory first because it could be null.
            alertMessage(res, 'info', 'No such Inventory', 'fas fa-exclamation-circle', true);
            res.redirect('/inventory/view');
        } else {
            // Only authorised admin who is owner of inventory can edit it
            if (req.admin.id === inventory.adminId) {
                checkOptions(inventory);
                res.render('inventory/update', { // call views/inventory/editInventory.handlebar to render the edit inventory page
                    inventory
                });
            } else {
                alertMessage(res, 'danger', 'Unauthorised access to Inventory', 'fas fa-exclamation-circle', true);
                res.redirect('/logout');
            }
        }
    }).catch(err => console.log(err)); // To catch no inventory ID
});

router.put('/update/:id', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let product_name = req.body.product_name;
    let quantity = req.body.quantity;

    Inventory.update({
        item_name,
        supplier,
        product_name,
        quantity
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/inventory/view'); // redirect to call router.get(/listInventory...) to retrieve all updated
        // inventory
    }).catch(err => console.log(err));
});

router.get('/delete/:id', (req, res) => {
    let inventoryId = req.params.id;
    // let adminId = req.admin.id;
    // Select * from inventory where inventory.id=inventoryID and inventory.adminId=adminID
    Inventory.findOne({
        where: {
            id: inventoryId,
            // adminId: adminId
        },
        // attributes: ['id', 'adminId']
        attributes: ['id']
    }).then((inventory) => {
        // if record is found, admin is owner of inventory
        if (inventory != null) {
            Inventory.destroy({
                where: {
                    id: inventoryId
                }
            }).then(() => {
                alertMessage(res, 'info', 'Inventory deleted', 'far fa-trash-alt', true);
                res.redirect('/inventory/view'); // To retrieve all inventory again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Inventory', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

module.exports = router;