<?php
  require_once '../class/config.php';
  require_once '../class/database.php';
  require_once '../steamauth/steamauth.php';

  $db = new DataBase();

  $_POST = json_decode(file_get_contents("php://input"), true);

  if (!isset($_GET["action"])) exit;

  switch($_GET["action"]) {
    case "check":
      $steamid = "";
      $avatar = "";
      $personname = "";
      $selectedSkins = [];
      $selectedKnife = "";
      $selectedGlove = "";
      $selectedMusic = "";
      $selectedAgent = "";
      if (isset($_SESSION["steamid"])) {
        require_once "../steamauth/userInfo.php";
        $steamid = $steamprofile['steamid'];
        $avatar = $steamprofile['avatarmedium'];
        $personname = $steamprofile['personaname'];
        
        $querySelected = $db->select("SELECT `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed` FROM `wp_player_skins` WHERE `wp_player_skins`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedSkins = [];
        foreach ($querySelected as $weapon) {
            $selectedSkins[$weapon['weapon_defindex']] =  [
                'weapon_paint_id' => $weapon['weapon_paint_id'],
                'weapon_seed' => $weapon['weapon_seed'],
                'weapon_wear' => $weapon['weapon_wear'],
            ];
        }

        $selectedKnife = $db->select("SELECT * FROM `wp_player_knife` WHERE `wp_player_knife`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedGloveDefIndex = $db->select("SELECT * FROM `wp_player_gloves` WHERE `wp_player_gloves`.`steamid` = :steamid", ["steamid" => $steamid]);
        $selectedGlove = -1;
        $selectedMusic = $db->select("SELECT * FROM `wp_player_music` WHERE `wp_player_music`.`steamid` = :steamid", ["steamid" => $steamid]);
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
        "selected_knife" => $selectedKnife[0]["knife"] ?? "weapon_knife",
        "selected_glove" => $selectedGlove,
        "selected_music" => $selectedMusic[0]["music_id"] ?? -1,
        "selected_agents" => array("t" => $selectedAgent[0]["agent_t"] ?? "", "ct" => $selectedAgent[0]["agent_ct"] ?? ""),
      ));
      break;
    
    case "set-music":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["music_id"]))     exit;
    
      if ($_POST["music_id"] == "-1") {
        $db->query("DELETE FROM `wp_player_music` WHERE steamid = :steamid", ["steamid" => $_SESSION["steamid"] ]);
      } else {
        $db->query("INSERT INTO `wp_player_music` (`steamid`, `music_id`) VALUES(:steamid, :music_id) ON DUPLICATE KEY UPDATE `music_id` = :music_id", ["steamid" => $_SESSION["steamid"], "music_id" => $_POST["music_id"]]);
      }
      break;

    case "set-knife":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["knife"]))        exit;
      $db->query("INSERT INTO `wp_player_knife` (`steamid`, `knife`) VALUES(:steamid, :knife) ON DUPLICATE KEY UPDATE `knife` = :knife", ["steamid" => $_SESSION["steamid"], "knife" => $_POST["knife"]]);
      break;

    case "set-agent":
      if (!isset($_SESSION["steamid"]))   exit;
      if (!isset($_POST["team"]))         exit;
      if (!isset($_POST["model"]))        exit;

      if ($_POST["model"] == "null")      $_POST["model"] = null;

      if ($_POST["team"] == 2) {
        $db->query("INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`) VALUES(:steamid, NULL, :model) ON DUPLICATE KEY UPDATE `agent_t` = :model", ["steamid" => $_SESSION["steamid"], "model" => $_POST["model"]]);
      } else if ($_POST["team"] == 3) {
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
        $db->query("INSERT INTO `wp_player_gloves` (`steamid`, `weapon_defindex`) VALUES(:steamid, :defIndex) ON DUPLICATE KEY UPDATE `weapon_defindex` = :defIndex", ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"]]);
        $rows = $db->query("UPDATE `wp_player_skins`
                            SET `weapon_paint_id` = :paint WHERE steamid = :steamid AND weapon_defindex = :defIndex",
                            ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"], "paint" => $_POST["paint"]]
        );
        if ($rows == 0) {
          $db->query("INSERT INTO `wp_player_skins` (`steamid`, `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed`) 
                    VALUES (:steamid, :defIndex, :paint, 0, 0)",
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
      if ($_POST["paint"] == "0") {
        $db->query("DELETE FROM `wp_player_skins` WHERE 
                    `wp_player_skins`.steamid = :steamid AND `wp_player_skins`.weapon_defindex = :defIndex",
                    ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"]]);
      } else {
        $rows = $db->query("UPDATE `wp_player_skins`
                              SET `weapon_paint_id` = :paint, `weapon_wear` = :wear, `weapon_seed` = :seed 
                              WHERE steamid = :steamid AND weapon_defindex = :defIndex",
                              ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"], "paint" => $_POST["paint"], "wear" => $_POST["wear"], "seed" => $_POST["seed"]]
        );
        if ($rows == 0) {
          $db->query("INSERT INTO `wp_player_skins` (`steamid`, `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed`) 
                    VALUES (:steamid, :defIndex, :paint, :wear, :seed)",
                    ["steamid" => $_SESSION["steamid"], "defIndex" => $_POST["defIndex"], "paint" => $_POST["paint"], "wear" => $_POST["wear"], "seed" => $_POST["seed"]]
                  );
        }
      }
      break;
  }
?>