import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'
import { RARITY_AGENT } from '../const/rarity.js'

export const useAgentsStore = defineStore('agents', () => {
  const { locale } = useI18n()
  const agentsT = ref([])
  const agentsCT = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const fetchData = async () => {
    if (loading.value || loaded.value)  return
    loading.value = true
    try {
      const { data } = await api.get(`./api/?action=get-agents&lang=${locale.value}`)
      const tempT = []
      const tempCT = []
      for (const agent of data) {
        // Data sanitization
        agent.model_player = agent.model_player.replace('characters/models/', '').replace('.vmdl', '')
        // Performance: Pre-calculate sorting weight
        agent.rarityWeight = RARITY_AGENT[agent.rarity?.id] || 0

        if (agent.team.id === 'terrorists') tempT.push(agent)
        else if (agent.team.id === 'counter-terrorists') tempCT.push(agent)

        agentsT.value = tempT
        agentsCT.value = tempCT
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