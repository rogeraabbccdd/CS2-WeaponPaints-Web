import { createApp, ref, onMounted, watch, useTemplateRef, nextTick } from 'vue'
import { createVuetify, useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import store from './stores/index.js'
import i18n from './locales/index.js'
import { languages } from './locales/index.js'
import { useSessionStore } from './stores/session.js'
import { useAgentsStore } from './stores/agents.js'
import { useKeychainsStore } from './stores/keychains.js'
import { useMusicsStore } from './stores/musics.js'
import { usePinsStore } from './stores/pins.js'
import { useSkinsStore } from './stores/skins.js'
import { useStickersStore } from './stores/stickers.js'
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
    const drawer = ref(false)
    const loading = ref(false)

    const { mobile } = useDisplay()
    const { locale, t } = useI18n()
    const session = useSessionStore()

    const agents = useAgentsStore()
    const keychains = useKeychainsStore()
    const musics = useMusicsStore()
    const pins = usePinsStore()
    const skins = useSkinsStore()
    const stickers = useStickersStore()

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

    const setLanguage = (lang) => {
      // Change Locale
      locale.value = lang
      localStorage.setItem('lang', lang)

      // Clear stores to trigger reload
      if (session.loggedIn) {
        agents.loaded = false
        keychains.loaded = false
        musics.loaded = false
        pins.loaded = false
        skins.loaded = false
        stickers.loaded = false
      }
    }

    return {
      drawer,
      loading,
      mobile,
      locale,
      setLanguage,
      t,
      session,
      page,
      languages
    }
  },
  template: /*html*/
    `
    <v-app>
      <v-app-bar flat>
        <v-container class="d-flex align-center justify-center" fluid>
          <!-- Title -->
          <div class="d-flex align-center" style="flex: 1 1 0;">
            <v-app-bar-nav-icon v-if="mobile" color="primary" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar-title class="text-primary font-header font-weight-bold">{{ t('nav.title') }}</v-app-bar-title>
          </div>
          <!-- Desktop Pages Tab -->
          <div v-if="!mobile && session.loggedIn" class="d-flex justify-center" style="flex: 2 1 0;">
            <v-tabs v-model="page" color="primary" grow class="font-header font-weight-bold" slider-transition="grow">
              <v-tab value="knives">{{ t('nav.knives') }}</v-tab>
              <v-tab value="skins">{{ t('nav.skins') }}</v-tab>
              <v-tab value="gloves">{{ t('nav.gloves') }}</v-tab>
              <v-tab value="agents">{{ t('nav.agents') }}</v-tab>
              <v-tab value="musics">{{ t('nav.musics') }}</v-tab>
              <v-tab value="pins">{{ t('nav.pins') }}</v-tab>
            </v-tabs>
          </div>
          <!-- Desktop Nav -->
          <div class="d-flex align-center justify-end ga-1" style="flex: 1 1 0;">
            <!-- Language Menu -->
            <v-menu v-if="!mobile">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-translate" variant="text" v-bind="props" size="small" class="mr-2"></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item v-for="lang in languages" :key="lang.value" :value="lang.value" :active="locale === lang.value" @click="setLanguage(lang.value)">
                  <v-list-item-title>{{ lang.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- User Menu -->
            <template v-if="session.loggedIn">
              <span v-if="!mobile" class="mr-2 font-header text-caption">{{ session.user.steam_personaname }}</span>
              <v-avatar size="32">
                <v-img :src="session.user.steam_avatar"></v-img>
              </v-avatar>
              <v-btn v-if="!mobile" icon="mdi-logout" variant="text" href="./logout.php"></v-btn>
            </template>
          </div>
        </v-container>
      </v-app-bar>
      <!-- Mobile Nav -->
      <v-navigation-drawer v-if="mobile" v-model="drawer" class="font-header" temporary>
        <!-- Mobile Pages -->
        <v-list v-if="session.loggedIn" color="primary" density="compact" nav :selected="[page]" @update:selected="val => { if (val.length) { page = val[0]; drawer = false } }">
          <v-list-item prepend-icon="mdi-knife-military" :title="t('nav.knives')" value="knives"></v-list-item>
          <v-list-item prepend-icon="mdi-palette" :title="t('nav.skins')" value="skins"></v-list-item>
          <v-list-item prepend-icon="mdi-boxing-glove" :title="t('nav.gloves')" value="gloves"></v-list-item>
          <v-list-item prepend-icon="mdi-account" :title="t('nav.agents')" value="agents"></v-list-item>
          <v-list-item prepend-icon="mdi-music" :title="t('nav.musics')" value="musics"></v-list-item>
          <v-list-item prepend-icon="mdi-police-badge" :title="t('nav.pins')" value="pins"></v-list-item>
        </v-list>
        <v-divider v-if="session.loggedIn"></v-divider>
        <!-- Mobile Language Menu -->
        <v-list density="compact" nav>
          <v-list-group value="languages">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-translate" :title="t('nav.lang') || 'Language'"></v-list-item>
            </template>
            <v-list-item v-for="lang in languages" :key="lang.value" :title="lang.title" :active="locale === lang.value" @click="setLanguage(lang.value)"></v-list-item>
          </v-list-group>
          <v-list-item v-if="session.loggedIn" prepend-icon="mdi-logout" :title="t('nav.logout')" href="./logout.php"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="w-100">
        <!-- Loading User Session -->
        <div v-if="loading" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
          <v-progress-circular color="primary" :size="75" width="7" indeterminate class="mb-4"></v-progress-circular>
          <h1 class="text-h5 font-header">{{ t('loading.text') }}</h1>
        </div>
        <!-- Login -->
        <div v-else-if="session.loaded && !session.loggedIn" class="fill-height d-flex flex-column align-center justify-center" style="min-height: 80vh;">
          <h1 class="text-h4 mb-6 font-header">{{ t('login.prompt') }}</h1>
          <a href="./login.php">
            <v-img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="200"></v-img>
          </a>
        </div>
        <!-- Pages -->
        <div v-else-if="session.loaded && session.loggedIn">
          <page-knives v-if="page === 'knives'" :key="locale"></page-knives>
          <page-skins v-if="page === 'skins'" :key="locale"></page-skins>
          <page-gloves v-if="page === 'gloves'" :key="locale"></page-gloves>
          <page-agents v-if="page === 'agents'" :key="locale"></page-agents>
          <page-musics v-if="page === 'musics'" :key="locale"></page-musics>
          <page-pins v-if="page === 'pins'" :key="locale"></page-pins>
        </div>
      </v-main>
    </v-app>
    `
})
app.use(i18n)
app.use(vuetify)
app.component('page-knives', pageKnives)
app.component('page-skins', pageSkins)
app.component('page-gloves', pageGloves)
app.component('page-agents', pageAgents)
app.component('page-musics', pageMusics)
app.component('page-pins', pagePins)
app.use(store)
app.mount('#app')
