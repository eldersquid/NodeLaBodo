const express = require('express');
const router = express.Router();
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

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hotel.la.bodo@gmail.com',
            pass: 'Admin-123'
        }
    });

    var mailOptions = {
        from: 'hotel.la.bodo@gmail.com',
        to: 'ziyuan2497@gmail.com',
        subject: 'Order From Hotel La Bodo',
        text: 'Dear ' + supplier + ',\n' + '\nWe would like to order another ' + quantity + ' ' + item_name + '.\n\nAdditional Remarks:' + '\n' + remarks + '\n\nWe hope to hear from you soon!\n' + 'Sincerely,\nHotel La Bodo'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

module.exports = router;