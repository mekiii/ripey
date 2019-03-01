// Import dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var item = 0;
var trigger_id;


//Declare some variables
var timeStamp;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = "xoxb-447711350823-540306733076-TjogbmKWTuvWA9SKhdx2OBnz";
const web = new WebClient(token);
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CFXFT82NB';


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



async function loadJSON (jsonPath){

  var data = await fs.readFileAsync(jsonPath);
  data = data.toString('utf8');
  data = JSON.parse(data);
  return data;
}
var recipePath = './recipe_message.json';
var recipeMessage;

(async () => {
    try {
        recipeMessage = await loadJSON(recipePath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var togetherPath = './together_message.json';
var togetherMessage;
(async () => {
    try {
        togetherMessage = await loadJSON(togetherPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var recipeArrayPath = "./recipeArray.json";
var recipeArray;
(async () => {
    try {
        recipeArray = await loadJSON(recipeArrayPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var chosenPath = "./chosenRecipes.json";
var chosenRecipes;
(async () => {
    try {
        chosenRecipes = await loadJSON(chosenPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var invitationPath = "./invitation.json";
var invitationMessage;
(async () => {
    try {
        invitationMessage = await loadJSON(invitationPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var notificationPath = "./notification.json";
var notification;
(async () => {
    try {
        notification = await loadJSON(notificationPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var lonerPath = "./loner.json";
var eatingAlone;
(async () => {
    try {
        eatingAlone = await loadJSON(lonerPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var cancelMessagePath = "./cancelMessage.json";
var cancelMessage;
(async () => {
    try {
        cancelMessage = await loadJSON(cancelMessagePath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var timer = setInterval(sendNotification, 10000);


//First post ripeness notification

function sendNotification(){
    web.chat.postMessage({ channel: conversationId, text: "Dude, you should check your block message", attachments: [], blocks: notification })
    .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
        timeStamp = res.ts;
    })
    .catch(console.error);
}

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
  
  var message;
  var sendChatUpdate = false;
  var openDialog = false;
  var sendBlock = false;

//check what kind of action was triggered
  if (actions){
    clearInterval(timer);
    switch(actions[0].value){
            case "shuffle":
            // Shuffle recipes
            item = (item + 2) % recipeArray.length;
            console.log("item index: "+ item);
            message = [];
            //Concat message
            message.push(recipeMessage[0]);
            message.push(recipeArray[item]);
            message.push(recipeArray[item + 1]);
            message.push(recipeMessage[1]);
            sendBlock = true;
            break;
            case "select":
            message = [];
            //Concat message
            message.push(recipeMessage[0]);
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            message.push(togetherMessage[0]);
            message.push(togetherMessage[1]);
            sendBlock = true;
            break;
            case "cook_together":
            openDialog = true;
            break;
            case "quit":
            item = 0;
            message = cancelMessage;
            sendBlock = true;
            break;
            case "cook_alone":
            console.log("COOKING ALONE MTF!!!")
            message = [];
            //Concat message
            message.push(eatingAlone[item]);
            message.push(recipeArray[item]);
            message.push(recipeArray[item + 1]);
            sendBlock = true;
            break;
        }
    }

    if (type == "dialog_submission"){
        console.log("Hello, dialog submitted");
        message = [];
        //Concat message
        
        message.push(chosenRecipes[item]);
        message.push(chosenRecipes[item + 1]);
        for (i=0; i < invitationMessage.length; i++){
            message.push(invitationMessage[i]);
        }
        sendBlock = true;

    }

    //var getList = web.conversations.list()
    /*
    if(sendChatUpdate) {
        web.chat.update({ channel: conversationId, text: message.text, attachments: message.attachments, ts: timeStamp })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
    }
    */
    if(sendBlock) {
        web.chat.update({ channel: conversationId, text: "Here's a block", attachments: [], ts: timeStamp, blocks: message })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Block message sent: ', res.ts);
        })
        .catch(console.error);
    }
    if(openDialog){
        web.dialog.open({reqToken, dialog, trigger_id});
    }

});