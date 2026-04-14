import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

export const useMusicsStore = defineStore('musics', () => {
  const musics = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-musics&lang=en`)
      musics.value = data
        .filter(music => !music.id.endsWith('_st'))
        .map(music => {
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