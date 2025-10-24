<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CS2 Weapon Paints</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@3.6.10/dist/vuetify.min.css">
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="./css/style.css">
</head>
<body>
  <div id="app">
    <v-app>
      <!-- Navbar -->
      <v-app-bar color="primary">
        <v-container class="d-flex align-center">
          <v-app-bar-title>CS2 Weapon Paints</v-app-bar-title>
          <v-spacer></v-spacer>
          <template v-if="session.steamid">
            <v-avatar>
              <v-img :src="session.steam_avatar"></v-img>
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
      <v-navigation-drawer v-if="session.steamid.length !== 0">
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
      <v-main class="mt-5" v-else-if="session.steamid.length === 0">
        <h1 class="text-center">Please login first.</h1>
      </v-main>
      <template v-else>
        <v-main class="mt-5">
          <!-- Knifes Page -->
          <v-container v-if="page[0] === 'knifes'">
            <v-text-field label="Search" v-model="knifeSearchInput"></v-text-field>
            <v-row>
              <v-col cols="6" md="3" lg="2">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setKnife('weapon_knife', TEAM_T)">T</v-list-item>
                      <v-list-item @click="setKnife('weapon_knife', TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img src="./images/default.svg">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_knife[TEAM_T] == 'weapon_knife'">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_knife[TEAM_CT] == 'weapon_knife'">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>Default</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6" md="3" lg="2" v-for="knife in knivesFiltered" :key="knife.weapon_name">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setKnife(knife.weapon_name, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setKnife(knife.weapon_name, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img :src="knife.image">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_knife[TEAM_T] == knife.weapon_name">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_knife[TEAM_CT] == knife.weapon_name">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>{{ knife.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- Skins Page -->
          <v-container v-if="page[0] === 'skins'">
            <v-text-field label="Search" v-model="weaponSearchInput"></v-text-field>
            <!-- Weapons -->
            <v-row>
              <v-col cols="6" md="3" lg="2" v-for="(weapon, i) in weaponsFiltered" :key="weapon.weapon_name">
                <v-card @click="openModalSkin(i)">
                  <v-img :src="weapon.image"></v-img>
                  <v-card-title>{{ weapon.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <!-- Skin Dialog -->
            <v-dialog fullscreen v-model="modalSkin.open" persistent>
              <v-card>
                <v-toolbar color="secondary">
                  <v-toolbar-title>{{ modalSkin.weapon_name }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon="mdi-close" @click="closeModalSkin"></v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-tabs v-model="tabSkinsTeam" fixed-tabs class="mb-5" :color="tabSkinsTeam == TEAM_T ? 'orange' : 'light-blue'">
                    <v-tab :value="TEAM_T">
                      T
                    </v-tab>
                    <v-tab :value="TEAM_CT">
                      CT
                    </v-tab>
                  </v-tabs>
                  <v-row>
                    <v-col cols="12" md="6" align-self="center">
                      <v-img :src="modalSkin.skin[tabSkinsTeam].image" height="150" :style="{filter: `drop-shadow(0px 0px 10px ${modalSkin.skin[tabSkinsTeam].color})` }"></v-img>
                      <p class="text-center">{{ modalSkin.skin[tabSkinsTeam].name }}</p>
                      <v-row class="my-1" v-if="!modalSkin.isKnife">
                        <v-col>
                          <v-card class="text-center" variant="text" @click="openModalSticker(0)">
                            <v-img v-if="modalSkin.form[tabSkinsTeam].stickers0.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers0.image" height="50"></v-img>
                            <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                          </v-card>
                        </v-col>
                        <v-col>
                          <v-card class="text-center" variant="text" @click="openModalSticker(1)">
                            <v-img v-if="modalSkin.form[tabSkinsTeam].stickers1.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers1.image" height="50"></v-img>
                            <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                          </v-card>
                        </v-col>
                        <v-col>
                          <v-card class="text-center" variant="text" @click="openModalSticker(2)">
                            <v-img v-if="modalSkin.form[tabSkinsTeam].stickers2.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers2.image" height="50"></v-img>
                            <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                          </v-card>
                        </v-col>
                        <v-col>
                          <v-card class="text-center" variant="text" @click="openModalSticker(3)">
                            <v-img v-if="modalSkin.form[tabSkinsTeam].stickers3.image.length > 0" :src="modalSkin.form[tabSkinsTeam].stickers3.image" height="50"></v-img>
                            <v-icon v-else size="50" icon="mdi-sticker-plus-outline" color="grey-darken-3"></v-icon>
                          </v-card>
                        </v-col>
                        <v-col>
                          <v-card class="text-center" variant="text" @click="openModalKeychain">
                            <v-img v-if="modalSkin.form[tabSkinsTeam].keychain.image.length > 0" :src="modalSkin.form[tabSkinsTeam].keychain.image" height="50"></v-img>
                            <v-icon v-else size="50" icon="mdi-key-chain" color="grey-darken-3"></v-icon>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" align-self="center">
                      <v-text-field label="Wear" v-model="modalSkin.form[tabSkinsTeam].wear" @change="validateWear('skin')" hint="0.001 ~ 1.0"></v-text-field>
                      <v-text-field label="Seed" v-model="modalSkin.form[tabSkinsTeam].seed" @change="validateSeed('skin')" hint="0 ~ 1000"></v-text-field>
                      <v-text-field label="Name Tag" v-model="modalSkin.form[tabSkinsTeam].name"></v-text-field>
                      <v-checkbox label="StatTrack" :true-value="1" :false-value="0" v-model="modalSkin.form[tabSkinsTeam].stattrack" hide-details></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-3"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Search" v-model="modalSkin.search.input" @update:model-value="onModalSkinSearch">
                        <template #append>
                          <v-checkbox label="All Weapons" v-model="modalSkin.search.all" hide-details @input="onModalSkinSearch"></v-checkbox>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6" md="3" lg="2" xl="1" v-for="skin in modalSkinSearchResultItems" :key="skin.id">
                      <v-card @click="onModalSkinSelect(skin)" variant="text" v-tooltip:top="skin.name">
                        <v-overlay :model-value="true" :scrim="false" contained class="justify-end" persistent>
                          <v-icon size="25" color="orange" v-if="modalSkin.form[TEAM_T].paint == skin.paint_index">mdi-check-circle-outline</v-icon>
                          <v-icon size="25" color="light-blue" v-if="modalSkin.form[TEAM_CT].paint == skin.paint_index">mdi-check-circle-outline</v-icon>
                        </v-overlay>
                        <v-img :src="skin.image" height="90" :style="{filter: `drop-shadow(0px 0px 5px ${skin.rarity.color})` }"></v-img>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-pagination 
                        v-model="modalSkin.search.page"
                        :length="Math.ceil(modalSkin.search.results.length / modalSkin.search.itemsPerPage)"
                        :disabled="modalSkin.search.loading"
                        :total-visible="7"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Close" variant="plain" @click="closeModalSkin"></v-btn>
                  <v-btn color="primary" text="Save" variant="tonal" @click="setSkin"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Sticker Dialog -->
            <v-dialog fullscreen v-model="modalSticker.open" persistent>
              <v-card>
                <v-toolbar color="secondary">
                  <v-toolbar-title>Edit Sticker</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon="mdi-close" @click="closeModalSticker"></v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6" align-self="center">
                      <v-img :src="modalSticker.sticker.image" height="100" :style="{filter: `drop-shadow(0px 0px 10px ${modalSticker.sticker.color})` }"></v-img>
                      <p class="text-center">{{ modalSticker.sticker.name }}</p>
                    </v-col>
                    <v-col cols="12" md="6" align-self="center">
                      <v-text-field label="Wear" v-model="modalSticker.form.wear" @change="validateWear('sticker')" hint="0.001 ~ 1.0"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-3"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Search" v-model="modalSticker.search.input" @update:model-value="onModalStickerSearch"></v-text-field>
                    </v-col>
                    <v-col cols="3" md="2" xl="1" v-for="sticker in modalStickerSearchResultItems">
                      <v-tooltip :text="sticker.name" location="top">
                        <template v-slot:activator="{ props }">
                          <v-card v-bind="props" @click="onModalStickerSelect(sticker)" variant="text">
                            <v-img :src="sticker.image" height="90"  :style="{filter: `drop-shadow(0px 0px 5px ${sticker.rarity.color})` }">
                              <v-overlay :model-value="sticker.id == modalSticker.form.id" contained class="align-center justify-center">
                                <v-icon size="50" color="green">mdi-check-circle-outline</v-icon>
                              </v-overlay>
                            </v-img>
                          </v-card>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12">
                      <v-pagination 
                        v-model="modalSticker.search.page"
                        :length="Math.ceil(modalSticker.search.results.length / modalSticker.search.itemsPerPage)"
                        :disabled="modalSticker.search.loading"
                        :total-visible="7"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Close" variant="plain" @click="closeModalSticker"></v-btn>
                  <v-btn color="primary" text="Save" variant="tonal" @click="setSticker"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Keychain Dialog -->
            <v-dialog fullscreen v-model="modalKeychain.open" persistent>
              <v-card>
                <v-toolbar color="secondary">
                  <v-toolbar-title>Edit Keychain</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon="mdi-close" @click="closeModalKeychain"></v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6" align-self="center">
                      <v-img :src="modalKeychain.keychain.image" height="100" :style="{filter: `drop-shadow(0px 0px 10px ${modalKeychain.keychain.color})` }"></v-img>
                      <p class="text-center">{{ modalKeychain.keychain.name }}</p>
                    </v-col>
                    <v-col cols="12" md="6" align-self="center">
                      <v-text-field label="Seed" v-model="modalKeychain.form.seed" @change="validateSeed('keychain')" hint="0 ~ 1000"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-3"></v-divider>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Search" v-model="modalKeychain.search.input" @update:model-value="onModalKeychainSearch"></v-text-field>
                    </v-col>
                    <v-col cols="3" md="2" xl="1" v-for="keychain in modalKeychainSearchResultItems">
                      <v-tooltip :text="keychain.name" location="top">
                        <template v-slot:activator="{ props }">
                          <v-card v-bind="props" @click="onModalKeychainSelect(keychain)" variant="text">
                            <v-img :src="keychain.image" height="90"  :style="{filter: `drop-shadow(0px 0px 5px ${keychain.rarity.color})` }">
                              <v-overlay :model-value="keychain.id == modalKeychain.form.id" contained class="align-center justify-center">
                                <v-icon size="50" color="green">mdi-check-circle-outline</v-icon>
                              </v-overlay>
                            </v-img>
                          </v-card>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12">
                      <v-pagination 
                        v-model="modalKeychain.search.page"
                        :length="Math.ceil(modalKeychain.search.results.length / modalKeychain.search.itemsPerPage)"
                        :disabled="modalKeychain.search.loading"
                        :total-visible="7"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Close" variant="plain" @click="closeModalKeychain"></v-btn>
                  <v-btn color="primary" text="Save" variant="tonal" @click="setKeychain"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
          <!-- Gloves Page -->
          <v-container v-if="page[0] === 'gloves'">
            <v-text-field label="Search" v-model="glovesSearchInput"></v-text-field>
            <v-row>
              <v-col cols="6" md="3" lg="2">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setGlove(0, 0, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setGlove(0, 0, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img src="./images/default.svg">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_glove[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_glove[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>Default</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6" md="3" lg="2" v-for="glove in glovesFiltered" :key="glove.paint_index">
                <v-card @click="">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setGlove(defIndexes[glove.weapon.id], glove.paint_index, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setGlove(defIndexes[glove.weapon.id], glove.paint_index, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img :src="glove.image">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon 
                        size="30" color="orange"
                        v-if="session.selected_glove[TEAM_T] == glove.weapon.weapon_id && session.selected_skins[glove.weapon.weapon_id][TEAM_T].weapon_paint_id == glove.paint_index"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon 
                        size="30" color="light-blue"
                        v-if="session.selected_glove[TEAM_CT] == glove.weapon.weapon_id && session.selected_skins[glove.weapon.weapon_id][TEAM_CT].weapon_paint_id == glove.paint_index"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>{{ glove.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- Agents Page -->
          <v-container v-if="page[0] === 'agents'">
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
                <v-card @click="setAgent('null')">
                  <v-img src="./images/default.svg">
                    <v-overlay :model-value="tabAgentsTeam == TEAM_T ? session.selected_agents[TEAM_T] == '' : session.selected_agents[TEAM_CT] == ''" contained class="align-center justify-center">
                      <v-icon size="128" color="green">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>Default</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6" md="3" lg="2" v-for="agent in agentsFiltered" :key="agent.agent_name">
                <v-card @click="setAgent(agent.model_player)">
                  <v-img :src="agent.image">
                    <v-overlay :model-value="tabAgentsTeam == TEAM_T ? session.selected_agents[TEAM_T] == agent.model_player : session.selected_agents[TEAM_CT] == agent.model_player" contained class="align-center justify-center">
                      <v-icon size="128" color="green">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>{{ agent.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- Music Kits Page -->
          <v-container v-if="page[0] === 'musics'">
            <v-text-field label="Search" v-model="musicsSearchInput"></v-text-field>
            <v-row>
              <v-col cols="6" md="3" lg="2">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setMusic(0, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setMusic(0, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img src="./images/default.svg">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_music[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_music[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>Default</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6" md="3" lg="2" v-for="music in musicsFiltered" :key="music.id">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setMusic(music.id, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setMusic(music.id, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img :src="music.image">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_music[TEAM_T] == music.id">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_music[TEAM_CT] == music.id">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>{{ music.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- Pins Page -->
          <v-container v-if="page[0] === 'pins'">
            <v-text-field label="Search" v-model="pinsSearchInput"></v-text-field>
            <v-row>
              <v-col cols="6" md="3" lg="2">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setPin(0, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setPin(0, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img src="./images/default.svg">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_pin[TEAM_T] == 0">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_pin[TEAM_CT] == 0">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>Default</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6" md="3" lg="2" v-for="pin in pinsFiltered" :key="pin.id">
                <v-card class="cursor-pointer">
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item @click="setPin(pin.id, TEAM_T)">T</v-list-item>
                      <v-list-item @click="setPin(pin.id, TEAM_CT)">CT</v-list-item>
                    </v-list>
                  </v-menu>
                  <v-img :src="pin.image">
                    <v-overlay :model-value="true" :scrim="false" contained class="justify-end">
                      <v-icon size="30" color="orange" v-if="session.selected_pin[TEAM_T] == pin.id">mdi-check-circle-outline</v-icon>
                      <v-icon size="30" color="light-blue" v-if="session.selected_pin[TEAM_CT] == pin.id">mdi-check-circle-outline</v-icon>
                    </v-overlay>
                  </v-img>
                  <v-card-title>{{ pin.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
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
  </div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuetify@3.7.2/dist/vuetify.min.js"></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js' integrity='sha512-JSCFHhKDilTRRXe9ak/FJ28dcpOJxzQaCd3Xg8MyF6XFjODhy/YMCM8HW0TFDckNHWUewW+kfvhin43hKtJxAw==' crossorigin='anonymous'></script>
  <script src="./js/weapons.js"></script>
  <script src="./js/app.js?upd=202410251621"></script>
</body>
</html>