import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { useSkinsStore } from '../stores/skins.js'
import { DEFINDEXES } from '../const/weapons.js'

export default {
  setup () {
    const session = useSessionStore()
    const skins = useSkinsStore()

    const glovesSearchInput = ref('')

    const glovesFiltered = computed(() => {
      if (skins.loading)  return []
      const search = glovesSearchInput.value.toUpperCase()
      return skins.gloves
        .filter(glove => {
          return glove.name.toUpperCase().includes(search)
        })
    })

    onMounted(async () => {
      await skins.fetchData()
    })

    return {
      TEAM_T,
      TEAM_CT,
      DEFINDEXES,
      session,
      glovesSearchInput,
      glovesFiltered,
    }
  },
  template: /*html*/
    `
    <v-container>
      <v-text-field label="Search" v-model="glovesSearchInput"></v-text-field>
      <v-row>
        <v-col cols="6" md="3" lg="2">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setGlove(0, 0, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setGlove(0, 0, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img src="./images/default.svg">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_glove[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_glove[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>Default</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="glove in glovesFiltered" :key="glove.paint_index">
          <v-card @click="">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setGlove(DEFINDEXES[glove.weapon.id], glove.paint_index, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setGlove(DEFINDEXES[glove.weapon.id], glove.paint_index, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img :src="glove.image">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon 
                  size="30" color="orange"
                  v-if="session.loadout.selected_glove[TEAM_T] == glove.weapon.weapon_id && session.loadout.selected_skins[glove.weapon.weapon_id][TEAM_T].weapon_paint_id == glove.paint_index"
                >
                  mdi-check-circle-outline
                </v-icon>
                <v-icon 
                  size="30" color="light-blue"
                  v-if="session.loadout.selected_glove[TEAM_CT] == glove.weapon.weapon_id && session.loadout.selected_skins[glove.weapon.weapon_id][TEAM_CT].weapon_paint_id == glove.paint_index"
                >
                  mdi-check-circle-outline
                </v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>{{ glove.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    `
}