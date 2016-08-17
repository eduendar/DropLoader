<?php
	var_dump($_FILES);
	var_dump($_POST);
?>
<!DOCTYPE html>
<html>
<head>
	<title>Sample</title>
	<link rel="stylesheet" href="css/font-awesome.css">
	<link rel="stylesheet" href="dropLoad.css">
</head>
<body>
	<form id="formular" action="index.php" method="POST">
		<div id="dropLoad"></div>
		<button type="submit">Hochladen</button>
	</form>
	<script language="javascript" type="text/javascript" src="dropLoad.js"></script>
	<script>
		document.addEventListener("DOMContentLoaded", function(event) {
			var dz = new DropLoad("dropLoad","formular"); 
			dz.create();
		});
	</script>
</body>
</html>