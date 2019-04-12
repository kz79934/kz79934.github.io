<?php
$conn = mysql_connect('siteground364.com','krunalh4_kz79934','kz79934');
mysql_select_db('users',$conn);

$rowCount = count($_POST["users"]);
for($i=0;$i<$rowCount;$i++) {
mysql_query("DELETE FROM users WHERE userId='" . $_POST["users"][$i] . "'");
}
header("Location:list_user.php");
?>