<template>
  <v-snackbar
      v-model="snackbarTwo"
      bottom
      :timeout="-1"
      color="green"
  >
    Успешное состояние
    <template v-slot:action="{ attrs }">
      <v-btn
          text
          v-bind="attrs"
          @click="snackbarTwo = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackbarSuccess",
  data() {
    return {
      snackbarTwo: false
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/successMessage') {
        this.snackbarTwo = true
      }
    })
  }
}
</script>

<style scoped>

</style>