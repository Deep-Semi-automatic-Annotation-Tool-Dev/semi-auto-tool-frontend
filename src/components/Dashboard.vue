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
              <div>데이터 개수</div>
              <div>{{ trainResultData.total_data_count }}개</div>
            </div>
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

        <div class="layout-dashboard-card card-w100">
          <div class="card-title">문단 태깅 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div v-if="paragraphTagGroups.length > 0" class="card-content card-content-tag">
            <v-container class="pa-0 ma-0">
              <v-select
                  label="태그 그룹"
                  density="compact"
                  :items="paragraphTagGroups"
                  item-title="tag_group_name"
                  item-value="value"
                  :hide-details="true"
                  @update:model-value="changeGroupParagraph"
                  :disabled="nowDrawingParagraph"
                  v-model="paragraphTagGroupSelectionModel"
              ></v-select>
            </v-container>
            <div class="card-content-row">
              <div class="card-content-row-center">
                <div>태그그룹 태깅 비율</div>
                <div v-if="trainResultData.total_data_count > 0">{{ Math.ceil(trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].tag_group_tagged_count / trainResultData.total_data_count * 10000) / 100 }}%</div>
                <div v-else>0%</div>
              </div>
              <div class="card-content-row-center">
                <div>태그그룹 태그 개수</div>
                <div>{{ trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].per_tag_count.length }}개</div>
              </div>
            </div>
            <div class="card-content-tag-ratio">
              <div class="card-content-row-tags">
                <v-chip
                    v-for="tag in trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].per_tag_count"
                    :key="tag.tag_name"
                    size="small"
                    style="margin-right: 10px"
                    :style="[chipBackground(`#${tag.tag_color}`),
                      setChipBackgroundColor(`#${tag.tag_color}`)]"
                >
                  {{ tag.tag_name }} - {{ Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100 }}%
                </v-chip>
              </div>
              <canvas id="chart-tag-ratio-paragraph"></canvas>
            </div>

            <v-table theme="dark">
              <thead>
              <tr>
                <th></th>
                <th>GPT</th>
                <th>Bert</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>val_acc</td>
                <td>{{ trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].current_train_tag_group_gpt_val_acc }}</td>
                <td>{{trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].current_train_tag_group_bert_val_acc }}</td>
              </tr>
<!--              <tr>-->
<!--                <td>test</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].current_train_tag_group_gpt_test_acc }}</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[paragraphTagGroups[selectedParagraphTagGroupId].tag_group_id].current_train_tag_group_bert_test_acc }}</td>-->
<!--              </tr>-->
              </tbody>
            </v-table>
          </div>
          <div v-else class="card-content card-content-tag">태그 그룹이 존재하지 않습니다.</div>
        </div>

        <div class="layout-dashboard-card card-w100">
          <div class="card-title">문장 태깅 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div v-if="sentenceTagGroups.length > 0" class="card-content card-content-tag">
            <v-container class="pa-0 ma-0">
              <v-select
                  label="태그 그룹"
                  density="compact"
                  :items="sentenceTagGroups"
                  item-title="tag_group_name"
                  item-value="value"
                  :hide-details="true"
                  @update:model-value="changeGroupSentence"
                  :disabled="nowDrawingSentence"
                  v-model="sentenceTagGroupSelectionModel"
              ></v-select>
            </v-container>
            <div class="card-content-row">
              <div class="card-content-row-center">
                <div>태그그룹 태깅 비율</div>
                <div v-if="trainResultData.total_data_count > 0">{{ Math.ceil(trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].tag_group_tagged_count / trainResultData.total_data_count * 10000) / 100 }}%</div>
                <div v-else>0%</div>
              </div>
              <div class="card-content-row-center">
                <div>태그그룹 태그 개수</div>
                <div>{{ trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].per_tag_count.length }}개</div>
              </div>
            </div>
            <div class="card-content-tag-ratio">
              <div class="card-content-row-tags">
                <v-chip
                    v-for="tag in trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].per_tag_count"
                    :key="tag.tag_name"
                    size="small"
                    style="margin-right: 10px"
                    :style="[chipBackground(`#${tag.tag_color}`),
                      setChipBackgroundColor(`#${tag.tag_color}`)]"
                >
                  {{ tag.tag_name }} - {{ Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100 }}%
                </v-chip>
              </div>
              <canvas id="chart-tag-ratio-sentence"></canvas>
            </div>

            <v-table theme="dark">
              <thead>
              <tr>
                <th></th>
                <th>GPT</th>
                <th>Bert</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>val_acc</td>
                <td>{{ trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].current_train_tag_group_gpt_val_acc }}</td>
                <td>{{trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].current_train_tag_group_bert_val_acc }}</td>
              </tr>
