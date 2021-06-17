const express = require('express');
const router = express.Router();
const moment = require('moment');
const Productcat = require('../models/Productcat');
const alertMessage = require('../helpers/messenger.js');

// router.get('/view', (req, res) => {
//     const title = 'Product Category';

//     res.render('productcat/view', {
//         layout: "admin",
//         title: title
//     });

// });

router.get('/showCreate', (req, res) => {
    const title = 'Product Category';

    res.render('productcat/create', {
        layout: "admin",
        title: title,
    });
});

router.post('/create', (req, res) => {
    

    let product_name = req.body.product_name;

    // Multi-value components return array of strings or undefined
    Productcat.create({
        product_name
    }).then((productcat) => {
        res.redirect('/productcat/view'); // redirect to call router.get(/listVideos...) to retrieve all updated
        // videos
    }).catch(err => console.log(err))
});

router.get('/view', (req, res) => {
    const title = 'Product Category';
    Productcat.findAll({
        order: [
            ['product_name', 'ASC']
        ],
        raw: true
    })
        .then((productcat) => {
            res.render('productcat/view', {
                layout: "admin",
                title: title
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;