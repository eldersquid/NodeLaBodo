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