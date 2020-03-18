<template>
  <div class="config-app pagecontainer">
    <!-- 添加应用dialog -->
    <el-dialog :visible='addAppDialog' width='40%' top="20vh" @before-close='closeDialog' @close='closeDialog' @closed='closeDialog'>
      <div slot="title" class="dialog-title">添加应用</div>

      <div class="dialog-add-app-upload">
        <el-input size="small" type="primary" readonly v-model="fileName"></el-input>
        <span class="upload-error-tip" v-if="uploadErr">
          <svg-icon icon-class="warning"  class-name='question-svg'/>
          错误：文件名仅支持字母、数字、下划线，且不能以数字开头！
        </span>
        <el-upload
          ref="upload"
          class="upload-zip"
          action=""
          accept='application/x-zip-compressed'
          :auto-upload="false"
          :show-file-list='false'
          :on-change="addFile">
          <el-button class="scan-btn" size="small" type="primary" slot="trigger">浏览</el-button>
          <div class="upload-tip">
            <svg-icon icon-class="warning"  class-name='question-svg'/>
            提示：文件类型必须是以“.zip”为后缀的压缩文件, 且不超过200KB。
          </div>
          <div style="text-align:center;paddingTop:16px;">
            <el-button size="small" type="primary" @click="submitUpload">上传</el-button>
            <el-button size="small" plain @click="cancelUpload">取消</el-button>
          </div>
        </el-upload>
      </div>

    </el-dialog>

    <!-- 更新应用 -->
    <el-dialog :visible.sync='updateAppDialog'>
      <div slot="title" class="dialog-title">更新应用</div>
      <div class="dialog-update-app-upload">
        <el-input size="small" type="primary" readonly v-model="updateFileName"></el-input>
        <span class="upload-error-tip" v-if="updateErr">
          <svg-icon icon-class="warning"  class-name='question-svg'/>
          错误：文件名仅支持字母、数字、下划线，且不能以数字开头！
        </span>
        <el-upload
          class="update-upload"
          ref='updateUpload'
          action=''
          accept='application/x-zip-compressed'
          :auto-upload="false"
          :show-file-list='false'
          :on-change="addUpdateFile">
          <el-button class="scan-btn" size="small" type="primary" slot="trigger">浏览</el-button>
           <div class="upload-tip">
            <svg-icon icon-class="warning"  class-name='question-svg'/>
            提示：文件类型必须是以“.zip”为后缀的压缩文件, 且不超过200KB。
          </div>
          <div style="text-align:center;paddingTop:16px;">
            <el-button size="small" type="primary" @click="submitUpdateUpload">上传</el-button>
            <el-button size="small" plain @click="cancelUpdateUpload">取消</el-button>
          </div>
        </el-upload>
      </div>
    </el-dialog>

    <section class="app-content">
      <el-row :gutter="10">

        <el-col :span="12">
          <div class="left-pane" style="background: #fff">
            <el-table
              :data='pluginList'
              @row-click='showAppDetail'
              :row-style='{cursor: "pointer"}'
              @sort-change='sortStatus'
              highlight-current-row>
              <el-table-column
                prop="name"
                min-width="60%">
                <template slot="header" slot-scope="scope">
                   <span style="vertical-align: middle;font-weight: 700;">名称</span>
                   <el-input
                      style="width:calc(100% - 50px);vertical-align: middle;"
                      v-model="search"
                      size="mini"
                      @keyup.13.native='getDefaultPlugins'
                      placeholder="请输入名称搜索 "/>
                </template>
                <template slot-scope="scope">
                    <wf-avatar :width='50' :height='50' :src="scope.row.littleLogoURL" style="width: 50px;height:50px;"></wf-avatar>
                    <span style="vertical-align:middle;marginLeft: 16px;">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="version"
                label="版本"
                align="center"
                min-width="20%">
              </el-table-column>
              <el-table-column
                prop="status"
                sortable='custom'
                label="状态"
                align="center"
                min-width="20%">
                <template slot-scope="scope">
                  {{scope.row.status ? '已激活' : '未激活'}}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="handleCurrentChange"
                @size-change='handleSizeChange'
                :page-sizes="[10, 20, 50, 100]"
                layout="prev, pager, next, sizes, total"
                :total='totalCount'>
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right-pane" style="background: #fff">
            <div class="right-pane-top">
              <wf-avatar class="plugin-img" :width='80' :height="80" fit='fill' :src="pluginDetail.logoURL"></wf-avatar>
              <div class="plugin-detail">
                <p class="plugin-name">{{ pluginDetail.name }}</p>
                <div class="plugin-info">
                  <span>开发者：{{ pluginDetail.author }}</span>
                  <span style="color: #666">&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                  <span>版本：{{ pluginDetail.version }}</span>
                  <p class="plugin-update">更新时间：{{ pluginDetail.updateTime | formatTime }}</p>
                </div>
              </div>
            </div>
            <div class="right-pane-desc">{{ pluginDetail.description}}</div>
            <div class="right-pane-tab">
              <el-tabs v-model="tabActive" type="card">
                  <el-tab-pane label="配置" name="first">
                    <div class="tab-content">
                      <div class="config-form">
                        <el-form :model='configForm' :rules='configFormRules' ref='configForm'>
                          <el-form-item
                            prop="name"
                            label="应用名称"
                            >
                            <el-input v-model="configForm.name" size="small"></el-input>
                          </el-form-item>
                          <el-form-item prop="desc" label="应用描述">
                            <el-input
                              type="textarea"
                              :rows="4"
                              v-model="configForm.description"
                              size="small">
                            </el-input>
                          </el-form-item>
                            <el-form-item
                              v-for="(item, index) of configuration"
                              :key="index"
                              :prop="item.name"
                              :label="item.name">
                              <el-input v-model="configuration[index].default_value" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="'Actions（' + actionCounts + '）'" name="second">
                    <div class="tab-content">
                      <el-table
                        :data="actions"
                        style="width: 100%">
                        <el-table-column
                          prop="name"
                          label="名称">
                        </el-table-column>
                        <el-table-column
                          prop="description"
                          label="描述">
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="'Playbooks（' + playbookCounts + '）'" name="third">
                    <div class="tab-content">
                      等待后续版本增加
                    </div>
                  </el-tab-pane>
              </el-tabs>
            </div>
            <div class="right-pane-button clearfix">
              <template v-if="checkPermission('appconfig')">
                <el-button :disabled="selfsign" type="danger" size="small" class="fl" @click="deleteApp">删除应用</el-button>
                <el-button :disabled="selfsign" type="primary" size="small" class="fl" @click="updateAppDialog=true">更新应用</el-button>
                <el-button :disabled="selfsign" type="primary" size="small" class="fl" @click="downloadZip">下载应用</el-button>
                <el-button type="primary" size="small" class="fr" @click="saveApp">保存</el-button>
                <el-button plain size="small" class="fr" @click="getDefaultPlugins">取消</el-button>
                <el-button plain size="small" class="fr" @click="testAppPlugin">测试</el-button>
              </template>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>

  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import wfAvatar from '@/components/avatar'
