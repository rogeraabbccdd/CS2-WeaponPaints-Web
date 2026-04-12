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
  }
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