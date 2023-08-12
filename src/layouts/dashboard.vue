<template>
  <v-app style="background: #f5f5f5">
    <v-main class="pa-3">
      <v-row class="flex-nowrap">
        <Menu
            class="left-menu"
        />
        <v-col
            class="main-table"
        >
          <div class="table">
            <nuxt />
          </div>
        </v-col>
      </v-row>
    </v-main>
    <Snackbar />
    <SnackbarSuccess />
    <SnackbarError />
  </v-app>
</template>

<script>
import Menu from "../components/Menu/Menu";
import Snackbar from "../components/Snackbar/Snackbar";
import SnackbarSuccess from "../components/Snackbar/SnackbarSuccess";
import SnackbarError from "../components/Snackbar/SnackbarError";

export default {
  components: {
    SnackbarError,
    Menu,
    Snackbar,
    SnackbarSuccess,
  },
};
</script>

<style>

  .v-application .accent {
    background-color: #005caf;
    border-color: #005caf;
  }
  .left-menu {
    position: fixed;
    top: 0;
    left: 12px;
  }
  .main-table {
    padding-left: 212px;
  }

</style>