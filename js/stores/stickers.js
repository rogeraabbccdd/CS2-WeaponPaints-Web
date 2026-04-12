import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

export const useStickersStore = defineStore('stickers', () => {
  const stickers = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-stickers&lang=en`)
      stickers.value = data.map(sticker => {
        sticker.name = sticker.name.replace('Sticker | ', '')
        sticker.id = sticker.id.replace('sticker-', '')
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