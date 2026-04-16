<?php
/**
 * Global Configuration File
 * This file contains database credentials, API keys, and site settings.
 * * IMPORTANT: For security reasons, do not upload your real credentials to public repositories.
 */

// --- Database Configuration ---
// If you are using the provided Docker setup, DB_HOST is usually '172.18.0.1' or the service name.
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'database_name');
define('DB_USER', 'database_user');
define('DB_PASS', 'database_password');

// --- Steam API Configuration ---
// You can get your Steam Web API Key here: https://steamcommunity.com/dev/apikey
define('STEAM_API_KEY', 'YOUR_STEAM_WEB_API_KEY_HERE');

// --- Site Settings ---
// The main URL of your website (e.g., https://skins.example.com). 
// IMPORTANT: Do not include a trailing slash at the end.
define('STEAM_DOMAIN_NAME', 'https://your-domain.com');

// --- API URL ---
// IMPORTANT: Do not include a trailing slash at the end.
define('API_URL', 'https://raw.githubusercontent.com/rogeraabbccdd/CSGO-API/main/public/api');

// Redirection pages after login/logout
define('STEAM_LOGIN_PAGE', 'index.php');
define('STEAM_LOGOUT_PAGE', 'index.php');

// --- Error Reporting ---
// Set to 0 for production to hide sensitive error details from users.
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>