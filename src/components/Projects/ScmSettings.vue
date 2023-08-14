<template>
  <div>
    <div class="d-flex flex-column align-center">
      <v-icon
          large
          class="pa-3 rounded-circle ma-1"
          style="background: #F5F5F5"
          @click="openDialogSettings()"
      >
        mdi-wrench
      </v-icon>
      <span>Настройки SCM</span>
    </div>
    <v-dialog v-model="dialogSettings" max-width="650px">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <span>Настройки SCM</span>
          <v-btn
              icon
              color="grey lighten-1"
              @click="closeDialogSettings()"
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
              Шаблон настроек:
            </p>
            <p
                class="mb-0 d-flex align-center"
            >
              <v-select
                  label="Выбрать:"
                  :value="scm_template_id"
                  :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                  :items="templateIdOptions"
                  solo
                  required
                  selected
                  hide-details="true"
                  @change="changeScmTemplateId('scm_template_id', $event)"
              ></v-select>
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      class="ml-2 rounded-circle"
                      v-bind="attrs"
                      v-on="on"
                  >
                    mdi-eye
                  </v-icon>
                </template>
                <span>Подробнее</span>
              </v-tooltip>
            </p>
          </v-card-text>
          <v-card-text>
            <p
                class="mb-2 font-weight-medium"
            >
              articleTemplateInfo:
            </p>
            <p
                class="mb-0"
            >
              <v-select
                :value="scm_options.articleTemplateInfo"
                label="Выбрать:"
                :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                :items="articleIdOptions"
                solo
                required
                hide-details="true"
                @change="changeValue('articleTemplateInfo', $event)"
              ></v-select>
            </p>
          </v-card-text>
          <v-card-text>
            <p
                class="mb-2 font-weight-medium"
            >
              Запросы для генерации контента:
            </p>
            <p
                class="mb-0"
            >
              <v-textarea
                  solo
                  :key="autoGrowHack"
                  auto-grow
                  label="Ключ1\nКлюч2\nКлюч3"
                  :value="scm_options.articleKeywordsFile"
                  rows="4"
                  row-height="30"
                  hide-details="true"
                  type="array"
                  class="textarea-custom"
                  @change="changeValue('articleKeywordsFile', $event)"
              ></v-textarea>
            </p>
          </v-card-text>
          <v-card-text
              class="pb-0"
          >
            <p
                class="mb-0 pb-0 font-weight-medium text-uppercase"
            >
              Google settings:
            </p>
          </v-card-text>
          <div class="d-flex align-center">
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Country:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    label="Выбрать:"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    :items="countryName"
                    :value="sliceCountry"
                    solo
                    required
                    hide-details="true"
                    @change="changeValue('articleGoogleCountry', $event)"
                ></v-select>
              </p>
            </v-card-text>
            <v-card-text>
              <p
                  class="mb-2 font-weight-medium"
              >
                Language:
              </p>
              <p
                  class="mb-0"
              >
                <v-select
                    label="Выбрать:"
                    :rules="[v => !!v || 'Это поле обязательно для заполнения']"
                    :items="langName"
                    solo
                    :value="scm_options.articleSpinnerTranslateSource"
                    required
                    hide-details="true"
                    @change="changeValue('articleSpinnerTranslateSource', $event)"
                ></v-select>
              </p>
            </v-card-text>
          </div>
          <v-card-text class="pt-0">
            <v-tabs
                v-model="tab"
            >
              <v-tab
                  v-for="index in linkSetsInt"
                  :key="index"
              >
                Link {{ index }}
              </v-tab>
            </v-tabs>
          </v-card-text>
          <v-tabs-items
              v-model="tab"
          >
            <v-tab-item
                v-for="index in linkSets"
                :key="index"
            >
              <v-card flat>
                <v-card-text>
                  <p
                      class="mb-2 font-weight-medium"
                  >
                    Анкорлист:
                  </p>
                  <p
                      class="mb-0"
                  >
                    <v-textarea
                        solo
                        :key="autoGrowHack"
                        auto-grow
                        label="Ключ1\nКлюч2\nКлюч3"
                        :value="index.keywordsFile"
                        rows="4"
                        row-height="30"
                        hide-details="true"
                        type="array"
                        class="textarea-custom"
                        @change="changeTab('keywordsFile', $event, index.tab)"
                    ></v-textarea>
                  </p>
                </v-card-text>
                <v-card-text>
                  <p
                      class="mb-2 font-weight-medium"
                  >
                    urlsFile:
                  </p>
                  <p
                      class="mb-0"
                  >
                    <v-textarea
                        solo
                        :key="autoGrowHack"
                        auto-grow
                        label="Ссылка1\nСсылка2\nСсылка3"
                        :value="index.urlsFile"
                        rows="4"
                        row-height="30"
                        hide-details="true"
                        type="array"
                        @change="changeTab('urlsFile', $event, index.tab)"
                    ></v-textarea>
                  </p>
                </v-card-text>
                <v-card-text>
                  <p
                      class="mb-0"
                  >
                    <v-checkbox
                        v-model="index.lockUrl"
                        label="Lock url + keyword on same line"
                        @change="changeTab('lockUrl', $event, index.tab)"
                    ></v-checkbox>
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <v-card-text>
            <p
                class="mb-2 font-weight-medium"
            >
              articleReplaceFilterFile:
            </p>
            <p
                class="mb-0"
            >
              <v-textarea
                  solo
                  auto-grow
                  label="Ключ1|Ключ2\nКлюч1|Ключ2"
                  :value="scm_options.articleReplaceFilterFile"
                  rows="4"
                  row-height="30"
                  hide-details="true"
                  type="array"
                  @change="changeValue('articleReplaceFilterFile', $event)"
              ></v-textarea>
            </p>
          </v-card-text>
          <v-card-text>
            <p>
              <v-switch
                  v-model="scm_options.articleUseHtmlInsert"
                  color="primary"
                  label="Html code"
                  class="mt-0 pt-0 font-weight-medium"
                  hide-details="true"
                  @change="changeValue('articleUseHtmlInsert', $event)"
              ></v-switch>
            </p>
            <p
                class="mb-0"
                v-show="scm_options.articleUseHtmlInsert"
            >
              <v-textarea
                  solo
                  auto-grow
                  label="HTML код"
                  :value="scm_options.HtmlInsertCodeFile"
                  rows="4"
                  row-height="30"
                  hide-details="true"
                  type="array"
                  @change="changeValue('HtmlInsertCodeFile', $event)"
              ></v-textarea>
            </p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
                color="grey darken-1"
                text
                @click="closeDialogSettings()"
            >
              Отменить
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                :disabled="!valid"
                @click="saveSettings(scm_id, scm_subproject)"
            >
              Сохранить
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                :disabled="scm_task_id == null"
                @click="runScm()"
            >
              Запустить
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-dialog v-model="dialogScmRun" max-width="360px">
          <v-card>
            <v-card-text
                class="text-center pt-4 pb-0"
            >
              По окончании загрузки придет уведомления в слак!
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                  color="blue darken-1"
                  text
                  @click="dialogScmRun = false;"
              >
                ОК
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { countries } from "@/constans/countries";
import { languages } from "@/constans/languages";

