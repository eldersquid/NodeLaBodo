const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const dialogflow = require('@google-cloud/dialogflow'); // Danish's Chatbot woo
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const Hospital = require('../models/Hospital');
const paypal = require('paypal-rest-sdk');
const methodOverride = require('method-override');

const CREDENTIALS = JSON.parse(fs.readFileSync('credentials/hotel-la-bodo-5338d4f99b8b.json')); //Danish's Google Service Account created for Chatbot
const PROJECTID = CREDENTIALS.project_id;


const CONFIGURATION = {
	credentials : {
		private_key : CREDENTIALS['private_key'],
		client_email : CREDENTIALS['client_email']

	}


}


// CHATBOT FUNCTIONS !!! DO NOT DELETE UNLESS NECESSARY!! //

async function runSample(question) {
	// A unique identifier for the given session
	var sessionId = "123"
	// Create a new session
	const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
	const sessionPath = sessionClient.projectAgentSessionPath(
	  PROJECTID,
	  sessionId
	);
  
	// The text query request.
	const request = {
	  session: sessionPath,
	  queryInput: {
		text: {
		  // The query to send to the dialogflow agent
		  text: question,
		  // The language used by the client (en-US)
		  languageCode: 'en-US',
		},
	  },
	};
  
	// Send request and log result
	const responses = await sessionClient.detectIntent(request);
	console.log('Detected intent');
	const result = responses[0].queryResult;
	console.log(`  Query: ${result.queryText}`);
	console.log(`  Response: ${result.fulfillmentText}`);
	if (result.intent) {
	  console.log(`  Intent: ${result.intent.displayName}`);
	} else {
	  console.log('  No intent matched.');
	}
    return result.fulfillmentText;
  }

  async function createIntent(displayName,trainingPhrasesParts,messageTexts) {
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


// Example of create intent

// createIntent("MAKE_RESERVATION",["Where to get reservation?","I wanna eat","GIMME FOOD LOL"],["Shut up desuu"]);

async function listIntents() {
    // Construct request
    const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);
    // The path to identify the agent that owns the intents.
    const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

    console.log(projectAgentPath);

    const request = {
      parent: projectAgentPath,
    };

    // Send the request for listing intents.
    const [response] = await intentsClient.listIntents(request);
    response.forEach(intent => {
      console.log('====================');
      Object.entries(intent).forEach(entry => {
        const [key, value] = entry;
        console.log(key, value);
      });
      console.log(`Intent name: ${intent.name}`);
      console.log(`Intent display name: ${intent.displayName}`);
      console.log(`Action: ${intent.action}`);
      console.log(`Root folowup intent: ${intent.rootFollowupIntentName}`);
      console.log(`Parent followup intent: ${intent.parentFollowupIntentName}`);
      
      console.log(`Response: ${intent.messages[0].text.text[0]}`);
      
      console.log('Input contexts:');
      intent.inputContextNames.forEach(inputContextName => {
        console.log(`\tName: ${inputContextName}`);
      });

      console.log('Output contexts:');
      intent.outputContexts.forEach(outputContext => {
        console.log(`\tName: ${outputContext.name}`);
      });
    });
  }

  async function updateIntent(newTrainingPhrases) { // WARNING : THIS DELETES ALL AVAILABLE TRAINING PHRASES AND REPLACES THEM WITH NEW ONES
    // Imports the Dialogflow library
    
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);

    const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

    console.log(projectAgentPath);

    const request = {
      parent: projectAgentPath,
    };

    const [response] = await intentsClient.listIntents(request);
    
    const existingIntent = response[0]; // Take in the very first intent for testing purposes

    const intent = existingIntent; //get the intent that needs to be updated from the [response]
  
    const trainingPhrases = [];
    let previousTrainingPhrases =
      existingIntent.trainingPhrases.length > 0
        ? existingIntent.trainingPhrases
        : [];
  
    previousTrainingPhrases.forEach(textdata => {
      newTrainingPhrases.push(textdata.parts[0].text);
    });
  
    newTrainingPhrases.forEach(phrase => {
      const part = {
        text: phrase
      };
  
      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: "EXAMPLE",
        parts: [part]
      };
      trainingPhrases.push(trainingPhrase);
    });
    intent.trainingPhrases = trainingPhrases;

    const updateIntentRequest = {
      intent
      
    };
  
    // Send the request for update the intent.
    const result = await intentsClient.updateIntent(updateIntentRequest);
  
    return result;
  }

// updateIntent(["test statement"]); TEST UPDATE INTENT

