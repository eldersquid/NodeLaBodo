const express = require('express');
const router = express.Router();

router.get('/inventory/view', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/view', {
        layout: "admin",
        title: title
    });

});

router.get('/inventory/create', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/create', {
        layout: "admin",
        title: title
    });
});

router.get('/inventory/update', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/update', {
        layout: "admin",
        title: title
    });
});

module.exports = router;