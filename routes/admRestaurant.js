const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const foodPic = require('../helpers/foodPicture.js');
const Contact = require('../models/Contact');
const Response = require('../models/Response');
const FoodCart = require('../models/FoodCart');
const multer = require('multer');
const path = require('path');
// Required for file upload
// const fs = require('fs');
// const upload = require('../helpers/imageUpload');
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const FoodGallery = require('../models/FoodGallery');
 


const CLIENT_ID = '188467906173-a5cq8hviitnaanin3cmag7el6kkqrcru.apps.googleusercontent.com'
const CLIENT_SECRET = '9bCtMjwKlgz9oAd9H4kPS8pF'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//043zEL3Pauc7vCgYIARAAGAQSNwF-L9IrjZn7SQZi6rODY4tf1Pk33-sx9_tuhG3d4TNnFMxKLwIw_EdkRMbRDp7XxlHz_oQOYVc';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toEmail, toSubject, toMessage) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'hotel.la.bodo@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: "Hotel La Bodo <hotel.la.bodo@gmail.com>",
            to: toEmail,
            subject: "RE:" + toSubject,
            text: toMessage,
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        
        return error
    }
};

// View Reservation
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

// Update Reservation
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

// Delete Reservation
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

// Upload poster
// router.post('/upload', ensureAuthenticated, (req, res) => {
// 	// Creates user id directory for upload if not exist
// 	if (!fs.existsSync('./public/uploads/' + req.user.id)){
// 		fs.mkdirSync('./public/uploads/' + req.user.id);
// 	}
	
// 	upload(req, res, (err) => {
// 		if (err) {
// 			res.json({file: '/img/no-image.jpg', err: err});
// 		} else {
// 			if (req.file === undefined) {
// 				res.json({file: '/img/no-image.jpg', err: err});
// 			} else {
// 				res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
// 			}
// 		}
// 	});
// })

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

// Delete Contact Us
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

// Create Response
router.get('/createResponse/:id', (req,res) => {
    const title = 'contact';
    console.log(req.params.id)
    Contact.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((contact) => {
            console.log(contact);
            res.render('admRestaurant/createResponse', {
                layout: "admin",
                title: title,
                contact:contact
            });
        }).catch(err => console.log(err));
})

router.post('/createResponse', (req,res) => {
    let toEmail = req.body.toEmail
    let toSubject = req.body.toSubject
    let toMessage = req.body.toMessage

    console.log(toEmail);

    Response.create({
        toEmail,
        toSubject,
        toMessage
    }).then((response) => {
        sendMail(toEmail, toSubject, toMessage).then(result => console.log('Email sent...', result))
            .catch(error => console.log(error.message));
        res.redirect('/admRestaurant/viewResponse');
    }).catch(err => console.log(err))

});

// view Response
router.get('/viewResponse', (req,res) => {
    const title = 'Response';
    Response.findAll({
        where: {
            // adminId: req.params.id
        }, 
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((response) => {
            console.log(response);
            res.render('admRestaurant/viewResponse', {
                layout: "admin",
                title: title,
                response:response
            });
        })
        .catch(err => console.log(err));
})

// Delete Response
router.get('/deleteResponse/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Response.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((response) => {
        // if record is found, user is owner of video
        if (response != null) {
            response.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewResponse'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
            
        }
    });
});

// Upload Picture
router.post('/Foodupload', (req, res) => {
	let foodpic_data = req.body.trueFilePicture;
	const title = "Upload Food Pictures";
    FoodGallery.create({
        foodPhoto:foodpic_data
    })
	// res.render('admRestaurant/viewFoodGallery', { 
	// 	layout: "admin",
	// 	title: title,
	// 	foodpic_data : foodpic_data
	// });
        .then((foodgallery) => {
            res.redirect('/admRestaurant/viewFoodGallery');
        }).catch(err => console.log(err));


});

// Upload picture inside the folder
router.post('/foodPic', (req, res) => {
    foodPic(req, res, async (err) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (req.file === undefined) {
                console.log("The file is undefine.");
                res.json({ err: err });
            } else {
                 res.json({ file: `${req.file.filename}`, path: '/foodPictures/' + `${req.file.filename}` });
                // res.json({file: `/foodPictures/${req.file.filename}`});
            }
        }
    });
});

// Update Picture
router.post('/updateFoodPic/:id', (req, res) => {
    let foodPhoto = req.body.foodPhoto;

    FoodGallery.update({

    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/admRestaurant/viewFoodGallery'); 
as
    }).catch(err => console.log(err));
});


// View Uploaded Images 
router.get('/viewFoodGallery', (req,res) => {
    const title = 'FoodGallery';
    FoodGallery.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((foodgallery) => {
            res.render('admRestaurant/viewFoodGallery', {
                layout: "admin",
                title: title,
                foodgallery:foodgallery
            });
        })
        .catch(err => console.log(err));
});



// Delete Picture
router.get('/deleteFoodGallery/:id', (req, res) => {
    let id = req.params.id;
    FoodGallery.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((foodgallery) => {
        // if record is found, user is owner of video
        if (foodgallery != null) {
            foodgallery.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewFoodGallery'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
            
        }
    });
});

// Set The Storage Engine
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/uploads/' + '/');
	},
	filename: (req, file, callback) => {
		callback(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
	}
});

// View Uploaded Images for Menu
router.get('/viewFoodCart', (req,res) => {
    const title = 'FoodCart';
    FoodCart.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((foodcart) => {
            res.render('admRestaurant/viewFoodCart', {
                layout: "admin",
                title: title,
                foodcart:foodcart
            });
        })
        .catch(err => console.log(err));
});

// Upload Picture
router.post('/UploadMenu', (req, res) => {
	let cardPhoto_data = req.body.trueFilePicture;
    let cardName = req.body.cardName
    let cardPrice = req.body.cardPrice
	const title = "Upload Food Menu";
    FoodCart.create({
        cardName,
        cardPrice,
        cardPhoto : cardPhoto_data

    }).then((foodcart) => {
            res.redirect('/admRestaurant/viewFoodCart');
        }).catch(err => console.log(err));


});
module.exports = router;