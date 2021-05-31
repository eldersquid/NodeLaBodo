const express = require('express');
const router = express.Router();

router.get('supplier/view', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/view', {
        layout: "admin",
        title: title
    });

});

router.get('supplier/create', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/create', {
        layout: "admin",
        title: title
    });
});

router.get('/supplier/update', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/update', {
        layout: "admin",
        title: title
    });
});

module.exports = router;