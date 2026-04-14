import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../utils/api.js'
import { RARITY_AGENT } from '../const/rarity.js'

export const useAgentsStore = defineStore('agents', () => {
  const agentsT = ref([])
  const agentsCT = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api?action=get-agents&lang=en`)
      for (const agent of data) {
        // Data sanitization
        agent.model_player = agent.model_player.replace('characters/models/', '').replace('.vmdl', '')
        // Performance: Pre-calculate sorting weight
        agent.rarityWeight = RARITY_AGENT[agent.rarity?.id] || 0

        if (agent.team.id === 'terrorists') agentsT.value.push(agent)
        else if (agent.team.id === 'counter-terrorists') agentsCT.value.push(agent)
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return {
    agentsT,
    agentsCT,
    loading,
    loaded,
    fetchData
  }
})