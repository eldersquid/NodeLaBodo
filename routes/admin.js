const { google } = require('googleapis');
const cors = require('cors');
const express = require('express');
const app = express();
const request = require('request');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');
const axios = require('axios');
const queryParse = require('query-string');
const urlParse = require('url-parse');
const { trafficdirector } = require('googleapis/build/src/apis/trafficdirector');
const fs = require('fs');
const upload = require('../helpers/hospitalLogo');
const Hospital = require('../models/Hospital');
const moment = require('moment');
const methodOverride = require('method-override');
const Swal = require('sweetalert2');
// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));




//440621396466-esnk2ehi54ki6fkoh4scomu9r285iolg.apps.googleusercontent.com remember to delete this

//KH6OEAEGnreCHUPn7EV0KJKO remember to delete this

//https://cors-anywhere.herokuapp.com/
// go here every day or when the day of testing comes to enable api calls!!

app.use(cors());



router.get("/hospitalList", (req, res) => {
  const title = "Hospitals";

  Hospital.findAll({
    order: [["id", "ASC"]],
    raw: true,
  })
    .then((hospitals) => {
      res.render("admin/hospital/hospital_list", {
        layout: "admin",
        title: title,
        hospitals: hospitals,
      });
    })
    .catch((err) => console.log(err));
});
	

router.get('/hospitalSearch', cors(), (req, res) => {
	const title = "Search Hospital";
	res.render('admin/hospital/hospital_search', {
		layout: "admin",
		title: title,
		Swal : Swal
	});
	

});




router.post('/hospitalCreate', cors(), (req, res) => {
	let js_data = req.body.hospital1;
	const title = "Create Hospital";
	console.log(js_data);
	res.render('admin/hospital/hospital_create', { 
		layout: "admin",
		title: title,
		js_data : js_data
	});


});

router.post('/hospitalCreated', cors(), (req, res) => {
	let hospitalName = req.body.name;
	let address = req.body.address;
	let photo = req.body.photoURL;
	let contactNo = req.body.contact;
	let website = req.body.website;
	let placeID = req.body.google_location;

	Hospital.create({
		placeID,
		photo,
		hospitalName,
		address,
		contactNo,
		website


	}).then((hospital)=> {
		res.redirect('/admin/hospitalList');



	}).catch(err => console.log(err))

});

router.get("/hospitalProfile/:id", (req, res) => {
  const title = "Edit Profile";
  Hospital.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((hospital) => {
      let place_ID = hospital.placeID;
      res.render("admin/hospital/hospitalProfile", {
        hospital, 
        layout: "admin",
        title: title,
		place_ID : place_ID
      });
    })
    .catch((err) => console.log(err)); 
});

router.get("/hospitalEdit/:id", (req, res) => {
	const title = "Edit Hospital Details";
	Hospital.findOne({
	  where: {
		id: req.params.id,
	  },
	})
	  .then((hospital) => {
		let place_ID = hospital.placeID;
		// call views/video/editVideo.handlebar to render the edit video page
		res.render("admin/hospital/hospital_edit", {
		  hospital, // passes video object to handlebar
		  layout: "admin",
		  title: title,
		  place_ID : place_ID
		});
	  })
	  .catch((err) => console.log(err)); // To catch no video ID
  });

router.put('/hospitalEdited/:id', (req, res) => {
	let hospitalName = req.body.name;
	let address = req.body.address;
	let photo = req.body.photoURL;
	let contactNo = req.body.contact;
	let website = req.body.website;
	let placeID = req.body.google_location;
	Hospital.update({
		placeID,
		photo,
		hospitalName,
		address,
		contactNo,
		website
	}, {
	where: {
	id: req.params.id
	}
	}).then(() => {
	// After saving, redirect to router.get(/listVideos...) to retrieve all updated
	// videos
	res.redirect('/admin/hospitalList');
	}).catch(err => console.log(err));
	});
	


router.post('/hospitalLogoUpload', (req, res) => {
	let js_data = res.body;
	console.log(js_data);
	// Creates user id directory for upload if not exist
	if (!fs.existsSync("./public/hospitalLogos/")){
	fs.mkdirSync("./public/hospitalLogos/");
	}
	upload(req, res, (err) => {
	if (err) {
	res.json({file: '/img/hospital.jpeg', err: err});
	} else {
	if (req.file === undefined) {
	res.json({file: '/img/hospital.jpeg', err: err});
	} else {
	res.json({file: `/hospitalLogos/${req.file.filename}`});
	}
	}
	});
	})

router.get('/hospitalDelete/:id', (req, res) => {
		let id = req.params.id;
		// Select * from videos where videos.id=videoID and videos.userId=userID
		Hospital.findOne({
			where: {
				id: id,
			},
			attributes: ['id']
		}).then((hospital) => {
			// if record is found, user is owner of video
			if (hospital != null) {
				Hospital.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.redirect('/admin/hospitalList'); // To retrieve all videos again
				}).catch(err => console.log(err));
			} else {
				alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
				
			}
		});
	});

router.post('/hospitalReset', (req, res) => {
		// Select * from videos where videos.id=videoID and videos.userId=userID
		Hospital.destroy({
			truncate : true
		}).then(() => {
			res.redirect('/admin/hospitalList');
		});
	});


router.get('/VehicleList', (req, res) => {
	const title = 'Vehicles';

	res.render('admin/vehicles/vehicle_list', {
		layout: "admin",
		title: title
	});

});

router.get('/vehicleCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/vehicles/vehicle_create', {
		layout: "admin",
		title: title
	});


});

router.get('/vehicleCreated', (req, res) => {
	res.render('admin/vehicles/vehicle_list',
		{ layout: "admin" });


});

router.get('/requestList', (req, res) => {
	const title = 'Requests';

	res.render('admin/requests/request_list', {
		layout: "admin",
		title: title
	});

});

router.get('/requestCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/requests/request_create', {
		layout: "admin",
		title: title
	});


});

router.get('/requestCreated', (req, res) => {
	res.render('admin/requests/request_list',
		{ layout: "admin" });


});

router.get('/galleryList', (req, res) => {
	const title = 'View Gallery';
	res.render('admin/gallery/gallery_list', {
		layout: "admin",
		title: title
	});

});

router.get('/galleryRequests', (req, res) => {
	const title = 'Gallery Requests';
	res.render('admin/gallery/gallery_requests', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesGym', (req, res) => {
	const title = 'Gym Bookings';
	res.render('admin/facilities/facilities_gym', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesSwimming', (req, res) => {
	const title = 'Swimming Pool Bookings';
	res.render('admin/facilities/facilities_swimming', {
		layout: "admin",
		title: title
	});

});

module.exports = router;
