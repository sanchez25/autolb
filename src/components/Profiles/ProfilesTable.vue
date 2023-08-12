<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Поиск"
        placeholder="Введите"
        class="pt-0 mt-0 mr-3"
        clearable
        single-line
        hide-details
        @keydown.enter.prevent="searchProfiles"
      ></v-text-field>
      <v-btn
          color="primary"
          @click="searchProfiles"
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
      :items="profiles"
      :single-select="singleSelect"
      item-key="main_page"
      show-select
      checkbox-color="blue darken-2"
      class="table-profiles"
      hide-default-footer
      :items-per-page="itemsPerPage"
    >
      <template v-slot:top>
        <!--<v-dialog v-model="dialogEdit" max-width="650px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
              <div class="d-flex">
                <span>Редактирование</span>
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
                  :class="getStatusColor(editedItem.limit_error_by_day, editedItem.limit_error_all)"
              >
                {{ getStatus(editedItem.limit_error_by_day, editedItem.limit_error_all) }}
              </span>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-bold"
              >
                Неудачи, лимит в день:
              </p>
              <v-text-field
                  :value="editedItem.limit_error_by_day"
                  label="Solo"
                  solo
                  readonly
                  hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-bold"
              >
                Неудачи, лимит общий:
              </p>
              <v-text-field
                  :value="editedItem.limit_error_all"
                  label="Solo"
                  solo
                  readonly
                  hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-bold"
              >
                Постинг, лимит в день:
              </p>
              <v-text-field
                  :value="editedItem.limit_posting_by_day"
                  label="Solo"
                  solo
                  readonly
                  hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-bold"
              >
                Постинг, лимит на 30 дней:
              </p>
              <v-text-field
                  :value="editedItem.limit_posting_by_month"
                  label="Solo"
                  solo
                  readonly
                  hide-details="true"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Попытки постинга, успешные:
              </span>
              <span>{{ difference(editedItem.error_posting, editedItem.count_posting) }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Попытки постинга, всего:
              </span>
              <span>{{ editedItem.count_posting }}</span>
            </v-card-text>
            <v-card-text>
              <span
                  class="font-weight-bold"
              >
                Uptime:
              </span>
              <span
                  :class="getColor(editedItem.up_time)"
              >
                {{ editedItem.up_time }}%
              </span>
            </v-card-text>
          </v-card>
        </v-dialog>-->
        <v-dialog v-model="dialogInfo" max-width="650px">
          <v-card>
            <v-card-title class="text-h5 justify-space-between mb-3">
              <span>Информация о домене</span>
              <v-btn
                  icon
                  color="grey lighten-1"
                  @click="closeInfo"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <ProfilesSubTable
                :domain_id="editedItem.domain_id"
                :close-info="closeInfo"
                ref="RefProfiles"
            />
          </v-card>
        </v-dialog>
        <!--<v-dialog v-model="dialogDelete" max-width="360px">
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
              Вы действительно хотите удалить профиль?
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
                  @click="deleteProfile(editedItem.profile_id)"
              >
                Удалить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            color="red darken-2"
            right
            top
        >
          {{ responseError }}
          <template v-slot:action="{ attrs }">
            <v-btn
                text
                v-bind="attrs"
                @click="snackbar = false"
            >
              Закрыть
            </v-btn>
          </template>
        </v-snackbar>
      </template>
      <template v-slot:item.status="{ item }">
        <span
          :class="getStatusColor(item.limit_error_by_day, item.limit_error_all)"
        >
          {{ getStatus(item.limit_error_by_day, item.limit_error_all) }}
        </span>
      </template>
      <template v-slot:item.posting="{ item }">
        <span>{{ difference(item.count_posting, item.error_posting) }} / {{ item.count_posting }}</span>
      </template>
      <template v-slot:item.uptime="{ item }">
        <span
          :class="getColor(item.up_time)"
        >
          {{ item.up_time }}%
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <!--<v-icon
            small
            @click="editItem(item)"
            class="pa-2 rounded-circle ma-1"
            style="background: #F5F5F5"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="openDialogDelete(item)"
            class="pa-2 rounded-circle ma-1"
            style="background: #F5F5F5"
          >
            mdi-trash-can
          </v-icon>-->
          <v-icon
              small
              class="pa-2 rounded-circle ma-1"
              style="background: #F5F5F5"
              @click="openInfo(item)"
          >
            mdi-eye
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
            ></v-pagination>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import ProfilesSubTable from "./ProfilesSubTable";
export default {
  name: "ProfilesTable",
  components: {
    ProfilesSubTable
  },
  data() {
    return {
      search: '',
      singleSelect: false,
      selected: [],
      profiles: [],
      show: false,
      headers: [
        {
          text: 'Домен',
          align: 'start',
          sortable: false,
          value: 'main_page',
        },
        { text: 'Статус', value: 'status', sortable: false },
        { text: 'Лимит, день', value: 'limit_posting_by_day', sortable: false },
        { text: 'Лимит, 30 дней', value: 'limit_posting_by_month', sortable: false },
        { text: 'Попытки постинга (успех/общее)', value: 'posting', sortable: false },
        { text: 'Uptime', value: 'uptime', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      profile_id: '',
      error: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogInfo: false,
      snackbar: false,
      responseError: '',
      timeout: 5000,
      editedIndex: -1,
      editedItem: {
        domain_id: '',
        urls: []
      },
      defaultItem: {
        domain_id: '',
        urls: []
      },
      page: 1,
      totalPages: 0,
      itemsPerPage: 20,
      pageSizes: [20, 50, 100],
      totalCount: 0,
    }
  },
  methods: {
    searchProfiles() {
      this.page = 1
      this.RefreshProfiles()
    },
    changeItemPerPage() {
      this.page = 1
      this.RefreshProfiles()
    },
    changePage() {
      this.RefreshProfiles()
    },
    async RefreshProfiles () {
      try {
        let data = {
          skip: (this.page - 1) * this.itemsPerPage,
          limit: this.itemsPerPage,
          domain_id: this.domain_id
        }
        if (this.search != null) {
          data['main_page'] = this.search
        }
        const response = await this.$axios.$post('/frontend/api/profile/filter', data, {
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
        this.profiles = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    /*editItem(item) {
      this.editedIndex = this.profiles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true
    },*/
    openInfo(item) {
      this.editedIndex = this.profiles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      const interval = setInterval(() => {
        if (this.$refs.RefProfiles) {
          this.$refs.RefProfiles.refreshTable()
          clearInterval(interval)
        }
      }, 1)
      setTimeout(() => {
        this.dialogInfo = true;
      }, 10);
    },
    /*openDialogDelete(item) {
      this.editedIndex = this.profiles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    closeEdit() {
      this.dialogEdit = false
    },*/
    closeInfo() {
      this.dialogInfo = false
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
    /*async deleteProfile(profile_id) {
      try {
        const response = await this.$axios.delete('/frontend/api/profile/delete', {
          data: {
            profile_id: profile_id
          },
        })
        this.$nuxt.refresh()
        this.dialogDelete = false
      } catch (error) {
        if (error.response.status == '400') {
          this.responseError = error.response.data.detail[0].description
          this.snackbar = true
        }
      }
    },*/
  },
  mounted () {
    this.RefreshProfiles()
  },
}
</script>

<style>

  .table-profiles th:nth-child(3) {
    width: 126px;
  }

  .table-profiles th:nth-child(4) {
    width: 80px;
  }

  .table-profiles th:nth-child(5) {
    width: 80px;
  }

  .table-profiles th:nth-child(6) {
    width: 140px;
  }

  .table-profiles th:nth-child(7) {
    width: 80px;
  }

  .text-green {
    color: #028928;
  }

  @media (max-width: 1263px) {
    .table-profiles th:nth-child(3) {
      width: auto;
    }

    .table-profiles th:nth-child(4) {
      width: auto;
    }

    .table-profiles th:nth-child(5) {
      width: auto;
    }

    .table-profiles th:nth-child(6) {
      width: auto;
    }

    .table-profiles th:nth-child(7) {
      width: auto;
    }
  }

</style>
