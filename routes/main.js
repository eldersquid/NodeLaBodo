const express = require("express");
const router = express.Router();
const passport = require('passport');
const fastJson = require("fast-json-stringify");
const bodyParser = require("body-parser");
const Reservation = require("../models/Reservation");
const SignUpModel = require("../models/Signup");
var multer = require("multer");
var bcrypt = require('bcryptjs');
const Signup = require('../models/Signup');

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

// Sign Up
router.get("/signup", (req, res) => {
    res.render("login/signup"); //
});
// //var uploadnone = multer();
// router.post("/login/signup", (req, res) => {
//     let errors = [];
//     // Retrieves fields from register page from request body
//     let { name, email, phone_num, password, password2, package_deal } = req.body;
//     // Checks if both passwords entered are the same
//     if (password !== password2) {
//         errors.push({ text: "Passwords do not match" });
//     }
//     // Checks that password length is more than 4
//     if (password.length < 4) {
//         errors.push({ text: "Password must be at least 4 characters" });
//     }
//     if (errors.length > 0) {
//         res.render("login/signup", {
//             errors,
//             name,
//             email,
//             phone_num,
//             password,
//             password2,
//         });
//     } else {
//         // If all is well, checks if user is already registered
//         SignUpModel.findAll({ where: { email: email } }).then((signup) => {
//             if (signup) {
//                 // If user is found, that means email has already been
//                 // registered
//                 res.render("login/signup", {
//                     error: signup.email + " already registered",
//                     name,
//                     email,
//                     phone_num,
//                     password,
//                     password2,
//                     package_deal
//                 });
//             } else {
//                 // Encrypt the password

//                 bcrypt.genSalt(10, function(err, salt) {
//                     bcrypt.hash(password, salt, function(err, hash) {
//                         // Store hash in your password DB.
//                         if (err) {
//                             throw err;
//                         } else {
//                             password = hash;

//                             // Create new user record
//                             SignUpModel.create({ name, email, phone_num, password, password2, package_deal })
//                                 .then((signup) => {
//                                     alertMessage(
//                                         res,
//                                         "success",
//                                         signup.name + " added.Please login",
//                                         "fas fa-sign-in-alt",
//                                         true
//                                     );
//                                     Res.render("/profile", { user: req.user.dataValues });
//                                 })
//                                 .catch((err) => console.log(err));
//                         }
//                     });
//                 });
//             }
//         });
//     }
// });


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
                                    .then(successfull => {
                                        // alertMessage(
                                        //     res,
                                        //     "success",
                                        //     // if successfull.name doesnt work just put name instead
                                        //     successfull.name + " added. Please login.",
                                        //     "fas fa-sign-in-alt",
                                        //     true
                                        // );
                                        // , { user: req.user.dataValues }
                                        res.render("login/userprofile");
                                    }).catch(err => console.log(err));

                            }
                        });
                    });
                }
            }).catch(err => console.log(err));

    }
});

// Display the Profile
// router.get("/profile/:id", (req, res) => {
//     const title = "Edit Profile";
//     Signup.findOne({
//             where: {
//                 id: req.params.id,
//             },
//         })
//         .then((signup) => {
//             // call views/video/editVideo.handlebar to render the edit video page
//             res.render("login/userprofile", {
//                 signup, // passes video object to handlebar
//                 layout: "blank",
//                 title: title,

//             });
//         })
//         .catch((err) => console.log(err)); // To catch no video ID
// });


// Login
router.post('/login/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/view/home',
        failureRedirect: '/login',
        failureFlash: true
            /* Setting the failureFlash option to true instructs Passport to flash an error message using the
       message given by the strategy's verify callback, if any. When a failure occur passport passes the message
       object as error */
    })(req, res, next);
});

// Logout User
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;