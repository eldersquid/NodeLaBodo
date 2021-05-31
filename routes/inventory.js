const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/view', {
        layout: "admin",
        title: title
    });

});

router.get('/create', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/create', {
        layout: "admin",
        title: title
    });
});

router.get('/update', (req, res) => {
    const title = 'Inventory';

    res.render('inventory/update', {
        layout: "admin",
        title: title
    });
});

module.exports = router;