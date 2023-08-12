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
        <!--<v-card>
          <v-card-title class="text-h5 justify-space-between">
            <span>Новая прокси</span>
            <v-btn
              icon
              color="grey lighten-1"
              @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form
            ref="form"
            @submit.prevent="addProfile(auth.login, auth.password)"
            v-model="valid"
            lazy-validation
          >
            <v-card-text
              class="pb-0"
            >
              <v-file-input
                label="Загрузить файл"
                prepend-icon="mdi-file-plus"
                outlined
                id="file"
                v-model="fileValue"
                dense
                class="mt-2"
                @click="formDisabled"
                hide-details="true"
                required
              ></v-file-input>
            </v-card-text>
          </v-form>
          <v-card-title
            class="pt-0"
          >
            <span
              class="mr-1"
            >
              ИЛИ
            </span>
            <div class="line"></div>
          </v-card-title>
          <v-form
            ref="form"
            @submit.prevent="addProfile(auth.login, auth.password)"
            v-model="valid"
            lazy-validation
            :disabled="isFormDisabled"
            class="pl-2 pr-2"
          >
            <v-card-text>
              <p
                class="mb-2"
              >
                Адрес:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  :value="editedItem.name"
                  solo
                  label="Введите ip-адрес и порт. Например 127.0.0.1:3000"
                  hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2"
              >
                Логин:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  :value="editedItem.name"
                  solo
                  label="Введите логин"
                  hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2"
              >
                Пароль:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  :value="editedItem.name"
                  solo
                  label="Введите пароль"
                  hide-details="true"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2"
              >
                Источник:
              </p>
              <v-autocomplete
                v-model="value"
                :items="items"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="grey darken-1" text @click="close">Отменить</v-btn>
              <v-btn color="blue darken-1" text @click="save">Добавить</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>-->
      </v-dialog>
      <!--<v-dialog v-model="dialogDelete" max-width="360px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="grey lighten-4"
            class="ml-2 pl-0 pr-0"
            min-width="42px"
            v-bind="attrs"
            v-on="on"
            elevation="0"
            :disabled="isDisabled"
          >
            <v-icon
              color="grey darken-1"
            >
              mdi-trash-can
            </v-icon>
          </v-btn>
        </template>
      </v-dialog>-->
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Поиск"
        placeholder="Введите"
        class="pt-0 mt-0 mr-3"
        clearable
        single-line
        hide-details
        @keydown.enter.prevent="searchProxies"
      ></v-text-field>
      <v-btn
          color="primary"
          @click="searchProxies"
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
      :items="proxies"
      :single-select="singleSelect"
      item-key="name"
      show-select
      checkbox-color="blue darken-2"
      class="table-proxy"
      hide-default-footer
      :items-per-page="itemsPerPage"
    >
      <template v-slot:top>
        <!--<v-dialog v-model="dialogEdit" max-width="650px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <div class="d-flex">
                <span>Редактирование</span>
                <v-btn
                  color="grey lighten-4"
                  class="ml-2 pl-0 pr-0"
                  min-width="42px"
                  @click="deleteItemEditConfirm"
                  elevation="0"
                >
                  <v-icon
                    color="grey darken-1"
                  >
                    mdi-trash-can
                  </v-icon>
                </v-btn>
              </div>
              <v-btn
                icon
                color="grey lighten-1"
                @click="closeEdit"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <span>Адрес: {{ editedItem.name }}</span>
            </v-card-text>
            <v-card-text>
              <span>Дата обновления: {{ editedItem.date }}</span>
            </v-card-text>
            <v-card-text>
              <span>Статус:</span>
              <v-chip
                :color="getColor(editedItem.status)"
              >
                {{ editedItem.status }}
              </v-chip>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2"
              >
                Неудачи, лимит в день:
              </p>
              <v-text-field
                :value="10"
                label="Solo"
                solo
                readonly
                hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2"
              >
                Неудачи, лимит общий:
              </p>
              <v-text-field
                :value="100"
                label="Solo"
                solo
                readonly
                hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <span>Попытки постинга, неудачные за день: 0/10</span>
            </v-card-text>
            <v-card-text>
              <span>Попытки постинга, неудачные всего: 100/100</span>
            </v-card-text>
            <v-card-text>
              <span>Попытки постинга, успешные: {{ editedItem.posting }}</span>
            </v-card-text>
            <v-card-text>
              <span>Попытки постинга, всего: {{ editedItem.posting }}</span>
            </v-card-text>
            <v-card-text>
              <span>Uptime:</span>
              <v-chip
                :color="getUptime(editedItem.uptime)"
              >
                {{ editedItem.uptime }}
              </v-chip>
            </v-card-text>
            <v-card-text>
              <v-btn
                color="blue darken-2"
                text
                @click="show = !show"
                class="hide-btn pr-0 pl-0"
              >
                {{ show ? 'Скрыть доступы' : 'Показать доступы' }}
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-text>
            <v-card-text
              v-show="show"
            >
              <v-data-table
                :headers="theads"
                :items="accesses"
                class="elevation-1"
                :hide-default-footer="true"
              >
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex">
                    <v-icon
                      small
                      @click="openItem(item)"
                      class="pa-2 rounded-circle ma-1"
                      style="background: #F5F5F5"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                      @click="deleteItemAccess(item)"
                      class="pa-2 rounded-circle ma-1"
                      style="background: #F5F5F5"
                    >
                      mdi-trash-can
                    </v-icon>
                  </div>
                </template>
              </v-data-table>
              <v-btn
                color="primary"
                dark
                class="mt-4"
                @click="add"
              >
                <v-icon
                  class="pr-2"
                >
                  mdi-plus
                </v-icon>
                Добавить доступы
              </v-btn>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="grey darken-1" text @click="closeEdit">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="saveEdit">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
        <!--<v-dialog v-model="dialogDelete" max-width="360px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Удаление</span>
              <v-btn
                icon
                color="grey lighten-1"
                @click="closeDelete"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите удалить профиль?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                color="grey darken-1"
                text
                @click="closeDelete"
              >
                Отменить
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >
                Удалить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
      </template>
      <template v-slot:item.last_update="{ item }">
        <span>{{ formatData(item.last_update) }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <span
          :class="getStatusColor(item.limit_error_by_day, item.limit_error_all)"
        >
          {{ getStatus(item.limit_error_by_day, item.limit_error_all) }}
        </span>
      </template>
      <!--<template v-slot:item.posting="{ item }">
        <td>{{ difference(item.count_posting, item.error_posting) }} / {{ item.count_posting }}</td>
      </template>-->
      <template v-slot:item.up_time="{ item }">
        <span
            :class="getColor(item.up_time)"
        >
          {{ item.up_time }}%
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-icon
            small
            class="pa-2 rounded-circle ma-1"
            style="background: #F5F5F5"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            class="pa-2 rounded-circle ma-1"
            style="background: #F5F5F5"
          >
            mdi-trash-can
          </v-icon>
        </div>
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
  name: "ProxyTable",
  data() {
    return {
      search: '',
      singleSelect: false,
      selected: [],
      proxies: [],
      show: false,
      headers: [
        {
          text: 'Адрес',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Дата обновления', value: 'last_update', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Источник', value: 'source', sortable: false },
        { text: 'Uptime', value: 'up_time', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      error: false,
      dialog: false,
      valid: false,
      dialogEdit: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        date: '',
        status: '',
        source: '',
        posting: '',
        uptime: 0,
      },
      defaultItem: {
        name: '',
        date: '',
        status: '',
        source: '',
        posting: '',
        uptime: 0,
      },
      theads: [
        {
          text: 'Логин',
          align: 'start',
          sortable: false,
          value: 'login',
        },
        { text: 'Пароль', value: 'pass', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      isDisabled: true,
      isFormDisabled: false,
      fileValue: null,
      page: 1,
      totalPages: 0,
      itemsPerPage: 20,
      pageSizes: [20, 50, 100],
      totalCount: 0
    }
  },
  /*async fetch() {
    this.proxies = await this.RefreshProxies()
  },*/
  methods: {
    searchProxies() {
      this.page = 1
      //this.$fetch()
    },
    changeItemPerPage() {
      this.page = 1
     // this.$fetch()
    },
    /*changePage() {
      this.$fetch()
    },*/
    RefreshFilter () {
      this.page = 1
     // this.$fetch()
    },
    /*async RefreshProxies () {
      let data = {
        skip: (this.page - 1) * this.itemsPerPage,
        limit: this.itemsPerPage,
      }
      if (this.search != null) {
        data['name'] = this.search
      }
      const response = await this.$axios.$post('/api/proxy/filter', data)
      if (response.meta.total_count < this.itemsPerPage) {
        this.totalPages = 1
      } else if ((response.meta.total_count % this.itemsPerPage) == 0) {
        this.totalPages = response.meta.total_count / this.itemsPerPage
      } else {
        this.totalPages = response.meta.total_count / this.itemsPerPage + 1
      }
      this.totalCount = response.meta.total_count
      return response.data
    },*/
    formatData(value) {
      const options = {}
      return new Intl.DateTimeFormat('ru', options).format(new Date(value))
    },
    editItem(item) {
      this.editedIndex = this.proxies.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },
    close() {
      this.dialog = false
    },
    closeEdit() {
      this.dialogEdit = false
    },
    customSearch(value, search, item) {
      if (Array.isArray(value)) {
        return value.some(item=>Object.values(item).some(v=>v&&v.toString().toLowerCase().includes(search)))
      }
      return Object.values(item).some(v=>v&&v.toString().toLowerCase().includes(search))
    },
    difference(count, error) {
      return count - error
    },
    getColor (color) {
      if (color < 40) {
        return 'text-error'
      } else if (color > 40 && color < 70 ) {
        return 'text-stop'
      } else if (color > 70 ) {
        return 'text-green'
      }
    },
    getStatus (limit_day, limit_all) {
      const obj = {
        1: 'temporary ban',
        2: 'permanent ban',
        3: 'active'
      }
      if (limit_day == 0 && limit_all > 0) {
        return obj[1]
      } else if (limit_all == 0) {
        return obj[2]
      } else {
        return obj[3]
      }
    },
    getStatusColor (limit_day, limit_all) {
      if (limit_day == 0 && limit_all > 0) {
        return 'text-error'
      } else if (limit_all == 0) {
        return 'text-error'
      } else {
        return ''
      }
    },
  }
}
</script>

<style>

  .table-proxy th:nth-child(3) {
    width: 170px;
  }

  .line {
    border: 1px dashed #949494;
    width: 550px;
  }

  @media (max-width: 1263px) {
    .table-proxy th:nth-child(3) {
      width: auto;
    }
  }

</style>
