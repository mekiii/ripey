<!--<?php phpinfo ();?>-->

<html>

<head>
  <meta charset="UTF-8">



  <!--<Lädt die JQuery Datenbank aus dem Source-Ordner>-->
  <script src="source/jquery.min.js"></script>
  
  <!--<Lädt Daten zum neuralen Netzwerk aus dem Source-Ordner>-->
  <script src="source/p5.min.js"></script>
  <script src="source/p5.dom.min.js"></script>
  <script src="source/ml5.min.js" type="text/javascript"></script> 
  
  <!--<Lädt die sketch.js-Datei>-->
  <script src="sketch.js"></script>

</head>

<body>

    <!--Erstellt ein Überschrift, welche das Resultat aus der Bildanalyse ausgibt-->
    <h1 id="Ergebnis"></h1>

    <!--/////////////////////////////////////////////////////////////////////////-->
    <!--/////////////////////////////////////////////////////////////////////////-->
    <!--BUTTONS-->

    <!--Erstellt einen Button, zum erstellen der Bilder von reifen Tomaten-->
    <button id="ripetomatoButton">Tomate reif(<span id="ripetomatoCounter">0</span>)</button>

    <!--Erstellt einen Button, zum erstellen der Bilder von unreifen Tomaten-->
    <button id="unripetomatoButton">Tomate unreif (<span id="unripetomatoCounter">0</span>)</button>

    <!--Erstellt einen Button, zum erstellen der Bilder von reifem Salat-->
    <button id="ripesalatButton">Salat reif (<span id="ripesalatCounter">0</span>)</button>
    
    <!--Erstellt einen Button, zum erstellen der Bilder von unreifem Salat-->
    <button id="unripesalatButton">Salat unreif (<span id="unripesalatCounter">0</span>)</button>
    
    <button id="trainingButton">Trainieren</button>
    <button id="guessButton">Was ist es?</button>
    
    <button id="saveButton">Speichern</button>

    <button id="insertButton">Schreibvorgang starten</button>

    <button id="stopButton">Schreibvorgang stoppen</button>
    
    <!--<h6><span id="modelStatus">Loading base model...</span></h6>-->
    
    
</body>

</html>
