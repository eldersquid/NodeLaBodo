const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Productcat = require('../models/Productcat');
const Inventory = require('../models/Inventory');
const Room = require('../models/Room');

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

router.post('/booked', (req, res) => {
	let bookInDate = req.body.bookInDate;
	let bookOutDate = req.body.bookOutDate;
	let roomType = req.body.roomType;
	// let addItems = req.body.addItems;
	let name = req.body.name;
	let username = req.body.username;
	let package_deal = req.body.package_deal;
	let roomNo = req.body.roomNo;

	Room.create({
		bookInDate,
		bookOutDate,
		roomType,
		name,
		username,
		package_deal,
		roomNo

	}).then((room)=> {
		res.redirect('/rooms/bookingCart/' + room.id);



	}).catch(err => console.log(err))

});

router.get('/bookingCart/:id', (req, res) => {
	const title = 'Booking Cart';
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  })
		.then((room) => {
		  
		  res.render("rooms/cart", {
			room, 
			layout: "blank",
			title: title,
			
		  });
		})
		.catch((err) => console.log(err)); 
	});





module.exports = router;
