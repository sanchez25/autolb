<template>
  <v-card>
    <v-card-title>
      <v-card-text
          class="pa-0"
          style="width: auto"
      >
        <v-dialog v-model="dialogFilter" max-width="360px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                elevation="0"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon
                  :color="colorFilter"
              >mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-card-text
                class="pt-0 pb-0"
            >
              <v-select
                  label="Владелец"
                  :items="getOwners()"
                  v-model="usernameFilter"
                  clearable
              ></v-select>
            </v-card-text>
            <v-card-text
                class="pt-0 pb-0"
            >
              <v-select
                  label="Статус"
                  :items="statusList"
                  v-model="statusFilter"
                  clearable
              ></v-select>
            </v-card-text>
            <v-card-text
                class="pt-0 pb-0"
            >
              <v-autocomplete
                  v-model="geoFilter"
                  :items="getListGeo()"
                  label="ГЕО"
                  clearable
              ></v-autocomplete>
            </v-card-text>
            <v-card-text
                class="pt-0 pb-0"
            >
              <v-autocomplete
                  v-model="brandFilter"
                  :items="getListBrand()"
                  label="Бренд"
                  clearable
              ></v-autocomplete>
            </v-card-text>
            <v-card-text
                class="pt-0 pb-0"
            >
              <v-btn
                  color="primary"
                  dark
                  elevation="0"
                  @click="RefreshFilter"
              >
                Применить
              </v-btn>
            </v-card-text>
          </v-list>
        </v-dialog>
        <v-dialog v-model="dialogPickers" max-width="360px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                elevation="0"
                class="ml-3"
            >
              <v-icon
                  color="grey darken-1"
              >
                mdi-download
              </v-icon>
            </v-btn>
          </template>
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
                    @click="downloadStat(selected, date_start, date_end)"
                    :disabled="!valid"
                >
                  Получить
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        class="mt-0 pt-0 mr-3"
        clearable
        label="Поиск"
        placeholder="Введите"
        single-line
        hide-details
        @keydown.enter.prevent="searchPosts"
      ></v-text-field>
      <v-btn
          color="primary"
          @click="searchPosts"
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
      :items="posts"
      :single-select="singleSelect"
      item-key="project_id"
      show-select
      checkbox-color="blue darken-2"
      class="table-posting"
      :items-per-page="itemsPerPage"
      hide-default-footer
    >
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="959px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between">
              <span>Информация о постинге</span>
              <v-btn
                icon
                color="grey lighten-1"
                @click="closeEdit"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Название:
              </span>
              <span>{{ editedItem.main_page }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Статус:
              </span>
              <span
                :class="getColor(editedItem.status, editedItem.is_posting)"
              >
                {{ getStatus(editedItem.status, editedItem.is_posting) }}
              </span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                День цикла:
              </span>
              <span>{{ editedItem.current_day }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Количество успехов за цикл:
              </span>
              <span>{{ editedItem.current_count_posting }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Количество подпроектов:
              </span>
              <span>{{ editedItem.urls.length }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >История постинга, дни:</span>
              <span>{{ editedItem.history_days_posting + editedItem.current_day }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Категория:
              </span>
              <span>{{ editedItem.category }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                История постинга, количество:
              </span>
              <span>{{ editedItem.history_count_posting + editedItem.current_count_posting }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Владелец:
              </span>
              <span>{{ editedItem.owner_login }}</span>
            </v-card-text>
            <v-card-text>
              <v-btn
                color="blue darken-2"
                text
                @click="show = !show"
                class="hide-btn pr-0 pl-0"
              >
                {{ show ? 'Скрыть подпроекты' : 'Показать подпроекты' }}
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-text>
            <v-card-text
              v-show="show"
            >
              <MainSubProjects
                :subposts="editedItem.urls"
                :stories="editedItem.history"
                :count_posting="editedItem.count_posting"
                :days_posting="editedItem.days_posting"
                :weight_sum="editedItem.weight_sum"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogStop" max-width="360px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Остановка проекта</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="dialogStop = false;"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите остановить проект?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="dialogStop = false;"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  id="stop"
                  @click="stopProject(editedItem.project_id)"
              >
                Остановить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogRun" max-width="360px">
          <v-card
              :id="editedItem.project_id"
          >
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Запуск проекта</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="dialogRun = false;"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите запустить проект?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="dialogRun = false;"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="runProject(editedItem.project_id, editedItem.status, editedItem.current_count_posting, editedItem.current_day)"
              >
                Запустить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:header.main_page="{ header }">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <span
                v-bind="attrs"
                v-on="on"
            >{{ header.text }}</span>
          </template>
          <span>Домен сайта</span>
        </v-tooltip>
      </template>
      <template v-slot:header.count="{ header }">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <span
                v-bind="attrs"
                v-on="on"
            >{{ header.text }}</span>
          </template>
          <span>Количество конкретных url адресов</span>
        </v-tooltip>
      </template>
      <template v-slot:header.history="{ header }">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <span
                v-bind="attrs"
                v-on="on"
            >{{ header.text }}</span>
          </template>
          <span>Один успех равен одной ссылке</span>
        </v-tooltip>
      </template>
      <template v-slot:item.count="{ item }">
        <span>{{ item.urls.length }}</span>
      </template>
      <template v-slot:item.success="{ item }">
        <span>{{ item.count_posting }}</span>
      </template>
      <template v-slot:item.days="{ item }">
        <span>{{ item.current_day + item.history_days_posting }}</span>
      </template>
      <template v-slot:item.history="{ item }">
        <span>{{ item.history_count_posting + item.current_count_posting }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              :class="getColor(item.status, item.is_posting)"
            >
              {{ getStatus(item.status, item.is_posting) }}
            </span>
          </template>
          <span>{{ getStatusText(item.status, item.is_posting) }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink
                  :to="{name: 'projects', query: {post: item.main_page}}"
                  class="text-decoration-none"
              >
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pa-2 rounded-circle ma-1"
                    style="background: #F5F5F5"
                >
                  mdi-link
                </v-icon>
              </NuxtLink>
            </template>
            <span>Открыть в проектах</span>
          </v-tooltip>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="pa-2 rounded-circle ma-1"
                :class="getIcon(item.status)"
                style="background: #F5F5F5"
                @click="openDialog(item, item.status)"
              >
                mdi-play
              </v-icon>
            </template>
            <span>{{ getText(item.status) }}</span>
          </v-tooltip>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="pa-2 rounded-circle ma-1"
                  style="background: #F5F5F5"
                  @click="editItem(item)"
              >
                mdi-eye
              </v-icon>
            </template>
            <span>Информация о постинге</span>
          </v-tooltip>
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
import MainSubProjects from "./MainSubProjects";
export default {
  name: "MainTable",
  components: {
    MainSubProjects
  },
  props: {
    owners: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      posts: [],
      statusList: ['Остановлен', 'Работает', 'Ошибка', 'Отработал', 'На модерации'],
      dialog: false,
      dialogRun: false,
      dialogStop: false,
      dialogFilter: false,
      dialogPickers: false,
      show: false,
      selected: [],
      singleSelect: false,
      headers: [
        {
          text: 'Название',
          align: 'start',
          value: 'main_page',
          sortable: true
        },
        { text: 'Количество подпроектов', value: 'count', sortable: false },
        { text: 'Цель на месяц', value: 'success', sortable: false },
        { text: 'Длительность, сумма', value: 'days', sortable: false },
        { text: 'Успехи, сумма', value: 'history', sortable: true },
        { text: 'Владелец', value: 'owner_login', sortable: true },
        { text: 'Статус постинга', value: 'status', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      editedItem: {
        name: '',
        count: 0,
        success: '',
        days: '',
        history: '',
        status: '',
        urls: []
      },
      editedIndex: -1,
      defaultItem: {
        name: '',
        count: 0,
        success: '',
        days: '',
        history: '',
        status: '',
        urls: []
      },
      is_resume: true,
      project_id: '',
      page: 1,
      totalPages: 0,
      itemsPerPage: 20,
      pageSizes: [20, 50, 100],
      totalCount: 0,
      valid: false,
      menu: false,
      menu2: false,
      date_start: '',
      date_end: '',
    }
  },
  methods: {
    searchPosts() {
      this.page = 1
      this.RefreshPosts()
    },
    changeItemPerPage() {
      this.page = 1
      this.RefreshPosts()
    },
    changePage() {
      this.RefreshPosts()
    },
    RefreshFilter() {
      this.dialogFilter = false
      this.page = 1
      this.RefreshPosts()
    },
    async RefreshPosts () {
      try{
        const owner_list = this.owners
        let owner = ''
        const geoName_list = this.geoList
        let geo_id = ''
        const brandName_list = this.brandList
        let brand_id = ''
        let data = {
          skip: (this.page - 1) * this.itemsPerPage,
          limit: this.itemsPerPage,
        }
        if (this.search != null) {
          data['main_page'] = this.search
        }
        if (this.usernameFilter != null) {
          for (const index in owner_list) {
            if (owner_list[index]['username'] == this.usernameFilter) {
              owner = owner_list[index]['user_id']
            }
          }
          data['user_id'] = owner
        }
        if (this.geoFilter != null) {
          for (const index in geoName_list) {
            if (geoName_list[index]['country_code'] == this.geoFilter) {
              geo_id = geoName_list[index]['geo_id']
            }
          }
          data['geo_id'] = geo_id
        }
        if (this.brandFilter != null) {
          for (const index in brandName_list) {
            if (brandName_list[index]['name'] == this.brandFilter) {
              brand_id = brandName_list[index]['brand_id']
            }
          }
          data['brand_id'] = brand_id
        }
        if (this.statusFilter != null) {
          if (this.statusFilter == 'Остановлен') {
            data['status'] = 1
            this.getColorFilter()
          }
          if (this.statusFilter == 'Работает') {
            data['status'] = 2
            data['is_posting'] = true
          }
          if (this.statusFilter == 'Отработал') {
            data['status'] = 2
            data['is_posting'] = false
          }
          if (this.statusFilter == 'Ошибка') {
            data['status'] = 3
          }
          if (this.statusFilter == 'На модерации') {
            data['status'] = 4
          }
        }
        const response = await this.$axios.$post('/frontend/api/project/filter', data, {
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
        this.posts = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    closeEdit() {
      this.dialog = false
      this.show = false
    },
    getStatus (status, posting) {
      const obj = {
        1: 'Остановлен',
        2: 'Работает',
        3: 'Ошибка',
        4: 'Отработал',
        5: 'На модерации'
      }
      if (status == 1) {
        return obj[1]
      } else if(status == 2 && posting == true) {
        return obj[2]
      } else if(status == 2 && posting == false) {
        return obj[4]
      } else if(status == 3) {
        return obj[3]
      } else if(status == 4) {
        return obj[5]
      }
    },
    getStatusText (status, posting) {
      const obj = {
        1: 'Проект остановлен',
        2: 'Постинг работает',
        3: 'Постинг остановлен из-за нехватки текстов',
        4: 'Достигнуто требуемое количество успехов за день',
        5: 'Проект готов к постингу и ожидает запуска'
      }
      if (status == 1) {
        return obj[1]
      } else if(status == 2 && posting == true) {
        return obj[2]
      } else if(status == 2 && posting == false) {
        return obj[4]
      } else if(status == 3) {
        return obj[3]
      } else if(status == 4) {
        return obj[5]
      }
    },
    getColor (color, isPosting) {
      if (color == 4) {
        return 'text-stop'
      } else if (color == 3) {
        return 'text-error'
      } else if (color == 2 && isPosting == true) {
        return 'text-green'
      } else if (color == 2 && isPosting == false) {
        return 'text-blue'
      } else if (color == 1) {
        return 'text-violet'
      } else {
        return ''
      }
    },
    getColorFilter () {
      return 'blue-icon'
    },
    getIcon (status) {
      if (status == 2) return 'icon-pause'
      else return ''
    },
    getText (text) {
      if (text == 2) return 'Остановить проект'
      else return 'Запустить проект'
    },
    openDialog (item, status) {
      this.editedIndex = this.posts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if(status == 2) {
        this.dialogStop = true
      } else if(status == 1 || status == 4) {
        this.dialogRun = true
      }
    },
    editItem (item) {
      this.editedIndex = this.posts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async runProject(project_id, status, current_count_posting, current_day) {
      try {
        if (current_count_posting == 0 && current_day == 0) {
          this.is_resume = false
        } else {
          this.is_resume = true
        }
        const response = await this.$axios.post('/api/background_tasks/post_project', {
          is_resume: this.is_resume,
          project_id: project_id
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }})
        this.dialogRun = false
        this.refreshProjects()
      }
      catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async stopProject(project_id) {
      try {
        this.dialogStop = false
        const response = await this.$axios.post('/api/project/stop_project', {
          project_id: project_id,
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.refreshProjects()
      }
      catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    refreshProjects() {
      setTimeout(() => {
        this.RefreshPosts()
      }, 1000);
    },
    getOwners() {
      const owner_list = this.owners
      const username_list = []
      for (const owner in owner_list) {
        username_list.push(owner_list[owner]['username'])
      }
      return username_list
    },
    async getGeo() {
      try {
        let data = {
          skip: 0,
          limit: 1000,
        }
        const response = await this.$axios.$post('/frontend/api/project/filter_geo', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.geoList = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async getBrand() {
      try {
        let data = {
          skip: 0,
          limit: 1000,
        }
        const response = await this.$axios.$post('/frontend/api/project/filter_brand', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.brandList = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    getListGeo() {
      const geo_list = this.geoList
      const geoName_list = []
      for (const geo in geo_list) {
        geoName_list.push(geo_list[geo]['country_code'])
      }
      return geoName_list
    },
    getListBrand() {
      const brand_list = this.brandList
      const brandName_list = []
      for (const brand in brand_list) {
        brandName_list.push(brand_list[brand]['name'])
      }
      return brandName_list
    },
    dateCalendar(data) {
      data = new Date()
      return data
    },
    async downloadStat(project_url, date, dateLast) {
      try {
        const select_list = project_url
        const select_id_list = []
        for (const select_id in select_list) {
          select_id_list.push(select_list[select_id]['project_id'])
        }
        this.dialogPickers = false
        this.$refs.form.reset()
        this.$notifier.showMessage({ content: 'Идет скачивание', color: 'primary' })
        const response = await this.$axios.post('/frontend/api/project/get_zip_urls_from_result_posting', {
          projects_id: select_id_list,
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
        link.setAttribute('download', `result.zip`);
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
  },
  mounted () {
    const searchParams = this.$route.query.project
    if (searchParams) {
      this.search = searchParams
    }
    this.$store.dispatch('filter/loadFilter')
    this.$store.dispatch('filter/loadStatusFilter')
    this.$store.dispatch('filter/loadGeoFilter')
    this.$store.dispatch('filter/loadBrandFilter')
    this.RefreshPosts()
    this.getGeo()
    this.getBrand()
  },
  computed: {
    colorFilter() {
      return this.usernameFilter || this.statusFilter || this.geoFilter || this.brandFilter ? 'primary' : 'grey darken-1'
    },
    usernameFilter: {
      get() {
        return this.$store.state.filter.filters.username
      },
      set(value) {
        this.$store.dispatch('filter/saveFilter', {username: value})
      }
    },
    statusFilter: {
      get() {
        return this.$store.state.filter.filters.status
      },
      set(value) {
        this.$store.dispatch('filter/saveStatusFilter', {status: value})
      }
    },
    geoFilter: {
      get() {
        return this.$store.state.filter.filters.geo
      },
      set(value) {
        this.$store.dispatch('filter/saveGeoFilter', {geo: value})
      }
    },
    brandFilter: {
      get() {
        return this.$store.state.filter.filters.brand
      },
      set(value) {
        this.$store.dispatch('filter/saveBrandFilter', {brand: value})
      }
    },
  },
}
</script>

<style>

  .custom-footer {
    flex-wrap: wrap;
    font-size: 0.75rem;
    border-top: thin solid rgba(0, 0, 0, 0.12);
  }

  .custom-select {
    flex: 0 0 0;
    white-space: nowrap;
  }

  .custom-select-text {
    font-size: 0.75rem;
  }

  .table-posting th {
    cursor: pointer;
  }

  .table-posting th:nth-child(3) {
    width: 135px;
  }

  .table-posting th:nth-child(4) {
    width: 120px;
  }

  .table-posting th:nth-child(5) {
    width: 125px;
  }

  .table-posting th:nth-child(6) {
    width: 100px;
  }

  .hide-btn {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 500;
  }

  .icon-pause:before {
    content: "\F04DB";
  }

  .text-stop {
    color: #F2C94C;
  }

  .text-error {
    color: #EB5757;
  }

  .text-green {
    color: #4CAF50;
  }

  .text-blue {
    color: #1e88e5;
  }

  .text-violet {
    color: #7b1fa2;
  }

  .blue-icon:before {
    content: "\F03E4";
  }

  @media (max-width: 1263px) {
    .table-posting th:nth-child(3) {
      width: auto;
    }

    .table-posting th:nth-child(4) {
      width: auto;
    }

    .table-posting th:nth-child(5) {
      width: auto;
    }

    .table-posting th:nth-child(6) {
      width: auto;
    }
  }

</style>
