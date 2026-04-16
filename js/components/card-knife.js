import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'

export default {
  props: {
    knife: Object,
    active: Boolean,
    color: String
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const session = useSessionStore()

    const isSelected = computed(() => ({
      t: session.loadout.selected_knife[TEAM_T] == props.knife.weapon_name,
      ct: session.loadout.selected_knife[TEAM_CT] == props.knife.weapon_name
    }))

    const onOverlayUpdate = (value) => {
      emit('update:active', value)
    }

    return {
      TEAM_T,
      TEAM_CT,
      t,
      session,
      isSelected,
      onOverlayUpdate
    }
  },
  template: /*html*/
    `
    <v-card border flat :ripple="false" class="cursor-pointer" @click="$emit('update:active', !active)">
      <div class="card-accent-line" :style="{ background: color }"></div>
      <!-- Buttons Overlay -->
      <v-overlay 
        :model-value="active"
        @update:model-value="onOverlayUpdate"
        contained
        class="align-center justify-center"
        content-class="w-100 h-100 d-flex align-center pa-10 backdrop-blur"
      >
        <div class="d-flex flex-column ga-2 w-100 px-4">
          <v-btn 
            :variant="isSelected.t ? 'flat' : 'outlined'" 
            block color="orange" 
            @click="session.setKnife(knife.weapon_name, TEAM_T)"
          >
            {{ t('team.t') }}
          </v-btn>
          <v-btn 
            :variant="isSelected.ct ? 'flat' : 'outlined'" 
            block color="light-blue"
            @click="session.setKnife(knife.weapon_name, TEAM_CT)"
          >
            {{ t('team.ct') }}
          </v-btn>
        </div>
      </v-overlay>
      <!-- Image -->
      <v-img :src="knife.image" aspect-ratio="1.33" cover>
        <!-- Selected -->
        <div class="position-absolute right-0 pa-1">
          <v-icon size="30" color="orange" v-if="isSelected.t">mdi-check-circle</v-icon>
          <v-icon size="30" color="light-blue" v-if="isSelected.ct">mdi-check-circle</v-icon>
        </div>
      </v-img>
      <!-- Text -->
      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">{{ knife.translatedName }}</v-card-text>
    </v-card>
    `
}
