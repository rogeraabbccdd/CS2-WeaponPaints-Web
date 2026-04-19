import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { useAgentsStore } from '../stores/agents.js'
import CardAgent from '../components/card-agent.js'

export default {
  components: { CardAgent },
  expose: ['load'],
  setup (props, { expose }) {
    const { t } = useI18n()
    const session = useSessionStore()
    const agents = useAgentsStore()

    const loading = ref(true)
    
    const tabAgentsTeam = ref(TEAM_T)

    const searchInput = ref('')
    const activeAgentId = ref(undefined)
    const sortOrder = ref('rarity_desc')

    const sortOptions = computed(() => [
      { title: t('page.agents.sort.name_asc'), value: 'asc' },
      { title: t('page.agents.sort.name_desc'), value: 'desc' },
      { title: t('page.agents.sort.rarity_desc'), value: 'rarity_desc' },
      { title: t('page.agents.sort.rarity_asc'), value: 'rarity_asc' }
    ])

    // Static default item
    const NO_AGENT_ITEM = {
      name: t('page.agents.default'),
      image: './images/default.svg',
      model_player: null,
      isDefault: true,
      rarityWeight: -1,
      rarity: { color: '#424242', id: 'rarity_default' }
    }

    // Prepare items for v-data-iterator filtered by team
    const items = computed(() => {
      const defaultItem = { ...NO_AGENT_ITEM, name: t('page.agents.default') }
      if (tabAgentsTeam.value === TEAM_T) return [defaultItem, ...agents.agentsT]
      else return [defaultItem, ...agents.agentsCT]
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
      activeAgentId.value = value ? id : undefined
    }

    onMounted(async () => {
      loading.value = true
      await agents.fetchData()
      loading.value = false
    })

    return {
      TEAM_T,
      TEAM_CT,
      t,
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
        <h1 class="text-h5 font-header">{{ t('loading.text') }}</h1>
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
                  :label="t('page.agents.search.label')" 
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
                  :label="t('page.agents.sort.label')"
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
