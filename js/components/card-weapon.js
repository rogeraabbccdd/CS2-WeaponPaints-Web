import { useI18n } from 'vue-i18n'

export default {
  props: {
    weapon: Object
  },
  emits: ['click'],
  setup () {
    const { t } = useI18n()
    return {
      t
    }
  },
  template: /*html*/
    `
    <v-card border flat :ripple="false" class="cursor-pointer" @click="$emit('click')">
      <div class="card-accent-line" style="background: #424242"></div>
      <!-- Image -->
      <v-img :src="weapon.image" aspect-ratio="1.33" cover></v-img>
      <!-- Text -->
      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">{{ weapon.translatedName }}</v-card-text>
    </v-card>
    `
}