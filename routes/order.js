const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const alertMessage = require('../helpers/messenger.js');

// router.get('/view', (req, res) => {
//     const title = 'Order';

//     res.render('order/view', {
//         layout: "admin",
//         title: title
//     });

// });

router.get('/view', (req, res) => {
    Order.findAll({
        where: {
            adminId: req.admin.id
        },
        order: [
            ['item_name', 'ASC']
        ],
        raw: true
    })
        .then((order) => {
            // pass object to listOrder.handlebar
            res.render('order/view', {
                order: order
            });
        })
        .catch(err => console.log(err));
});

router.get('/showCreate', (req, res) => {
    const title = 'Order';

    res.render('order/create', {
        layout: "admin",
        title: title
    });
});

router.post('/create', (req, res) => {
    let item_name = req.body.item_name;
    let product_name = req.body.product_name;
    let supplier = req.body.supplier;
    let quantity = req.body.quantity;
    let remarks = req.body.remarks;

    Order.create({
        item_name,
        product_name,
        supplier,
        quantity,
        remarks
    }).then((order) => {
        res.redirect('/order/view');
    }).catch(err => console.log(err))
});

module.exports = router;