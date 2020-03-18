// 剧本的数据结构
import VERSION from '../version'
export default Backbone.Model.extend({
  url: function () {
    return this.get('ispreview') ? (`/api/${VERSION}/playbook/playbooks/preview/` + this.id + '/') : (`/api/${VERSION}/playbook/playbooks/` + this.id + '/')
  },
  defaults: {
    id: '',
    name: '',
    description: '', // playbook描述
    info: '', // 代码块
    json: {}, // 流程图节点
    tags: [], // 标签
    clean: true,
  },
  errors: {},
  initialize: function () {
    this.loaded = false

    this.on('sync', this.onSync, this)
    // this.on('change:name', this.markModified, this)
  },
  // 关联数据源的更改到Model
  onSync: function () {
    this.loaded = true
  },

  validate: function () {
    const errors = {}
    if (_.trim(this.get('name')) === '') {
      errors.name = 'Playbook name required'
    }
    if (_.trim(this.get('tags')) === '') {
      errors.tags = 'Playbook tags required'
    }
    this.errors = errors

    return Object.keys(this.errors).length === 0
      ? ''
      : 'error'
  },
  save: function (data, config = {}) {
    const reqConfig = {
      ...config,
      method: 'POST',
      contentType: 'application/json',
    }
    const pid = this.get('id')

    const reqData = _.clone(this.attributes)
    if (_.trim(reqData.tags) !== '') {
      reqData.tags = reqData.tags instanceof Array ? reqData.tags : reqData.tags.split(',')
    } else {
      reqData.tags = []
    }
    delete reqData.all_categories
    delete reqData.all_labels
    delete reqData.actions
    delete reqData.filters
    delete reqData.transforms
    delete reqData.all_tenants
    delete reqData.available_scm

    reqData.json = { joint: data }

    reqConfig.data = JSON.stringify(reqData)
    if (pid === '') {
      // 新增逻辑
    } else {
      // 更新逻辑
      reqConfig.url = `/api/${VERSION}/playbook/playbooks/${pid}/`
      reqConfig.method = 'PUT'
    }

    return Backbone.Model.prototype.save.call(this, reqData, reqConfig)
  },
  getnodeName: function (t) {
    var name = this.get('selectednodeName')
    name = `${t.model.get('name')}_${t.model.get('number')}`
    if (this.get('vueObj')) {
      var vue = this.get('vueObj')
      vue.nodename = name
      vue.isDisplay = true
    }
  },
})
