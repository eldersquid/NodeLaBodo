const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const dialogflow = require('@google-cloud/dialogflow'); // Danish's Chatbot woo
const ChatBot = require('../models/ChatBot');

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
    const [ response ] = await intentsClient.listIntents(request);
    // response.forEach(intent => {
    //   console.log('====================');
    //   Object.entries(intent).forEach(entry => {
    //     const [key, value] = entry;
    //     console.log(key, value);
    //   });
    //   console.log(`Intent name: ${intent.name}`);
    //   console.log(`Intent display name: ${intent.displayName}`);
    //   console.log(`Action: ${intent.action}`);
    //   console.log(`Root folowup intent: ${intent.rootFollowupIntentName}`);
    //   console.log(`Parent followup intent: ${intent.parentFollowupIntentName}`);
      
    //   console.log(`Response: ${intent.messages[0].text.text[0]}`);
      
    //   console.log('Input contexts:');
    //   intent.inputContextNames.forEach(inputContextName => {
    //     console.log(`\tName: ${inputContextName}`);
    //   });

    //   console.log('Output contexts:');
    //   intent.outputContexts.forEach(outputContext => {
    //     console.log(`\tName: ${outputContext.name}`);
    //   });
    // });
    
    return response;
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


// Test route to combine both advanced dialogflow intents and normal intents
// Might do when im free i guess lol
// router.get("/chatBotList", (req, res) => {
//   const title = "Chat Bot Instances";
//   ChatBot.findAll({
//     order: [["displayName", "ASC"]],
//     raw: true,
//   }).then((intents) => {
//     listIntents().then((advancedIntents) => {
//       res.render("ChatBot/chatBotList", {
//         layout: "admin",
//         title: title,
//         advancedIntents:advancedIntents,
//         intents : intents
//     }).catch((err) => console.log(err));
//   })  
// }).catch((err) => console.log(err));
// });

router.get("/chatBotList", (req, res) => {
  const title = "Chat Bot Instances";

    listIntents().then((advancedIntents) => {
      res.render("ChatBot/chatBotList", {
        layout: "admin",
        title: title,
        advancedIntents,
      });
    })
    .catch((err) => console.log(err));
});

router.post('/intentCreate', cors(), (req, res) => {
	const title = "Create Hospital";
	console.log(js_data);
	res.render('ChatBot/intentCreate', { 
		layout: "admin",
		title: title,
	});


});


















module.exports = router;

