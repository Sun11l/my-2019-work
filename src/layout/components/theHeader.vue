<template>
  <div>
    <div class='logo' @click="goToDashboard">
      <img src="@/assets/logo.png" alt="XXXX科技有限公司" title="XXXX科技有限公司">
      <p>XXXXX</p>
    </div>
    <div class='user'>
      <el-tooltip content="查看通知" effect="dark" placement="bottom">
        <bell class="bell right-menu-item hover-effect fl" ref="bell" @click.native="refreshLogs"/>
      </el-tooltip>
      <user class='right-menu-item hover-effect fl'/>
    </div>
  </div>
</template>

<script>
import user from './header/user'
import bell from './header/bell'
export default {
  components: {
    user, bell
  },
  methods: {
    goToDashboard () {
      this.$router.push('/')
    },
    refreshLogs () {
      this.$refs.bell.getBellLogs()
    }
  }
}
</script>

<style lang='scss' scoped>
  .logo{
    height: 100%;
    line-height: 60px;
    float: left;
    cursor: pointer;
    img {
      height: 60px;
      padding: 10px 20px;float: left;
    }
    p{
      float: left;
      font-size: 30px;
      color: #fff;
      font-weight: 700;
    }
  }
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
  color: #fff;
  &.hover-effect {
    cursor: pointer;
    transition: background .3s;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
}
.user{
  float: right;
}
.bell{
  margin-top: 20px;
}
</style>
