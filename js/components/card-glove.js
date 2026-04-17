import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T } from '../const/teams.js'
import { DEFINDEXES } from '../const/weapons.js'

export default {
  props: {
    glove: Object,
    active: Boolean,
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const session = useSessionStore()

    const onOverlayUpdate = (value) => {
      emit('update:active', value)
    }

    const setGlove = (team) => {
      const defindex = props.glove.weapon ? DEFINDEXES[props.glove.weapon.id] : 0
      const paintIndex = props.glove.paint_index || 0
      session.setGlove(defindex, paintIndex, team)
    }

    const checkSelected = (team) => {
      if (!props.glove.weapon) {
        return session.loadout.selected_glove[team] == 0
      }
      const weaponId = props.glove.weapon.weapon_id
      return session.loadout.selected_glove[team] == weaponId && 
             session.loadout.selected_skins[weaponId] &&
             session.loadout.selected_skins[weaponId][team].weapon_paint_id == props.glove.paint_index
    }

    const isSelected = computed(() => ({
      t: checkSelected(TEAM_T),
      ct: checkSelected(TEAM_CT)
    }))

    return {
      TEAM_T,
      TEAM_CT,
      t,
      session,
      onOverlayUpdate,
      setGlove,
      isSelected
    }
  },
  template: /*html*/
    `
    <v-card border flat :ripple="false" class="cursor-pointer" @click="$emit('update:active', !active)">
      <div class="card-accent-line" :style="{ background: glove.rarity.color }"></div>
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
            @click="setGlove(TEAM_T)"
          >
            {{ t('team.t') }}
          </v-btn>
          <v-btn
            :variant="isSelected.ct ? 'flat' : 'outlined'"
            block color="light-blue"
            @click="setGlove(TEAM_CT)"
          >
            {{ t('team.ct') }}
          </v-btn>
        </div>
      </v-overlay>
      <!-- Image -->
      <v-img :src="glove.image" aspect-ratio="1.33" cover>
        <!-- Selected -->
        <div class="position-absolute right-0 pa-1">
          <v-icon size="30" color="orange" v-if="isSelected.t">mdi-check-circle</v-icon>
          <v-icon size="30" color="light-blue" v-if="isSelected.ct">mdi-check-circle</v-icon>
        </div>
      </v-img>
      <!-- Text -->
      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">{{ glove.name }}</v-card-text>
    </v-card>
    `
}