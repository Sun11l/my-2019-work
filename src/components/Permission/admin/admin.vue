<template>
    <table  class="table">
      <thead>
        <tr>
          <th></th>
          <th>只读</th>
          <th>读&写</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for='(item, index) of list' :key='index'>
          <td>{{ item.alias }}</td>
          <td>
            <input type="radio" :name="item.module + '-' + roleId" :checked='item.read_only'>
          </td>
          <td>
            <input type="radio" :name="item.module + '-' + roleId" :checked='item.read_write'>
          </td>
        </tr>

      </tbody>
      <tfoot>
        <td>
          <el-button size='small' type='primary' disabled>更新</el-button>
        </td>
        <td>
          <el-button size='small' type='primary' @click="resetPermisson">重置</el-button>
        </td>
      </tfoot>
    </table>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  props: {
    permissionlist: {
      type: Array,
      default: () => []
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  watch: {
    permissionlist (list) {
      let arr = []
      list.map(item => {
        if (item.role === this.roleId) {
          arr.push(item)
        }
      })
      this.list = arr
    }
  },
  methods: {
    resetPermisson () {
      this.$store.dispatch('config/getPermisson')
    },
  }
}
</script>

<style scoped lang='scss'>
table{
  width:50%;
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
  text-align:left
}
.table tr{
  th:nth-child(1),td:nth-child(1){
    width: 20%;
    min-width: 100px;
  }
}
</style>
