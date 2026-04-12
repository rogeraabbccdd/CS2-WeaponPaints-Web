import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-agents&lang=en`)
      agents.value = data.map(agent => {
        agent.model_player = agent.model_player.replace('characters/models/', '').replace('.vmdl', '')
        return agent
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    agents,
    loading,
    loaded,
    fetchData
  }
})