import { ref, computed } from 'vue'
import { KNIVES } from '../const/weapons.js'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'

export default {
  setup () {
    const session = useSessionStore()

    const knifeSearchInput = ref('')

    const KNIVESFiltered = computed(() => {
      const search = knifeSearchInput.value.toUpperCase()
      return KNIVES.filter(knife => knife.name.toUpperCase().includes(search))
    })

    return {
      TEAM_T,
      TEAM_CT,
      KNIVES,
      session,
      knifeSearchInput,
      KNIVESFiltered,
    }
  },
  template: /*html*/
    `
    <v-container>
      <v-text-field label="Search" v-model="knifeSearchInput"></v-text-field>
      <v-row>
        <v-col cols="6" md="3" lg="2">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setKnife('weapon_knife', TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setKnife('weapon_knife', TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img src="./images/default.svg">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_knife[TEAM_T] == 'weapon_knife'">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_knife[TEAM_CT] == 'weapon_knife'">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>Default</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="knife in KNIVESFiltered" :key="knife.weapon_name">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setKnife(knife.weapon_name, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setKnife(knife.weapon_name, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img :src="knife.image">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_knife[TEAM_T] == knife.weapon_name">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_knife[TEAM_CT] == knife.weapon_name">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>{{ knife.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    `
}