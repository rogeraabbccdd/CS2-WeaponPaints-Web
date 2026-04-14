import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T, TEAM_NAME } from '../const/teams.js'
import { useAgentsStore } from '../stores/agents.js'
import CardAgent from '../components/card-agent.js'

export default {
  components: { CardAgent },
  setup () {
    const session = useSessionStore()
    const agents = useAgentsStore()

    const loading = ref(true)
    
    const tabAgentsTeam = ref(TEAM_T)

    const searchInput = ref('')
    const activeAgentId = ref(null)
    const sortOrder = ref('rarity_desc')

    const sortOptions = [
      { title: 'Name (A-Z)', value: 'asc' },
      { title: 'Name (Z-A)', value: 'desc' },
      { title: 'Rarity (High-Low)', value: 'rarity_desc' },
      { title: 'Rarity (Low-High)', value: 'rarity_asc' }
    ]

    // Static default item
    const NO_AGENT_ITEM = {
      name: 'Default',
      image: './images/default.svg',
      model_player: 'default',
      isDefault: true,
      rarityWeight: -1,
      rarity: { color: '#424242', id: 'rarity_default' }
    }

    // Prepare items for v-data-iterator filtered by team
    const items = computed(() => {
      if (tabAgentsTeam.value === TEAM_T) return [NO_AGENT_ITEM, ...agents.agentsT]
      else return [NO_AGENT_ITEM, ...agents.agentsCT]
    })

    // Map the internal sort state to Vuetify's sortBy format
    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' }
      switch (sortOrder.value) {
        case 'asc': return [priority, { key: 'name', order: 'asc' }]
        case 'desc': return [priority, { key: 'name', order: 'desc' }]
        case 'rarity_desc': return [priority, { key: 'rarityWeight', order: 'desc' }, { key: 'name', order: 'asc' }]
        case 'rarity_asc': return [priority, { key: 'rarityWeight', order: 'asc' }, { key: 'name', order: 'asc' }]
        default: return [priority]
      }
    })

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase())
    }

    const onActiveAgentUpdate = (id, value) => {
      activeAgentId.value = value ? id : null
    }

    onMounted(async () => {
      loading.value = true
      await agents.fetchData()
      loading.value = false
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      loading,
      tabAgentsTeam,
      searchInput,
      items,
      sortBy,
      customFilter,
      activeAgentId,
      onActiveAgentUpdate,
      sortOrder,
      sortOptions
    }
  },
  template: /*html*/
    `
    <v-container fluid>
      <div v-if="loading" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
        <v-progress-circular color="primary" :size="75" width="7" indeterminate class="mb-4"></v-progress-circular>
        <h1 class="text-h5 font-header">Loading...</h1>
      </div>

      <template v-else>
        <!-- Team Select (Centered Row) -->
        <v-row justify="center" class="mb-6">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-btn-toggle
              v-model="tabAgentsTeam"
              mandatory
              :color="tabAgentsTeam == TEAM_T ? 'orange' : 'light-blue'"
              variant="outlined"
              class="border rounded d-flex w-100"
              style="height: 56px;"
            >
              <v-btn :value="TEAM_T" class="flex-grow-1" height="56">
                <v-icon start color="orange">mdi-account-group</v-icon>
                Terrorists
              </v-btn>
              <v-btn :value="TEAM_CT" class="flex-grow-1" height="56">
                <v-icon start color="light-blue">mdi-shield-account</v-icon>
                Counter-Terrorists
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-data-iterator
          :items="items"
          :search="searchInput"
          :sort-by="sortBy"
          :custom-filter="customFilter"
          :items-per-page="-1"
        >
          <template v-slot:header>
            <v-row class="mb-4">
              <v-col cols="12" sm="8" md="9">
                <v-text-field 
                  color="primary" 
                  variant="outlined" 
                  label="Search Agents..." 
                  v-model="searchInput" 
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="3">
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
              <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.model_player">
                <CardAgent 
                  :agent="item.raw"
                  :team="tabAgentsTeam"
                  :active="activeAgentId === item.raw.model_player"
                  @update:active="onActiveAgentUpdate(item.raw.model_player, $event)"
                />
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer="{ pageCount }">
            <v-row v-if="pageCount > 1" justify="center" class="mt-6">
              <v-col cols="12" sm="8" md="6">
                <v-pagination 
                  v-model="search.page"
                  :length="pageCount"
                  :total-visible="5"
                  rounded="circle"
                  density="comfortable"
                ></v-pagination>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </template>
    </v-container>
    `
}
