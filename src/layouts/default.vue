<template>
  <v-app
    style="background: #F5F5F5;"
  >
    <Nuxt />
    <Snackbar />
    <SnackbarSuccess />
    <SnackbarError />
  </v-app>
</template>

<script>

import Snackbar from "../components/Snackbar/Snackbar";
import SnackbarSuccess from "../components/Snackbar/SnackbarSuccess";
import SnackbarError from "../components/Snackbar/SnackbarError";

export default {
  name: 'DefaultLayout',
  components: {
    SnackbarError,
    Snackbar,
    SnackbarSuccess
  },
  data () {
    return {
      drawer: false,
      group: null,
    }
  }
}
</script>

<style>
  .v-application .accent {
    background-color: #005caf;
    border-color: #005caf;
  }
</style>

