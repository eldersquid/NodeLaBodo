const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');

// router.get('/viewReservation', (req, res) => {
//     const title = 'Reservation';

//     res.render('reservation/viewReservation', {
//         layout: "admin",
//         title: title
//     });

// });





router.get('/viewReservation', (req,res) => {
    // const title: 'Reservation';
    Reservation.findAll({
        where: {
            reservationID: req.reservation.id
        },
        order: [
            [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            res.render('reservation/viewReservation', {
                layout: "blank",
                title: title
            });
        })
        .catch(err => console.log(err));
})

module.exports = router;