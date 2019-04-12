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
	
		$num = $_POST['scorePage'];
		$playerName = mysqli_real_escape_string($con, $_REQUEST['pageInput']);
		
		$sql = "INSERT INTO high_score(score, name) VALUES ($num, '$playerName')";
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
<button class="button" onclick="window.location.href='index.php'"><span>Play Again</span></button>
</body>
</html>