import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

export const useKeychainsStore = defineStore('keychains', () => {
  const keychains = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-keychains&lang=en`)
      keychains.value = data.map(keychain => {
        keychain.name = keychain.name.replace('Charm | ', '')
        keychain.id = keychain.id.replace('keychain-', '')
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