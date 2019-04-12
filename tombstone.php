<?php

	$host= 'siteground364.com';
	$user= 'krunalh4_kz79934';
	$pass= 'kz79934';
	$db= 'krunalh4_ej77536';
	$con = mysqli_connect($host,$user,$pass);

	mysqli_select_db($con, $db);
		
	if ($con)
	{
		//echo 'could not connected';
	
		$prev_Location = $_POST['prevLocation'];
		$next_Location = $_POST['nextLocation'];
		$leader_Name = $_POST['leaderName'];
		$temp_Traveled = $_POST['tempTraveled'];
		$msg_Input = mysqli_real_escape_string($con, $_REQUEST['messageInput']);
		
		$sql = "INSERT INTO tombstone(message, prevLocation, nextLocation, leaderName, miles) VALUES ('$msg_Input', '$prev_Location', '$next_Location', '$leader_Name', '$temp_Traveled')";
		$query = mysqli_query($con,$sql);

	}
	
	mysqli_close($con);

?>

<html>
<head>
	<link rel="stylesheet" type="text/css" href="proj2.css">
	<title>Oregon Trail Super Deluxe 3rd Strike Hyper Combo Edition Version 2.07</title>
</head>
<body>
<h1>Thanks for playing!</h1>
<button class='button' onclick="window.location.href='index.php'">Play Again</button>
</body>
</html>