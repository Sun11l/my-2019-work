<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        mode="vertical">
        <!-- <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" /> -->
        <sidebar-item v-for="route in menu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      'sidebar',
      'menu'
    ]),
    activeMenu () {
      let route = this.$route
      let { path } = route
      if (path === '/event/index/detail') {
        path = '/event/index'
        return path
      }
      if (path === '/playbooks/create') {
        path = '/playbooks/index'
        return path
      }
      return path
    },
    isCollapse () {
      return !this.sidebar.opened
    },
  },
}
</script>
