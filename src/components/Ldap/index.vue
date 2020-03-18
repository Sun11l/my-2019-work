<template>
  <div class="ldap-container">
    <div class="title">LDAP Config</div>
    <div class="content">

      <div class="info-show">
        <el-form ref='ldapForm' autocomplete="off" :model='ldapForm' :rules='ldapFormRules' size="small" label-width="200px" style="margin-top:20px;">
          <el-form-item label='HOST' prop='host' style='width:50%;'>
            <el-input v-model='ldapForm.host' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">LDAP服务器主机名</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='PORT' prop='port' style='width:50%;'>
            <el-input type="port" v-model.number='ldapForm.port' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">LDAP服务器端口</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='ACCOUNT SUFFIX' prop='account_suffix' style='width:50%;'>
            <el-input v-model='ldapForm.account_suffix' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">域服务器的账号后缀，默认<b style="font-weight: bold;">@cmrh.com</b></div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='BASE DN' prop='base_dn' style='width:50%;'>
            <el-input v-model='ldapForm.base_dn' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">LDAP服务器上的使用环境</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='BIND DN' prop='bind_dn' style='width:50%;'>
            <el-input v-model='ldapForm.bind_dn' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">用于绑定到LDAP服务器的可分辨名称，通常是管理员的DN</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='BIND DN USERNAME' prop='username' style='width:50%;'>
            <el-input v-model='ldapForm.username' autocomplete='off' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">这个参数取决于BIND DN中的CN</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
          </el-form-item>

          <el-form-item label='BIND DN PASSWORD' prop='password' style='width:50%;'>
            <el-input ref="password" :type="passwordType" v-model='ldapForm.password' autocomplete='off' style="width:95%;"></el-input>
            <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
              <div slot="content">BIND DN的密钥</div>
              <svg-icon icon-class="question"  class-name='question-svg'/>
            </el-tooltip>
            <span class="show-pwd" @mousedown="showPwd" @mouseup='hidePwd'>
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-form-item label='USER ATTRIBUTE' prop='user_attr' style='width:50%;'>
            <el-tag
              :key="tag"
              v-for="tag in ldapForm.user_attr"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Attributes</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
    <div class="save" style="text-indent: 5em">
      <el-button type='primary' size='small' @click='saveConfig'>保 存</el-button>
    </div>
  </div>
</template>
<script>
import { getLdap } from '@/api/config/user'
export default {
  data () {
    return {
      ldapFormRules: {
        host: [
          { required: true, message: '此选项为必填项', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
          { type: 'number', message: '此选项必须为数字', trigger: 'blur' }
        ],
        account_suffix: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
        ],
        base_dn: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
        ],
        bind_dn: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
          { min: 8, message: '此选项至少8个字符', trigger: 'blur' }
        ],
        user_attr: [
          { required: true, message: '此选项为必填项', trigger: 'blur' },
        ]
      },
      passwordType: 'password',
      inputVisible: false,
      inputValue: '',
      ldapForm1: {
        host: '',
        port: '',
        account_suffix: '',
        base_dn: '',
        password: '',
        user_attr: []
      }
    }
  },
  props: {
    ldapForm: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleClose (tag) {
      this.ldapForm.user_attr.splice(this.ldapForm.user_attr.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.ldapForm.user_attr.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    saveConfig () {
      this.$refs['ldapForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$store.dispatch('config/setLdapConfig', this.ldapForm).then(() => {
          getLdap().then(({data}) => {
            this.emitSetLdap(data)
            this.$nextTick(() => {
              this.$refs['ldapForm'].clearValidate()
            })
          })
        })
      })
    },
    emitSetLdap (value) {
      this.$emit('updateLdap', value)
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
    }
  }
}
</script>
<style lang='scss' scoped>
.ldap-container{
  .title{
    font-weight: 700;
    font-size: 16px;
  }
  .content{
    .info-show{
      .el-form{
        /deep/ .el-form-item__label{
          // font-weight:700;
        }
      }
      .el-tag {
        margin-right: 10px;
        margin-bottom: 5px;
      }
      .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
    .show-pwd {
      position: absolute;
      right: 40px;
      top: 2px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
    .question-svg{
      float: right;
      height: 20px;
      margin-top: 6px;
    }
  }
}
</style>
