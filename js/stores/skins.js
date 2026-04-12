import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

export const useSkinsStore = defineStore('skins', () => {
  const skins = ref([])
  const gloves = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-skins&lang=en`)
      const tempSkins = []
      const tempGloves = []
      for (const skin of data) {
        if (skin.category.id === 'sfui_invpanel_filter_gloves') {
          if (skin.paint_index != "0") {
            skin.name = skin.name.replace('★', '').trim()
            tempGloves.push(skin)
          }
        } else {
          tempSkins.push(skin)
        }
      }
      skins.value = tempSkins
      gloves.value = tempGloves
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    skins,
    gloves,
    loading,
    loaded,
    fetchData
  }
})