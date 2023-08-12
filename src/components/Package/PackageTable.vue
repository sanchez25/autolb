<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialog" max-width="650px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
              elevation="0"
          >
            <v-icon
                class="pr-2"
            >
              mdi-plus
            </v-icon>
            Добавить
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 justify-space-between">
            <span>Новый профиль</span>
            <v-btn
                icon
                color="grey lighten-1"
                @click="closeAddProfile"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-card-text>
              <v-file-input
                  label="Загрузить файл"
                  prepend-icon="mdi-file-plus"
                  outlined
                  id="file"
                  v-model="fileValue"
                  dense
                  class="mt-2"
                  required
                  hide-details="true"
              ></v-file-input>
            </v-card-text>
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
                      v-model="buy_day"
                      clearable
                      label="Выберите дату покупки"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="buy_day"
                    @input="menu = false"
                    locale="ru"
                ></v-date-picker>
              </v-menu>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Разделитель:
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="delimiter"
                    solo
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    required
                    label="Введите разделитель (\t, \n...)"
                    hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Названипе пака:
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="pack"
                    solo
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    required
                    label="Введите название пака"
                    hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Комментарий:
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="comment"
                    solo
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    required
                    label="Введите комментарий"
                    hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Источник:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    :items="getSource()"
                    label="Введите источник профилей"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    solo
                    v-model="source_name"
                    required
                    hide-details="true"
                ></v-select>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Цена пака:
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="price"
                    solo
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    required
                    label="Введите цену пака"
                    hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="closeAddProfile"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="addProfile"
                  :disabled="!valid"
              >
                Добавить
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          class="mt-0 pt-0 mr-3"
          clearable
          label="Поиск"
          placeholder="Введите"
          single-line
          hide-details
          @keydown.enter.prevent="searchPackages"
      ></v-text-field>
      <v-btn
          color="primary"
          @click="searchPackages"
      >
        <v-icon
        >
          mdi-magnify
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="packages"
        :single-select="singleSelect"
        item-key="name"
        show-select
        checkbox-color="blue darken-2"
        class="table-packages"
        hide-default-footer
        :items-per-page="itemsPerPage"
    >
      <template v-slot:item.buy_day="{ item }">
        <span>{{ formatData(item.buy_day) }}</span>
      </template>
      <template v-slot:item.created_date="{ item }">
        <span>{{ formatData(item.created_date) }}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <span>{{ item.price }}$</span>
      </template>
      <template v-slot:item.price_one_profile="{ item }">
        <span>{{ item.price_one_profile }}$</span>
      </template>
      <template v-slot:footer>
        <div class="d-flex pl-2 pr-2 align-center custom-footer">
          <div class="d-flex justify-end align-center mr-3 ml-auto custom-select">
            <span>Rows per Page:</span>
            <v-select
                v-model="itemsPerPage"
                :items="pageSizes"
                @change="changeItemPerPage"
                hide-details
                class="pt-0 mt-3 mb-3 ml-8 custom-select-text"
            ></v-select>
          </div>
          <div class="text-center ml-2 mr-4" v-if="totalCount > (page - 1) * itemsPerPage + itemsPerPage">
            {{(page - 1) * itemsPerPage + 1}}-{{(page - 1) * itemsPerPage + itemsPerPage}} of {{totalCount}}
          </div>
          <div class="text-center ml-2 mr-4" v-else>
            {{(page - 1) * itemsPerPage + 1}}-{{totalCount}} of {{totalCount}}
          </div>
          <div>
            <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="0"
                @input="changePage"
                class="custom-pagination"
            ></v-pagination>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "PackageTable",
  props: {
    sources: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      singleSelect: false,
      selected: [],
      packages: [],
      headers: [
        {
          text: 'Имя пака',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Источник', value: 'source', sortable: false },
        { text: 'Комментарий', value: 'comment', sortable: false },
        { text: 'Дата покупки', value: 'buy_day', sortable: false },
        { text: 'Дата добавления', value: 'created_date', sortable: false },
        { text: 'Цена', value: 'price', sortable: false },
        { text: 'Цена профиля', value: 'price_one_profile', sortable: false },
        { text: 'Количество строк', value: 'count_profiles', sortable: false }
      ],
      delimiter: '',
      pack: '',
      comment: '',
      source_name: '',
      price: 0,
      dialog: false,
      valid: false,
      fileValue: null,
      menu: false,
      buy_day: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      page: 1,
      totalPages: 0,
      itemsPerPage: 20,
      pageSizes: [20, 50, 100],
      totalCount: 0
    }
  },
  async fetch() {
    this.packages = await this.RefreshPackages()
  },
  methods: {
    getSource() {
      const source_list = this.sources
      const source_name_list = []
      for (const source in source_list) {
        source_name_list.push(source_list[source]['name'])
      }
      return source_name_list
    },
    searchPackages() {
      this.page = 1
      this.$fetch()
    },
    changeItemPerPage() {
      this.page = 1
      this.$fetch()
    },
    changePage() {
      this.$fetch()
    },
    closeAddProfile() {
      this.dialog = false
      this.$refs.form.reset()
      this.isFormDisabled = false
      this.fileValue = null
    },
    async RefreshPackages() {
      try {
        let data = {
          skip: (this.page - 1) * this.itemsPerPage,
          limit: this.itemsPerPage,
        }
        if (this.search != null) {
          data['name'] = this.search
        }
        const response = await this.$axios.$post('/frontend/api/profile/filter_packs', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        if (response.meta.total_count < this.itemsPerPage) {
          this.totalPages = 1
        } else if ((response.meta.total_count % this.itemsPerPage) == 0) {
          this.totalPages = response.meta.total_count / this.itemsPerPage
        } else {
          this.totalPages = response.meta.total_count / this.itemsPerPage + 1
        }
        this.totalCount = response.meta.total_count
        return response.data
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    formatData(value) {
      const options = {}
      return new Intl.DateTimeFormat('ru', options).format(new Date(value))
    },
    async addProfile() {
      try {
        const source_list = this.sources
        let source = ''
        for (const index in source_list) {
          if (source_list[index]['name'] == this.source_name) {
            source = source_list[index]['source_id']
          }
        }
        let formData = new FormData();
        formData.append("file", document.getElementById('file').files[0]);
        formData.append("delimiter", `${this.delimiter}`);
        formData.append("pack", `${this.pack}`);
        formData.append("comment", `${this.comment}`);
        formData.append("source", `${source}`);
        formData.append("price", `${this.price}`);
        formData.append("buy_day", `${this.buy_day}`);
        const response = await this.$axios.post('/frontend/api/profile/add_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.$nuxt.refresh()
        this.dialog = false
        this.$refs.form.reset()
        this.fileValue = null
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
  },
  mounted () {
    this.valid = false
  },
}
</script>

<style scoped>

</style>