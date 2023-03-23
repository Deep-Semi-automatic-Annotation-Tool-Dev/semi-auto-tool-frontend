<template>
  <div id="layout-root">
    <AppBar></AppBar>
    <div id="layout-project-root">
      <div id="layout-project-sidebar">
        <div id="layout-sidebar-project-list">
          <div id="text-project-list-title">프로젝트 목록</div>
          <v-list lines="one" id="text-project-list-item" class="list-vuetify" density="compact">
            <v-list-item
                class="list-vuetify-item"
                v-for="item in items()"
                :key="item.value"
                :value="item.value">
              <v-list-item-title v-text="item.title" class="list-vuetify-title"></v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <v-btn color="light_magenta" id="text-project-create-btn" prepend-icon="mdi-plus">
          프로젝트생성
        </v-btn>
      </div>
      <div id="layout-project-editor">
        <div id="layout-project-text-area">
          <div id="layout-project-editor-top">
            <div id="editor-top-title">프로젝트 제목</div>
            <v-btn color="light_magenta" height="30">
              저장
            </v-btn>
            <v-btn color="light_brown" height="30">
              텍스트 로드
            </v-btn>
          </div>
          <div id="layout-project-editor-main">
            <div id="layout-project-editor-main-title">
              <div id="editor-main-title">-선택된 태그구성-</div>
            </div>
            <p id="editor-main-lines" class="list-vuetify-light">
              <span
                  v-for="(l, idx) in lineData"
                  :key="l"
                  :class="getTagClasses(l.tags)"
                  class="text-line"
                  :data-tooltip="idx"
                  @mouseover="lineOver"
              >{{ l.data }}</span>
            </p>
          </div>
        </div>
        <div id="layout-project-tag-area">
          <div id="tags-group-select-area">
            <v-container class="pa-0 ma-0">
              <v-select
                  label="태그 그룹"
                  density="comfortable"
                  :items="tagGroups"
                  item-title="name"
                  item-value="value"
                  :hide-details="true"
                  @update:model-value="changeGroup"
              ></v-select>
            </v-container>
            <v-container class="pa-0 ma-0">
              <v-btn color="light_magenta" id="tags-group-add-btn">
                그룹 추가
              </v-btn>
            </v-container>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from './appbar/AppBar';

const generateRandomString = (num) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const generateTestLines = () => {
  const data = [];
  for (let i = 0;i < 100;i++) {
    const strLength = Math.floor(Math.random() * (100 - 25)) + 25;
    let tags = {}
    for (let j = 0;j < 6;j++) {
      if (Math.round(Math.random() - 0.1)) {
        const type = Math.floor(Math.random() * 6)
        tags[j] = {groupId: j, name: `타입 ${type}`, type: type}
      }
    }
    data.push({data: generateRandomString(strLength) + '.', tags: tags});
  }
  return data;
}

const generateTagGroups = () => {
  const group = []
  for (let i = 0;i < 6;i++) {
    group.push({value: i, name: `group ${i}`})
  }
  return group;
}

export default {
  name: "ProjectComponent",
  data() {
    return {
      items: () => {
        const data = [];
        for (let i = 0;i < 100;i++) {
          data.push({title: `${i}` + ' item', value: i});
        }
        return data;
      },
      lineData: generateTestLines(),
      tagGroups: generateTagGroups(),
      selectedTagGroup: 0
    }
  },
  components: {
    AppBar
  },
  methods: {
    getTagClasses(tags) {
      let classes = []
      for (const obj in tags) {
        if (this.selectedTagGroup === Number(obj)) {
          classes.push(`highlight${tags[obj].type}`)
        }
      }
      return classes
    },
    lineOver(event) {
      const target = event.target;
      const tooltipHtml = Number(target.dataset.tooltip);
      const targetTags = this.lineData[tooltipHtml].tags;

      if (targetTags[this.selectedTagGroup] === undefined) return
      let tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.innerHTML = targetTags[this.selectedTagGroup].name;
      let coords = target.getBoundingClientRect();
      let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0;

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) {
        top = coords.top + target.offsetHeight + 5;
      }

      tooltipElem.style.left = (event.clientX + 5) + 'px';
      tooltipElem.style.top = top + 'px';

      document.body.append(tooltipElem);

      document.onmouseout = function() {
        if (tooltipElem) {
          tooltipElem.remove();
          tooltipElem = null;
        }
      };
    },
    changeGroup(v) {
      console.log(v)
      this.selectedTagGroup = v
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>