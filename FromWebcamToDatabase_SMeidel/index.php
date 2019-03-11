<!--<?php phpinfo ();?>-->


<!--Beginn HTML-->
<html>

<head>
  <meta charset="UTF-8">

  <!--/////////////////////////////////////////////////////////////////////////-->
  <!--Load sources-->

  <!--Load JQuery library from source directory-->
  <script src="source/jquery.min.js"></script>

  <!--Load ML5 files from source directory-->
  <script src="source/p5.min.js"></script>
  <script src="source/p5.dom.min.js"></script>
  <script src="source/ml5.min.js" type="text/javascript"></script>

  <!--Load functions for buttons and commants for database from source directory-->
  <script src="sketch.js"></script>
  <!--/////////////////////////////////////////////////////////////////////////-->

</head>

<body>

    <!--/////////////////////////////////////////////////////////////////////////-->
    <!--Creating headline for result of vision detection-->
    <h1 id="Ergebnis"></h1>
    <!--/////////////////////////////////////////////////////////////////////////-->


    <!--/////////////////////////////////////////////////////////////////////////-->
    <!--Creating buttons-->

    <!--Creating button to creating an image of a ripe tomato-->
    <button id="ripetomatoButton">Tomate reif(<span id="ripetomatoCounter">0</span>)</button>

    <!--Creating button to creating an image of an unripe tomato-->
    <button id="unripetomatoButton">Tomate unreif (<span id="unripetomatoCounter">0</span>)</button>

    <!--Creating button to creating an image of a ripe salad-->
    <button id="ripesalatButton">Salat reif (<span id="ripesalatCounter">0</span>)</button>

    <!--Creating button to creating an image of an unripe tomato-->
    <button id="unripesalatButton">Salat unreif (<span id="unripesalatCounter">0</span>)</button>

    <!--Creating button to train a model for vision detection-->
    <button id="trainingButton">Trainieren</button>

    <!--Creating button to save and download the model-->
    <button id="saveButton">Speichern</button>

    <!--Creating button to show the result of vision detection-->
    <button id="guessButton">Was ist es?</button>

    <!--/////////////////////-->
    <!--Database buttons-->

    <!--Creating button to start the write process for writing in database-->
    <button id="insertButton">Schreibvorgang starten</button>

    <!--Creating button to stop the write process for writing in database-->
    <button id="stopButton">Schreibvorgang stoppen</button>

    <!--/////////////////////-->
    <!--/////////////////////////////////////////////////////////////////////////-->

</body>

</html>
<!--End HTML-->
