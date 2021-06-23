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
        res.redirect('/DineV2');
    }).catch(err => console.log(err))
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});




module.exports = router;