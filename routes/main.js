const express = require("express");
const router = express.Router();
const passport = require('passport');
const fastJson = require("fast-json-stringify");
const bodyParser = require("body-parser");
const Reservation = require("../models/Reservation");
const SignUpModel = require("../models/Signup");
const multer = require("multer");
var bcrypt = require('bcryptjs');
// const Signup = require('../models/Signup');
const StaffModel = require('../models/Staff')
const alertMessage = require('../helpers/messenger');
const regex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
// const Regex = require("regex");
const Regex = require("regex");
const validator = require("email-validator");



const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const CLIENT_ID = '855734212452-4ti1go2pp7ks8os3o98ragh1k8gh2mtb.apps.googleusercontent.com'
const CLIENT_SECRET = '6Wm2bPALLsbf2s_H_R-jJpa1'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04wi_I-DuOpscCgYIARAAGAQSNwF-L9Ir2mNKa0_6ofjTLeipoCL6YqO2WPMgFOHd9rNC8RLr4TPBVj4PGQJU5B0i1V-2qsrqnAw';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail() {

    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'gabewungkana5@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'gabewungkana5@gmail.com',
            to: 'progenji81@gmail.com',
            subject: "Reset Password",
            text: 'Dear  ,\n\nThis is your new password, lololol.   \n Sincerely,\nHotel La Bodo'

        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error
    }
}


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
    if (!/^[0-9]{8}$/.test(req.body.phone_num)) {
        errors.push({
            text: 'Phone Number have to consist of 8 digits.'
        });
    }

    if (validator.validate(req.body.email) == false) {
        console.log("error 3");
        errors.push({
            text: 'Please enter a valid email address'
        });
    }

    if (req.body.password.length < 8) {
        console.log("error 2");
        errors.push({
            text: 'Password must be at least 8 characters'
        });
    }

    // if (req.body.password !== req.body.password2) {
    //     console.log("error 1");
    //     errors.push({
    //         text: 'Passwords do not match'
    //     });
    // }

    if (password.length < 4) {
        errors.push({ text: "password must be more than 4 characters" });
    }
    // checking if there are errors or no errors
    if (errors.length > 0) {
        console.log("There are errors in the form");
        res.render("login/signup", {
            layout: "main",
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
                        layout: "main",
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

router.post('/forgetpw', (req, res, next) => {
    let email = req.body.email;


    sendMail(email).then(result => console.log('Email sent...', result))
        .catch(error => console.log(error.message));
    alertMessage(res, 'success', 'Email has been sent.', 'fas fa-sign-in-alt', true);

});



router.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("This is the email: ", email);
    console.log("This is the password: ", password);
    console.log("Trying to authenticate");
    passport.authenticate('local', {
        successRedirect: '/rooms/apartment', // Route to /video/listVideos URL
        failureRedirect: '/mainlogin', // Route to /login URL
        failureFlash: true,
        //signupProperty: req.signup
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
       message given by the strategy's verify callback, if any. When a failure occur passport passes the message
       object as error */
    })(req, res, next);
});

// Staff Signup
router.get("/staffsignup", (req, res) => {
    res.render("login/staffsignup", { layout: "staffSU" }); //
});

router.post('/login/staffsignup', (req, res) => {
    let errors = [];
    // Retrieves fields from register page from request body
    let { staff_name, staff_ID, staff_email, staff_password, staff_repeat } = req.body;
    // Checks if both passwords entered are the same
    if (staff_password !== staff_repeat) {
        errors.push({ text: 'Passwords do not match' });
    }
    // Checks that password length is more than 8
    if (staff_password.length < 8) {
        errors.push({ text: 'Password must be at least 8 characters' });
    }


    if (validator.validate(req.body.staff_email) == false) {
        console.log("email error");
        errors.push({
            text: 'Please enter a valid email address'
        });
    }
    if (errors.length > 0) {
        res.render('login/staffsignup', {
            layout: "staffSU",
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
                        layout: "staffSU",
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
    res.render('login/stafflogin', { layout: "staffLS" }) // 
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

// Logout Staff
router.get('/stafflogout', (req, res) => {
    req.logout();
    res.redirect('/stafflogin');
});

module.exports = router;