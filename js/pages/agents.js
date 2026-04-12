import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '../stores/session.js'
import { TEAM_CT, TEAM_T, TEAM_NAME } from '../const/teams.js'
import { useAgentsStore } from '../stores/agents.js'

export default {
  setup () {
    const session = useSessionStore()
    const agents = useAgentsStore()

    const tabAgentsTeam = ref(TEAM_T)
    const agentsSearchInput = ref('')

    const agentsFiltered = computed(() => {
      if (agents.loading)  return []
      const search = agentsSearchInput.value.toUpperCase()
      return agents.agents
        .filter(agent => 
          agent.name.toUpperCase().includes(search) &&
          agent.team.id == TEAM_NAME[tabAgentsTeam.value] && agent.model != "null"
        )
    })

    onMounted(async () => {
      await agents.fetchData()
    })

    return {
      TEAM_T,
      TEAM_CT,
      session,
      agents,
      tabAgentsTeam,
      agentsSearchInput,
      agentsFiltered
    }
  },
  template: /*html*/
    `
    <v-container>
      <v-tabs v-model="tabAgentsTeam" fixed-tabs class="mb-5" :color="tabAgentsTeam == TEAM_T ? 'orange' : 'light-blue'">
        <v-tab :value="TEAM_T">
          T
        </v-tab>
        <v-tab :value="TEAM_CT">
          CT
        </v-tab>
      </v-tabs>
      <v-text-field label="Search" v-model="agentsSearchInput"></v-text-field>
      <v-row>
        <v-col cols="6" md="3" lg="2">
          <v-card @click="session.setAgent('null', tabAgentsTeam)">
            <v-img src="./images/default.svg">
              <v-overlay :model-value="tabAgentsTeam == TEAM_T ? session.loadout.selected_agents[TEAM_T] == '' : session.loadout.selected_agents[TEAM_CT] == ''" contained class="align-center justify-center">
                <v-icon size="128" color="green">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>Default</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6" md="3" lg="2" v-for="agent in agentsFiltered" :key="agent.agent_name">
          <v-card @click="session.setAgent(agent.model_player, tabAgentsTeam)">
            <v-img :src="agent.image">
              <v-overlay :model-value="tabAgentsTeam == TEAM_T ? session.loadout.selected_agents[TEAM_T] == agent.model_player : session.loadout.selected_agents[TEAM_CT] == agent.model_player" contained class="align-center justify-center">
                <v-icon size="128" color="green">mdi-check-circle-outline</v-icon>
              </v-overlay>
            </v-img>
            <v-card-title>{{ agent.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    `
}