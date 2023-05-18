<template>
  <div id="appbar-root">
    <div id="appbar-title">TAG ANNOTATOR</div>
    <div id="appbar-nav-area">
<!--      <div class="appbar-nav-btn" @click="gotoPage('index')">HOME</div>-->
      <div class="appbar-nav-btn" @click="gotoPage('project')">PROJECT</div>
      <div class="appbar-nav-btn" @click="gotoPage('dashboard')">DASHBOARD</div>
    </div>
  </div>
</template>

<script>
import {gotoPage} from '../../js/route.js'

export default {
  name: "AppBar",
  setup() {
    return {
      gotoPage
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/layouts/appbar.scss";
</style>