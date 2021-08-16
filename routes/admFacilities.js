const express = require('express');
const router = express.Router();
const Facilities = require('../models/Facilities');
const alertMessage = require('../helpers/messenger.js');


router.get('/viewFacilities', (req,res) => {
    const title = 'Facilities';
    Facilities.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [facilities.id, 'ASC']
        ],
        raw: true
    })
        .then((facilities) => {
            console.log(facilities);
            res.render('admFacilities/viewFacilities', {
                layout: "admin",
                title: title,
                facilities:facilities
            });
        })
        .catch(err => console.log(err));
})

router.get('/updateFacilities/:id', (req,res) => {
    const title = 'updateFacilities';
    console.log(req.params.id)
    Facilities.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [facilities.id, 'ASC']
        ],
        raw: true
    })
        .then((facilities) => {
            console.log(facilities);
            res.render('admFacilities/updateFacilities', {
                layout: "admin",
                title: title,
                facilities:facilities
            });
        }).catch(err => console.log(err));
})
router.post('/updateFacilities/:id', (req, res) => {
    let fac_name = req.body.fac_name;
    let fac_email = req.body.fac_email;
    let fac_num = req.body.fac_num;
    let fac_date = req.body.fac_date;
    let fac_time = req.body.fac_time;

    Facilities.update({
        fac_name,
        fac_email,
        fac_num,
        fac_date,
        fac_time
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/admFacilities/viewFacilities'); // redirect to call router.get(/listSupplier...) to retrieve all updated
        // reservation
    }).catch(err => console.log(err));
});

router.get('/deleteFacilities/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Facilities.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((facilities) => {
        // if record is found, user is owner of video
        if (facilities != null) {
            facilities.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admFacilities/viewFacilities'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});


// view Contact Us
module.exports = router;