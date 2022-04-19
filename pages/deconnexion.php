<?php
// deconnexion de la page
session_destroy();
header("location: index.php?page=connexion");
die();
?>
