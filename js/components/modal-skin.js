import { ref, computed, watch } from "vue";
import { useI18n } from 'vue-i18n'
import { useSessionStore } from "../stores/session.js";
import { TEAM_CT, TEAM_T } from "../const/teams.js";
import { useSkinsStore } from "../stores/skins.js";
import { useStickersStore } from "../stores/stickers.js";
import { useKeychainsStore } from "../stores/keychains.js"
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
    const { t } = useI18n()
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
        input: "",
        all: false,
        sort: "rarity_desc",
        itemsPerPage: 24,
        defaultSkin: null,
      },
      form: {
        [TEAM_T]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: "",
          stattrack: 0,
          stickers0: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers1: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers2: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers3: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers4: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          keychain: { id: 0, seed: 0, image: "", x: 0, y: 0, z: 0 },
        },
        [TEAM_CT]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: "",
          stattrack: 0,
          stickers0: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers1: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers2: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers3: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          stickers4: { id: 0, wear: 0.001, image: "", x: 0, y: 0, scale: 1, rotate: 0 },
          keychain: { id: 0, seed: 0, image: "", x: 0, y: 0, z: 0 },
        },
      },
    });

    const skinSortOptions = computed(() =>[
      { title: t('modal_skin.sort.name_asc'), value: 'asc' },
      { title: t('modal_skin.sort.name_desc'), value: 'desc' },
      { title: t('modal_skin.sort.rarity_asc'), value: 'rarity_asc' },
      { title: t('modal_skin.sort.rarity_desc'), value: 'rarity_desc' },
    ]);

    // Filter items based on weapon and "All" toggle
    const items = computed(() => {
      const filtered = skinsStore.skins.filter(skin => {
        if (modalSkin.value.search.all) return true;
        return skin.weapon.weapon_id === modalSkin.value.weapon_defindex;
      });

      if (modalSkin.value.search.defaultSkin) {
        return [{ ...modalSkin.value.search.defaultSkin, isDefault: true, rarityWeight: -1 }, ...filtered];
      }
      return filtered;
    });

    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' };
      switch (modalSkin.value.search.sort) {
        case 'asc': return [priority, { key: 'name', order: 'asc' }];
        case 'desc': return [priority, { key: 'name', order: 'desc' }];
        case 'rarity_desc': return [priority, { key: 'rarityWeight', order: 'desc' }, { key: 'name', order: 'asc' }];
        case 'rarity_asc': return [priority, { key: 'rarityWeight', order: 'asc' }, { key: 'name', order: 'asc' }];
        default: return [priority];
      }
    });

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase());
    };

    const onModalSkinSelect = (skin) => {
      modalSkin.value.form[tabSkinsTeam.value].paint = parseInt(skin.paint_index);
      modalSkin.value.skin[tabSkinsTeam.value].image = skin.image;
      modalSkin.value.skin[tabSkinsTeam.value].name = skin.name;
      modalSkin.value.skin[tabSkinsTeam.value].color = skin.rarity.color;
    };

    const validateWear = () => {
      let value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].wear);
      if (isNaN(value) || value < 0) value = 0.001;
      if (value > 1) value = 1;
      modalSkin.value.form[tabSkinsTeam.value].wear = value;
    };

    const validateSeed = () => {
      let value = parseInt(modalSkin.value.form[tabSkinsTeam.value].seed);
      if (isNaN(value) || value < 0) value = 0;
      if (value > 1000) value = 1000;
      modalSkin.value.form[tabSkinsTeam.value].seed = value;
    };

    const init = () => {
      const defIndex = props.weapon.weapon_defindex;
      modalSkin.value.weapon_defindex = defIndex;
      modalSkin.value.weapon_name = props.weapon.name;
      modalSkin.value.isKnife =
        props.weapon.name.includes("Knife") ||
        props.weapon.name.includes("Bayonet") ||
        props.weapon.name.includes("Karambit");

      const weapon = props.weapons.find(
        (w) => w.weapon_defindex == modalSkin.value.weapon_defindex,
      );
      if (weapon) {
        modalSkin.value.search.defaultSkin = {
          id: "-1",
          name: "Default",
          weapon: { id: weapon.weapon_name, name: weapon.name },
          rarity: { color: "#424242", id: "rarity_default" },
          paint_index: "0",
          image: weapon.image,
        };
      } else {
        modalSkin.value.search.defaultSkin = null;
      }

      [TEAM_T, TEAM_CT].forEach((team) => {
        const selected = session.loadout.selected_skins?.[defIndex]?.[team];
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
          modalSkin.value.skin[team].image = result?.image || props.weapon.image;
          modalSkin.value.skin[team].name = result?.name || "Default";
          modalSkin.value.skin[team].color = result?.rarity?.color || "#424242";
        } else {
          modalSkin.value.skin[team].image = props.weapon.image;
          modalSkin.value.skin[team].name = "Default";
          modalSkin.value.skin[team].color = "#424242";
        }
      });

      modalSkin.value.search.page = 1;
      modalSkin.value.search.input = "";
      tabSkinsTeam.value = TEAM_T;
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
      items,
      sortBy,
      customFilter,
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
      t,
      session,
      skinSortOptions
    };
  },
  template: /*html*/
    `
    <v-dialog fullscreen :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" transition="dialog-bottom-transition">
      <v-card color="background">
        <v-toolbar color="surface" elevation="1">
          <v-btn icon="mdi-close" @click="$emit('update:modelValue', false)"></v-btn>
          <v-toolbar-title class="text-primary font-weight-bold">{{ modalSkin.weapon_name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" class="px-6" @click="save">{{ t('modal_skin.save') }}</v-btn>
        </v-toolbar>

        <v-card-text class="pa-0">
          <v-container fluid>
            <!-- Team Toggle -->
            <v-row justify="center" class="mb-6">
              <v-col cols="12" sm="10" md="8" lg="6">
                <v-btn-toggle
                  v-model="tabSkinsTeam"
                  mandatory
                  :color="tabSkinsTeam == TEAM_T ? 'orange' : 'light-blue'"
                  variant="outlined"
                  class="border rounded d-flex w-100"
                  style="height: 56px;"
                >
                  <v-btn :value="TEAM_T" class="flex-grow-1 w-50" height="56">
                    <v-icon start color="orange">mdi-account-group</v-icon>
                    {{ t('team.t') }}
                  </v-btn>
                  <v-btn :value="TEAM_CT" class="flex-grow-1 w-50" height="56">
                    <v-icon start color="light-blue">mdi-shield-account</v-icon>
                    {{ t('team.ct') }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <v-row>
              <!-- Left: Preview -->
              <v-col cols="12" md="6">
                <v-card border flat class="pa-4 bg-surface rounded-lg h-100">
                  <div class="card-accent-line mb-4" :style="{ background: modalSkin.skin[tabSkinsTeam].color }"></div>
                  <div class="text-overline mb-2">{{ t('modal_skin.preview.title') }}</div>
                  <v-img :src="modalSkin.skin[tabSkinsTeam].image" height="200" contain rounded class="mb-2"></v-img>
                  <div class="text-h6 text-center font-weight-medium">
                    {{ modalSkin.skin[tabSkinsTeam].name }}
                  </div>
                </v-card>
              </v-col>

              <!-- Right: Attributes Form -->
              <v-col cols="12" md="6">
                <v-card border flat class="pa-6 bg-surface rounded-lg h-100 d-flex flex-column justify-center">
                  <div class="text-overline mb-4">{{ t('modal_skin.attributes.title') }}</div>
                  <v-row density="comfortable">
                    <v-col cols="12" sm="6" class="pb-2">
                      <v-text-field 
                        :label="t('modal_skin.attributes.wear')" v-model.number="modalSkin.form[tabSkinsTeam].wear" 
                        variant="outlined" density="compact"
                        type="number" :step="0.001" :min="0" :max="1"
                        @update:model-value="validateWear" prepend-inner-icon="mdi-texture" hide-details class="mb-1"
                      ></v-text-field>
                      <v-slider v-model="modalSkin.form[tabSkinsTeam].wear" min="0.001" max="1" step="0.001" color="primary" hide-details density="compact"></v-slider>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-2">
                      <v-text-field 
                        :label="t('modal_skin.attributes.seed')" v-model.number="modalSkin.form[tabSkinsTeam].seed" 
                        variant="outlined" density="compact" type="number" min="0" max="1000"
                        @update:model-value="validateSeed" prepend-inner-icon="mdi-fingerprint" hide-details class="mb-1"
                      ></v-text-field>
                      <v-slider v-model="modalSkin.form[tabSkinsTeam].seed" min="0" max="1000" step="1" color="primary" hide-details density="compact"></v-slider>
                    </v-col>
                    <v-col cols="12" class="py-1">
                      <v-text-field 
                        :label="t('modal_skin.attributes.nametag')" v-model="modalSkin.form[tabSkinsTeam].name" 
                        variant="outlined" density="compact" prepend-inner-icon="mdi-tag-outline" hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="modalSkin.form[tabSkinsTeam].stattrack" :true-value="1" :false-value="0"
                        color="orange-darken-2" hide-details inset density="compact"
                      >
                        <template #label>
                          <span class="text-subtitle-2 ml-2" :class="modalSkin.form[tabSkinsTeam].stattrack ? 'text-orange-darken-2 font-weight-bold' : ''">
                            {{ t('modal_skin.attributes.stattrack') }}
                          </span>
                        </template>
                      </v-switch>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Middle: Stickers & Keychain (Independent Row) -->
            <v-row v-if="!modalSkin.isKnife" class="GA-2 ga-2 justify-center mt-4">
              <v-col cols="12">
                <v-card border flat class="pa-4 bg-surface rounded-lg">
                  <div class="text-overline mb-2 text-center">{{ t('modal_skin.stickers.title') }}</div>
                  <v-row class="ga-2 justify-center ma-0">
                    <v-col v-for="i in 5" :key="i-1" cols="auto" class="pa-1">
                      <v-card 
                        width="80" height="80" border flat 
                        class="d-flex align-center justify-center cursor-pointer hover-opacity bg-grey-darken-4"
                        @click="openStickerModal(i-1)"
                      >
                        <v-img 
                          v-if="modalSkin.form[tabSkinsTeam]['stickers' + (i-1)].image" 
                          :src="modalSkin.form[tabSkinsTeam]['stickers' + (i-1)].image" 
                          class="w-100 h-100"
                          contain
                        ></v-img>
                        <v-icon v-else icon="mdi-sticker-plus-outline" color="grey-darken-2" size="32"></v-icon>
                        <v-tooltip activator="parent" location="top">{{ t('modal_skin.stickers.slot', { slot: i }) }}</v-tooltip>
                      </v-card>
                    </v-col>
                    <v-col cols="auto" class="pa-1">
                      <v-card 
                        width="80" height="80" border flat 
                        class="d-flex align-center justify-center cursor-pointer hover-opacity bg-grey-darken-4"
                        @click="openKeychainModal"
                      >
                        <v-img 
                          v-if="modalSkin.form[tabSkinsTeam].keychain.image" 
                          :src="modalSkin.form[tabSkinsTeam].keychain.image" 
                          class="w-100 h-100"
                          contain
                        ></v-img>
                        <v-icon v-else icon="mdi-key-chain" color="grey-darken-2" size="32"></v-icon>
                        <v-tooltip activator="parent" location="top">{{ t('modal_skin.stickers.keychain') }}</v-tooltip>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-8"></v-divider>

            <v-data-iterator
              :items="items"
              :search="modalSkin.search.input"
              :sort-by="sortBy"
              :custom-filter="customFilter"
              :items-per-page="modalSkin.search.itemsPerPage"
              v-model:page="modalSkin.search.page"
            >
              <template v-slot:header>
                <v-row align="center" class="mb-4">
                  <v-col cols="12" md="6">
                    <v-text-field 
                      :label="t('modal_skin.search.label')" 
                      v-model="modalSkin.search.input" 
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-magnify"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex align-center ga-4">
                    <v-select
                      v-model="modalSkin.search.sort"
                      :items="skinSortOptions"
                      :label="t('modal_skin.sort.label')"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      class="flex-grow-1"
                    ></v-select>
                    <v-checkbox 
                      :label="t('modal_skin.all_weapons')" 
                      v-model="modalSkin.search.all" 
                      hide-details 
                      density="compact"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:default="{ items: displayedItems }">
                <v-row>
                  <v-col cols="6" sm="4" md="3" lg="2" v-for="item in displayedItems" :key="item.raw.id">
                    <v-card 
                      border flat 
                      class="cursor-pointer position-relative overflow-hidden skin-card"
                      @click="onModalSkinSelect(item.raw)"
                    >
                      <div class="card-accent-line" :style="{ background: item.raw.rarity.color }"></div>
                      <v-img :src="item.raw.image" height="100" contain>
                        <div class="position-absolute right-0 top-0 pa-1" style="z-index: 1">
                          <v-icon size="24" color="orange" v-if="modalSkin.form[TEAM_T].paint == item.raw.paint_index">mdi-check-circle</v-icon>
                          <v-icon size="24" color="light-blue" v-if="modalSkin.form[TEAM_CT].paint == item.raw.paint_index">mdi-check-circle</v-icon>
                        </div>
                      </v-img>
                      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">
                        {{ item.raw.name }}
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:footer="{ pageCount }">
                <v-row v-if="pageCount > 1" justify="center" class="mt-6">
                  <v-col cols="12" sm="8" md="6">
                    <v-pagination 
                      v-model="modalSkin.search.page"
                      :length="pageCount"
                      :total-visible="5"
                      rounded="circle"
                      density="comfortable"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-container>
        </v-card-text>
      </v-card>

      <ModalSticker v-model="stickerModal.open" :slot="stickerModal.slot" :initial-data="stickerModal.initialData" @save="onStickerSave" />
      <ModalKeychain v-model="keychainModal.open" :initial-data="keychainModal.initialData" @save="onKeychainSave" />
    </v-dialog>
  `,
};