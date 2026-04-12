import { createApp, ref, onMounted, computed, watch } from 'vue'
import { createVuetify, useDisplay } from 'vuetify'
import store from './stores/index.js'
import { useSessionStore } from './stores/session.js'
import pageKnives from './pages/knives.js'
import pageSkins from './pages/skins.js'
import pageGloves from './pages/gloves.js'
import pageAgents from './pages/agents.js'
import pageMusics from './pages/musics.js'
import pagePins from './pages/pins.js'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  }
})

const app = createApp({
  setup () {
    const lang = ref('en')
    const loaded = ref(false)
    const { mobile } = useDisplay()

    const session = useSessionStore()

    // Pages
    const page = ref(['skins'])

    onMounted(async () => {
      const query = new URLSearchParams(document.location.search).get('page')
      if (['knifes', 'glove', 'skins', 'agents', 'musics', 'gloves', 'pins'].includes(query)) {
        page.value[0] = query
      }

      await session.checkUser()

      loaded.value = true
    })

    watch(() => page.value[0], () => {
      const url = new URL(location);
      url.searchParams.set("page", page.value[0]);
      history.pushState({}, "", url);
    })

    return {
      lang,
      loaded,
      mobile,
      session,
      page
    }
  },
  template: /*html*/
    `
    <v-app>
      <!-- Navbar -->
      <v-app-bar color="primary">
        <v-container class="d-flex align-center">
          <v-app-bar-title>CS2 Weapon Paints</v-app-bar-title>
          <v-spacer></v-spacer>
          <template v-if="session.user.steamid">
            <v-avatar>
              <v-img :src="session.user.steam_avatar"></v-img>
            </v-avatar>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item href="./logout.php">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-else>
            <a href="./login.php"><img src='https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png'></a>
          </template>
        </v-container>
      </v-app-bar>
      <!-- Sidebar -->
      <v-navigation-drawer v-if="session.user.steamid.length !== 0">
        <v-list density="compact" nav v-model:selected="page">
          <v-list-item prepend-icon="mdi-knife-military" title="Knifes" value="knifes"></v-list-item>
          <v-list-item prepend-icon="mdi-palette" title="Skins" value="skins"></v-list-item>
          <v-list-item prepend-icon="mdi-boxing-glove" title="Gloves" value="gloves"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Agents" value="agents"></v-list-item>
          <v-list-item prepend-icon="mdi-music" title="Musics" value="musics"></v-list-item>
          <v-list-item prepend-icon="mdi-police-badge" title="Pins" value="pins"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="mt-5" v-if="!loaded">
        <h1 class="text-center">
          <v-progress-circular color="primary" :size="75" indeterminate class="my-5"></v-progress-circular>
          <br>
          Loading...
        </h1>
      </v-main>
      <v-main class="mt-5" v-else-if="session.user.steamid.length === 0">
        <h1 class="text-center">Please login first.</h1>
      </v-main>
      <template v-else>
        <v-main class="mt-5">
          <!-- Knifes Page -->
          <page-knives v-if="page[0] === 'knifes'"></page-knives>
          <!-- Skins Page -->
          <page-skins v-if="page[0] === 'skins'"></page-skins>
          <!-- Gloves Page -->
          <page-gloves v-if="page[0] === 'gloves'"></page-gloves>
          <!-- Agents Page -->
          <page-agents v-if="page[0] === 'agents'"></page-agents>
          <!-- Music Kits Page -->
          <page-musics v-if="page[0] === 'musics'"></page-musics>
          <!-- Pins Page -->
          <page-pins v-if="page[0] === 'pins'"></page-pins>
        </v-main>
        <v-bottom-navigation v-if="mobile" :model-value="page[0]" @update:model-value="v => page[0] = v">
          <v-btn value="knifes">
            <v-icon>mdi-knife-military</v-icon>
            <span>Knifes</span>
          </v-btn>
          <v-btn value="skins">
            <v-icon>mdi-palette</v-icon>
            <span>Skins</span>
          </v-btn>
          <v-btn value="gloves">
            <v-icon>mdi-boxing-glove</v-icon>
            <span>Gloves</span>
          </v-btn>
          <v-btn value="agents">
            <v-icon>mdi-account</v-icon>
            <span>Agents</span>
          </v-btn>
          <v-btn value="musics">
            <v-icon>mdi-music</v-icon>
            <span>Musics</span>
          </v-btn>
          <v-btn value="pins">
            <v-icon>mdi-police-badge</v-icon>
            <span>Pins</span>
          </v-btn>
        </v-bottom-navigation>
      </template>
    </v-app>
    `
})
app.use(vuetify)
app.component('page-knives', pageKnives)
app.component('page-skins', pageSkins)
app.component('page-gloves', pageGloves)
app.component('page-agents', pageAgents)
app.component('page-musics', pageMusics)
app.component('page-pins', pagePins)
app.use(store)
app.mount('#app')