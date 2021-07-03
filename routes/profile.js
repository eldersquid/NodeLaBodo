const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');
const Signup = require('../models/Signup');


// Display the Profile
router.get('/profile', (req, res) => {
    const title = 'View User Profile';
    res.render('login/profile', {
        layout: "blank",
        title: title
    });

});

// Edit Profile
router.put('/update/:id', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let phone_num = req.body.phone_num;
    let password = req.body.password;
    let package_deal = req.body.package_deal;

    Signup.update({
        name,
        username,
        email,
        phone_num,
        password,
        package_deal
    }, {
        where: {
            id: req.params.id
        }
    }).then((user) => {
        res.redirect('/login/profile');
    }).catch(err => console.log(err));
});