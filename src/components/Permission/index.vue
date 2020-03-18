<template>
  <div class="permission-manage">
    <el-dialog :visible.sync="dialogPermission" width="50%" @closed='resetChangePermission'>
      <div slot="title" class="dialog-title">授权管理</div>
      <div class="dialog-edit-perimission">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>只读</th>
              <th>读&写</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permission of permissionlist" :key="permission.id">
              <td>{{ permission.alias }}</td>
              <td>
                <input
                  type="radio"
                  v-model="permission.read_only"
                  @change="changeReadOnlyRadio(permission.id, true)"
                  :value="true"
                  :name="permission.id"/>
              </td>
              <td>
                <input
                  type="radio"
                  v-model="permission.read_only"
                  @change="changeReadOnlyRadio(permission.id, false)"
                  :value="false"
                  :name="permission.id"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            size='small'
            @click="confirmChangePermission()"
            :disabled="arr.length ? false : true">保存</el-button>
          <el-button size='small' @click="resetChangePermission()">取消</el-button>
        </div>
    </el-dialog>

    <div class="permission-role">
      <el-table
        border
        :data='rolelist'
        highlight-current-row
        class="permission">
        <!-- <el-table-column
          prop="id"
          label="ID">
        </el-table-column> -->
        <el-table-column
          label="角色名"
          prop="role_name">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope='scope'>
            {{ scope.row.date_created | formatTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="comment"
          label="备注">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editPermission(scope)">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能待后续加入 -->
      <!-- <el-pagination
        background
        @current-change='handleChangeCurrentPage'
        @size-change='handleSizeChange'
        :page-size="10"
        layout="prev, pager, next, total, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="0"
        style="text-align:center;padding-top:16px;">
      </el-pagination> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogPermission: false,
      permissionlist: [],
      arr: []
    }
  },
  props: {
    rolelist: {
      type: Array,
      default: () => []
    },
  },
  computed: {},
  watch: {},
  methods: {
    editPermission ({row}) {
      let params = {
        role: row.id
      }
      this.permissionlist = []
      this.$store.dispatch('config/getRolePermission', params).then(res => {
        if (res.status === 200) {
          if (res.data.length) {
            this.permissionlist = res.data
            this.dialogPermission = true
          } else {
            this.$message({
              type: 'warning',
              message: '当前选中的角色无法授权'
            })
          }
        }
      })
    },
    handleChangeCurrentPage (offset) {},
    handleSizeChange (limit) {},
    confirmChangePermission (value) {
      let resultArray = this.arr.map(item => {
        let data = {
          id: item.id,
          data: item.data
        }
        return this.$store.dispatch('config/changeRolePermission', data)
      })
      Promise.all(resultArray).then(res => {
        res.map(itm => {
          if (itm.status === 200) {
            this.arr = []
          }
        })
        this.dialogPermission = false
        this.$message.success('权限修改成功！')
      })
    },
    resetChangePermission () {
      this.dialogPermission = false
      this.arr = []
    },
    changeReadOnlyRadio (id, value) {
      /**
       * 去重：
       *      每点击一次radio选项就会触发一次，生成一个query(通过id辨识)
       *      如果点击到重复的就保留最新触发的query 并删除之前的query
       *      arr中保存最终结果
       */
      let data = {
        'read_only': value,
        'read_write': !value
      }
      let query = {id, data}
      this.arr.map((item, index) => {
        if (item.id === query.id) {
          this.arr.splice(index, 1)
        }
      })
      this.arr.push(query)
    }
  },
}
</script>

<style lang="scss" scoped>
.permission-manage{
  .el-pagination{
    text-align: center;
    padding-top: 16px;
  }
  .permission-tree-header{
    padding-left: 8px;
    padding-bottom: 5px;
    text-align: left;
    font-size: 16px;
    color: rgb(20, 89, 121);
  }
  .dialog-edit-perimission{
    table{
      width:60%;
      empty-cells:show;
      background-color:transparent;
      border-collapse:collapse;
      border-spacing:0;
      font-size: 14px;
    }
    table th{
      text-align:left;
    }
    .table th,.table td{
      padding:8px;
      line-height:20px;
      width:30%;
      min-width: 100px;
    }
    .table td{
      text-align:center;
    }
    .table tr{
      th{
        text-align: center;
        &:nth-child(1),td:nth-child(1){
          width: 20%;
          min-width: 100px;
        }
      }
    }
  }
  .dialog-footer{
    width: 60%;
    text-align: center;
    text-indent: 2em;
  }
}
</style>
