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
    defaultTheme: 'custom',
    themes: {
      custom: {
        dark: true,
        colors: {
          primary: '#00E5FF',
        },
        variables: {
          'overlay-opacity': 0.8,
          'font-body': 'Inter',
          'font-header': 'Space Grotesk'
        }
      }
    }
  }
})

const app = createApp({
  setup () {
    const lang = ref('en')
    const drawer = ref(false)
    const loading = ref(false)

    const { mobile } = useDisplay()

    const session = useSessionStore()

    // Pages
    const page = ref('skins')

    onMounted(async () => {
      loading.value = true

      const query = new URLSearchParams(document.location.search).get('page')
      if (['knives', 'skins', 'agents', 'musics', 'gloves', 'pins'].includes(query)) {
        page.value = query
      }

      await session.checkUser()

      loading.value = false
    })

    watch(page, (newVal) => {
      const url = new URL(location);
      url.searchParams.set("page", newVal);
      history.pushState({}, "", url);
    })

    return {
      lang,
      drawer,
      loading,
      mobile,
      session,
      page,
    }
  },
  template: /*html*/
    `
    <v-app>
      <!-- Navbar -->
      <v-app-bar flat v-if="session.loggedIn">
        <v-container class="d-flex align-center justify-center" fluid>
          <!-- Title -->
          <div class="d-flex align-center" style="flex: 1 1 0;">
            <v-app-bar-nav-icon v-if="mobile" color="primary" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar-title class="text-primary font-header font-weight-bold">CS2 Weapon Paints</v-app-bar-title>
          </div>
          <!-- Desktop Pages Tab -->
          <div v-if="!mobile" class="d-flex justify-center" style="flex: 2 1 0;">
            <v-tabs v-model="page" color="primary" grow class="font-header font-weight-bold" slider-transition="grow">
              <v-tab value="knives">Knives</v-tab>
              <v-tab value="skins">Skins</v-tab>
              <v-tab value="gloves">Gloves</v-tab>
              <v-tab value="agents">Agents</v-tab>
              <v-tab value="musics">Musics</v-tab>
              <v-tab value="pins">Pins</v-tab>
            </v-tabs>
          </div>
          <!-- Desktop Nav -->
          <div class="d-flex align-center justify-end ga-1" style="flex: 1 1 0;">
            <template v-if="session.loggedIn">
              <span v-if="!mobile" class="mr-2 font-header text-caption">{{ session.user.steam_personaname }}</span>
              <v-avatar size="32">
                <v-img :src="session.user.steam_avatar"></v-img>
              </v-avatar>
              <!-- Desktop Logout Button -->
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text" size="small"></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item href="./logout.php" prepend-icon="mdi-logout">
                    <v-list-item-title>Logout</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </div>
        </v-container>
      </v-app-bar>
      <!-- Mobile Nav -->
      <v-navigation-drawer v-if="mobile && session.loggedIn" v-model="drawer" class="font-header" temporary>
        <v-list color="primary" density="compact" nav :selected="[page]" @update:selected="val => { if (val.length) { page = val[0]; drawer = false } }">
          <v-list-item prepend-icon="mdi-knife-military" title="Knives" value="knives"></v-list-item>
          <v-list-item prepend-icon="mdi-palette" title="Skins" value="skins"></v-list-item>
          <v-list-item prepend-icon="mdi-boxing-glove" title="Gloves" value="gloves"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="Agents" value="agents"></v-list-item>
          <v-list-item prepend-icon="mdi-music" title="Musics" value="musics"></v-list-item>
          <v-list-item prepend-icon="mdi-police-badge" title="Pins" value="pins"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-logout" title="Logout" href="./logout.php"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="w-100">
        <!-- Loading State -->
        <div v-if="loading" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
          <v-progress-circular color="primary" :size="75" width="7" indeterminate class="mb-4"></v-progress-circular>
          <h1 class="text-h5 font-header">Loading...</h1>
        </div>

        <!-- Login State -->
        <div v-else-if="session.loaded && !session.loggedIn" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
          <h1 class="text-h4 mb-6 font-header">Please login first.</h1>
          <a href="./login.php">
            <v-img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="200"></v-img>
          </a>
        </div>

        <!-- Main Content -->
        <div v-else-if="session.loaded && session.loggedIn">
          <!-- knives Page -->
          <page-knives v-if="page === 'knives'"></page-knives>
          <!-- Skins Page -->
          <page-skins v-if="page === 'skins'"></page-skins>
          <!-- Gloves Page -->
          <page-gloves v-if="page === 'gloves'"></page-gloves>
          <!-- Agents Page -->
          <page-agents v-if="page === 'agents'"></page-agents>
          <!-- Music Kits Page -->
          <page-musics v-if="page === 'musics'"></page-musics>
          <!-- Pins Page -->
          <page-pins v-if="page === 'pins'"></page-pins>
        </div>
      </v-main>
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
