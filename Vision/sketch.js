

//Variable die die Bildeingabe festlegt
var Webcam;

//Variable die das Endergebnis beinhalten wird
var ErgebnisForDatabase="";

/////////////////////////////////////////////////////
//Variablen der neuralen Netzwerke///////////////////

//Lehrer trainiert, weiß was zu tun ist
var featureExtractor;

//Schüler lernt vom Lehrer was zu tun ist kann aber auch neues lernen
var klassifizierer; 

/////////////////////////////////////////////////////
//Hier werden die Namen der Buttons festgelegt///////

var buttonTomateReif;   //Button zur Tomate
var buttonTomateUnreif;     //Button zur Kiwi
var buttonSalatReif;    //Button zum Salat
var buttonSalatUnreif; //Button zum Salatrio

var buttonTraining; //Button zum trainieren des Netzwerkes
var buttonTipp;     //Button zum Ausgeben der Lösung

//var buttonSave;     //Button zum Speichern des Models
//var buttonLoad;     //Button zum laden des Models

/////////////////////////////////////////////////////
//Hier werden Variablen für Counter festgelegt, die die Anzahl von geshossenen Bildern der Nahrungsmittel zählen

var tomateReifCounter = 0;     //Zählt Bilder von Tomaten
var tomateUnreifCounter = 0;        //Zählt Bilder von Kiwis
var salatReifCounter = 0;       //Zählt Bilder von Salat
var salatUnreifCounter = 0;    //Zählt Bilder von Salatrio

var databaseOpen = false;


/////////////////////////////////////////////////////
//Diese Funktion sagt später Bescheid ob das Model geladen hat

function modelIsLoaded(){
    console.log("Model wurde erfolgreich geladen.");
}

/////////////////////////////////////////////////////
//Diese Funktion lädt die Datei - model.jsn -////////

function classifierReady(){
    console.log("Ready")
    klassifizierer.load("./model/model.json", modelHasLoaded);
}

//Diese Funktion gibt Bescheid dass die Datei - model.json - geladen wurde und beschreibt die Buttons mit Logik

function modelHasLoaded(){
    console.log("Model wurde erfolgreich geladen, jetzt kann es losgehen1");
    setupButtons(); //Funktion zum beladen der Buttons mit Logik
}

////////////////////////////////////////////////////
//Funktion zur Anzeige des Ergebnisses//////////////

function ergebnisseAnzeigen(error, ergebnisse){
    
    ErgebnisForDatabase=ergebnisse;

    console.log(ergebnisse); //Gibt das Ergebnis in der Konsole aus
    
    select('#Ergebnis').html(ergebnisse);   //Wählt h1=Ergebnis aus der Indes.html aus und befüllt sie mit dem Ergebnis

    klassifizierer.classify(ergebnisseAnzeigen);    // ruft selbe funktion wieder auf also ein dauerloop
}


function insertInDatabase(){
	if (databaseOpen == true) {

	var parts = ErgebnisForDatabase.split(" ");
    		var plant = parts[0];
    		var state = parts[1];

    		//var d = Date(Date.now());
    		//var time = d.toString();

    		var heute = new Date();
    		var day = heute.getDay();
    		var month = heute.getMonth();
    		var year = heute.getYear();
    		var stunden = heute.getHours();
    		var minuten = heute.getMinutes();
    		var sekunden = heute.getSeconds();

    		var time = day+'.'+month+'.'+year+' '+stunden+':'+minuten+':'+sekunden;

    		$.ajax({
    			type:'POST',
    			url:'database.php',
    			data:{ Datum: time, Pflanze: plant, Status: state, Ort: "Dieburg"},
    			success: function(response){
    				alert(response);
    			}
    		});
    

    setTimeout(function() { insertInDatabase(); }, 10000);
}
}

//Setup
//Update

///////////////////////////////////////////////////
//Hier wird die Logik der Buttons geschrieben//////
function setupButtons(){
    
    //Logik zum Tomatenbutton
    buttonTomateReif = select('#ripetomatoButton');
    buttonTomateReif.mousePressed(function(){
        console.log("Tomate reif gedrückt");
        
        //Bild der Webcam machen und an Neuronales Netzwerk=NN geben
        klassifizierer.addImage('Tomate reif');
        tomateReifCounter++;   //Zählt den Bildcounter hoch
        console.log("Bild geschossen!");
        select('#ripetomatoCounter').html(tomateReifCounter);
    });
    
    buttonTomateUnreif = select('#unripetomatoButton');
    buttonTomateUnreif.mousePressed(function(){
        console.log("Tomate unreif gedrückt");
        //Ab hier kommt die Logik also die Funktionalität des Buttons
        //Bild der Webcam machen und an Neuronales Netzwerk, NN geben
        klassifizierer.addImage('Tomate unreif');
        tomateUnreifCounter++;
        console.log("Bild geschossen!");
        select('#unripetomatoCounter').html(tomateUnreifCounter);
    });
    
    buttonSalatReif = select('#ripesalatButton');
    buttonSalatReif.mousePressed(function(){
        console.log("Salat reif gedrückt");
        klassifizierer.addImage('Salat reif');
        salatReifCounter++;
        console.log("Bild geschossen!");
        //Zählt die Anzahl der Bilder von Salat hoch
        select('#ripesalatCounter').html(salatReifCounter);
    });
    
    buttonSalatUnreif = select('#unripesalatButton');
    buttonSalatUnreif.mousePressed(function(){
        console.log("Salat unreif gedrückt");
        klassifizierer.addImage('Salat unreif');
        salatUnreifCounter++;
        console.log("Bild geschossen!");
        //Zählt die Anzahl der Bilder von Salat hoch
        select('#unripesalatCounter').html(salatUnreifCounter);
    });
    
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
    
    buttonTipp = select('#guessButton');
    buttonTipp.mousePressed(function(){
        
        klassifizierer.classify(ergebnisseAnzeigen);
        console.log("Antwortbutton gedrückt");
    });
    
    buttonSave = select('#saveButton');
    buttonSave.mousePressed(function(){
        klassifizierer.save();
    });

    buttonInsert = select('#insertButton');
    buttonInsert.mousePressed(function(){
    	console.log("Schreibvorgangstart gedrückt");

    	databaseOpen = true;

    	insertInDatabase();
    });

    buttonStop = select('#stopButton');
    buttonStop.mousePressed(function(){
    	console.log("Schreibvorgangstopp gedrückt");
			
			databaseOpen = false;

    	});
    
   /* buttonLoad = select('#loadButton');
    buttonLoad.changed(function(){
        klassifizierer.load(buttonLoad.elt.files, function(){
            select('#modelStatus').html('Custom Model loaded!');
        });
    
    });*/
}

////////////////////////////////////////////////////
//Im Setup werden Funktionen ausgeführt
function setup(){
    
    console.log("Setup aufgerufen");
    
    noCanvas(); //Hier wird festgelegt, dass es keine Rahmen gibt
    
    Webcam = createCapture(VIDEO); //Die Webcam Variable wird festgelegt.
    Webcam.size(320, 240);

    //Erstes Neuronales Netzwerk, Lehrer
    featureExtractor = ml5.featureExtractor('MobileNet', modelIsLoaded); //Hier wird der featureExtractor beschrieben, bescheidgegeben und das "Wissen" von ml5. geladen
    
    //Anzahl der möglichen Ergebnisse wird hier angegeben 
    featureExtractor.numClasses= 4; 
    
    //Zweites neurales Netzwerk, Schüler
    klassifizierer = featureExtractor.classification(Webcam,classifierReady);
    
}