import { mapGetters } from 'vuex'
export default {
  data () {
    const reg = /^[A-Za-z_][A-Za-z0-9_]{0,127}$/
    var validateAppName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('应用名称不能为空'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('名称只能包含字母、数字、下划线，不能以数字开头，且长度不能超过128个字符'))
        }
      }
      callback()
    }
    return {
      configForm: {
        name: '',
        description: '',
      },
      id: null,
      configuration: [],
      pluginDetail: {},
      actions: [],
      pluginList: [],
      offset: 1,
      default_value: '',
      limit: 10,
      totalCount: 0,
      fileName: '',
      file: null,
      uploadZip: {},
      tabActive: 'first',
      actionCounts: 0,
      playbookCounts: 0,
      uploadErr: false,
      placeholder: '请输入应用插件名称',
      search: '',
      selfsign: '',
      downloadFileName: '',
      updateAppDialog: false,
      updateFileName: '',
      updateErr: false,
      configFormRules: {
        name: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' },
          { validator: validateAppName, max: 128, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'addAppDialog',
    ]),
  },
  activated () {
    this.getDefaultPlugins()
  },
  methods: {
    searchApp () {
      this.getDefaultPlugins()
    },
    showAppDetail (row) {
      this.id = row.id
      this.selfsign = row.selfsign
      this.tabActive = 'first'
      this.$store.dispatch('config/getAppPluginsInfo', this.id).then(res => {
        this.pluginDetail = Object.assign({}, res)
        this.actionCounts = this.pluginDetail.actions ? this.pluginDetail.actions.length : 0
        this.playbookCounts = this.pluginDetail.playbooks ? this.pluginDetail.playbooks.length : 0
        this.actions = this.pluginDetail.actions
        this.configForm.name = this.pluginDetail.name
        this.configForm.description = this.pluginDetail.description
        this.configuration = this.pluginDetail.configuration
        this.downloadName = this.pluginDetail.downloadfile
      })
    },
    getDefaultPlugins (ordering) {
      ordering = ordering || '-updateTime,-createTime'
      let search = this.search || ''
      this.$store.dispatch('config/getAppPlugins', {offset: this.offset, limit: this.limit, ordering, search}).then(res => {
        this.pluginList = res.results
        this.totalCount = res.count
        if (res.results[0]) {
          this.id = res.results[0].id
          this.selfsign = res.results[0].selfsign
          this.showAppDetail({id: this.id, selfsign: this.selfsign})
        }
      })
    },
    handleCurrentChange (current) {
      this.offset = current
      this.getDefaultPlugins()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.getDefaultPlugins()
    },
    sortStatus ({prop, order}) {
      if (order === 'descending') {
        this.getDefaultPlugins('-' + prop + ',-updateTime,-createTime')
      } else {
        this.getDefaultPlugins(prop + ',-updateTime,-createTime')
      }
    },
    addFile (file) {
      const reg = /^.*\.zip$/
      this.file = file.raw
      this.fileName = file.name
      if (reg.test(file.name)) {
        this.uploadErr = false
      } else {
        this.uploadErr = true
      }
    },
    downloadZip () {
      const id = this.id
      const name = this.downloadName
      this.$store.dispatch('config/downloadZip', id).then(res => {
        const blobUrl = window.URL.createObjectURL(res)
        this.download(blobUrl, name)
      })
    },
    download (blobUrl, fileName) {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style.display = 'none'
      a.download = fileName + '.zip'
      a.href = blobUrl
      a.click()
      document.body.removeChild(a)
    },
    addUpdateFile (file) {
      const reg = /^.*\.zip$/
      this.file = file.raw
      this.updateFileName = file.name
      if (reg.test(file.name)) {
        this.updateErr = false
      } else {
        this.updateErr = true
      }
    },
    submitUpload (params) {
      if (this.uploadErr || !this.fileName.length) {
        return false
      }
      const formData = new FormData()
      formData.append('upload', this.file)
      this.$store.dispatch('config/appUploadZip', formData).then(res => {
        if (res.status === 201) {
          this.$message.success('已成功上传应用！')
          this.getDefaultPlugins()
          this.cancelUpload()
        }
      }).catch(err => console.log(err))
    },
    submitUpdateUpload () {
      if (this.updateErr || !this.updateFileName.length) {
        return false
      }
      const formData = new FormData()
      formData.append('update', this.file)
      this.$store.dispatch('config/updateAppFiles', {id: this.id, data: formData}).then(res => {
        if (res.status === 201) {
          this.$message.success('已成功更新应用！')
          this.getDefaultPlugins()
          this.cancelUpdateUpload()
        }
      }).catch(err => console.log(err))
    },
    cancelUpload () {
      this.$refs.upload.abort()
      this.$refs.upload.clearFiles()
      this.fileName = ''
      this.closeDialog()
      this.uploadErr = false
    },
    cancelUpdateUpload () {
      this.$refs.updateUpload.abort()
      this.$refs.updateUpload.clearFiles()
      this.updateFileName = ''
      this.updateErr = false
      this.updateAppDialog = false
    },
    closeDialog () {
      this.$store.dispatch('bus/closeAddAppDialog')
    },
    saveApp () {
      const id = this.id
      let configuration = {}
      for (let item of this.configuration) {
        configuration[item.name] = item.default_value
      }
      let {version} = this.pluginDetail
      let {name, description} = this.configForm
      let data = {
        name,
        version,
        description,
        configuration
      }
      this.$store.dispatch('config/saveAppPlugins', {id, data}).then(res => {
        if (res.status === 200) {
          this.$message.success('操作已成功保存！')
          this.getDefaultPlugins()
        }
      })
    },
    testAppPlugin () {
      let id = this.id
      this.$store.dispatch('config/testAppPlugin', id).then(res => {
        if (res.status === 200) {
          if (res.data) {
            this.$message.success('测试通过，应用插件有效！')
            this.getDefaultPlugins()
          } else {
            this.$message.error('测试未通过！')
          }
        }
      })
    },
    deleteApp () {
      let id = this.id
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('config/deleteAppPlugins', id)
        this.getDefaultPlugins()
      })
    },
  },
  components: {
    splitPane,
    wfAvatar
  },
}
</script>

