<?php
  /**
   * CS2 WeaponPaints API Handler
   * Fixed for PHP 8.2, Docker, and Nginx Proxy setups.
   */
  if (session_status() == PHP_SESSION_NONE) {
      session_start();
  }

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
      $selectedKnife = [2 => "weapon_knife", 3 => "weapon_knife"];
      $selectedGlove = [2 => 0, 3 => 0];
      $selectedMusic = [2 => 0, 3 => 0];
      $selectedAgent = [2 => "", 3 => ""];
      $selectedPin = [2 => 0, 3 => 0];

      if (isset($_SESSION["steamid"]) && !empty($_SESSION["steamid"])) {
        require_once __DIR__ . '/../steamauth/userInfo.php';
        
        $steamid = $_SESSION["steamid"];
        $avatar = $_SESSION['steam_avatarmedium'] ?? "";
        $personname = $_SESSION['steam_personaname'] ?? "";

        // Use absolute path via __DIR__ to avoid issues when called from subfolders
        $querySelected = $db->select("SELECT * FROM `wp_player_skins` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        foreach ($querySelected as $weapon) {
            $selectedSkins[$weapon['weapon_defindex']][$weapon['weapon_team']] = [
                'weapon_paint_id' => $weapon['weapon_paint_id'],
                'weapon_seed' => $weapon['weapon_seed'],
                'weapon_wear' => $weapon['weapon_wear'],
                'weapon_nametag' => $weapon['weapon_nametag'],
                'weapon_stattrak' => $weapon['weapon_stattrak'],
                'weapon_sticker_0' => $weapon['weapon_sticker_0'],
                'weapon_sticker_1' => $weapon['weapon_sticker_1'],
                'weapon_sticker_2' => $weapon['weapon_sticker_2'],
                'weapon_sticker_3' => $weapon['weapon_sticker_3'],
                'weapon_sticker_4' => $weapon['weapon_sticker_4'],
                'weapon_keychain' => $weapon['weapon_keychain'],
            ];
        }

        // Fetch other categories (Knife, Gloves, Music, Pins, Agents)
        $selectedKnifeRows = $db->select("SELECT * FROM `wp_player_knife` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        foreach ($selectedKnifeRows as $row) {
          $selectedKnife[$row['weapon_team']] = $row['knife'];
        }

        $selectedGloveRows = $db->select("SELECT * FROM `wp_player_gloves` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        foreach ($selectedGloveRows as $row) {
          $selectedGlove[$row['weapon_team']] = $row['weapon_defindex'];
        }

        $selectedMusicRows = $db->select("SELECT * FROM `wp_player_music` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        foreach ($selectedMusicRows as $row) {
          $selectedMusic[$row['weapon_team']] = $row['music_id'];
        }
        
        $selectedPinRows = $db->select("SELECT * FROM `wp_player_pins` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        foreach ($selectedPinRows as $row) {
          $selectedPin[$row['weapon_team']] = $row['id'];
        }

        $selectedAgentRows = $db->select("SELECT * FROM `wp_player_agents` WHERE `steamid` = :steamid", ["steamid" => $steamid]);
        if (!empty($selectedAgentRows)) {
            $selectedAgent = [
                2 => $selectedAgentRows[0]["agent_t"] ?? "",
                3 => $selectedAgentRows[0]["agent_ct"] ?? ""
            ];
        }
      }

      header('Content-Type: application/json');
      echo json_encode(array(
        "steamid" => $steamid,
        // Doubled keys for frontend compatibility
        "steam_avatar" => $avatar,
        "avatar" => $avatar, 
        "avatarmedium" => $avatar,
        
        "steam_personaname" => $personname,
        "personaname" => $personname,
        "personname" => $personname,
        
        "selected_skins" => $selectedSkins,
        "selected_knife" => $selectedKnife,
        "selected_glove" => $selectedGlove,
        "selected_music" => $selectedMusic,
        "selected_pin" => $selectedPin,
        "selected_agents" => $selectedAgent,
      ));
      break;
    
    case "set-music":
      if (!isset($_SESSION["steamid"])) exit;
      $db->query("INSERT INTO `wp_player_music` VALUES(:steamid, :team, :music_id) ON DUPLICATE KEY UPDATE `music_id` = :music_id", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "music_id" => $_POST["music_id"]]);
      break;

    case "set-pin":
      if (!isset($_SESSION["steamid"])) exit;
      $db->query("INSERT INTO `wp_player_pins` VALUES(:steamid, :team, :pin_id) ON DUPLICATE KEY UPDATE `id` = :pin_id", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "pin_id" => $_POST["pin_id"]]);
      break;

    case "set-knife":
      if (!isset($_SESSION["steamid"])) exit;
      $db->query("INSERT INTO `wp_player_knife` VALUES(:steamid, :team, :knife) ON DUPLICATE KEY UPDATE `knife` = :knife", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "knife" => $_POST["knife"]]);
      break;

    case "set-agent":
      if (!isset($_SESSION["steamid"])) exit;
      $model = ($_POST["model"] == "null") ? null : $_POST["model"];
      if ($_POST["team"] == "2") {
        $db->query("INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`) VALUES(:steamid, NULL, :model) ON DUPLICATE KEY UPDATE `agent_t` = :model", ["steamid" => $_SESSION["steamid"], "model" => $model]);
      } else if ($_POST["team"] == "3") {
        $db->query("INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`) VALUES(:steamid, :model, NULL) ON DUPLICATE KEY UPDATE `agent_ct` = :model", ["steamid" => $_SESSION["steamid"], "model" => $model]);
      }
      break;

    case "set-glove":
      if (!isset($_SESSION["steamid"])) exit;
      $db->query("INSERT INTO `wp_player_gloves` VALUES(:steamid, :team, :defIndex) ON DUPLICATE KEY UPDATE `weapon_defindex` = :defIndex", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "defIndex" => $_POST["defIndex"]]);
      $db->query("INSERT INTO `wp_player_skins` (`steamid`, `weapon_team`, `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed`) VALUES (:steamid, :team, :defIndex, :paint, 0.001, 0) ON DUPLICATE KEY UPDATE `weapon_paint_id` = :paint", ["steamid" => $_SESSION["steamid"], "team" => $_POST["team"], "paint" => $_POST["paint"], "defIndex" => $_POST["defIndex"]]);
      break;

    case "set-skin":
      if (!isset($_SESSION["steamid"])) exit;
      foreach ([2, 3] as $team) {
          if (!isset($_POST[$team])) continue;
          $data = $_POST[$team];
          $nametag = ($data["nametag"] == "") ? null : $data["nametag"];
          $db->query("INSERT INTO `wp_player_skins` VALUES (:steamid, :team, :defIndex, :paint, :wear, :seed, :nametag, :stattrack, 0, :s0, :s1, :s2, :s3, :s4, :keychain) ON DUPLICATE KEY UPDATE `weapon_paint_id` = :paint, `weapon_wear` = :wear, `weapon_seed` = :seed, `weapon_nametag` = :nametag, `weapon_stattrak` = :stattrack, `weapon_sticker_0` = :s0, `weapon_sticker_1` = :s1, `weapon_sticker_2` = :s2, `weapon_sticker_3` = :s3, `weapon_sticker_4` = :s4, `weapon_keychain` = :keychain", [
              "steamid" => $_SESSION["steamid"], "team" => $team, "defIndex" => $data["defIndex"], "paint" => $data["paint"], "wear" => $data["wear"], "seed" => $data["seed"], "nametag" => $nametag, "stattrack" => $data["stattrack"], "s0" => $data["sticker0"], "s1" => $data["sticker1"], "s2" => $data["sticker2"], "s3" => $data["sticker3"], "s4" => $data["sticker4"], "keychain" => $data["keychain"]
          ]);
      }
      break;

    case "get-skins":
    case "get-musics":
    case "get-agents":
    case "get-stickers":
    case "get-keychains":
    case "get-pins":
      $endpoints = [
          "get-skins" => "skins.json",
          "get-musics" => "music_kits.json",
          "get-agents" => "agents.json",
          "get-stickers" => "stickers.json",
          "get-keychains" => "keychains.json",
          "get-pins" => "collectibles.json"
      ];
      $lang = $_GET["lang"] ?? "en";
      $action = $_GET["action"];
      $cache_file = __DIR__ . "/cache/" . $lang . "_" . $endpoints[$action];
      $cache_time = 86400;  // 1 day

      header('Content-Type: application/json');

      if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_time)) {
          echo file_get_contents($cache_file);
          break;
      }

      $url = API_URL."/".$lang."/".$endpoints[$action];
      
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_USERAGENT, USER_AGENT);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
      $result = curl_exec($ch);
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      curl_close($ch);

      if ($http_code == 200 && !empty($result)) {
          if (!is_dir(__DIR__ . "/cache")) {
              mkdir(__DIR__ . "/cache", 0777, true);
          }
          file_put_contents($cache_file, $result);
          echo $result;
      } else {
          if (file_exists($cache_file)) {
              echo file_get_contents($cache_file);
          } else {
              echo json_encode(["error" => "Failed to fetch data from API"]);
          }
      }
      break;
  }
?>
