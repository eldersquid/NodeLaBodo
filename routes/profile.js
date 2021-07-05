const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');
const Signup = require('../models/Signup');


// Display the Profile
router.get("/profile/:id", (req, res) => {
    const title = "Edit Profile";
    Signup.findOne({
            where: {
                id: req.params.id,
            },
        })
        .then((signup) => {
            // call views/video/editVideo.handlebar to render the edit video page
            res.render("login/userprofile", {
                signup, // passes video object to handlebar
                layout: "blank",
                title: title,

            });
        })
        .catch((err) => console.log(err)); // To catch no video ID
});

// Edit
router.get("/Editprofile/:id", (req, res) => {
    const title = "Edit Profile";
    Signup.findOne({
            where: {
                id: req.params.id,
            },
        })
        .then((signup) => {
            // call views/video/editVideo.handlebar to render the edit video page
            res.render("/login/profile", {
                signup, // passes video object to handlebar
                layout: "blank",
                title: title,

            });
        })
        .catch((err) => console.log(err)); // To catch no video ID
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
    }).then((signup) => {
        res.redirect('/login/profile');
    }).catch(err => console.log(err));
});