<style lang='scss' scoped>
.config-app{
  .dialog-add-app-upload,.dialog-update-app-upload{
    position: relative;
    .upload-error-tip{
      color: red;
      display: inline-block;
      line-height: 24px;
    }
    .upload-tip{
      line-height: 24px;
    }
    .scan-btn{
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .app-content{
    .left-pane {
      background: #fff;
      padding-bottom: 16px;
      .el-pagination{
        text-align: center;
        padding-top: 16px;
      }
    }

    .right-pane {
      background-color: #fff;
      padding: 16px;
      color: #666;
      &-top{
        .plugin-img{
          vertical-align: middle;
        }
        .plugin-detail{
          display: inline-block;
          vertical-align: middle;
          color: #666;
          padding-left: 16px;
          .plugin-name{
            font-weight: 700;
          }
          .plugin-info{
            font-size: 14px;
            padding: 5px 0;
            p.plugin-update{
              padding-top: 5px;;
            }
          }
        }
      }
      &-desc{
        padding:  20px 0 20px 20px;
        font-size: 14px;
        line-height: 22px;
      }
      &-tab{
        .el-tabs{
          /deep/ .el-tabs__header{
            margin: 0;
            .el-tabs__nav .is-top{
              height: 32px;
              line-height: 32px;
            }
          }
          /deep/ .el-tabs__nav.is-top{
            background: #f2f2f2;
            border-radius: 0;
            .el-tabs__item.is-top.is-active{
              color: #007fff;
            }
          }
          /deep/.el-tabs--card>.el-tabs__header .el-tabs__item{
            color:#333;
            font-size: 12px;
          }
          /deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
            background: #fff;
            color: #333;
          }
          .tab-content{
            background: #fff;
            color: #666666;
            padding: 24px;
          }
        }
        .tab-content{
          border: 1px solid #e5e5e5;
          border-top: 0;
          padding-top: 10px;
        }
      }
      &-button{
        padding-top: 16px;
        .download-btn{
        }
      }

    }
  }
}
</style>

<style lang='scss'>
.config-app{
  .el-dialog{
    /deep/ .el-dialog__body{
      padding-bottom: 16px;
      padding-top: 16px;;
    }
  }
}

</style>
