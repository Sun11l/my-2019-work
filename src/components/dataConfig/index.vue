<template>
  <div>
    <!-- 添加数据映射 -->
    <el-dialog :visible.sync='addDataMapDialog'>
        <div slot="title" class="dialog-title">添加数据映射</div>
        <div class="dialog-data-map-form">
          <el-form :model='addDataMapForm' ref="addDataMapForm" label-width='120px' size='small'>
            <el-form-item
              label='数据名称'
              prop="name"
              :rules="[
                { required: true, message: '数据名称不能为空'},
              ]">
              <el-input v-model='addDataMapForm.name'></el-input>
            </el-form-item>
            <el-form-item
              label=''
              prop="status"
              :rules="[
                { required: true, message: '请选择状态值'},
              ]">
              <el-radio-group v-model='addDataMapForm.status'>
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="原始索引"
              prop="indexName"
              :rules="[
                { required: true, message: '原始索引不能为空'},
              ]">
              <el-select v-model="addDataMapForm.indexName" placeholder="请选择索引值" @change="selectOriginIndex(addDataMapForm.indexName, 'addDataMapForm')">
                <el-option v-for="(field, index) of originIndex" :key="index" :value="field">

                </el-option>
              </el-select>
            </el-form-item>
            <el-divider></el-divider>
          </el-form>
        </div>
        <div class="dialog-data-map-table">
            <el-table size="mini" :data="addDataMapForm.data" highlight-current-row>
              <el-table-column width="80" align="center" prop="checked" label="分组">
                  <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.checked" @change="changeCurrentRowAddFormGroup( $event, scope.$index, scope.row )" ></el-checkbox>
                  </template>
              </el-table-column>
              <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.field" :label="column.title">
                  <template slot-scope="scope">
                    <span v-if="column.title === '原始字段'">
                          <el-select filterable v-model="scope.row.field" @change='selectField(scope.row)' size="mini">
                            <el-option v-for="(item, index) of originField" :key="index" :value='item'>
                              <span>{{ item }}</span><span style="color: #8492a6; font-size: 13px">({{ item | cefDesc}})</span>
                            </el-option>
                          </el-select>
                      </span>

                      <span v-else-if="column.title === 'CEF字段'">
                          <el-select filterable allow-create v-model="scope.row.cef" size="mini" @visible-change='getCefFieldLists' @change="selectCef">
                            <el-option v-for="(cef, index) of cefFields" :key="index" :value='cef'>
                            </el-option>
                          </el-select>
                      </span>

                  </template>
              </el-table-column>

              <el-table-column width="100">
                  <template slot-scope="scope">
                      <span class="el-tag el-icon-close el-tag--danger el-tag--mini" @click="deleteRow('addDataMapForm', scope.row, scope.$index)" style="cursor: pointer;"></span>
                  </template>
              </el-table-column>
            </el-table>
            <div class="el-table-add-row" @click="addMappingData('addDataMapForm')"><span>+ 添加映射字段</span></div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size='small' @click="confirmSubmitForm('addDataMapForm', 'addDataMapDialog')">确定</el-button>
          <el-button size='small' @click="addDataMapDialog=false">取消</el-button>
        </div>
    </el-dialog>

    <!-- 复制数据映射 -->
    <el-dialog :visible.sync='copyDataMapDialog'>
        <div slot="title" class="dialog-title">编辑数据映射</div>
        <div class="dialog-data-map-form">
          <el-form :model='copyDataMapForm' ref="copyDataMapForm" label-width='120px' size='small'>
            <el-form-item
              label='数据名称'
              prop="name"
              :rules="[
                { required: true, message: '数据名称不能为空'},
              ]">
              <el-input v-model='copyDataMapForm.name'></el-input>
            </el-form-item>
            <el-form-item
              label=''
              prop="status"
              :rules="[
                { required: true, message: '请选择状态值'},
              ]">
              <el-radio-group v-model='copyDataMapForm.status'>
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="原始索引"
              prop="indexName"
              :rules="[
                { required: true, message: '原始索引不能为空'},
              ]">
              <el-select v-model="copyDataMapForm.indexName" placeholder="请选择索引值" @change="selectOriginIndex(copyDataMapForm.indexName, 'copyDataMapForm')">
                <el-option v-for="(field, index) of originIndex" :key="index" :value="field"></el-option>
              </el-select>
            </el-form-item>
            <el-divider></el-divider>
          </el-form>

        </div>
        <div class="dialog-data-map-table">
            <el-table size="mini" :data="copyDataMapForm.data" highlight-current-row>
              <el-table-column width="80" align="center" prop="checked" label="分组">
                  <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.checked" @change="changeCurrentRowCopyFormGroup( $event, scope.$index, scope.row )" ></el-checkbox>
                  </template>
              </el-table-column>
              <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.field" :label="column.title">
                  <template slot-scope="scope">
                    <span v-if="column.title === '原始字段'">
                          <el-select filterable v-model="scope.row.field" @change='selectField(scope.row)' size="mini">
                            <el-option v-for="(item, index) of originField" :key="index" :value='item'>
                              <span>{{ item }}</span><span style="color: #8492a6; font-size: 13px">({{ item | cefDesc}})</span>
                            </el-option>
                          </el-select>
                      </span>

                      <span v-else-if="column.title === 'CEF字段'">
                          <el-select filterable allow-create v-model="scope.row.cef" size="mini" @visible-change='getCefFieldLists' @change="selectCef">
                            <el-option v-for="(cef, index) of cefFields" :key="index" :value='cef'>
                            </el-option>
                          </el-select>
                      </span>

                  </template>
              </el-table-column>

               <el-table-column width="100">
                  <template slot-scope="scope">
                      <span class="el-tag el-icon-close el-tag--danger el-tag--mini" @click="deleteRow('copyDataMapForm', scope.row, scope.$index)" style="cursor: pointer;"></span>
                  </template>
              </el-table-column>

            </el-table>
            <div class="el-table-add-row" @click="addMappingData('copyDataMapForm')"><span>+ 添加映射字段</span></div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size='small' @click="confirmCopyForm('copyDataMapForm', 'copyDataMapDialog')">确定</el-button>
          <el-button size='small' @click="copyDataMapDialog=false">取消</el-button>
        </div>
    </el-dialog>

    <!-- 编辑数据映射 -->
    <el-dialog :visible.sync='editDataMapDialog'>
        <div slot="title" class="dialog-title">编辑数据映射</div>
        <div class="dialog-data-map-form">
          <el-form :model='editDataMapForm' ref="editDataMapForm" label-width='120px' size='small'>
            <el-form-item
              label='数据名称'
              prop="name"
              :rules="[
                { required: true, message: '数据名称不能为空'},
              ]">
              <el-input v-model='editDataMapForm.name'></el-input>
            </el-form-item>
            <el-form-item
              label=''
              prop="status"
              :rules="[
                { required: true, message: '请选择状态值'},
              ]">
              <el-radio-group v-model='editDataMapForm.status'>
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="原始索引"
              prop="indexName"
              :rules="[
                { required: true, message: '原始索引不能为空'},
              ]">
              <el-select v-model="editDataMapForm.indexName" placeholder="请选择索引值" @change="selectOriginIndex(editDataMapForm.indexName, 'editDataMapForm')">
                <el-option v-for="(field, index) of originIndex" :key="index" :value="field"></el-option>
              </el-select>
            </el-form-item>
            <el-divider></el-divider>
          </el-form>

        </div>
        <div class="dialog-data-map-table">
            <el-table size="mini" :data="editDataMapForm.data" highlight-current-row>
              <el-table-column width="80" align="center" prop="checked" label="分组">
                  <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.checked" @change="changeCurrentRowEditFormGroup( $event, scope.$index, scope.row )" ></el-checkbox>
                  </template>
              </el-table-column>
              <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.field" :label="column.title">
                  <template slot-scope="scope">
                    <span v-if="column.title === '原始字段'">
                          <el-select filterable v-model="scope.row.field" @change='selectField(scope.row)' size="mini">
                            <el-option v-for="(item, index) of originField" :key="index" :value='item'>
                              <span>{{ item }}</span><span style="color: #8492a6; font-size: 13px">({{ item | cefDesc}})</span>
                            </el-option>
                          </el-select>
                      </span>

                      <span v-else-if="column.title === 'CEF字段'">
                          <el-select filterable allow-create v-model="scope.row.cef" size="mini" @visible-change='getCefFieldLists' @change="selectCef">
                            <el-option v-for="(cef, index) of cefFields" :key="index" :value='cef'>
                            </el-option>
                          </el-select>
                      </span>

                  </template>
              </el-table-column>
              <el-table-column width="100">
                  <template slot-scope="scope">
                      <span class="el-tag el-icon-close el-tag--danger el-tag--mini" @click="deleteRow('editDataMapForm', scope.row, scope.$index)" style="cursor: pointer;"></span>
                  </template>
              </el-table-column>

            </el-table>
            <div class="el-table-add-row" @click="addMappingData('editDataMapForm')"><span>+ 添加映射字段</span></div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size='small' @click="confirmEditForm('editDataMapForm', 'editDataMapDialog')">确定</el-button>
          <el-button size='small' @click="editDataMapDialog=false">取消</el-button>
        </div>
    </el-dialog>

    <header>
      <el-button  v-if="checkPermission('dataconfig')" type="primary" size='small' @click="addDataMapDialog=true"><i class="el-icon-plus"></i> 添加数据映射</el-button>
    </header>
    <section>
      <el-table
        :data="dataConfigList['results']"
        :row-style='{cursor: "pointer"}'
        style="width: 100%">
        <el-table-column
          prop="name"
          label="数据名称"
          min-width="35%">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align='center'
          min-width="10%">
          <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.status === true ? 'yes': 'no'"  class-name='operator-svg'/>
              <span>{{scope.row.status === true ? '启用': '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mapping_count"
          label="映射字段数"
          align='center'
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="date_update"
          label="时间"
          align="center"
          min-width="15%">
          <template slot-scope="scope">
            <span>{{scope.row.date_update | formatTime('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建者"
          align="center"
          min-width="10%">
        </el-table-column>

        <el-table-column
          v-if="checkPermission('dataconfig')"
          label="操作"
          fixed="right"
          align="center"
          min-width="15%">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="copyIt(scope.row)">复制</el-button>
            <el-button type="text" size="small" @click="editIt(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteIt(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination
          background
          @current-change='handleChangeCurrentPage'
          @size-change='handleChangePageSize'
          layout="prev, pager, next, total, sizes"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync='offset'
          :total="dataConfigList['count']"
          style="text-align:center;padding-top:16px;">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    dataConfigList: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      addDataMapForm: {
        name: '',
        status: '',
        index: '',
        data: [],
      },
      addDataMapDialog: false,
      editDataMapDialog: false,
      copyDataMapDialog: false,
      columns: [
        { field: 'field', title: '原始字段' },
        { field: 'cef', title: 'CEF字段' },
      ],
      copyDataMapForm: {
        name: '',
        status: '',
        index: '',
        sel: null,
        columns: [
          { field: 'user', title: '原始字段' },
          { field: 'pwd', title: 'CEF字段' },
        ],
        data: [],
      },
      editDataMapForm: {
        name: '',
        status: '',
        index: '',
        sel: null,
        columns: [
          { field: 'user', title: '原始字段' },
          { field: 'pwd', title: 'CEF字段' },
        ],
        data: [],
      },
      originIndex: ['ips-syslog*', 'waf-syslog*', 'mcafee*'],
      originField: [],
      group: '',
      offset: 1,
      limit: 10,
      cefFields: []
    }
  },
  methods: {
    getCefFieldLists () {
      this.$store.dispatch('config/getCefFieldLists').then(res => {
        if (res.status === 200) {
          this.cefFields = res.data
        }
      })
    },
    addCefField (cef) {
      this.$store.dispatch('config/addCefField', cef)
    },
    selectCef (cef) {
      for (let item of this.cefFields) {
        if (item === cef) return
      }
      let newOption = {
        cef_name: cef
      }
      this.addCefField(newOption)
    },
    changeCurrentRowAddFormGroup (val, rowIndex, row) {
      this.group = val === false ? '' : row.field
      const data = this.addDataMapForm.data
      for (let index in data) {
        if (parseInt(index) === rowIndex) {
          data[index].checked = val
        } else {
          data[index].checked = false
        }
      }
    },
    changeCurrentRowCopyFormGroup (val, rowIndex, row) {
      this.group = val === false ? '' : row.field
      const data = this.copyDataMapForm.data
      for (let index in data) {
        if (parseInt(index) === rowIndex) {
          data[index].checked = val
        } else {
          data[index].checked = false
        }
      }
    },
    changeCurrentRowEditFormGroup (val, rowIndex, row) {
      this.group = val === false ? '' : row.field
      const data = this.editDataMapForm.data
      for (let index in data) {
        if (parseInt(index) === rowIndex) {
          data[index].checked = val
        } else {
          data[index].checked = false
        }
      }
    },
    getOriginField (index) {
      this.$store.dispatch('config/getDataConfigIndex', {index}).then(res => {
        if (res.status === 201) {
          this.originField = res.data
        }
      })
    },
    selectOriginIndex (index, formName) {
      if (this[formName]) {
        for (let item of this[formName].data) {
          item.field = ''
        }
      }
      this.getOriginField(index)
    },
    selectField (row) {
      if (row.checked) {
        this.group = row.field
      }
    },
    confirmSubmitForm (formName, dialog) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        const { name, status, indexName, data } = this[formName]
        let mappingJson = {}
        for (let item of data) {
          mappingJson[item.field] = item.cef
        }
        let query = { name, status, indexName, mappingJson, group: this.group }

        if (!Object.keys(mappingJson).length) {
          return this.$message.warning('请至少添加一组映射字段！')
        }

        for (let item of this[formName].data) {
          if (!item.cef || !item.field) {
            this.$message.warning('字段不能为空！')
            return false
          }
          if (!query.group) {
            this.$message.warning('分组不能为空！')
            return false
          }
        }
        this.$store.dispatch('config/addDataConfig', query).then(res => {
          if (res.status === 201) {
            this.$message.success('已成功添加！')
            this.getDataConfigList()
            this[dialog] = false
            formName === 'addDataMapForm' && this.clearAddForm()
          } else {
            this.$message.info(res.data)
          }
          this.$refs[formName].resetFields()
        })
      })
    },
    confirmCopyForm (formName, dialog) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        const { name, status, indexName, data } = this[formName]
        let mappingJson = {}
        for (let item of data) {
          mappingJson[item.field] = item.cef
        }
        let query = { name, status, indexName, mappingJson, group: this.group }
        if (!Object.keys(mappingJson).length) {
          return this.$message.warning('请至少添加一组映射字段！')
        }

        for (let item of this[formName].data) {
          if (!item.cef || !item.field) {
            this.$message.warning('字段不能为空！')
            return false
          }
          if (!query.group) {
            this.$message.warning('分组不能为空！')
            return false
          }
        }
        this.$store.dispatch('config/addDataConfig', query).then(res => {
          if (res.status === 201) {
            this.$message.success('已成功添加！')
            this.getDataConfigList()
            this[dialog] = false
            formName === 'addDataMapForm' && this.clearAddForm()
          } else {
            this.$message.info(res.data)
          }
        })
      })
    },
    confirmEditForm (formName, dialog) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        const { name, status, indexName, data, id } = this[formName]
        let mappingJson = {}
        for (let item of data) {
          mappingJson[item.field] = item.cef
        }
        let query = { name, status, indexName, mappingJson, group: this.group }
        if (!Object.keys(mappingJson).length) {
          return this.$message.warning('请至少添加一组映射字段！')
        }

        for (let item of this[formName].data) {
          if (!item.cef || !item.field) {
            this.$message.warning('字段不能为空！')
            return false
          }
          if (!query.group) {
            this.$message.warning('分组不能为空！')
            return false
          }
        }
        this.$store.dispatch('config/updateDataConfig', {id, data: query}).then(res => {
          if (res.status === 200) {
            this.$message.success('已成功修改！')
            this.getDataConfigList()
            this[dialog] = false
            formName === 'addDataMapForm' && this.clearAddForm()
          } else {
            this.$message.info(res.data)
          }
        })
      })
    },
    clearAddForm () {
      this.addDataMapForm = {
        name: '',
        status: '',
        index: '',
        sel: null,
        data: [],
      }
    },
    copyIt (row) {
      this.getOriginField(row.indexName)
      this.copyDataMapDialog = true
      let { mappingJson, group } = row
      this.group = group
      let keys = Object.keys(mappingJson)
      let newMapping = []
      for (let key of keys) {
        newMapping.push({field: key, cef: mappingJson[key], checked: group === key})
      }
      this.copyDataMapForm = Object.assign({}, row)
      this.copyDataMapForm.data = newMapping
    },
    editIt (row) {
      this.getOriginField(row.indexName)
      this.editDataMapDialog = true
      let { mappingJson, group } = row
      this.group = group
      let keys = Object.keys(mappingJson)
      let newMapping = []
      for (let key of keys) {
        newMapping.push({field: key, cef: mappingJson[key], checked: group === key})
      }
      this.editDataMapForm = Object.assign({}, row)
      this.editDataMapForm.data = newMapping
    },
    deleteIt (row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('config/deleteDataConfig', row.id)
        this.getDataConfigList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getDataConfigList () {
      let params = {
        offset: this.offset,
        limit: this.limit
      }
      this.$store.dispatch('config/getDataConfig', params).then(res => {
        this.$emit('updateDataConfig', res.data)
      })
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
      this.getDataConfigList()
    },
    handleChangePageSize (limit) {
      this.offset = 1
      this.limit = limit
      this.getDataConfigList()
    },
    addMappingData (form) {
      let j = { checked: false, field: '', cef: '' }
      this[form].data.push(j)
    },
    deleteRow (formName, row, index) {
      this[formName].data.splice(index, 1)
    },
  }
}
</script>

<style lang='scss' scoped>
.dialog-data-map-table{
  padding: 0 100px;
}

.el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
}
.cef-select{
  span{
    display: inline-block;
    width: 80%;
  }
}
section{
  padding: 8px 0;
  .operator-svg{
    // margin-right: 5px;
  }
  .el-pagination{
    text-align: center;
    padding-top: 16px;
  }
}
</style>
<style lang='scss'>
.data-container{
  .el-dialog{
    .el-table th{
      background: #fff;
      padding: 4px 0;
      color: #333;
      >.cell{
        font-weight: 900;
      }
    }
  }
}
</style>