async function deleteIntent(existingIntent) { 
    // Imports the Dialogflow library
    
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);

    const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

    console.log(projectAgentPath);

    const request = {
      parent: projectAgentPath,
    };

    var count = 0;
    var targetIntent ="";
    var deleteIntentRequest = {};

    const [response] = await intentsClient.listIntents(request);

    response.forEach(intent => {
        if (intent.displayName == existingIntent){
            targetIntent = intent.name;
            count++;
                
        }}); 

    if (count>0){
        const intent_split = targetIntent.split("/");
        const intentPath = intentsClient.projectAgentIntentPath(PROJECTID, intent_split[(intent_split.length)-1]);
        console.log(intentPath);
        deleteIntentRequest["name"] = intentPath;


    } else {
        return console.log("Not found.");

    }
    
    const result = await intentsClient.deleteIntent(deleteIntentRequest);
    console.log(`${existingIntent} intent is deleted successfully.`);
    return result;  
    

    
  }
// END OF FUNCTIONS //

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

//440621396466-esnk2ehi54ki6fkoh4scomu9r285iolg.apps.googleusercontent.com remember to delete this

//KH6OEAEGnreCHUPn7EV0KJKO remember to delete this

//https://cors-anywhere.herokuapp.com/
// go here every day or when the day of testing comes to enable api calls!!



router.post('/chuuSend',(req,res)=>{
	console.log("Test : ",req.body.chuuMessage);
	runSample(req.body.chuuMessage).then(data =>{
		if (data){
			res.send({reply:data})

		} else {
			console.log("Error.")
		}
		
	}
	)



});



paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'Ac9YmuteFWmcjwxa_RCQzbn-XMY_FhJ6rS-beZ7UeVhOQ8WX3wQ8VsuJ7rUS8u5Fv1yVaMdk_RhYCXph',
	'client_secret': 'EBJ5PKk869ZpXH7lk7b9kxGLYi9RyR5qyFnBU6vClMW30Vt8unxs2r7Clro38TcdqvdxkmA3MABKOaAv'
  });

router.get('/', (req, res) => {
    const title = 'Hotel Rooms';

    RoomType.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['type_id', 'ASC']
        ],
        raw: true
    })
        .then((roomType) => {
            // pass object to listVideos.handlebar
            res.render('rooms/hotel_rooms', {
                layout: "thalia",
                title: title,
                roomType
            });
        })
        .catch(err => console.log(err));

});

router.get('/details/:type_id', (req, res) => {
    const title = "Room Details";

    RoomType.findOne({
        where: {
            type_id: req.params.type_id
        },
        raw: true
    }).then((roomType) => {
        if (!roomType) { // check video first because it could be null.
            alertMessage(res, 'info', 'No such room found', 'fas fa-exclamation-circle', true);
            res.redirect('/');
        } else {
			Inventory.findAll({
				where: {
					// adminId: req.admin.id
				},
				order: [
					['inventory_id', 'ASC']
				],
				raw: true
			})
				.then((inventory) => {
					
					res.render('rooms/roomDetails', {
						title: title,
						layout : "thalia",
						inventory,
						roomType
						});
					
				})
				.catch(err => console.log(err));
            // Only authorised user who is owner of video can edit it
            // if (req.user.id === video.userId) {
            //     checkOptions(video);
            // } else {
            //     alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
            //     res.redirect('/logout');
            // }
        }
    }).catch(err => console.log(err)); // To catch no video ID
});

router.get('/apartment', (req, res) => {
	const title = 'Apartment';
	Inventory.findAll({
        where: {
            // adminId: req.admin.id
        },
        order: [
            ['inventory_id', 'ASC']
        ],
        raw: true
    })
        .then((inventory) => {
            
            res.render('rooms/apartment', {
				title: title,
				layout : "thalia",
				inventory
				})
        })
        .catch(err => console.log(err));
});


router.post('/bookingDetails', (req, res) => {
	const title = 'Complete Booking';
	let roomImage = req.body.roomImage;
	let BookInDate = req.body.BookInDate;
	let BookOutDate = req.body.BookOutDate;
	let price = req.body.price;
	let type = req.body.type;
	let type_id = req.body.type_id;
	let minRoomNo = req.body.minRoomNo;
	let maxRoomNo = req.body.maxRoomNo;
	console.log(type_id);
	
	let roomNo = Math.floor(Math.random() * (parseInt(maxRoomNo) - parseInt(minRoomNo) + 1))+ parseInt(minRoomNo)
	console.log(BookInDate);
	Hospital.findAll({
		order: [["id", "ASC"]],
		raw: true,
	  })
		.then((hospitals) => {
			res.render('rooms/booking_details', {title: title,
				layout : "thalia",
				BookInDate : BookInDate,
				BookOutDate : BookOutDate,
				price : price,
				roomNo : roomNo,
				roomImage : roomImage,
				type : type,
				type_id : type_id,
				hospitals : hospitals
				});
		})
		.catch((err) => console.log(err));
});

