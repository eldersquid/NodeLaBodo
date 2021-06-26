const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');


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
        res.redirect('/restaurant/DineV2');
    }).catch(err => console.log(err))
});




module.exports = router;