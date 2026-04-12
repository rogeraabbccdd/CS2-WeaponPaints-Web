import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

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
        .filter(pin => pin.type != "Pass")
        .map(pin => {
          pin.id.replace('collectible-', '')
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