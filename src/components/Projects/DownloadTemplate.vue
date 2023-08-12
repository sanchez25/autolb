<template>
  <v-card>
    <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
      <span>Загрузить шаблон</span>
      <v-btn
          icon
          color="grey lighten-1"
          @click="closeDialogDownloadContent"
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
        <v-file-input
            label="Загрузить файл"
            prepend-icon="mdi-file-plus"
            outlined
            id="file"
            v-model="fileInput"
            dense
            class="mt-2"
            hide-details="true"
        ></v-file-input>
      </v-card-text>
    </v-form>
    <v-card-actions class="justify-end">
      <v-btn
          color="grey darken-1"
          text
          @click="closeDialogDownloadContent"
      >
        Отменить
      </v-btn>
      <v-btn
          color="blue darken-1"
          text
          @click="downloadTemplate(subproject_name)"
      >
        Отправить
      </v-btn>
    </v-card-actions>
    <v-dialog
        v-model="dialogProgress"
        max-width="360px"
        persistent
    >
      <v-card>
        <v-card-text
            class="text-center pt-4"
        >
          <v-progress-circular
              :size="50"
              :width="7"
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogOk" max-width="360px">
      <v-card>
        <v-card-text
            class="text-center pt-4 pb-0"
        >
          Контент успешно отправлен на загрузку!
          Нужно подождать некоторое время, чтобы количество текстов отразилось на странице проекта!
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
              color="blue darken-1"
              text
              @click="dialogOk = false;"
          >
            ОК
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "DownloadTemplate",
  props: {
    closeDialogDownloadContent: {
      type: Function,
      required: true
    },
    subproject_name: {
      type: String,
      required: true
    },
    RefreshProjects: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Обязательно для заполнения.',
      },
      fileInput: null,
      dialogProgress: false,
      dialogOk: false,
    }
  },
  methods: {
    async downloadTemplate(subproject_url) {
      try {
        this.dialogProgress = true
        let formData = new FormData();
        formData.append("file", document.getElementById('file').files[0]);
        formData.append("subproject", `${subproject_url}`);
        const response = await this.$axios.post('/frontend/api/project/download_content_spin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization' : this.$auth.strategy.token.get()
          },
        })
        this.RefreshProjects()
        this.dialogProgress = false
        this.dialogDownloadContent = false
        this.closeDialogDownloadContent()
        this.dialogOk = true
        this.$refs.form.reset()
        this.fileValue = null
      } catch(error) {
        if (error.response.status == '400') {
          this.$notifier.showError({ content: error.response.data.detail.description, color: 'red darken-2' })
        }
      }
    },
  }
}
</script>

<style scoped>

</style>