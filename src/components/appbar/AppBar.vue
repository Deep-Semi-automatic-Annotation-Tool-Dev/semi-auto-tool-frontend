<template>
  <div id="appbar-root">
    <div id="appbar-title">TAG ANNOTATOR</div>
    <div id="appbar-nav-area">
<!--      <div class="appbar-nav-btn" @click="gotoPage('index')">HOME</div>-->
      <div class="appbar-nav-btn" @click="gotoPage('project')">PROJECT</div>
      <div class="appbar-nav-btn" @click="gotoPage('dashboard')">DASHBOARD</div>
      <div class="appbar-nav-btn" @click="gotoExternalPage('https://atom-basin-5f5.notion.site/Auto-Tagging-7c64a7403eb24bc6bf5e7a8371812378?pvs=4')">HELP</div>
    </div>
  </div>
</template>

<script>
import {gotoPage, gotoExternalPage} from '../../js/route.js'

export default {
  name: "AppBar",
  setup() {
    return {
      gotoPage,
      gotoExternalPage
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/layouts/appbar.scss";
</style>