<!--              <tr>-->
<!--                <td>test</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].current_train_tag_group_gpt_test_acc }}</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[sentenceTagGroups[selectedSentenceTagGroupId].tag_group_id].current_train_tag_group_bert_test_acc }}</td>-->
<!--              </tr>-->
              </tbody>
            </v-table>
          </div>
          <div v-else class="card-content card-content-tag">태그 그룹이 존재하지 않습니다.</div>
        </div>

        <div class="layout-dashboard-card card-w100">
          <div class="card-title">단어 태깅 정보</div>
          <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
          <div v-if="wordTagGroups.length > 0" class="card-content card-content-tag">
            <v-container class="pa-0 ma-0">
              <v-select
                  label="태그 그룹"
                  density="compact"
                  :items="wordTagGroups"
                  item-title="tag_group_name"
                  item-value="value"
                  :hide-details="true"
                  @update:model-value="changeGroupWord"
                  :disabled="nowDrawingWord"
                  v-model="wordTagGroupSelectionModel"
              ></v-select>
            </v-container>
            <div class="card-content-row">
              <div class="card-content-row-center">
                <div>태그그룹 태깅 비율</div>
                <div v-if="trainResultData.total_data_count > 0">{{ Math.ceil(trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].tag_group_tagged_count / trainResultData.total_data_count * 10000) / 100 }}%</div>
                <div v-else>0%</div>
              </div>
              <div class="card-content-row-center">
                <div>태그그룹 태그 개수</div>
                <div>{{ trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].per_tag_count.length }}개</div>
              </div>
            </div>
            <div class="card-content-tag-ratio">
              <div class="card-content-row-tags">
                <v-chip
                    v-for="tag in trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].per_tag_count"
                    :key="tag.tag_name"
                    size="small"
                    style="margin-right: 10px"
                    :style="[chipBackground(`#${tag.tag_color}`),
                      setChipBackgroundColor(`#${tag.tag_color}`)]"
                >
                  {{ tag.tag_name }} - {{ Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100 }}%
                </v-chip>
              </div>
              <canvas id="chart-tag-ratio-word"></canvas>
            </div>

            <v-table theme="dark">
              <thead>
              <tr>
                <th></th>
                <th>GPT</th>
                <th>Bert</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>val_acc</td>
                <td>{{ trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].current_train_tag_group_gpt_val_acc }}</td>
                <td>{{trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].current_train_tag_group_bert_val_acc }}</td>
              </tr>
<!--              <tr>-->
<!--                <td>test</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].current_train_tag_group_gpt_test_acc }}</td>-->
<!--                <td>{{ trainResultData.tag_group_stats[wordTagGroups[selectedWordTagGroupId].tag_group_id].current_train_tag_group_bert_test_acc }}</td>-->
<!--              </tr>-->
              </tbody>
            </v-table>
          </div>
          <div v-else class="card-content card-content-tag">태그 그룹이 존재하지 않습니다.</div>
        </div>
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

import Chart from 'chart.js/auto'


