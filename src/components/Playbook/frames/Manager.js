import config from '../config'

import Editor from './Editor'

import Debug from './Debug'
export default Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.dispatcher, 'frame:close', this.frameClose)
    this.listenTo(this.coa, 'change:frameState', this.frameState)

    this.listenTo(this.dispatcher, 'editor:toggle', this.toggleEditor)
    this.listenTo(this.dispatcher, 'editor:expand', this.expandEditor)
    this.listenTo(this.dispatcher, 'editor:compress', this.compress)
    this.listenTo(this.dispatcher, 'editor:open', this.openEditor)
    this.listenTo(this.dispatcher, 'editor:close', this.closeEditor)
    this.listenTo(this.coa, 'change:editorOpen', this.editorState)
    this.listenTo(this.dispatcher, 'debug:toggle', this.toggleDebug)
    this.listenTo(this.dispatcher, 'debug:expand', this.expandDebug)
    this.listenTo(this.dispatcher, 'debug:close', this.closeDebug)
    this.listenTo(this.dispatcher, 'debug:resize', this.resizeDebug)
    this.listenTo(this.coa, 'change:debugOpen', this.debugState)
    this.listenTo(this.coa, 'change:frameState', this.frameState)
    this.listenTo(this.coa, 'change:frameSplit', this.frameSplit)

    this.render()
  },
  render: function () {
    this.editor = new Editor()
    this.debug = new Debug()
    this.$frames = $(`#${config.layouts.framesId}`)

    return this
  },

  frameClose: function () {
    this.closeEditor()
    this.closeDebug()
  },
  compress: function () {
    this.coa.frameState('open')
  },

  frameState: function (t, state) {
    if (state === 'open') {
      this.$frames.removeClass('full').addClass('open')
    } else if (state === 'full') {
      this.$frames.removeClass('open').addClass('full')
    } else {
      this.$frames.removeClass('full').removeClass('open')
      this.$frames.removeAttr('style')
    }
  },
  editorState: function (t, state) {
    state ? this.editor.setOpen() : this.editor.setClosed()
  },
  debugState: function (t, e) {
    e ? this.debug.setOpen() : this.debug.setClosed()
  },
  openEditor: function () {
    this.coa.frameState() === 'closed' && this.coa.frameState('open')
    this.coa.setEditor(true)
  },
  closeEditor: function () {
    // this.coa.frameState('closed')
    // this.coa.setEditor(false)
    // this.editor.$el.removeAttr('style')
    this.coa.frameSplit() === 'none' && this.coa.frameState('closed')
    this.coa.frameSplit('none')
    this.coa.setEditor(false)
    this.debug.$el.removeAttr('style')
    this.editor.$el.removeAttr('style')
  },
  toggleEditor: function () {
    // if (this.coa.isEditorOpen()) {
    //   this.coa.setEditor(false)
    //   this.coa.frameState('closed')
    // } else {
    //   this.coa.frameState() === 'closed' && this.coa.frameState('open')
    //   this.coa.setEditor(true)
    //   this.dispatcher.trigger('editor:refresh')
    // }
    if (this.coa.isEditorOpen()) {
      this.coa.setEditor(false)
      this.coa.isDebugOpen()
        ? this.coa.frameSplit('none')
        : this.coa.frameState('closed')
    } else {
      this.coa.frameState() === 'closed' && this.coa.frameState('open')
      this.coa.setEditor(true)
      this.coa.setDebug(false)
      this.dispatcher.trigger('editor:refresh')
    }
  },
  expandEditor: function () {
    this.coa.frameState('full')
    this.coa.setEditor(true)
    this.dispatcher.trigger('editor:refresh')
  },
  toggleDebug: function () {
    if (this.coa.isDebugOpen()) {
      this.coa.setDebug(false)
      this.coa.isEditorOpen()
        ? this.coa.frameSplit('none')
        : this.coa.frameState('closed')
    } else {
      this.coa.frameState() === 'closed' && this.coa.frameState('open')
      this.coa.setDebug(true)
      this.coa.setEditor(false)
    }
  },
  expandDebug: function () {
    this.coa.frameState('full')
    this.coa.isEditorOpen() && this.coa.frameSplit(this.lastFullSplit)
    this.coa.setDebug(true)
  },
  closeDebug: function () {
    this.coa.setDebug(false)
    this.coa.frameSplit() === 'none' && this.coa.frameState('closed')
    this.coa.frameSplit('none')
    this.coa.setDebug(false)
    this.debug.$el.removeAttr('style')
    this.editor.$el.removeAttr('style')
    this.dispatcher.trigger('websocket:start')
  },
})
