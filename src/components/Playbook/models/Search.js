
import ModelCondition from './Condition' // i
import CollectionConditions from '../collections/Conditions' // n

const SearchItem = Backbone.Model.extend({
  defaults: {
    IndexName: '',
    SearchNumber: '1',
    TimeFieldName: '',
    TimeInterval: '',
    searchLogicalOperator: 'and',
    cefMatchTimeField: '',
  },
  initialize: function (t, e) {
    var s = this
    this.conditions = new CollectionConditions()
    t && t.conditions ? _.each(t.conditions, function (t) {
      s.conditions.add(t)
    }) : this.conditions.add(new ModelCondition())
  },
  toJSON: function () {
    var t = SearchItem.__super__.toJSON.apply(this)
    t.conditions = _.invoke(this.conditions.models, 'toJSON')
    return t
  },
  addCondition: function (t) {
    this.conditions.add(new ModelCondition(t))
    // console.log(this.conditions)
  },
  removeCondition: function (t) {
    this.conditions.remove(t)
    this.conditions.length === 0 && this.collection.remove(this)
  },
})

export default SearchItem
