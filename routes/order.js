const express = require('express');
const router = express.Router();

router.get('/order/track', (req, res) => {
    const title = 'Order';

    res.render('order/view', {
        layout: "admin",
        title: title
    });

});

router.get('/order/create', (req, res) => {
    const title = 'Order';

    res.render('order/create', {
        layout: "admin",
        title: title
    });
});

module.exports = router;