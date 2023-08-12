<template>
  <v-card-text>
    <v-data-table
      :headers="theads"
      :items="subprofiles"
      class="table-subprofiles elevation-1"
    >
      <template v-slot:item.up_time="{ item }">
          <span
              :class="getSubColor(item.up_time)"
          >
            {{ item.up_time }}%
          </span>
      </template>
      <template v-slot:item.attempts="{ item }">
        <span>{{ attemptsPosts(item.count_posting, item.error_posting) }} / {{ item.count_posting }}</span>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script>
export default {
  name: "ProfilesSubTable",
  props: {
    domain_id: {
      type: String,
      required: true
    },
    closeInfo: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      subprofiles: [],
      theads: [
        {
          text: 'Имя',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Попытки постинга (успех/общее)', value: 'attempts', sortable: false },
        { text: 'Uptime', value: 'up_time', sortable: false },
        { text: 'Количество авторизаций', value: 'count_auth', sortable: false },
      ],
    }
  },
  async fetch() {
    this.subprofiles = await this.RefreshSubProfiles()
  },
  methods: {
    refreshTable() {
      this.$fetch()
    },
    async RefreshSubProfiles() {
      try{
        let data = {
          skip: 0,
          limit: 100,
          domain_id: this.domain_id
        }
        const response = await this.$axios.$post('/frontend/api/profile/filter', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        return response.data[0]['urls']
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    attemptsPosts(count, error) {
      return count - error
    },
    getSubColor (color) {
      if (color < 40) {
        return 'text-error'
      } else if (color > 40 && color < 70 ) {
        return 'text-stop'
      } else if (color > 70 ) {
        return 'text-green'
      }
    },
  }
}
</script>

<style>

  .table-subprofiles th:nth-child(2) {
    width: 150px;
  }

</style>

