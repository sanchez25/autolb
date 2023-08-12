<template>
  <v-card>
    <v-card-title class="text-h5 justify-space-between pl-4 pr-4">
      <span>Контент</span>
      <v-btn
          icon
          color="grey lighten-1"
          @click="closeDialogContent"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-actions class="justify-space-around pb-4">
      <div class="d-flex flex-column align-center">
        <v-icon
            large
            class="pa-3 rounded-circle ma-1"
            style="background: #F5F5F5"
            @click="openDialogDownload()"
        >
          mdi-file-plus
        </v-icon>
        <span>Загрузить контент</span>
      </div>
      <div class="d-flex flex-column align-center">
        <v-icon
            large
            class="pa-3 rounded-circle ma-1"
            style="background: #F5F5F5"
            @click="openDialogDownloadContent()"
        >
          mdi-file-download
        </v-icon>
        <span>Загрузить шаблон</span>
      </div>
      <ScmSettings
        :scm_options="scm_options.options"
        :scm_id="project_id"
        :scm_subproject="name_sub_pr"
        :scm_task_id="scm_options.task_id"
        :scm_template_id="scm_options.scm_template_id"
        :refresh-projects="RefreshProjects"
        @change="updateScmOptions"
        @changeScmId="updateScmTemplateId"
      />
    </v-card-actions>
    <v-dialog v-model="dialogDownload" max-width="360px">
      <DownloadContent
        :close-dialog-download="closeDialogDownload"
        :subproject_name="name_sub_pr"
        :refresh-projects="RefreshProjects"
      />
    </v-dialog>
    <v-dialog v-model="dialogDownloadContent" max-width="360px">
      <DownloadTemplate
          :subproject_name="name_sub_pr"
          :close-dialog-download-content="closeDialogDownloadContent"
          :refresh-projects="RefreshProjects"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import ScmSettings from "./ScmSettings";
import DownloadContent from "./DownloadContent";
import DownloadTemplate from "./DownloadTemplate";
export default {
  name: "content-modal",
  components: {
    DownloadTemplate,
    DownloadContent,
    ScmSettings
  },
  data() {
    return {
      dialogDownload: false,
      dialogDownloadContent: false
    }
  },
  props: {
    closeDialogContent: {
      type: Function,
      required: true
    },
    project_id: {
      type: String,
      required: true
    },
    name_sub_pr: {
      type: String,
      required: true
    },
    scm_options: {
      type: Object,
      required: true
    },
    RefreshProjects: {
      type: Function,
      required: true
    }
  },
  methods: {
    openDialogDownload() {
      this.dialogDownload = true
    },
    openDialogDownloadContent() {
      this.dialogDownloadContent = true
    },
    closeDialogDownload() {
      this.dialogDownload = false
    },
    closeDialogDownloadContent() {
      this.dialogDownloadContent = false
    },
    updateScmOptions(event) {
      this.$emit('change', event);
    },
    updateScmTemplateId(event) {
      this.$emit('changeScmId', event)
    }
  }
}
</script>

<style scoped>

</style>