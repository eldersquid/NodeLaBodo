const express = require('express');
const router = express.Router();

router.get('category/view', (req, res) => {
    const title = 'Product Category';

    res.render('admin/productcat/view', {
        layout: "admin",
        title: title
    });

});

router.get('category/create', (req, res) => {
    const title = 'Product Category';

    res.render('admin/productcat/create', {
        layout: "admin",
        title: title
    });
});

module.exports = router;