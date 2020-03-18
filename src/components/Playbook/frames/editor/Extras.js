const template = `
<div class="fullcode enabled" data-tooltip="Full Playbook">
  <i class="fa fa-code"></i>
</div>
<div class="global enabled" data-tooltip="Global Block">
  <i class="fa fa-globe"></i>
</div>
<div class="block" data-tooltip="">
  <i class="fa fa-code"></i>
  <ul class="code-blocks">
    <li class="main active" data-section="block">Block Function</li>
    <li class="callback enabled" data-section="callback">Callback Function</li>
    <li class="join enabled" data-section="join">Join Function</li>
  </ul>
</div>
<div class="revert" data-tooltip="Revert Changes">
  <i class="fa fa-undo"></i>
</div>
`

export default Backbone.View.extend({
  className: 'extras',
  events: {
    'click .fullcode.enabled': 'fullCode',
    'click .revert.enabled': 'revertCode',
    'click .global.enabled': 'globalCode',
    'click li.enabled': 'blockCode',
    'mouseenter .block.enabled': 'showCodeNav',
    'mouseleave .block.enabled': 'hideCodeNav',
    'mouseenter div': 'showTip',
    'mouseleave div': 'hideTip',
  },
  initialize: function () {
    this.template = _.template(template)

    this.listenTo(this.coa, 'change:editMode change:codeView change:cleanCode change:cleanGlobal', this.updateState)
    this.listenTo(this.blocks, 'change:active change:has_custom_block change:has_custom_callback change:has_custom_join', this.updateState)
    this.listenTo(this.playbook, 'change:clean', this.updateState)
    this.listenTo(this.dispatcher, 'code:update playbook:save', this.updateState)
  },
  render: function () {
    this.$el.html(this.template())
    this.updateState()
    return this
  },
  updateState: function () {
    var t = this.blocks.getActive()
    var e = this.coa.get('codeView')

    // this.hideCodeNav()

    if (this.playbook.get('clean') && e !== 'global') {
      this.$el.find('div.global').addClass('enabled')
    } else {
      this.$el.find('div.global').removeClass('enabled')
    }

    this.coa.get('editMode') && (e === 'full' && !this.playbook.get('clean') && this.coa.get('coaData') || e === 'global' && !this.coa.get('cleanGlobal') || e === 'block' && t && t.get('has_custom_block') || e === 'callback' && t && t.get('has_custom_callback') || e === 'join' && t && t.get('has_custom_join')) ? this.$el.find('div.revert').addClass('enabled') : this.$el.find('div.revert').removeClass('enabled')

    e === 'full'
      ? this.$el.find('div.fullcode').removeClass('enabled')
      : this.$el.find('div.fullcode').addClass('enabled')

    if (t) {
      this.$el.find('div.block').addClass('enabled')
      e === 'block'
        ? this.$el.find('li.main').addClass('active').removeClass('enabled')
        : this.$el.find('li.main').removeClass('active').addClass('enabled')
      e === 'join'
        ? this.$el.find('li.join').addClass('active').removeClass('enabled')
        : (!t.hasJoinFunction() && !t.get('has_custom_join'))
          ? this.$el.find('li.join').addClass('enabled').removeClass('active')
          : this.$el.find('li.join').removeClass('enabled').removeClass('active')
      e === 'callback'
        ? this.$el.find('li.callback').addClass('active').removeClass('enabled')
        : (!t.hasCallbackWrapper() && !t.get('has_custom_callback'))
          ? this.$el.find('li.callback').addClass('enabled').removeClass('active')
          : this.$el.find('li.callback').removeClass('enabled').removeClass('active')
    } else {
      this.$el.find('div.block').removeClass('enabled')
    }
  },
  blockCode: function (t) {
    var e = $(t.currentTarget)
    var i = e.data('section')
    this.coa.set('codeView', i)
    this.dispatcher.trigger('code:update')
  },
})
