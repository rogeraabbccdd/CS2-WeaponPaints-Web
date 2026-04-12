import { ref, computed, watch } from "vue";
import { useKeychainsStore } from "../stores/keychains.js";

export default {
  props: {
    modelValue: Boolean,
    initialData: Object,
  },
  emits: ["update:modelValue", "save"],
  setup(props, { emit }) {
    const keychainsStore = useKeychainsStore();

    const search = ref({
      page: 1,
      pages: 1,
      input: "",
      itemsPerPage: 24,
      results: [],
    });

    const form = ref({
      seed: 0,
      id: 0,
      x: 0,
      y: 0,
      z: 0,
    });

    const keychain = ref({
      image: "",
      name: "",
      color: "#000",
    });

    const onSearch = () => {
      search.value.page = 1;
      search.value.results = keychainsStore.keychains.filter((k) =>
        search.value.input === ""
          ? true
          : k.name.toUpperCase().includes(search.value.input.toUpperCase()),
      );
      search.value.results.unshift({
        id: "0",
        name: "No Keychain",
        image: "https://placehold.co/256x198?text=No%20Keychain",
        rarity: {
          color: "#000",
        },
      });
      search.value.pages = Math.ceil(
        search.value.results.length / search.value.itemsPerPage,
      );
    };

    const searchResultItems = computed(() => {
      const start = (search.value.page - 1) * search.value.itemsPerPage;
      const end = start + search.value.itemsPerPage;
      return search.value.results.slice(start, end);
    });

    const onSelect = (k) => {
      form.value.id = k.id;
      keychain.value.image = k.image;
      keychain.value.name = k.name;
      keychain.value.color = k.rarity.color;
    };

    const validateSeed = () => {
      const value = parseFloat(form.value.seed);
      if (isNaN(value) || value > 1000 || value < 0) {
        form.value.seed = 0;
      } else {
        form.value.seed = Math.round(value);
      }
    };

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal) {
          form.value = { ...props.initialData };
          if (form.value.id != 0) {
            const result = keychainsStore.keychains.find(
              (k) => k.id == form.value.id,
            );
            if (result) {
              keychain.value.image = result.image;
              keychain.value.name = result.name;
              keychain.value.color = result.rarity.color;
            }
          } else {
            keychain.value.image =
              "https://placehold.co/256x198?text=No%20Keychain";
            keychain.value.name = "No Keychain";
            keychain.value.color = "#000";
          }
          search.value.input = "";
          onSearch();
        }
      },
    );

    const save = () => {
      emit("save", { ...form.value, image: keychain.value.image });
    };

    const close = () => {
      emit("update:modelValue", false);
    };

    return {
      search,
      form,
      keychain,
      onSearch,
      searchResultItems,
      onSelect,
      validateSeed,
      save,
      close,
    };
  },
  template: /*html*/
    `
    <v-dialog fullscreen :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>Edit Keychain</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="close"></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" align-self="center">
              <v-img :src="keychain.image" height="100"></v-img>
              <p class="text-center">{{ keychain.name }}</p>
            </v-col>
            <v-col cols="12" md="6" align-self="center">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Seed" v-model="form.seed" @change="validateSeed" hint="0 ~ 1000"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="X" v-model="form.x" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Y" v-model="form.y" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Z" v-model="form.z" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn variant="outlined" color="primary" append-icon="mdi-open-in-new" href="https://cs2inspects.com/sticker-customizer" target="_blank">Sticker Customizer</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Search" v-model="search.input" @update:model-value="onSearch"></v-text-field>
            </v-col>
            <v-col cols="3" md="2" xl="1" v-for="k in searchResultItems" :key="k.id">
              <v-tooltip :text="k.name" location="top">
                <template v-slot:activator="{ props }">
                  <v-card v-bind="props" @click="onSelect(k)" variant="text">
                    <v-img :src="k.image" height="90">
                      <v-overlay :model-value="k.id == form.id" contained class="align-center justify-center">
                        <v-icon size="50" color="green">mdi-check-circle-outline</v-icon>
                      </v-overlay>
                    </v-img>
                  </v-card>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-pagination 
                v-model="search.page"
                :length="search.pages"
                :total-visible="7"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="plain" @click="close"></v-btn>
          <v-btn color="primary" text="Save" variant="tonal" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  `,
};
