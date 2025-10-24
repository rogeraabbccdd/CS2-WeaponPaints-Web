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
    // Consts
    const TEAM_T = 2
    const TEAM_CT = 3
    const TEAM_DEFAULT = 0
    const TEAM_NAME = {
      [TEAM_T]: 'terrorists',
      [TEAM_CT]: 'counter-terrorists'
    }

    const lang = ref('en')

    const loaded = ref(false)
    const { mobile } = useDisplay()

    // Tab
    const page = ref(['skins'])
    const tabAgentsTeam = ref(TEAM_T)
    const tabSkinsTeam = ref(TEAM_T)

    // Weapon Modal
    const modalSkin = ref({
      open: false,
      weapon_defindex: '',
      weapon_name: '',
      isKnife: false,
      skin: {
        [TEAM_T]: {
          name: '',
          image: '',
          color: ''
        },
        [TEAM_CT]: {
          name: '',
          image: '',
          color: ''
        }
      },
      search: {
        page: 1,
        pages: 1,
        input: '',
        all: false,
        itemsPerPage: 24,
        results: []
      },
      form: {
        [TEAM_T]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: '',
          stattrack: 0,
          stickers0: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers1: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers2: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers3: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers4: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          keychain: {
            id: 0,
            seed: 0,
            image: ''
          }
        },
        [TEAM_CT]: {
          paint: 0,
          wear: 0.001,
          seed: 0,
          name: '',
          stattrack: 0,
          stickers0: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers1: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers2: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers3: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          stickers4: {
            id: 0,
            wear: 0.001,
            image: '',
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          },
          keychain: {
            id: 0,
            seed: 0,
            image: ''
          }
        }
      }
    })

    const validateWear = (type) => {
      if (type == 'skin') {
        console.log(123)
        const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].wear)
        console.log(value)
        if (isNaN(value) || value <= 0.001 || value > 1 || modalSkin.value.form[tabSkinsTeam.value].paint == '0') modalSkin.value.form[tabSkinsTeam.value].wear = 0.001
      } else if (type == 'sticker') {
        const value = parseFloat(modalSticker.value.form.wear)
        if (isNaN(value) || value <= 0.001 || value > 1 || modalSticker.value.form.paint == '0') modalSticker.value.form.wear = 0.001
      }
    }
    const validateSeed = (type) => {
      if (type == 'skin') {
        const value = parseFloat(modalSkin.value.form[tabSkinsTeam.value].seed)
        if (isNaN(value) | value > 1000 || value < 0 || modalSkin.value.form[tabSkinsTeam.value].paint == '0') modalSkin.value.form[tabSkinsTeam.value].seed = 0
        else modalSkin.value.form[tabSkinsTeam.value].seed = Math.round(value)
      } else if (type == 'keychain') {
        const value = parseFloat(modalKeychain.value.form.seed)
        if (isNaN(value) | value > 1000 || value < 0 || modalKeychain.value.form.paint == '0') modalKeychain.value.form.seed = 0
        else modalKeychain.value.form.seed = Math.round(value)
      }
    }
    const openModalSkin = async (i) => {
      const defIndex = weaponsFiltered.value[i].weapon_defindex
      modalSkin.value.weapon_defindex = weaponsFiltered.value[i].weapon_defindex
      modalSkin.value.weapon_name = weaponsFiltered.value[i].name

      modalSkin.value.isKnife = weaponsFiltered.value[i].name.includes('Knife') ||weaponsFiltered.value[i].name.includes('Bayonet') || weaponsFiltered.value[i].name.includes('Karambit')

      // Form values: T
      modalSkin.value.form[TEAM_T].paint = parseInt(session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_paint_id || '0')
      modalSkin.value.form[TEAM_T].wear = session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_wear || 0.001
      modalSkin.value.form[TEAM_T].seed = session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_seed || 0
      modalSkin.value.form[TEAM_T].stattrack = session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_stattrak || 0
      modalSkin.value.form[TEAM_T].name = session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_nametag || ''

      // id;schema;x;y;wear;scale;rotation
      const stickerT0 = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_0 || '0;0;0;0;0;0;0').split(';')
      const stickerT1 = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_1 || '0;0;0;0;0;0;0').split(';')
      const stickerT2 = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_2 || '0;0;0;0;0;0;0').split(';')
      const stickerT3 = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_3 || '0;0;0;0;0;0;0').split(';')
      const stickerT4 = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_sticker_4 || '0;0;0;0;0;0;0').split(';')

      modalSkin.value.form[TEAM_T].stickers0.id = stickerT0[0]
      modalSkin.value.form[TEAM_T].stickers0.image = stickerT0[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerT0[0])?.image
      modalSkin.value.form[TEAM_T].stickers0.x = stickerT0[2] || 0
      modalSkin.value.form[TEAM_T].stickers0.y = stickerT0[3] || 0
      modalSkin.value.form[TEAM_T].stickers0.wear = stickerT0[4] || 0.001
      modalSkin.value.form[TEAM_T].stickers0.scale = stickerT0[5] || 1
      modalSkin.value.form[TEAM_T].stickers0.rotate = stickerT0[6] || 0

      modalSkin.value.form[TEAM_T].stickers1.id = stickerT1[0]
      modalSkin.value.form[TEAM_T].stickers1.image = stickerT1[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerT1[0])?.image
      modalSkin.value.form[TEAM_T].stickers1.x = stickerT1[2] || 0
      modalSkin.value.form[TEAM_T].stickers1.y = stickerT1[3] || 0
      modalSkin.value.form[TEAM_T].stickers1.wear = stickerT1[4] || 0.001
      modalSkin.value.form[TEAM_T].stickers1.scale = stickerT1[5] || 1
      modalSkin.value.form[TEAM_T].stickers1.rotate = stickerT1[6] || 0

      modalSkin.value.form[TEAM_T].stickers2.id = stickerT2[0]
      modalSkin.value.form[TEAM_T].stickers2.image = stickerT2[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerT2[0])?.image
      modalSkin.value.form[TEAM_T].stickers2.x = stickerT2[2] || 0
      modalSkin.value.form[TEAM_T].stickers2.y = stickerT2[3] || 0
      modalSkin.value.form[TEAM_T].stickers2.wear = stickerT2[4] || 0.001
      modalSkin.value.form[TEAM_T].stickers2.scale = stickerT2[5] || 1
      modalSkin.value.form[TEAM_T].stickers2.rotate = stickerT2[6] || 0

      modalSkin.value.form[TEAM_T].stickers3.id = stickerT3[0]
      modalSkin.value.form[TEAM_T].stickers3.image = stickerT3[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerT3[0])?.image
      modalSkin.value.form[TEAM_T].stickers3.x = stickerT3[2] || 0
      modalSkin.value.form[TEAM_T].stickers3.y = stickerT3[3] || 0
      modalSkin.value.form[TEAM_T].stickers3.wear = stickerT3[4] || 0.001
      modalSkin.value.form[TEAM_T].stickers3.scale = stickerT3[5] || 1
      modalSkin.value.form[TEAM_T].stickers3.rotate = stickerT3[6] || 0

      modalSkin.value.form[TEAM_T].stickers4.id = stickerT4[0]
      modalSkin.value.form[TEAM_T].stickers4.image = stickerT4[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerT4[0])?.image
      modalSkin.value.form[TEAM_T].stickers4.x = stickerT4[2] || 0
      modalSkin.value.form[TEAM_T].stickers4.y = stickerT4[3] || 0
      modalSkin.value.form[TEAM_T].stickers4.wear = stickerT4[4] || 0.001
      modalSkin.value.form[TEAM_T].stickers4.scale = stickerT4[5] || 1
      modalSkin.value.form[TEAM_T].stickers4.rotate = stickerT4[6] || 0
      
      const keychainT = (session.value.selected_skins?.[defIndex]?.[TEAM_T]?.weapon_keychain || '0;0;0;0;0').split(';')
      modalSkin.value.form[TEAM_T].keychain.id = keychainT[0] || 0
      modalSkin.value.form[TEAM_T].keychain.seed = keychainT[4] || 0
      modalSkin.value.form[TEAM_T].keychain.image = keychainT[0] == '0' ? '' : keychains.value.find(k => k.id == keychainT[0]).image

      if (modalSkin.value.form[TEAM_T].paint != 0) {
        const result = skins.value.find(skin => skin.paint_index == modalSkin.value.form[TEAM_T].paint)
        modalSkin.value.skin[TEAM_T].image = result.image
        modalSkin.value.skin[TEAM_T].name = result.name
        modalSkin.value.skin[TEAM_T].color = result.rarity.color
      } else {
        const weapon = weapons.find(weapon => weapon.weapon_defindex == modalSkin.value.weapon_defindex)
        modalSkin.value.skin[TEAM_T].image = weapon.image
        modalSkin.value.skin[TEAM_T].name = 'Default'
        modalSkin.value.skin[TEAM_T].color = '#000'
      }

      // Form values: CT
      modalSkin.value.form[TEAM_CT].paint = parseInt(session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_paint_id || '0')
      modalSkin.value.form[TEAM_CT].wear = session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_wear || 0.001
      modalSkin.value.form[TEAM_CT].seed = session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_seed || 0
      modalSkin.value.form[TEAM_CT].stattrack = session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_stattrak || 0
      modalSkin.value.form[TEAM_CT].name = session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_nametag || ''

      // id;schema;x;y;wear;scale;rotation
      const stickerCT0 = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_0 || '0;0;0;0;0;0;0').split(';')
      const stickerCT1 = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_1 || '0;0;0;0;0;0;0').split(';')
      const stickerCT2 = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_2 || '0;0;0;0;0;0;0').split(';')
      const stickerCT3 = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_3 || '0;0;0;0;0;0;0').split(';')
      const stickerCT4 = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_sticker_4 || '0;0;0;0;0;0;0').split(';')

      modalSkin.value.form[TEAM_CT].stickers0.id = stickerCT0[0]
      modalSkin.value.form[TEAM_CT].stickers0.image = stickerCT0[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerCT0[0])?.image
      modalSkin.value.form[TEAM_CT].stickers0.x = stickerCT0[2] || 0
      modalSkin.value.form[TEAM_CT].stickers0.y = stickerCT0[3] || 0
      modalSkin.value.form[TEAM_CT].stickers0.wear = stickerCT0[4] || 0.001
      modalSkin.value.form[TEAM_CT].stickers0.scale = stickerCT0[5] || 1
      modalSkin.value.form[TEAM_CT].stickers0.rotate = stickerCT0[6] || 0

      modalSkin.value.form[TEAM_CT].stickers1.id = stickerCT1[0]
      modalSkin.value.form[TEAM_CT].stickers1.image = stickerCT1[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerCT1[0])?.image
      modalSkin.value.form[TEAM_CT].stickers1.x = stickerCT1[2] || 0
      modalSkin.value.form[TEAM_CT].stickers1.y = stickerCT1[3] || 0
      modalSkin.value.form[TEAM_CT].stickers1.wear = stickerCT1[4] || 0.001
      modalSkin.value.form[TEAM_CT].stickers1.scale = stickerCT1[5] || 1
      modalSkin.value.form[TEAM_CT].stickers1.rotate = stickerCT1[6] || 0

      modalSkin.value.form[TEAM_CT].stickers2.id = stickerCT2[0]
      modalSkin.value.form[TEAM_CT].stickers2.image = stickerCT2[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerCT2[0])?.image
      modalSkin.value.form[TEAM_CT].stickers2.x = stickerCT2[2] || 0
      modalSkin.value.form[TEAM_CT].stickers2.y = stickerCT2[3] || 0
      modalSkin.value.form[TEAM_CT].stickers2.wear = stickerCT2[4] || 0.001
      modalSkin.value.form[TEAM_CT].stickers2.scale = stickerCT2[5] || 1
      modalSkin.value.form[TEAM_CT].stickers2.rotate = stickerCT2[6] || 0

      modalSkin.value.form[TEAM_CT].stickers3.id = stickerCT3[0]
      modalSkin.value.form[TEAM_CT].stickers3.image = stickerCT3[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerCT3[0])?.image
      modalSkin.value.form[TEAM_CT].stickers3.x = stickerCT3[2] || 0
      modalSkin.value.form[TEAM_CT].stickers3.y = stickerCT3[3] || 0
      modalSkin.value.form[TEAM_CT].stickers3.wear = stickerCT3[4] || 0.001
      modalSkin.value.form[TEAM_CT].stickers3.scale = stickerCT3[5] || 1
      modalSkin.value.form[TEAM_CT].stickers3.rotate = stickerCT3[6] || 0

      modalSkin.value.form[TEAM_CT].stickers4.id = stickerCT4[0]
      modalSkin.value.form[TEAM_CT].stickers4.image = stickerCT4[0] == '0' ? '' : stickers.value.find(sticker => sticker.id == stickerCT4[0])?.image
      modalSkin.value.form[TEAM_CT].stickers4.x = stickerCT4[2] || 0
      modalSkin.value.form[TEAM_CT].stickers4.y = stickerCT4[3] || 0
      modalSkin.value.form[TEAM_CT].stickers4.wear = stickerCT4[4] || 0.001
      modalSkin.value.form[TEAM_CT].stickers4.scale = stickerCT4[5] || 1
      modalSkin.value.form[TEAM_CT].stickers4.rotate = stickerCT4[6] || 0
      
      const keychain = (session.value.selected_skins?.[defIndex]?.[TEAM_CT]?.weapon_keychain || '0;0;0;0;0').split(';')
      modalSkin.value.form[TEAM_CT].keychain.id = keychain[0] || 0
      modalSkin.value.form[TEAM_CT].keychain.seed = keychain[4] || 0
      modalSkin.value.form[TEAM_CT].keychain.image = keychain[0] == '0' ? '' : keychains.value.find(k => k.id == keychain[0]).image

      if (modalSkin.value.form[TEAM_CT].paint != 0) {
        const result = skins.value.find(skin => skin.paint_index == modalSkin.value.form[TEAM_CT].paint)
        modalSkin.value.skin[TEAM_CT].image = result.image
        modalSkin.value.skin[TEAM_CT].name = result.name
        modalSkin.value.skin[TEAM_CT].color = result.rarity.color
      } else {
        const weapon = weapons.find(weapon => weapon.weapon_defindex == modalSkin.value.weapon_defindex)
        modalSkin.value.skin[TEAM_CT].image = weapon.image
        modalSkin.value.skin[TEAM_CT].name = 'Default'
        modalSkin.value.skin[TEAM_CT].color = '#000'
      }

      // Search form
      modalSkin.value.search.page = 1
      modalSkin.value.search.pages = 1
      modalSkin.value.search.results = []
      modalSkin.value.search.input = ''

      tabSkinsTeam.value = TEAM_T

      modalSkin.value.open = true

      onModalSkinSearch()
    }
    const closeModalSkin = () => {
      modalSkin.value.open = false
    }
    const onModalSkinSearch = () => {
      modalSkin.value.search.page = 1
      modalSkin.value.search.results = skins.value.filter(skin => {
        if (skin.weapon.weapon_id !== modalSkin.value.weapon_defindex && !modalSkin.value.search.all) return false
        else if (modalSkin.value.search.input === '') return true
        else return skin.name.toUpperCase().includes(modalSkin.value.search.input.toUpperCase())
      })
      const weapon = weapons.find(weapon => weapon.weapon_defindex == modalSkin.value.weapon_defindex)
      modalSkin.value.search.results.unshift({
        id: '-1',
        name: 'Default',
        weapon: {
          id: weapon.weapon_name,
          name: weapon.name
        },
        rarity: {
          color: '#000'
        },
        paint_index: '0',
        image: weapon.image
      })
      modalSkin.value.search.pages = Math.ceil(modalSkin.value.search.results.length / modalSkin.value.search.itemsPerPage);
    }
    const modalSkinSearchResultItems = computed(() => {
      const start = (modalSkin.value.search.page - 1) * modalSkin.value.search.itemsPerPage
      const end = start + modalSkin.value.search.itemsPerPage
      return modalSkin.value.search.results.slice(start, end)
    })
    const onModalSkinSelect = (skin) => {
      modalSkin.value.form[tabSkinsTeam.value].paint = skin.paint_index
      modalSkin.value.skin[tabSkinsTeam.value].image = skin.image
      modalSkin.value.skin[tabSkinsTeam.value].name = skin.name
      modalSkin.value.skin[tabSkinsTeam.value].color = skin.rarity.color
    }

    // Sticker
    const modalSticker = ref({
      open: false,
      slot: 0,
      search: {
        page: 1,
        pages: 1,
        input: '',
        itemsPerPage: 24,
        results: []
      },
      form: {
        wear: 0.001,
        id: 0,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
      },
      sticker: {
        image: '',
        name: '',
        color: '#000'
      }
    })
    const openModalSticker = (slot) => {
      modalSticker.value.slot = slot
      modalSticker.value.search.page = 1
      modalSticker.value.search.pages = 1
      modalSticker.value.search.input = ''
      modalSticker.value.search.results = []
      modalSticker.value.open = true
      modalSticker.value.form.id = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].id
      modalSticker.value.form.wear = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].wear
      modalSticker.value.form.x = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].x
      modalSticker.value.form.y = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].y
      modalSticker.value.form.scale = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].scale
      modalSticker.value.form.rotate = modalSkin.value.form[tabSkinsTeam.value]['stickers'+slot].rotate
      if (modalSticker.value.form.id != 0) {
        const result = stickers.value.find(sticker => sticker.id == modalSticker.value.form.id)
        modalSticker.value.sticker.image = result.image
        modalSticker.value.sticker.name = result.name
        modalSticker.value.sticker.color = result.rarity.color
      } else {
        modalSticker.value.sticker.image = 'https://placehold.co/256x198?text=No%20Sticker'
        modalSticker.value.sticker.name = 'No Sticker'
        modalSticker.value.sticker.color = '#000'
      }

      onModalStickerSearch()
    }
    const closeModalSticker = () => {
      modalSticker.value.open = false
    }
    const onModalStickerSearch = () => {
      modalSticker.value.search.page = 1
      modalSticker.value.search.results = stickers.value.filter(sticker => modalSticker.value.search.input === '' ? true : sticker.name.toUpperCase().includes(modalSticker.value.search.input.toUpperCase()))
      modalSticker.value.search.results.unshift({
        id: '0',
        name: 'No Sticker',
        image: 'https://placehold.co/256x198?text=No%20Sticker',
        rarity: {
          color: '#000'
        }
      })
      modalSticker.value.search.pages = Math.ceil(modalSticker.value.search.results.length / modalSticker.value.search.itemsPerPage);
    }
    const modalStickerSearchResultItems = computed(() => {
      const start = (modalSticker.value.search.page - 1) * modalSticker.value.search.itemsPerPage
      const end = start + modalSticker.value.search.itemsPerPage
      return modalSticker.value.search.results.slice(start, end)
    })
    const onModalStickerSelect = (sticker) => {
      modalSticker.value.form.id = sticker.id
      modalSticker.value.sticker.image = sticker.image
      modalSticker.value.sticker.name = sticker.name
      modalSticker.value.sticker.color = sticker.rarity.color
    }

    // Keychain
    const modalKeychain = ref({
      open: false,
      slot: 0,
      search: {
        page: 1,
        pages: 1,
        input: '',
        itemsPerPage: 24,
        results: []
      },
      form: {
        seed: 0.001,
        id: 0
      },
      keychain: {
        image: '',
        name: '',
        color: '#000'
      }
    })
    const openModalKeychain = () => {
      modalKeychain.value.search.page = 1
      modalKeychain.value.search.pages = 1
      modalKeychain.value.search.input = ''
      modalKeychain.value.search.results = []
      modalKeychain.value.open = true
      modalKeychain.value.form.id = modalSkin.value.form[tabSkinsTeam.value].keychain.id
      modalKeychain.value.form.seed = modalSkin.value.form[tabSkinsTeam.value].keychain.seed
      if (modalKeychain.value.form.id != 0) {
        const result = keychains.value.find(keychain => keychain.id == modalKeychain.value.form.id)
        modalKeychain.value.keychain.image = result.image
        modalKeychain.value.keychain.name = result.name
        modalKeychain.value.keychain.color = result.rarity.color
      } else {
        modalKeychain.value.keychain.image = 'https://placehold.co/256x198?text=No%20Keychain'
        modalKeychain.value.keychain.name = 'No Keychain'
        modalKeychain.value.keychain.color = '#000'
      }

      onModalKeychainSearch()
    }
    const closeModalKeychain = () => {
      modalKeychain.value.open = false
    }
    const onModalKeychainSearch = () => {
      modalKeychain.value.search.page = 1
      modalKeychain.value.search.results = keychains.value.filter(keychain => modalKeychain.value.search.input === '' ? true : keychain.name.toUpperCase().includes(modalKeychain.value.search.input.toUpperCase()))
      modalKeychain.value.search.results.unshift({
        id: '0',
        name: 'No Keychain',
        image: 'https://placehold.co/256x198?text=No%20Keychain',
        rarity: {
          color: '#000'
        }
      })
      modalKeychain.value.search.pages = Math.ceil(modalKeychain.value.search.results.length / modalKeychain.value.search.itemsPerPage);
    }
    const modalKeychainSearchResultItems = computed(() => {
      const start = (modalKeychain.value.search.page - 1) * modalKeychain.value.search.itemsPerPage
      const end = start + modalKeychain.value.search.itemsPerPage
      return modalKeychain.value.search.results.slice(start, end)
    })
    const onModalKeychainSelect = (keychain) => {
      modalKeychain.value.form.id = keychain.id
      modalKeychain.value.keychain.image = keychain.image
      modalKeychain.value.keychain.name = keychain.name
      modalKeychain.value.keychain.color = keychain.rarity.color
    }

    // Session
    const session = ref({
      steamid: '',
      steam_avatar: '',
      steam_personaname: '',
      selected_skins: {},
      selected_knife: {
        [TEAM_T]: 'weapon_knife',
        [TEAM_CT]: 'weapon_knife'
      },
      selected_music: {
        [TEAM_T]: 0,
        [TEAM_CT]: 0
      },
      selected_pin: {
        [TEAM_T]: 0,
        [TEAM_CT]: 0
      },
      selected_glove: {
        [TEAM_T]: 0,
        [TEAM_CT]: 0
      },
      selected_agents: {
        [TEAM_T]: '',
        [TEAM_CT]: ''
      }
    })

    // Item Data
    const knives = KNIVES
    const weapons = WEAPONS.concat(KNIVES)
    const defIndexes = DEFINDEXES
    const skins = ref([])
    const gloves = ref([])
    const musics = ref([])
    const agents = ref([])
    const stickers = ref([])
    const keychains = ref([])
    const pins = ref([])
    const knifeSearchInput = ref('')
    const weaponSearchInput = ref('')
    const glovesSearchInput = ref('')
    const musicsSearchInput = ref('')
    const pinsSearchInput = ref('')
    const agentsSearchInput = ref('')
    const weaponsFiltered = computed(() => {
      return weapons.filter(weapon => weapon.name.toUpperCase().includes(weaponSearchInput.value.toUpperCase()))
    })
    const knivesFiltered = computed(() => {
      return knives.filter(knife => knife.name.toUpperCase().includes(knifeSearchInput.value.toUpperCase()))
    })
    const glovesFiltered = computed(() => {
      return gloves.value
        .filter(glove => glove.name.toUpperCase().includes(glovesSearchInput.value.toUpperCase()) && glove.paint_index != "0")
        .map(glove => {
          glove.name = glove.name.replace('★', '').trim()
          return glove
        })
    })
    const musicsFiltered = computed(() => {
      return musics.value
        .filter(music => 
          music.name.toUpperCase().includes(musicsSearchInput.value.toUpperCase()) &&
          !music.id.endsWith('_st')
        )
        .map(music => {
          music.name = music.name.replace('Music Kit | ', '').trim()
          music.id = music.id.replace('music_kit-', '')
          return music
        })
    })
    const pinsFiltered = computed(() => {
      return pins.value
        .filter(pin => 
          pin.name.toUpperCase().includes(pinsSearchInput.value.toUpperCase()) &&
          pin.type != "Pass"
        )
        .map(pin => {
          pin.id = pin.id.replace('collectible-', '')
          return pin
        })
    })
    const agentsFiltered = computed(() => {
      return agents.value
        .filter(agent => 
          agent.name.toUpperCase().includes(agentsSearchInput.value.toUpperCase()) &&
          agent.team.id == TEAM_NAME[tabAgentsTeam.value] && agent.model != "null"
        )
    })

    // Item Actions
    const setMusic = async (music_id, team) => {
      try {
        await axios.post('./api/?action=set-music', { music_id, team })
        session.value.selected_music[team] = music_id
      } catch (error) {
        console.log(error)
      }
    }
    const setPin = async (pin_id, team) => {
      try {
        await axios.post('./api/?action=set-pin', { pin_id, team })
        session.value.selected_pin[team] = pin_id
      } catch (error) {
        console.log(error)
      }
    }
    const setKnife = async (knife, team) => {
      try {
        await axios.post('./api/?action=set-knife', { knife, team })
        session.value.selected_knife[team] = knife
      } catch (error) {
        console.log(error)
      }
    }
    const setAgent = async (model) => {
      try {
        const team = tabAgentsTeam.value
        await axios.post('./api/?action=set-agent', { model, team })
        const newValue = model == 'null' ? '' : model
        session.value.selected_agents[team] = newValue
      } catch (error) {
        console.log(error)
      }
    }
    const setGlove = async (defIndex, paint, team) => {
      try {
        await axios.post('./api/?action=set-glove', { defIndex, paint, team })
        session.value.selected_glove[team] = defIndex
        if (!session.value.selected_skins[defIndex]) {
          session.value.selected_skins[defIndex] = {}
        }
        if (!session.value.selected_skins[defIndex][team]) {
          session.value.selected_skins[defIndex][team] = {}
        }
        session.value.selected_skins[defIndex][team].weapon_paint_id = paint
      } catch (error) {
        console.log(error)
      }
    }
    const setSkin = async () => {
      try {
        await axios.post('./api/?action=set-skin', {
          [TEAM_T]: {
            defIndex: modalSkin.value.weapon_defindex,
            paint: modalSkin.value.form[TEAM_T].paint,
            wear: modalSkin.value.form[TEAM_T].wear,
            seed: modalSkin.value.form[TEAM_T].seed,
            nametag: modalSkin.value.form[TEAM_T].name,
            stattrack: modalSkin.value.form[TEAM_T].stattrack,
            // id;schema;x;y;wear;scale;rotation
            sticker0: `${modalSkin.value.form[TEAM_T].stickers0.id};0;${modalSkin.value.form[TEAM_T].stickers0.x};${modalSkin.value.form[TEAM_T].stickers0.y};${modalSkin.value.form[TEAM_T].stickers0.wear};${modalSkin.value.form[TEAM_T].stickers0.scale};${modalSkin.value.form[TEAM_T].stickers0.rotate}`,
            sticker1: `${modalSkin.value.form[TEAM_T].stickers1.id};0;${modalSkin.value.form[TEAM_T].stickers1.x};${modalSkin.value.form[TEAM_T].stickers1.y};${modalSkin.value.form[TEAM_T].stickers1.wear};${modalSkin.value.form[TEAM_T].stickers1.scale};${modalSkin.value.form[TEAM_T].stickers1.rotate}`,
            sticker2: `${modalSkin.value.form[TEAM_T].stickers2.id};0;${modalSkin.value.form[TEAM_T].stickers2.x};${modalSkin.value.form[TEAM_T].stickers2.y};${modalSkin.value.form[TEAM_T].stickers2.wear};${modalSkin.value.form[TEAM_T].stickers2.scale};${modalSkin.value.form[TEAM_T].stickers2.rotate}`,
            sticker3: `${modalSkin.value.form[TEAM_T].stickers3.id};0;${modalSkin.value.form[TEAM_T].stickers3.x};${modalSkin.value.form[TEAM_T].stickers3.y};${modalSkin.value.form[TEAM_T].stickers3.wear};${modalSkin.value.form[TEAM_T].stickers3.scale};${modalSkin.value.form[TEAM_T].stickers3.rotate}`,
            sticker4: `${modalSkin.value.form[TEAM_T].stickers4.id};0;${modalSkin.value.form[TEAM_T].stickers4.x};${modalSkin.value.form[TEAM_T].stickers4.y};${modalSkin.value.form[TEAM_T].stickers4.wear};${modalSkin.value.form[TEAM_T].stickers4.scale};${modalSkin.value.form[TEAM_T].stickers4.rotate}`,
            keychain: `${modalSkin.value.form[TEAM_T].keychain.id};0;0;0;${modalSkin.value.form[TEAM_T].keychain.seed}`,
          },
          [TEAM_CT]: {
            defIndex: modalSkin.value.weapon_defindex,
            paint: modalSkin.value.form[TEAM_CT].paint,
            wear: modalSkin.value.form[TEAM_CT].wear,
            seed: modalSkin.value.form[TEAM_CT].seed,
            nametag: modalSkin.value.form[TEAM_CT].name,
            stattrack: modalSkin.value.form[TEAM_CT].stattrack,
            // id;schema;x;y;wear;scale;rotation
            sticker0: `${modalSkin.value.form[TEAM_CT].stickers0.id};0;${modalSkin.value.form[TEAM_CT].stickers0.x};${modalSkin.value.form[TEAM_CT].stickers0.y};${modalSkin.value.form[TEAM_CT].stickers0.wear};${modalSkin.value.form[TEAM_CT].stickers0.scale};${modalSkin.value.form[TEAM_CT].stickers0.rotate}`,
            sticker1: `${modalSkin.value.form[TEAM_CT].stickers1.id};0;${modalSkin.value.form[TEAM_CT].stickers1.x};${modalSkin.value.form[TEAM_CT].stickers1.y};${modalSkin.value.form[TEAM_CT].stickers1.wear};${modalSkin.value.form[TEAM_CT].stickers1.scale};${modalSkin.value.form[TEAM_CT].stickers1.rotate}`,
            sticker2: `${modalSkin.value.form[TEAM_CT].stickers2.id};0;${modalSkin.value.form[TEAM_CT].stickers2.x};${modalSkin.value.form[TEAM_CT].stickers2.y};${modalSkin.value.form[TEAM_CT].stickers2.wear};${modalSkin.value.form[TEAM_CT].stickers2.scale};${modalSkin.value.form[TEAM_CT].stickers2.rotate}`,
            sticker3: `${modalSkin.value.form[TEAM_CT].stickers3.id};0;${modalSkin.value.form[TEAM_CT].stickers3.x};${modalSkin.value.form[TEAM_CT].stickers3.y};${modalSkin.value.form[TEAM_CT].stickers3.wear};${modalSkin.value.form[TEAM_CT].stickers3.scale};${modalSkin.value.form[TEAM_CT].stickers3.rotate}`,
            sticker4: `${modalSkin.value.form[TEAM_CT].stickers4.id};0;${modalSkin.value.form[TEAM_CT].stickers4.x};${modalSkin.value.form[TEAM_CT].stickers4.y};${modalSkin.value.form[TEAM_CT].stickers4.wear};${modalSkin.value.form[TEAM_CT].stickers4.scale};${modalSkin.value.form[TEAM_CT].stickers4.rotate}`,
            keychain: `${modalSkin.value.form[TEAM_CT].keychain.id};0;0;0;${modalSkin.value.form[TEAM_CT].keychain.seed}`,
          }
        })
        session.value.selected_skins[modalSkin.value.weapon_defindex] = {
          [TEAM_T]: {
            weapon_paint_id: modalSkin.value.form[TEAM_T].paint,
            weapon_seed: modalSkin.value.form[TEAM_T].seed,
            weapon_wear: modalSkin.value.form[TEAM_T].wear,
            weapon_nametag: modalSkin.value.form[TEAM_T].name,
            weapon_stattrak: modalSkin.value.form[TEAM_T].stattrack,
            // id;schema;x;y;wear;scale;rotation
            weapon_sticker_0: `${modalSkin.value.form[TEAM_T].stickers0.id};0;${modalSkin.value.form[TEAM_T].stickers0.x};${modalSkin.value.form[TEAM_T].stickers0.y};${modalSkin.value.form[TEAM_T].stickers0.wear};${modalSkin.value.form[TEAM_T].stickers0.scale};${modalSkin.value.form[TEAM_T].stickers0.rotate}`,
            weapon_sticker_1: `${modalSkin.value.form[TEAM_T].stickers1.id};0;${modalSkin.value.form[TEAM_T].stickers1.x};${modalSkin.value.form[TEAM_T].stickers1.y};${modalSkin.value.form[TEAM_T].stickers1.wear};${modalSkin.value.form[TEAM_T].stickers1.scale};${modalSkin.value.form[TEAM_T].stickers1.rotate}`,
            weapon_sticker_2: `${modalSkin.value.form[TEAM_T].stickers2.id};0;${modalSkin.value.form[TEAM_T].stickers2.x};${modalSkin.value.form[TEAM_T].stickers2.y};${modalSkin.value.form[TEAM_T].stickers2.wear};${modalSkin.value.form[TEAM_T].stickers2.scale};${modalSkin.value.form[TEAM_T].stickers2.rotate}`,
            weapon_sticker_3: `${modalSkin.value.form[TEAM_T].stickers3.id};0;${modalSkin.value.form[TEAM_T].stickers3.x};${modalSkin.value.form[TEAM_T].stickers3.y};${modalSkin.value.form[TEAM_T].stickers3.wear};${modalSkin.value.form[TEAM_T].stickers3.scale};${modalSkin.value.form[TEAM_T].stickers3.rotate}`,
            weapon_sticker_4: `${modalSkin.value.form[TEAM_T].stickers4.id};0;${modalSkin.value.form[TEAM_T].stickers4.x};${modalSkin.value.form[TEAM_T].stickers4.y};${modalSkin.value.form[TEAM_T].stickers4.wear};${modalSkin.value.form[TEAM_T].stickers4.scale};${modalSkin.value.form[TEAM_T].stickers4.rotate}`,
            weapon_keychain: `${modalSkin.value.form[TEAM_T].keychain.id};0;0;0;${modalSkin.value.form[TEAM_T].keychain.seed}`,
          },
          [TEAM_CT]: {
            weapon_paint_id: modalSkin.value.form[TEAM_CT].paint,
            weapon_seed: modalSkin.value.form[TEAM_CT].seed,
            weapon_wear: modalSkin.value.form[TEAM_CT].wear,
            weapon_nametag: modalSkin.value.form[TEAM_CT].name,
            weapon_stattrak: modalSkin.value.form[TEAM_CT].stattrack,
            // id;schema;x;y;wear;scale;rotation
            weapon_sticker_0: `${modalSkin.value.form[TEAM_CT].stickers0.id};0;${modalSkin.value.form[TEAM_CT].stickers0.x};${modalSkin.value.form[TEAM_CT].stickers0.y};${modalSkin.value.form[TEAM_CT].stickers0.wear};${modalSkin.value.form[TEAM_CT].stickers0.scale};${modalSkin.value.form[TEAM_CT].stickers0.rotate}`,
            weapon_sticker_1: `${modalSkin.value.form[TEAM_CT].stickers1.id};0;${modalSkin.value.form[TEAM_CT].stickers1.x};${modalSkin.value.form[TEAM_CT].stickers1.y};${modalSkin.value.form[TEAM_CT].stickers1.wear};${modalSkin.value.form[TEAM_CT].stickers1.scale};${modalSkin.value.form[TEAM_CT].stickers1.rotate}`,
            weapon_sticker_2: `${modalSkin.value.form[TEAM_CT].stickers2.id};0;${modalSkin.value.form[TEAM_CT].stickers2.x};${modalSkin.value.form[TEAM_CT].stickers2.y};${modalSkin.value.form[TEAM_CT].stickers2.wear};${modalSkin.value.form[TEAM_CT].stickers2.scale};${modalSkin.value.form[TEAM_CT].stickers2.rotate}`,
            weapon_sticker_3: `${modalSkin.value.form[TEAM_CT].stickers3.id};0;${modalSkin.value.form[TEAM_CT].stickers3.x};${modalSkin.value.form[TEAM_CT].stickers3.y};${modalSkin.value.form[TEAM_CT].stickers3.wear};${modalSkin.value.form[TEAM_CT].stickers3.scale};${modalSkin.value.form[TEAM_CT].stickers3.rotate}`,
            weapon_sticker_4: `${modalSkin.value.form[TEAM_CT].stickers4.id};0;${modalSkin.value.form[TEAM_CT].stickers4.x};${modalSkin.value.form[TEAM_CT].stickers4.y};${modalSkin.value.form[TEAM_CT].stickers4.wear};${modalSkin.value.form[TEAM_CT].stickers4.scale};${modalSkin.value.form[TEAM_CT].stickers4.rotate}`,
            weapon_keychain: `${modalSkin.value.form[TEAM_CT].keychain.id};0;0;0;${modalSkin.value.form[TEAM_CT].keychain.seed}`,
          }
        }
        closeModalSkin()
      } catch (error) {
        console.log(error)
      }
    }
    const setSticker = () => {
      modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].id = modalSticker.value.form.id
      if (modalSticker.value.form.id != 0) {
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].wear = modalSticker.value.form.wear
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].image = modalSticker.value.sticker.image
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].x = modalSticker.value.form.x
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].y = modalSticker.value.form.y
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].scale = modalSticker.value.form.scale
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].rotate = modalSticker.value.form.rotate
      } else {
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].wear = 0
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].image = ''
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].x = 0
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].y = 0
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].scale = 1
        modalSkin.value.form[tabSkinsTeam.value]['stickers'+modalSticker.value.slot].rotate = 0
      }
      closeModalSticker()
    }
    const setKeychain = () => {
      modalSkin.value.form[tabSkinsTeam.value].keychain.id = modalKeychain.value.form.id
      if (modalKeychain.value.form.id != 0) {
        modalSkin.value.form[tabSkinsTeam.value].keychain.seed = modalKeychain.value.form.seed
        modalSkin.value.form[tabSkinsTeam.value].keychain.image = modalKeychain.value.keychain.image
      } else {
        modalSkin.value.form[tabSkinsTeam.value].keychain.seed = 0
        modalSkin.value.form[tabSkinsTeam.value].keychain.image = ''
      }
      closeModalKeychain()
    }

    const fetchData = async () => {
      const getSkins = axios.get(`./api?action=get-skins&lang=${lang.value}`)
      const getMusics = axios.get(`./api?action=get-musics&lang=${lang.value}`)
      const getAgents = axios.get(`./api?action=get-agents&lang=${lang.value}`)
      const getStickers = axios.get(`./api?action=get-stickers&lang=${lang.value}`)
      const getKeyChains = axios.get(`./api?action=get-keychains&lang=${lang.value}`)
      const getPins = axios.get(`./api?action=get-pins&lang=${lang.value}`)

      try {
        const results = await Promise.allSettled([getSkins, getMusics, getAgents, getStickers, getKeyChains, getPins])
        const allSkins = results[0].status === 'fulfilled' ? results[0].value.data : []
        for (const skin of allSkins) {
          if (skin.category.id === 'sfui_invpanel_filter_gloves') {
            gloves.value.push(skin)
          } else {
            skins.value.push(skin)
          }
        }
        musics.value = results[1].status === 'fulfilled' ? results[1].value.data : []
        agents.value = results[2].status === 'fulfilled' ? results[2].value.data.map(agent => {
          agent.model_player = agent.model_player.replace('characters/models/', '').replace('.vmdl', '')
          return agent
        }) : []
        stickers.value = results[3].status === 'fulfilled' ? results[3].value.data.map(sticker => {
          sticker.name = sticker.name.replace('Sticker | ', '')
          sticker.id = sticker.id.replace('sticker-', '')
          return sticker
        }) : []
        keychains.value = results[4].status === 'fulfilled' ? results[4].value.data.map(keychain => {
          keychain.name = keychain.name.replace('Charm | ', '')
          keychain.id = keychain.id.replace('keychain-', '')
          return keychain
        }) : []
        pins.value = results[5].status === 'fulfilled' ? results[5].value.data : []
      } catch (error) {
        console.log(error)
      }
    }

    const checkUser = async () => {
      try {
        const { data } = await axios.get('./api?action=check')
        session.value.steamid = data.steamid
        session.value.steam_avatar = data.steam_avatar
        session.value.steam_personaname = data.steam_personaname
        for (const defIndex in data.selected_skins) {
          const skin = data.selected_skins[defIndex]
          session.value.selected_skins[defIndex] = {}
          session.value.selected_skins[defIndex][TEAM_T] = skin[TEAM_T] || skin[0]
          session.value.selected_skins[defIndex][TEAM_CT] = skin[TEAM_CT] || skin[0]
        }
        session.value.selected_knife[TEAM_T] = data.selected_knife[TEAM_T] || data.selected_knife[TEAM_DEFAULT] || "weapon_knife"
        session.value.selected_knife[TEAM_CT] = data.selected_knife[TEAM_CT] || data.selected_knife[TEAM_DEFAULT] || "weapon_knife"
        session.value.selected_music[TEAM_T] = data.selected_music[TEAM_T] || data.selected_music[TEAM_DEFAULT] || 0
        session.value.selected_music[TEAM_CT] = data.selected_music[TEAM_CT] || data.selected_music[TEAM_DEFAULT] || 0
        session.value.selected_glove[TEAM_T] = data.selected_glove[TEAM_T] || data.selected_glove[TEAM_DEFAULT] || 0
        session.value.selected_glove[TEAM_CT] = data.selected_glove[TEAM_CT] || data.selected_glove[TEAM_DEFAULT] || 0
        session.value.selected_agents[TEAM_T] = data.selected_agents[TEAM_T]
        session.value.selected_agents[TEAM_CT] = data.selected_agents[TEAM_CT]
        session.value.selected_pin[TEAM_T] = data.selected_pin[TEAM_T] || data.selected_pin[TEAM_DEFAULT] || 0
        session.value.selected_pin[TEAM_CT] = data.selected_pin[TEAM_CT] || data.selected_pin[TEAM_DEFAULT] || 0
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(async () => {
      const query = new URLSearchParams(document.location.search).get('page')
      if (['knifes', 'glove', 'skins', 'agents', 'musics', 'gloves', 'pins'].includes(query)) {
        page.value[0] = query
      }

      await checkUser()

      if (session.value.steamid.length > 0) {
        await fetchData()
      }
      
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
      page,
      modalSkin,
      validateSeed,
      validateWear,
      openModalSkin,
      closeModalSkin,
      onModalSkinSearch,
      onModalSkinSelect,
      modalSkinSearchResultItems,
      modalSticker,
      openModalSticker,
      closeModalSticker,
      onModalStickerSearch,
      onModalStickerSelect,
      modalStickerSearchResultItems,
      modalKeychain,
      openModalKeychain,
      closeModalKeychain,
      onModalKeychainSearch,
      onModalKeychainSelect,
      modalKeychainSearchResultItems,
      tabAgentsTeam,
      tabSkinsTeam,
      session,
      knifeSearchInput,
      weaponSearchInput,
      glovesSearchInput,
      musicsSearchInput,
      pinsSearchInput,
      agentsSearchInput,
      weapons,
      defIndexes,
      knives,
      stickers,
      keychains,
      skins,
      pins,
      weaponsFiltered,
      knivesFiltered,
      glovesFiltered,
      musicsFiltered,
      pinsFiltered,
      agentsFiltered,
      setMusic,
      setPin,
      setKnife,
      setAgent,
      setGlove,
      setSkin,
      setSticker,
      setKeychain,
      TEAM_T,
      TEAM_CT
    }
  }
})
app.use(vuetify)
app.mount('#app')