// Import dependencies
let express = require('express');
let bodyParser = require('body-parser');
let multiplier = require('./ingredientsMultiplier');
let app = express();
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let item = 0;
let selectedChannel;
let selectedTime;
let approvingUsers =[];
let user;
let mysql = require('mysql');
let produceIsRipe = false;

//Declare some variables
let timeStamp;
let invitationTimeStamp;
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//Get slackclient
const { WebClient } = require('@slack/client');
const myToken = "xoxb-447711350823-540306733076-xc0wMIUoLzrZnflQGJVB3bk9";
const web = new WebClient(myToken);


//Prepare database connection 
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "runmysql",
  database: "planta"
});

//Get information of ripeness database 
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT Status FROM anbau WHERE PrimKey = LAST_INSERT_ID()", function (err, result, fields) {
    if (err) throw err;
    console.log("Database output (status): ");
    console.log("++++++++++++++++++++++++++++++++++++++++" + result);
    if (result == "reif") {
        produceIsRipe = true;
    }
  });
});


async function loadJSON (jsonPath){

  var data = await fs.readFileAsync(jsonPath);
  data = data.toString('utf8');
  data = JSON.parse(data);
  return data;
}

let zutatenPath = "./zutaten.json";
let zutaten;

(async () => {
	try {
		zutaten = await loadJSON(zutatenPath);
	} catch (e) {
		console.log(e);
		// Deal with the fact the chain failed
}
})();


