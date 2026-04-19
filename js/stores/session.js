import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { TEAM_T, TEAM_CT, TEAM_DEFAULT } from "../const/teams.js";
import api from "../utils/api.js";

export const useSessionStore = defineStore("session", () => {
  const loaded = ref(false)

  const user = ref({
    steamid: "",
    steam_avatar: "",
    steam_personaname: "",
  });

  const loggedIn = computed(() => user.value.steamid.length !== 0);

  const loadout = ref({
    selected_skins: {},
    selected_knife: {
      [TEAM_T]: "weapon_knife",
      [TEAM_CT]: "weapon_knife",
    },
    selected_music: {
      [TEAM_T]: 0,
      [TEAM_CT]: 0,
    },
    selected_pin: {
      [TEAM_T]: 0,
      [TEAM_CT]: 0,
    },
    selected_glove: {
      [TEAM_T]: 0,
      [TEAM_CT]: 0,
    },
    selected_agents: {
      [TEAM_T]: "",
      [TEAM_CT]: "",
    },
  });

  const checkUser = async () => {
    try {
      const { data } = await api.get("./api/?action=check");
      user.value.steamid = data.steamid;
      user.value.steam_avatar = data.steam_avatar;
      user.value.steam_personaname = data.steam_personaname;
      for (const defIndex in data.selected_skins) {
        const skin = data.selected_skins[defIndex];
        loadout.value.selected_skins[defIndex] = {};
        loadout.value.selected_skins[defIndex][TEAM_T] =
          skin[TEAM_T] || skin[0];
        loadout.value.selected_skins[defIndex][TEAM_CT] =
          skin[TEAM_CT] || skin[0];
      }
      loadout.value.selected_knife[TEAM_T] =
        data.selected_knife[TEAM_T] ||
        data.selected_knife[TEAM_DEFAULT] ||
        "weapon_knife";
      loadout.value.selected_knife[TEAM_CT] =
        data.selected_knife[TEAM_CT] ||
        data.selected_knife[TEAM_DEFAULT] ||
        "weapon_knife";
      loadout.value.selected_music[TEAM_T] =
        data.selected_music[TEAM_T] || data.selected_music[TEAM_DEFAULT] || 0;
      loadout.value.selected_music[TEAM_CT] =
        data.selected_music[TEAM_CT] || data.selected_music[TEAM_DEFAULT] || 0;
      loadout.value.selected_glove[TEAM_T] =
        data.selected_glove[TEAM_T] || data.selected_glove[TEAM_DEFAULT] || 0;
      loadout.value.selected_glove[TEAM_CT] =
        data.selected_glove[TEAM_CT] || data.selected_glove[TEAM_DEFAULT] || 0;
      loadout.value.selected_agents[TEAM_T] = data.selected_agents[TEAM_T];
      loadout.value.selected_agents[TEAM_CT] = data.selected_agents[TEAM_CT];
      loadout.value.selected_pin[TEAM_T] =
        data.selected_pin[TEAM_T] || data.selected_pin[TEAM_DEFAULT] || 0;
      loadout.value.selected_pin[TEAM_CT] =
        data.selected_pin[TEAM_CT] || data.selected_pin[TEAM_DEFAULT] || 0;
    } catch (error) {
      console.log(error);
    } finally {
      loaded.value = true
    }
  };

  const setKnife = async (knife, team) => {
    try {
      await api.post("./api/?action=set-knife", { knife, team });
      loadout.value.selected_knife[team] = knife;
    } catch (error) {
      console.log(error);
    }
  };

  const setGlove = async (defIndex, paint, team) => {
    try {
      await api.post("./api/?action=set-glove", { defIndex, paint, team });
      loadout.value.selected_glove[team] = defIndex;
      if (!loadout.value.selected_skins[defIndex]) {
        loadout.value.selected_skins[defIndex] = {};
      }
      if (!loadout.value.selected_skins[defIndex][team]) {
        loadout.value.selected_skins[defIndex][team] = {};
      }
      loadout.value.selected_skins[defIndex][team].weapon_paint_id = paint;
    } catch (error) {
      console.log(error);
    }
  };

  const setMusic = async (music_id, team) => {
    try {
      await api.post("./api/?action=set-music", { music_id, team });
      loadout.value.selected_music[team] = music_id;
    } catch (error) {
      console.log(error);
    }
  };

  const setPin = async (pin_id, team) => {
    try {
      await api.post("./api/?action=set-pin", { pin_id, team });
      loadout.value.selected_pin[team] = pin_id;
    } catch (error) {
      console.log(error);
    }
  };

  const setAgent = async (model, team) => {
    try {
      await api.post("./api/?action=set-agent", { model, team });
      const newValue = model === null ? "" : model;
      loadout.value.selected_agents[team] = newValue;
    } catch (error) {
      console.log(error);
    }
  };

  const setSkin = async (modalSkin) => {
    try {
      await api.post('./api/?action=set-skin', {
        [TEAM_T]: {
          defIndex: modalSkin.weapon_defindex,
          paint: modalSkin.form[TEAM_T].paint,
          wear: modalSkin.form[TEAM_T].wear,
          seed: modalSkin.form[TEAM_T].seed,
          nametag: modalSkin.form[TEAM_T].name,
          stattrack: modalSkin.form[TEAM_T].stattrack,
          // id;schema;x;y;wear;scale;rotation
          sticker0: `${modalSkin.form[TEAM_T].stickers0.id};0;${modalSkin.form[TEAM_T].stickers0.x};${modalSkin.form[TEAM_T].stickers0.y};${modalSkin.form[TEAM_T].stickers0.wear};${modalSkin.form[TEAM_T].stickers0.scale};${modalSkin.form[TEAM_T].stickers0.rotate}`,
          sticker1: `${modalSkin.form[TEAM_T].stickers1.id};0;${modalSkin.form[TEAM_T].stickers1.x};${modalSkin.form[TEAM_T].stickers1.y};${modalSkin.form[TEAM_T].stickers1.wear};${modalSkin.form[TEAM_T].stickers1.scale};${modalSkin.form[TEAM_T].stickers1.rotate}`,
          sticker2: `${modalSkin.form[TEAM_T].stickers2.id};0;${modalSkin.form[TEAM_T].stickers2.x};${modalSkin.form[TEAM_T].stickers2.y};${modalSkin.form[TEAM_T].stickers2.wear};${modalSkin.form[TEAM_T].stickers2.scale};${modalSkin.form[TEAM_T].stickers2.rotate}`,
          sticker3: `${modalSkin.form[TEAM_T].stickers3.id};0;${modalSkin.form[TEAM_T].stickers3.x};${modalSkin.form[TEAM_T].stickers3.y};${modalSkin.form[TEAM_T].stickers3.wear};${modalSkin.form[TEAM_T].stickers3.scale};${modalSkin.form[TEAM_T].stickers3.rotate}`,
          sticker4: `${modalSkin.form[TEAM_T].stickers4.id};0;${modalSkin.form[TEAM_T].stickers4.x};${modalSkin.form[TEAM_T].stickers4.y};${modalSkin.form[TEAM_T].stickers4.wear};${modalSkin.form[TEAM_T].stickers4.scale};${modalSkin.form[TEAM_T].stickers4.rotate}`,
          // id;x;y;z;seed
          keychain: `${modalSkin.form[TEAM_T].keychain.id};${modalSkin.form[TEAM_T].keychain.x};${modalSkin.form[TEAM_T].keychain.y};${modalSkin.form[TEAM_T].keychain.z};${modalSkin.form[TEAM_T].keychain.seed}`,
        },
        [TEAM_CT]: {
          defIndex: modalSkin.weapon_defindex,
          paint: modalSkin.form[TEAM_CT].paint,
          wear: modalSkin.form[TEAM_CT].wear,
          seed: modalSkin.form[TEAM_CT].seed,
          nametag: modalSkin.form[TEAM_CT].name,
          stattrack: modalSkin.form[TEAM_CT].stattrack,
          // id;schema;x;y;wear;scale;rotation
          sticker0: `${modalSkin.form[TEAM_CT].stickers0.id};0;${modalSkin.form[TEAM_CT].stickers0.x};${modalSkin.form[TEAM_CT].stickers0.y};${modalSkin.form[TEAM_CT].stickers0.wear};${modalSkin.form[TEAM_CT].stickers0.scale};${modalSkin.form[TEAM_CT].stickers0.rotate}`,
          sticker1: `${modalSkin.form[TEAM_CT].stickers1.id};0;${modalSkin.form[TEAM_CT].stickers1.x};${modalSkin.form[TEAM_CT].stickers1.y};${modalSkin.form[TEAM_CT].stickers1.wear};${modalSkin.form[TEAM_CT].stickers1.scale};${modalSkin.form[TEAM_CT].stickers1.rotate}`,
          sticker2: `${modalSkin.form[TEAM_CT].stickers2.id};0;${modalSkin.form[TEAM_CT].stickers2.x};${modalSkin.form[TEAM_CT].stickers2.y};${modalSkin.form[TEAM_CT].stickers2.wear};${modalSkin.form[TEAM_CT].stickers2.scale};${modalSkin.form[TEAM_CT].stickers2.rotate}`,
          sticker3: `${modalSkin.form[TEAM_CT].stickers3.id};0;${modalSkin.form[TEAM_CT].stickers3.x};${modalSkin.form[TEAM_CT].stickers3.y};${modalSkin.form[TEAM_CT].stickers3.wear};${modalSkin.form[TEAM_CT].stickers3.scale};${modalSkin.form[TEAM_CT].stickers3.rotate}`,
          sticker4: `${modalSkin.form[TEAM_CT].stickers4.id};0;${modalSkin.form[TEAM_CT].stickers4.x};${modalSkin.form[TEAM_CT].stickers4.y};${modalSkin.form[TEAM_CT].stickers4.wear};${modalSkin.form[TEAM_CT].stickers4.scale};${modalSkin.form[TEAM_CT].stickers4.rotate}`,
          // id;x;y;z;seed
          keychain: `${modalSkin.form[TEAM_CT].keychain.id};${modalSkin.form[TEAM_CT].keychain.x};${modalSkin.form[TEAM_CT].keychain.y};${modalSkin.form[TEAM_CT].keychain.z};${modalSkin.form[TEAM_CT].keychain.seed}`,
        }
      })
      loadout.value.selected_skins[modalSkin.weapon_defindex] = {
        [TEAM_T]: {
          weapon_paint_id: modalSkin.form[TEAM_T].paint,
          weapon_seed: modalSkin.form[TEAM_T].seed,
          weapon_wear: modalSkin.form[TEAM_T].wear,
          weapon_nametag: modalSkin.form[TEAM_T].name,
          weapon_stattrak: modalSkin.form[TEAM_T].stattrack,
          // id;schema;x;y;wear;scale;rotation
          weapon_sticker_0: `${modalSkin.form[TEAM_T].stickers0.id};0;${modalSkin.form[TEAM_T].stickers0.x};${modalSkin.form[TEAM_T].stickers0.y};${modalSkin.form[TEAM_T].stickers0.wear};${modalSkin.form[TEAM_T].stickers0.scale};${modalSkin.form[TEAM_T].stickers0.rotate}`,
          weapon_sticker_1: `${modalSkin.form[TEAM_T].stickers1.id};0;${modalSkin.form[TEAM_T].stickers1.x};${modalSkin.form[TEAM_T].stickers1.y};${modalSkin.form[TEAM_T].stickers1.wear};${modalSkin.form[TEAM_T].stickers1.scale};${modalSkin.form[TEAM_T].stickers1.rotate}`,
          weapon_sticker_2: `${modalSkin.form[TEAM_T].stickers2.id};0;${modalSkin.form[TEAM_T].stickers2.x};${modalSkin.form[TEAM_T].stickers2.y};${modalSkin.form[TEAM_T].stickers2.wear};${modalSkin.form[TEAM_T].stickers2.scale};${modalSkin.form[TEAM_T].stickers2.rotate}`,
          weapon_sticker_3: `${modalSkin.form[TEAM_T].stickers3.id};0;${modalSkin.form[TEAM_T].stickers3.x};${modalSkin.form[TEAM_T].stickers3.y};${modalSkin.form[TEAM_T].stickers3.wear};${modalSkin.form[TEAM_T].stickers3.scale};${modalSkin.form[TEAM_T].stickers3.rotate}`,
          weapon_sticker_4: `${modalSkin.form[TEAM_T].stickers4.id};0;${modalSkin.form[TEAM_T].stickers4.x};${modalSkin.form[TEAM_T].stickers4.y};${modalSkin.form[TEAM_T].stickers4.wear};${modalSkin.form[TEAM_T].stickers4.scale};${modalSkin.form[TEAM_T].stickers4.rotate}`,
          // id;x;y;z;seed
          weapon_keychain: `${modalSkin.form[TEAM_T].keychain.id};${modalSkin.form[TEAM_T].keychain.x};${modalSkin.form[TEAM_T].keychain.y};${modalSkin.form[TEAM_T].keychain.z};${modalSkin.form[TEAM_T].keychain.seed}`,
        },
        [TEAM_CT]: {
          weapon_paint_id: modalSkin.form[TEAM_CT].paint,
          weapon_seed: modalSkin.form[TEAM_CT].seed,
          weapon_wear: modalSkin.form[TEAM_CT].wear,
          weapon_nametag: modalSkin.form[TEAM_CT].name,
          weapon_stattrak: modalSkin.form[TEAM_CT].stattrack,
          // id;schema;x;y;wear;scale;rotation
          weapon_sticker_0: `${modalSkin.form[TEAM_CT].stickers0.id};0;${modalSkin.form[TEAM_CT].stickers0.x};${modalSkin.form[TEAM_CT].stickers0.y};${modalSkin.form[TEAM_CT].stickers0.wear};${modalSkin.form[TEAM_CT].stickers0.scale};${modalSkin.form[TEAM_CT].stickers0.rotate}`,
          weapon_sticker_1: `${modalSkin.form[TEAM_CT].stickers1.id};0;${modalSkin.form[TEAM_CT].stickers1.x};${modalSkin.form[TEAM_CT].stickers1.y};${modalSkin.form[TEAM_CT].stickers1.wear};${modalSkin.form[TEAM_CT].stickers1.scale};${modalSkin.form[TEAM_CT].stickers1.rotate}`,
          weapon_sticker_2: `${modalSkin.form[TEAM_CT].stickers2.id};0;${modalSkin.form[TEAM_CT].stickers2.x};${modalSkin.form[TEAM_CT].stickers2.y};${modalSkin.form[TEAM_CT].stickers2.wear};${modalSkin.form[TEAM_CT].stickers2.scale};${modalSkin.form[TEAM_CT].stickers2.rotate}`,
          weapon_sticker_3: `${modalSkin.form[TEAM_CT].stickers3.id};0;${modalSkin.form[TEAM_CT].stickers3.x};${modalSkin.form[TEAM_CT].stickers3.y};${modalSkin.form[TEAM_CT].stickers3.wear};${modalSkin.form[TEAM_CT].stickers3.scale};${modalSkin.form[TEAM_CT].stickers3.rotate}`,
          weapon_sticker_4: `${modalSkin.form[TEAM_CT].stickers4.id};0;${modalSkin.form[TEAM_CT].stickers4.x};${modalSkin.form[TEAM_CT].stickers4.y};${modalSkin.form[TEAM_CT].stickers4.wear};${modalSkin.form[TEAM_CT].stickers4.scale};${modalSkin.form[TEAM_CT].stickers4.rotate}`,
          // id;x;y;z;seed
          weapon_keychain: `${modalSkin.form[TEAM_CT].keychain.id};${modalSkin.form[TEAM_CT].keychain.x};${modalSkin.form[TEAM_CT].keychain.y};${modalSkin.form[TEAM_CT].keychain.z};${modalSkin.form[TEAM_CT].keychain.seed}`,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    loaded,
    user,
    loggedIn,
    loadout,
    checkUser,
    setKnife,
    setGlove,
    setMusic,
    setPin,
    setAgent,
    setSkin
  };
});
