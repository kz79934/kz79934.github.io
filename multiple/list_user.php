<?php
$conn = mysql_connect('siteground364.com','krunalh4_kz79934','kz79934');
mysql_select_db('users',$conn);
$result = mysql_query('SELECT * FROM users');
?>
<html>
<head>
<title>Users List</title>
<link rel="stylesheet" type="text/css" href="styles.css" />
<script language="javascript" src="users.js" type="text/javascript"></script>
</head>
<body>
<form name="frmUser" method="post" action="">
<div style="width:500px;">
<table border="0" cellpadding="10" cellspacing="1" width="500" class="tblListForm">
<tr class="listheader">
<td></td>
<td>Event</td>
<td>Topice</td>
<td>Description</td>
<td>Date</td>
<td>Speaker</td>
<td>Building</td>
<td>Room</td>
</tr>
<?php
$i=0;
while($row = mysql_fetch_array($result)) {
if($i%2==0)
$classname="evenRow";
else
$classname="oddRow";
?>
<tr class="<?php if(isset($classname)) echo $classname;?>">
<td><input type="checkbox" name="users[]" value="<?php echo $row["userId"]; ?>" ></td>
<td><?php echo $row["event"]; ?></td>
<td><?php echo $row["topic"]; ?></td>
<td><?php echo $row["topic_desc"]; ?></td>
<td><?php echo $row["date"]; ?></td>
<td><?php echo $row["speaker"]; ?></td>
<td><?php echo $row["building"]; ?></td>
<td><?php echo $row["room"]; ?></td>
</tr>
<?php
$i++;
}
?>
<tr class="listheader">
<td colspan="4"><input type="button" name="update" value="Update" onClick="setUpdateAction();" /> <input type="button" name="delete" value="Delete"  onClick="setDeleteAction();" /></td>
</tr>
</table>
</form>
</div>
</body></html>