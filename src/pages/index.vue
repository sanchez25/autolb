<template>
  <MainTable :owners="owner.data" />
</template>

<script>
import MainTable from "../components/Main/MainTable";
export default {
  name: "MainPage",
  layout: 'dashboard',
  components: {
    MainTable
  },
  async asyncData({ $axios }) {
    const owner_response = await $axios.post('/frontend/api/user/filter', {
      headers: {
        'content-type': 'application/json'
      }
    })
    const owner = owner_response.data
    return { owner };
  },
}
</script>

<style>

</style>
