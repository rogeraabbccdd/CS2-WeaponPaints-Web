import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.js'

export default {
  props: {
    agent: Object,
    active: Boolean,
    team: Number
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const session = useSessionStore()

    const onOverlayUpdate = (value) => {
      emit('update:active', value)
    }

    const isSelected = computed(() => {
      const selected = session.loadout.selected_agents[props.team]
      const model = props.agent.model_player === null ? '' : props.agent.model_player
      return selected === model
    })

    return {
      t,
      session,
      onOverlayUpdate,
      isSelected,
    }
  },
  template: /*html*/
    `
    <v-card border flat :ripple="false" class="cursor-pointer" @click="$emit('update:active', !active)">
      <div class="card-accent-line" :style="{ background: agent.rarity ? agent.rarity.color : '#424242' }"></div>
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
            :variant="isSelected ? 'flat' : 'outlined'"
            block color="green"
            @click="session.setAgent(agent.model_player, team)"
          >
            {{ t('page.agents.equip') }}
          </v-btn>
        </div>
      </v-overlay>
      <!-- Image -->
      <v-img :src="agent.image" aspect-ratio="1.33" cover>
        <!-- Selected -->
        <div class="position-absolute right-0 pa-1">
          <v-icon size="30" :color="team == 2 ? 'orange' : 'light-blue'" v-if="isSelected">mdi-check-circle</v-icon>
        </div>
      </v-img>
      <!-- Text -->
      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">{{ agent.name }}</v-card-text>
    </v-card>
    `
}