<template>
  <v-form
    ref="form"
    @submit.prevent="userLogin"
    v-model="login.valid"
    lazy-validation
  >
    <v-card-title
      class="justify-center"
    >
      Авторизация
    </v-card-title>
    <v-card-text>
      <p
        class="mb-2"
      >
        Логин:
      </p>
      <v-text-field
        solo
        label="Введите данные"
        :rules="[v => !!v || 'Это поле обязательно для заполнения']"
        required
        type="text"
        v-model="login.username"
      ></v-text-field>
      <p
        class="mb-2"
      >
        Пароль:
      </p>
      <v-text-field
        solo
        label="Введите данные"
        hide-details="true"
        :rules="[v => !!v || 'Это поле обязательно для заполнения']"
        :counter="20"
        required
        type="password"
        v-model="login.password"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        color="blue darken-1"
        text
        type="submit"
        :disabled="!login.valid"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
export default {
  name: "AuthenticationForm",
  data() {
    return {
      login: {
        valid: false,
        username: '',
        password: ''
      }
    }
  },
  mounted () {
    this.login.valid = false
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', {
          data: `username=${this.login.username}&password=${this.login.password}`
        })
        this.$nuxt.refresh()
      } catch (error) {
        if (error.response.status == '401') {
          this.$notifier.showError({content: 'Неверное имя пользователя или пароль', color: 'red darken-2'})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
