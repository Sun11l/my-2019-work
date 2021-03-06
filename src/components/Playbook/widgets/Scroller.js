import Scrollable from './mixins/Scrollable'
import ScrollerItem from './ScrollerItem'

const template = `<ul class="scroller-content"></ul>
<div class="scroller-track">
  <div class="scroller-handle"></div>
</div>
`

export default Backbone.View.extend(_.extend({}, Scrollable, {
  className: 'scroller-widget',
  events: {
    wheel: 'handleWheel',
    mouseenter: 'showScroller',
    mouseleave: 'hideScroller',
  },
  initialize: function (t) {
    this.options = t
    this.template = _.template(template)
    this.scrollerItemTmpl = t.tmpl
    this.clickEvent = t.clickEvent
    this.condField = t.condField
      ? t.condField
      : ''
    this.condClass = t.condClass
      ? t.condClass
      : ''
    this.subviews = []
    this.rawValue = t.rawValue
      ? t.rawValue
      : !1
    this.initScrollable()
  },
  remove: function () {
    this.cleanup()
    this.removeScrollable()
    Backbone.View.prototype.remove.apply(this)
  },
  cleanup: function () {
    _.each(this.subviews, function (t) {
      t.remove()
    })
  },
  render: function () {
    this.cleanup()
    this.$el.html(this.template())
    this.attachItems()
    this.renderScrollable()
    return this
  },
  attachItems: function () {
    var t = this
    var e = this.$el.find('ul')
    _.each(this.model.models, function (n) {
      var s = new ScrollerItem({
        model: n,
        tmpl: t.scrollerItemTmpl,
        clickEvent: t.clickEvent,
      })
      e.append(s.render().el)
      t.condField === '' || n.get(t.condField) || s.$el.addClass(t.condClass)
      t.subviews.push(s)
    })
  },
}))
