const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const dialogflow = require('@google-cloud/dialogflow'); // Danish's Chatbot woo
const ChatBot = require('../models/ChatBot');
const alertMessage = require('../helpers/messenger');
const methodOverride = require('method-override');
const Chatbot = require('../models/Chatbot');
const ChatQuestion = require('../models/ChatQuestion');
const ChatAnswer = require('../models/ChatAnswer');
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
	var sessionId = Math.random();
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
  var intentName = response.name;
  var name_split = intentName.split("/");
  var intentPath = name_split[(name_split.length)-1];
  return intentPath;
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
    // response.forEach((intent) => {
    //   console.log('====================');
    //   Object.entries(intent).forEach(entry => {
    //     // const [key, value] = entry;
    //     // console.log(key, value);
    //       console.log(`Intent training phrases: ${intent.trainingPhrases}`);
    //   })

    // });


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

// updateIntent(["test statement"]); TEST UPDATE INTENT


async function updateIntentAPI(intentID,previousTrainingPhrases,newTrainingPhrases,previousMessageTexts,newMessageTexts,displayName) { // NEW EDITED
  // Imports the Dialogflow library
  
  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);

  const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

  console.log(projectAgentPath);

  // const request = {
  //   parent: projectAgentPath,
  // };


  // const [response] = await intentsClient.listIntents(request);
  
  var intent =await getIntent(intentID);
  console.log("test data is ",intent);


  const trainingPhrases = [];

  const combinedMessageTextsOriginal =previousMessageTexts.concat(newMessageTexts);

  var combinedMessageTexts = combinedMessageTextsOriginal.filter((item,index)=>{

    return (combinedMessageTextsOriginal.indexOf(item)==index);

  })

  const messageText = {
    text: combinedMessageTexts,
    };

    const message = {
      text: messageText,
      };

      
  previousTrainingPhrases.forEach(textdata => {
    newTrainingPhrases.push(textdata);
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
  intent.displayName = displayName;
  intent.messages = [message];




  const updateIntentRequest = {
    intent
    
  };

  // Send the request for update the intent.
  const result = await intentsClient.updateIntent(updateIntentRequest);
  console.log("Success.")
  return result;
}

// updateIntent(["test statement"]); TEST UPDATE INTENT


  async function deleteIntentQuick(intentID) { 
    // Imports the Dialogflow library
    
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);

    const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

    console.log(projectAgentPath);

    const request = {
      parent: projectAgentPath,
    };

    var deleteIntentRequest = {};

    const intentPath = intentsClient.projectAgentIntentPath(PROJECTID, intentID);
    console.log(intentPath);
    deleteIntentRequest["name"] = intentPath;

    
    const result = await intentsClient.deleteIntent(deleteIntentRequest);
    console.log(`${intentID} intent is deleted successfully.`);
    return result;  
  }

  async function getIntent(intentID) { 
    // Imports the Dialogflow library
    
    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient(CONFIGURATION);

    const projectAgentPath = intentsClient.projectAgentPath(PROJECTID);

    console.log(projectAgentPath);

    var getIntentRequest = {};

    const intentPath = intentsClient.projectAgentIntentPath(PROJECTID, intentID);
    console.log(intentPath);
    getIntentRequest["name"] = intentPath;
    
    const result = await intentsClient.getIntent(getIntentRequest);
    console.log(`${intentID} intent shown.`);
    return result[0];     
  }

// END OF FUNCTIONS //

// getIntent("1519132c-a414-4fd1-af63-2c128d27a1c9");



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
              const chatBotIntents = [];
              Chatbot.findAll({
                where: {
                    // adminId: req.admin.id
                },
                order: [
                    ['IntentPath', 'ASC']
                ],
                raw: true
            }).then(async (chatBots)=>{
              for await (var chatBot of chatBots){
                
                var questions = await ChatQuestion.findOne({
                  where : {
                    IntentID : chatBot.IntentPath
                  }
                })
                var answers = await ChatAnswer.findOne({
                  where : {
                    IntentID : chatBot.IntentPath
                  }
                })
                let chatIntent = {};
                if (questions == null ){
                  chatIntent.questions = []
                } else {
                  chatIntent.questions = questions.dataValues.Question
                }
                if (answers == null ){
                  chatIntent.answers = []
                } else {
                  chatIntent.answers = answers.dataValues.Answer
                }
                
                chatIntent.intent = chatBot.Intent
                chatIntent.intentPath = chatBot.IntentPath
                chatBotIntents.push(chatIntent);
                
              }
            }).catch((err) => console.log(err))
            .then(() => {
              
        res.render("ChatBot/chatBotList", {
          layout: "admin",
          title: title,
          chatBotIntents : chatBotIntents,
          
          // advancedIntentsArray
        });
      })
      // console.log(advancedIntentsArray);
    .catch((err) => console.log(err));
});



router.get("/chatBotListAPI", (req, res) => {
  const title = "Chat Bot Instances";
  const chatBotIntents = [];
  listIntents().then((chatbots) => {
    console.log(chatbots[2]);
    res.render("ChatBot/chatBotListAPI", {
    layout: "admin",
    title: title,
    chatbots : chatbots
    });
    })
    .catch((err) => console.log(err));
});











router.get('/intent', (req, res) => {
	const title = "Create QnA";
	res.render('ChatBot/intentCreate', { 
		layout: "admin",
		title: title,
		
	});


});


