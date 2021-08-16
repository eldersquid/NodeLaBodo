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

// User View Restaurant 
// router.get('/DineV2', (req, res) => {
//     res.render('restaurant/DineV2', {
//         layout: "blank",
//     });
// });

// User View Menu



router.get("/Menu", (req, res) => {
    const title = "Menu";
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
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

  router.post('/payPal', (req,res) => {
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
					for (var i = 0; i < payment.links.length;i++) {
						if (payment.links[i].rel === "approval_url"){
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

// Create Contact Form

router.post('/createContact', (req,res) => {
    let contact_name = req.body.contact_name
    let contact_email = req.body.contact_email
    let contact_subject = req.body.contact_subject
    let contact_message = req.body.contact_message
    console.log("NAME: ", contact_name);

    Contact.create({
        contact_name,
        contact_email,
        contact_subject,
        contact_message
    }).then((contact) => {
        if (contact_name == contact_name | contact_email == contact_email | contact_subject == contact_subject | contact_message == contact_message){
            Swal.fire(
                'Submitted!',
                'Respone Recieved!',
                'success').then((result) => {
                    if (result.isConfirmed) {
                        $("#contact2").submit();
                    }
                });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                button: 'Ok'
            });
        }
        res.redirect('/restaurant/DineV2');
    }).catch(err => console.log(err))

});

router.get('/DineV2', (req,res) => {
    const title = 'foodgallery';
    FoodGallery.findAll({
        raw: true
    })
        .then((foodgallery) => {
            console.log("hello",foodgallery);
            const gallleryList = [];
            for (var i in foodgallery){
                gallleryList.push(foodgallery[i]);
                console.log(gallleryList);
            }
            res.render('restaurant/DineV2', {
                layout: "blank",
                title: title,
                foodgallery:foodgallery
            });
        }).catch(err => console.log(err));
})

module.exports = router;