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
    </div>
  </div>
</template>

<script>
import AppBar from './appbar/AppBar';

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
      }
    }
  },
  components: {
    AppBar
  },
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>