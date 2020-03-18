import CodeMirror from 'codemirror'

import 'codemirror/mode/python/python'

import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

export default Backbone.View.extend({
  initialize: function () {
    this.initialized = false
    this.fullCode = false
    this.enabled = false
    this.showFullScreen = true

    this.listenTo(this.coa, 'change:frameState', this.frameState)
    this.listenTo(this.coa, 'change:editorOpen', this.editorState)

    this.listenTo(this.dispatcher, 'editor:refresh', this.refresh)
    this.listenTo(this.dispatcher, 'mode:view', this.setViewMode)
    this.listenTo(this.dispatcher, 'mode:edit', this.setEditMode)
    this.listenTo(this.dispatcher, 'editor:update', this.update)
  },
  render: function () {
    if (this.initialized) {
      this.cm.toTextArea()
      // this.cm.off('beforeChange')
      this.cm.off('change')
    }

    // TODO 更新cm的元素节点id为动态的
    this.cm = CodeMirror.fromTextArea(document.getElementById('code'), {
      lineNumbers: true,
      mode: 'python',
      theme: 'material', // 设置编辑器主题 dracula leetcode material
      indentUnit: 4,
      lineWrapping: true,
      gutters: ['CodeMirror-linenumbers', 'lock', 'warn'],
      scrollbarStyle: 'simple',
    })
    this.cm.setOption('extraKeys', {
      Tab: function (t) {
        t.execCommand('insertSoftTab')
      },
    })

    // this.playbook.get('clean') && this.cm.on('beforeChange', _.bind(this.beforeChange, this))
    this.cm.on('change', _.bind(this.codeChange, this))
    this.initialized = true
    return this
  },

  setViewMode: function () {
    this.cm.setOption('readOnly', true)
  },
  setEditMode: function () {
    // window.Object.edit_code &&
    this.cm.setOption('readOnly', false)
  },

  frameState: function (t, state) {
    state !== 'closed' && this.cm.refresh()
  },
  editorState: function (t, state) {
    state && this.cm.refresh()
  },
  refresh: function () {
    this.cm.refresh()
  },
  makeLock: function () {
    const dom = document.createElement('i')
    dom.className = 'fa fa-lock'
    return dom
  },
  update: function (event) {
    const block = this.blocks.getActive()
    const code = event.code.replace(/^\s+|\s+$/g, '')
    const errorLine = this.coa.get('errorLine')
    const editorLineStart = this.coa.get('editorLineStart')
    const codeView = this.coa.get('codeView')

    this.enabled = false
    this.fullCode = codeView === 'full'
    this.globalCode = codeView === 'global'
    this.cm.setOption('firstLineNumber', editorLineStart)

    if (event.title === '') {
      this.cm.setValue('No code selected')
      this.cm.setOption('readOnly', true)
    } else {
      this.cm.setValue(code)
      this.cm.setOption('readOnly', !this.coa.get('editMode'))
    }

    this.cm.clearGutter('lock')
    this.cm.clearGutter('warn')

    const lineSum = this.cm.lineCount() - 1
    const txtStart = this.cm.getLine(0)
    const txtEnd = this.cm.getLine(lineSum)
    const lineStart = editorLineStart + lineSum

    if (
      code !== '' &&
      !this.fullCode &&
      !this.globalCode
    ) {
      if (
        block.get('type') === 'coa.FunctionBlock' &&
        codeView !== 'join'
      ) {
        var h = block.get('customCodeStartLine')
        var u = block.get('customCodeEndLineOffset')
        this.cm.markText({
          line: 0,
          ch: 0,
        }, {
          line: h,
          ch: 0,
        }, {
          readOnly: true,
          className: 'locked',
          inclusiveLeft: true,
        })
        for (var d = 0; h > d; d++) {
          this.cm.setGutterMarker(d, 'lock', this.makeLock())
        }
        this.cm.markText({
          line: lineSum - u,
          ch: 0,
        }, {
          line: lineSum,
          ch: txtEnd.length,
        }, {
          readOnly: true,
          className: 'locked',
          inclusiveLeft: true,
        })
        for (let d = lineSum - u; d < this.cm.lineCount(); d++) {
          this.cm.setGutterMarker(d, 'lock', this.makeLock())
        }
      } else {
        this.cm.markText({
          line: 0,
          ch: 0,
        }, {
          line: 0,
          ch: txtStart.length,
        }, {
          readOnly: true,
          className: 'locked',
          inclusiveLeft: true,
        })
        this.cm.setGutterMarker(0, 'lock', this.makeLock())
        this.cm.markText({
          line: lineSum,
          ch: 0,
        }, {
          line: lineSum,
          ch: txtEnd.length,
        }, {
          readOnly: true,
          className: 'locked',
          inclusiveRight: true,
        })
        this.cm.setGutterMarker(lineSum, 'lock', this.makeLock())
      }
    }
    if (errorLine > 0 && errorLine >= editorLineStart && lineStart >= errorLine) {
      var p = errorLine - editorLineStart
      this.cm.setGutterMarker(p, 'warn', this.makeWarn())
    }
    this.cm.clearHistory()
    this.playbook.get('clean') && this.cm.markClean()
    // window.Object.edit_code || this.cm.setOption('readOnly', true)
    this.enabled = true
  },
  codeChange: function (t, e) {
    if (this.enabled) {
      if (this.globalCode) {
        const val = this.cm.getValue()
        this.playbook.set('code_block', val)
        this.coa.set({
          cleanGlobal: !val,
          codeChanged: true,
        })
      } else {
        if (
          this.fullCode &&
          !this.cm.isClean() &&
          this.showFullScreen
        ) {
          this.showFullScreen = false
          this.playbook.set('clean', false)
          this.playbook.set('python', this.cm.getValue())
          this.playbook.set('info', this.cm.getValue())
          this.coa.set('cleanCode', false)
        } else if (this.fullCode || this.cm.isClean()) {
          if (this.fullCode && !this.cm.isClean()) {
            this.playbook.set('python', this.cm.getValue())
            this.playbook.set('info', this.cm.getValue())
            this.coa.set('codeChanged', true)
          }
        } else {
          var block = this.blocks.getActive()
          var codeview = this.coa.get('codeView')

          if (codeview === 'block') {
            block.set('custom_code', this.cm.getValue())
            // 表示手写的code，不使用模板code了
            block.set('has_custom_block', true)
            // block.get('type') === 'coa.FunctionBlock' && this.saveUserGeneratedCustomCode(block)
          } else if (codeview === 'callback') {
            block.set('custom_callback', this.cm.getValue())
          } else if (codeview === 'join') {
            block.set('custom_join', this.cm.getValue())
          }
          this.coa.set('codeChanged', true)
        }
        this.cm.isClean() || this.coa.set('modified', true)
      }
      if (this.enabled && this.coa.get('errorLine') > 0) {
        this.coa.set('errorLine', 0)
        this.cm.clearGutter('warn')
      }
    }
  },
})
