const express = require('express');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');


router.get('/', (req, res) => {
	const title = 'Home Page';
	res.render('home', {title: title
	}) // renders views/index.handlebars
});

// User View Restaurant 
router.get('/Dine', (req, res) => {
    res.render('restaurant/Dining&Bar')
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


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});




module.exports = router;
