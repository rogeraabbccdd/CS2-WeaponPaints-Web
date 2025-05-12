<?php
  require_once '../class/config.php';
  require_once '../class/database.php';
  require_once '../steamauth/steamauth.php';
  
  define("USER_AGENT", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36");

  $db = new DataBase();

  $_POST = json_decode(file_get_contents("php://input"), true);

  if (!isset($_GET["action"])) exit;

  switch($_GET["action"]) {
    case "check":
      $steamid = "";
      $avatar = "";
      $personname = "";
      $selectedSkins = [];
      $selectedKnife[0] = "weapon_knife";
      $selectedGlove = "";
      $selectedMusic[0] = 0;
      $selectedAgent = array(2 => "", 3 => "");
      $selectedPin[0] = 0;
      if (isset($_SESSION["steamid"])) {
        require_once "../steamauth/userInfo.php";
        $steamid = $steamprofile['steamid'];
        $avatar = $steamprofile['avatarmedium'];
        $personname = $steamprofile['personaname'];
        
        $querySelected = $db->select("SELECT * FROM `wp_player_skins` WHERE `wp_player_skins`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedSkins = [];
        foreach ($querySelected as $weapon) {
            $selectedSkins[$weapon['weapon_defindex']] =  [
                'weapon_paint_id' => $weapon['weapon_paint_id'],
                'weapon_seed' => $weapon['weapon_seed'],
                'weapon_wear' => $weapon['weapon_wear'],
                'weapon_wear' => $weapon['weapon_wear'],
                'weapon_nametag' => $weapon['weapon_nametag'],
                'weapon_stattrak' => $weapon['weapon_stattrak'],
                'weapon_sticker_0' => $weapon['weapon_sticker_0'],
                'weapon_sticker_1' => $weapon['weapon_sticker_1'],
                'weapon_sticker_2' => $weapon['weapon_sticker_2'],
                'weapon_sticker_3' => $weapon['weapon_sticker_3'],
                'weapon_keychain' => $weapon['weapon_keychain'],
            ];
        }

        $selectedKnifeRows = $db->select("SELECT * FROM `wp_player_knife` WHERE `wp_player_knife`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedKnife = [];
        foreach ($selectedKnifeRows as $row) {
          $selectedKnife[$row['weapon_team']] = $row['knife'];
        }
        if (empty($selectedKnife)) {
          $selectedKnife[0] = "weapon_knife";
        }

        $selectedGloveDefIndex = $db->select("SELECT * FROM `wp_player_gloves` WHERE `wp_player_gloves`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedGlove = -1;

        $selectedMusicRows = $db->select("SELECT * FROM `wp_player_music` WHERE `wp_player_music`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedMusic = [];
        foreach ($selectedMusicRows as $row) {
          $selectedMusic[$row['weapon_team']] = $row['music_id'];
        }

        if (empty($selectedMusic)) {
          $selectedMusic[0] = 0;
        }
        
        $selectedPinRows = $db->select("SELECT * FROM `wp_player_pins` WHERE `wp_player_pins`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedPin = [];
        foreach ($selectedPinRows as $row) {
          $selectedPin[$row['weapon_team']] = $row['id'];
        }

        if (empty($selectedPin)) {
          $selectedPin[0] = 0;
        }

        $selectedAgent = $db->select("SELECT * FROM `wp_player_agents` WHERE `wp_player_agents`.`steamid` = :steamid", ["steamid" => $steamid]);
        
        if (isset($selectedGloveDefIndex) && count($selectedGloveDefIndex) > 0) {
          $selectedGlovePaint = $db->select("SELECT weapon_paint_id FROM `wp_player_skins`
                                        WHERE
                                          `wp_player_skins`.`steamid` = :steamid AND
                                          weapon_defindex = :defIndex",
                                          ["steamid" => $steamid, "defIndex" => $selectedGloveDefIndex[0]["weapon_defindex"]]
                                      );
          if (isset($selectedGlovePaint) && count($selectedGlovePaint) > 0) {
            $selectedGlove = $selectedGlovePaint[0]["weapon_paint_id"];
          }
        }
      }
      echo json_encode(array(
        "steamid" => $steamid,
        "steam_avatar" => $avatar,
        "steam_personaname" => $personname,
        "selected_skins" => $selectedSkins,
        "selected_knife" => $selectedKnife,
        "selected_glove" => $selectedGlove,
        "selected_music" => $selectedMusic,
        "selected_pin" => $selectedPin,
        "selected_agents" => array(2 => $selectedAgent[0]["agent_t"] ?? "", 3 => $selectedAgent[0]["agent_ct"] ?? ""),
      ));
      break;
    
    case "set-music":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["music_id"]))     exit;
    
      $db->query("INSERT INTO `wp_player_music` VALUES(:steamid, :team, :music_id) ON DUPLICATE KEY UPDATE `music_id` = :music_id", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "music_id" => $_POST["music_id"]]);
      break;

    case "set-pin":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["pin_id"]))     exit;
    
      $db->query("INSERT INTO `wp_player_pins` VALUES(:steamid, :team, :pin_id) ON DUPLICATE KEY UPDATE `id` = :pin_id", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "pin_id" => $_POST["pin_id"]]);
      break;

    case "set-knife":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["knife"]))        exit;
      $db->query("INSERT INTO `wp_player_knife` VALUES(:steamid, :team, :knife) ON DUPLICATE KEY UPDATE `knife` = :knife", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "knife" => $_POST["knife"]]);
      break;

    case "set-agent":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["team"]))         exit;
      if (!isset($_POST["model"]))        exit;

      if ($_POST["model"] == "null")      $_POST["model"] = null;

      if ($_POST["team"] == "2") {
        $db->query("INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`) VALUES(:steamid, NULL, :model) ON DUPLICATE KEY UPDATE `agent_t` = :model", ["steamid" => $_SESSION["steamid"], "model" => $_POST["model"]]);
      } else if ($_POST["team"] == "3") {
        $db->query("INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`) VALUES(:steamid, :model, NULL) ON DUPLICATE KEY UPDATE `agent_ct` = :model", ["steamid" => $_SESSION["steamid"], "model" => $_POST["model"]]);
      }
      break;

    case "set-glove":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["paint"]))        exit;
    
      if ($_POST["paint"] == "-1") {
        $db->query("DELETE FROM `wp_player_skins` WHERE 
                    `wp_player_skins`.steamid = :steamid AND `wp_player_skins`.weapon_defindex IN (
                      SELECT * FROM (
                          SELECT weapon_defindex FROM wp_player_gloves WHERE `wp_player_gloves`.steamid = :steamid
                      ) A
                    )",
                    ["steamid" => $_SESSION["steamid"] ]);
        $db->query("DELETE FROM `wp_player_gloves` WHERE steamid = :steamid", ["steamid" => $_SESSION["steamid"] ]);
      } else {
        $db->query("INSERT INTO `wp_player_gloves` VALUES(:steamid, 0, :defIndex) ON DUPLICATE KEY UPDATE `weapon_defindex` = :defIndex", ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"]]);
        $rows = $db->query("UPDATE `wp_player_skins`
                            SET `weapon_paint_id` = :paint WHERE steamid = :steamid AND weapon_defindex = :defIndex",
                            ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"], "paint" => $_POST["paint"]]
        );
        if ($rows == 0) {
          $db->query("INSERT INTO `wp_player_skins` (`steamid`, `weapon_team`, `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed`) 
                    VALUES (:steamid, 0, :defIndex, :paint, 0.001, 0)",
                    ["steamid" => $_SESSION["steamid"], "paint" => $_POST["paint"], "defIndex" => $_POST["defIndex"]]
                  );
        }
      }
      break;

    case "set-skin":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["defIndex"]))     exit;
      if (!isset($_POST["paint"]))        exit;
      if (!isset($_POST["wear"]))         exit;
      if (!isset($_POST["seed"]))         exit;
      if (!isset($_POST["nametag"]))      exit;
      if (!isset($_POST["stattrack"]))    exit;
      if (!isset($_POST["sticker0"]))     exit;
      if (!isset($_POST["sticker1"]))     exit;
      if (!isset($_POST["sticker2"]))     exit;
      if (!isset($_POST["sticker3"]))     exit;
      if (!isset($_POST["keychain"]))     exit;

      if ($_POST["nametag"] == "")  $_POST["nametag"] = null;

      $rows = $db->query("UPDATE `wp_player_skins`
                            SET
                              `weapon_paint_id` = :paint, `weapon_wear` = :wear, `weapon_seed` = :seed, `weapon_nametag` = :nametag,
                              `weapon_stattrak` = :stattrack,
                              `weapon_sticker_0` = :sticker0,
                              `weapon_sticker_1` = :sticker1,
                              `weapon_sticker_2` = :sticker2,
                              `weapon_sticker_3` = :sticker3,
                              `weapon_keychain` = :keychain
                            WHERE steamid = :steamid AND weapon_defindex = :defIndex",
                            [
                              "steamid" => $_SESSION["steamid"],
                              "defIndex" => $_POST["defIndex"],
                              "paint" => $_POST["paint"],
                              "wear" => $_POST["wear"],
                              "seed" => $_POST["seed"],
                              "nametag" => $_POST["nametag"],
                              "stattrack" => $_POST["stattrack"],
                              "sticker0" => $_POST["sticker0"],
                              "sticker1" => $_POST["sticker1"],
                              "sticker2" => $_POST["sticker2"],
                              "sticker3" => $_POST["sticker3"],
                              "keychain" => $_POST["keychain"],
                            ]
      );
      if ($rows == 0) {
        $db->query("INSERT INTO `wp_player_skins` ()
                  VALUES (
                  :steamid, 0, :defIndex, :paint, :wear, :seed, :nametag, :stattrack, 0, 
                  :sticker0, :sticker1, :sticker2, :sticker3, '0;0;0;0;0;0;0',
                  :keychain
                  )",
                  [
                    "steamid" => $_SESSION["steamid"],
                    "defIndex" => $_POST["defIndex"],
                    "paint" => $_POST["paint"],
                    "wear" => $_POST["wear"],
                    "seed" => $_POST["seed"],
                    "nametag" => $_POST["nametag"],
                    "stattrack" => $_POST["stattrack"],
                    "sticker0" => $_POST["sticker0"],
                    "sticker1" => $_POST["sticker1"],
                    "sticker2" => $_POST["sticker2"],
                    "sticker3" => $_POST["sticker3"],
                    "keychain" => $_POST["keychain"],
                  ]
                );
      }
      break;
    
    case "get-skins":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/skins.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;

    case "get-musics":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/music_kits.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;

    case "get-agents":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/agents.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;

    case "get-stickers":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/stickers.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;

    case "get-keychains":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/keychains.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;

    case "get-pins":
      $lang = "en";
      if (isset($_GET["lang"])) $lang = $_GET["lang"];
      $url = curl_init();
      curl_setopt($url , CURLOPT_URL , "https://bymykel.github.io/CSGO-API/api/".$lang."/collectibles.json");
      curl_setopt($url, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($url, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($url);
      curl_close($url);
      header('Content-Type: application/json');
      break;
  }
?>