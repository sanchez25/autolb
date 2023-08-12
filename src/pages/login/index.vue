<template>
  <div
    class="login-block"
  >
    <div
      id="header"
      class="d-flex justify-center align-center"
    >
      <span>Auto LB</span>
    </div>
    <v-card
      class="d-flex align-center"
      flat
      style="background: #F5F5F5;"
      height="100%"
    >
      <v-card
        class="mx-auto mb-14"
        width="456"
        color="white"
      >
        <AuthenticationForm />
      </v-card>
    </v-card>
  </div>
</template>

<script>
import AuthenticationForm from "../../components/Form/AuthenticationForm";

export default {
  name: "index",
  components: {
    AuthenticationForm
  },
}
</script>

<style>

  .login-block {
    height: 100%;
  }

  #header {
    position: sticky;
    top: 0;
    z-index: 20;
    height: 59px;
    background: white;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.12);
    border-radius: 0px 4px 4px 0px;
  }

  #header span {
    font-weight: 500;
  }

</style>
