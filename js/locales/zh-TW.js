export default {
  nav: {
    title: 'CS2 Weapon Paints',
    logout: '登出',
    knives: "刀子",
    skins: "造型",
    gloves: "手套",
    agents: "幹員",
    musics: "音樂包",
    pins: "徽章",
    lang: "語言",
  },
  page: {
    knives: {
      search: {
        label: '搜尋',
      },
      sort: {
        label: "排序",
        name_asc: "名稱 (升序)",
        name_desc: "名稱 (降序)",
      },
      default: "預設",
    },
    skins: {
      search: {
        label: '搜尋',
      },
      category: {
        label: '分類'
      },
      sort: {
        label: "排序",
        name_asc: "名稱 (升序)",
        name_desc: "名稱 (降序)",
      },
    },
    gloves: {
      search: {
        label: '搜尋'
      },
      sort: {
        label: '排序',
        asc: '名稱 (升序)',
        desc: '名稱 (降序)',
      },
      category: {
        label: '分類',
        all: '全部分類',
        bloodhound: '獵犬手套',
        brokenfang: '《狂牙行動》手套',
        driver: '駕駛手套',
        handwraps: '手綁帶',
        hydra: '九頭蛇手套',
        moto: '機車手套',
        specialist: '技術士手套',
        sport: '運動員手套',
      },
      default: '預設',
    },
    agents: {
      search: {
        label: '搜尋',
      },
      sort: {
        label: '排序',
        name_asc: '名稱 (升序)',
        name_desc: '名稱 (降序)',
        rarity_desc: '稀有度 (由高到低)',
        rarity_asc: '稀有度 (由低到高)',
      },
      default: '預設',
      equip: '裝備'
    },
    musics: {
      search: {
        label: '搜尋',
      },
      sort: {
        label: '排序',
        name_asc: '名稱 (升序)',
        name_desc: '名稱 (降序)',
      },
      default: '預設',
    },
    pins: {
      search: {
        label: '搜尋',
      },
      sort: {
        label: '排序',
        name_asc: '名稱 (升序)',
        name_desc: '名稱 (降序)',
        rarity_desc: '稀有度 (由高到低)',
        rarity_asc: '稀有度 (由低到高)',
      },
      default: '預設',
    }
  },
  login: {
    prompt: '請先登入',
  },
  loading: {
    text: '載入中...',
  },
  team: {
    t: "恐怖份子",
    ct: "反恐小組",
  },
  modal_skin: {
    save: '儲存變更',
    preview: {
      title: '已選造型',
      default: '預設',
    },
    attributes: {
      title: '武器屬性',
      wear: '磨損度',
      seed: '圖案範本',
      nametag: '名稱標籤',
      stattrack: 'StatTrak™',
    },
    stickers: {
      title: '貼紙與吊飾',
      slot: '貼紙欄位 {slot}',
      keychain: '吊飾',
    },
    search: {
      label: '搜尋',
    },
    all_weapons: '所有武器',
    sort: {
      label: '排序',
      name_asc: '名稱 (A-Z)',
      name_desc: '名稱 (Z-A)',
      rarity_desc: '稀有度 (由高到低)',
      rarity_asc: '稀有度 (由低到高)',
    }
  },
  modal_sticker: {
    title: '編輯貼紙欄位 {slot}',
    apply: '套用貼紙',
    preview: '已選貼紙',
    attributes: '貼紙屬性',
    wear: '磨損度',
    x: 'X 偏移',
    y: 'Y 偏移',
    scale: '縮放',
    rotate: '旋轉',
    external: '開啟外部自訂器',
    search: '搜尋貼紙...',
    sort: '排序方式',
    none: '無貼紙',
  },
  modal_keychain: {
    title: '編輯吊飾',
    apply: '套用吊飾',
    preview: '已選吊飾',
    attributes: '吊飾屬性',
    seed: '吊飾樣板',
    x: 'X 偏移',
    y: 'Y 偏移',
    z: 'Z 偏移',
    external: '開啟外部自訂器',
    search: '搜尋吊飾...',
    sort: '排序方式',
    none: '無吊飾',
  },
  weapon: {
    category: {
      all: '全部',
      pistol: '手槍',
      smg: '衝鋒槍',
      rifle: '步槍',
      shotgun: '散彈槍',
      machinegun: '機槍',
      knife: '刀子',
      zeus: 'Zeus'
    },
    name: {
      // Knives
      weapon_knife: "預設軍刀",
      weapon_bayonet: "刺刀",
      weapon_knife_css: "經典軍刀",
      weapon_knife_flip: "折疊式軍刀",
      weapon_knife_gut: "穿腸刀",
      weapon_knife_karambit: "爪刀",
      weapon_knife_m9_bayonet: "M9 刺刀",
      weapon_knife_tactical: "獵刀",
      weapon_knife_falchion: "彎刃匕首",
      weapon_knife_survival_bowie: "布伊刀",
      weapon_knife_butterfly: "蝴蝶刀",
      weapon_knife_push: "暗影匕首",
      weapon_knife_cord: "繩柄刀",
      weapon_knife_canis: "求生刀",
      weapon_knife_ursus: "熊刀",
      weapon_knife_gypsy_jackknife: "西班牙折刀",
      weapon_knife_outdoor: "流浪者小刀",
      weapon_knife_stiletto: "彈簧刀",
      weapon_knife_widowmaker: "彎爪刀",
      weapon_knife_skeleton: "骷顱刀",
      weapon_knife_kukri: "反曲刀",
      // Weapons
      weapon_deagle: "Desert Eagle",
      weapon_elite: "Dual Berettas",
      weapon_fiveseven: "Five-SeveN",
      weapon_glock: "Glock-18",
      weapon_ak47: "AK-47",
      weapon_aug: "AUG",
      weapon_awp: "AWP",
      weapon_famas: "FAMAS",
      weapon_g3sg1: "G3SG1",
      weapon_galilar: "Galil AR",
      weapon_m249: "M249",
      weapon_m4a1: "M4A4",
      weapon_mac10: "MAC-10",
      weapon_p90: "P90",
      weapon_mp5sd: "MP5-SD",
      weapon_ump45: "UMP-45",
      weapon_xm1014: "XM1014",
      weapon_bizon: "PP-Bizon",
      weapon_mag7: "MAG-7",
      weapon_negev: "Negev",
      weapon_sawedoff: "Sawed-Off",
      weapon_tec9: "Tec-9",
      weapon_taser: "Zeus x27",
      weapon_hkp2000: "P2000",
      weapon_mp7: "MP7",
      weapon_mp9: "MP9",
      weapon_nova: "Nova",
      weapon_p250: "P250",
      weapon_scar20: "SCAR-20",
      weapon_sg556: "SG 553",
      weapon_ssg08: "SSG 08",
      weapon_m4a1_silencer: "M4A1-S",
      weapon_usp_silencer: "USP-S",
      weapon_cz75a: "CZ75-Auto",
      weapon_revolver: "R8 Revolver",
    }
  }
};
