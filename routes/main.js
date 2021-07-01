const express = require('express');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');
const Reservation = require('../models/Reservation');


router.get('/', (req, res) => {
    const title = 'Home Page';
    res.render('home', {
            title: title
        }) // renders views/index.handlebars
});

// User View Restaurant 
router.get('/Dine', (req, res) => {
    res.render('restaurant/Dining&Bar', {
        layout: "blank"
    })
});

router.get('/test', (req, res) => {
    res.render('test', {
            layout: "blank"
        }) // 
});

// User View Gallery
router.get('/galleryViewUser', (req, res) => {
    res.render('user/gallery/gallery_view') // 
});

// User Report Gallery
router.get('/galleryReport', (req, res) => {
    res.render('user/gallery/gallery_report') // 
});

// User Create Post At Gallery
router.get('/galleryCreate', (req, res) => {
    res.render('user/gallery/gallery_create') // 
});


// User View Available Facilities
router.get('/galleryFacilitiesView', (req, res) => {
    res.render('user/facilities/facilities_view') // 
});

// User Facilities Booking
router.get('/galleryFacilitiesBooking', (req, res) => {
    res.render('user/facilities/facilities_book') // 
});

// User Cancel Booking
router.get('/galleryCancelBooking', (req, res) => {
    res.render('user/facilities/facilities_cancelbooking') // 
});

// Sign Up
router.get('/signup', (req, res) => {
    res.render('login/signup') //
});

router.post("/register", (req, res) => {
    let errors = [];
    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;
    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: "Passwords do not match" });
    }
    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: "Password must be at least 4 characters" });
    }
    if (errors.length > 0) {
        res.render("user/register", {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
                // If user is found, that means email has already been
                // registered
                res.render("user/register", {
                    error: user.email + " already registered",
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                // Encrypt the password
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if (err) {
                            throw err;
                        } else {
                            password = hash;

                            // Create new user record
                            User.create({ name, email, password })
                                .then((user) => {
                                    alertMessage(
                                        res,
                                        "success",
                                        user.name + " added.Please login",
                                        "fas fa-sign-in-alt",
                                        true
                                    );
                                    res.redirect("/showLogin");
                                })
                                .catch((err) => console.log(err));
                        }
                    });
                });
            }
        });
    }
});

// Profile
router.get('/profile', (req, res) => {
    res.render('login/profile') //
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});




module.exports = router;