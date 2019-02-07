// Import dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
const fs = require('fs');
var shuffleNumber = 1;
var trigger_id;


//Declare some variables
var timeStamp;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = "xoxb-447711350823-540306733076-pNY2IRPFirosJkwVZOonhlke";
const web = new WebClient(token);
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CFXFT82NB';


//Create Ripeness Notification
const ripenessNotification = {
  text: "Hey es ist ganz viel Gemuese reif geworden!",
  attachments: [
          {
              callback_id: "get_recipe",
              fallback: "Hast du Lust auf einen Rezeptvorschlag?",
              author_name: "Tomatenschrank",
              title: "Hast du Lust auf einen Rezeptvorschlag?",
              actions: [
                  {
                      name: "action",
                      type: "button",
                      text: "Ja, gerne",
                      value: "shuffle"
                  },
              ]
          }
      ]
  }

  const cancelMessage = {
    text: "Schade :confused:, sag Bescheid falls du es dir anders überlegst ",
    attachments: [
            {
                callback_id: "get_recipe",
                fallback: "Hast du Lust auf einen Rezeptvorschlag?",
                actions: [
                    {
                        name: "action",
                        type: "button",
                        text: "Vielleicht doch",
                        value: "shuffle"
                    },
                ]
            }
        ]
    }

    //Read recipes
  var myRecipes;
  fs.readFile('./recipes.json', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString('utf8');
    myRecipes = JSON.parse(content);
    console.log(myRecipes.length);
});

//Read final message js
var finalMessage;
fs.readFile('./finalMessage.json', function read(err, data) {
  if (err) {
      throw err;
  }
  content = data.toString('utf8');
  finalMessage = JSON.parse(content);
});

//Read dialog js
var dialog;
fs.readFile('./dialog.json', function read(err, data) {
  if (err) {
      throw err;
  }
  content = data.toString('utf8');
  dialog = JSON.parse(content);
});


/*
function loadJSON (jsonPath){
  fs.readFile(jsonPath , function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString('utf8');
    console.log("Bla : " + content);
    return content;
  });
  
}
var recipePath = './recipes.json';
var myRecipes = loadJSON(recipePath);
*/

//First post ripeness notification
web.chat.postMessage({ channel: conversationId, text: ripenessNotification.text, attachments: ripenessNotification.attachments })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
    timeStamp = res.ts;
  })
  .catch(console.error);


// Start server on port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

//Post messages when server receives request
app.post('/', urlencodedParser, (req, res) =>{
  console.log("###########################################################");
  res.status(200).end() // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var actions = JSON.parse(reqBody.payload).actions;
  var trigger_id = JSON.parse(reqBody.payload).trigger_id;
  var reqToken = JSON.parse(reqBody.payload).token;
  var type = JSON.parse(reqBody.payload).type;
  console.log(JSON.parse(reqBody.payload));
  var message;
  var sendChatUpdate = false;
  var openDialog = false;

  if (actions){
    switch(actions[0].value){
            case "shuffle":
            // Shuffle recipes
            shuffleNumber = (shuffleNumber + 1) % myRecipes.length;
            message = myRecipes[shuffleNumber];
            sendChatUpdate = true;
            break;
            case "select":
            openDialog = true;
            break;
            case "quit":
            message = cancelMessage;
            sendChatUpdate = true;
            break;
            case "zusammen":
            message = cancelMessage;
            sendChatUpdate = true;
            break;
            case "alleine":
            message = cancelMessage;
            sendChatUpdate = true;
            break;
        }
    }

    if (type == "dialog_submission"){
        console.log("Hello, dialog submitted");
        message = finalMessage;
        sendChatUpdate = true;

    }

    if(sendChatUpdate) {
        web.chat.update({ channel: conversationId, text: message.text, attachments: message.attachments, ts: timeStamp })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
    }
    if(openDialog){
        web.dialog.open({reqToken, dialog, trigger_id});
    }

});