router.post('/intentCreate',(req,res)=>{
  
  let displayName = req.body.displayName;
  let questions = req.body.trainingPhrases;
  let answers = req.body.botReplies;
  console.log(req.body.displayName);
  console.log(req.body.trainingPhrases);
  console.log(req.body.botReplies);
    Chatbot.findOne({
      where: {
          Intent : displayName
      }
  }).then(chuuBot => {
    if (chuuBot){
      res.json({message : "FAIL"})

        
    } else {
      var intentPath = createIntent(req.body.displayName,req.body.trainingPhrases,req.body.botReplies);
      intentPath.then(function(result){
        console.log("Intent name of LOONA is :")
        console.log(result);
        Chatbot.create({
          id : result,
          Intent : displayName,
          IntentPath : result
      
        }).then((intent) => {
        questions.forEach((question) => {
          ChatQuestion.create({
            IntentID : intent.id,
            Question : question
      
          });
          
          })
          answers.forEach((answer) => {
            ChatAnswer.create({
              IntentID : intent.id,
              Answer : answer
        
            });
            
            })
          })
      })
      res.json({message : "PASS"})
    }
})
  
});



//Original intentCreate with no changes
// router.post('/intentCreateOriginal',(req,res)=>{
//   let displayName = req.body.displayName;
//   let questions = req.body.trainingPhrases;
//   let answers = req.body.botReplies;
//   console.log(req.body.displayName);
//   console.log(req.body.trainingPhrases);
//   console.log(req.body.botReplies);
//   createIntent(req.body.displayName,req.body.trainingPhrases,req.body.botReplies);
//   Chatbot.create({
//     Intent : displayName
    

//   }).then((intent) => {
//   questions.forEach((question) => {
//     ChatQuestion.create({
//       IntentID : intent.id,
//       Question : question

//     });
    
//     })
//     answers.forEach((answer) => {
//       ChatAnswer.create({
//         IntentID : intent.id,
//         Answer : answer
  
//       });
      
//       })
//     })
// });


router.get('/intentDelete/:path', (req, res) => {
  let path = req.params.path;
  deleteIntentQuick(path).then(()=>{
    Chatbot.findOne({
			where: {
				id: path,
			},
			attributes: ['id']
		}).then((chatBot) => {
			// if record is found, user is owner of video
			if (chatBot != null) {
				Chatbot.destroy({
					where: {
						id: path
					}
				}).then(() => {
					res.redirect('/chatBot/chatBotList');
				}).catch(err => 
          console.log(err),
          // alertMessage(res, 'danger', "Invalid error.", 'fas fa-exclamation-circle', true)
          );
			} else {
				// alertMessage(res, 'danger', "Error occured!", 'fas fa-exclamation-circle', true);
				
			}
		});



  })
});



router.get('/intentEdit/:path', (req, res) => {
  let path = req.params.path;
  let chatIntent = {};
  chatIntent.intentPath = path;
      Chatbot.findOne({
        where: {
            // adminId: req.admin.id
            IntentPath : path
        },
        raw: true
    }).then(async (chatBot)=>{
        var questions = []
        var answers = []
        chatIntent.displayName = chatBot.Intent;
        var Chatquestions = await ChatQuestion.findAll({
          where : {
            IntentID : path
          }
        })
        for (var question of Chatquestions){
          questions.push(question.dataValues.Question)

        }
        var Chatanswers = await ChatAnswer.findAll({
          where : {
            IntentID : path
          }
        })
        for (var answer of Chatanswers){
          answers.push(answer.dataValues.Answer)

        }
        chatIntent.questions = questions
        chatIntent.answers = answers
        
        
    }).then(() => {
      console.log(chatIntent);
      res.render('ChatBot/intentEdit', { 
        layout: "admin",
        chatIntent : chatIntent
        
      });
    })
    









  // getIntent(path).then((intent) => {
  //   res.render('ChatBot/intentEdit', { 
  //     layout: "admin",
  //     intent
      
  //   });
  //   console.log(intent);

  // })
  // UpdateIntentQuick(path);
});







//Original intent edit with no changes
// router.get('/intentEditOriginal/:path', (req, res) => {
//   let path = req.params.path;
//   getIntent(path).then((intent) => {
//     res.render('ChatBot/intentEdit', { 
//       layout: "admin",
//       intent
      
//     });


//   })
//   // UpdateIntentQuick(path);
// });









router.post('/intentEdited/:path',(req,res)=>{
  let path = req.params.path;
  let displayName = req.body.displayName;
  let questions = req.body.trainingPhrases;
  let answers = req.body.botReplies;
  let originalQuestions = req.body.originalPhrases;
  let originalReplies = req.body.originalReplies;
  let filteredQuestions = questions.concat(originalQuestions).filter((item,index)=>{

    return (questions.concat(originalQuestions).indexOf(item)==index);

  })
  let filteredReplies = answers.concat(originalReplies).filter((item,index)=>{

    return (answers.concat(originalReplies).indexOf(item)==index);

  })
  console.log(req.body.displayName);
  console.log(req.body.trainingPhrases);
  console.log(req.body.botReplies);
  var intentPath = updateIntentAPI(path,originalQuestions,questions,originalReplies,answers,displayName);
  intentPath.then(function(){
    console.log("Intent name of LOONA is :")
    
    ChatQuestion.destroy({
      where : {
        IntentID : path


      }
    });
    ChatAnswer.destroy({
      where : {
        IntentID : path

      }
    })
    Chatbot.update({
      Intent : displayName,

    },{
      where : {
        id : path
      }

    }).then((intent) => {
    filteredQuestions.forEach((question) => {
      ChatQuestion.create({
        IntentID : path,
        Question : question
  
      });
      
      })
      filteredReplies.forEach((answer) => {
        ChatAnswer.create({
          IntentID : path,
          Answer : answer
    
        });
        
        })
      })
  })
});







// updateIntentQuick("d246c8a4-b577-4cab-ab09-a8cc65d726bc",["Replaced 3","Replaced 4"])











module.exports = router;




