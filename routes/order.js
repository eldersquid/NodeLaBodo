const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const alertMessage = require('../helpers/messenger.js');
var nodemailer = require('nodemailer');

// router.get('/view', (req, res) => {
//     const title = 'Order';

//     res.render('order/view', {
//         layout: "admin",
//         title: title
//     });

// });

router.get('/view', (req, res) => {
    const title = 'Order';
    Order.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((order) => {
            // pass object to listOrder.handlebar
            res.render('order/view', {
                layout: "admin",
                title: title,
                order: order
            });
        })
        .catch(err => console.log(err));
});

router.get('/showCreate', async (req, res) => {
    const title = 'Order';

    const getInventoryData = () => {
        const inventory = Inventory.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['id', 'ASC']
            ],
            raw: true
        })
        return inventory
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

    res.render('order/create', {
        layout: "admin",
        title: title,
        inventory: await getInventoryData(),
        supplier: await getSupplierData()
    });
});

router.post('/create', (req, res) => {
    let supplier = req.body.supplier;
    let item_name = req.body.item_name;
    let quantity = req.body.quantity;
    let remarks = req.body.remarks;

    // var nodemailer = require('nodemailer');

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'hotel.la.bodo@gmail.com',
    //         pass: 'Admin-123'
    //     }
    // });

    // var mailOptions = {
    //     from: 'hotel.la.bodo@gmail.com',
    //     to: 'ziyuan2497@gmail.com',
    //     subject: 'Order From Hotel La Bodo',
    //     text: 'Dear ' + supplier + ',\n' + '\nWe would like to order another ' + quantity + ' of ' + item_name + '.\n\nAdditional Remarks:' + '\n' + remarks + '\n\nWe hope to hear from you soon!\n' + 'Sincerely,\nHotel La Bodo'
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

    Order.create({
        supplier,
        item_name,
        quantity,
        remarks
    }).then((order) => {
        res.redirect('/order/view');
    }).catch(err => console.log(err))
});

module.exports = router;