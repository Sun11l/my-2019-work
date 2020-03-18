import ModelsApp from '../models/App'
import VERSION from '../version'
export default Backbone.Collection.extend({
  url: `/api/${VERSION}/playbook/menu/app/`,
  model: ModelsApp,
  comparator: function (t) {
    return t.get('name')
  },
  parse: function (t) {
    return t.data
  },
})
