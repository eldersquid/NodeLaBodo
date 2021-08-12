const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');
const Orders = require('../models/Orders');
const alertMessage = require('../helpers/messenger.js');

const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = '188467906173-a5cq8hviitnaanin3cmag7el6kkqrcru.apps.googleusercontent.com'
const CLIENT_SECRET = 'uJwKO7Pc693-lYfqgWNbIVNB'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Tt7yjfGWpdQCgYIARAAGAQSNwF-L9Ir_wKE_gHmQitcazwILvpG0TVhGDTssYZSZUOjozi05MfSKJrBjCcw4VE32AgEiL3cfcs';

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
            subject: 'New Order from Hotel La Bodo',
            text: 'Dear Valued Supplier ' + ',\n' + '\nWe would like to order another ' + quantity + ' of ' + item_name + '.\n\nAdditional Remarks:' + '\n' + remarks + '\n\nWe hope to hear from you soon!\n' + 'Sincerely,\nHotel La Bodo'
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        
        return error
    }
};

router.get('/view', (req, res) => {
    const title = 'Orders';

    Orders.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['orders_id', 'ASC']
        ],
        raw: true
    })
        .then((orders) => {
            // pass object to listVideos.handlebar
            res.render('orders/adminview', {
                layout: "admin",
                title: title,
                orders: orders
            });
        })
        .catch(err => console.log(err));

});

router.get('/supplierView', (req, res) => {
    const title = 'Orders';

    Orders.findAll({
        where: {
            // supplierId: req.supplier.id
            // supplierName: req.supplier
        },
        order: [
            ['orders_id', 'ASC']
        ],
        raw: true
    })
        .then((orders) => {
            // pass object to listOrder.handlebar
            res.render('orders/supplierview', {
                layout: "supplier",
                title: title,
                orders: orders
            });
        })
        .catch(err => console.log(err));
});

router.get('/showCreate', async (req, res) => {
    const title = 'Orders';

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

    res.render('orders/create', {
        layout: "admin",
        title: title,
        inventory: await getInventoryData()
    });
});

router.post('/create', (req, res) => {
    let supplier = req.body.supplier;
    let item_name = req.body.item_name;
    let quantity = req.body.quantity;
    let remarks = req.body.remarks;
    let status = req.body.status;

    Orders.create({
        supplier,
        item_name,
        quantity,
        remarks,
        status
    }).then((orders) => {
        sendMail(supplier, item_name, quantity, remarks).then(result => console.log(result))
            .catch(error => console.log(error.message));
        alertMessage(res, 'success', ' Order has been sent successfully.', 'fas fa-sign-in-alt', true);
        res.redirect('/orders/view');
    }).catch(err => console.log(err))
});

router.get('/showUpdate/:orders_id', (req, res) => {
    const title = "Update Orders";

    Orders.findOne({
        where: {
            orders_id: req.params.orders_id
        },
        raw: true
    }).then((orders) => {
        if (!orders) { // check video first because it could be null.
            alertMessage(res, 'info', 'No such order', 'fas fa-exclamation-circle', true);
            res.redirect('/orders/view');
        } else {
            // Only authorised user who is owner of video can edit it
            // if (req.user.id === video.userId) {
            //     checkOptions(video);
                res.render('orders/update', { // call views/video/editVideo.handlebar to render the edit video page
                    title: title,
                    layout: "supplier",
                    orders: orders
                })
                .catch(err => console.log(err));
            // } else {
            //     alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
            //     res.redirect('/logout');
            // }
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

router.put('/update/:orders_id', (req, res) => {
    let supplier = req.body.supplier;
    let item_name = req.body.item_name;
    let quantity = req.body.quantity;
    let remarks = req.body.remarks;
    let status = req.body.status;

    Orders.update({
        supplier,
        item_name,
        quantity,
        remarks,
        status
    }, {
        where: {
            orders_id: req.params.orders_id
        }
    }).then((orders) => {
        alertMessage(res, 'success', ' Status for ' + orders.supplier + ' has been updated.', 'fas fa-sign-in-alt', true);
        res.redirect('/orders/view');
    }).catch(err => console.log(err));
});

module.exports = router;