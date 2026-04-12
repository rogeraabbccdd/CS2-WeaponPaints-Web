<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CS2 Weapon Paints</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@4.0.5/dist/vuetify.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" />
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=roboto:400,500,700" />
  <link rel="stylesheet" href="./css/style.css">
  <!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> -->
</head>
<body>
  <div id="app">
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
  </div>
  <script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
      "@vue/devtools-api": "https://unpkg.com/@vue/devtools-api@8.1.1/dist/vue-devtools-api.esm-browser.js",
      "vuetify": "https://cdn.jsdelivr.net/npm/vuetify@4.0.5/dist/vuetify.esm.js",
      "vue-i18n":  "https://unpkg.com/vue-i18n@11/dist/vue-i18n.esm-browser.js",
      "axios": "https://cdn.jsdelivr.net/npm/axios@1.15.0/+esm",
      "pinia": "https://unpkg.com/pinia@3.0.4/dist/pinia.esm-browser.js"
    }
  }
  </script>
  <script type="module" src="./js/app.js"></script>
</body>
</html>