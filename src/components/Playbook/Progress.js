import config from './config'

const id = `#${config.layouts.loaderId}`

export default Backbone.View.extend({
  el: id,
  render: function () {
    return this
  },

  /// ----以下是自定义方法---
  remove: function () {
    $(id).delay(300).fadeOut(500, function () {
      $(this).hide()
    })
  },
  set: function (t) {
    $(`${id} .status`).html(t)
  },
  error: function (t) {
    var that = this
    $(`${id} .loading, ${id} .status`).remove()
    $(`${id} .error`).append('<div>' + t + '</div>')
    setTimeout(function () {
      that.remove()
    }, 500)
  },
})
