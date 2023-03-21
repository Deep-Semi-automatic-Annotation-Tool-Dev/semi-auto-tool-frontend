<template>
  <div id="layout-root">
    <AppBar></AppBar>
    <div id="layout-project-root">
      <div id="layout-project-sidebar">
        <div id="layout-sidebar-project-list">
          <div id="text-project-list-title">프로젝트 목록</div>
          <div id=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from './appbar/AppBar';

export default {
  name: "ProjectComponent",
  components: {
    AppBar
  }
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>