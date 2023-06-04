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

      <div  v-if="selectedProjectId !== -1 && trainResultData !== null" id="layout-dashboard-history">
        <div id="history-top-title">{{ this.selectedProjectName }}</div>
        <div class="layout-dashboard-card card-w100">
          <div class="card-title">주요 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div class="card-content card-content-row">
            <div class="card-content-row-center">
              <div>전체 데이터 개수</div>
              <div>{{ trainResultData.total_data_count }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>문단 데이터 개수</div>
              <div>{{ trainResultData.data_cnt_each_data_type[this.DATA_TYPE_PARAGRAPH] }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>문장 데이터 개수</div>
              <div>{{ trainResultData.data_cnt_each_data_type[this.DATA_TYPE_SENTENCE] }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>단어 데이터 개수</div>
              <div>{{ trainResultData.data_cnt_each_data_type[this.DATA_TYPE_WORD] }}개</div>
            </div>
          </div>
          <div class="card-content card-content-row">
            <div class="card-content-row-center">
              <div>문단 태그 그룹 개수</div>
              <div>{{ paragraphTagGroups.length }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>문장 태그 그룹 개수</div>
              <div>{{ sentenceTagGroups.length }}개</div>
            </div>
            <div class="card-content-row-center">
              <div>단어 태그 그룹 개수</div>
              <div>{{ wordTagGroups.length }}개</div>
            </div>
          </div>
        </div>

        <TagInformation
            ref="areaParagraph"
            :tag-groups="paragraphTagGroups"
            :tag-group-selection-model-prop="paragraphTagGroupSelectionModel"
            :train-result-data="trainResultData"
            :selected-tag-group-id-prop="selectedParagraphTagGroupId"
            :data-type="this.DATA_TYPE_PARAGRAPH"
            idName="chart-tag-ratio-paragraph"
            @changeStatus="changeParagraphStatus"
        ></TagInformation>

        <TagInformation
            ref="areaSentence"
            :tag-groups="sentenceTagGroups"
            :tag-group-selection-model-prop="sentenceTagGroupSelectionModel"
            :train-result-data="trainResultData"
            :selected-tag-group-id-prop="selectedSentenceTagGroupId"
            :data-type="this.DATA_TYPE_SENTENCE"
            idName="chart-tag-ratio-sentence"
            @changeStatus="changeSentenceStatus"
        ></TagInformation>

        <TagInformation
            ref="areaWord"
            :tag-groups="wordTagGroups"
            :tag-group-selection-model-prop="wordTagGroupSelectionModel"
            :train-result-data="trainResultData"
            :selected-tag-group-id-prop="selectedWordTagGroupId"
            :data-type="this.DATA_TYPE_WORD"
            idName="chart-tag-ratio-word"
            @changeStatus="changeWordStatus"
        ></TagInformation>
      </div>
      <div v-else-if="trainResultData !== null">최신 통계가 존재하지 않습니다. 한번 이상 학습 완료 후 확인해 주세요.</div>
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

import TagInformation from "@/components/dashboard/TagInformation";

export default {
  name: "DashboardComponent",
  components: {
    TagInformation,
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

      sentenceTagGroups: [],
      sentenceTagGroupSelectionModel: 0,
      selectedSentenceTagGroupId: 0,

      wordTagGroups: [],
      wordTagGroupSelectionModel: 0,
      selectedWordTagGroupId: 0,

      paragraphTagGroups: [],
      paragraphTagGroupSelectionModel: 0,
      selectedParagraphTagGroupId: 0,

      trainResultData: null,

      chartRatioSentence: null,
      nowDrawingSentence: false,

      chartRatioWord: null,
      nowDrawingWord: false,

      chartRatioParagraph: null,
      nowDrawingParagraph: false,
    }
  },
  async created() {
    await getProjectList(this);
  },
  methods: {
    drawChart() {
      this.$refs.areaParagraph.drawChart()
      this.$refs.areaSentence.drawChart()
      this.$refs.areaWord.drawChart()
      // this.drawWordChart()
    },
    changeParagraphStatus(value) {
      this.nowDrawingParagraph = value
    },
    changeSentenceStatus(value) {
      this.nowDrawingSentence = value
    },
    changeWordStatus(value) {
      this.nowDrawingWord = value
    },
    async projectListLeftClick(e, id, name) {
      if (!this.nowDrawingSentence && !this.nowDrawingWord && !this.nowDrawingParagraph) {
        this.selectedProjectId = id
        this.selectedProjectName = name
        await loadHistory(this, this.selectedProjectId)

        this.showLoadingDialog = true
        this.loadingDialogTitle = '정보 업데이트중'
        this.loadingDialogSubTitle = '정보 업데이트중...'
        this.drawChart()
        this.showLoadingDialog = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/dashboard.scss";
</style>