import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "../stores/session.js";
import { TEAM_CT, TEAM_T, TEAM_NAME } from "../const/teams.js";
import { useSkinsStore } from "../stores/skins.js";
import { useStickersStore } from "../stores/stickers.js";
import { useKeychainsStore } from "../stores/keychains.js";
import { KNIVES, WEAPONS } from '../const/weapons.js'

export default {
  setup() {
    const session = useSessionStore();
    const skins = useSkinsStore();
    const stickers = useStickersStore();
    const keychains = useKeychainsStore();

    const knives = KNIVES;
    const weapons = WEAPONS.concat(KNIVES);

    const weaponSearchInput = ref("");

    const tabSkinsTeam = ref(TEAM_T);

    const weaponsFiltered = computed(() => {
      return weapons.filter((weapon) =>
        weapon.name
          .toUpperCase()
          .includes(weaponSearchInput.value.toUpperCase()),
      );
    });

    const setSticker = () => {
      modalSkin.value.form[tabSkinsTeam.value][
        "stickers" + modalSticker.value.slot
      ].id = modalSticker.value.form.id;
      if (modalSticker.value.form.id != 0) {
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].wear = modalSticker.value.form.wear;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].image = modalSticker.value.sticker.image;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].x = modalSticker.value.form.x;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].y = modalSticker.value.form.y;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].scale = modalSticker.value.form.scale;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].rotate = modalSticker.value.form.rotate;
      } else {
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].wear = 0;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].image = "";
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].x = 0;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].y = 0;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].scale = 1;
        modalSkin.value.form[tabSkinsTeam.value][
          "stickers" + modalSticker.value.slot
        ].rotate = 0;
      }
      closeModalSticker();
    };

    const setKeychain = () => {
      modalSkin.value.form[tabSkinsTeam.value].keychain.id =
        modalKeychain.value.form.id;
      if (modalKeychain.value.form.id != 0) {
        modalSkin.value.form[tabSkinsTeam.value].keychain.seed =
          modalKeychain.value.form.seed;
        modalSkin.value.form[tabSkinsTeam.value].keychain.image =
          modalKeychain.value.keychain.image;
        modalSkin.value.form[tabSkinsTeam.value].keychain.x =
          modalKeychain.value.form.x;
        modalSkin.value.form[tabSkinsTeam.value].keychain.y =
          modalKeychain.value.form.y;
        modalSkin.value.form[tabSkinsTeam.value].keychain.z =
          modalKeychain.value.form.z;
      } else {
        modalSkin.value.form[tabSkinsTeam.value].keychain.seed = 0;
        modalSkin.value.form[tabSkinsTeam.value].keychain.image = "";
        modalSkin.value.form[tabSkinsTeam.value].keychain.x = 0;
        modalSkin.value.form[tabSkinsTeam.value].keychain.y = 0;
        modalSkin.value.form[tabSkinsTeam.value].keychain.z = 0;
      }
      closeModalKeychain();
    };

    const validateWear = (type) => {
      if (type == "skin") {
        const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].wear);
        console.log(value);
        if (
          isNaN(value) ||
          value <= 0.001 ||
          value > 1 ||
          modalSkin.value.form[tabSkinsTeam.value].paint == "0"
        )
          modalSkin.value.form[tabSkinsTeam.value].wear = 0.001;
      } else if (type == "sticker") {
        const value = parseFloat(modalSticker.value.form.wear);
        if (
          isNaN(value) ||
          value <= 0.001 ||
          value > 1 ||
          modalSticker.value.form.paint == "0"
        )
          modalSticker.value.form.wear = 0.001;
      }
    };

    const validateSeed = (type) => {
      if (type == "skin") {
        const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].seed);
        if (
          isNaN(value) | (value > 1000) ||
          value < 0 ||
          modalSkin.value.form[tabSkinsTeam.value].paint == "0"
        )
          modalSkin.value.form[tabSkinsTeam.value].seed = 0;
        else modalSkin.value.form[tabSkinsTeam.value].seed = Math.round(value);
      } else if (type == "keychain") {
        const value = parseFloat(modalKeychain.value.form.seed);
        if (
          isNaN(value) | (value > 1000) ||
          value < 0 ||
          modalKeychain.value.form.paint == "0"
        )
          modalKeychain.value.form.seed = 0;
        else modalKeychain.value.form.seed = Math.round(value);
      }
    };

    const modalSkin = ref({
      open: false,
      weapon_defindex: "",
      weapon_name: "",
      isKnife: false,
      skin: {
        [TEAM_T]: {
          name: "",
          image: "",
          color: "",
        },
        [TEAM_CT]: {
          name: "",
          image: "",
          color: "",
        },
      },
      search: {
        page: 1,
        pages: 1,
        input: "",
        all: false,
        itemsPerPage: 24,
        results: [],
      },
      form: {
        [TEAM_T]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: "",
          stattrack: 0,
          stickers0: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers1: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers2: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers3: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers4: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          keychain: {
            id: 0,
            seed: 0,
            image: "",
            x: 0,
            y: 0,
            z: 0,
          },
        },
        [TEAM_CT]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: "",
          stattrack: 0,
          stickers0: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers1: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers2: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers3: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          stickers4: {
            id: 0,
            wear: 0.001,
            image: "",
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          },
          keychain: {
            id: 0,
            seed: 0,
            image: "",
            x: 0,
            y: 0,
            z: 0,
          },
        },
      },
    });

    const openModalSkin = async (i) => {
      const defIndex = weaponsFiltered.value[i].weapon_defindex;
      modalSkin.value.weapon_defindex =
        weaponsFiltered.value[i].weapon_defindex;
      modalSkin.value.weapon_name = weaponsFiltered.value[i].name;

      modalSkin.value.isKnife =
        weaponsFiltered.value[i].name.includes("Knife") ||
        weaponsFiltered.value[i].name.includes("Bayonet") ||
        weaponsFiltered.value[i].name.includes("Karambit");

      // Form values: T
      modalSkin.value.form[TEAM_T].paint = parseInt(
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_paint_id ||
          "0",
      );
      modalSkin.value.form[TEAM_T].wear =
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_wear || 0.001;
      modalSkin.value.form[TEAM_T].seed =
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_seed || 0;
      modalSkin.value.form[TEAM_T].stattrack =
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_stattrak || 0;
      modalSkin.value.form[TEAM_T].name =
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_nametag || "";

      // id;schema;x;y;wear;scale;rotation
      const stickerT0 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_0 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerT1 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_1 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerT2 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_2 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerT3 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_3 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerT4 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_4 ||
        "0;0;0;0;0;0;0"
      ).split(";");

      modalSkin.value.form[TEAM_T].stickers0.id = stickerT0[0];
      modalSkin.value.form[TEAM_T].stickers0.image =
        stickerT0[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerT0[0])?.image;
      modalSkin.value.form[TEAM_T].stickers0.x = stickerT0[2] || 0;
      modalSkin.value.form[TEAM_T].stickers0.y = stickerT0[3] || 0;
      modalSkin.value.form[TEAM_T].stickers0.wear = stickerT0[4] || 0.001;
      modalSkin.value.form[TEAM_T].stickers0.scale = stickerT0[5] || 1;
      modalSkin.value.form[TEAM_T].stickers0.rotate = stickerT0[6] || 0;

      modalSkin.value.form[TEAM_T].stickers1.id = stickerT1[0];
      modalSkin.value.form[TEAM_T].stickers1.image =
        stickerT1[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerT1[0])?.image;
      modalSkin.value.form[TEAM_T].stickers1.x = stickerT1[2] || 0;
      modalSkin.value.form[TEAM_T].stickers1.y = stickerT1[3] || 0;
      modalSkin.value.form[TEAM_T].stickers1.wear = stickerT1[4] || 0.001;
      modalSkin.value.form[TEAM_T].stickers1.scale = stickerT1[5] || 1;
      modalSkin.value.form[TEAM_T].stickers1.rotate = stickerT1[6] || 0;

      modalSkin.value.form[TEAM_T].stickers2.id = stickerT2[0];
      modalSkin.value.form[TEAM_T].stickers2.image =
        stickerT2[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerT2[0])?.image;
      modalSkin.value.form[TEAM_T].stickers2.x = stickerT2[2] || 0;
      modalSkin.value.form[TEAM_T].stickers2.y = stickerT2[3] || 0;
      modalSkin.value.form[TEAM_T].stickers2.wear = stickerT2[4] || 0.001;
      modalSkin.value.form[TEAM_T].stickers2.scale = stickerT2[5] || 1;
      modalSkin.value.form[TEAM_T].stickers2.rotate = stickerT2[6] || 0;

      modalSkin.value.form[TEAM_T].stickers3.id = stickerT3[0];
      modalSkin.value.form[TEAM_T].stickers3.image =
        stickerT3[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerT3[0])?.image;
      modalSkin.value.form[TEAM_T].stickers3.x = stickerT3[2] || 0;
      modalSkin.value.form[TEAM_T].stickers3.y = stickerT3[3] || 0;
      modalSkin.value.form[TEAM_T].stickers3.wear = stickerT3[4] || 0.001;
      modalSkin.value.form[TEAM_T].stickers3.scale = stickerT3[5] || 1;
      modalSkin.value.form[TEAM_T].stickers3.rotate = stickerT3[6] || 0;

      modalSkin.value.form[TEAM_T].stickers4.id = stickerT4[0];
      modalSkin.value.form[TEAM_T].stickers4.image =
        stickerT4[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerT4[0])?.image;
      modalSkin.value.form[TEAM_T].stickers4.x = stickerT4[2] || 0;
      modalSkin.value.form[TEAM_T].stickers4.y = stickerT4[3] || 0;
      modalSkin.value.form[TEAM_T].stickers4.wear = stickerT4[4] || 0.001;
      modalSkin.value.form[TEAM_T].stickers4.scale = stickerT4[5] || 1;
      modalSkin.value.form[TEAM_T].stickers4.rotate = stickerT4[6] || 0;

      // id;x;y;z;seed
      const keychainT = (
        session.user.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_keychain ||
        "0;0;0;0;0"
      ).split(";");
      modalSkin.value.form[TEAM_T].keychain.id = keychainT[0] || 0;
      modalSkin.value.form[TEAM_T].keychain.x = keychainT[1] || 0;
      modalSkin.value.form[TEAM_T].keychain.y = keychainT[2] || 0;
      modalSkin.value.form[TEAM_T].keychain.z = keychainT[3] || 0;
      modalSkin.value.form[TEAM_T].keychain.seed = keychainT[4] || 0;
      modalSkin.value.form[TEAM_T].keychain.image =
        keychainT[0] == "0"
          ? ""
          : keychains.keychains.find((k) => k.id == keychainT[0]).image;

      if (modalSkin.value.form[TEAM_T].paint != 0) {
        const result = skins.skins.find(
          (skin) => skin.paint_index == modalSkin.value.form[TEAM_T].paint,
        );
        modalSkin.value.skin[TEAM_T].image = result.image;
        modalSkin.value.skin[TEAM_T].name = result.name;
        modalSkin.value.skin[TEAM_T].color = result.rarity.color;
      } else {
        const weapon = weapons.find(
          (weapon) => weapon.weapon_defindex == modalSkin.value.weapon_defindex,
        );
        modalSkin.value.skin[TEAM_T].image = weapon.image;
        modalSkin.value.skin[TEAM_T].name = "Default";
        modalSkin.value.skin[TEAM_T].color = "#000";
      }

      // Form values: CT
      modalSkin.value.form[TEAM_CT].paint = parseInt(
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_paint_id ||
          "0",
      );
      modalSkin.value.form[TEAM_CT].wear =
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_wear ||
        0.001;
      modalSkin.value.form[TEAM_CT].seed =
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_seed || 0;
      modalSkin.value.form[TEAM_CT].stattrack =
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_stattrak ||
        0;
      modalSkin.value.form[TEAM_CT].name =
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_nametag ||
        "";

      // id;schema;x;y;wear;scale;rotation
      const stickerCT0 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_0 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerCT1 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_1 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerCT2 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_2 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerCT3 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_3 ||
        "0;0;0;0;0;0;0"
      ).split(";");
      const stickerCT4 = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_4 ||
        "0;0;0;0;0;0;0"
      ).split(";");

      modalSkin.value.form[TEAM_CT].stickers0.id = stickerCT0[0];
      modalSkin.value.form[TEAM_CT].stickers0.image =
        stickerCT0[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerCT0[0])
              ?.image;
      modalSkin.value.form[TEAM_CT].stickers0.x = stickerCT0[2] || 0;
      modalSkin.value.form[TEAM_CT].stickers0.y = stickerCT0[3] || 0;
      modalSkin.value.form[TEAM_CT].stickers0.wear = stickerCT0[4] || 0.001;
      modalSkin.value.form[TEAM_CT].stickers0.scale = stickerCT0[5] || 1;
      modalSkin.value.form[TEAM_CT].stickers0.rotate = stickerCT0[6] || 0;

      modalSkin.value.form[TEAM_CT].stickers1.id = stickerCT1[0];
      modalSkin.value.form[TEAM_CT].stickers1.image =
        stickerCT1[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerCT1[0])
              ?.image;
      modalSkin.value.form[TEAM_CT].stickers1.x = stickerCT1[2] || 0;
      modalSkin.value.form[TEAM_CT].stickers1.y = stickerCT1[3] || 0;
      modalSkin.value.form[TEAM_CT].stickers1.wear = stickerCT1[4] || 0.001;
      modalSkin.value.form[TEAM_CT].stickers1.scale = stickerCT1[5] || 1;
      modalSkin.value.form[TEAM_CT].stickers1.rotate = stickerCT1[6] || 0;

      modalSkin.value.form[TEAM_CT].stickers2.id = stickerCT2[0];
      modalSkin.value.form[TEAM_CT].stickers2.image =
        stickerCT2[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerCT2[0])
              ?.image;
      modalSkin.value.form[TEAM_CT].stickers2.x = stickerCT2[2] || 0;
      modalSkin.value.form[TEAM_CT].stickers2.y = stickerCT2[3] || 0;
      modalSkin.value.form[TEAM_CT].stickers2.wear = stickerCT2[4] || 0.001;
      modalSkin.value.form[TEAM_CT].stickers2.scale = stickerCT2[5] || 1;
      modalSkin.value.form[TEAM_CT].stickers2.rotate = stickerCT2[6] || 0;

      modalSkin.value.form[TEAM_CT].stickers3.id = stickerCT3[0];
      modalSkin.value.form[TEAM_CT].stickers3.image =
        stickerCT3[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerCT3[0])
              ?.image;
      modalSkin.value.form[TEAM_CT].stickers3.x = stickerCT3[2] || 0;
      modalSkin.value.form[TEAM_CT].stickers3.y = stickerCT3[3] || 0;
      modalSkin.value.form[TEAM_CT].stickers3.wear = stickerCT3[4] || 0.001;
      modalSkin.value.form[TEAM_CT].stickers3.scale = stickerCT3[5] || 1;
      modalSkin.value.form[TEAM_CT].stickers3.rotate = stickerCT3[6] || 0;

      modalSkin.value.form[TEAM_CT].stickers4.id = stickerCT4[0];
      modalSkin.value.form[TEAM_CT].stickers4.image =
        stickerCT4[0] == "0"
          ? ""
          : stickers.stickers.find((sticker) => sticker.id == stickerCT4[0])
              ?.image;
      modalSkin.value.form[TEAM_CT].stickers4.x = stickerCT4[2] || 0;
      modalSkin.value.form[TEAM_CT].stickers4.y = stickerCT4[3] || 0;
      modalSkin.value.form[TEAM_CT].stickers4.wear = stickerCT4[4] || 0.001;
      modalSkin.value.form[TEAM_CT].stickers4.scale = stickerCT4[5] || 1;
      modalSkin.value.form[TEAM_CT].stickers4.rotate = stickerCT4[6] || 0;

      // id;x;y;z;seed
      const keychainCT = (
        session.user.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_keychain ||
        "0;0;0;0;0"
      ).split(";");
      modalSkin.value.form[TEAM_CT].keychain.id = keychainCT[0] || 0;
      modalSkin.value.form[TEAM_CT].keychain.x = keychainCT[1] || 0;
      modalSkin.value.form[TEAM_CT].keychain.y = keychainCT[2] || 0;
      modalSkin.value.form[TEAM_CT].keychain.z = keychainCT[3] || 0;
      modalSkin.value.form[TEAM_CT].keychain.seed = keychainCT[4] || 0;
      modalSkin.value.form[TEAM_CT].keychain.image =
        keychainCT[0] == "0"
          ? ""
          : keychains.keychains.find((k) => k.id == keychainCT[0]).image;

      if (modalSkin.value.form[TEAM_CT].paint != 0) {
        const result = skins.skins.find(
          (skin) => skin.paint_index == modalSkin.value.form[TEAM_CT].paint,
        );
        modalSkin.value.skin[TEAM_CT].image = result.image;
        modalSkin.value.skin[TEAM_CT].name = result.name;
        modalSkin.value.skin[TEAM_CT].color = result.rarity.color;
      } else {
        const weapon = weapons.find(
          (weapon) => weapon.weapon_defindex == modalSkin.value.weapon_defindex,
        );
        modalSkin.value.skin[TEAM_CT].image = weapon.image;
        modalSkin.value.skin[TEAM_CT].name = "Default";
        modalSkin.value.skin[TEAM_CT].color = "#000";
      }

      // Search form
      modalSkin.value.search.page = 1;
      modalSkin.value.search.pages = 1;
      modalSkin.value.search.results = [];
      modalSkin.value.search.input = "";

      tabSkinsTeam.value = TEAM_T;

      modalSkin.value.open = true;

      onModalSkinSearch();
    };
    const closeModalSkin = () => {
      modalSkin.value.open = false;
    };
    const onModalSkinSearch = () => {
      modalSkin.value.search.page = 1;
      modalSkin.value.search.results = skins.skins.filter((skin) => {
        if (
          skin.weapon.weapon_id !== modalSkin.value.weapon_defindex &&
          !modalSkin.value.search.all
        )
          return false;
        else if (modalSkin.value.search.input === "") return true;
        else
          return skin.name
            .toUpperCase()
            .includes(modalSkin.value.search.input.toUpperCase());
      });
      const weapon = weapons.find(
        (weapon) => weapon.weapon_defindex == modalSkin.value.weapon_defindex,
      );
      modalSkin.value.search.results.unshift({
        id: "-1",
        name: "Default",
        weapon: {
          id: weapon.weapon_name,
          name: weapon.name,
        },
        rarity: {
          color: "#000",
        },
        paint_index: "0",
        image: weapon.image,
      });
      modalSkin.value.search.pages = Math.ceil(
        modalSkin.value.search.results.length /
          modalSkin.value.search.itemsPerPage,
      );
    };
    const modalSkinSearchResultItems = computed(() => {
      const start =
        (modalSkin.value.search.page - 1) * modalSkin.value.search.itemsPerPage;
      const end = start + modalSkin.value.search.itemsPerPage;
      return modalSkin.value.search.results.slice(start, end);
    });
    const onModalSkinSelect = (skin) => {
      modalSkin.value.form[tabSkinsTeam.value].paint = skin.paint_index;
      modalSkin.value.skin[tabSkinsTeam.value].image = skin.image;
      modalSkin.value.skin[tabSkinsTeam.value].name = skin.name;
      modalSkin.value.skin[tabSkinsTeam.value].color = skin.rarity.color;
    };

    // Sticker
    const modalSticker = ref({
      open: false,
      slot: 0,
      search: {
        page: 1,
        pages: 1,
        input: "",
        itemsPerPage: 24,
        results: [],
      },
      form: {
        wear: 0.001,
        id: 0,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      },
      sticker: {
        image: "",
        name: "",
        color: "#000",
      },
    });
    const openModalSticker = (slot) => {
      modalSticker.value.slot = slot;
      modalSticker.value.search.page = 1;
      modalSticker.value.search.pages = 1;
      modalSticker.value.search.input = "";
      modalSticker.value.search.results = [];
      modalSticker.value.open = true;
      modalSticker.value.form.id =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].id;
      modalSticker.value.form.wear =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].wear;
      modalSticker.value.form.x =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].x;
      modalSticker.value.form.y =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].y;
      modalSticker.value.form.scale =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].scale;
      modalSticker.value.form.rotate =
        modalSkin.value.form[tabSkinsTeam.value]["stickers" + slot].rotate;
      if (modalSticker.value.form.id != 0) {
        const result = stickers.stickers.find(
          (sticker) => sticker.id == modalSticker.value.form.id,
        );
        modalSticker.value.sticker.image = result.image;
        modalSticker.value.sticker.name = result.name;
        modalSticker.value.sticker.color = result.rarity.color;
      } else {
        modalSticker.value.sticker.image =
          "https://placehold.co/256x198?text=No%20Sticker";
        modalSticker.value.sticker.name = "No Sticker";
        modalSticker.value.sticker.color = "#000";
      }

      onModalStickerSearch();
    };
    const closeModalSticker = () => {
      modalSticker.value.open = false;
    };
    const onModalStickerSearch = () => {
      modalSticker.value.search.page = 1;
      modalSticker.value.search.results = stickers.stickers.filter((sticker) =>
        modalSticker.value.search.input === ""
          ? true
          : sticker.name
              .toUpperCase()
              .includes(modalSticker.value.search.input.toUpperCase()),
      );
      modalSticker.value.search.results.unshift({
        id: "0",
        name: "No Sticker",
        image: "https://placehold.co/256x198?text=No%20Sticker",
        rarity: {
          color: "#000",
        },
      });
      modalSticker.value.search.pages = Math.ceil(
        modalSticker.value.search.results.length /
          modalSticker.value.search.itemsPerPage,
      );
    };
    const modalStickerSearchResultItems = computed(() => {
      const start =
        (modalSticker.value.search.page - 1) *
        modalSticker.value.search.itemsPerPage;
      const end = start + modalSticker.value.search.itemsPerPage;
      return modalSticker.value.search.results.slice(start, end);
    });
    const onModalStickerSelect = (sticker) => {
      modalSticker.value.form.id = sticker.id;
      modalSticker.value.sticker.image = sticker.image;
      modalSticker.value.sticker.name = sticker.name;
      modalSticker.value.sticker.color = sticker.rarity.color;
    };

    // Keychain
    const modalKeychain = ref({
      open: false,
      slot: 0,
      search: {
        page: 1,
        pages: 1,
        input: "",
        itemsPerPage: 24,
        results: [],
      },
      form: {
        seed: 0.001,
        id: 0,
        x: 0,
        y: 0,
        z: 0,
      },
      keychain: {
        image: "",
        name: "",
        color: "#000",
      },
    });
    const openModalKeychain = () => {
      modalKeychain.value.search.page = 1;
      modalKeychain.value.search.pages = 1;
      modalKeychain.value.search.input = "";
      modalKeychain.value.search.results = [];
      modalKeychain.value.open = true;
      modalKeychain.value.form.id =
        modalSkin.value.form[tabSkinsTeam.value].keychain.id;
      modalKeychain.value.form.seed =
        modalSkin.value.form[tabSkinsTeam.value].keychain.seed;
      modalKeychain.value.form.x =
        modalSkin.value.form[tabSkinsTeam.value].keychain.x;
      modalKeychain.value.form.y =
        modalSkin.value.form[tabSkinsTeam.value].keychain.y;
      modalKeychain.value.form.z =
        modalSkin.value.form[tabSkinsTeam.value].keychain.z;
      if (modalKeychain.value.form.id != 0) {
        const result = keychains.keychains.find(
          (keychain) => keychain.id == modalKeychain.value.form.id,
        );
        modalKeychain.value.keychain.image = result.image;
        modalKeychain.value.keychain.name = result.name;
        modalKeychain.value.keychain.color = result.rarity.color;
      } else {
        modalKeychain.value.keychain.image =
          "https://placehold.co/256x198?text=No%20Keychain";
        modalKeychain.value.keychain.name = "No Keychain";
        modalKeychain.value.keychain.color = "#000";
      }

      onModalKeychainSearch();
    };
    const closeModalKeychain = () => {
      modalKeychain.value.open = false;
    };
    const onModalKeychainSearch = () => {
      modalKeychain.value.search.page = 1;
      modalKeychain.value.search.results = keychains.keychains.filter((keychain) =>
        modalKeychain.value.search.input === ""
          ? true
          : keychain.name
              .toUpperCase()
              .includes(modalKeychain.value.search.input.toUpperCase()),
      );
      modalKeychain.value.search.results.unshift({
        id: "0",
        name: "No Keychain",
        image: "https://placehold.co/256x198?text=No%20Keychain",
        rarity: {
          color: "#000",
        },
      });
      modalKeychain.value.search.pages = Math.ceil(
        modalKeychain.value.search.results.length /
          modalKeychain.value.search.itemsPerPage,
      );
    };
    const modalKeychainSearchResultItems = computed(() => {
      const start =
        (modalKeychain.value.search.page - 1) *
        modalKeychain.value.search.itemsPerPage;
      const end = start + modalKeychain.value.search.itemsPerPage;
      return modalKeychain.value.search.results.slice(start, end);
    });
    const onModalKeychainSelect = (keychain) => {
      modalKeychain.value.form.id = keychain.id;
      modalKeychain.value.keychain.image = keychain.image;
      modalKeychain.value.keychain.name = keychain.name;
      modalKeychain.value.keychain.color = keychain.rarity.color;
    };

    onMounted(async () => {
      await skins.fetchData();
      await stickers.fetchData();
      await keychains.fetchData();
    });

    return {
      TEAM_T,
      TEAM_CT,
      knives,
      weapons,
      session,
      skins,
      stickers,
      keychains,
      weaponSearchInput,
      weaponsFiltered,
      setSticker,
      setKeychain,
      validateWear,
      validateSeed,
      modalSkin,
      openModalSkin,
      closeModalSkin,
      onModalSkinSearch,
      modalSkinSearchResultItems,
      onModalSkinSelect,
      modalSticker,
      openModalSticker,
      closeModalSticker,
      onModalStickerSearch,
      modalStickerSearchResultItems,
      onModalStickerSelect,
      modalKeychain,
      openModalKeychain,
      closeModalKeychain,
      onModalKeychainSearch,
      modalKeychainSearchResultItems,
      onModalKeychainSelect,
      tabSkinsTeam
    };
  },
  /*html*/
  template: `
    <v-container>
      <v-text-field label="Search" v-model="weaponSearchInput"></v-text-field>
      <!-- Weapons -->
      <v-row>
        <v-col cols="6" md="3" lg="2" v-for="(weapon, i) in weaponsFiltered" :key="weapon.weapon_name">
          <v-card @click="openModalSkin(i)">
            <v-img :src="weapon.image"></v-img>
            <v-card-title>{{ weapon.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <!-- Skin Dialog -->
      <v-dialog fullscreen v-model="modalSkin.open" persistent>
        <v-card>
          <v-toolbar color="secondary">
            <v-toolbar-title>{{ modalSkin.weapon_name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="closeModalSkin"></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-tabs v-model="tabSkinsTeam" fixed-tabs class="mb-5" :color="tabSkinsTeam == TEAM_T ? 'orange' : 'light-blue'">
              <v-tab :value="TEAM_T">
                T
              </v-tab>
              <v-tab :value="TEAM_CT">
                CT
              </v-tab>
            </v-tabs>
            <v-row>
              <v-col cols="12" md="6" align-self="center">
                <v-img :src="modalSkin.skin[tabSkinsTeam].image" height="150"></v-img>
                <p class="text-center">{{ modalSkin.skin[tabSkinsTeam].name }}</p>
                <v-row class="my-1" v-if="!modalSkin.isKnife">
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalSticker(0)">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].stickers0.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers0.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalSticker(1)">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].stickers1.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers1.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalSticker(2)">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].stickers2.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers2.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalSticker(3)">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].stickers3.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers3.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalSticker(4)">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].stickers4.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers4.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="text-center" variant="text" @click="openModalKeychain">
                      <v-img v-if="modalSkin.form[tabSkinsTeam].keychain.image.length > 0" :src="modalSkin.form[tabSkinsTeam].keychain.image" height="50"></v-img>
                      <v-icon v-else size="50" icon="mdi-key-chain" color="grey-darken-3"></v-icon>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" align-self="center">
                <v-text-field label="Wear" v-model="modalSkin.form[tabSkinsTeam].wear" @change="validateWear('skin')" hint="0.001 ~ 1.0"></v-text-field>
                <v-text-field label="Seed" v-model="modalSkin.form[tabSkinsTeam].seed" @change="validateSeed('skin')" hint="0 ~ 1000"></v-text-field>
                <v-text-field label="Name Tag" v-model="modalSkin.form[tabSkinsTeam].name"></v-text-field>
                <v-checkbox label="StatTrack" :true-value="1" :false-value="0" v-model="modalSkin.form[tabSkinsTeam].stattrack" hide-details></v-checkbox>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Search" v-model="modalSkin.search.input" @update:model-value="onModalSkinSearch">
                  <template #append>
                    <v-checkbox label="All Weapons" v-model="modalSkin.search.all" hide-details @input="onModalSkinSearch"></v-checkbox>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6" md="3" lg="2" xl="1" v-for="skin in modalSkinSearchResultItems" :key="skin.id">
                <v-card @click="onModalSkinSelect(skin)" variant="text" v-tooltip:top="skin.name">
                  <v-overlay :model-value="true" :scrim="false" contained class="justify-end" persistent>
                    <v-icon size="25" color="orange" v-if="modalSkin.form[TEAM_T].paint == skin.paint_index">mdi-check-circle-outline</v-icon>
                    <v-icon size="25" color="light-blue" v-if="modalSkin.form[TEAM_CT].paint == skin.paint_index">mdi-check-circle-outline</v-icon>
                  </v-overlay>
                  <v-img :src="skin.image" height="90"></v-img>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-pagination 
                  v-model="modalSkin.search.page"
                  :length="Math.ceil(modalSkin.search.results.length / modalSkin.search.itemsPerPage)"
                  :disabled="modalSkin.search.loading"
                  :total-visible="7"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="closeModalSkin"></v-btn>
            <v-btn color="primary" text="Save" variant="tonal" @click="session.setSkin(modalSkin)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Sticker Dialog -->
      <v-dialog fullscreen v-model="modalSticker.open" persistent>
        <v-card>
          <v-toolbar color="secondary">
            <v-toolbar-title>Edit Sticker Slot {{ modalSticker.slot }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="closeModalSticker"></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" align-self="center">
                <v-img :src="modalSticker.sticker.image" height="100"></v-img>
                <p class="text-center">{{ modalSticker.sticker.name }}</p>
              </v-col>
              <v-col cols="12" md="6" align-self="center">
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Wear" v-model="modalSticker.form.wear" @change="validateWear('sticker')" hint="0.001 ~ 1.0" hide-details="auto"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="X" v-model="modalSticker.form.x" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Y" v-model="modalSticker.form.y" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Scale" v-model="modalSticker.form.scale" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Rotate" v-model="modalSticker.form.rotate" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn variant="outlined" color="primary" append-icon="mdi-open-in-new" href="https://cs2inspects.com/sticker-customizer" target="_blank">Sticker Customizer</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Search" v-model="modalSticker.search.input" @update:model-value="onModalStickerSearch"></v-text-field>
              </v-col>
              <v-col cols="3" md="2" xl="1" v-for="sticker in modalStickerSearchResultItems">
                <v-tooltip :text="sticker.name" location="top">
                  <template v-slot:activator="{ props }">
                    <v-card v-bind="props" @click="onModalStickerSelect(sticker)" variant="text">
                      <v-img :src="sticker.image" height="90">
                        <v-overlay :model-value="sticker.id == modalSticker.form.id" contained class="align-center justify-center">
                          <v-icon size="50" color="green">mdi-check-circle-outline</v-icon>
                        </v-overlay>
                      </v-img>
                    </v-card>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <v-pagination 
                  v-model="modalSticker.search.page"
                  :length="Math.ceil(modalSticker.search.results.length / modalSticker.search.itemsPerPage)"
                  :disabled="modalSticker.search.loading"
                  :total-visible="7"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="closeModalSticker"></v-btn>
            <v-btn color="primary" text="Save" variant="tonal" @click="setSticker"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Keychain Dialog -->
      <v-dialog fullscreen v-model="modalKeychain.open" persistent>
        <v-card>
          <v-toolbar color="secondary">
            <v-toolbar-title>Edit Keychain</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="closeModalKeychain"></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" align-self="center">
                <v-img :src="modalKeychain.keychain.image" height="100"></v-img>
                <p class="text-center">{{ modalKeychain.keychain.name }}</p>
              </v-col>
              <v-col cols="12" md="6" align-self="center">
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Seed" v-model="modalKeychain.form.seed" @change="validateSeed('keychain')" hint="0 ~ 1000"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field label="X" v-model="modalKeychain.form.x" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field label="Y" v-model="modalKeychain.form.y" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field label="Z" v-model="modalKeychain.form.z" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn variant="outlined" color="primary" append-icon="mdi-open-in-new" href="https://cs2inspects.com/sticker-customizer" target="_blank">Sticker Customizer</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Search" v-model="modalKeychain.search.input" @update:model-value="onModalKeychainSearch"></v-text-field>
              </v-col>
              <v-col cols="3" md="2" xl="1" v-for="keychain in modalKeychainSearchResultItems">
                <v-tooltip :text="keychain.name" location="top">
                  <template v-slot:activator="{ props }">
                    <v-card v-bind="props" @click="onModalKeychainSelect(keychain)" variant="text">
                      <v-img :src="keychain.image" height="90">
                        <v-overlay :model-value="keychain.id == modalKeychain.form.id" contained class="align-center justify-center">
                          <v-icon size="50" color="green">mdi-check-circle-outline</v-icon>
                        </v-overlay>
                      </v-img>
                    </v-card>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <v-pagination 
                  v-model="modalKeychain.search.page"
                  :length="Math.ceil(modalKeychain.search.results.length / modalKeychain.search.itemsPerPage)"
                  :disabled="modalKeychain.search.loading"
                  :total-visible="7"
                ></v-pagination>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="closeModalKeychain"></v-btn>
            <v-btn color="primary" text="Save" variant="tonal" @click="setKeychain"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    `,
};
