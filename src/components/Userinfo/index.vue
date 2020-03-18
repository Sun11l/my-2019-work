<template>
   <ul class='user-info'>
      <li>
        <span class="title">账号：</span>
        <span class="detail">{{ info.username }}</span>
      </li>
      <li>
        <span class="title">邮箱：</span>
        <span class="detail">{{ info.email }}</span>
      </li>
      <li>
        <span class="title">角色：</span>
        <span class="detail">{{ roleName }}</span>
      </li>
      <li>
        <span class="title">登陆次数：</span>
        <span class="detail">{{ info.login_count }}</span>
      </li>
      <li>
        <span class="title">最后登录时间：</span>
        <span class="detail">{{ info.last_login | formatTime }}</span>
      </li>
      <li>
        <span class="title">最后登录IP：</span>
        <span class="detail">{{ info.last_login_ip }}</span>
      </li>
      <li>
        <span class="title">当前在线用户：</span>
        <ul class="detail">
          <li v-for="(item, index) in online" :key='index' style="padding-right: 16px;">{{ item.user }}</li>
        </ul>
      </li>
    </ul>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    online: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      roleName: ''
    }
  },
  watch: {
    info ({role}) {
      this.roleName = role === null ? '超级管理员' : role.role_name
    }
  },
}
</script>

<style lang="scss" scoped>
.user-info{
    >li {
      overflow: hidden;
      padding: 20px 0;
      font-size: 14px;
      .title{
        float: left;
        width: 180px;
        margin-right: 50px;
        text-align: right;
        font-weight: bold;
      }
      .detail{
        overflow: hidden;
        >li{
          float: left;
          margin: 0 10px 5px 0;
        }
      }
    }
  }
</style>
