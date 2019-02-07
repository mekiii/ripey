// Import dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
const fs = require('fs');
var shuffleNumber = 1;



//Declare some variables
var timeStamp;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = "xoxb-447711350823-540306733076-3ONQkwZk96LKgZMEGQjDnyi5";
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

  var myRecipes;
  fs.readFile('./recipes.json', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString('utf8');
    myRecipes = JSON.parse(content);
    console.log(myRecipes.length);
});
//console.log(myRecipes.length);
 /*
function loadJSON (jsonPath){
  var myContent;
  fs.readFile(jsonPath , function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString('utf8');
    myContent = JSON.parse(content);
  });
  return myContent;
}
var recipePath = './recipes.json';
var myRecipes = loadJSON(recipePath);
console.log(myRecipes);
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
  var responseURL = JSON.parse(reqBody.payload).response_url;
  var actions = JSON.parse(reqBody.payload).actions;
  var message;

  switch(actions[0].value){
    case "shuffle":
    // Shuffle recipes
    shuffleNumber = (shuffleNumber + 1) % myRecipes.length;
    message = myRecipes[shuffleNumber];
    break;
    case "select":
    break;
    case "quit":
    message = ripenessNotification;
  }
  web.chat.update({ channel: conversationId, text: message.text, attachments: message.attachments, ts: timeStamp })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);

});

