/** filter */
import Base from './Base'
import {
  template,
  str,
} from '../utils'

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.name = 'filter'
  },
  updateTemplate: function (type, prop) {
    const templateFilter = this.templates.findWhere({ type: type })
    if (prop) {
      this.template = templateFilter
        ? template(templateFilter.get('json').templateParameters[2].default)
        : template('')
    } else {
      this.template = templateFilter
        ? template(templateFilter.get('info'))
        : template('')
    }
  },
  blockFunction: function (block) {
    const funcName = block.getFunctionName()
    var conditions = ''
    var callback_props = {}
    var search_props = {}
    var search_props_temp = ''
    var callback_temp = ''
    const condition_data = block.outputs.models[0].conditions.models
    const SerchItems_data = block.SerchItems.models
    var search_temp = ''
    var cefMatchTimeField = ''

    condition_data.forEach(el => {
      conditions += '\n' + this.indent(3) + '[' + str(el.get('param')) + ',' + str(el.get('comparison')) + ',' + str(el.get('value')) + ']' + ','
    })
    conditions = conditions.slice(0, conditions.length - 1)
    this.updateTemplate('Callback')

    callback_props = {
      result: 'matched_results_1',
      nodeCallback: this.generateCallbackNameByPort(block, `out-1`),
    }
    callback_temp = this.template({
      ...block.toJSON(),
      ...callback_props,
    })

    this.updateTemplate('Filter', 'search')
    // [[]...]
    _.each(SerchItems_data, (el, i) => {
      cefMatchTimeField = el.get('cefMatchTimeField')
      search_temp += '[' + str(el.get('IndexName')) + ',' + str(el.get('SearchNumber')) + ',' + str(el.get('TimeFieldName')) + ',' +
      str(el.get('TimeInterval')) + ',' + '{'

      _.each(el.conditions.models, (el, i) => {
        search_temp += str(el.get('param')) + ':' + str(el.get('value')) + ','
      })
      search_temp = search_temp.slice(0, search_temp.length - 1)
      search_temp += '}' + ']' + ','
    })
    search_temp = search_temp.slice(0, search_temp.length - 1)
    search_temp = '[' + search_temp + ']'
    search_props = {
      search: search_temp.replace(/(^\s*)/g, ''),
      searchLogicalOperator: str('and'),
      cefMatchTimeField: str(cefMatchTimeField),
    }
    search_props_temp = this.template({
      ...block.toJSON(),
      ...search_props,
    })

    const props = {
      funcName: funcName,
      result: 'matched_results_1',
      conditions: conditions.replace(/(^\s*)/g, ''),
      search: search_props_temp,
      logicalOperator: str(block.outputs.models[0] && block.outputs.models[0].get('logic')),
      callback_temp,
    }

    this.updateTemplate('Filter')
    const code = this.template({
      ...block.toJSON(),
      ...props,
    })

    return {
      title: funcName,
      code,
    }
  },
})
