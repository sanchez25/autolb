<template>
  <v-data-table
      :headers="theads"
      :items="subposts"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-dialog v-model="dialogPickers" max-width="360px">
        <v-card>
          <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
            <span>Выбрать интервал</span>
            <v-btn
                icon
                color="grey lighten-1"
                @click="dialogPickers = false;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-card-text
                class="pb-0"
            >
              <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="date_start"
                      clearable
                      label="Выберите начальную дату"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date_start"
                    @input="menu = false"
                    locale="ru"
                ></v-date-picker>
              </v-menu>
            </v-card-text>
            <v-card-text
                class="pb-0"
            >
              <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="date_end"
                      clearable
                      label="Выберите конечную дату"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date_end"
                    @input="menu2 = false"
                    locale="ru"
                ></v-date-picker>
              </v-menu>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="blue darken-1"
                  text
                  @click="downloadStat(editItem.name, date_start, date_end)"
                  :disabled="!valid"
              >
                Получить
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.name="{ item }">
      <span>{{ splitName(item.name) }}</span>
    </template>
    <template v-slot:item.count_success="{ item }">
      <span>{{ item.all_current_count_posting }}</span>
    </template>
    <template v-slot:item.count_days="{ item }">
      <span>{{ infinity(Math.round(item.count_content / (count_posting / days_posting * item.weight / weight_sum))) }}</span>
    </template>
    <template v-slot:item.packs="{ item }">
      <ProgressBar
          :service_packs="item.service_packs"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <v-icon
            small
            class="pa-2 rounded-circle ma-1"
            style="background: #F5F5F5"
            @click="openDialogPickers(item)"
        >
          mdi-file-chart
        </v-icon>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ProgressBar from "../ProgressBar";
export default {
  name: "MainSubProjects",
  components: {
    ProgressBar,
  },
  props: {
    subposts: {
      type: Array,
      required: true
    },
    stories: {
      type: Array,
      required: true
    },
    weight_sum: {
      type: Number,
      required: true
    },
    count_posting: {
      type: Number,
      required: true
    },
    days_posting: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      subproject_url: '',
      date_start: '',
      date_end: '',
      dialogPickers: false,
      valid: false,
      theads: [
        {
          text: 'Название подпроекта',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Вес', value: 'weight', sortable: false },
        { text: 'Количество успехов', value: 'count_success', sortable: false },
        { text: 'Количество текстов', value: 'count_content', sortable: false },
        { text: 'Остаток текстов, день', value: 'count_days', sortable: false },
        { text: 'Используемые паки', value: 'packs', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      historyArray: this.stories,
      editItem: {
        name: ''
      },
      editIndex: -1,
      menu: false,
      menu2: false,
    }
  },
  methods: {
    async downloadStat(subproject_url, date, dateLast) {
      try {
        this.dialogPickers = false
        this.$refs.form.reset()
        this.$notifier.showMessage({ content: 'Идет скачивание', color: 'primary' })
        const response = await this.$axios.post('/frontend/api/project/get_urls_from_result_posting', {
          subproject_url: subproject_url,
          date_start: new Date(date),
          date_end: new Date(dateLast)
        }, {
          responseType: 'blob',
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${subproject_url}.txt`);
        document.body.appendChild(link);
        link.click();
        this.$notifier.closeMessage()
        this.$notifier.successMessage()
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    splitName(text) {
      if (text.indexOf("/") == -1) {
        return "/"
      } else {
        return text.substr(text.indexOf("/"), text.length)
      }
    },
    historyUrls(nameSubproject) {
      let historyUrl = 0
      for (const index in this.historyArray) {
        for (const index_urls in this.historyArray[index]['urls']) {
          if (nameSubproject == this.historyArray[index]['urls'][index_urls]['name']) {
            historyUrl += Number(this.historyArray[index]['urls'][index_urls]['current_count_posting'])
          }
        }
      }
      return historyUrl
    },
    infinity(data) {
      if (this.weight_sum == 0) return '-'
      else return data
    },
    openDialogPickers(item) {
      this.editIndex = this.subposts.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.dialogPickers = true
    }
  },
  watch: {
    content (arrayHistory) {
      this.historyArray = arrayHistory
    }
  },
  mounted () {
    this.valid = false
  }
}
</script>

<style>

  .subprojects th:nth-child(3) {
    width: 120px;
  }

  .subprojects th:nth-child(4) {
    width: 120px;
  }

</style>
