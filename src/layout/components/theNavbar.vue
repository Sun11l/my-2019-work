<template>
  <div class='navbar'>
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="bus-btn" v-if='$route.name === "AppConfig" && checkPermission("appconfig")'>
      <el-button size='small' type='primary' @click="openDialog">+添加应用</el-button>
    </div>
    <div class="bus-btn" v-if='$route.name === "Event" && checkPermission("event")'>
      <el-button size='small' type='primary' @click="openEventDialog">+添加事件</el-button>
    </div>
    <div class="bus-btn" v-if='$route.name === "Playbooks" && checkPermission("playbook")'>
      <el-button size='small' type='primary' @click="handleToCreate">+创建工作流</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    // Coa,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'addAppDialog',
    ])
  },
  methods: {
    handleChild () {
      this.$parent.$children[1].$children[0].getPlaybookLists()
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    openDialog () {
      this.$store.dispatch('bus/openAddAppDialog')
    },
    openEventDialog () {
      this.$store.dispatch('bus/openEventDialog')
    },
    openPlaybookDialog () {},
    handleToCreate () {
      this.$router.push('/playbooks/create')
      this.$store.dispatch('app/closeSideBar')
    },
  }
}
</script>
