// Import dependencies
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var item = 0;
var laura = 'DFWKPFLJH';
var meki = 'DFW90MLUC';
var speps = 'DFW90MKHA';
var devChannel = 'CFXFT82NB';


//Declare some variables
var timeStamp;
var invitationTimeStamp;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
const myToken = "xoxb-447711350823-540306733076-rQ67rYbxFJwUeNiNXFXKYBQf";
const web = new WebClient(myToken);
const conversationId = meki;


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
var lauraPath = "./laura_invited.json";
var lauraInvited;
(async () => {
    try {
        lauraInvited = await loadJSON(lauraPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

var userInvitationPath = "./userInvitation.json";
var userInvitation;
(async () => {
    try {
        userInvitation = await loadJSON(userInvitationPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();


var timer = setInterval(sendNotification, 10000);


//First post ripeness notification
function sendNotification(){
    web.chat.postMessage({ as_user: false, channel: conversationId, text: "Hey es ist ganz viel Gemüse reif geworden! Hast du Lust auf einen Rezeptvorschlag?", attachments: [], blocks: notification })
    .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
        timeStamp = res.ts;
    })
    .catch(console.error);
}
//Get Users
var userList= [];
web.im.list({token: myToken})
.then((res) => {
    console.log("###########################################################");
    for (i = 0; i < res.ims.length; i++){
        userList.push(res.ims[i].id);
    }
})
.catch(console.error);



// Start server on port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

//Post messages when server receives request
app.post('/', urlencodedParser,(req,res) =>{
  res.status(200).end() // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var actions = JSON.parse(reqBody.payload).actions;
  var trigger_id = JSON.parse(reqBody.payload).trigger_id;
  var reqToken = JSON.parse(reqBody.payload).token;
  var type = JSON.parse(reqBody.payload).type;
  var openDialog = false;
  var sendBlock = false;
  var answerUser =false;
  var recipient = laura;
  var recipientText;
  console.log(JSON.parse(reqBody.payload));
  var schedule;
  

//check what kind of action was triggered
  if (actions){
    clearInterval(timer);
    switch(actions[0].value){
            case "shuffle":
            // Shuffle recipes
            item = (item + 3) % recipeArray.length;
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
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            message.push(togetherMessage[0]);
            message.push(togetherMessage[1]);
            sendBlock = true;
            break;
            case "quit":
            item = 0;
            message = cancelMessage;
            sendBlock = true;
            break;
            case "cook_together":
            openDialog = true;
            break;
            case "cook_alone":
            console.log("COOKING ALONE MTF!!!")
            message = [];
            message.push(eatingAlone[0]);
            message.push(recipeArray[item]);
            message.push(recipeArray[item + 2]);
            message.push(recipeArray[item + 1]);
            sendBlock = true;
            break;
            case "invite_laura":
            message = [];
            //Concat message in users Channel
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            message.push(invitationMessage[0]);
            message.push(lauraInvited[0]);
            sendBlock = true;
            //send Laura message
            console.log("send laura time Schedule: " + schedule);
            lauraMessage = [];
            lauraMessage.push(recipeArray[item]);
            lauraMessage.push(recipeArray[item + 1]);
            lauraMessage.push(userInvitation[0]);
            lauraMessage.push(userInvitation[1]);
            web.chat.postMessage({as_user: false, icon_url: 'https://ca.slack-edge.com/TD5LXAAQ7-UD6KHGA93-g52a4dea3649-72', channel: recipient , text: "Hey, ich hätte Lust das hier zu kochen, bist du dabei?", blocks: lauraMessage, username: 'Meki',})
            .then((res) => {
            // `res` contains information about the posted message
            invitationTimeStamp = res.ts;
             })
            .catch(console.error);
            sendBlock = true;
            break;
            case "invitationAccepted":
            message = [];
            //Concat message in users Channel
            message.push(chosenRecipes[item]);
            message.push(recipeArray[item + 2]);
            message.push(chosenRecipes[item + 1]);
            message.push(lauraInvited[1]);
            sendBlock = true;
            //Reply to Laura
            lauraMessage = [];
            lauraMessage.push(recipeArray[item]);
            lauraMessage.push(recipeArray[item + 1]);
            lauraMessage.push(userInvitation[2]);
            recipientText = "Super, bis gleich!";
            answerUser = true;
            break;
            case "invitationDenied":
            message = [];
            //Concat message in users Channel
            message.push(chosenRecipes[item]);
            message.push(recipeArray[item + 2]);
            message.push(chosenRecipes[item + 1]);
            message.push(lauraInvited[2]);
            sendBlock = true;
            //Reply to Laura
            lauraMessage = [];
            lauraMessage.push(userInvitation[3]);
            recipientText = "Schade, vielleicht ein ander mal";
            answerUser = true;
            break;
        }
    }

    if(answerUser) {
        web.chat.update({ channel: recipient , text: recipientText, blocks: lauraMessage, ts: invitationTimeStamp})
        .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent to Laura: ', res.ts);
        
         })
        .catch(console.error);
    }

    if (type == "dialog_submission"){
        console.log("Hello, dialog submitted");
        message = [];
        //Concat message
        schedule = JSON.parse(reqBody.payload).submission.together;
        console.log("Schedule: " + schedule);
        message.push(chosenRecipes[item]);
        message.push(chosenRecipes[item + 1]);
        invitationMessage[0].text.text += '*' + schedule + '* Uhr:';
        userInvitation[0].text.text += "\n Um *" + schedule + "* Uhr würde ich anfangen."; 
        for (i=0; i < invitationMessage.length; i++){
            message.push(invitationMessage[i]);
        }
        sendBlock = true;

    }
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
})