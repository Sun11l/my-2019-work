<template>
  <div :class="classObj" class="app-wrapper">
    <the-header class="header-container" />
    <the-sidebar class="sidebar-container" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="main-container">
        <the-navbar />
        <tags-view />
        <app-main />
        <div
          class="footer-text"

        >Copyright &copy; 2020 XXXXX 技信息安全部</div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { theHeader, theSidebar, theNavbar, appMain, TagsView } from '@/layout/components'
import { mapState } from 'vuex'
export default {
  components: {
    theHeader,
    theSidebar,
    theNavbar,
    appMain,
    TagsView
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.header-container {
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: $zIndex;
  background: $headerBg;
}
.el-scrollbar {
  background: #eee;
  position: relative;
  /deep/ .el-scrollbar__view {
    height: calc(100% - 60px);
  }
  .main-container {
    min-height: 100%;
    margin-left: $sideBarWidth;
    transition: margin-left 0.28s;
    position: relative;
    margin-top: 60px;
    overflow: hidden;
  }
  .footer-text {
    position: absolute;
    bottom: 0;
    height: 60px;
    width: 100%;
    z-index: $zIndex;
    line-height: 60px;
    text-align: center;
    color: #333;
    background: #ccc;
    font-size: 16px;
  }
}
</style>
