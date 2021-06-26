const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');

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
            res.render('reservation/viewReservation', {
                layout: "admin",
                title: title,
                reservation:reservation
            });
        })
        .catch(err => console.log(err));
})

router.get('/updateReservation/:id', (req,res) => {
    const title = 'updateReservation';
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
            res.render('reservation/updateReservation', {
                layout: "admin",
                title: title,
                reservation:reservation
            });
        })
        .catch(err => console.log(err));
})

router.put('/updateReservation', (req, res) => {
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
            // id: req.params.id
        }
    }).then(() => {
        res.redirect('reservation/updateReservation'); // redirect to call router.get(/listSupplier...) to retrieve all updated
        // supplier
    }).catch(err => console.log(err));
});

module.exports = router;