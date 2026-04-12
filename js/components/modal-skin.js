import { ref, computed, watch } from "vue";
import { useSessionStore } from "../stores/session.js";
import { TEAM_CT, TEAM_T } from "../const/teams.js";
import { useSkinsStore } from "../stores/skins.js";
import { useStickersStore } from "../stores/stickers.js";
import { useKeychainsStore } from "../stores/keychains.js";
import ModalSticker from "./modal-sticker.js";
import ModalKeychain from "./modal-keychain.js";

export default {
  components: { ModalSticker, ModalKeychain },
  props: {
    modelValue: Boolean,
    weapon: Object, // { weapon_defindex, name, image }
    weapons: Array, // Full list for searching default images
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const session = useSessionStore();
    const skinsStore = useSkinsStore();
    const stickersStore = useStickersStore();
    const keychainsStore = useKeychainsStore();

    const tabSkinsTeam = ref(TEAM_T);

    const modalSkin = ref({
      weapon_defindex: "",
      weapon_name: "",
      isKnife: false,
      skin: {
        [TEAM_T]: { name: "", image: "", color: "" },
        [TEAM_CT]: { name: "", image: "", color: "" },
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
        [TEAM_T]: createDefaultForm(),
        [TEAM_CT]: createDefaultForm(),
      },
    });

    function createDefaultForm() {
      return {
        paint: 0,
        wear: 0.001,
        seed: 0,
        name: "",
        stattrack: 0,
        stickers0: createDefaultSticker(),
        stickers1: createDefaultSticker(),
        stickers2: createDefaultSticker(),
        stickers3: createDefaultSticker(),
        stickers4: createDefaultSticker(),
        keychain: { id: 0, seed: 0, image: "", x: 0, y: 0, z: 0 },
      };
    }

    function createDefaultSticker() {
      return { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 };
    }

    const onModalSkinSearch = () => {
      modalSkin.value.search.page = 1;
      modalSkin.value.search.results = skinsStore.skins.filter((skin) => {
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
      const weapon = props.weapons.find(
        (w) => w.weapon_defindex == modalSkin.value.weapon_defindex,
      );
      if (weapon) {
        modalSkin.value.search.results.unshift({
          id: "-1",
          name: "Default",
          weapon: { id: weapon.weapon_name, name: weapon.name },
          rarity: { color: "#000" },
          paint_index: "0",
          image: weapon.image,
        });
      }
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

    const validateWear = () => {
      const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].wear);
      if (
        isNaN(value) ||
        value <= 0.001 ||
        value > 1 ||
        modalSkin.value.form[tabSkinsTeam.value].paint == "0"
      )
        modalSkin.value.form[tabSkinsTeam.value].wear = 0.001;
    };

    const validateSeed = () => {
      const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].seed);
      if (
        isNaN(value) ||
        value > 1000 ||
        value < 0 ||
        modalSkin.value.form[tabSkinsTeam.value].paint == "0"
      )
        modalSkin.value.form[tabSkinsTeam.value].seed = 0;
      else modalSkin.value.form[tabSkinsTeam.value].seed = Math.round(value);
    };

    const init = () => {
      const defIndex = props.weapon.weapon_defindex;
      modalSkin.value.weapon_defindex = defIndex;
      modalSkin.value.weapon_name = props.weapon.name;
      modalSkin.value.isKnife =
        props.weapon.name.includes("Knife") ||
        props.weapon.name.includes("Bayonet") ||
        props.weapon.name.includes("Karambit");

      [TEAM_T, TEAM_CT].forEach((team) => {
        const selected = session.user.selected_skins?.[defIndex]?.[team];
        modalSkin.value.form[team].paint = parseInt(
          selected?.weapon_paint_id || "0",
        );
        modalSkin.value.form[team].wear = selected?.weapon_wear || 0.001;
        modalSkin.value.form[team].seed = selected?.weapon_seed || 0;
        modalSkin.value.form[team].stattrack =
          selected?.weapon_stattrak || 0;
        modalSkin.value.form[team].name = selected?.weapon_nametag || "";

        for (let i = 0; i < 5; i++) {
          const stickerKey = `weapon_sticker_${i}`;
          const stickerParts = (selected?.[stickerKey] || "0;0;0;0;0;0;0").split(
            ";",
          );
          const sForm = modalSkin.value.form[team][`stickers${i}`];
          sForm.id = stickerParts[0];
          sForm.image =
            stickerParts[0] == "0"
              ? ""
              : stickersStore.stickers.find((s) => s.id == stickerParts[0])
                  ?.image;
          sForm.x = stickerParts[2] || 0;
          sForm.y = stickerParts[3] || 0;
          sForm.wear = stickerParts[4] || 0.001;
          sForm.scale = stickerParts[5] || 1;
          sForm.rotate = stickerParts[6] || 0;
        }

        const keychainParts = (selected?.weapon_keychain || "0;0;0;0;0").split(
          ";",
        );
        const kForm = modalSkin.value.form[team].keychain;
        kForm.id = keychainParts[0] || 0;
        kForm.x = keychainParts[1] || 0;
        kForm.y = keychainParts[2] || 0;
        kForm.z = keychainParts[3] || 0;
        kForm.seed = keychainParts[4] || 0;
        kForm.image =
          keychainParts[0] == "0"
            ? ""
            : keychainsStore.keychains.find((k) => k.id == keychainParts[0])
                ?.image;

        if (modalSkin.value.form[team].paint != 0) {
          const result = skinsStore.skins.find(
            (s) => s.paint_index == modalSkin.value.form[team].paint,
          );
          modalSkin.value.skin[team].image = result.image;
          modalSkin.value.skin[team].name = result.name;
          modalSkin.value.skin[team].color = result.rarity.color;
        } else {
          modalSkin.value.skin[team].image = props.weapon.image;
          modalSkin.value.skin[team].name = "Default";
          modalSkin.value.skin[team].color = "#000";
        }
      });

      modalSkin.value.search.page = 1;
      modalSkin.value.search.input = "";
      tabSkinsTeam.value = TEAM_T;
      onModalSkinSearch();
    };

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal) init();
      },
      { immediate: true }
    );

    // Sticker Modal logic
    const stickerModal = ref({ open: false, slot: 0, initialData: {} });
    const openStickerModal = (slot) => {
      stickerModal.value.slot = slot;
      stickerModal.value.initialData =
        modalSkin.value.form[tabSkinsTeam.value][`stickers${slot}`];
      stickerModal.value.open = true;
    };
    const onStickerSave = (data) => {
      const sForm = modalSkin.value.form[tabSkinsTeam.value][`stickers${stickerModal.value.slot}`];
      Object.assign(sForm, data);
      stickerModal.value.open = false;
    };

    // Keychain Modal logic
    const keychainModal = ref({ open: false, initialData: {} });
    const openKeychainModal = () => {
      keychainModal.value.initialData =
        modalSkin.value.form[tabSkinsTeam.value].keychain;
      keychainModal.value.open = true;
    };
    const onKeychainSave = (data) => {
      Object.assign(modalSkin.value.form[tabSkinsTeam.value].keychain, data);
      keychainModal.value.open = false;
    };

    const save = () => {
      session.setSkin({
        weapon_defindex: modalSkin.value.weapon_defindex,
        form: modalSkin.value.form,
      });
      emit("update:modelValue", false);
    };

    return {
      TEAM_T,
      TEAM_CT,
      tabSkinsTeam,
      modalSkin,
      onModalSkinSearch,
      modalSkinSearchResultItems,
      onModalSkinSelect,
      validateWear,
      validateSeed,
      stickerModal,
      openStickerModal,
      onStickerSave,
      keychainModal,
      openKeychainModal,
      onKeychainSave,
      save,
      session,
    };
  },
  template: /*html*/
    `
    <v-dialog fullscreen :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>{{ modalSkin.weapon_name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="$emit('update:modelValue', false)"></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-tabs v-model="tabSkinsTeam" fixed-tabs class="mb-5" :color="tabSkinsTeam == TEAM_T ? 'orange' : 'light-blue'">
            <v-tab :value="TEAM_T">T</v-tab>
            <v-tab :value="TEAM_CT">CT</v-tab>
          </v-tabs>
          <v-row>
            <v-col cols="12" md="6" align-self="center">
              <v-img :src="modalSkin.skin[tabSkinsTeam].image" height="150"></v-img>
              <p class="text-center">{{ modalSkin.skin[tabSkinsTeam].name }}</p>
              <v-row class="my-1" v-if="!modalSkin.isKnife">
                <v-col v-for="i in 5" :key="i-1">
                  <v-card class="text-center" variant="text" @click="openStickerModal(i-1)">
                    <v-img v-if="modalSkin.form[tabSkinsTeam]['stickers' + (i-1)].image" :src="modalSkin.form[tabSkinsTeam]['stickers' + (i-1)].image" height="50"></v-img>
                    <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="text-center" variant="text" @click="openKeychainModal">
                    <v-img v-if="modalSkin.form[tabSkinsTeam].keychain.image" :src="modalSkin.form[tabSkinsTeam].keychain.image" height="50"></v-img>
                    <v-icon v-else size="50" icon="mdi-key-chain" color="grey-darken-3"></v-icon>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" align-self="center">
              <v-text-field label="Wear" v-model="modalSkin.form[tabSkinsTeam].wear" @change="validateWear" hint="0.001 ~ 1.0"></v-text-field>
              <v-text-field label="Seed" v-model="modalSkin.form[tabSkinsTeam].seed" @change="validateSeed" hint="0 ~ 1000"></v-text-field>
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
                :length="modalSkin.search.pages"
                :total-visible="7"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="plain" @click="$emit('update:modelValue', false)"></v-btn>
          <v-btn color="primary" text="Save" variant="tonal" @click="save"></v-btn>
        </v-card-actions>
      </v-card>

      <ModalSticker v-model="stickerModal.open" :slot="stickerModal.slot" :initial-data="stickerModal.initialData" @save="onStickerSave" />
      <ModalKeychain v-model="keychainModal.open" :initial-data="keychainModal.initialData" @save="onKeychainSave" />
    </v-dialog>
  `,
};
