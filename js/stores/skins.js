import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'
import { RARITY_SKIN } from '../const/rarity.js'

export const useSkinsStore = defineStore('skins', () => {
  const { locale } = useI18n()
  const skins = ref([])
  const gloves = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api/?action=get-skins&lang=${locale.value}`)
      const tempSkins = []
      const tempGloves = []
      
      for (const skin of data) {
        // Pre-calculate common metadata for performance
        skin.rarityWeight = RARITY_SKIN[skin.rarity?.id] || 0
        
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