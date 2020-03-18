import Scroller from '../../../widgets/Scroller'

export default Scroller.extend({
  attachItems: function () {
    var listStrArr = []
    let renderStr = ''

    for (let item of this.fields.values()) {
      if (item.label.toLowerCase().indexOf(this.search.toLowerCase().trim()) !== -1) {
        listStrArr.push('<li class="item" data-value="' + _.escape(item.value) + '">' + _.escape(item.label) + '</li>')
      }
    }

    renderStr = listStrArr.length === 0
      ? '<li class="empty">没有匹配的数据</li>'
      : listStrArr.join('')

    this.$el.find('ul').append(renderStr)
  },
})
