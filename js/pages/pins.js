import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { usePinsStore } from '../stores/pins.js'
import CardPin from '../components/card-pin.js'

export default {
  components: { CardPin },
  setup () {
    const { t } = useI18n()
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

    const sortOptions = computed(() => [
      { title: t('page.pins.sort.name_asc'), value: 'asc' },
      { title: t('page.pins.sort.name_desc'), value: 'desc' },
      { title: t('page.pins.sort.rarity_desc'), value: 'rarity_desc' },
      { title: t('page.pins.sort.rarity_asc'), value: 'rarity_asc' }
    ])

    // Reset to page 1 when search or sort changes
    const onParamsUpdate = () => {
      search.value.page = 1;
    }

    // Static default item
    const NO_PIN_ITEM = {
      id: 0,
      name: t('page.pins.default'),
      image: './images/default.svg',
      isDefault: true,
      rarityWeight: -1,
      rarity: { color: '#424242' }
    }

    // Prepare items for v-data-iterator
    const items = computed(() => {
      const defaultItem = { ...NO_PIN_ITEM, name: t('page.pins.default') }
      // Just spreading pre-calculated store data
      return [defaultItem, ...pins.pins];
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
      t,
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
        <h1 class="text-h5 font-header">{{ t('loading.text') }}</h1>
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
                :label="t('page.pins.search.label')" 
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
                :label="t('page.pins.sort.label')"
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
