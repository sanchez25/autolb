<template>
  <v-snackbar
      v-model="snackbar"
      bottom
      :timeout="-1"
      :color="color"
      outlined
      class="snackbar-download"
  >
    <span>{{ message }}</span>
    <v-progress-circular
        indeterminate
        color="primary"
    ></v-progress-circular>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  data() {
    return {
      snackbar: false,
      color: '',
      message: ''
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.snackbar = true
      }
      if (mutation.type === 'snackbar/closeMessage') {
        this.snackbar = false
      }
    })
  }
}
</script>

<style scoped>

</style>