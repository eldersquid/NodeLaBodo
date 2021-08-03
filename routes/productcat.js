const express = require('express');
const router = express.Router();
const Productcat = require('../models/Productcat');
const alertMessage = require('../helpers/messenger.js');
const Swal = require('sweetalert2');

router.get('/view', (req, res) => {
    const title = 'Product Category';
    Productcat.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['product_name', 'ASC']
        ],
        raw: true
    })
        .then((productcat) => {
            res.render('productcat/view', {
                layout: "admin",
                title: title,
                productcat: productcat
            });
        })
        .catch(err => console.log(err));
});

router.get('/showCreate', (req, res) => {
    const title = 'Product Category';

    res.render('productcat/create', {
        layout: "admin",
        title: title,
    });
});

router.post('/create', (req, res) => {
    let product_name = req.body.product_name;

    Productcat.create({
        product_name
    }).then((productcat) => {
        res.redirect('/productcat/view');
    }).catch(err => console.log(err))
});

router.post('/delete/:product_name', (req, res) => {
    let product_name = req.params.product_name;
    // let adminId = req.admin.id;
    Productcat.findOne({
        where: {
            product_name,
            // adminId: adminId
        },
        // attributes: ['id', 'adminId']
        attributes: ['']
    }).then((productcat) => {
        if (productcat != null) {
            Productcat.destroy({
                where: {
                    product_name
                }
            }).then(() => {
                alertMessage(res, 'info', 'Product Category deleted', 'far fa-trash-alt', true);
                res.redirect('/productcat/view');
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Product Category', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

module.exports = router;