const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const setTextColorToBackground = (hex) => {
  const rgb = hexToRgb(hex)
  const brightness = Math.round(((parseInt(rgb.r) * 299) +
      (parseInt(rgb.g) * 587) +
      (parseInt(rgb.b) * 114)) / 1000)
  return (brightness > 125) ? 'black' : 'white'
}

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
    drawParagraphChart() {
      if (this.paragraphTagGroups.length === 0) {
        return
      }
      const canvas = document.getElementById('chart-tag-ratio-paragraph');
      this.nowDrawingParagraph = true

      if (this.chartRatioParagraph !== null && this.chartRatioParagraph.ctx) {
        this.chartRatioParagraph.destroy();
      }

      const datasets = [{
        // label: this.tagGroups[this.selectedTagGroupId].tag_group_name + " 태깅 현황",
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
      const labels = []
      let notTagged = 100.0
      for (let tag of this.trainResultData.tag_group_stats[this.paragraphTagGroups[this.selectedParagraphTagGroupId].tag_group_id].per_tag_count) {
        const rgb = hexToRgb(tag.tag_color)
        labels.push(tag.tag_name)
        const tagged = Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100
        notTagged -= tagged
        datasets[0].data.push(tagged)
        datasets[0].backgroundColor.push(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
      }

      if (notTagged > 0) {
        labels.push("태그되지 않음")
        datasets[0].data.push(notTagged)
        datasets[0].backgroundColor.push('rgb(0, 0, 0)')
      }

      this.chartRatioParagraph = new Chart(
          canvas,
          {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: datasets
            },
            options: {
              animation: {
                onComplete: () => {
                  console.log("Animation completed");
                  this.nowDrawingParagraph = false
                }
              },
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
            },
          },
      );
    },
    drawSentenceChart() {
      if (this.sentenceTagGroups.length === 0) {
        return
      }
      const canvas = document.getElementById('chart-tag-ratio-sentence');
      this.nowDrawingSentence = true

      if (this.chartRatioSentence !== null && this.chartRatioSentence.ctx) {
        this.chartRatioSentence.destroy();
      }

      const datasets = [{
        // label: this.tagGroups[this.selectedTagGroupId].tag_group_name + " 태깅 현황",
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
      const labels = []
      let notTagged = 100.0
      for (let tag of this.trainResultData.tag_group_stats[this.sentenceTagGroups[this.selectedSentenceTagGroupId].tag_group_id].per_tag_count) {
        const rgb = hexToRgb(tag.tag_color)
        labels.push(tag.tag_name)
        const tagged = Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100
        notTagged -= tagged
        datasets[0].data.push(tagged)
        datasets[0].backgroundColor.push(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
      }

      if (notTagged > 0) {
        labels.push("태그되지 않음")
        datasets[0].data.push(notTagged)
        datasets[0].backgroundColor.push('rgb(0, 0, 0)')
      }

      this.chartRatioSentence = new Chart(
          canvas,
          {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: datasets
            },
            options: {
              animation: {
                onComplete: () => {
                  console.log("Animation completed");
                  this.nowDrawingSentence = false
                }
              },
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
            },
          },
      );
    },
    drawWordChart() {
      if (this.wordTagGroups.length === 0) {
        return
      }
      const canvas = document.getElementById('chart-tag-ratio-word');
      this.nowDrawingWord = true

      if (this.chartRatioWord !== null && this.chartRatioWord.ctx) {
        this.chartRatioWord.destroy();
      }

      const datasets = [{
        // label: this.tagGroups[this.selectedTagGroupId].tag_group_name + " 태깅 현황",
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
      const labels = []
      let notTagged = 100.0
      for (let tag of this.trainResultData.tag_group_stats[this.wordTagGroups[this.selectedWordTagGroupId].tag_group_id].per_tag_count) {
        const rgb = hexToRgb(tag.tag_color)
        labels.push(tag.tag_name)
        const tagged = Math.ceil(tag.data_count / this.trainResultData.total_data_count * 10000) / 100
        notTagged -= tagged
        datasets[0].data.push(tagged)
        datasets[0].backgroundColor.push(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
      }

      if (notTagged > 0) {
        labels.push("태그되지 않음")
        datasets[0].data.push(notTagged)
        datasets[0].backgroundColor.push('rgb(0, 0, 0)')
      }

      this.chartRatioWord = new Chart(
          canvas,
          {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: datasets
            },
            options: {
              animation: {
                onComplete: () => {
                  console.log("Animation completed");
                  this.nowDrawingWord = false
                }
              },
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
              },
            },
          },
      );
    },
    drawChart() {
      this.drawParagraphChart()
      this.drawSentenceChart()
      this.drawWordChart()
    },
    async projectListLeftClick(e, id, name) {
      if (!this.nowDrawingSentence && !this.nowDrawingWord && !this.nowDrawingParagraph) {
        this.selectedProjectId = id
        this.selectedProjectName = name
        await loadHistory(this, this.selectedProjectId)
        this.drawChart()
      }
    },
    async changeGroupSentence(v) {
      this.selectedSentenceTagGroupId = v
      console.log(this.selectedSentenceTagGroupId)
      this.drawSentenceChart()
    },
    async changeGroupWord(v) {
      this.selectedWordTagGroupId = v
      console.log(this.selectedWordTagGroupId)
      this.drawWordChart()
    },
    async changeGroupParagraph(v) {
      this.selectedParagraphTagGroupId = v
      console.log(this.selectedParagraphTagGroupId)
      this.drawParagraphChart()
    },
    chipBackground (color) {
      return {
        'background': color
      }
    },
    setChipBackgroundColor(hex) {
      return {'color': setTextColorToBackground(hex)};
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/dashboard.scss";
</style>