<?php
/**
 * SteamAuth Main Library
 * Updated for PHP 8.2 and Docker/Nginx environments.
 */
ob_start();
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function logoutbutton() {
    echo "<form action='' method='get'><button class='btn btn-secondary' name='logout' type='submit'>Logout</button></form>";
}

function loginbutton($buttonstyle = "square") {
    $button_img = ($buttonstyle == "rectangle") ? "01" : "02";
    echo "<a href='?login'><img src='https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_".$button_img.".png'></a>";
}

function login () {
    require 'openid.php';
    try {
        require 'SteamConfig.php';
        $openid = new LightOpenID($steamauth['domainname']);
        
        if(!$openid->mode) {
            $openid->identity = 'https://steamcommunity.com/openid';
            session_write_close();
            header('Location: ' . $openid->authUrl());
            exit;
        } elseif ($openid->mode == 'cancel') {
            echo 'User has canceled authentication!';
        } else {
            if($openid->validate()) { 
                $id = $openid->identity;
                $ptn = "/^https?:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";
                preg_match($ptn, $id, $matches);
                
                $_SESSION['steamid'] = $matches[1];
                
                session_write_close();
                
                if (!headers_sent()) {
                    header('Location: '.$steamauth['loginpage']);
                    exit;
                } else {
                    echo '<script type="text/javascript">window.location.href="'.$steamauth['loginpage'].'";</script>';
                    echo '<noscript><meta http-equiv="refresh" content="0;url='.$steamauth['loginpage'].'" /></noscript>';
                    exit;
                }
            } else {
                echo "User is not logged in.\n";
            }
        }
    } catch(ErrorException $e) {
        echo $e->getMessage();
    }
}

function logout () {
    require 'SteamConfig.php';
    session_unset();
    session_destroy();
    session_write_close();
    header('Location: '.$steamauth['logoutpage']);
    exit;
}

function update () {
    unset($_SESSION['steam_uptodate']);
    session_write_close();
    header('Location: '.$_SERVER['PHP_SELF']);
    exit;
}
?>
