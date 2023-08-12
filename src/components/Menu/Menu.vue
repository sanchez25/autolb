<template>
  <v-card height="100vh" width="190">
    <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-img
                src="/logo.png"
                max-width="158"
                max-height="32"
            ></v-img>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item-group
            v-model="currentNavTab"
            color="primary"
        >
          <v-list-item
            v-for="item in navList"
            :key="item.value"
            :value="item.value"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.label }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div>
          <v-list-item @click="logout">
            <v-icon class="pr-2">mdi-exit-to-app</v-icon>
            <v-list-item-content>
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "Menu",
  computed: {
    navList() {
      return [
        { label: "Проекты", value: "projects" },
        { label: "Постинг", value: "index" },
        { label: "Профили", value: "profiles" },
        { label: "Паки", value: "package" },
       // { label: "Прокси", value: "proxy" },
      ];
    },
    currentNavTab: {
      get() {
        return this.$route.name;
      },
      set(value) {
        this.$router.push({ name: value });
      },
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      await this.$nuxt.$router.push("/login/");
    },
  },
};
</script>

<style scoped>
</style>
