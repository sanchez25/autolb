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
            <span>Новый проект</span>
            <v-btn
              icon
              color="grey lighten-1"
              @click="closeAddProject"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form
            ref="form"
            v-model="valid"
            class="pl-2 pr-2"
          >
            <v-card-text>
              <p
                class="mb-2 font-weight-medium"
              >
                Домен:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  v-model="main_page"
                  :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                  solo
                  label="Введите название проекта"
                  hide-details="true"
                  required
                  type="text"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2 font-weight-medium"
              >
                Вес главной страницы:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  v-model="weight_main_page"
                  :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                  solo
                  label="Введите вес (по умолчанию, 100)"
                  hide-details="true"
                  required
                  type="text"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Бренд главной страницы:
              </p>
              <p
                  class="mb-0"
              >
                <v-autocomplete
                    v-model="brand_id_main_page"
                    :items="getListBrand()"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    solo
                    label="Введите бренд"
                    required
                    hide-details="true"
                ></v-autocomplete>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                ГЕО главной страницы:
              </p>
              <p
                  class="mb-0"
              >
                <v-autocomplete
                    v-model="geo_id_main_page"
                    :items="getListGeo()"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    solo
                    label="Введите ГЕО"
                    required
                    hide-details="true"
                ></v-autocomplete>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Продвигаемый ключ:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    v-model="promoted_key_id_main_page"
                    :items="getListPromoKey()"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    solo
                    label="Введите ключ"
                    required
                    hide-details="true"
                ></v-select>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Категория (не обязательное поле):
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="category"
                    solo
                    label="Введите категорию"
                    hide-details="true"
                    type="text"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2 font-weight-medium"
              >
                Список подпроектов (URL):
              </p>
              <p
                class="mb-0"
              >
                <v-textarea
                  solo
                  auto-grow
                  label="url,вес,бренд,гео,ключ\n url,вес,бренд,гео,ключ\n"
                  v-model="urls"
                  rows="4"
                  row-height="30"
                  hide-details="true"
                  type="array"
                ></v-textarea>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                class="mb-2 font-weight-medium"
              >
                Количество успехов в день:
              </p>
              <p
                class="mb-0"
              >
                <v-text-field
                  v-model="count_posting"
                  :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                  solo
                  label="Введите число успехов"
                  hide-details="true"
                  required
                  type="text"
                ></v-text-field>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Владелец:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                  :items="getOwners()"
                  label="Выберите владельца"
                  :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                  solo
                  v-model="username"
                  required
                ></v-select>
              </p>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                color="grey darken-1"
                text
                @click="closeAddProject"
              >
                Отменить
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="addProject"
                :disabled="!valid"
              >
                Добавить
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-card-text
          class="pt-0 pb-0 pr-4 pl-4"
          style="width: auto;"
      >
        <v-dialog v-model="dialogFilter" max-width="360px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                elevation="0"
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
      </v-card-text>
      <v-card-text
          class="pt-0 pb-0 pr-4 pl-4"
          style="width: auto;"
      >
        <v-checkbox
            v-model="archiveFilter"
            label="Показать архивные проекты"
            @click="RefreshFilter"
        ></v-checkbox>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        clearable
        label="Поиск"
        placeholder="Введите"
        class="pt-0 mt-0 mr-3"
        single-line
        hide-details
        @keydown.enter.prevent="searchProjects"
      ></v-text-field>
      <v-btn
          color="primary"
          @click="searchProjects"
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
      :items="projects"
      :single-select="singleSelect"
      item-key="project_id"
      show-select
      checkbox-color="blue darken-2"
      class="table-projects"
      :items-per-page="itemsPerPage"
      hide-default-footer
    >
      <template v-slot:top>
        <v-dialog v-model="dialogEdit" max-width="1400px">
           <ProjectsSubTable
              :name_sub="editedItem.main_page"
              :date_sub="editedItem.created_date"
              :subprojects="editedItem.urls"
              :id="editedItem.project_id"
              :owner="editedItem.owner_login"
              :close-edit="closeEdit"
              :open-edit="openEdit"
              :refresh-modal="refreshModal"
              :format-data="formatData"
              :urls-add="urlsAdd"
              :count_posting="editedItem.count_posting"
              :days_posting="editedItem.days_posting"
              :weight_sum="editedItem.weight_sum"
              :edit_item="editedItem"
              :refresh-projects="RefreshProjects"
              @changeTag="updateEditItemTags"
          />
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="360px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Удаление</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="dialogDelete = false;"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите удалить проект?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="dialogDelete = false;"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteProject(editedItem.project_id)"
              >
                Удалить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogAddArchive" max-width="360px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Добавить в архив</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="dialogAddArchive = false;"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите добавить проект в архив?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="dialogAddArchive = false;"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="addToArchive(editedItem.project_id, editedItem.is_archive)"
              >
                Добавить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDeleteArchive" max-width="360px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <span>Восстановить из архива</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="dialogDeleteArchive = false;"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pl-4 pr-4">
              Вы действительно хотите восстановить проект из архива?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="dialogAddArchive = false;"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="addToArchive(editedItem.project_id, editedItem.is_archive)"
              >
                Восстановить
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
      <template v-slot:header.count_posting_per_day="{ header }">
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
      <template v-slot:header.count_posting="{ header }">
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
      <template v-slot:item.date="{ item }">
        <span>{{ formatData(item.created_date) }}</span>
      </template>
      <template v-slot:item.count="{ item }">
        <span>{{ item.urls.length }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink
                  :to="{name: 'index', query: {project: item.main_page}}"
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
            <span>Открыть в постинге</span>
          </v-tooltip>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  @click="openDialogArchive(item, item.is_archive)"
                  class="pa-2 rounded-circle ma-1"
                  style="background: #F5F5F5"
              >
                {{ getIcon(item.is_archive) }}
              </v-icon>
            </template>
            <span>{{ getText(item.is_archive) }}</span>
          </v-tooltip>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                @click="editItem(item)"
                class="pa-2 rounded-circle ma-1"
                style="background: #F5F5F5"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Редактировать проект</span>
          </v-tooltip>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                @click="openDialogDelete(item)"
                class="pa-2 rounded-circle ma-1"
                style="background: #F5F5F5"
              >
                mdi-trash-can
              </v-icon>
            </template>
            <span>Удалить проект</span>
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
import ProjectsSubTable from "./ProjectsSubTable";
export default {
  name: "ProjectsTable",
  components: {
    ProjectsSubTable
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
      singleSelect: false,
      selected: [],
      projects: [],
      show: false,
      headers: [
        {
          text: 'Название',
          align: 'start',
          sortable: true,
          value: 'main_page',
        },
        { text: 'Дата добавления', value: 'date', sortable: false },
        { text: 'Количество подпроектов', value: 'count', sortable: true },
        { text: 'Успехи, день', value: 'count_posting_per_day', sortable: true },
        { text: 'Успехи, цикл', value: 'count_posting', sortable: true },
        { text: 'Длительность цикла', value: 'days_posting', sortable: false },
        { text: 'Владелец', value: 'owner_login', sortable: true },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      project_id: '',
      username: '',
      main_page: '',
      brand_id_main_page: '',
      geo_id_main_page: '',
      promoted_key_id_main_page: '',
      created_date: '',
      weight_main_page: 100,
      urls: [],
      count_posting: 0,
      days_posting: 0,
      limit_posting_on_profile_by_day: 1000,
      limit_posting_on_profile_in_hours: 1000,
      error: false,
      dialog: false,
      valid: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogFilter: false,
      dialogTags: false,
      editedIndex: -1,
      editedItem: {},
      isDisabled: true,
      isSelected: false,
      count_posting_per_day: 0,
      page: 1,
      totalPages: 0,
      itemsPerPage: 20,
      pageSizes: [20, 50, 100],
      totalCount: 0,
      brandList: [],
      geoList: [],
      promoList: [],
      category: '',
      dialogAddArchive: false,
      dialogDeleteArchive: false
    }
  },
  methods: {
    getIcon (is_archive) {
      if (is_archive == true) return 'mdi-archive-arrow-up'
      else return 'mdi-archive-arrow-down'
    },
    getText (is_archive) {
      if (is_archive == true) return 'Восстановить проект из архива'
      else return 'Добавить проект в архив'
    },
    updateEditItemTags ({ key, value }) {
      this.$set(this.editedItem, key, value);
    },
    searchProjects() {
      this.page = 1
      this.RefreshProjects()
    },
    changeItemPerPage() {
      this.page = 1
      this.RefreshProjects()
    },
    changePage() {
      this.RefreshProjects()
    },
    RefreshFilter () {
      this.dialogFilter = false
      this.page = 1
      this.RefreshProjects()
    },
    async RefreshProjects() {
      try {
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
        if (this.archiveFilter == true) {
          data['is_archive'] = true
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
        this.projects = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async addProject() {
      try {
        const owner_list = this.owners
        let owner = ''
        for (const index in owner_list) {
          if (owner_list[index]['username'] == this.username) {
            owner = owner_list[index]['user_id']
          }
        }
        const brand_list = this.brandList
        let brand = ''
        for (const index in brand_list) {
          if (brand_list[index]['name'] == this.brand_id_main_page) {
            brand = brand_list[index]['brand_id']
          }
        }
        const geo_list = this.geoList
        let geo = ''
        for (const index in geo_list) {
          if (geo_list[index]['country_code'] == this.geo_id_main_page) {
            geo = geo_list[index]['geo_id']
          }
        }
        const promo_list = this.promoList
        let promoList = ''
        for (const index in promo_list) {
          if (promo_list[index]['name'] == this.promoted_key_id_main_page) {
            promoList = promo_list[index]['promoted_key_id']
          }
        }
        const response_add = await this.$axios.post('/frontend/api/project/add', {
          main_page: this.main_page,
          weight_main_page: this.weight_main_page,
          geo_id_main_page: geo,
          brand_id_main_page: brand,
          promoted_key_id_main_page: promoList,
          category: this.category || "",
          urls: this.urlsAdd(this.urls),
          count_posting: this.count_posting * 30,
          days_posting: 30,
          limit_posting_on_profile_by_day: this.limit_posting_on_profile_by_day,
          limit_posting_on_profile_in_hours: this.limit_posting_on_profile_in_hours,
          owner: owner
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        this.dialog = false
        this.$refs.form.reset()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    urlsAdd(text) {
      const urls = [];
      if( text.length == 0 ) {
        return urls
      } else if( text.length !== 0 ) {
        const myArray = text.split("\n");
        for (const url_weight in myArray) {
          const url = myArray[url_weight].split(',')[0]
          const weight = myArray[url_weight].split(',')[1]

          const brand = myArray[url_weight].split(',')[2]
          const brand_list = this.brandList
          let brandNew = ''
          for (const index in brand_list) {
            if (brand_list[index]['name'] == brand) {
              brandNew = brand_list[index]['brand_id']
            }
          }
          if(brandNew == "") {
            this.$notifier.showError({ content: "Введен некорректный бренд", color: 'red darken-2' })
          }

          const geo = myArray[url_weight].split(',')[3]
          const geo_list = this.geoList
          let geoNew = ''
          for (const index in geo_list) {
            if (geo_list[index]['country_code'] == geo) {
              geoNew = geo_list[index]['geo_id']
            }
          }
          if(geoNew == "") {
            this.$notifier.showError({ content: "Введено некорректное ГЕО", color: 'red darken-2' })
          }

          const promoKey = myArray[url_weight].split(',')[4]
          const promo_list = this.promoList
          let promoKeyNew = ''
          for (const index in promo_list) {
            if (promo_list[index]['name'] == promoKey) {
              promoKeyNew = promo_list[index]['promoted_key_id']
            }
          }
          if(promoKeyNew == "") {
            this.$notifier.showError({ content: "Введен некорректный ключ", color: 'red darken-2' })
          }

          urls.push(
            {
              'name': url,
              'weight': weight,
              'brand_id': brandNew,
              'geo_id': geoNew,
              'promoted_key_id': promoKeyNew
            }
          )
        }
        return urls
      }
    },
    formatData(value) {
      const options = {}
      return new Intl.DateTimeFormat('ru', options).format(new Date(value))
    },
    async deleteProject(project_id) {
      try {
        const response = await this.$axios.delete('/frontend/api/project/delete', {
          data: {
            project_id: project_id,
          },
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        this.dialogDelete = false
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async addToArchive(project_id, is_archive) {
      try {
        const response = await this.$axios.$post('/frontend/api/project/add_project_to_archive', {
          project_id: project_id,
          is_archive: !is_archive
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        if(!is_archive) {
          this.dialogAddArchive = false
        } else {
          this.dialogDeleteArchive = false
        }
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
    async getPromoKey() {
      try {
        let data = {
          skip: 0,
          limit: 1000,
        }
        const response = await this.$axios.$post('/frontend/api/project/filter_promoted_key', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.promoList = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    getListBrand() {
      const brand_list = this.brandList
      const brandName_list = []
      for (const brand in brand_list) {
        brandName_list.push(brand_list[brand]['name'])
      }
      return brandName_list
    },
    getListGeo() {
      const geo_list = this.geoList
      const geoName_list = []
      for (const geo in geo_list) {
        geoName_list.push(geo_list[geo]['country_code'])
      }
      return geoName_list
    },
    getListPromoKey() {
      const promo_list = this.promoList
      const promoName_list = []
      for (const promo in promo_list) {
        promoName_list.push(promo_list[promo]['name'])
      }
      return promoName_list
    },
    getOwners() {
      const owner_list = this.owners
      const username_list = []
      for (const owner in owner_list) {
        username_list.push(owner_list[owner]['username'])
      }
      return username_list
    },
    editItem(item) {
      this.editedIndex = this.projects.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },
    closeEdit() {
      this.dialogEdit = false
    },
    openEdit() {
      this.dialogEdit = true
    },
    refreshModal() {
      setTimeout(() => {
        this.RefreshProjects()
      }, 2000);
    },
    closeAddProject() {
      this.dialog = false
      this.$refs.form.reset()
    },
    openDialogDelete(item) {
      this.editedIndex = this.projects.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    openDialogArchive(item, archive) {
      this.editedIndex = this.projects.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if(archive == false) {
        this.dialogAddArchive = true
      } else if(archive == true) {
        this.dialogDeleteArchive = true
      }
    },
  },
  mounted() {
    const searchParams = this.$route.query.post
    if (searchParams) {
      this.search = searchParams
    }
    this.$store.dispatch('filter/loadFilter')
    this.$store.dispatch('filter/loadGeoFilter')
    this.$store.dispatch('filter/loadBrandFilter')
    this.$store.dispatch('filter/loadArchiveFilter')
    this.RefreshProjects()
    this.getBrand()
    this.getGeo()
    this.getPromoKey()
  },
  computed: {
    colorFilter() {
      return this.usernameFilter || this.geoFilter || this.brandFilter ? 'primary' : 'grey darken-1'
    },
    usernameFilter: {
      get() {
        return this.$store.state.filter.filters.username
      },
      set(value) {
        this.$store.dispatch('filter/saveFilter', {username: value})
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
    archiveFilter: {
      get() {
        return this.$store.state.filter.filters.archive
      },
      set(value) {
        this.$store.dispatch('filter/saveArchiveFilter', {archive: value})
      }
    },
  },
}
</script>

<style>

  .table-projects th {
    cursor: pointer;
  }

  .table-projects th:nth-child(3) {
    width: 120px;
  }

  .table-projects th:nth-child(4) {
    width: 125px;
  }

  .table-projects th:nth-child(5) {
    width: 80px;
  }

  .table-projects th:nth-child(6) {
    width: 80px;
  }

  .table-projects th:nth-child(7) {
    width: 115px;
  }

  @media (max-width: 1263px) {

    .table-projects th:nth-child(3) {
      width: auto;
    }

    .table-projects th:nth-child(4) {
      width: auto;
    }

    .table-projects th:nth-child(5) {
      width: auto;
    }

    .table-projects th:nth-child(6) {
      width: auto;
    }

    .table-projects th:nth-child(7) {
      width: auto;
    }

  }

</style>
