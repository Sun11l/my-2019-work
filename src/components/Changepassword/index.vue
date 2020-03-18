<template>
  <div class="com-changepwd" v-loading='loading'>
    <el-form :model='passwordForm' ref='passwordForm' :rules="rules" size="small" label-width="80px" style="margin-top:20px;">
            <el-form-item label="原密码" prop='oldPassword' style='width:30%;'>
              <el-input type='password' v-model='passwordForm.oldPassword'></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop='newPassword' style='width:30%;'>
              <el-input type='password' v-model="passwordForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop='confirmPassword' style='width:30%;min-width:200px;'>
              <el-input type='password' v-model="passwordForm.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPasswordForm">提交</el-button>
            </el-form-item>
          </el-form>
  </div>
</template>

<script>
import { isPassword } from '@/utils/validate'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (!isPassword(value)) {
          callback(new Error('包含（大写英文字母、小写英文字母、数字、特殊字符）中至少三类字符'))
        }
        if (value.length < 8 || value.length > 16) {
          callback(new Error('密码长度为8~16位（包括）'))
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    submitPasswordForm () {
      this.$refs.passwordForm.validate((valid) => {
        if (!valid) return false
        this.loading = true
        let { oldPassword, newPassword } = this.passwordForm
        this.$store.dispatch('config/changePassword', { old_password: oldPassword, new_password: newPassword }).then(res => {
          if (res.status === 200) {
            this.$store.dispatch('user/resetToken').then(() => {
              let seconds = 3
              this.$message({
                type: 'success',
                message: `密码修改成功，${seconds}秒后自动返回登录页面`,
                duration: 3000
              })
              setTimeout(() => {
                this.resetForm('passwordForm')
                location.reload()
              }, 3000)
            })
          }
          this.loading = false
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang='scss'>
.com-changepwd{
  .el-form{
    &-item{
      margin-bottom: 40px;
    }
  }
}
</style>
