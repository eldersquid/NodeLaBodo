const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');

router.get('/viewReservation', (req,res) => {
    // const title: 'Reservation';
    Reservation.findAll({
        where: {
            adminId: req.admin.id
        },
        order: [
            [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            res.render('reservation/viewReservation', {
                layout: "admin",
                title: title
            });
        })
        .catch(err => console.log(err));
})

module.exports = router;