/** 这是放header块的 */

const template = `
<div class="connection">有关的 <%- type %>: <%- name %></div>
`

export default Backbone.View.extend({
  className: 'connection-summary',
  initialize: function () {
    this.template = _.template(template)
  },
  render: function () {
    var t = this.blocks.getActive()
    var e = t.get('connection_type')
    var i = t.get('connection_name')
    e && i && this.$el.html(this.template({
      type: e,
      name: i,
    }))
    return this
  },
})
