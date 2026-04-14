import { ref, computed, onMounted } from "vue";
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
    const session = useSessionStore();
    const skins = useSkinsStore();
    const stickers = useStickersStore();
    const keychains = useKeychainsStore();

    const weapons = WEAPONS.concat(KNIVES);

    const loading = ref(true)
    const searchInput = ref("");
    const sortOrder = ref("asc");
    const categoryFilter = ref(null);

    const sortOptions = [
      { title: 'Name (A-Z)', value: 'asc' },
      { title: 'Name (Z-A)', value: 'desc' }
    ];

    const categoryOptions = [
      { title: 'All Categories', value: null },
      { title: 'Pistols', value: 'pistol' },
      { title: 'SMGs', value: 'smg' },
      { title: 'Rifles', value: 'rifle' },
      { title: 'Shotguns', value: 'shotgun' },
      { title: 'Machineguns', value: 'machinegun' },
      { title: 'Knives', value: 'knife' },
      { title: 'Zeus', value: 'zeus' }
    ];

    // Filter by category first, then let v-data-iterator handle search and sort
    const items = computed(() => {
      if (!categoryFilter.value) return weapons;
      return weapons.filter(weapon => weapon.category === categoryFilter.value);
    });

    const sortBy = computed(() => {
      return [{ key: 'name', order: sortOrder.value }];
    });

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase());
    };

    const modalSkinOpen = ref(false);
    const selectedWeapon = ref(null);

    const openModalSkin = (weapon) => {
      selectedWeapon.value = weapon;
      modalSkinOpen.value = true;
    };

    onMounted(async () => {
      loading.value = true
      await skins.fetchData()
      await stickers.fetchData()
      await keychains.fetchData()
      loading.value = false
    });

    return {
      weapons,
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
        <h1 class="text-h5 font-header">Loading...</h1>
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
                label="Search Weapons..." 
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
                label="Category"
                variant="outlined"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="sortOrder"
                :items="sortOptions"
                label="Sort"
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
