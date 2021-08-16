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
const roomUpload = require('../helpers/roomTypePictures');
const Hospital = require('../models/Hospital');
const RoomType = require('../models/RoomType');
const moment = require('moment');
const methodOverride = require('method-override');
const Swal = require('sweetalert2');
const alertMessage = require('../helpers/messenger');
// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));
const dialogflow = require('@google-cloud/dialogflow');
var thesaurus = require('thesaurus');
const CREDENTIALS = JSON.parse(fs.readFileSync('credentials/hotel-la-bodo-5338d4f99b8b.json'));
const PROJECTID = CREDENTIALS.project_id;


const CONFIGURATION = {
	credentials : {
		private_key : CREDENTIALS['private_key'],
		client_email : CREDENTIALS['client_email']

	}


}



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

router.get("/typeList", (req, res) => {
	const title = "Room Type";
  
	RoomType.findAll({
	  order: [["type_id", "ASC"]],
	  raw: true,
	})
	  .then((roomType) => {
		res.render("admin/roomType/roomType_list", {
		  layout: "admin",
		  title: title,
		  roomType,
		});
	  })
	  .catch((err) => console.log(err));
  });


  router.get('/typeDelete/:id', (req, res) => {
	let id = req.params.id;
	// Select * from videos where videos.id=videoID and videos.userId=userID
	RoomType.findOne({
		where: {
			type_id: id,
		},
		attributes: ['type_id']
	}).then((roomType) => {
		// if record is found, user is owner of video
		if (roomType != null) {
			roomType.destroy({
				where: {
					type_id: id
				}
			}).then(() => {
				res.redirect('/admin/typeList'); // To retrieve all videos again
			}).catch(err => console.log(err));
		} else {
			alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
			
		}
	});
});

router.post('/roomPictureUpload', (req, res) => {
	let js_data = res.body;
	console.log(js_data);
	// Creates user id directory for upload if not exist
	if (!fs.existsSync("./public/roomPictures/")){
	fs.mkdirSync("./public/roomPictures/");
	}
	roomUpload(req, res, (err) => {
	if (err) {
	res.json({file: '/img/hotel.jpeg', err: err});
	console.log("Error.")
	} else {
	if (req.file === undefined) {
	res.json({file: '/img/hotel.jpeg', err: err});
	console.log("Undefined.")
	} else {
	res.json({file: `/roomPictures/${req.file.filename}`});
	}
	}
	});
	})




	

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

router.get('/typeCreate', cors(), (req, res) => {
	const title = "Create Room Type";
	res.render('admin/roomType/type_create', { 
		layout: "admin",
		title: title,
		RoomType
	});


});

router.post('/typeCreated', (req, res) => {
    let type = req.body.type;
	console.log("This is room type : ");
	console.log(type);
    let roomName = req.body.roomName;
    let description = req.body.description;
    let roomPrice = req.body.roomPrice;
    let photo = req.body.photoURL;
	let minRoomNo = req.body.minRoomNo;
	let maxRoomNo = req.body.maxRoomNo;
    RoomType.findOne({
        where: {
            type
        }
    }).then(roomType => {
        if (roomType) {
            const title = 'Create Room Type';
            res.render('admin/roomType/type_create', {
                layout: "admin",
                title: title,
                error: alertMessage(res, 'danger', ' ' + roomType.type + ' already available. ', 'fas fa-exclamation-circle', true)
            })

        } else {
			console.log("Else statement")
            RoomType.create({
                type,
                roomName,
                description,
                roomPrice,
                roomImage:photo,
				minRoomNo,
				maxRoomNo
            }).then(roomType => {
                alertMessage(res, 'success', ' ' + roomType.type + ' created. ', 'fas fa-sign-in-alt', true);
                res.redirect('/admin/typeList');
            }).catch(err => console.log(err))
        }
    })
});

router.get("/typeEdit/:id", (req, res) => {
	const title = "Edit Hospital Details";
	RoomType.findOne({
	  where: {
		type_id: req.params.id,
	  },
	})
	  .then((roomType) => {
		
		// call views/video/editVideo.handlebar to render the edit video page
		res.render("admin/roomType/type_edit", {
		  roomType, // passes video object to handlebar
		  layout: "admin",
		  title: title,
		  
		});
	  })
	  .catch((err) => console.log(err)); // To catch no video ID
  });

router.put('/typeEdited/:id', (req, res) => {
	let type = req.body.type;
	let roomName = req.body.roomName;
	let roomImage = req.body.roomImage;
	let description = req.body.description;
	let roomPrice = req.body.roomPrice;
	let minRoomNo = req.body.minRoomNo;
	let maxRoomNo = req.body.maxRoomNo;
	RoomType.update({
		type,
		roomName,
		roomImage,
		description,
		roomPrice,
		minRoomNo,
		maxRoomNo
	}, {
	where: {
	type_id: req.params.id
	}
	}).then(() => {
	// After saving, redirect to router.get(/listVideos...) to retrieve all updated
	// videos
	res.redirect('/admin/typeList');
	}).catch(err => console.log(err));
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

// [START dialogflow_create_intent]

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const projectId = 'The Project ID to use, e.g. 'YOUR_GCP_ID';
// const displayName = 'The display name of the intent, e.g. 'MAKE_RESERVATION';
// const trainingPhrasesParts = 'Training phrases, e.g. 'How many people are staying?';
// const messageTexts = 'Message texts for the agent's response when the intent is detected, e.g. 'Your reservation has been confirmed';

// Imports the Dialogflow library

// Instantiates the Intent Client



// trainingPhrasesParts = [
//     'Hello, What is weather today?',
//     'How is the weather today?',
//   ],
//   messageTexts = ['Rainy', 'Sunny']

async function createIntent(PROJECTID,displayName,trainingPhrasesParts,messageTexts) {
	// Construct request
	const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);
	// The path to identify the agent that owns the created intent.
	const agentPath = intentsClient.projectAgentPath(PROJECTID);

	const trainingPhrases = [];

	trainingPhrasesParts.forEach(trainingPhrasesPart => {
	const part = {
		text: trainingPhrasesPart,
	};

	// Here we create a new training phrase for each provided part.
	const trainingPhrase = {
		type: 'EXAMPLE',
		parts: [part],
	};

	trainingPhrases.push(trainingPhrase);
	});

	const messageText = {
	text: messageTexts,
	};

	const message = {
	text: messageText,
	};

	const intent = {
	displayName: displayName,
	trainingPhrases: trainingPhrases,
	messages: [message],
	};

	const createIntentRequest = {
	parent: agentPath,
	intent: intent,
	};

	// Create the intent
	const [response] = await intentsClient.createIntent(createIntentRequest);
	console.log(`Intent ${response.name} created`);
}



// createIntent(PROJECTID,"MAKE_RESERVATION",["Where to get reservation?","I wanna eat bitch","GIMME FOOD LOL"],["Shut up nibbas"]);











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
