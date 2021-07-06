const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const Swal = require('sweetalert2');
const Contact = require('../models/Contact');
// const Response = require('../models/Response');

// User View Restaurant 
router.get('/DineV2', (req, res) => {
    res.render('restaurant/DineV2', {
        layout: "blank",
    });
});

//Create reservation 
router.post('/createReservation', (req, res) => {
    let cust_fname = req.body.cust_fname
    let cust_lname = req.body.cust_lname
    let cust_email = req.body.cust_email
    let cust_phone = req.body.cust_phone
    let number_guest = req.body.number_guest
    let cust_date = req.body.cust_date
    let cust_time = req.body.cust_time
    let cust_message = req.body.cust_message

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
         console.log("THIS IS FNAME", cust_fname);
        console.log("THIS IS PHONE",cust_phone);
        res.redirect('/restaurant/DineV2');
    }).catch(err => console.log(err))
});

// Create Contact Form

router.post('/createContact', (req,res) => {
    let contact_name = req.body.contact_name
    let contact_email = req.body.contact_email
    let contact_subject = req.body.contact_subject
    let contact_message = req.body.contact_message

    Contact.create({
        contact_name,
        contact_email,
        contact_subject,
        contact_message
    }).then((contact) => {
        res.redirect('/restaurant/DineV2');
    }).catch(err => console.log(err))

});



module.exports = router;