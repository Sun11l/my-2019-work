<template>
  <div class="config-user pagecontainer">
    <el-tabs v-model="activeName" type="card" @tab-click='handleClick'>
      <el-tab-pane label="基本信息" name="first">
        <div class="tab-content">
          <user-info :info='userInfo' :online='onlineUser'/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户列表" name="second">
        <div class="tab-content">
          <user-list :list='userlist' @updateList='updateList'/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="third" v-if="checkSuperUser()">
        <div class="tab-content">
          <change-password/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="权限管理" name="fourth" v-if="checkSuperUser()">
        <div class="tab-content" v-loading='loading'>
          <permission :rolelist='rolelist'/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="操作日志" name="fifth" v-if="checkSuperUser()">
        <div class="tab-content" v-loading='loading'>
          <action-log :actionlog='actionlog' @updateActionList='updateActionList'/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="登录日志" name="sixth" v-if="checkSuperUser()">
        <div class="tab-content" v-loading='loading'>

          <login-log :loginlog='loginlog' @updateLoginList='updateLoginList' />
        </div>
      </el-tab-pane>

      <el-tab-pane label="LDAP配置" name="seventh" v-if="checkSuperUser()">
        <div class="tab-content" v-loading='loading'>
          <ldap :ldapForm='ldapConfig' @updateLdap='updateLdap'/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserInfo from '@/components/Userinfo'
import UserList from '@/components/Userlist'
import ChangePassword from '@/components/ChangePassword'
import Permission from '@/components/Permission'
import ActionLog from '@/components/ActionLog'
import LoginLog from '@/components/LoginLog'
import Ldap from '@/components/Ldap'
import Err403 from '@/components/errorPages/403'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'first',
      userInfo: {},
      onlineUser: [],
      userlist: {},
      loginlog: {},
      actionlog: {},
      ldapConfig: {},
      rolelist: [],
      loading: false
    }
  },
  components: {
    UserInfo,
    UserList,
    ChangePassword,
    ActionLog,
    LoginLog,
    Permission,
    Ldap,
    Err403
  },
  activated () {
    this.getUserInfo()
    this.getOnlineUser()
  },
  computed: {
    ...mapGetters([
      'permissionlist',
    ]),
  },
  methods: {
    getUserInfo () {
      this.$store.dispatch('config/getInfo')
        .then((data) => {
          this.userInfo = data
        })
    },
    getOnlineUser () {
      this.$store.dispatch('config/getOnlineList').then(({data}) => {
        this.onlineUser = data
      })
    },
    getUserList () {
      this.$store.dispatch('config/getUserList', {limit: 10, offset: 1})
        .then(({data}) => {
          this.userlist = data
        })
        .catch(e => {
          console.log(e)
        })
      this.loading = false
    },
    getRolesList () {
      this.$store.dispatch('config/getRoles').then(res => {
        const { status, data } = res
        if (status === 200) {
          this.rolelist = data
        }
        this.loading = false
      })
    },
    getActionLog () {
      this.$store.dispatch('config/getActionLog', {limit: 10, offset: 1}).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.actionlog = data
        }
        this.loading = false
      })
    },
    getLoginLog () {
      this.$store.dispatch('config/getLoginLog', {limit: 10, offset: 1}).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.loginlog = data
        }
        this.loading = false
      })
    },
    getLdapConfig () {
      this.$store.dispatch('config/getLdapConfig').then(res => {
        const { status, data } = res
        if (status === 200) {
          this.ldapConfig = data
        }
        this.loading = false
      })
    },
    updateList (data) {
      this.userlist = data
    },
    updateActionList (data) {
      this.actionlog = data
    },
    updateLoginList (data) {
      this.loginlog = data
    },
    updateLdap (data) {
      this.ldapConfig = data
    },
    handleClick ({index}) {
      this.loading = true
      switch (index) {
        case '0':
          this.getUserInfo()
          this.getOnlineUser()
          break
        case '1':
          this.getUserList()
          break
        case '3':
          this.getRolesList()
          break
        case '4':
          this.getActionLog()
          break
        case '5':
          this.getLoginLog()
          break
        case '6':
          this.getLdapConfig()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.config-user{
  /deep/ .el-tabs__nav-scroll {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .tab-content {
    border: 1px solid #ddd;
    background: #fff;
    padding: 10px 20px;
  }
}
</style>
