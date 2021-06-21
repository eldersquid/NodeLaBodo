const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/view', {
        layout: "admin",
        title: title
    });

});

router.get('/showCreate', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/create', {
        layout: "admin",
        title: title
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

router.get('/update', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/update', {
        layout: "admin",
        title: title
    });
});

module.exports = router;