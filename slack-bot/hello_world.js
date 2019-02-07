// Import dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
const fetch = require('node-fetch');
const fs = require('fs');


//Declare some variables
var timeStamp;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = "xoxb-447711350823-540306733076-QKJMwhz2V0qBTWuzeEXKaVXB";
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
                      value: "complete"
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

});
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
  console.log(myContent);
  return myContent
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

  function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
      console.log("RESPONSO:");
        if (error){
            // handle errors as you see fit
        }
    })
  }


// Start server on port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

//Post messages when server receives request
app.post('/', urlencodedParser, (req, res) =>{
  console.log("MEGA HALLO! I CUT SOME SLACK HERE MF");
  res.status(200).end() // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var responseURL = JSON.parse(reqBody.payload).response_url;
  var actions = JSON.parse(reqBody.payload).actions;

  switch(actions[0].value){
    case "shuffle":
    web.chat.update({ channel: conversationId, text: myRecipes[1].text, attachments: myRecipes[1].attachments, ts: timeStamp })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
    break;
    case "select":
    break;
    case "cancel":
    break;
  }
  sendMessageToSlackResponseURL(responseURL, myRecipes[0])
});

