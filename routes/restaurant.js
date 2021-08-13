const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const Swal = require('sweetalert2');
const Contact = require('../models/Contact');
const FoodCart = require('../models/FoodCart');
const Response = require('../models/Response');
const FoodGallery = require('../models/FoodGallery');

// User View Restaurant 
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