import Container from '../../../widgets/Dropdown/container' // i
import DualDisplay from '../../../widgets/Dropdown/dual_display' // n
import InputPlain from '../../../widgets/InputPlain' // s

const template = `
<div class='row'>
<% if (index > 0) { %>
<div class='logic'></div>
<% } %>
<div class='param<% if (index > 0) { %> small<% } %><% if (type == 'else') { %> empty<% } %>'></div>
<% if (can_delete) { %>
<i class='fa fa-minus'></i>
<% } %>
</div>
<% if (type != 'else') { %>
<div class='row'>
<div class='comparison'></div>
<div class='value'></div>
<% if (can_add) { %>
<i class='fa fa-plus'></i>
<% } %>
</div>
<% } %>
` // o

export default Backbone.View.extend({
  className: 'condition',
  events: {
    'click .fa-minus': 'deleteCondition',
  },
  initialize: function (t) {
    this.template = _.template(template)
    this.can_delete = t.can_delete
    this.can_add = t.can_add
    this.type = t.type
    this.index = t.index
    this.logic = t.logic
    this.output = t.output
    this.param_placeholder = t.param_placeholder
    this.value_placeholder = t.value_placeholder

    this.listenTo(this.model, 'change', this.updateCode)
    this.listenTo(this.output, 'change:logic', this.updateLogic)
    this.listenTo(this.dispatcher, 'select:toggle', this.toggleSelect)
    this.listenTo(this.dispatcher, 'condition:logic', this.setLogicValue)
  },
  remove: function () {
    this.paramMenu && this.paramMenu.remove()
    this.compMenu && this.compMenu.remove()
    this.valueMenu && this.valueMenu.remove()
    this.logicMenu && this.logicMenu.remove()
    this.model = null
    this.output = null

    Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    if (this.$el.html(this.template(_.extend(this.model.toJSON(), {
      can_delete: this.can_delete,
      can_add: this.can_add,
      type: this.type,
      logic: this.logic,
      index: this.index,
    }))), this.type === 'else') return this

    const t = this.blocks.getActive()
    const parameters = t.get('parameters')
    const data = []
    // todo list列表数据
    const fields = this.artifacts.get('list')
    // fields.set('data',['month','time'])
    data.push({
      name: 'artifacts',
      fields,
    })
    _.each(parameters, function (pa) {
      pa.fields.size > 0 && data.push({
        name: pa.name,
        fields: pa.fields,
        group: pa.group,
      })
    })
    const a = this.model.get('comparison')
    const connectionArr = [{
      display: '等于',
      value: '==',
    }, {
      display: '不等于',
      value: '!=',
    }, {
      display: '被包含',
      value: 'in',
    }, {
      display: '不被包含',
      value: 'not in',
    }, {
      display: '小于',
      value: '<',
    }, {
      display: '小于等于',
      value: '<=',
    }, {
      display: '大于',
      value: '>',
    }, {
      display: '大于等于',
      value: '>=',
    }, {
      display: '被包含所有',
      value: 'in all',
    }, {
      display: '存在',
      value: 'exists',
    }, {
      display: '不存在',
      value: 'dose not exists',
    }, {
      display: '空值',
      value: 'is null',
    }, {
      display: '不为空',
      value: 'is not null ',
    }, {
      display: '包含',
      value: 'include',
    }, {
      display: '包含所有',
      value: 'include all',
    }, {
      display: '不包含',
      value: 'not include',
    }, {
      display: '被包含元素',
      value: 'in element',
    }, {
      display: '被包含所有元素',
      value: 'in element all',
    }, {
      display: '不被包含元素',
      value: 'not in element',
    }, {
      display: '包含元素',
      value: 'include element',
    }, {
      display: '包含所有元素',
      value: 'include element all',
    }, {
      display: '不包含元素',
      value: 'not include element',
    }, {
      display: '正则匹配',
      value: 're',
    }, {
      display: '正则不匹配',
      value: 'nre',
    }]
    const logic_condition = this.index > 1 ? [] : ['and', 'or']
    // var logic_condition = ['and', 'or'];

    this.paramMenu = new InputPlain({
      model: this.model,
      name: 'param',
      placeholder: this.param_placeholder || '字段名',
      value: this.model.get('param'),
      tooltip: true,
      data: data,
      action: 'condition:update',
    })
    this.valueMenu = new InputPlain({
      model: this.model,
      name: 'value',
      placeholder: this.value_placeholder || '值',
      value: this.model.get('value'),
      tooltip: true,
      data: data,
      action: 'condition:update',
    })
    this.compMenu = new DualDisplay({
      model: this.model,
      label: '',
      name: 'comparison',
      placeholder: '',
      data: connectionArr,
      value: a,
      freeform: false,
      tooltip: true,
    })

    this.$el.find('.param').append(this.paramMenu.render().el)
    this.$el.find('.comparison').append(this.compMenu.render().el)
    this.$el.find('.value').append(this.valueMenu.render().el)

    _.indexOf(t.field_warnings, this.model.get('param')) !== -1 && this.paramMenu.$el.addClass('warn')
    _.indexOf(t.field_warnings, this.model.get('value')) !== -1 && this.valueMenu.$el.addClass('warn')

    if (this.index > 0) {
      this.logicMenu = new Container({
        model: this.output,
        label: 'Logic',
        name: 'logic',
        placeholder: '',
        data: logic_condition,
        value: this.logic,
        freeform: false,
      })
      this.$el.find('.logic').append(this.logicMenu.render().el)
      this.index > 1 && this.logicMenu.disable()
    }
    return this
  },
  deleteCondition: function () {
    var block = this.blocks.getActive()
    if (block) {
      block.set('warn', '')
      this.dispatcher.trigger('logic:delete', this.model)
      this.dispatcher.trigger('block:change')
    }
  },
  updateValue: function () {
    var t = this.blocks.getActive()
    if (t) {
      t.set('warn', '')
      this.model.set('value', this.$el.find('.value input').val())
      this.updateCode()
    }
  },
  updateCode: function () {
    var block = this.blocks.getActive()
    if (block) {
      block.set('warn', '')
      this.dispatcher.trigger('block:change')
    }
  },
  updateLogic: function (t, e) {
    this.$el.find('.logic input').val(e)
  },
})
