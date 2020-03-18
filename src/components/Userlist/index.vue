<template>
  <div>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="dialogAddUser" width="50%">
      <el-form :model="addUserForm" ref='addUserForm' label-width="120px" size='small'>
        <el-form-item
          label="账号："
          prop='username'
          :rules="[{required: true,message: '此选项为必填项',trigger: 'blur'}]">
          <el-autocomplete
            clearable
            popper-class="add-user-autocomplete"
            v-model="addUserForm.username"
            :fetch-suggestions="ADmatchUser"
            @select="ADmatchUserSelect"
            placeholder="请输入内容"
            style="width: 90%;">
            <template slot-scope="scope">
              <span class="sAMAccountName fl">{{ scope.item.sAMAccountName }}</span>
              <span class="user fr" style="color: #b4b4b4;margin-left: 4px;">{{ scope.item.cn }}</span>
            </template>
          </el-autocomplete>

        </el-form-item>
          <!-- :rules="addUserForm.alias === undefined || addUserForm.alias === '' ? [{required: true,message: '此选项为必填项',trigger: 'blur'}] : []"> -->
        <el-form-item
          label="用户名："
          prop='alias'
          :rules="[{required: true,message: '此选项为必填项',trigger: 'blur'}]">
          <el-input
            v-model="addUserForm.alias"
            autocomplete="off"
            style="width:90%;">
          </el-input>
        </el-form-item>
        <el-form-item
          label="邮箱："
          prop='email'
          :rules="emailRules">
          <el-input
            v-model="addUserForm.email"
            autocomplete="off"
            style="width:90%;">
          </el-input>
        </el-form-item>
        <el-form-item
          label="号码："
          prop='mobile'
          :rules='phoneRules'>
          <el-input
            v-model="addUserForm.mobile"
            autocomplete="off"
            style="width:90%;">
          </el-input>
        </el-form-item>
        <el-form-item
          label="公司："
          prop='company'
          clearable>
          <el-input
            v-model="addUserForm.company"
            autocomplete="off"
            style="width:90%;"></el-input>
        </el-form-item>
        <el-form-item
          label="部门："
          prop='department'>
          <el-input
            v-model="addUserForm.department"
            autocomplete="off"
            style="width:90%;"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item
          label="用户组："
          prop='role'
          :rules="[{required: true,message: '此选项为必填项',trigger: 'change'}]"
        >
           <el-select v-model="addUserForm.role" placeholder="请选择用户组" style="width:90%;">
              <el-option v-for='item of roles' :label='item.role_name' :value='item.id' :key='item.id'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item
          label="用户状态："
          prop='is_active'
          :rules="[{required: true,message: '此选项为必填项',trigger: 'change'}]">
          <el-select v-model="addUserForm.is_active" placeholder="请选择用户状态" style="width:90%;">
              <el-option label="正常" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="title" class="dialog-title">
        添加用户
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size='small' type="primary" @click="confirmAddUser">确 定</el-button>
        <el-button size='small' @click="dialogAddUser = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog :visible.sync="dialogEditUser" width="50%">
      <el-form :model="editUserForm" ref='editUserForm' :rules='editFormRules' label-width="120px" size='small'>
        <el-form-item label="账号：" prop="username" :rules="[{required: true,message: '此选项为必填项',trigger: 'blur'}]">
          <el-input v-model="editUserForm.username" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="alias" :rules="[{required: true,message: '此选项为必填项',trigger: 'blur'}]">
          <el-input v-model="editUserForm.alias" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="号码：" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司：">
          <el-input v-model="editUserForm.company" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          <el-input v-model="editUserForm.department" autocomplete="off" style="width:90%;" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户组：" :rules="[{required: true,message: '此选项为必填项',trigger: 'change'}]">
            <el-select v-model="editUserRoleName" placeholder="请选择用户组" style="width:90%;" @change="selectGroup">
              <el-option v-for='item of roles' :label='item.role_name' :value='item.id' :key='item.id'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用户状态：" prop="is_active" :rules="[{required: true,message: '此选项为必填项',trigger: 'change'}]">
          <el-select v-model="editUserForm.is_active" placeholder="请选择用户状态" style="width:90%;">
              <el-option label="正常" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="title" class="dialog-title">
        编辑用户
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size='small' type="primary" @click="confirmEditUser">确 定</el-button>
        <el-button size='small' @click="dialogEditUser=false">取 消</el-button>
      </div>
    </el-dialog>

    <header>
      <el-button size='small' type='primary' icon="el-icon-plus" @click='addUserBtn' v-if="checkPermission('userconfig')">添加用户</el-button>
    </header>
    <section>
      <el-table
        :data="list['results']"
        border
        v-loading='loading'
        style="width: 100%">
        <el-table-column
          type="index"
          min-width="5%">
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="alias"
          label="用户名"
          align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="role"
          label="用户组"
          align="center"
          min-width="10%">
          <template slot-scope='scope'>{{ scope.row.role | filterRoleName }}</template>
        </el-table-column>
        <el-table-column
          prop="login_count"
          label="登陆次数"
          align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="last_login"
          label="最后登录时间"
          min-width="15%"
          align="center">
          <template slot-scope='scope'>{{ scope.row.last_login | formatTime }}</template>
        </el-table-column>
        <el-table-column
          prop="last_login_ip"
          label="最后登录IP"
          min-width="15%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="is_active"
          label="状态"
          align="center"
          min-width="10%">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.is_active === true ? 'yes': 'no'"  class-name='operator-svg'/>
            <span>{{scope.row.is_active === true ? '正常': '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="checkPermission('userconfig')"
          min-width="10%"
          align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect='light' :open-delay='500'>
              <svg-icon icon-class="edit"  class-name='operator-svg' @click='handleEdit(scope)'/>
            </el-tooltip>
            <el-tooltip :content="scope.row.is_active === false ? '启用' : '禁用'" placement="top" effect='light' :open-delay='500'>
              <svg-icon icon-class="forbid"  class-name='operator-svg' @click='handleForbid(scope)'/>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" effect='light' :open-delay='500'>
              <svg-icon icon-class="delete"  class-name='operator-svg' @click='handleDelete(scope)'/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change='handleChangeCurrentPage'
        @size-change='handleSizeChange'
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes, total"
        :total="list.count">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import { isPhoneNumber, validEmail } from '@/utils/validate'
export default {
  props: {
    list: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    var validatePhoneNumber = (rule, value, callback) => {
      if (value && !isPhoneNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }

    var validEmails = (rule, value, callback) => {
      if (value && !validEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    }
    return {
      dialogAddUser: false,
      dialogEditUser: false,
      addUserForm: {
        username: '',
        alias: '',
        email: '',
        mobile: '',
        company: '',
        department: '',
        role: '',
        is_active: ''
      },
      roles: [],
      phoneRules: [{validator: validatePhoneNumber, message: '请输入正确的手机号', trigger: 'blur'}],
      emailRules: [{ validator: validEmails, message: '请输入正确的邮箱', trigger: 'blur' }],
      editFormRules: {
        mobile: [
          { validator: validatePhoneNumber, trigger: 'blur' }
        ],
        email: [
          { validator: validEmails, trigger: 'blur' }
        ]
      },
      editUserForm: {
        username: '',
        alias: '',
        email: '',
        mobile: '',
        company: '',
        department: '',
        role: '',
        is_active: ''
      },
      editUserRoleName: '',
      editUserRoleNameId: '',
      loading: false,
      offset: 1,
      limit: 10
    }
  },
  methods: {
    addUserBtn () {
      this.dialogAddUser = true
      this.getRoles()
    },
    getRoles () {
      this.$store.dispatch('config/getRoles').then(res => {
        if (res.status === 200) {
          this.roles = res.data
        }
      })
    },
    getDefaultUserList () {
      this.loading = true
      let params = {
        limit: this.limit,
        offset: this.offset
      }
      this.$store.dispatch('config/getUserList', params).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.emitEditUser(res.data)
        }
      })
    },
    ADmatchUser (queryString, cb) {
      let list = []
      let data = {username: this.addUserForm.username}
      if (this.addUserForm.username && this.addUserForm.username.length >= 3) {
        this.$store.dispatch('config/ADSearch', data).then(res => {
          if (res.status === 200) {
            let data = res.data
            data && data.map(item => {
              list.push({
                cn: item.cn && item.cn[0],
                department: item.department && item.department[0],
                company: item.company && item.company[0],
                name: item.name && item.name[0],
                sAMAccountName: item.sAMAccountName && item.sAMAccountName[0],
                mail: item.mail && item.mail[0],
                mobile: item.mobile && item.mobile[0],
              })
            })
            cb(list)
          }
        })
      }
    },
    ADmatchUserSelect (data) {
      this.$refs.addUserForm.resetFields()
      this.addUserForm.username = data.sAMAccountName
      this.addUserForm.company = data.company
      this.addUserForm.mobile = data.mobile
      this.addUserForm.alias = data.cn
      this.addUserForm.email = data.mail
      this.addUserForm.department = data.department
    },
    handleEdit ({row}) {
      this.dialogEditUser = true
      this.editUserForm = Object.assign({}, row)
      this.editUserRoleName = row.role.role_name
      this.editUserRoleNameId = row.role.id
      this.getRoles()
    },
    selectGroup (groupID) {
      this.editUserRoleNameId = groupID
    },
    handleForbid ({row}) {
      let isActive = row.is_active === false ? '启用' : '禁用'
      this.$confirm(`确定${isActive}用户 "${row.username}" ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let id = row.id
        let data = {
          is_active: !row.is_active
        }
        this.$store.dispatch('config/forbidUser', {id, data}).then(res => {
          if (res.status === 200) {
            this.getDefaultUserList()
            this.$message({
              type: 'success',
              message: `${isActive}成功！`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${isActive}`
        })
      })
    },
    handleDelete ({row}) {
      this.$confirm(`确定删除用户 "${row.username}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        let id = row.id
        await this.$store.dispatch('config/deleteUser', id)
        this.getDefaultUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmEditUser () {
      let {
        username,
        alias,
        email,
        is_active,
        company,
        department,
        mobile,
        id
      } = this.editUserForm
      let data = {
        username,
        alias,
        email,
        role: this.editUserRoleNameId,
        is_active,
        company,
        department,
        mobile
      }
      this.$refs.editUserForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$store.dispatch('config/updateUserList', {id, data}).then(res => {
          if (res.status === 200) {
            this.$message.success('信息修改成功！')
            this.getDefaultUserList()
            this.dialogEditUser = false
          }
        })
      })
    },
    emitEditUser (value) {
      this.$emit('updateList', value)
    },
    confirmAddUser () {
      let {
        username,
        alias,
        email,
        company,
        department,
        mobile,
        role,
        is_active
      } = this.addUserForm
      let data = {
        username,
        alias,
        email,
        company,
        department,
        mobile,
        role,
        is_active
      }
      this.$refs['addUserForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$store.dispatch('config/addUser', data).then(res => {
          if (res.status === 201) {
            this.getDefaultUserList()
            this.resetForm('addUserForm')
            this.dialogAddUser = false
            this.$message.success('已成功添加！')
          }
        })
      })
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
      this.getDefaultUserList()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.getDefaultUserList()
    },
    resetForm (formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
    },
    fomatUTCTimeString (utc) {
      if (!utc) return
      return utc.replace(/T/, ' ').split('.')[0]
    }
  },
  filters: {
    filterRoleName (name) {
      switch (name) {
        case null:
          return '超级管理员'
        default:
          return name.role_name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
section{
  padding: 8px 0;
  .operator-svg{
    margin-right: 8px;
  }
  .el-pagination{
    text-align: center;
    padding-top: 16px;
  }
}
</style>
