<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "planta";

$datum = $_POST['Datum'];
$pflanze = $_POST['Pflanze'];
$status = $_POST['Status'];
$ort = $_POST['Ort'];

echo $datum;
echo $pflanze;
echo $status;
echo $ort;


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";

//CALL DATABASE

// Attempt insert query execution
$sql = "INSERT INTO anbau (Datum, Pflanze, Status, Ort) VALUES ('$datum', '$pflanze', '$status', '$ort')";
if(mysqli_query($conn, $sql)){
    echo "Records inserted successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
}
 
// Close connection
mysqli_close($conn);

/*mysqli_close();*/


?>