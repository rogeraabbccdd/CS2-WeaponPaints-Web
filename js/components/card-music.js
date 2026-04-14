import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'

export default {
  props: {
    music: Object,
    active: Boolean,
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const session = useSessionStore()

    const onOverlayUpdate = (value) => {
      emit('update:active', value)
    }

    return {
      TEAM_T,
      TEAM_CT,
      session,
      onOverlayUpdate
    }
  },
  template: /*html*/
    `
    <v-card border flat :ripple="false" class="cursor-pointer" @click="$emit('update:active', !active)">
      <div class="card-accent-line" :style="{ background: music.rarity.color }"></div>
      <!-- Buttons Overlay -->
      <v-overlay 
        :model-value="active"
        @update:model-value="onOverlayUpdate"
        contained
        class="align-center justify-center"
        content-class="w-100 h-100 d-flex align-center pa-10 backdrop-blur"
      >
        <div class="d-flex flex-column ga-2 w-100 px-4">
          <v-btn variant="outlined" block color="orange" @click="session.setMusic(music.id, TEAM_T)">T</v-btn>
          <v-btn variant="outlined" block color="light-blue" @click="session.setMusic(music.id, TEAM_CT)">CT</v-btn>
        </div>
      </v-overlay>
      <!-- Image -->
      <v-img :src="music.image" aspect-ratio="1.33" cover>
        <!-- Selected -->
        <div class="position-absolute right-0 pa-1">
          <v-icon size="30" color="orange" v-if="session.loadout.selected_music[TEAM_T] == music.id">mdi-check-circle</v-icon>
          <v-icon size="30" color="light-blue" v-if="session.loadout.selected_music[TEAM_CT] == music.id">mdi-check-circle</v-icon>
        </div>
      </v-img>
      <!-- Text -->
      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">{{ music.name }}</v-card-text>
    </v-card>
    `
}