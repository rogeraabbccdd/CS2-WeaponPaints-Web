import { ref, computed, onMounted } from "vue";
import { useI18n } from 'vue-i18n'
import { useSessionStore } from "../stores/session.js";
import { useSkinsStore } from "../stores/skins.js";
import { useStickersStore } from "../stores/stickers.js";
import { useKeychainsStore } from "../stores/keychains.js";
import { KNIVES, WEAPONS } from "../const/weapons.js";
import ModalSkin from "../components/modal-skin.js";
import ModalSticker from "../components/modal-sticker.js";
import ModalKeychain from "../components/modal-keychain.js";
import CardWeapon from "../components/card-weapon.js";

export default {
  components: { ModalSkin, ModalSticker, ModalKeychain, CardWeapon },
  setup() {
    const { t } = useI18n()
    const session = useSessionStore();
    const skins = useSkinsStore();
    const stickers = useStickersStore();
    const keychains = useKeychainsStore();

    const weapons = WEAPONS.concat(KNIVES);

    const loading = ref(true)
    const searchInput = ref("");
    const sortOrder = ref("asc");
    const categoryFilter = ref(null);

    const sortOptions = computed(() => [
      { title: t('page.skins.sort.name_asc'), value: 'asc' },
      { title: t('page.skins.sort.name_desc'), value: 'desc' }
    ])

    const categoryOptions = computed(() => [
      { title: t('weapon.category.all'), value: null },
      { title: t('weapon.category.pistol'), value: 'pistol' },
      { title: t('weapon.category.smg'), value: 'smg' },
      { title: t('weapon.category.rifle'), value: 'rifle' },
      { title: t('weapon.category.shotgun'), value: 'shotgun' },
      { title: t('weapon.category.machinegun'), value: 'machinegun' },
      { title: t('weapon.category.knife'), value: 'knife' },
      { title: t('weapon.category.zeus'), value: 'zeus' }
    ]);

    // Filter by category first, then let v-data-iterator handle search and sort
    const items = computed(() => {
      let filtered = weapons;
      if (categoryFilter.value) {
        filtered = weapons.filter(weapon => weapon.category === categoryFilter.value);
      }
      
      return filtered.map(weapon => ({
        ...weapon,
        translatedName: t(`weapon.name.${weapon.weapon_name}`)
      }));
    });

    const sortBy = computed(() => {
      return [{ key: 'translatedName', order: sortOrder.value }];
    });

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.translatedName.toUpperCase().includes(searchInput.toUpperCase());
    };

    const modalSkinOpen = ref(false);
    const selectedWeapon = ref(null);

    const openModalSkin = (weapon) => {
      selectedWeapon.value = weapon;
      modalSkinOpen.value = true;
    };

    onMounted(async () => {
      loading.value = true
      await Promise.allSettled([skins.fetchData(), stickers.fetchData(), keychains.fetchData()])
      loading.value = false
    });

    return {
      weapons,
      t,
      session,
      loading,
      searchInput,
      items,
      sortBy,
      customFilter,
      modalSkinOpen,
      selectedWeapon,
      openModalSkin,
      sortOrder,
      sortOptions,
      categoryFilter,
      categoryOptions,
    };
  },
  template: /*html*/
    `
    <v-container fluid>
      <div v-if="loading" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
        <v-progress-circular color="primary" :size="75" width="7" indeterminate class="mb-4"></v-progress-circular>
        <h1 class="text-h5 font-header">{{ t('loading.text') }}</h1>
      </div>

      <v-data-iterator
        v-else
        :items="items"
        :search="searchInput"
        :sort-by="sortBy"
        :custom-filter="customFilter"
        :items-per-page="-1"
      >
        <template v-slot:header>
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-text-field 
                color="primary" 
                variant="outlined" 
                :label="t('page.skins.search.label')"
                v-model="searchInput" 
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="categoryFilter"
                :items="categoryOptions"
                :label="t('page.skins.category.label')"
                variant="outlined"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="sortOrder"
                :items="sortOptions"
                :label="t('page.skins.sort.label')"
                variant="outlined"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="{ items: displayedItems }">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.weapon_name">
              <CardWeapon 
                :weapon="item.raw"
                @click="openModalSkin(item.raw)"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>

      <ModalSkin 
        v-if="selectedWeapon"
        v-model="modalSkinOpen" 
        :weapon="selectedWeapon" 
        :weapons="weapons"
      />
    </v-container>
    `,
};
