<?php
/**
 * SteamAuth Configuration
 * Hardcoded values recommended for Docker/Nginx Proxy environments.
 */
require_once __DIR__ . '/../class/config.php';

//Version 3.2
$steamauth['apikey'] = STEAM_API_KEY; // Your Steam WebAPI-Key found at https://steamcommunity.com/dev/apikey
$steamauth['domainname'] = STEAM_DOMAIN_NAME; // The main URL of your website displayed in the login page
$steamauth['logoutpage'] = STEAM_LOGOUT_PAGE; // Page to redirect to after a successfull logout (from the directory the SteamAuth-folder is located in) - NO slash at the beginning!
$steamauth['loginpage'] = STEAM_LOGIN_PAGE; // Page to redirect to after a successfull login (from the directory the SteamAuth-folder is located in) - NO slash at the beginning!

$steamauth['domainname'] = $steamauth['domainname'];
$steamauth['loginpage'] = $steamauth['domainname'] . "/" . $steamauth['loginpage'];
$steamauth['logoutpage'] = $steamauth['domainname'] . "/" . $steamauth['logoutpage'];

// System stuff
if (empty($steamauth['apikey'])) {
    die("<div style='color: white; background: red; padding: 10px;'>SteamAuth: Please supply an API-Key in class/config.php!</div>");
}
if (empty($steamauth['domainname'])) {$steamauth['domainname'] = $_SERVER['SERVER_NAME'];}
if (empty($steamauth['logoutpage'])) {$steamauth['logoutpage'] = $_SERVER['PHP_SELF'];}
if (empty($steamauth['loginpage'])) {$steamauth['loginpage'] = $_SERVER['PHP_SELF'];}
?>
