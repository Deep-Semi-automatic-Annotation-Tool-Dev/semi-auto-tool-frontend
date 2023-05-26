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

      <div v-if="selectedProjectId !== -1" id="layout-dashboard-history">
        <div id="history-top-title">{{ this.selectedProjectName }}</div>
        <div class="layout-dashboard-card card-w100">
          <div class="card-title">주요 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div class="card-content card-content-row">
            <div class="card-content-row-center">
              <div>데이터 개수</div>
              <div>{{ trainResultData.total_data_count }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>태그 그룹 개수</div>
              <div>{{ trainResultData.tag_group_stats.length }}개</div>
            </div>
          </div>
        </div>
        <div class="layout-dashboard-card card-w100">
          <div class="card-title">태깅 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div class="card-content card-content-tag">
            <v-container class="pa-0 ma-0">
              <v-select
                  label="태그 그룹"
                  density="compact"
                  :items="tagGroups"
                  item-title="tag_group_name"
                  item-value="value"
                  :hide-details="true"
                  @update:model-value="changeGroup"
                  v-model="tagGroupSelectionModel"
              ></v-select>
            </v-container>
            <div class="card-content-row">
              <div class="card-content-row-center">
                <div>데이터 개수</div>
                <div>{{ trainResultData.total_data_count }}개</div>
              </div>
              <div class="card-content-row-center">
                <div>태그 그룹 개수</div>
                <div>{{ trainResultData.tag_group_stats.length }}개</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>통계를 확인할 프로젝트를 선택해 주세요.</div>
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

import {getProjectList} from "@/js/api/project";
import {loadHistory} from "@/js/api/dashboard";

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
      selectedProjectId: -1,
      selectedProjectName: '',

      tagGroups: [],
      tagGroupSelectionModel: 0,
      selectedTagGroupId: 0,

      trainResultData: []
    }
  },
  async created() {
    await getProjectList(this);
  },
  methods: {
    projectListLeftClick(e, id, name) {
      this.selectedProjectId = id
      this.selectedProjectName = name
      loadHistory(this, this.selectedProjectId)
    },
    async changeGroup(v) {
      this.selectedTagGroupId = v
      console.log(this.tagGroupSelectionModel)
      // await getTagList(this,
      //     this.selectedProjectId,
      //     this.tagGroups[this.selectedTagGroupId].tag_group_id)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/dashboard.scss";
</style>