<?php
////////////////////////////////////////
// Information about Server and Database
// Set variables with server information
$servername = "127.0.0.1"; // Adress of Server who runs database
$username = "root"; // MySQL User = User of database
$password = "runmysql"; // MySQL Password = PW of database user
$dbname = "planta"; // Database name
////////////////////////////////////////


////////////////////////////////////////
// Set variables for database content
$datum = $_POST['Datum'];
$pflanze = $_POST['Pflanze'];
$status = $_POST['Status'];
$ort = $_POST['Ort'];
////////////////////////////////////////


////////////////////////////////////////
// Printing variables of database content
/*
echo $datum;
echo $pflanze;
echo $status;
echo $ort;
*/
////////////////////////////////////////


////////////////////////////////////////
// Create connection to database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully"; // Printing when successfully connected
////////////////////////////////////////


////////////////////////////////////////
// Call Database
// Attempt insert query execution
$sql = "INSERT INTO anbau (Datum, Pflanze, Status, Ort) VALUES ('$datum', '$pflanze', '$status', '$ort')";
if(mysqli_query($conn, $sql)){
    echo "Records inserted successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
}
////////////////////////////////////////


////////////////////////////////////////
// Close connection to database
mysqli_close($conn);
////////////////////////////////////////

?>
