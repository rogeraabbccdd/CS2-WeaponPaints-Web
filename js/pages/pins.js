import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { usePinsStore } from '../stores/pins.js'
import CardPin from '../components/card-pin.js'

export default {
  components: { CardPin },
  setup () {
    const session = useSessionStore()
    const pins = usePinsStore()

    const loading = ref(true)

    const search = ref({
      page: 1,
      input: '',
      sort: 'rarity_desc',
      itemsPerPage: -1,
    })

    const activePin = ref(null)

    const sortOptions = [
      { title: 'Name (A-Z)', value: 'asc' },
      { title: 'Name (Z-A)', value: 'desc' },
      { title: 'Rarity (High-Low)', value: 'rarity_desc' },
      { title: 'Rarity (Low-High)', value: 'rarity_asc' }
    ]

    // Reset to page 1 when search or sort changes
    const onParamsUpdate = () => {
      search.value.page = 1;
    }

    // Static default item
    const NO_PIN_ITEM = {
      id: 0,
      name: 'Default',
      image: './images/default.svg',
      isDefault: true,
      rarityWeight: -1,
      rarity: { color: '#424242' }
    }

    // Prepare items for v-data-iterator
    const items = computed(() => {
      // Just spreading pre-calculated store data
      return [NO_PIN_ITEM, ...pins.pins];
    })

    // Map sort order to v-data-iterator format
    // Always keep isDefault: true at the top
    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' };
      switch (search.value.sort) {
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

    const onActivePinUpdate = (id, value) => {
      activePin.value = value ? id : null
    }

    onMounted(async () => {
      loading.value = true
      await pins.fetchData()
      loading.value = false
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      loading,
      search,
      items,
      sortBy,
      customFilter,
      activePin,
      onActivePinUpdate,
      onParamsUpdate,
      sortOptions,
    }
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
        :search="search.input"
        :sort-by="sortBy"
        :custom-filter="customFilter"
        v-model:page="search.page"
        :items-per-page="search.itemsPerPage"
      >
        <template v-slot:header>
          <v-row class="mb-4">
            <v-col cols="12" sm="8" md="9">
              <v-text-field 
                color="primary" 
                variant="outlined" 
                label="Search Pins..." 
                v-model="search.input" 
                @update:model-value="onParamsUpdate"
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="search.sort"
                :items="sortOptions"
                label="Sort"
                variant="outlined"
                @update:model-value="onParamsUpdate"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="{ items: displayedItems }">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.id">
              <CardPin
                :pin="item.raw"
                :active="activePin === item.raw.id"
                @update:active="onActivePinUpdate(item.raw.id, $event)"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    `
}
