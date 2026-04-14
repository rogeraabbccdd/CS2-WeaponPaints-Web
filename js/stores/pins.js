import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'
import { RARITY_PIN } from '../const/rarity.js'

export const usePinsStore = defineStore('pins', () => {
  const pins = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-pins&lang=en`)
      pins.value = data
        .filter(pin => !['Operation Pass', 'Tournament Pass'].includes(pin.type))
        .map(pin => {
          pin.id = pin.id.replace('collectible-', '')
          
          // Performance: Pre-calculate sorting weight
          pin.rarityWeight = RARITY_PIN[pin.rarity?.id] || 0
          
          return pin
        })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    pins,
    loading,
    loaded,
    fetchData
  }
})