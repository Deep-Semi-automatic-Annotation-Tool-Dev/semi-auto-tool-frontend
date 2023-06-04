<template>
  <div class="layout-dashboard-card card-w100">
    <div class="card-title">{{ typeText() }} 태깅 정보</div>
    <v-divider color="white" thickness="1" style="width: 100%"></v-divider>
    <div v-if="tagGroups.length > 0" class="card-content card-content-tag">
      <v-container class="pa-0 ma-0">
        <v-select
            label="태그 그룹"
            density="compact"
            :items="tagGroups"
            item-title="tag_group_name"
            item-value="value"
            :hide-details="true"
            @update:model-value="changeGroup"
            :disabled="nowDrawing"
            v-model="tagGroupSelectionModel"
        ></v-select>
      </v-container>
      <div class="card-content-row">
        <div class="card-content-row-center">
          <div>태그그룹 태깅 비율</div>
          <div v-if="trainResultData.data_cnt_each_data_type[dataType] > 0">{{ Math.ceil(trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].tag_group_tagged_count / trainResultData.data_cnt_each_data_type[dataType] * 10000) / 100 }}%</div>
          <div v-else>0%</div>
        </div>
        <div class="card-content-row-center">
          <div>태그그룹 태그 개수</div>
          <div>{{ trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].per_tag_count.length }}개</div>
        </div>
      </div>
      <div class="card-content-tag-ratio">
        <div class="card-content-row-tags">
          <v-chip
              v-for="tag in trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].per_tag_count"
              :key="tag.tag_name"
              size="small"
              style="margin-right: 10px"
              :style="[chipBackground(`#${tag.tag_color}`),
                      setChipBackgroundColor(`#${tag.tag_color}`)]"
          >
            {{ tag.tag_name }} - {{ Math.ceil(tag.data_count / trainResultData.data_cnt_each_data_type[dataType] * 10000) / 100 }}%
          </v-chip>
        </div>
        <canvas :id="idName"></canvas>
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
          <td>{{ trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].current_train_tag_group_gpt_val_acc }}</td>
          <td>{{trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].current_train_tag_group_bert_val_acc }}</td>
        </tr>
        <!--              <tr>-->
        <!--                <td>test</td>-->
        <!--                <td>{{ trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].current_train_tag_group_gpt_test_acc }}</td>-->
        <!--                <td>{{ trainResultData.tag_group_stats[tagGroups[selectedTagGroupId].tag_group_id].current_train_tag_group_bert_test_acc }}</td>-->
        <!--              </tr>-->
        </tbody>
      </v-table>
    </div>
    <div v-else class="card-content card-content-tag">태그 그룹이 존재하지 않습니다.</div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

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
  name: "TagInformation",
  props: {
    tagGroups: {
      default: []
    },
    tagGroupSelectionModelProp: {
      default: 0
    },
    trainResultData: {
      default: null
    },
    selectedTagGroupIdProp: {
      default: 0
    },
    dataType: {
      default: 1
    },
    idName: {
      default: 'chart-tag-ratio'
    }
  },
  data() {
    return {
      tagGroupSelectionModel: this.tagGroupSelectionModelProp,
      nowDrawing: false,
      chartRatio: null,
      selectedTagGroupId: 0,
      typeText: () => {
        if (this.dataType === this.DATA_TYPE_PARAGRAPH) {
          return '문단'
        } else if (this.dataType === this.DATA_TYPE_WORD) {
          return '단어'
        } else {
          return '문장'
        }
      }
    }
  },
  methods: {
    async changeGroup(v) {
      this.selectedTagGroupId = v
      console.log(this.selectedTagGroupId)
      this.drawChart()
    },
    drawChart() {
      if (this.tagGroups.length === 0) {
        return
      }
      const canvas = document.getElementById(this.idName);
      this.nowDrawing = true
      this.$emit('changeStatus', this.nowDrawing)

      if (this.chartRatio !== null && this.chartRatio.ctx) {
        this.chartRatio.destroy();
      }

      const datasets = [{
        // label: this.tagGroups[this.selectedTagGroupId].tag_group_name + " 태깅 현황",
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
      const labels = []
      let notTagged = 100.0
      for (let tag of this.trainResultData.tag_group_stats[this.tagGroups[this.selectedTagGroupId].tag_group_id].per_tag_count) {
        const rgb = hexToRgb(tag.tag_color)
        labels.push(tag.tag_name)
        const tagged = Math.ceil(tag.data_count / this.trainResultData.data_cnt_each_data_type[this.dataType] * 10000) / 100
        notTagged -= tagged
        datasets[0].data.push(tagged)
        datasets[0].backgroundColor.push(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
      }

      if (notTagged > 0) {
        labels.push("태그되지 않음")
        datasets[0].data.push(notTagged)
        datasets[0].backgroundColor.push('rgb(0, 0, 0)')
      }

      this.chartRatio = new Chart(
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
                  console.log(`${this.typeText()} Animation completed`);
                  this.nowDrawing = false
                  this.$emit('changeStatus', this.nowDrawing)
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
    chipBackground (color) {
      return {
        'background': color
      }
    },
    setChipBackgroundColor(hex) {
      return {'color': setTextColorToBackground(hex)};
    },
  },
  watch: {
    tagGroupSelectionModelProp() {
      this.tagGroupSelectionModel = this.tagGroupSelectionModelProp
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/pages/dashboard.scss";
</style>