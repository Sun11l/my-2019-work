import config from '../config'

import Header from './editor/Header'
import Extras from './editor/Extras'
import Codemirror from './editor/Codemirror'
//  <i class="fa fa-expand"></i> 这个是code全屏小按钮
const id = `#${config.layouts.editorId}`
const template = `
<div class="editor-tab">
  <span>剧本编辑器</span>
</div>
<div class='resizable-handle'></div>
<div class="editor-content"><textarea id="code" class="code"></textarea></div>
<div class="slider ui-resizable-handle"></div>
`

export default Backbone.View.extend({
  el: id,
  events: {
    'click .editor-tab span': 'toggle',
    'click .editor-tab i': 'expand',
    'click .compress': 'compress',
    'click .close': 'close',
    'mousedown .resizable-handle': 'onMousedown',
  },
  initialize: function () {
    this.template = _.template(template)

    this.listenTo(this.coa, 'change:frameState', this.frameState)

    this.render()
  },
  render: function () {
    this.$el.html(this.template())

    this.header = new Header()
    this.extras = new Extras()
    this.editor = new Codemirror()

    this.$handle = this.$el.find('.slider')
    this.$edithandle = this.$el.find('.resizable-handle')
    this.$el.find('.editor-content')
      .prepend(this.header.render().el)
      .append(this.extras.render().el)

    this.editor.render()
    this.resizableFlag = false
    // TODO 看下利用resizable实现了什么
    if (!this.$el.resizable('instance')) {
      this.$el.resizable({
        handles: 'e',
        classes: {
          'ui-resizable-handle': 'slider',
        },
        minWidth: 300,
        minHeight: null,
      })
    }

    return this
  },

  setOpen: function () {
    this.$el.addClass('open')
  },
  setClosed: function () {
    this.$el.removeClass('open')
  },

  toggle: function () {
    this.dispatcher.trigger('editor:toggle')
  },
  expand: function () {
    this.dispatcher.trigger('editor:expand')
  },
  compress: function () {
    this.dispatcher.trigger('editor:compress')
  },
  close: function () {
    this.dispatcher.trigger('editor:close')
  },
  frameState: function (t, state) {
    if (state !== 'closed') {
      this.$el.resizable('enable')
    } else {
      this.$el.resizable('disable')
    }
  },
  // 编辑器可拉伸调整宽度
  onMousedown: function (e) {
    this.resizableFlag = true
    this.preclickx = parseInt(e.clientX)
    if (document.addEventListener) {
      document.addEventListener('mousemove', this.onMousemove.bind(this))
      document.addEventListener('mouseup', this.onMouseup.bind(this))
    }
    if (e.stopPropagation) e.stopPropagation()
    else e.cancelBubble = true
    if (e.preventDefault) e.preventDefault()
    else e.returnValue = false
  },
  onMousemove: function (e) {
    if (this.resizableFlag) {
      this.clickX = parseInt(e.clientX)
      const _moveX = this.clickX - this.preclickx
      this.$el.parent().width(this.$el.parent().width() - _moveX + 'px')
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
      this.preclickx = this.clickX
    }
  },
  onMouseup: function (e) {
    this.resizableFlag = false
    e.cancelBubble = true
  },
})
