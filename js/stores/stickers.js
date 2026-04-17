import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'
import { RARITY_STICKER } from '../const/rarity.js'

export const useStickersStore = defineStore('stickers', () => {
  const { locale } = useI18n()
  const stickers = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api/?action=get-stickers&lang=${locale.value}`)
      stickers.value = data.map(sticker => {
        // Data cleaning
        sticker.name = sticker.name.replace('Sticker | ', '')
        sticker.id = sticker.id.replace('sticker-', '')
        
        // Performance: Pre-calculate sorting weight
        sticker.rarityWeight = RARITY_STICKER[sticker.rarity?.id] || 0
        
        return sticker
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    stickers,
    loading,
    loaded,
    fetchData
  }
})