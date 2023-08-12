<template>
  <v-card
      :id="id"
  >
    <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
      <span>Редактирование</span>
      <v-btn
        icon
        color="grey lighten-1"
        @click="closeEdit"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p
        class="mb-2 font-weight-bold"
      >
        Название:
      </p>
      <div class="d-flex align-center">
        <p
          class="mb-0 mr-2"
        >
          {{ name_sub }}
        </p>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="pa-2 rounded-circle ma-1"
                style="background: #F5F5F5"
                @click="copyNameProject()"
            >
              mdi-content-copy
            </v-icon>
          </template>
          <span>{{ copyProject }}</span>
        </v-tooltip>
      </div>
    </v-card-text>
    <v-card-text>
      <p
        class="mb-2 font-weight-bold"
      >
        Дата добавления:
      </p>
      <p
        class="mb-0"
      >
        {{ formatData(date_sub) }}
      </p>
    </v-card-text>
    <v-card-text>
      <p
        class="mb-2 font-weight-bold"
      >
        Количество успехов за день:
      </p>
      <v-edit-dialog
          :return-value.sync="edit_item.count_posting_per_day"
      >
        {{ edit_item.count_posting_per_day }}
        <template v-slot:input>
          <v-text-field
              v-model="edit_item.count_posting_per_day_new"
              label="Редактировать"
              single-line
              counter
              @keydown.enter="save(id)"
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </v-card-text>
    <v-card-text>
      <p
          class="mb-2 font-weight-bold"
      >
        Категория:
      </p>
      <v-edit-dialog
          :return-value.sync="edit_item.category"
      >
        {{ edit_item.category }}
        <template v-slot:input>
          <v-text-field
              v-model="edit_item.categoryNew"
              label="Редактировать"
              single-line
              counter
              @keydown.enter="saveCategory(id)"
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </v-card-text>
    <v-card-text>
      <v-tooltip bottom color="primary">
        <template v-slot:activator="{ on, attrs }">
          <p
              v-bind="attrs"
              v-on="on"
              class="mb-2 font-weight-bold"
          >
            Флаг уникальности:
          </p>
        </template>
        <span class="text-center d-block">При включении данного флага,<br>
          если один из подпроектов запостился на данном профиле,<br>
          другие на нем не могут запоститься</span>
      </v-tooltip>
      <v-switch
          v-model="edit_item.one_project_one_profile"
          color="primary"
          hide-details="true"
          @click="changeFlag(id)"
          @change="changeValue('one_project_one_profile', $event)"
      ></v-switch>
    </v-card-text>
    <v-card-text>
      <p
          class="mb-2 font-weight-bold"
      >
         Владелец:
      </p>
      <div class="d-flex align-center">
        <v-select
            v-model="edit_item.user_id"
            :items="getUserId"
            class="select_user"
            @change="changeValue('user_id', $event)"
        ></v-select>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="pa-2 rounded-circle ma-1"
                style="background: #F5F5F5"
                @click="saveUser(id, edit_item.user_id)"
            >
              mdi-content-save
            </v-icon>
          </template>
          <span>Сохранить</span>
        </v-tooltip>
      </div>
    </v-card-text>
    <!--<v-card-text>
      <p
          class="mb-2 font-weight-bold"
      >
        Список тегов:
      </p>
      <v-combobox
          :value="testTags"
          @keydown.enter="addTags(id)"
          chips
          :items="getNameTags"
          clearable
          label="Добавить тег"
          multiple
          solo
          hide-details="true"
          @change="changeTags('tags', $event)"
      >
        <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click:close="removeTags(id)"
          >
            <strong>{{ item.text }}</strong>
          </v-chip>
        </template>
      </v-combobox>
    </v-card-text>-->
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
      <v-data-table
        :headers="theads"
        :items="subprojects"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-dialog v-model="dialogSubDelete" max-width="360px">
            <v-card>
              <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
                <span>Удаление</span>
                <v-btn
                    icon
                    color="grey lighten-1"
                    @click="dialogSubDelete = false;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pl-4 pr-4">
                Вы действительно хотите удалить подпроект?
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                    color="grey darken-1"
                    text
                    @click="dialogSubDelete = false;"
                >
                  Отменить
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="deleteSubProject(id, editItem.name)"
                >
                  Удалить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogContent" max-width="500px">
            <ContentModal
                :close-dialog-content="closeDialogContent"
                :project_id="id"
                :name_sub_pr="editItem.name"
                :scm_options="editItem.scm_options"
                :refresh-projects="RefreshProjects"
                @change="updateEditItemOptions"
                @changeScmId="updateEditItemScmOptions"
            />
          </v-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pa-2 rounded-circle ma-1"
                    style="background: #F5F5F5"
                    @click="openDialogContent(item)"
                >
                  mdi-file
                </v-icon>
              </template>
              <span>Контент</span>
            </v-tooltip>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pa-2 rounded-circle ma-1"
                    style="background: #F5F5F5"
                    @click="openSubDialogDelete(item)"
                >
                  mdi-trash-can
                </v-icon>
              </template>
              <span>Удалить подпроект</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.name="{ item }">
          <span>{{ splitName(item.name) }}</span>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="pa-2 rounded-circle ma-1"
                  style="background: #F5F5F5"
                  id="copySub"
                  @click="copyNameSubProject(item.name)"
              >
                mdi-content-copy
              </v-icon>
            </template>
            <span>{{ copySubProject }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.brand="{ item }">
          <v-autocomplete
              v-model="item.brand_id"
              :items="brandIdOptions"
              class="select_geo_brand"
              clearable
              @change="updateBrandGeo('brand_id', $event)"
          ></v-autocomplete>
        </template>
        <template v-slot:item.geo="{ item }">
          <v-autocomplete
              v-model="item.geo_id"
              :items="geoIdOptions"
              class="select_geo_brand"
              clearable
              @change="updateBrandGeo('geo_id', $event)"
          ></v-autocomplete>
        </template>
        <template v-slot:item.success="{ item }">
          <span>{{ Math.round(count_posting / days_posting * item.weight / weight_sum) }}</span>
        </template>
        <template v-slot:item.posting_domain="{ item }">
          <div class="d-flex align-center">
            <v-select
                :items="postingDomainName"
                v-model="item.intermediary_domain_id"
                class="select_geo_brand"
                @click="getPostingDomain(item.name)"
                @change="updateBrandGeo('intermediary_domain_id', $event)"
            ></v-select>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pa-2 rounded-circle ma-1"
                    style="background: #F5F5F5"
                    @click="savePostingDomain()"
                >
                  mdi-content-save
                </v-icon>
              </template>
              <span>Сохранить</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.duplicated_post="{ item }">
          <div class="d-flex align-center justify-space-around duplicated-post">
            <span>от</span>
            <v-edit-dialog
                :return-value.sync="item.count_duplicated_post[0]"
            >
              {{ item.count_duplicated_post[0] }}
              <template v-slot:input>
                <v-text-field
                    v-model="item.count_duplicated_post[0]"
                    label="Редактировать"
                    single-line
                    counter
                    type="number"
                    @keydown.enter="saveDuplicatedPost(id)"
                ></v-text-field>
              </template>
            </v-edit-dialog>
            <span>до</span>
            <v-edit-dialog
                :return-value.sync="item.count_duplicated_post[1]"
            >
              {{ item.count_duplicated_post[1] }}
              <template v-slot:input>
                <v-text-field
                    v-model="item.count_duplicated_post[1]"
                    label="Редактировать"
                    single-line
                    counter
                    type="number"
                    @keydown.enter="saveDuplicatedPost(id)"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </div>
        </template>
        <template v-slot:item.date="{ item }">
          <span>{{ formatData(item.created_date) }}</span>
        </template>
        <template v-slot:item.promo="{ item }">
          <div class="d-flex align-center">
            <v-select
                v-model="item.promoted_key_id"
                :items="getPromotedKey"
                class="select_geo_brand"
                @change="updateBrandGeo('promoted_key_id', $event)"
            ></v-select>
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pa-2 rounded-circle ma-1"
                    style="background: #F5F5F5"
                    @click="savePromotedKey()"
                >
                  mdi-content-save
                </v-icon>
              </template>
              <span>Сохранить</span>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:item.packs="{ item }">
          <ProgressBar
              :service_packs="item.service_packs"
          />
        </template>
        <template v-slot:item.weight="props">
          <v-edit-dialog
            :return-value.sync="props.item.weight"
          >
            {{ props.item.weight }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.weightNew"
                label="Редактировать"
                single-line
                counter
                @keydown.enter="saveProject(id)"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
      <v-dialog v-model="dialogAddSubProject" max-width="360px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
              elevation="0"
              class="mt-4"
          >
            <v-icon
                class="pr-2"
            >
              mdi-plus
            </v-icon>
            Добавить подпроект
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 justify-space-between">
            <span>Новый подпроект</span>
            <v-btn
                icon
                color="grey lighten-1"
                @click="closeAddSubProject"
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
                Название подпроекта:
              </p>
              <p
                  class="mb-0"
              >
                <v-text-field
                    v-model="subProjectName"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    solo
                    label="Введите название подроекта"
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
                ГЕО:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    label="Выбрать:"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    :items="getListGeo()"
                    solo
                    v-model="subProjectGeo"
                    required
                    hide-details="true"
                ></v-select>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Бренд:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    label="Выбрать:"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    :items="getListBrand()"
                    solo
                    v-model="subProjectBrand"
                    required
                    hide-details="true"
                ></v-select>
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
                    label="Выбрать:"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    :items="getListPromoKey()"
                    solo
                    v-model="subProjectPromoKey"
                    required
                    hide-details="true"
                ></v-select>
              </p>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="grey darken-1"
                  text
                  @click="closeAddSubProject"
              >
                Отменить
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="addSubProject(id)"
                  :disabled="!valid"
              >
                Добавить
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
          color="grey darken-1"
          text
          @click="closeEdit"
      >
        Отмена
      </v-btn>
      <v-btn
          color="blue darken-1"
          text
          @click="saveGeoBrand(id)"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ContentModal from "./ContentModal";
import ProgressBar from "../ProgressBar";
export default {
  name: "ProjectsSubTable",
  components: {
    ProgressBar,
    ContentModal
  },
  props: {
    subprojects: {
      type: Array,
      required: true
    },
    name_sub: {
      type: String,
      required: true
    },
    date_sub: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    closeEdit: {
      type: Function,
      required: true
    },
    formatData: {
      type: Function,
      required: true
    },
    urlsAdd: {
      type: Function,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    refreshModal: {
      type: Function,
      required: true
    },
    openEdit: {
      type: Function,
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
    },
    RefreshProjects: {
      type: Function,
      required: true
    },
    edit_item: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      usersList: [],
      brandList: [],
      geoList: [],
      promoList: [],
      dialogSubDelete: false,
      dialogAddSubProject: false,
      dialogContent: false,
      isDisabled: true,
      valid: false,
      show: false,
      theads: [
        {
          text: 'Название подпроекта',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Бренд', value: 'brand', sortable: false },
        { text: 'Гео', value: 'geo', sortable: false },
        { text: 'Вес', value: 'weight', sortable: false },
        { text: 'Успехи, день', value: 'success', sortable: false },
        { text: 'Количество текстов', value: 'count_content', sortable: false },
        { text: 'Домен постинга', value: 'posting_domain', sortable: false },
        { text: 'Дубликаты постов для подпроекта', value: 'duplicated_post', sortable: false },
        { text: 'Дата создания подпроекта', value: 'date', sortable: false },
        { text: 'Продвигаемый ключ', value: 'promo', sortable: false },
        { text: 'Используемые паки', value: 'packs', sortable: false },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      editItem: {},
      editIndex: -1,
      name: '',
      subProjectName: '',
      subProjectGeo: '',
      subProjectBrand: '',
      subProjectPromoKey: '',
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
      },
      tagsList: [],
      tags_id: '',
      copyProject: "Скопировать название проекта",
      copySubProject: "Скопировать название подпроекта",
      weightNew: '',
      count_posting_per_day_new: 0,
      categoryNew: '',
      postingDomainList: [],
    }
  },
  methods: {
    maxArray(array) {
      return Math.max.apply(null, array);
    },
    minArray(array) {
      return Math.min.apply(null, array);
    },
    async getUsers() {
      try {
        let data = {
          skip: 0,
          limit: 1000,
        }
        const response = await this.$axios.$post('/frontend/api/user/filter', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.usersList = response.data
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
    async getPostingDomain(subproject = null) {
      let data = {
        skip: 0,
        limit: 1000
      }
      if(subproject != null) {
        data['subproject_name'] = subproject
      }
      const response = await this.$axios.$post('/frontend/api/project/filter_intermediary_domains', data)
      this.postingDomainList = response.data
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
    async copyNameProject() {
      try {
        const copyProjectName = []
        for (const subProjectName in this.subprojects) {
          copyProjectName.push(this.subprojects[subProjectName]['name'])
        }
        await navigator.clipboard.writeText(copyProjectName)
      } catch (e) {
        throw e
      }
    },
    async copyNameSubProject(copyName) {
      try {
        let copySubName = copyName
        await navigator.clipboard.writeText(copySubName)
      } catch (e) {
        throw e
      }
    },
    changeValue (key, value) {
      this.$emit('changeTag', { key, value });
    },
    changeTags (key, value) {
      const newValue = value.map(item => item.value)
      this.$emit('changeTag', { key, value: newValue });
      const item_list = value.filter(i => this.edit_item.tags.includes(i.value))
      const tagname_list = []
      for (const tag in item_list) {
        tagname_list.push(item_list[tag]['value'])
      }
      this.createTags(this.id, tagname_list)
    },
    updateEditItemOptions ({ key, value }) {
      if ( !this.editItem.scm_options.options ) {
        this.$set(this.editItem.scm_options, 'options', {});
      }
      this.$set(this.editItem.scm_options.options, key, value);
    },
    updateEditItemScmOptions ({ key, value }) {
      this.$set(this.editItem.scm_options, key, value);
    },
    async addSubProject(project_id) {
      try {
        /*let namSub = []
        let splitName = ''
        if (this.subProjectName[0] == '/') {
          splitName = this.name_sub + this.subProjectName
        } else {
          splitName = this.subProjectName
        }
        namSub.push(splitName)*/
        const brand_list = this.brandList
        let brand = ''
        for (const index in brand_list) {
          if (brand_list[index]['name'] == this.subProjectBrand) {
            brand = brand_list[index]['brand_id']
          }
        }
        const geo_list = this.geoList
        let geo = ''
        for (const index in geo_list) {
          if (geo_list[index]['country_code'] == this.subProjectGeo) {
            geo = geo_list[index]['geo_id']
          }
        }
        const promo_list = this.promoList
        let promoKey = ''
        for (const index in promo_list) {
          if (promo_list[index]['name'] == this.subProjectPromoKey) {
            promoKey = promo_list[index]['promoted_key_id']
          }
        }
        let splitName = ''
        let changeUrl = []
        for (const subProject in this.subprojects) {
          if (this.subProjectName[0] == '/') {
            splitName = this.name_sub + this.subProjectName
          } else {
            splitName = this.subProjectName
          }
          changeUrl.push(
              {
                'name': splitName,
                'geo_id': geo,
                'brand_id': brand,
                'promoted_key_id': promoKey
              }
          )
        }
        const response = await this.$axios.post('/frontend/api/project/add_urls', {
          project_id: project_id,
          urls: changeUrl
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.dialogAddSubProject = false
        this.closeEdit()
        this.$refs.form.reset()
        this.RefreshProjects()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async changeFlag(project_id) {
      try {
        const response = await this.$axios.post('/frontend/api/project/change_uniqueness_flag', {
          project_id: project_id,
          uniqueness_flag: this.edit_item.one_project_one_profile == null ? false : this.edit_item.one_project_one_profile
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
      } catch (error) {
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
    async saveProject(project_id) {
      try {
        let splitName = ''
        let changeUrl = []
        for (const subProject in this.subprojects) {
          if (this.subprojects[subProject]['name'][0] == '/') {
            splitName = this.name_sub + this.subprojects[subProject]['name']
          } else {
            splitName = this.subprojects[subProject]['name']
          }
          if ('weightNew' in this.subprojects[subProject]) {
            if (this.subprojects[subProject]['weightNew'] != this.subprojects[subProject]['weight']) {
              changeUrl.push(
                  {
                    'name': splitName,
                    'weight': this.subprojects[subProject]['weightNew']
                  }
              )
              this.subprojects[subProject]['weight'] = this.subprojects[subProject]['weightNew']
            }
          }
        }
        if(changeUrl.length != 0) {
          const response = await this.$axios.post('/frontend/api/project/change_weight_urls', {
            project_id: project_id,
            urls: changeUrl
          }, {
            headers: {
              'Authorization' : this.$auth.strategy.token.get()
            }
          })
          this.RefreshProjects()
        }
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async saveDuplicatedPost(project_id) {
      try {
        let splitName = ''
        let changeUrl = []
        for (const subProject in this.subprojects) {
          if (this.subprojects[subProject]['name'][0] == '/') {
            splitName = this.name_sub + this.subprojects[subProject]['name']
          } else {
            splitName = this.subprojects[subProject]['name']
          }
          changeUrl.push(
              {
                'name': splitName,
                'count_duplicated_post': [Number(this.subprojects[subProject]['count_duplicated_post'][0]), Number(this.subprojects[subProject]['count_duplicated_post'][1])]
              }
          )
        }
        const response = await this.$axios.post('/frontend/api/project/change_count_duplicate_post_urls', {
          project_id: project_id,
          urls: changeUrl
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async save(project_id) {
      try {
        if('count_posting_per_day_new' in this.edit_item) {
          if(this.edit_item.count_posting_per_day_new != this.edit_item.count_posting_per_day) {
            this.edit_item.count_posting_per_day = this.edit_item.count_posting_per_day_new
            const response = await this.$axios.post('/frontend/api/project/change_count_posting_per_day', {
              project_id: project_id,
              count_posting_per_day: this.edit_item.count_posting_per_day
            }, {
              headers: {
                'Authorization' : this.$auth.strategy.token.get()
              }
            })
            this.RefreshProjects()
          }
        }
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async saveCategory(project_id) {
      try {
        if('categoryNew' in this.edit_item) {
          if(this.edit_item.categoryNew != this.edit_item.category) {
            this.edit_item.category = this.edit_item.categoryNew
            const response = await this.$axios.post('/frontend/api/project/change_category', {
              project_id: project_id,
              category: this.edit_item.category
            }, {
              headers: {
                'Authorization' : this.$auth.strategy.token.get()
              }
            })
            this.RefreshProjects()
          }
        }
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async savePostingDomain() {
      try {
        let splitName = ''
        let changePostingDomain = []
        let domain_id = ''
        for (const subProject in this.subprojects) {
          if (this.subprojects[subProject]['name'][0] == '/') {
            splitName = this.name_sub + this.subprojects[subProject]['name']
          } else {
            splitName = this.subprojects[subProject]['name']
          }
          changePostingDomain.push(
              {
                'name': splitName,
                'intermediary_domain_id': this.subprojects[subProject]['intermediary_domain_id']
              }
          )
          domain_id = this.subprojects[subProject]['intermediary_domain_id']
        }
        const response = await this.$axios.post('/frontend/api/project/change_intermediary_domain', {
          subproject_name: splitName,
          intermediary_domain_id: domain_id
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async savePromotedKey() {
      try {
        let splitName = ''
        let changePromotedKey = []
        let promo_key = ''
        for (const subProject in this.subprojects) {
          if (this.subprojects[subProject]['name'][0] == '/') {
            splitName = this.name_sub + this.subprojects[subProject]['name']
          } else {
            splitName = this.subprojects[subProject]['name']
          }
          changePromotedKey.push(
              {
                'promoted_key_id': this.subprojects[subProject]['promoted_key_id'],
                'name': splitName
              }
          )
          promo_key = this.subprojects[subProject]['promoted_key_id']
        }
        const response = await this.$axios.post('/frontend/api/project/change_promoted_key', {
          subproject: splitName,
          promoted_key_id: promo_key
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async saveUser(project_id, curator_id) {
      try {
        const response = await this.$axios.post('/frontend/api/project/change_projects_curator', {
          project_id: project_id,
          curator_id: curator_id
        }, {
          headers: {
            'Authorization': this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        //this.closeEdit()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({content: error.response.data.detail.description, color: 'red darken-2'})
        }
      }
    },
    async saveGeoBrand(project_id) {
      try {
        let splitName = ''
        let changeGeoBrand = []
        for (const subProject in this.subprojects) {
          if (this.subprojects[subProject]['name'][0] == '/') {
            splitName = this.name_sub + this.subprojects[subProject]['name']
          } else {
            splitName = this.subprojects[subProject]['name']
          }
          changeGeoBrand.push(
              {
                'name': splitName,
                'brand_id': this.subprojects[subProject]['brand_id'],
                'geo_id': this.subprojects[subProject]['geo_id'],
              }
          )
        }
        const response = await this.$axios.post('/frontend/api/project/change_geo_brand_urls', {
          project_id: project_id,
          urls: changeGeoBrand
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        this.closeEdit()
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    updateBrandGeo ({ key, value }) {
      for (const subProject in this.subprojects) {
        this.$set(this.subprojects[subProject], key, value);
      }
    },
    async deleteSubProject(project_id, name) {
      try {
        const response = await this.$axios.delete('/frontend/api/project/delete_urls', {
          data: {
            project_id: project_id,
            urls: [name]
          },
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        this.dialogSubDelete = false
        this.closeEdit()
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    openSubDialogDelete(item) {
      this.editIndex = this.subprojects.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.dialogSubDelete = true
    },
    closeDialogContent() {
      this.dialogContent = false
    },
    closeAddSubProject() {
      this.dialogAddSubProject = false
      this.$refs.form.reset()
    },
    openDialogContent(item) {
      this.editIndex = this.subprojects.indexOf(item)
      this.editItem = Object.assign({}, item)
      this.dialogContent = true
    },
    async getTags() {
      let data = {
        skip: 0,
        limit: 1000,
      }
      const response = await this.$axios.$post('/frontend/api/tags/filter_tags', data, {
        headers: {
          'Authorization' : this.$auth.strategy.token.get()
        }
      })
      this.tagsList = response.data
    },
    async addTags(project_id) {
      try {
        /*const tagsFromDb = this.getNameTags
        const tags_id = this.testTags
        let tagNames = []
        for (const index in tagsFromDb) {
          if(tags_id.includes(tagsFromDb[index].value)) {
            tagNames.push(tagsFromDb[index].text)
          }
        }*/
        const { data } = await this.$axios.post('/frontend/api/tags/add_tags', {
          tag_names: this.testTags
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        const response = await this.$axios.post('/frontend/api/tags/add_tags_to_project', {
          project_id: project_id,
          tags_id: data.tags_id
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
      } catch(error) {
        console.log(error)
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async createTags(project_id, item) {
      try {
        const response = await this.$axios.post('/frontend/api/tags/add_tags_to_project', {
          project_id: project_id,
          tags_id: item
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
      } catch(error) {
        console.log(error)
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async removeTags(project_id) {
      try {
        const response = await this.$axios.delete('/frontend/api/tags/delete_project_tags', {
          data: {
            project_id: project_id,
            tags_id: [name]
          },
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.RefreshProjects()
        this.dialogSubDelete = false
        this.closeEdit()
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    /*tagAdd(text) {
      const tags = []
      if( text.length == 0 ) {
        return tags
      } else if( text.length !== 0 ) {
        const tagArray = text.split("\n");
        return tagArray
      }
    }*/
  },
  mounted() {
    this.getTags()
    this.getBrand()
    this.getGeo()
    this.getPostingDomain()
    this.getPromoKey()
    this.getUsers()
  },
  computed: {
    getNameTags() {
      return this.tagsList.map(item => {
        return { value: item.tag_id, text: item.name };
      });
    },
    testTags() {
      return this.getNameTags.filter(item => {
        return this.edit_item.tags.includes(item.value)
      })
    },
    brandIdOptions() {
      return this.brandList.map(item => {
        return { value: item.brand_id, text: item.name };
      });
    },
    geoIdOptions() {
      return this.geoList.map(item => {
        return { value: item.geo_id, text: item.country_code };
      });
    },
    postingDomainName() {
      //this.getPostingDomain(item.name)
      return this.postingDomainList.map(item => {
        return { value: item.intermediary_domain_id, text: item.domain };
      });
    },
    getPromotedKey() {
      return this.promoList.map(item => {
        return { value: item.promoted_key_id, text: item.name };
      });
    },
    getUserId() {
      return this.usersList.map(item => {
        return { value: item.user_id, text: item.username };
      });
    }
    /*transformTags() {
      const tagsFromDb = this.getNameTags
      console.log(tagsFromDb)
      const tags_id = this.edit_item.tags
      console.log(tags_id)
      let tagNames = []
      for (const index in tagsFromDb) {
        if(tags_id.includes(tagsFromDb[index].value)) {
          console.log(1)
          tagNames.push(tagsFromDb[index].text)
        }
      }
      console.log(tagNames)
      return tagNames
    }*/
  }
}
</script>

<style scoped>

  .select_geo_brand {
    font-size: 0.875rem;
  }
  .select_user {
    width: 200px;
    flex: initial;
    margin-right: 5px;
  }

</style>