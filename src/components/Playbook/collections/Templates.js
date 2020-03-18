import Tempalte from '../models/Template'
import VERSION from '../version'
export default Backbone.Collection.extend({
  url: `/api/${VERSION}/playbook/template/`,
  model: Tempalte,

  parse: function (response) {
    const data = response.data || {}
    const keys = Object.keys(data)

    return keys.map(key => {
      return {
        type: key,
        info: data[key]['info'],
        json: data[key]['json'],
      }
    })
  },
})
