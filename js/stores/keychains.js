import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'
import { RARITY_KEYCHAIN } from '../const/rarity.js'

export const useKeychainsStore = defineStore('keychains', () => {
  const { locale } = useI18n()
  const keychains = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api/?action=get-keychains&lang=${locale.value}`)
      keychains.value = data.map(keychain => {
        // Data cleaning
        keychain.name = keychain.name.replace('Charm | ', '')
        keychain.id = keychain.id.replace('keychain-', '')

        // Pre-calculate common metadata for performance
        keychain.rarityWeight = RARITY_KEYCHAIN[keychain.rarity?.id] || 0
        
        return keychain
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    keychains,
    loading,
    loaded,
    fetchData
  }
})