router.post('/booked', (req, res) => {
	let roomImage = req.body.roomImage;
	let bookInDate = req.body.bookInDate;
	let bookOutDate = req.body.bookOutDate;
	let type = req.body.type;
	// let addItems = req.body.addItems;
	let type_id = req.body.type_id;
	let name = req.body.name;
	let username = req.body.username;
	let package_deal = req.body.package_deal;
	let roomNo = req.body.roomNo;
	let price = req.body.price;
	let hospitals = req.body.hospitals;
	let paid = 0;

	Room.create({
		bookInDate,
		bookOutDate,
		type,
		name,
		username,
		package_deal,
		roomNo,
		price,
		paid,
		roomTypeID : type_id,
		nearbyHospital : hospitals

	}).then((room)=> {
		res.redirect('/rooms/bookingCart/' + room.id);



	}).catch(err => console.log(err))

});

router.get('/bookingCart/:id', (req, res) => {
	const title = 'Booking Cart';
	console.log(req.params.id)
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  }).then(async (room) => {
		await RoomType.findOne({
			where : {
				type_id : room.roomTypeID
			}
		}).then((roomtype)=>{
			res.render("rooms/cart", {
				room, 
				layout: "thalia",
				title: title,
				roomtype
			  });

			})
		}).catch((err) => console.log(err)); 
	});

router.post('/payPal/:id', (req,res) => {
	let roomType = req.body.roomType;
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  })
		.then((room) => {
			const create_payment_json = {
				"intent": "sale",
				"payer": {
					"payment_method": "paypal"
				},
				"redirect_urls": {
					"return_url": "http://localhost:5000/rooms/paySuccess/"+ room.id,
					"cancel_url": "http://localhost:5000/rooms/"
				},
				"transactions": [{
					"item_list": {
						"items": [{
							"name": roomType,
							"sku": room.roomNo,
							"price": room.price,
							"currency": "SGD",
							"quantity": 1
						}]
					},
					"amount": {
						"currency": "SGD",
						"total": room.price
					},
					"description": "Hotel Booking Payment using PayPal"
				}]
			};
			paypal.payment.create(create_payment_json, function (error, payment) {
				if (error) {
					throw error;
				} else {
					let paid = 1;
					Room.update({
						paid
					}, {
					where: {
					id: req.params.id
					}
					}).then(() => {
					// After saving, redirect to router.get(/listVideos...) to retrieve all updated
					// videos
					for (var i = 0; i < payment.links.length;i++) {
						if (payment.links[i].rel === "approval_url"){
							console.log("Create Payment Response");
							console.log(payment);
							res.redirect(payment.links[i].href);
							
							
							



						}



					}
					});
					
					
					
				}
			});


		  
		})
		.catch((err) => console.log(err)); 
	});

router.get('/paySuccess/:id', (req, res) => {
	const title = 'Success Payment';
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	Room.findOne({
		where: {
		  id: req.params.id,
		},
	  })
		.then((room) => {
		const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "SGD",
				"total": room.price
			}
		}]
	};

	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log("Get Payment Response");
			console.log(JSON.stringify(payment));
			res.redirect('/rooms/success');
		}
	});
	})
		.catch((err) => console.log(err)); 

	
	



});

router.get('/success', (req, res) => {
	const title = 'Success!';
	res.render('rooms/success', {
		title: title,
		layout : "blank",
	    })
});

router.get('/bookingList', (req, res) => {
	const title = "Room Booking List";
	
	Room.findAll({
	
	order: [
	['id', 'ASC']
	],
	raw: true
	})
	.then((room) => {
	
	// pass object to listVideos.handlebar
	res.render('rooms/bookingList', {
	layout : "admin",
	title : title,
	room: room
	});
	})
	.catch(err => console.log(err));
	});


	router.get('/bookingDelete/:id', (req, res) => {
		let id = req.params.id;
		Room.findOne({
			where: {
				id: id,
			},
			attributes: ['id']
		}).then((room) => {
			
			if (room != null) {
				Room.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.redirect('/rooms/bookingList');
				}).catch(err => console.log(err));
			} else {
				alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);
				
			}
		});
	});

router.get("/bookingEdit/:id", (req, res) => {
	const title = "Edit BookingDetails";
	Room.findOne({
	  where: {
		id: req.params.id,
	  },
	})
	  .then((room) => {
		res.render("rooms/bookingEdit", {
		  room,
		  layout: "admin",
		  title: title,
		});
	  })
	  .catch((err) => console.log(err)); // To catch no video ID
  });

  router.put('/bookingEdited/:id', (req, res) => {
	
	let roomNo = req.body.roomNo;
	let paid = req.body.paid;
	let bookInDate = req.body.bookInDate;
	let bookOutDate = req.body.bookOutDate;
	Room.update({
		bookInDate,
		bookOutDate,
		addItems,
		roomNo,
		paid
	}, {
	where: {
	id: req.params.id
	}
	}).then(() => {
	// After saving, redirect to router.get(/listVideos...) to retrieve all updated
	// videos
	res.redirect('/rooms/bookingList');
	}).catch(err => console.log(err));
	});

module.exports = router;