let notificationPath = "./notification.json";
let notification;
(async () => {
    try {
        notification = await loadJSON(notificationPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let recipePath = './recipe_message.json';
let recipeMessage;

(async () => {
    try {
        recipeMessage = await loadJSON(recipePath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let togetherPath = './together_message.json';
let togetherMessage;
(async () => {
    try {
        togetherMessage = await loadJSON(togetherPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let recipeArrayPath = "./recipeArray.1.json";
let recipeArray;
(async () => {
    try {
        recipeArray = await loadJSON(recipeArrayPath);  
        console.log(recipeArray.length); 
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let chosenPath = "./chosenRecipes.json";
let chosenRecipes;
(async () => {
    try {
        chosenRecipes = await loadJSON(chosenPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let lonerPath = "./loner.json";
let eatingAlone;
(async () => {
    try {
        eatingAlone = await loadJSON(lonerPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let cancelMessagePath = "./cancelMessage.json";
let cancelMessage;
(async () => {
    try {
        cancelMessage = await loadJSON(cancelMessagePath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();


let channelSelectionPath = "./channelSelection.json";
let channelSelection;
(async () => {
    try {
        channelSelection = await loadJSON(channelSelectionPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

let channelInvitationPath = "./channelInvitation.json";
let channelInvitation;
(async () => {
    try {
        channelInvitation = await loadJSON(channelInvitationPath);   
    } catch (e) {
        console.log(e);
        // Deal with the fact the chain failed
    }
})();

//Get user information
let userList = [];
web.users.list({token: myToken})
.then((res) => {
    // `res` contains information about the posted message
    for (i = 0; i < res.members.length; i++){
        if(res.members[i].is_bot == false && res.members[i].name != 'slackbot'){
            userList.push(res.members[i]);
        }  
    }

    //Get get user Channel ID
    web.im.list({token: myToken})
    .then((res) => {
        // `res` contains information about the posted message
        for (i = 0; i < res.ims.length; i++){
            for (j = 0; j < userList.length; j++){
                if (res.ims[i].user == userList[j].id){
                    userList[j].channel = res.ims[i].id;
                break;
                }
            }  
        }
        //Set to random conversation ID
        //var randomIndex = Math.floor((Math.random() * (userList.length - 1)));
        user = userList[1];
        console.log(user.name + ": " + user.channel);
    })
    .catch(console.error);
})
.catch(console.error);

let isNotified = true;

//Send notification every 10 seconds
    var timer = setInterval(sendNotification, 10000);

//First post ripeness notification
function sendNotification(){
    if(user.channel != null){
        web.chat.postMessage({ channel: user.channel, text: "Hey es ist ganz viel Gemüse reif geworden! Hast du Lust auf einen Rezeptvorschlag?", attachments: [], blocks: notification })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
            timeStamp = res.ts;
        })
        .catch(console.error);
        clearInterval(timer);
    }
    
}


// Start server on port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

//Post messages when server receives request
app.post('/', urlencodedParser,(req,res) =>{
  res.status(200).end() // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var actions = JSON.parse(reqBody.payload).actions;
  var sendMessage = false;
  let zutatenBlock;

    if(actions[0].selected_channel){
        selectedChannel = actions[0].selected_channel;
        console.log(selectedChannel);
    }

    if(actions[0].type == 'static_select'){
        selectedTime = actions[0].selected_option.value;
        console.log(selectedTime);
    }

//check what kind of action was triggered
if (actions){
    clearInterval(timer);
    switch(actions[0].value){

            case "shuffle":
            // Shuffle recipes
            item = (item + 4) % recipeArray.length;
            message = [];
            //Concat message
            message.push(recipeMessage[0]);
            message.push(recipeArray[item]);
            zutatenBlock = multiplier.getIngredients(zutaten,item/4, 1);
            message.push(zutatenBlock);
            message.push(recipeArray[item + 1]);
            message.push(recipeMessage[1]);
            sendMessage = true;
            break;

            case "select":
            message = [];
            //Concat message
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            message.push(togetherMessage[0]);
            message.push(togetherMessage[1]);
            sendMessage = true;
            break;

            case "quit":
            item = 0;
            message = cancelMessage;
            sendMessage = true;
            break;

            case "cook_together":
            message = [];
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            message.push(channelSelection[0]);
            message.push(channelSelection[1]);
            sendMessage = true;
            break;

            case "cook_alone":
            message = [];
            message.push(recipeArray[item + 1]);
            message.push(eatingAlone[0]);
            message.push(recipeArray[item]);
            zutatenBlock = multiplier.getIngredients(zutaten,item/4, 1);
            message.push(zutatenBlock);
            message.push(recipeArray[item + 3]);
            sendMessage = true;
            break;

            case "send_to_channel":
            message = [];
            message.push(recipeArray[item]);
            zutatenBlock = multiplier.getIngredients(zutaten,item/4, 1);
            message.push(zutatenBlock);
            message.push(recipeArray[item + 1]);
            channelInvitation[0].text.text += "\n Um " + selectedTime + " Uhr würden wir anfangen.";
            message.push(channelInvitation[0]);
            message.push(channelInvitation[1]);
            web.chat.postMessage({as_user: false, icon_url: 'https://ca.slack-edge.com/TD5LXAAQ7-UD6KHGA93-g52a4dea3649-72', channel: selectedChannel, text: channelInvitation[0].text.text, blocks: message, username: user.name,})
            .then((res) => {
                // `res` contains information about the posted message
                invitationTimeStamp = res.ts;
             })
            .catch(console.error);
            message = [];
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            channelSelection[0].text.text = "Dein Vorschlag wurde in deinen ausgewählten Kanal geschickt.\n Hier ist das Rezept:" 
            message.push(channelSelection[0]);
            zutatenBlock = multiplier.getIngredients(zutaten,item/4, 1);
            message.push(zutatenBlock);
            message.push(recipeArray[item + 3]);
            sendMessage = true;
            break;

            case "user_selected":
            var newUser = JSON.parse(reqBody.payload).user.username;
            if (!approvingUsers.includes(newUser)){
                approvingUsers.push(newUser);
                message = [];
                message.push(recipeArray[item]);
                console.log("approvingUsers.length: " + approvingUsers.length);
                zutatenBlock = multiplier.getIngredients(zutaten,item/4, approvingUsers.length +1 );
                message.push(zutatenBlock);
                message.push(recipeArray[item + 1]);
                var lastIndex = approvingUsers.length - 1;
                    channelInvitation[2].text.text += "\n " + "*" + approvingUsers[lastIndex] + "*" +" ist dabei! :carrot:";
                message.push(channelInvitation[0]);
                message.push(channelInvitation[1]);
                message.push(channelInvitation[2]);
                //update channel message

                web.chat.update({ channel: selectedChannel, text: channelInvitation[0].text.text, attachments: [], ts: invitationTimeStamp, blocks: message })
                .then((res) => {
                    console.log('Block message sent: ', res.ts);
                })
                .catch(console.error);
            }
            message = [];
            message.push(chosenRecipes[item]);
            message.push(chosenRecipes[item + 1]);
            channelSelection[0].text.text = "Dein Vorschlag wurde in deinen ausgewählten Kanal geschickt.\n Hier ist das Rezept:" 
            message.push(channelSelection[0]);
            zutatenBlock = multiplier.getIngredients(zutaten,item/4, approvingUsers.length +1);
            message.push(zutatenBlock);
            message.push(recipeArray[item + 3]);
            sendMessage = true;
            break;  
        }
    }

    if(sendMessage) {
        web.chat.update({ channel: user.channel, text: "Here's a block", attachments: [], ts: timeStamp, blocks: message })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Block message sent: ', res.ts);
        })
        .catch(console.error);
    }

})