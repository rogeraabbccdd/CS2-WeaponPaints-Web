import { ref, computed, onMounted } from "vue";
import { useSessionStore } from "../stores/session.js";
import { useSkinsStore } from "../stores/skins.js";
import { useStickersStore } from "../stores/stickers.js";
import { useKeychainsStore } from "../stores/keychains.js";
import { KNIVES, WEAPONS } from "../const/weapons.js";
import ModalSkin from "../components/modal-skin.js";
import ModalSticker from "../components/modal-sticker.js";
import ModalKeychain from "../components/modal-keychain.js";

export default {
  components: { ModalSkin, ModalSticker, ModalKeychain },
  setup() {
    const session = useSessionStore();
    const skins = useSkinsStore();
    const stickers = useStickersStore();
    const keychains = useKeychainsStore();

    const knives = KNIVES;
    const weapons = WEAPONS.concat(KNIVES);

    const weaponSearchInput = ref("");

    const weaponsFiltered = computed(() => {
      return weapons.filter((weapon) =>
        weapon.name
          .toUpperCase()
          .includes(weaponSearchInput.value.toUpperCase()),
      );
    });

    const modalSkinOpen = ref(false);
    const selectedWeapon = ref(null);

    const openModalSkin = (i) => {
      selectedWeapon.value = weaponsFiltered.value[i];
      modalSkinOpen.value = true;
    };

    onMounted(async () => {
      await skins.fetchData();
      await stickers.fetchData();
      await keychains.fetchData();
    });

    return {
      knives,
      weapons,
      session,
      weaponSearchInput,
      weaponsFiltered,
      modalSkinOpen,
      selectedWeapon,
      openModalSkin,
    };
  },
  template: /*html*/
    `
    <v-container>
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

      <ModalSkin 
        v-if="selectedWeapon"
        v-model="modalSkinOpen" 
        :weapon="selectedWeapon" 
        :weapons="weapons"
      />
    </v-container>
    `,
};
