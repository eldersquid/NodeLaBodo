const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Productcat = require('../models/Productcat');
const Inventory = require('../models/Inventory');
const Swal = require('sweetalert2');


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

router.get('/showCreate', async (req, res) => {
    const title = 'Inventory';

    Supplier.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['id', 'ASC']
        ],
            raw: true
    })
        .then((supplier) => {
            res.render('inventory/create', {
                layout: "admin",
                title: title,
                    supplier: supplier
                });
            }
        )
});

router.post('/create', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let product_name = req.body.product_name;
    let quantity = req.body.quantity;
    let selling_price = req.body.selling_price;
    let cost_price = req.body.cost_price;

    Inventory.create({
        item_name,
        supplier,
        product_name,
        quantity,
        selling_price,
        cost_price
    }).then((inventory) => {
        res.redirect('/inventory/view');
    }).catch(err => console.log(err))
});

router.get('/showUpdate/:id', async (req, res) => {
    const title = 'Inventory';

    const getProductcatData = () => {
        const productcat = Productcat.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['id', 'ASC']
            ],
            raw: true
        })
        return productcat
    };

    const getSupplierData = () => {
        const supplier = Supplier.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['id', 'ASC']
            ],
            raw: true
        })
        return supplier
    };

    const getInventoryData = () => {
        const inventory = Inventory.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        if (!inventory) { // check inventory first because it could be null.
            alertMessage(res, 'info', 'No such Inventory', 'fas fa-exclamation-circle', true);
            res.redirect('/inventory/view');
        } else {
            return inventory
        }
    };

    res.render('inventory/update', { // call views/inventory/editSupplier.handlebar to render the edit supplier page
        layout: "admin",
        title: title,
        supplier: await getSupplierData(),
        productcat: await getProductcatData(),
        inventory: await getInventoryData()
    })
});

router.put('/update/:id', (req, res) => {
    let item_name = req.body.item_name;
    let supplier = req.body.supplier;
    let product_name = req.body.product_name;
    let quantity = req.body.quantity;
    let selling_price = req.body.selling_price;
    let cost_price = req.body.cost_price;
    

    Inventory.update({
        item_name,
        supplier,
        product_name,
        quantity,
        selling_price,
        cost_price
    }, {
        where: {
            id: req.params.id
        }
    }).then((inventory) => {
        res.redirect('/inventory/view'); // redirect to call router.get(/listInventory...) to retrieve all updated
        // inventory
    }).catch(err => console.log(err));
});

router.post('/delete/:id', (req, res) => {
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