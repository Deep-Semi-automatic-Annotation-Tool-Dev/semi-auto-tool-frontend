<template>
  <v-app id="layout-root">
    <AppBar></AppBar>
    <div id="layout-dashboard-root">
      <div id="layout-dashboard-sidebar">
        <div id="layout-sidebar-dashboard-list">
          <div id="text-dashboard-list-title">프로젝트 목록</div>
          <!--     프로젝트 리스트     -->
          <div id="text-dashboard-list-item" class="list-vuetify">
            <div
                v-for="item in projectList"
                :key="item.project_id"
                class="list-vuetify-item"
                @click.left="projectListLeftClick($event, item.project_id, item.project_name)"
            >
              {{ item.project_name }}
            </div>
          </div>
        </div>
      </div>
    </div>



    <!--  dialog 로딩중 화면  -->
    <v-dialog
        v-model="showLoadingDialog"
        width="auto"
        :close-on-back="false"
        :persistent="true"
    >
      <Dialog
          :dialog-type="this.DIALOG_TYPE_PROGRESS_LINEAR_INFINITY"
          :title="this.loadingDialogTitle"
          :subtitle="this.loadingDialogSubTitle"
      >
      </Dialog>
    </v-dialog>
  </v-app>
</template>

<script>
import AppBar from './appbar/AppBar';
import Dialog from "@/components/dialog/Dialog";

import {getProjectList, getTrainList} from "@/js/api/project";

export default {
  name: "DashboardComponent",
  components: {
    AppBar,
    Dialog
  },
  data() {
    return {
      showLoadingDialog: false,
      loadingDialogTitle: "",
      loadingDialogSubTitle: "",

      projectList: [],
      selectedProjectId: 0,
      selectedProjectName: ''
    }
  },
  async created() {
    await getProjectList(this);
  },
  methods: {
    projectListLeftClick(e, id, name) {
      this.selectedProjectId = id
      this.selectedProjectName = name
      getTrainList(this, this.selectedProjectId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/dashboard.scss";
</style>