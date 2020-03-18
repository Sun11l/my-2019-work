/**
 *    <input placeholder='FieldName'>
      <input placeholder='CEFName'>
      <input placeholder='FieldName'>
      <input placeholder='CEFName'>
     <input placeholder='searchLogicalOperator'>
 */
import Condition from './condition'
import InputPlain from '../../../widgets/InputPlain'
const tempalte = `
<div class='search-name'>  
    <div class='clear'></div>
    <div class='search-type'></div>
    <% if (can_del_searchitem) { %>
      <i class='fa fa-minus'></i>
      <% } %>
      <div class='conditions'>
      </div>
      <div class='search-row'>
      <div class='condition'>
      <div class='row'>
      <div class='SearchNumber param'></div>
      <div class='IndexName param'></div>
      <div class='TimeFieldName param'></div>
      <div class='TimeInterval param'></div>
      <div class='cefMatchTimeField param'></div>
      </div>
      </idv>
      </div>
    <div class='clear'>
    </div>
`

export default Backbone.View.extend({
  className: 'search-group',
  events: {
    'click .fa-minus': 'deleteSearchitem',
    'click .fa-plus': 'addCondition',
  },
  initialize: function (t) {
    this.template = _.template(tempalte)
    this.index = t.index
    this.can_del_searchitem = t.can_del_searchitem
    this.listenTo(this.dispatcher, 'logic:delete', this.removeCondition)
  },
  render: function () {
    const that = this
    this.$el.html(
      this.template(
        _.extend(this.model.toJSON(), {
          can_del_searchitem: this.can_del_searchitem,
        })
      )
    )
    var n = this.$el.find('.conditions')
    _.each(this.model.conditions.models, function (s, o, a) {
      var r = o === a.length - 1
      var l = new Condition({
        model: s,
        can_delete: true,
        can_add: r,
        type: that.model.get('type'),
        logic: that.model.get('searchLogicalOperator'),
        index: o,
        output: that.model,
        param_placeholder: 'FieldName',
        value_placeholder: 'CEFName',
      })
      n.append(l.render().el)
      // that.conditionViews.push(l)
    })
    this.IndexName = new InputPlain({
      model: this.model,
      name: 'IndexName',
      placeholder: 'IndexName',
      value: this.model.get('IndexName'),
      tooltip: true,
      data: [],
      action: 'condition:update',
    })
    this.SearchNumber = new InputPlain({
      model: this.model,
      name: 'SearchNumber',
      placeholder: 'SearchNumber',
      value: this.model.get('SearchNumber'),
      tooltip: true,
      data: [],
      action: 'condition:update',
    })
    this.TimeFieldName = new InputPlain({
      model: this.model,
      name: 'TimeFieldName',
      placeholder: 'TimeFieldName',
      value: this.model.get('TimeFieldName'),
      tooltip: true,
      data: [],
      action: 'condition:update',
    })
    this.TimeInterval = new InputPlain({
      model: this.model,
      name: 'TimeInterval',
      placeholder: 'TimeInterval',
      value: this.model.get('TimeInterval'),
      tooltip: true,
      data: [],
      action: 'condition:update',
    })
    this.cefMatchTimeField = new InputPlain({
      model: this.model,
      name: 'cefMatchTimeField',
      placeholder: 'cefMatchTimeField',
      value: this.model.get('cefMatchTimeField'),
      tooltip: true,
      data: [],
      action: 'condition:update',
    })

    this.$el.find('.IndexName').append(this.IndexName.render().el)
    this.$el.find('.SearchNumber').append(this.SearchNumber.render().el)
    this.$el.find('.TimeFieldName').append(this.TimeFieldName.render().el)
    this.$el.find('.TimeInterval').append(this.TimeInterval.render().el)
    this.$el.find('.cefMatchTimeField').append(this.cefMatchTimeField.render().el)
    return this
  },
  deleteSearchitem: function () {},
  addCondition: function () {
    this.model.addCondition()
    this.model.collection.trigger('add')
    // this.dispatcher.trigger('code:update')
  },
  removeCondition: function (t) {
    if (this.model.conditions.get({
      cid: t.cid,
    })) {
      this.model.removeCondition(t)
      this.model.conditions.length === 1 && this.model.set('logic', 'and')
      this.model.collection.trigger('remove')
    }
    this.dispatcher.trigger('code:update')
  },
})
