const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const Swal = require('sweetalert2');
const Contact = require('../models/Contact');
const FoodCart = require('../models/FoodCart');
const Response = require('../models/Response');
const FoodGallery = require('../models/FoodGallery');
const paypal = require('paypal-rest-sdk');
const app = express();
const cors = require('cors');
const { Template } = require('ejs');
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

router.post('/payPal', (req, res) => {
    let totalPrice = req.body.totalPrice;
    console.log(totalPrice);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/restaurant/paySuccess/" + totalPrice,
            "cancel_url": "http://localhost:5000/restaurant/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Food Delivery",
                    "sku": totalPrice,
                    "price": totalPrice,
                    "currency": "SGD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "SGD",
                "total": totalPrice
            },
            "description": "Hotel Booking Payment using PayPal"
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (var i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    console.log("Create Payment Response");
                    console.log(payment);
                    var payment_url = payment.links[i].href;
                    res.end(JSON.stringify(payment_url));


                    // res.redirect(payment.links[i].href);






                }
            }
        }
    });
});

router.get('/paySuccess/:pay', (req, res) => {
    const title = 'Success Payment';
    let totalPrice = req.params.pay;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "SGD",
                "total": totalPrice
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.redirect('/restaurant/success');
        }
    });
});

router.get('/success', (req, res) => {
    const title = 'Success!';
    res.render('restaurant/success', {
        title: title,
        layout: "blank",
    })
});

router.get('/bookingList', (req, res) => {
    const title = "Room Booking List";

    Room.findAll({

        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((room) => {

            // pass object to listVideos.handlebar
            res.render('rooms/bookingList', {
                layout: "admin",
                title: title,
                room: room
            });
        })
        .catch(err => console.log(err));
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
    let cust_phone = req.body.cust_phone
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
            cust_phone,
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
            cust_phone,
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
    let errors2 = [];
    let contact_name = req.body.contact_name;
    let contact_email = req.body.contact_email;
    let contact_subject = req.body.contact_subject;
    let contact_message = req.body.contact_message;
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        console.log("Errors creating contact")
        validatorErrors.array().forEach(error2 => {
            console.log(error2);
            errors2.push({ text2: error2.msg, location: 'contact2' })
        });
        res.render('restaurant/DineV2', {
            layout: "blank",
            errors2,
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
            alertMessage(res, 'success', 'Test Error', 'fas fa-exclamation-circle', true);
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