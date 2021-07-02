const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');
const Signup = require('../models/Signup');

// Display the Profile
router.get('/Viewprofile', (req, res) => {
    const title = 'View User Profile';
    res.render('login/view_profile', {
        layout: "blank",
        title: title
    });

});

// Edit Profile
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Signup.findOne({
        where: {
            id: req.params.id
        }
    }).then((video) => {
        if (req.user.id === video.userId) {
            checkOptions(video);
            // call views/video/editVideo.handlebar to render the edit video page
            res.render('login/profile', {
                video // passes video object to handlebar
            });
        } else {
            alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    }).catch(err => console.log(err)); // To catch no video ID
});