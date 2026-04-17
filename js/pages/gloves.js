import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { useSkinsStore } from '../stores/skins.js'
import CardGlove from '../components/card-glove.js'

export default {
  components: { CardGlove },
  setup () {
    const { t } = useI18n()
    const session = useSessionStore()
    const skins = useSkinsStore()

    const loading = ref(true)

    const searchInput = ref('')
    const activeGlove = ref(null)
    const sortOrder = ref('asc')
    const categoryFilter = ref(null)

    const sortOptions = computed(() => [
      { title: t('page.gloves.sort.asc'), value: 'asc' },
      { title: t('page.gloves.sort.desc'), value: 'desc' }
    ])

    const categoryOptions = computed(() => [
      { title: t('page.gloves.category.all'), value: null },
      { title: t('page.gloves.category.bloodhound'), value: 'studded_bloodhound_gloves' },
      { title: t('page.gloves.category.brokenfang'), value: 'studded_brokenfang_gloves' },
      { title: t('page.gloves.category.driver'), value: 'slick_gloves' },
      { title: t('page.gloves.category.handwraps'), value: 'leather_handwraps' },
      { title: t('page.gloves.category.hydra'), value: 'studded_hydra_gloves' },
      { title: t('page.gloves.category.moto'), value: 'motorcycle_gloves' },
      { title: t('page.gloves.category.specialist'), value: 'specialist_gloves' },
      { title: t('page.gloves.category.sport'), value: 'sporty_gloves' }
    ])

    // Prepare items for v-data-iterator with category filtering
    const items = computed(() => {
      const defaultGlove = {
        name: t('page.gloves.default'),
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
      t
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
                :label="t('page.gloves.search.label')" 
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
                :label="t('page.gloves.category.label')"
                variant="outlined"
                hide-details
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="sortOrder"
                :items="sortOptions"
                :label="t('page.gloves.sort.label')"
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
