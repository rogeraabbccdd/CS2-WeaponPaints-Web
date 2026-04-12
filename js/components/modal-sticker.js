import { ref, computed, watch } from "vue";
import { useStickersStore } from "../stores/stickers.js";

export default {
  props: {
    modelValue: Boolean,
    slot: Number,
    initialData: Object,
  },
  emits: ["update:modelValue", "save"],
  setup(props, { emit }) {
    const stickersStore = useStickersStore();

    const search = ref({
      page: 1,
      pages: 1,
      input: "",
      itemsPerPage: 24,
      results: [],
    });

    const form = ref({
      wear: 0.001,
      id: 0,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
    });

    const sticker = ref({
      image: "",
      name: "",
      color: "#000",
    });

    const onSearch = () => {
      search.value.page = 1;
      search.value.results = stickersStore.stickers.filter((s) =>
        search.value.input === ""
          ? true
          : s.name.toUpperCase().includes(search.value.input.toUpperCase()),
      );
      search.value.results.unshift({
        id: "0",
        name: "No Sticker",
        image: "https://placehold.co/256x198?text=No%20Sticker",
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

    const onSelect = (s) => {
      form.value.id = s.id;
      sticker.value.image = s.image;
      sticker.value.name = s.name;
      sticker.value.color = s.rarity.color;
    };

    const validateWear = () => {
      const value = parseFloat(form.value.wear);
      if (isNaN(value) || value <= 0.001 || value > 1) {
        form.value.wear = 0.001;
      }
    };

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal) {
          form.value = { ...props.initialData };
          if (form.value.id != 0) {
            const result = stickersStore.stickers.find(
              (s) => s.id == form.value.id,
            );
            if (result) {
              sticker.value.image = result.image;
              sticker.value.name = result.name;
              sticker.value.color = result.rarity.color;
            }
          } else {
            sticker.value.image =
              "https://placehold.co/256x198?text=No%20Sticker";
            sticker.value.name = "No Sticker";
            sticker.value.color = "#000";
          }
          search.value.input = "";
          onSearch();
        }
      },
    );

    const save = () => {
      emit("save", { ...form.value, image: sticker.value.image });
    };

    const close = () => {
      emit("update:modelValue", false);
    };

    return {
      search,
      form,
      sticker,
      onSearch,
      searchResultItems,
      onSelect,
      validateWear,
      save,
      close,
    };
  },
  /*html*/
  template: `
    <v-dialog fullscreen :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
      <v-card>
        <v-toolbar color="secondary">
          <v-toolbar-title>Edit Sticker Slot {{ slot }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="close"></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" align-self="center">
              <v-img :src="sticker.image" height="100"></v-img>
              <p class="text-center">{{ sticker.name }}</p>
            </v-col>
            <v-col cols="12" md="6" align-self="center">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Wear" v-model="form.wear" @change="validateWear" hint="0.001 ~ 1.0" hide-details="auto"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="X" v-model="form.x" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Y" v-model="form.y" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Scale" v-model="form.scale" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Rotate" v-model="form.rotate" hide-details></v-text-field>
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
            <v-col cols="3" md="2" xl="1" v-for="s in searchResultItems" :key="s.id">
              <v-tooltip :text="s.name" location="top">
                <template v-slot:activator="{ props }">
                  <v-card v-bind="props" @click="onSelect(s)" variant="text">
                    <v-img :src="s.image" height="90">
                      <v-overlay :model-value="s.id == form.id" contained class="align-center justify-center">
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
