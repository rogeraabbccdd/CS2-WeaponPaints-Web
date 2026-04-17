import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'

export const useMusicsStore = defineStore('musics', () => {
  const { locale } = useI18n()
  const musics = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api/?action=get-musics&lang=${locale.value}`)
      musics.value = data
        .filter(music => !music.id.endsWith('_st'))
        .map(music => {
          // Data cleaning
          music.name = music.name.replace('Music Kit | ', '').trim()
          music.id = music.id.replace('music_kit-', '')
          return music
        })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    musics,
    loading,
    loaded,
    fetchData
  }
})