import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { useSkinsStore } from '../stores/skins.js'
import CardGlove from '../components/card-glove.js'

export default {
  components: { CardGlove },
  setup () {
    const session = useSessionStore()
    const skins = useSkinsStore()

    const loading = ref(true)

    const searchInput = ref('')
    const activeGlove = ref(null)
    const sortOrder = ref('asc')
    const categoryFilter = ref(null)

    const sortOptions = [
      { title: 'Name (A-Z)', value: 'asc' },
      { title: 'Name (Z-A)', value: 'desc' }
    ]

    const categoryOptions = [
      { title: 'All Categories', value: null },
      { title: 'Bloodhound Gloves', value: 'studded_bloodhound_gloves' },
      { title: 'Broken Fang Gloves', value: 'studded_brokenfang_gloves' },
      { title: 'Driver Gloves', value: 'slick_gloves' },
      { title: 'Hand Wraps', value: 'leather_handwraps' },
      { title: 'Hydra Gloves', value: 'studded_hydra_gloves' },
      { title: 'Moto Gloves', value: 'motorcycle_gloves' },
      { title: 'Specialist Gloves', value: 'specialist_gloves' },
      { title: 'Sport Gloves', value: 'sporty_gloves' }
    ]

    // Prepare items for v-data-iterator with category filtering
    const items = computed(() => {
      const defaultGlove = {
        name: 'Default',
        image: './images/default.svg',
        paint_index: 0,
        id: 'default',
        isDefault: true,
        rarity: { color: '#424242' }
      };

      const baseGloves = skins.gloves
        .filter(glove => !categoryFilter.value || (glove.weapon && glove.weapon.id === categoryFilter.value))

      // Only show default if no category filter or searching (or always show at top)
      return [defaultGlove, ...baseGloves];
    });

    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' };
      return [priority, { key: 'name', order: sortOrder.value }];
    });

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase());
    };

    const onActiveGloveUpdate = (id, value) => {
      activeGlove.value = value ? id : null
    }

    onMounted(async () => {
      loading.value = true
      await skins.fetchData()
      loading.value = false
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      loading,
      searchInput,
      items,
      sortBy,
      customFilter,
      activeGlove,
      onActiveGloveUpdate,
      sortOrder,
      sortOptions,
      categoryFilter,
      categoryOptions,
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
                label="Search Gloves..." 
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
            <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.paint_index || item.raw.id">
              <CardGlove
                :glove="item.raw"
                :active="activeGlove === (item.raw.paint_index || item.raw.id)"
                @update:active="onActiveGloveUpdate(item.raw.paint_index || item.raw.id, $event)"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    `
}
