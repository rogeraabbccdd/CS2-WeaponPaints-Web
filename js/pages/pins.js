import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T, TEAM_NAME } from '../const/teams.js'
import { usePinsStore } from '../stores/pins.js'

export default {
  setup () {
    const session = useSessionStore()
    const pins = usePinsStore()

    const pinsSearchInput = ref('')

    const pinsFiltered = computed(() => {
      if (pins.loading)  return []
      const search = pinsSearchInput.value.toUpperCase()
      return pins.pins
        .filter(pin => pin.name.toUpperCase().includes(search))
    })

    onMounted(async () => {
      await pins.fetchData()
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      pins,
      pinsSearchInput,
      pinsFiltered
    }
  },
  template: /*html*/
    `
    <v-container>
      <v-text-field label="Search" v-model="pinsSearchInput"></v-text-field>
      <v-row>
        <v-col cols="6" md="3" lg="2">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setPin(0, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setPin(0, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img src="./images/default.svg">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_pin[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_pin[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>Default</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="pin in pinsFiltered" :key="pin.id">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setPin(pin.id, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setPin(pin.id, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img :src="pin.image">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_pin[TEAM_T] == pin.id">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_pin[TEAM_CT] == pin.id">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>{{ pin.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    `
}