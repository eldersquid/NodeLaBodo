const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Productcat = require('../models/Productcat');
const Inventory = require('../models/Inventory');
const Room = require('../models/Room');
const paypal = require('paypal-rest-sdk');

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'Ac9YmuteFWmcjwxa_RCQzbn-XMY_FhJ6rS-beZ7UeVhOQ8WX3wQ8VsuJ7rUS8u5Fv1yVaMdk_RhYCXph',
	'client_secret': 'EBJ5PKk869ZpXH7lk7b9kxGLYi9RyR5qyFnBU6vClMW30Vt8unxs2r7Clro38TcdqvdxkmA3MABKOaAv'
  });

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
	let price = req.body.price;
	let roomType = req.body.roomType;
	if (roomType == "Apartment") {
		var roomNo = Math.floor(Math.random() * 100) + 201;
	  } else if (roomType == "Small Room") {
		var roomNo = Math.floor(Math.random() * 101) + 100;
	  } else if (roomType == "Big Apartment") {
		var roomNo = Math.floor(Math.random() * 100) + 301;
	  } else if (roomType == "Villa") {
		var roomNo = Math.floor(Math.random() * 100) + 401;
	  }
	console.log(BookInDate);
	res.render('rooms/booking_details', {title: title,
		layout : "blank",
		BookInDate : BookInDate,
		BookOutDate : BookOutDate,
		price : price,
		roomNo : roomNo
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
	let price = req.body.price;
	let paid = 0;

	Room.create({
		bookInDate,
		bookOutDate,
		roomType,
		name,
		username,
		package_deal,
		roomNo,
		price,
		paid

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

router.post('/payPal/:id', (req,res) => {
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  })
		.then((room) => {
			if (room.roomType == "Apartment") {
				var price = "500.00";
			  } else if (room.roomType == "Small Room") {
				var price = "300.00";
			  } else if (room.roomType == "Big Apartment") {
				var price = "700.00";
			  } else if (room.roomType == "Villa") {
				var price = "1000.00";
			  }
			const create_payment_json = {
				"intent": "sale",
				"payer": {
					"payment_method": "paypal"
				},
				"redirect_urls": {
					"return_url": "http://localhost:5000/rooms/paySuccess/"+ room.id,
					"cancel_url": "http://localhost:5000/rooms/"
				},
				"transactions": [{
					"item_list": {
						"items": [{
							"name": room.roomType,
							"sku": room.roomNo,
							"price": price,
							"currency": "SGD",
							"quantity": 1
						}]
					},
					"amount": {
						"currency": "SGD",
						"total": price
					},
					"description": "Hotel Booking Payment using PayPal"
				}]
			};
			paypal.payment.create(create_payment_json, function (error, payment) {
				if (error) {
					throw error;
				} else {
					let paid = 1;
					Room.update({
						paid
					}, {
					where: {
					id: req.params.id
					}
					}).then(() => {
					// After saving, redirect to router.get(/listVideos...) to retrieve all updated
					// videos
					for (var i = 0; i < payment.links.length;i++) {
						if (payment.links[i].rel === "approval_url"){
							console.log("Create Payment Response");
							console.log(payment);
							res.redirect(payment.links[i].href);
							
							
							



						}



					}
					});
					
					
					
				}
			});


		  
		})
		.catch((err) => console.log(err)); 
	});

router.get('/paySuccess/:id', (req, res) => {
	const title = 'Success Payment';
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  })
		.then((room) => {
		if (room.roomType == "Apartment") {
				var price = "500.00";
			  } else if (room.roomType == "Small Room") {
				var price = "300.00";
			  } else if (room.roomType == "Big Apartment") {
				var price = "700.00";
			  } else if (room.roomType == "Villa") {
				var price = "1000.00";
			  }
		const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "SGD",
				"total": price
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
			res.redirect('/rooms/success');
		}
	});
	})
		.catch((err) => console.log(err)); 

	
	



});

router.get('/success', (req, res) => {
	const title = 'Success!';
	res.render('rooms/success', {
		title: title,
		layout : "blank",
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
	layout : "admin",
	title : title,
	room: room
	});
	})
	.catch(err => console.log(err));
	});


	router.get('/bookingDelete/:id', (req, res) => {
		let id = req.params.id;
		Room.findOne({
			where: {
				id: id,
			},
			attributes: ['id']
		}).then((room) => {
			// if record is found, user is owner of video
			if (room != null) {
				Room.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.redirect('/rooms/bookingList'); // To retrieve all videos again
				}).catch(err => console.log(err));
			} else {
				alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
				
			}
		});
	});


module.exports = router;
