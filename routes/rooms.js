const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Hotel Rooms';
	res.render('rooms/hotel_rooms', {title: title
	    }) // renders views/index.handlebars
});

router.get('/apartment', (req, res) => {
	const title = 'Apartment';
	res.render('rooms/apartment', {title: title
	    }) // renders views/index.handlebars
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
