const express = require('express');
const router = express.Router();
const Productcat = require('../models/Productcat');
const alertMessage = require('../helpers/messenger.js');

router.get('/view', (req, res) => {
    const title = 'Product Category';

    res.render('productcat/view', {
        layout: "admin",
        title: title
    });

});

router.get('/create', (req, res) => {
    const title = 'Product Category';

    res.render('productcat/create', {
        layout: "admin",
        title: title,
    });
    Productcat.create({
        product_name
    }).then(productcat => {
        alertMessage(res, 'success', productcat.product_name + ' added. Please login', 'fas fa-sign-in-alt', true);
        res.redirect('/view');
    })
        .catch(err => console.log(err));
});


module.exports = router;