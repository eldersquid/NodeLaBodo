const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const Swal = require('sweetalert2');
const Contact = require('../models/Contact');
const FoodCart = require('../models/FoodCart');
const Response = require('../models/Response');
const FoodGallery = require('../models/FoodGallery');
const { body, validationResult } = require('express-validator');

// // User View Restaurant 
// router.get('/DineV2', (req, res) => {
//     res.render('restaurant/DineV2', {
//         layout: "blank",
//     });
// });

// User View Menu

router.get("/Menu", (req, res) => {
    const title = "Menu";

    FoodCart.findAll({
        order: [["id", "ASC"]],
        raw: true,
    })
        .then((foodcart) => {
            // pass object to listVideos.handlebar
            res.render("restaurant/Menu", {
                layout: "blank",
                title: title,
                foodcart: foodcart,
            });
        })
        .catch((err) => console.log(err));
});

//Create reservation 
router.post('/createReservation', [
    body('cust_fname').not().isEmpty().isAlpha().trim().escape().withMessage("First name is Invalid"),
    body('cust_lname').not().isEmpty().isAlpha().trim().escape().withMessage("Last name is Invalid"),
    body('cust_email').trim().isEmail().withMessage("Invalid Email").normalizeEmail().toLowerCase(),
    body('cust_message').not().isEmpty().trim().escape().withMessage("Invalid Message"),
    body('cust_date').not().isEmpty().trim().escape().withMessage("Require Date Field"),
    body('cust_time').not().isEmpty().trim().escape().withMessage("Require Time Field"),
    // body('cust_phone').custom(value => {
    //     if (value > 9){
    //         throw new Error("Invalid phone number!");
    //     }
    //     return true;
    // }),
    body('number_guest').custom(value => {
        if (value > 5) {
            throw new Error("Cannot Exceed 5 memebers!");
        }
        return true;
    }),
], (req, res) => {
    console.log("retrieving reservationnn")
    let errors = [];
    let cust_fname = req.body.cust_fname
    let cust_lname = req.body.cust_lname
    let cust_email = req.body.cust_email
    // let cust_phone = req.body.cust_phone
    let number_guest = req.body.number_guest
    let cust_date = req.body.cust_date
    let cust_time = req.body.cust_time
    let cust_message = req.body.cust_message
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        console.log("Errors creating reservation")
        validatorErrors.array().forEach(error => {
            console.log(error);
            errors.push({ text: error.msg })
        });
        res.render('restaurant/DineV2', {
            layout: "blank",
            errors,
            cust_fname,
            cust_lname,
            cust_email,
            // cust_phone,
            number_guest,
            cust_date,
            cust_time,
            cust_message
        });
    } else {
        console.log("creating reservation")
        Reservation.create({
            cust_fname,
            cust_lname,
            cust_email,
            // cust_phone,
            number_guest,
            cust_date,
            cust_time,
            cust_message
        }).then((reservation) => {
            res.redirect('/restaurant/DineV2');
        }).catch(err => console.log(err));
    }
});

// Create Contact Form
router.post('/createContact', [
    body('contact_name').not().isEmpty().isAlpha().trim().escape().withMessage("Name is Invalid"),
    body('contact_email').trim().isEmail().withMessage("Invalid Email").normalizeEmail().toLowerCase(),
    body('contact_subject').not().isEmpty().trim().escape().withMessage("Must be in Alphabets"),
    body('contact_message').not().isEmpty().trim().escape().withMessage("Invalid Message"),
], (req, res) => {
    console.log("retrieving contact informationnn")
    let errors = [];
    let contact_name = req.body.contact_name;
    let contact_email = req.body.contact_email;
    let contact_subject = req.body.contact_subject;
    let contact_message = req.body.contact_message;
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        console.log("Errors creating contact")
        validatorErrors.array().forEach(error => {
            console.log(error);
            errors.push({ text: error.msg })
        });
        res.render('restaurant/DineV2', {
            layout: "blank",
            errors,
            contact_name,
            contact_email,
            contact_subject,
            contact_message,
        });
    } else {
        console.log("creating contact")
        Contact.create({
            contact_name,
            contact_email,
            contact_subject,
            contact_message
        }).then((contact) => {
            res.redirect('/restaurant/DineV2');
        }).catch(err => console.log(err));
    }
});


router.get('/DineV2', (req, res) => {
    const title = 'foodgallery';
    FoodGallery.findAll({
        raw: true
    })
        .then((foodgallery) => {
            console.log("hello", foodgallery);
            const gallleryList = [];
            for (var i in foodgallery) {
                gallleryList.push(foodgallery[i]);
                console.log(gallleryList);
            }
            res.render('restaurant/DineV2', {
                layout: "blank",
                title: title,
                foodgallery: foodgallery
            });
        }).catch(err => console.log(err));
})

module.exports = router;