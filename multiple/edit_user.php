<?php
$conn = mysql_connect('siteground364.com','krunalh4_kz79934','kz79934');
mysql_select_db('users',$conn);

if(isset($_POST["submit"]) && $_POST["submit"]!="") {
$usersCount = count($_POST["userId"]);
for($i=0;$i<$usersCount;$i++) {


mysql_query("UPDATE users set event='" . $_POST["userName"][$i] . "',topic='" . $_POST["password"][$i] . "',topic_desc='" . $_POST["firstName"][$i] . "',date='" . $_POST["lastName"][$i] . "',speaker='" . $_POST["speaker"][$i] . "',building='" . $_POST["building"][$i] . "',room='" . $_POST["room"][$i] . "' WHERE userId='" . $_POST["userId"][$i] . "'");
}
header("Location:list_user.php");
}

?>
<html>
<head>
<title>Edit Multiple User</title>
<link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
<form name="frmUser" method="post" action="">
<div style="width:500px;">
<table border="0" cellpadding="10" cellspacing="0" width="500" align="center">
<tr class="tableheader">
<td>Edit User</td>
</tr>
<?php
$rowCount = count($_POST["users"]);
for($i=0;$i<$rowCount;$i++) {
$result = mysql_query("SELECT * FROM users WHERE userId='" . $_POST["users"][$i] . "'");

$row[$i]= mysql_fetch_array($result);
?>
<tr>
<td>
<table border="0" cellpadding="10" cellspacing="0" width="500" align="center" class="tblSaveForm">
<tr>
<td><label>Event</label></td>
<td><input type="hidden" name="userId[]" class="txtField" value="<?php echo $row[$i]['userId']; ?>"><input type="text" name="userName[]" class="txtField" value="<?php echo $row[$i]['event']; ?>"></td>
</tr>
<tr>
<td><label>Topiv</label></td>
<td><input type="text" name="password[]" class="txtField" value="<?php echo $row[$i]['topic']; ?>"></td>
</tr>
<td><label>Description</label></td>
<td><input type="text" name="firstName[]" class="txtField" value="<?php echo $row[$i]['topic_desc']; ?>"></td>
</tr>
<td><label>Date</label></td>
<td><input type="text" name="lastName[]" class="txtField" value="<?php echo $row[$i]['date']; ?>"></td>
</tr>
<td><label>Speaker</label></td>
<td><input type="text" name="speaker[]" class="txtField" value="<?php echo $row[$i]['speaker']; ?>"></td>
</tr>
<td><label>Building</label></td>
<td><input type="text" name="building[]" class="txtField" value="<?php echo $row[$i]['building']; ?>"></td>
</tr>
<td><label>Room</label></td>
<td><input type="text" name="room[]" class="txtField" value="<?php echo $row[$i]['room']; ?>"></td>
</tr>
</table>
</td>
</tr>
<?php
}
?>
<tr>
<td colspan="2"><input type="submit" name="submit" value="Submit" class="btnSubmit"></td>
</tr>
</table>
</div>
</form>
</body></html>