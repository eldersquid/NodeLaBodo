const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');
const Signup = require('../models/Signup');
const profilePicUpload = require('../helpers/profileUpload');

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

router.post('/profilePicUpload', (req, res) => {
    console.log("upload profile pic");
    profilePicUpload(req, res, async(err) => {
        console.log("printing req.file.filename")
        console.log(req.file)
        if (err) {
            res.json({ err: err });
        } else {
            if (req.file === undefined) {
                console.log("the file is undefined.");
                res.json({ err: err });
            } else {
                res.json({ file: `${req.file.filename}`, path: '/profile/' + `${req.file.filename}` });
            }
        }
    });

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
            res.render("login/Editprofile", {
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
        res.redirect('/login/userprofile');
    }).catch(err => console.log(err));
});

module.exports = router;