const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/view', {
        layout: "admin",
        title: title
    });

});

router.get('/create', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/create', {
        layout: "admin",
        title: title
    });
});

router.get('/update', (req, res) => {
    const title = 'Supplier';

    res.render('supplier/update', {
        layout: "admin",
        title: title
    });
});

module.exports = router;