const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const alertMessage = require('../helpers/messenger.js');

const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = '188467906173-a5cq8hviitnaanin3cmag7el6kkqrcru.apps.googleusercontent.com'
const CLIENT_SECRET = 'uJwKO7Pc693-lYfqgWNbIVNB'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04goyDW9VwTk1CgYIARAAGAQSNwF-L9Ir8jbqSzj8hPVf93ZpstMmAGADCAshC-AfNtXjgj0J1rvrTBRhNxVwTQ5FpgtE8PuEJ-o';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(supplier, item_name, quantity, remarks) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'hotel.la.bodo@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: 'Hotel La Bodo <hotel.la.bodo@gmail.com>',
            to: supplier,
            subject: 'Order from Hotel La Bodo',
            text: 'Dear Valued Supplier ' + ',\n' + '\nWe would like to order another ' + quantity + ' of ' + item_name + '.\n\nAdditional Remarks:' + '\n' + remarks + '\n\nWe hope to hear from you soon!\n' + 'Sincerely,\nHotel La Bodo'
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        
        return error
    }
};

router.get('/view', (req, res) => {
    const title = 'Order';
    Order.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['order_id', 'ASC']
        ],
        raw: true
    })
        .then((order) => {
            // pass object to listOrder.handlebar
            res.render('order/adminview', {
                layout: "admin",
                title: title,
                order: order
            });
        })
        .catch(err => console.log(err));
});

router.get('/supplierView', (req, res) => {
    const title = 'Order';

    Order.findAll({
        where: {
            // supplierId: req.supplier.id
            // supplierName: req.supplier
        },
        order: [
            ['order_id', 'ASC']
        ],
        raw: true
    })
        .then((order) => {
            // pass object to listOrder.handlebar
            res.render('order/supplierview', {
                layout: "supplier",
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
                ['inventory_id', 'ASC']
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
                ['supplier_id', 'ASC']
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
    let status = req.body.status;

    Order.create({
        supplier,
        item_name,
        quantity,
        remarks,
        status
    }).then((order) => {
        sendMail(supplier, item_name, quantity, remarks).then(result => console.log('Email sent...', result))
            .catch(error => console.log(error.message));
        res.redirect('/order/view');
    }).catch(err => console.log(err))
});

router.get('/showUpdate/:order_id', (req, res) => {
    const title = "Update Order";
    Order.findOne({
        where: {
            order_id: req.params.order_id
        },
        raw: true
    }).then((order) => {
        if (!order) { // check video first because it could be null.
            alertMessage(res, 'info', 'No such video', 'fas fa-exclamation-circle', true);
            res.redirect('/order/view');
        } else {
            // Only authorised user who is owner of video can edit it
            // if (req.user.id === video.userId) {
            //     checkOptions(video);
                res.render('order/update', { // call views/video/editVideo.handlebar to render the edit video page
                    title: title,
                    layout: "supplier",
                    order
                });
            // } else {
            //     alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
            //     res.redirect('/logout');
            // }
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

router.put('/update/:order_id', (req, res) => {
    let supplier = req.body.supplier;
    let item_name = req.body.item_name;
    let quantity = req.body.quantity;
    let remarks = req.body.remarks;
    let status = req.body.status;

    Order.update({
        supplier,
        item_name,
        quantity,
        remarks,
        status
    }, {
        where: {
            order_id: req.params.order_id
        }
    }).then((order) => {
        res.redirect('/order/view'); // redirect to call router.get(/listInventory...) to retrieve all updated
        // inventory
    }).catch(err => console.log(err));
});

module.exports = router;