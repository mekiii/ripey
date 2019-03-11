
// Global Variables

var Webcam; // Variable for incoming vision
var ErgebnisForDatabase=""; // Variable for incoming vision

var databaseOpen = false;
////////////////////////////////////////


////////////////////////////////////////
// Variables of neural networks

var featureExtractor; // "Teacher who knows how to lern"
var klassifizierer; // Student who learns from teacher but also can learn new things"
////////////////////////////////////////


////////////////////////////////////////
// Variables to naming the buttons on index.php

var buttonTomateReif; // Button for ripe tomato
var buttonTomateUnreif; // Button for unripe tomato
var buttonSalatReif; // Button for ripe salad
var buttonSalatUnreif; // Button for unripe salad

var buttonTraining; // Button to train the neural network
var buttonTipp; // Button to show the result of vision detection
var buttonSave; // Button to save and download the model of neural network training
////////////////////////////////////////


////////////////////////////////////////
// Variables to count created images

var tomateReifCounter = 0; // Counter for ripe tomatos
var tomateUnreifCounter = 0; // Counter for unripe tomatos
var salatReifCounter = 0; // Counter for ripe salad
var salatUnreifCounter = 0; // Counter for unripe salad
////////////////////////////////////////


////////////////////////////////////////
// Function to show if model is successfully loaded

function modelIsLoaded(){
    console.log("ML5 - Lehrerfunktion wurde erfolgreich geladen.");
}
////////////////////////////////////////


////////////////////////////////////////
// Function for loading the model

function classifierReady(){
    klassifizierer.load("./model/model.json", modelHasLoaded);
}
////////////////////////////////////////


////////////////////////////////////////
// Function to show that - model.json - successfully loaded and load button functions

function modelHasLoaded(){
    console.log("Model wurde erfolgreich geladen, jetzt kann es losgehen!");
    setupButtons(); // Load functions of buttons
}
////////////////////////////////////////


////////////////////////////////////////
// Function to set and show results

function ergebnisseAnzeigen(error, ergebnisse){

    ErgebnisForDatabase=ergebnisse; // Set ErgebnisForDatabase to result of vision detection
    console.log(ErgebnisForDatabase); // Prints result
    select('#Ergebnis').html(ErgebnisForDatabase); // Select h1=Ergebnis of Index.html and fills it with result
    klassifizierer.classify(ergebnisseAnzeigen); // Begin to loop the function
}
////////////////////////////////////////


////////////////////////////////////////
// Function to insert the result into database
function insertInDatabase(){
	if (databaseOpen == true) {

	var parts = ErgebnisForDatabase.split(" ");  // Splitting the result string on space
    		var plant = parts[0]; // Set variable for first split
    		var state = parts[1]; // Set variable for second split


        ////////////////////////////////////////
        // Variables to set time
    		var heute = new Date();
    		var day = heute.getDay();
    		var month = heute.getMonth();
    		var year = heute.getYear();
    		var stunden = heute.getHours();
    		var minuten = heute.getMinutes();
    		var sekunden = heute.getSeconds();

    		var time = day+'.'+month+'.'+year+' '+stunden+':'+minuten+':'+sekunden;
        ////////////////////////////////////////


        ////////////////////////////////////////
        // Post values of variables to database.php
    		$.ajax({
    			type:'POST',
    			url:'database.php',
    			data:{ Datum: time, Pflanze: plant, Status: state, Ort: "Dieburg"},
    			success: function(response){
                    console.log(response);
    				//alert(response);
    			}
    		});
        ////////////////////////////////////////


    setTimeout(function() { insertInDatabase(); }, 5000); // Set timeout to 5 Seconds
}
}

