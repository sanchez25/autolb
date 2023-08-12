<template>
  <v-snackbar
      v-model="snackbarError"
      :color="color"
      :timeout="timeout"
      right
      bottom
      max-width="100%"
  >
    <span>{{ message }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn
          text
          v-bind="attrs"
          @click="snackbarError = false"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackbarError",
  data() {
    return {
      snackbarError: false,
      color: '',
      message: '',
      timeout: 5000
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbarError/showError') {
        this.message = state.snackbarError.content
        this.color = state.snackbarError.color
        this.snackbarError = true
      }
    })
  }
}
</script>

<style scoped>

</style>