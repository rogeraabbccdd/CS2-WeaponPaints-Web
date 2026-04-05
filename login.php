<?php
require_once './class/config.php';
require_once './class/database.php';
require_once './steamauth/steamauth.php';

if (isset($_SESSION['steamid'])) {

  $steamid = $_SESSION['steamid'];
  header("Location: ./");
}
else {
  login();
}
?>