import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStickersStore } from "../stores/stickers.js";

export default {
  props: {
    modelValue: Boolean,
    slot: Number,
    initialData: Object,
  },
  emits: ["update:modelValue", "save"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const stickersStore = useStickersStore();

    const sortOptions = computed(() => [
      { title: t('modal_skin.sort.name_asc'), value: 'asc' },
      { title: t('modal_skin.sort.name_desc'), value: 'desc' },
      { title: t('modal_skin.sort.rarity_desc'), value: 'rarity_desc' },
      { title: t('modal_skin.sort.rarity_asc'), value: 'rarity_asc' }
    ]);

    const search = ref({
      page: 1,
      input: "",
      sort: "rarity_desc",
      itemsPerPage: 24,
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
      color: "#424242",
    });

    // Static default item
    const NO_STICKER_ITEM = {
      id: "0",
      name: t('modal_sticker.none'),
      image: "./images/no-sticker.svg",
      rarity: { id: "rarity_default", color: "#424242" },
      rarityWeight: -1,
      isDefault: true
    };

    // Prepare items for v-data-iterator
    const items = computed(() => {
      const defaultItem = { ...NO_STICKER_ITEM, name: t('modal_sticker.none') }
      // Very efficient: just spreading pre-calculated store data
      return [defaultItem, ...stickersStore.stickers];
    });

    // Map the internal sort state to Vuetify's sortBy format
    // isDefault: true (1) > isDefault: undefined (0) when sorting desc
    const sortBy = computed(() => {
      const priority = { key: 'isDefault', order: 'desc' };
      switch (search.value.sort) {
        case 'asc': return [priority, { key: 'name', order: 'asc' }];
        case 'desc': return [priority, { key: 'name', order: 'desc' }];
        case 'rarity_desc': return [priority, { key: 'rarityWeight', order: 'desc' }, { key: 'name', order: 'asc' }];
        case 'rarity_asc': return [priority, { key: 'rarityWeight', order: 'asc' }, { key: 'name', order: 'asc' }];
        default: return [priority];
      }
    });

    // Custom filter to match only by name (matches previous manual filter behavior)
    const customFilter = (value, searchInput, item) => {
      if (!searchInput) return true;
      return item.raw.name.toUpperCase().includes(searchInput.toUpperCase());
    };

    const onSelect = (s) => {
      form.value.id = s.id;
      if (s.id == "0" || s.id == 0) {
        form.value.wear = 0.001;
        form.value.x = 0;
        form.value.y = 0;
        form.value.scale = 1;
        form.value.rotate = 0;
      }
      sticker.value.image = s.image;
      sticker.value.name = s.name;
      sticker.value.color = s.rarity ? s.rarity.color : "#424242";
    };

    const validateWear = () => {
      let value = parseFloat(form.value.wear);
      if (isNaN(value) || value < 0) value = 0.001;
      if (value > 1) value = 1;
      form.value.wear = value;
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
            sticker.value.image = "./images/no-sticker.svg";
            sticker.value.name = t('modal_sticker.none');
            sticker.value.color = "#424242";
          }
          search.value.input = "";
          search.value.page = 1;
        }
      },
    );

    const save = () => {
      const finalImage = (form.value.id == "0" || form.value.id == 0) ? "" : sticker.value.image;
      emit("save", { ...form.value, image: finalImage });
    };

    const close = () => {
      emit("update:modelValue", false);
    };

    return {
      t,
      search,
      form,
      sticker,
      items,
      sortBy,
      customFilter,
      onSelect,
      validateWear,
      save,
      close,
      sortOptions
    };
  },
  template: /*html*/
    `
    <v-dialog fullscreen :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" transition="dialog-bottom-transition">
      <v-card color="background">
        <v-toolbar color="surface" elevation="1">
          <v-btn icon="mdi-close" @click="close"></v-btn>
          <v-toolbar-title class="text-primary font-weight-bold">{{ t('modal_sticker.title', { slot: slot + 1 }) }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" class="px-6" @click="save">{{ t('modal_sticker.apply') }}</v-btn>
        </v-toolbar>

        <v-card-text class="pa-0">
          <v-container fluid>
            <v-row>
              <!-- Left: Preview -->
              <v-col cols="12" md="6">
                <v-card border flat class="pa-4 bg-surface rounded-lg h-100 d-flex flex-column align-center justify-center">
                  <div class="card-accent-line mb-4" :style="{ background: sticker.color }"></div>
                  <div class="text-overline mb-2 w-100">{{ t('modal_sticker.preview') }}</div>
                  <v-img :src="sticker.image" height="180" contain rounded class="mb-4 w-100"></v-img>
                  <div class="text-h6 text-center font-weight-medium">
                    {{ sticker.name }}
                  </div>
                </v-card>
              </v-col>

              <!-- Right: Attributes Form -->
              <v-col cols="12" md="6">
                <v-card border flat class="pa-6 bg-surface rounded-lg h-100 d-flex flex-column justify-center">
                  <div class="text-overline mb-4">{{ t('modal_sticker.attributes') }}</div>
                  <v-row density="comfortable">
                    <v-col cols="12" class="pb-4">
                      <v-text-field 
                        :label="t('modal_sticker.wear')" v-model.number="form.wear" 
                        variant="outlined" density="compact" type="number" :step="0.001" :min="0.001" :max="1"
                        @update:model-value="validateWear" prepend-inner-icon="mdi-texture" hide-details class="mb-1"
                      ></v-text-field>
                      <v-slider v-model="form.wear" min="0.001" max="1" step="0.001" color="primary" hide-details density="compact"></v-slider>
                    </v-col>
                    
                    <v-col cols="6" class="py-1">
                      <v-text-field :label="t('modal_sticker.x')" v-model="form.x" variant="outlined" density="compact" prepend-inner-icon="mdi-axis-x-arrow" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-1">
                      <v-text-field :label="t('modal_sticker.y')" v-model="form.y" variant="outlined" density="compact" prepend-inner-icon="mdi-axis-y-arrow" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-1">
                      <v-text-field :label="t('modal_sticker.scale')" v-model="form.scale" variant="outlined" density="compact" prepend-inner-icon="mdi-arrow-expand-all" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-1">
                      <v-text-field :label="t('modal_sticker.rotate')" v-model="form.rotate" variant="outlined" density="compact" prepend-inner-icon="mdi-rotate-right" hide-details></v-text-field>
                    </v-col>

                    <v-col cols="12" class="mt-4">
                      <v-btn block variant="outlined" color="primary" prepend-icon="mdi-open-in-new" href="https://cs2inspects.com/sticker-customizer" target="_blank">
                        {{ t('modal_sticker.external') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-8"></v-divider>

            <v-data-iterator
              :items="items"
              :search="search.input"
              :sort-by="sortBy"
              :custom-filter="customFilter"
              :items-per-page="search.itemsPerPage"
              v-model:page="search.page"
            >
              <template v-slot:header>
                <v-row align="center" class="mb-4">
                  <v-col cols="12" md="8">
                    <v-text-field 
                      :placeholder="t('modal_sticker.search')" 
                      v-model="search.input" 
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-magnify"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="search.sort"
                      :items="sortOptions"
                      :label="t('modal_sticker.sort')"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:default="{ items: displayedItems }">
                <v-row>
                  <v-col cols="4" sm="3" md="2" lg="1" v-for="item in displayedItems" :key="item.raw.id">
                    <v-card 
                      border flat 
                      class="cursor-pointer position-relative overflow-hidden skin-card"
                      @click="onSelect(item.raw)"
                    >
                      <div class="card-accent-line" :style="{ background: item.raw.rarity ? item.raw.rarity.color : '#424242' }"></div>
                      <v-img :src="item.raw.image" height="80" contain>
                        <div class="position-absolute right-0 top-0 pa-1" v-if="item.raw.id == form.id">
                          <v-icon size="24" color="green">mdi-check-circle</v-icon>
                        </div>
                      </v-img>
                      <v-card-text class="pa-2 text-caption font-weight-medium text-truncate">
                        {{ item.raw.name }}
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:footer="{ pageCount }">
                <v-row v-if="pageCount > 1" justify="center" class="mt-6">
                  <v-col cols="12" sm="8" md="6">
                    <v-pagination 
                      v-model="search.page"
                      :length="pageCount"
                      :total-visible="5"
                      rounded="circle"
                      density="comfortable"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  `,
};