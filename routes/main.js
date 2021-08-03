const express = require("express");
const router = express.Router();
const passport = require('passport');
const fastJson = require("fast-json-stringify");
const bodyParser = require("body-parser");
const Reservation = require("../models/Reservation");
const SignUpModel = require("../models/Signup");
var multer = require("multer");
var bcrypt = require('bcryptjs');
// const Signup = require('../models/Signup');
const StaffModel = require('../models/Staff')
const alertMessage = require('../helpers/messenger');


router.get("/", (req, res) => {
    const title = "Home Page";
    res.render("home", {
        title: title,
    }); // renders views/index.handlebars
});

// User View Restaurant
router.get("/Dine", (req, res) => {
    res.render("restaurant/Dining&Bar", {
        layout: "blank",
    });
});

router.get("/test", (req, res) => {
    res.render("test", {
        layout: "blank",
    }); //
});

// User View Gallery
router.get("/galleryViewUser", (req, res) => {
    res.render("user/gallery/gallery_view"); //
});

// User Report Gallery
router.get("/galleryReport", (req, res) => {
    res.render("user/gallery/gallery_report"); //
});

// User Create Post At Gallery
router.get("/galleryCreate", (req, res) => {
    res.render("user/gallery/gallery_create"); //
});

// User View Available Facilities
router.get("/galleryFacilitiesView", (req, res) => {
    res.render("user/facilities/facilities_view"); //
});

// User Facilities Booking
router.get("/galleryFacilitiesBooking", (req, res) => {
    res.render("user/facilities/facilities_book"); //
});

// User Cancel Booking
router.get("/galleryCancelBooking", (req, res) => {
    res.render("user/facilities/facilities_cancelbooking"); //
});

// User Sign Up
router.get("/signup", (req, res) => {
    res.render("login/signup"); //
});


router.post("/login/signup", (req, res) => {
    console.log("Retrieving the sign up form.");
    let { name, username, email, phone_num, password, password2, package_deal } = req.body;
    let errors = [];
    // validation
    if (password.length < 4) {
        errors.push({ text: "password must be 4 characters" });
    }
    // checking if there are errors or no errors
    if (errors.length > 0) {
        console.log("There are errors in the form");
        res.render("login/signup", {
            errors,
            name,
            username,
            email,
            phone_num,
            password,
            password2
        });
    } else {
        // if form does not have errors, it will go here
        console.log("There are no errors");
        SignUpModel.findOne({
                where: {
                    email: email
                }
            })
            .then(signup => {
                if (signup) {
                    console.log("The user has already been taken.");
                    res.render("login/signup", {
                        error: signup.email + " already registered",
                        name,
                        username,
                        email,
                        phone_num,
                        password,
                        password2,
                        package_deal
                    });
                } else {
                    console.log("User is available to create");
                    // password encryption here
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(password, salt, function(err, hash) {
                            // store has in your password DB.
                            if (err) {
                                throw err;
                            } else {
                                password = hash;
                                console.log("Creating the user's account");
                                SignUpModel.create({ name, username, email, phone_num, password, package_deal })
                                    .then((signup) => {
                                        res.redirect("/profile/profile/" + signup.id);
                                    }).catch(err => console.log(err));

                            }
                        });
                    });
                }
            }).catch(err => console.log(err));

    }
});


// User Login
router.get('/mainlogin', (req, res) => {
    res.render('login/mainlogin') // 
});

router.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("This is the email: ", email);
    console.log("This is the password: ", password);
    console.log("Trying to authenticate");
    passport.authenticate('local', {
        successRedirect: '/rooms/apartment', // Route to /video/listVideos URL
        failureRedirect: '/', // Route to /login URL
        failureFlash: true,
        //signupProperty: req.signup
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
       message given by the strategy's verify callback, if any. When a failure occur passport passes the message
       object as error */
    })(req, res, next);
});

// Staff Signup
router.get("/staffsignup", (req, res) => {
    res.render("login/staffsignup"); //
});

router.post('/login/staffsignup', (req, res) => {
    let errors = [];
    // Retrieves fields from register page from request body
    let { staff_name, staff_ID, staff_email, staff_password, staff_repeat } = req.body;
    // Checks if both passwords entered are the same
    if (staff_password !== staff_repeat) {
        errors.push({ text: 'Passwords do not match' });
    }
    // Checks that password length is more than 4
    if (staff_password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('login/staffsignup', {
            errors,
            staff_name,
            staff_ID,
            staff_email,
            staff_password,
            staff_repeat
        });
    } else {
        // If all is well, checks if user is already registered
        // StaffModel.findOne({
        //         where: {
        //             staff_email: staff_email
        //         }
        //     })
        StaffModel.findOne({
                where: {
                    staff_email: staff_email
                }
            })
            .then(staff => {
                if (staff) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('login/staffsignup', {
                        error: staff.email + ' already registered',
                        staff_name,
                        staff_ID,
                        staff_email,
                        staff_password,
                        staff_repeat,
                    });
                } else {
                    // Encrypt the password
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(staff_password, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                throw err;
                            } else {
                                staff_password = hash;

                                // Create new user record
                                StaffModel.create({ staff_name, staff_ID, staff_email, staff_password })
                                    .then(staff => {
                                        alertMessage(res, 'success', staff.staff_name + ' added.Please login', 'fas fa-sign-in-alt', true);
                                        res.redirect('/stafflogin');
                                    })
                                    .catch(err => console.log(err));
                            }
                        });
                    });
                }
            });
    }
});


// Staff Login

router.get('/stafflogin', (req, res) => {
    res.render('login/stafflogin') // 
});
router.post('/login/stafflogin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/hospitalList',
        failureRedirect: '/stafflogin',
        failureFlash: true
    })(req, res, next);
});

// Logout User
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Logout User
router.get('/stafflogout', (req, res) => {
    req.logout();
    res.redirect('/stafflogin');
});

module.exports = router;