import { ref, computed } from 'vue'
import { KNIVES } from '../const/weapons.js'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import CardKnife from '../components/card-knife.js'

export default {
  components: { CardKnife },
  setup () {
    const session = useSessionStore()

    const searchInput = ref('')
    const activeKnife = ref(null)
    const sortOrder = ref('asc')

    const sortOptions = [
      { title: 'Name (A-Z)', value: 'asc' },
      { title: 'Name (Z-A)', value: 'desc' }
    ]

    // Prepare items for v-data-iterator
    const items = computed(() => {
      const defaultItem = {
        name: 'Default',
        image: './images/default.svg',
        weapon_name: 'weapon_knife',
        isDefault: true,
        rarityColor: '#424242'
      };

      const baseKnives = KNIVES.map(k => ({
        ...k,
        isDefault: false,
        rarityColor: '#eb4b4b'
      }));

      return [defaultItem, ...baseKnives];
    });

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

    const onActiveKnifeUpdate = (weapon_name, value) => {
      activeKnife.value = value ? weapon_name : null
    }

    return {
      TEAM_T,
      TEAM_CT,
      session,
      searchInput,
      items,
      sortBy,
      customFilter,
      activeKnife,
      onActiveKnifeUpdate,
      sortOrder,
      sortOptions,
    }
  },
  template: /*html*/
    `
    <v-container fluid>
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
                label="Search Knives..." 
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
            <v-col cols="12" sm="6" md="4" lg="2" v-for="item in displayedItems" :key="item.raw.weapon_name">
              <CardKnife
                :knife="item.raw"
                :color="item.raw.rarityColor"
                :active="activeKnife === item.raw.weapon_name"
                @update:active="onActiveKnifeUpdate(item.raw.weapon_name, $event)"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    `
}
