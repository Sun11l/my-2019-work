<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="off" label-position="left">

      <div class="title-container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="">
        </div>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- <span class="label">用 户</span>| -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入域账户"
          type="text"
          tabindex="1"
          autofocus />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写输入已锁定" placement="right" manual>
        <el-form-item prop="password">
          <!-- <span class="label">密 码</span>| -->
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="password"
            :key="passwordType"
            v-model="loginForm.password"
            :type="passwordType"
            autocomplete="new-password"
            placeholder="请输入密码"
            tabindex="2"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @mousedown="showPwd" @mouseup='hidePwd'>
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>

  </div>
</template>

<script>
import { getPubkey } from '@/api/common/encryption'
import { JSEncrypt } from 'jsencrypt'
import { checkPermission } from '@/utils/checkPermission'
// checkPermission

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的账户'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: null,
      pubkey: ''
    }
  },
  watch: {
    // $route: {
    //   handler: function (route) {
    //     const query = route.query
    //     let reg = /^\/event\/index\/detail*/g
    //     if (query) {
    //       if (query.redirect === '/playbooks/create') {
    //         this.redirect = '/playbooks/index'
    //       } else if (reg.test(query.redirect)) {
    //         this.redirect = '/event/index'
    //       } else {
    //         this.redirect = query.redirect
    //       }
    //     }
    //   },
    //   immediate: true
    // },
  },
  methods: {
    encryptedData (publicKey, data) {
      let encryptor = new JSEncrypt()
      encryptor.setPublicKey(publicKey)
      return encryptor.encrypt(data)
    },
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    hidePwd () {
      this.passwordType = 'password'
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // getPubkey().then(({data}) => {
          //   let pubkey = data.pubkey
          //   this.$store.dispatch('user/login', {
          //     username: this.loginForm.username,
          //     password: this.encryptedData(pubkey, this.loginForm.password) // 公钥加密 
          //   })
          //     .then(() => {
          //       this.$store.dispatch('user/getInfo').then(async res => {
          //         await this.$store.dispatch('user/getPermission')
                  // this.$router.push({ path: this.redirect || '/' })
          //       })
                // this.loading = false
          //     })
          //     .catch(() => {
          //       this.loading = false
          //     })
          // }).catch(error => {
          //   console.log(error)
          //   this.loading = false
          // })
          this.$router.push({ path: '/dashboard' })
          this.loading = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  .label{
    color: #c0c4cc;
    width: 50px;
    display: inline-block;
    text-align: center;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 40px;
    .logo {
      text-align: center;
      img{
        width: 290px;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

}
</style>

<style lang="scss">
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
