const template = `
<div class="caption">模板代码已被修改，无法操作节点，恢复代码以恢复节点功能</div>
<div class="revert btn btn-primary">恢复代码</div>
`

export default Backbone.View.extend({
  className: 'revert-view',
  events: {
    'click .revert': 'revertCode',
  },
  initialize: function () {
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },

  revertCode: function () {
    this.dispatcher.trigger('code:revert')
  },
})
