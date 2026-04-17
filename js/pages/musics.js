import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { useMusicsStore } from '../stores/musics.js'
import CardMusic from '../components/card-music.js'

export default {
  components: { CardMusic },
  setup () {
    const { t } = useI18n()
    const session = useSessionStore()
    const musics = useMusicsStore()

    const loading = ref(true)
    
    const searchInput = ref('')
    const activeMusic = ref(null)
    const sortOrder = ref('asc')

    const sortOptions = computed(() => [
      { title: t('page.musics.sort.name_asc'), value: 'asc' },
      { title: t('page.musics.sort.name_desc'), value: 'desc' }
    ])

    // Static default item
    const NO_MUSIC_ITEM = {
      id: 0,
      name: t('page.musics.default'),
      image: './images/default.svg',
      isDefault: true,
      rarity: { color: '#424242' }
    }

    // Prepare items for v-data-iterator
    const items = computed(() => {
      const defaultItem = { ...NO_MUSIC_ITEM, name: t('page.musics.default') }
      if (musics.loading) return []
      
      return [defaultItem, ...musics.musics]
    })

    // Map sort order to v-data-iterator format
    // Always keep isDefault: true at the top
    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' };
      return [priority, { key: 'name', order: sortOrder.value }];
    });

    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase());
    };

    const onActiveMusicUpdate = (id, value) => {
      activeMusic.value = value ? id : null
    }

    onMounted(async () => {
      loading.value = true
      await musics.fetchData()
      loading.value = false
    })

    return {
      TEAM_T,
      TEAM_CT,
      t,
      session,
      loading,
      searchInput,
      items,
      sortBy,
      customFilter,
      activeMusic,
      onActiveMusicUpdate,
      sortOrder,
      sortOptions,
    }
  },
  template: /*html*/
    `
    <v-container fluid>
      <div v-if="loading" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
        <v-progress-circular color="primary" :size="75" width="7" indeterminate class="mb-4"></v-progress-circular>
        <h1 class="text-h5 font-header">{{ $t('loading.text') }}</h1>
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
            <v-col cols="12" sm="8" md="9">
              <v-text-field 
                color="primary" 
                variant="outlined" 
                :label="$t('page.musics.search.label')" 
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
                :label="$t('page.musics.sort.label')"
                variant="outlined"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="{ items: displayedItems }">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.id">
              <CardMusic
                :music="item.raw"
                :active="activeMusic === item.raw.id"
                @update:active="onActiveMusicUpdate(item.raw.id, $event)"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    `
}
