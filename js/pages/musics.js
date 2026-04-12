import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T, TEAM_NAME } from '../const/teams.js'
import { useMusicsStore } from '../stores/musics.js'

export default {
  setup () {
    const session = useSessionStore()
    const musics = useMusicsStore()

    const musicsSearchInput = ref('')

    const musicsFiltered = computed(() => {
      if (musics.loading)  return []
      const search = musicsSearchInput.value.toUpperCase()
      return musics.musics
        .filter(music => 
          music.name.toUpperCase().includes(search) &&
          !music.id.endsWith('_st')
        )
    })

    onMounted(async () => {
      await musics.fetchData()
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      musics,
      musicsSearchInput,
      musicsFiltered
    }
  },
  template: /*html*/
    `
    <v-container>
      <v-text-field label="Search" v-model="musicsSearchInput"></v-text-field>
      <v-row>
        <v-col cols="6" md="3" lg="2">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setMusic(0, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setMusic(0, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img src="./images/default.svg">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_music[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_music[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>Default</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="music in musicsFiltered" :key="music.id">
          <v-card class="cursor-pointer">
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="session.setMusic(music.id, TEAM_T)">T</v-list-item>
                <v-list-item @click="session.setMusic(music.id, TEAM_CT)">CT</v-list-item>
              </v-list>
            </v-menu>
            <v-img :src="music.image">
              <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                <v-icon size="30" color="orange" v-if="session.loadout.selected_music[TEAM_T] == music.id">mdi-check-circle-outline</v-icon>
                <v-icon size="30" color="light-blue" v-if="session.loadout.selected_music[TEAM_CT] == music.id">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>{{ music.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    `
}