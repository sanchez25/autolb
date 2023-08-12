<template>
  <v-progress-linear
      :value="getLengthPacksPercent(service_packs)"
      height="25"
      color="primary"
      rounded
      style="background: #F5F5F5"
  >
    <strong class="service-packs">{{ getLengthPacks(service_packs) }} из {{ this.totalCountMax }}</strong>
  </v-progress-linear>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    service_packs: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      totalCountMax: 0
    }
  },
  methods: {
    async getTotalCount() {
      let data = {
        skip: 0,
        limit: 1,
      }
      const response = await this.$axios.$post('/frontend/api/profile/filter_packs', data, {
        headers: {
          'Authorization' : this.$auth.strategy.token.get()
        }
      })
      this.totalCountMax = response.meta.total_count
    },
    getLengthPacksPercent(arrayPacksPercent) {
      const packs_list = arrayPacksPercent
      return Math.round(packs_list.length / this.totalCountMax * 100) + '%'
    },
    getLengthPacks(arrayPacks) {
      const packs_list = arrayPacks
      return packs_list.length
    },
  },
  mounted() {
    this.getTotalCount()
  }
}
</script>

<style scoped>

.service-packs {
  color: #fff;
}

</style>