export default {
  name: "scm",
  props: {
    scm_id: {
      type: String,
      required: true
    },
    scm_subproject: {
      type: String,
      required: true
    },
    scm_task_id: {
      type: String | null,
      required: true
    },
    scm_template_id: {
      type: String | null,
      required: true
    },
    scm_options: {
      type: Object,
      default: () => ({})
    },
    RefreshProjects: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      settings: [],
      articles: [],
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
      },
      dialogScmRun: false,
      dialogSettings: false,
      autoGrowHack: false,
      linkSetsInt: 5,
      linkSets: this.createLinkSets(),
      tab: null,
      //contentList: []
    }
  },
  methods: {
    openDialogSettings() {
      this.dialogSettings = true
      this.forceReRender()
      this.linkSets = this.createLinkSets()
    },
    closeDialogSettings() {
      this.dialogSettings = false
    },
    createLinkSets() {
     let linkSets = []
     let countLinkSets = 0
     for (const index in this.scm_options.linkSets) {
       countLinkSets++
       linkSets.push({
         'keywordsFile': this.scm_options.linkSets[index]['keywordsFile'],
         'urlsFile': this.scm_options.linkSets[index]['urlsFile'],
         'lockUrl': this.scm_options.linkSets[index]['lockUrl'],
         'tab': index
       })
     }
     for (let item = 0; item < (5 - countLinkSets); item++) {
       linkSets.push({
         'keywordsFile': "",
         'urlsFile': "",
         'lockUrl': false,
         'tab': countLinkSets + item
       })
     }
     return linkSets
    },
    changeTab(key, value, index) {
      this.$set(this.linkSets[index], key, value);
    },
    forceReRender() {
      this.autoGrowHack = !this.autoGrowHack;
    },
    changeValue(key, value) {
      this.$emit('change', { key, value });
    },
    changeScmTemplateId(key, value) {
      this.$emit('changeScmId', { key, value });
    },
    async getSettings() {
      try {
        let data = {
          skip: 0,
          limit: 100,
        }
        const response = await this.$axios.$post('/api/content/filter_settings_templates', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.settings = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async getArticles() {
      try {
        let data = {
          skip: 0,
          limit: 100,
        }
        const response = await this.$axios.$post('/api/content/filter_article_templates', data, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.articles = response.data
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async saveSettings(project_id, name_sub_pr) {
      try {
        const language_list = this.langItems
        let lang = ""
        for (const index in language_list) {
          if (language_list[index]['iso'] == this.scm_options.articleSpinnerTranslateSource) {
            lang = language_list[index]['language']
          }
        }
        const countryName = this.sliceCountry + ':' + lang + ':'
        const { data } = await this.$axios.post('/api/content/set_scm_settings', {
          project_id: project_id,
          subproject: name_sub_pr,
          articleKeywordsFile: this.scm_options.articleKeywordsFile || "",
          articleSpinnerTranslateSource: this.scm_options.articleSpinnerTranslateSource,
          articleSpinnerTranslateTarget: this.scm_options.articleSpinnerTranslateSource,
          articleGoogleCountry: countryName,
          articleUseHtmlInsert: this.scm_options.articleUseHtmlInsert,
          HtmlInsertCodeFile: this.scm_options.HtmlInsertCodeFile || "",
          articleTemplateInfo: this.scm_options.articleTemplateInfo,
          settingTemplate: this.scm_template_id,
          articleReplaceFilterFile: this.scm_options.articleReplaceFilterFile || "",
          linkSets: this.linkSets
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.changeScmTemplateId('task_id', data.data.task_id)
        //await this.$nextTick()
        this.RefreshProjects()
        this.$notifier.showError({ content: 'Сохранение прошло успешно!', color: 'green' })
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
    async runScm() {
      try {
        const response_run = await this.$axios.post('/api/content/run_generate_from_scm', {
          task_id: this.scm_task_id
        }, {
          headers: {
            'Authorization' : this.$auth.strategy.token.get()
          }
        })
        this.dialogScmRun = true
        this.closeDialogSettings()
      } catch (error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    }
  },
  mounted () {
    this.getSettings()
    this.getArticles()
  },
  computed: {
    templateIdOptions() {
      return this.settings.map(item => {
        return { value: item.st_id, text: item.name };
      });
    },
    articleIdOptions() {
      return this.articles.map(item => {
        return { value: item.at_id, text: item.name };
      });
    },
    countryName() {
      return countries.map(item => {
        return { text: item.name };
      })
    },
    langName() {
      return languages.map(item => {
        return { value: item.iso, text: item.language };
      })
    },
    langItems() {
      return languages
    },
    /*linkItems() {
      return this.createLinkSets()
    },*/
    sliceCountry() {
      return this.scm_options.articleGoogleCountry?.split(':')[0] ?? ""
    }
  }
}
</script>

<style>

.textarea-custom .v-input__slot {
  height: 120px;
  overflow: hidden;
  overflow-y: scroll;
}

</style>