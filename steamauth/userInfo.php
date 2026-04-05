<?php
/**
 * Steam User Info Fetcher
 * Optimized for Docker: Uses cURL instead of file_get_contents and bypasses SSL verification.
 */
require_once __DIR__ . '/SteamConfig.php';

if (empty($_SESSION['steam_uptodate']) || empty($_SESSION['steam_personaname']) || strpos($_SESSION['steam_personaname'], 'User ') === 0) {
    
    $api_url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" . $steamauth['apikey'] . "&steamids=" . $_SESSION['steamid'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // Disable SSL verification to prevent common Docker certificate issues
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SteamAuth/3.2');
    
    $response = curl_exec($ch);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    $content = json_decode($response, true);
    
    if (isset($content['response']['players'][0])) {
        $player = $content['response']['players'][0];
        
        // Store user data in session
        $_SESSION['steam_steamid'] = $player['steamid'];
        $_SESSION['steam_communityvisibilitystate'] = $player['communityvisibilitystate'] ?? 0;
        $_SESSION['steam_profilestate'] = $player['profilestate'] ?? 0;
        $_SESSION['steam_personaname'] = $player['personaname'];
        $_SESSION['steam_lastlogoff'] = $player['lastlogoff'] ?? 0;
        $_SESSION['steam_profileurl'] = $player['profileurl'];
        $_SESSION['steam_avatar'] = $player['avatar'];
        $_SESSION['steam_avatarmedium'] = $player['avatarmedium'];
        $_SESSION['steam_avatarfull'] = $player['avatarfull'];
        $_SESSION['steam_personastate'] = $player['personastate'] ?? 0;
        $_SESSION['steam_realname'] = $player['realname'] ?? "Real name not given";
        $_SESSION['steam_primaryclanid'] = $player['primaryclanid'] ?? "";
        $_SESSION['steam_timecreated'] = $player['timecreated'] ?? 0;
        $_SESSION['steam_uptodate'] = time();
    } else {
        // Fallback name if API request fails
        error_log("Steam API Error for ID " . $_SESSION['steamid'] . ": " . $curl_error);
        
        if (empty($_SESSION['steam_personaname'])) {
            $_SESSION['steam_personaname'] = "User " . $_SESSION['steamid'];
            $_SESSION['steam_avatar'] = "";
            $_SESSION['steam_avatarmedium'] = "";
        }
    }
}

$steamprofile['steamid'] = $_SESSION['steam_steamid'];
$steamprofile['communityvisibilitystate'] = $_SESSION['steam_communityvisibilitystate'] ?? 0;
$steamprofile['profilestate'] = $_SESSION['steam_profilestate'] ?? 0;
$steamprofile['personaname'] = $_SESSION['steam_personaname'];
$steamprofile['lastlogoff'] = $_SESSION['steam_lastlogoff'] ?? 0;
$steamprofile['profileurl'] = $_SESSION['steam_profileurl'] ?? "";
$steamprofile['avatar'] = $_SESSION['steam_avatar'] ?? "";
$steamprofile['avatarmedium'] = $_SESSION['steam_avatarmedium'] ?? "";
$steamprofile['avatarfull'] = $_SESSION['steam_avatarfull'] ?? "";
$steamprofile['personastate'] = $_SESSION['steam_personastate'] ?? 0;
$steamprofile['realname'] = $_SESSION['steam_realname'] ?? "";
$steamprofile['primaryclanid'] = $_SESSION['steam_primaryclanid'] ?? "";
$steamprofile['timecreated'] = $_SESSION['steam_timecreated'] ?? 0;
$steamprofile['uptodate'] = $_SESSION['steam_uptodate'] ?? 0;
?>
