// view Contact Us

const express = require('express');
const router = express.Router();
const Facilities = require('../models/Facilities');


// const Response = require('../models/Response');

// User View Restaurant 
router.get('/viewFac', (req, res) => {
    res.render('facilities/viewFac', {
        layout: "blank",
    });
});


// User View Menu
router.get('/viewGyms', (req, res) => {
    res.render('facilities/viewGyms', {
        layout: "blank",
    });
});

router.get('/viewSwim', (req, res) => {
    res.render('facilities/viewSwim', {
        layout: "blank",
    });
});

router.get('/bookGyms', (req, res) => {
    res.render('facilities/bookGyms', {
        layout: "blank",
    });
});

router.get('/tempbookGyms', (req, res) => {
    res.render('facilities/tempbookGyms', {
        layout: "blank",
    });
});

router.get('/bookSwim', (req, res) => {
    res.render('facilities/bookSwim', {
        layout: "blank",
    });
});

router.get('/testig', (req, res) => {
    res.render('facilities/instaGallery', {
        layout: "blank",
    });
});
//Create reservation 
router.post('/bookGym', (req, res) => {
    let fac_date = req.body.fac_date
    let fac_type = req.body.fac_type
    let fac_num = req.body.fac_num
    let fac_time = req.body.fac_time
    let fac_email = req.body.fac_email
    let fac_name = req.body.fac_name

    Facilities.create({
        fac_date,
        fac_type,
        fac_num,
        fac_time,
        fac_email,
        fac_name
    }).then((facilities) => {
        res.redirect('/facilities/bookGyms');
    }).catch(err => console.log(err))
});

// const facdate = document.getElementById('date')
// const factype = document.getElementById('fac_type')
// const facnum = document.getElementById('fac_num')
// const factime = document.getElementById('fac_time')
// const facemail = document.getElementById('fac_email')
// const facname = document.getElementById('fac_name')

// format.addEventListener('submit', (e) => {
//     let messages = []
//     if (facname.value === '' || this.name.value == null) {
//         messages.push('Name is required')
//     }

//     if (facemail.value ){

//     }
//     if (facnum.value.length > 8){
//         messages.push('Invalid phone number')
//     }
// })

module.exports = router;