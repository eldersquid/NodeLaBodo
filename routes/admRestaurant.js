const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const Contact = require('../models/Contact');

router.get('/viewReservation', (req,res) => {
    const title = 'Reservation';
    Reservation.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            console.log(reservation);
            res.render('admRestaurant/viewReservation', {
                layout: "admin",
                title: title,
                reservation:reservation
            });
        })
        .catch(err => console.log(err));
})

router.get('/updateReservation/:id', (req,res) => {
    const title = 'updateReservation';
    console.log(req.params.id)
    Reservation.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            console.log(reservation);
            res.render('admRestaurant/updateReservation', {
                layout: "admin",
                title: title,
                reservation:reservation
            });
        }).catch(err => console.log(err));
})

router.post('/updateReservation/:id', (req, res) => {
    let cust_fname = req.body.cust_fname;
    let cust_lname = req.body.cust_lname;
    let cust_email = req.body.cust_email;
    let cust_phone = req.body.cust_phone;
    let number_guest = req.body.number_guest;
    let cust_date = req.body.cust_date;
    let cust_time = req.body.cust_time;
    let cust_message = req.body.cust_message;

    Reservation.update({
        cust_fname,
        cust_lname,
        cust_email,
        cust_phone,
        number_guest,
        cust_date,
        cust_time,
        cust_message
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/admRestaurant/viewReservation'); // redirect to call router.get(/listSupplier...) to retrieve all updated
        // reservation
    }).catch(err => console.log(err));
});

router.get('/deleteReservation/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Reservation.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((reservation) => {
        // if record is found, user is owner of video
        if (reservation != null) {
            reservation.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewReservation'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
            
        }
    });
});


// view Contact Us
router.get('/viewContact', (req,res) => {
    const title = 'Contact';
    Contact.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((contact) => {
            console.log(contact);
            res.render('admRestaurant/viewContact', {
                layout: "admin",
                title: title,
                contact:contact
            });
        })
        .catch(err => console.log(err));
})

router.get('/deleteContact/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Contact.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((contact) => {
        // if record is found, user is owner of video
        if (contact != null) {
            contact.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewContact'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
            
        }
    });
});

module.exports = router;