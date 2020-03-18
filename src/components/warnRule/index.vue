<template>
  <div>
    <!-- 添加规则 -->
    <el-dialog :visible.sync='addRulesDialog'>
      <div slot="title" class="dialog-title">添加规则</div>
      <div class="dialog-add-warn-rules-form">
         <el-form :model="addWarnRulesForm" size="small" label-width='80px'>
           <el-row>
             <el-col :lg="16" :md='24'>
               <el-form-item label="规则名称">
                <el-input v-model="addWarnRulesForm.name" placeholder="规则名称"></el-input>
              </el-form-item>
             </el-col>
             <el-col :lg="8" :md='24'>
               <el-form-item label=" " label-width='80px'>
                <el-radio-group v-model="addWarnRulesForm.status">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
             </el-col>
           </el-row>
         </el-form>
      </div>
      <div class="dialog-warn-rules-ace-editor">
        <editor v-model="addWarnRulesForm.content" @init="editorInit" :options="{enableLiveAutocompletion: true, showPrintMargin: false, enableSnippets: true,enableLiveAutocompletion: true}" lang="yaml" theme="monokai" width="100%" height="100%"></editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="ConfirmAddRules">确定</el-button>
        <el-button size="small" @click="addRulesDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 复制规则 -->
    <el-dialog :visible.sync='copyRulesDialog'>
      <div slot="title" class="dialog-title">编辑规则</div>
      <div class="dialog-copy-warn-rules-form">
         <el-form :model="copyWarnRulesForm" size="small" label-width='80px'>
           <el-row>
             <el-col :lg="16" :md='24'>
               <el-form-item label="规则名称">
                <el-input v-model="copyWarnRulesForm.name" placeholder="规则名称"></el-input>
              </el-form-item>
             </el-col>
             <el-col :lg="8" :md='24'>
               <el-form-item label=" " label-width='80px'>
                <el-radio-group v-model="copyWarnRulesForm.status">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
             </el-col>
           </el-row>
         </el-form>
      </div>
      <div class="dialog-warn-rules-ace-editor">
        <editor v-model="copyWarnRulesForm.content"  @init="editorInit" :options="{enableLiveAutocompletion: true, showPrintMargin: false, enableSnippets: true,enableLiveAutocompletion: true}" lang="yaml" theme="monokai" width="100%" height="100%"></editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="ConfirmCopyRules">确定</el-button>
        <el-button size="small" @click="copyRulesDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑规则 -->
    <el-dialog :visible.sync='editRulesDialog'>
      <div slot="title" class="dialog-title">编辑规则</div>
      <div class="dialog-edit-warn-rules-form">
         <el-form :model="editWarnRulesForm" size="small" label-width='80px'>
           <el-row>
             <el-col :lg="16" :md='24'>
               <el-form-item label="规则名称">
                <el-input v-model="editWarnRulesForm.name" placeholder="规则名称"></el-input>
              </el-form-item>
             </el-col>
             <el-col :lg="8" :md='24'>
               <el-form-item label=" " label-width='80px'>
                <el-radio-group v-model="editWarnRulesForm.status">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
             </el-col>
           </el-row>
         </el-form>
      </div>
      <div class="dialog-warn-rules-ace-editor">
        <editor v-model="editWarnRulesForm.content"  @init="editorInit" :options="{enableLiveAutocompletion: true, showPrintMargin: false, enableSnippets: true,enableLiveAutocompletion: true}" lang="yaml" theme="monokai" width="100%" height="100%"></editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="ConfirmEditRules">确定</el-button>
        <el-button size="small" @click="editRulesDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- DIALOG END -->
    <header>
      <el-button v-if="checkPermission('dataconfig')" type="primary" size='small' @click="addRulesDialog=true"><i class="el-icon-plus"></i> 添加规则</el-button>
    </header>
    <section>
      <el-table
        :data="warnRulesList['results']"
        :row-style='{cursor: "pointer"}'
        style="width: 100%">
        <el-table-column
          prop="name"
          label="规则名称"
          min-width="35%">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          min-width="10%">
          <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.status === true ? 'yes': 'no'"  class-name='operator-svg'/>
              <span>{{scope.row.status === true ? '启用': '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date_created"
          label="创建时间"
          align="center"
          min-width="15%">
          <template slot-scope="scope">
            <span>{{scope.row.date_created | formatTime('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date_update"
          label="更新时间"
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
          @size-change='handleSizeChange'
          :page-size="10"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev, pager, next, sizes, total"
          :total="warnRulesList['count']">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import editor from 'vue2-ace-editor'
export default {
  props: {
    warnRulesList: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      addRulesDialog: false,
      copyRulesDialog: false,
      editRulesDialog: false,
      addWarnRulesForm: {
        name: '',
        status: '',
        content: ''
      },
      copyWarnRulesForm: {
        name: '',
        status: '',
        content: ''
      },
      editWarnRulesForm: {
        name: '',
        status: '',
        content: ''
      },
      limit: 10,
      offset: 1
    }
  },
  methods: {
    ConfirmAddRules () {
      let data = {
        name: this.addWarnRulesForm.name,
        status: this.addWarnRulesForm.status,
        content: this.addWarnRulesForm.content,
      }
      this.$store.dispatch('config/addWarnRulesList', data).then(res => {
        if (res.status === 201) {
          this.$message.success('已成功添加！')
          this.getWarnRulesList()
          this.addRulesDialog = false
          this.clearAddForm()
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error || 'error'
        })
      })
    },
    copyIt (row) {
      this.copyRulesDialog = true
      this.copyWarnRulesForm = Object.assign({}, row)
    },
    ConfirmCopyRules () {
      let { name, status, content, creator } = this.copyWarnRulesForm
      let data = {name, status, content, creator}
      this.$store.dispatch('config/addWarnRulesList', data).then(res => {
        if (res.status === 201) {
          this.$message.success('已成功复制新的规则!')
          this.getWarnRulesList()
        }
        this.copyRulesDialog = false
      })
    },
    editIt (row) {
      this.editRulesDialog = true
      this.editWarnRulesForm = Object.assign({}, row)
    },
    ConfirmEditRules () {
      let { id, name, status, content, creator } = this.editWarnRulesForm
      let data = {name, status, content, creator}
      this.$store.dispatch('config/updateWarnRulesList', {id, data}).then(res => {
        if (res.status === 200) {
          this.$message.success('已成功修改规则!')
          this.getWarnRulesList()
        }
        this.editRulesDialog = false
      })
    },
    deleteIt (row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('config/deleteWarnRulesList', row.id)
        this.getWarnRulesList()
      })
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
      this.getWarnRulesList()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.getWarnRulesList()
    },
    getWarnRulesList () {
      let params = {
        offset: this.offset,
        limit: this.limit
      }
      this.$store.dispatch('config/getWarnRulesList', params).then(res => {
        this.$emit('updateWarnRulesList', res.data)
      })
    },
    editorInit: function () {
      // options中可以设置setShowPrintMargin（右侧竖线）; showGutter（行数）。。
      require('brace/ext/language_tools')
      require('brace/mode/yaml')
      require('brace/mode/less')
      require('brace/theme/monokai')
      require('brace/snippets/yaml')
      require('brace/snippets/less')
    },
    clearAddForm () {
      // 确认提交后清除表单内容
      this.addWarnRulesForm = {
        name: '',
        status: '',
        content: ''
      }
    }
  },
  components: {
    editor
  }
}
</script>

<style lang='scss' scoped>
.el-dialog{
  .dialog-warn-rules-ace-editor {
    margin: 0 10px;
    height: 300px;
    width: 100%;
    .ace_editor.ace-monokai.ace_dark{
      font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      >>> .ace_scroller .ace_content{
        width: 0 !important;
      }
      >>> .ace_scrollbar-v{
        bottom: 0 !important;
      }
      >>> .ace_scrollbar-h{
        right: 7px !important;
      }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar{
      width: 7px;
      height: 7px;
      background-color: #F5F5F5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb{
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
      background-color: #c8c8c8;
    }
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
