const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Productcat = require('../models/Productcat');
const Inventory = require('../models/Inventory');


router.get('/', (req, res) => {
	const title = 'Hotel Rooms';
	res.render('rooms/hotel_rooms', {
		title: title,
		layout : "thalia",
	    }) // renders views/index.handlebars
});

router.get('/apartment', (req, res) => {
	const title = 'Apartment';
	Inventory.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    })
        .then((inventory) => {
            
            res.render('rooms/apartment', {
				title: title,
				layout : "thalia",
				inventory
				})
        })
        .catch(err => console.log(err));
});


router.post('/bookingDetails', (req, res) => {
	const title = 'Complete Booking';
	let BookInDate = req.body.BookInDate;
	let BookOutDate = req.body.BookOutDate;
	console.log(BookInDate);
	res.render('rooms/booking_details', {title: title,
		layout : "blank",
		BookInDate : BookInDate,
		BookOutDate : BookOutDate
	    }) // renders views/index.handlebars
});





module.exports = router;