///////////////////////////////////////////////////
// Button functions
function setupButtons(){

    ////////////////////////////////////////////////////
    // Tomato ripe button
    buttonTomateReif = select('#ripetomatoButton');
    buttonTomateReif.mousePressed(function(){
        console.log("Tomate reif gedrückt");

        // Shoot image an give it to neural network
        klassifizierer.addImage('Tomate reif');
        tomateReifCounter++;
        console.log("Bild geschossen!");
        select('#ripetomatoCounter').html(tomateReifCounter);
    });

    ////////////////////////////////////////////////////
    // Tomato unripe button
    buttonTomateUnreif = select('#unripetomatoButton');
    buttonTomateUnreif.mousePressed(function(){
        console.log("Tomate unreif gedrückt");

        // Shoot image an give it to neural network
        klassifizierer.addImage('Tomate unreif');
        tomateUnreifCounter++;
        console.log("Bild geschossen!");
        select('#unripetomatoCounter').html(tomateUnreifCounter);
    });

    ////////////////////////////////////////////////////
    // Salad ripe button
    buttonSalatReif = select('#ripesalatButton');
    buttonSalatReif.mousePressed(function(){
        console.log("Salat reif gedrückt");

        // Shoot image an give it to neural network
        klassifizierer.addImage('Salat reif');
        salatReifCounter++;
        console.log("Bild geschossen!");
        select('#ripesalatCounter').html(salatReifCounter);
    });

    ////////////////////////////////////////////////////
    // Salad unripe button
    buttonSalatUnreif = select('#unripesalatButton');
    buttonSalatUnreif.mousePressed(function(){
        console.log("Salat unreif gedrückt");

        // Shoot image an give it to neural network
        klassifizierer.addImage('Salat unreif');
        salatUnreifCounter++;
        console.log("Bild geschossen!");
        select('#unripesalatCounter').html(salatUnreifCounter);
    });

    ////////////////////////////////////////////////////
    // Train button ist training the model
    buttonTraining = select('#trainingButton');
    buttonTraining.mousePressed(function(){
        klassifizierer.train(function(TrainingIsDone){
            if(TrainingIsDone){
                console.log("...");
            }
            else {
                console.log("Ich hab fertig trainiert");
            }
            });
        console.log("Trainingsbutton gedrückt");
    });

    ////////////////////////////////////////////////////
    // Button to start ergebnisseAnzeigen function
    buttonTipp = select('#guessButton');
    buttonTipp.mousePressed(function(){

        klassifizierer.classify(ergebnisseAnzeigen);
        console.log("Antwortbutton gedrückt");
    });

    ////////////////////////////////////////////////////
    // Button to save the model
    buttonSave = select('#saveButton');
    buttonSave.mousePressed(function(){
        klassifizierer.save();
    });

    ////////////////////////////////////////////////////
    // Button to start insertInDatabase function
    buttonInsert = select('#insertButton');
    buttonInsert.mousePressed(function(){
    	console.log("Schreibvorgangstart gedrückt");

    	databaseOpen = true;

    	insertInDatabase();
    });

    ////////////////////////////////////////////////////
    // Button to stop insertInDatabase function
    buttonStop = select('#stopButton');
    buttonStop.mousePressed(function(){
    	console.log("Schreibvorgangstopp gedrückt");

			databaseOpen = false;

    	});

}


////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// SETUP - SETUP - SETUP - SETUP - SETUP - SETUP

function setup(){

    console.log("Setup aufgerufen");

    noCanvas(); // Set no Canvas

    Webcam = createCapture(VIDEO); // Defines Webcam variable
    Webcam.size(320, 240); // Defines Webcam size

    ////////////////////////////////////////////////////
    // First neural netwok = teacher
    featureExtractor = ml5.featureExtractor('MobileNet', modelIsLoaded); //Hier wird der featureExtractor beschrieben, bescheidgegeben und das "Wissen" von ml5. geladen
    featureExtractor.numClasses= 4; // 4 is defining the number of classifications of the images

    ////////////////////////////////////////////////////
    // Second neural netwok = student
    klassifizierer = featureExtractor.classification(Webcam,classifierReady);

}
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
