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
                  v-for="l in lineData()"
                  :key="l"
                  :class="getTagClasses(l.tags)"
                  class="text-line"
              >{{ l.data }}<span class="tag-tooltip">{{ l.tags }}</span></span>
            </p>
          </div>
        </div>
        <div id="layout-project-tag-area">

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
      lineData: () => {
        const data = [];
        for (let i = 0;i < 100;i++) {
          const strLength = Math.floor(Math.random() * (100 - 25)) + 25;
          let tags = []
          for (let j = 0;j < 6;j++) {
            if (Math.round(Math.random() - 0.3)) {
              tags.push({type: j, name: `타입 ${j}`})
            }
          }
          data.push({data: generateRandomString(strLength) + '.', tags: tags});
        }
        return data;
      }
    }
  },
  components: {
    AppBar
  },
  methods: {
    getTagClasses(tags) {
      let classes = []
      for (const element of tags) {
        classes.push(`highlight${element.type}`)
      }
      return classes
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>