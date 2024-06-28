axios.defaults.withCredentials = true

const { createApp, ref, onMounted, computed, watch } = Vue
const { createVuetify, useDisplay } = Vuetify

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  }
})

const app = createApp({
  setup () {
    const loaded = ref(false)
    const { mobile } = useDisplay()

    // Tab
    const page = ref(['skins'])
    const tabAgentsTeam = ref(2)

    // Weapon Modal
    const modalSkin = ref({
      open: false,
      weapon_defindex: '',
      weapon_name: '',
      img: '',
      form: {
        paint: 0,
        wear: 0.001,
        seed: 0
      }
    })
    const modalSkinWearsLabel = {
      0.00: 'Factory New',
      0.07: 'Minimal Wear',
      0.15: 'Field-Tested',
      0.38: 'Well-Worn',
      0.45: 'Battle-Scarred'
    }
    const modalSkinImage = computed(() => {
      if (modalSkin.value.form.paint != 0) {
        return skins.value.find(skin => skin.paint == modalSkin.value.form.paint).image
      } else {
        return skins.value.find(skin => skin.weapon_defindex == modalSkin.value.weapon_defindex && skin.paint == '0').image
      }
    })
    const validateWear = () => {
      const value = parseFloat(modalSkin.value.form.wear)
      if (isNaN(value) || value < 0 || value > 1 || modalSkin.value.form.paint == '0') modalSkin.value.form.wear = 0
    }
    const validateSeed = () => {
      const value = parseFloat(modalSkin.value.form.seed)
      if (isNaN(value) | value > 1000 || value < 0 || modalSkin.value.form.paint == '0') modalSkin.value.form.seed = 0
      else modalSkin.value.form.seed = Math.round(value)
    }
    const openModalSkin = async (i) => {
      const defIndex = weaponsFiltered.value[i].weapon_defindex
      modalSkin.value.weapon_defindex = weaponsFiltered.value[i].weapon_defindex
      modalSkin.value.weapon_name = weaponsFiltered.value[i].name
      modalSkin.value.form.paint = session.value.selected_skins?.[defIndex]?.weapon_paint_id.toString() || "0"
      modalSkin.value.form.wear = session.value.selected_skins?.[defIndex]?.weapon_wear || 0.001
      modalSkin.value.form.seed = session.value.selected_skins?.[defIndex]?.weapon_seed || 0
      modalSkin.value.open = true
    }
    const closeModalSkin = () => {
      modalSkin.value.open = false
    }

    // Session
    const session = ref({
      steamid: '',
      steam_avatar: '',
      steam_personaname: '',
      selected_skins: {},
      selected_knife: 'weapon_knife',
      selected_music: -2,
      selected_glove: -2,
      selected_agents: {
        t: '',
        ct: ''
      }
    })

    // Item Data
    const skinsPaints = ref([])
    const skins = ref([])
    const gloves = ref([])
    const musics = ref([])
    const agents = ref([])
    const knifeSearchInput = ref('')
    const weaponSearchInput = ref('')
    const glovesSearchInput = ref('')
    const musicsSearchInput = ref('')
    const agentsSearchInput = ref('')
    const weapons = computed(() => {
      return skins.value
        .filter(skin => skin.paint_name.includes('| Default'))
        .map(weapon => {
          weapon.name = weapon.paint_name.replace('★', '').replace('| Default', '').trim()
          return weapon
        })
    })
    const knifes = computed(() => {
      return weapons.value
        .filter(weapon => weapon.paint_name.includes('★'))
    })
    const weaponsFiltered = computed(() => {
      return weapons.value.filter(weapon => weapon.name.toUpperCase().includes(weaponSearchInput.value.toUpperCase()))
    })
    const knifesFiltered = computed(() => {
      return knifes.value.filter(knife => knife.name.toUpperCase().includes(knifeSearchInput.value.toUpperCase()))
    })
    const glovesFiltered = computed(() => {
      return gloves.value
        .filter(glove => glove.paint_name.toUpperCase().includes(glovesSearchInput.value.toUpperCase()) && glove.paint != "0")
        .map(glove => {
          glove.name = glove.paint_name.replace('★', '').trim()
          return glove
        })
    })
    const musicsFiltered = computed(() => {
      return musics.value
        .filter(music => 
          music.name.toUpperCase().includes(musicsSearchInput.value.toUpperCase())
        )
        .map(music => {
          music.name = music.name.replace('Music Kit | ', '').trim()
          return music
        })
    })
    const agentsFiltered = computed(() => {
      return agents.value
        .filter(agent => 
          agent.agent_name.toUpperCase().includes(agentsSearchInput.value.toUpperCase()) &&
          agent.team == tabAgentsTeam.value && agent.model != "null"
        )
    })

    // Item Actions
    const setMusic = async (music_id) => {
      try {
        await axios.post('./api/?action=set-music', { music_id })
        session.value.selected_music = music_id
      } catch (error) {
        console.log(error)
      }
    }
    const setKnife = async (knife) => {
      try {
        await axios.post('./api/?action=set-knife', { knife })
        session.value.selected_knife = knife
      } catch (error) {
        console.log(error)
      }
    }
    const setAgent = async (model) => {
      try {
        await axios.post('./api/?action=set-agent', { model, team: tabAgentsTeam.value })
        const newValue = model == 'null' ? '' : model
        if (tabAgentsTeam.value === 2) {
          session.value.selected_agents.t = newValue
        } else if (tabAgentsTeam.value === 3) {
          session.value.selected_agents.ct = newValue
        }
      } catch (error) {
        console.log(error)
      }
    }
    const setGlove = async (defIndex, paint) => {
      try {
        await axios.post('./api/?action=set-glove', { defIndex, paint })
        session.value.selected_glove = paint
      } catch (error) {
        console.log(error)
      }
    }
    const setSkin = async () => {
      try {
        await axios.post('./api/?action=set-skin', {
          defIndex: modalSkin.value.weapon_defindex,
          paint: modalSkin.value.form.paint,
          wear: modalSkin.value.form.wear,
          seed: modalSkin.value.form.seed
        })
        session.value.selected_skins[modalSkin.value.weapon_defindex] = {
          weapon_paint_id: modalSkin.value.form.paint,
          weapon_seed: modalSkin.value.form.seed,
          weapon_wear: modalSkin.value.form.wear,
        }
        closeModalSkin()
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(async () => {
      const check = axios.get('./api?action=check')
      const getSkins = axios.get('./data/skins.json')
      const getGloves = axios.get('./data/gloves.json')
      const getMusics = axios.get('./data/music.json')
      const getAgents = axios.get('./data/agents.json')

      const results = await Promise.allSettled([check, getSkins, getGloves, getMusics, getAgents])
      if (results[0].status == 'fulfilled') {
        session.value.steamid = results[0].value.data.steamid
        session.value.steam_avatar = results[0].value.data.steam_avatar
        session.value.steam_personaname = results[0].value.data.steam_personaname
        session.value.selected_skins = results[0].value.data.selected_skins
        session.value.selected_knife = results[0].value.data.selected_knife
        session.value.selected_music = results[0].value.data.selected_music
        session.value.selected_glove = results[0].value.data.selected_glove
        session.value.selected_agents.t = results[0].value.data.selected_agents.t
        session.value.selected_agents.ct = results[0].value.data.selected_agents.ct
      }
      skins.value = results[1].status === 'fulfilled' ? results[1].value.data : []
      gloves.value = results[2].status === 'fulfilled' ? results[2].value.data : []
      musics.value = results[3].status === 'fulfilled' ? results[3].value.data : []
      agents.value = results[4].status === 'fulfilled' ? results[4].value.data : []

      skinsPaints.value = skins.value.filter(skin => {
        return skin.paint != '0'
      })
      skinsPaints.value.unshift({
        weapon_defindex: -1,
        weapon_name: '',
        paint: "0",
        image: "",
        paint_name: "Default"
      })

      const query = new URLSearchParams(document.location.search).get('page')
      if (['knifes', 'glove', 'skins', 'agents', 'musics', 'gloves'].includes(query)) {
        page.value[0] = query
      }

      loaded.value = true
    })

    watch(() => page.value[0], () => {
      const url = new URL(location);
      url.searchParams.set("page", page.value[0]);
      history.pushState({}, "", url);
    })

    return {
      loaded,
      mobile,
      page,
      modalSkin,
      modalSkinWearsLabel,
      modalSkinImage,
      validateSeed,
      validateWear,
      openModalSkin,
      closeModalSkin,
      tabAgentsTeam,
      session,
      knifeSearchInput,
      weaponSearchInput,
      glovesSearchInput,
      musicsSearchInput,
      agentsSearchInput,
      skinsPaints,
      weapons,
      knifes,
      weaponsFiltered,
      knifesFiltered,
      glovesFiltered,
      musicsFiltered,
      agentsFiltered,
      setMusic,
      setKnife,
      setAgent,
      setGlove,
      setSkin
    }
  }
})
app.use(vuetify)
app.mount('#app')