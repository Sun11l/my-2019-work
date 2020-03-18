import { getCookie } from '@/api/common/auth'
import config from '../config'
// import Container from '../widgets/Dropdown/Container' // i
import { parseTime } from '../../../utils/index'
const template = `<div class="debug-tab">  
<span>调试</span>  
</div>
<div class='resizable-handle'></div>
<div class="debug-content">  
<div class="debug-header">    
<div class="frame-controls">      
<div class="close"><i class="fa fa-times"></i></div>
<div class="compress"><i class="fa fa-compress"></i></div>      
<div class="split vert"></div>      
<div class="split horz"></div>    
</div>    
<div class="controls-wrapper">      
<div class="debug-input">        
<input id="containerId" class="containerId" type="text" placeholder="Artifact ID"/>        
<button class="btn btn-primary test">Test</button>        
<input id="artifactId" class="artifactId" type="text" placeholder="Event ID"/>        
<div class="debug-as">          
<input id="debug-as" class="custom-checkbox" type="checkbox" checked></input>          
<label for="debug-as">Run as current user</label>          
</div>      
</div>    
</div>  
</div>  
<div class="clear"></div>  
<div class="message-wrapper">    
<div class="output-copied"><i class="fa fa-check"></i><span>Copied to clipboard</span></div>    
<div class="save-message"><% if (!archive) { %> Save Playbook to test<% } %></div>    
<div class="clear"></div>  
</div>  
<div class="clear"></div>  
<div class="status"></div>  
<div class="output-wrapper">    
<div id="debug_output"></div>  
</div>
</div>`
const id = `#${config.layouts.debuggerId}`
export default Backbone.View.extend({
  el: id,
  events: {
    'click .debug-tab span': 'toggle',
    'click .debug-tab i': 'expand',
    'click .debug-input': 'showMessage',
    'click .compress': 'compress',
    'click .close': 'close',
    'click .copy-debug': 'copyDebug',
    'click button.test': 'testPlaybook',
    'click button.cancel': 'cancelPlaybook',
    'focus input': 'clearError',
    'mouseenter i.fa-info-circle': 'showTip',
    'mouseleave i.fa-info-circle': 'hideTip',
    'mousedown .resizable-handle': 'onMousedown',
  },
  initialize: function () {
    this.template = _.template(template)
    this.timerStart = 20
    this.timerValue = this.timerStart
    this.playbook_run_id = null
    this.websocket = null
    this.dbg_token = null
    this.timer = null
    this.running = false
    this.call_rest = false
    this.messages = []
    this.throttledUpdateLog = _.throttle(_.bind(this.updateMessages, this), 250, {
      leading: true,
    })
    this.listenTo(this.coa, 'change:editMode', this.editMode)
    this.listenTo(this.coa, 'change:frameState', this.frameState)
    this.listenTo(this.coa, 'change:frameSplit', this.frameSplit)
    this.listenTo(this.dispatcher, 'scope:change', this.scopeChange)
    this.render()
  },
  render: function () {
    var t = this.playbook.get('current_id') !== ''
    this.coa.get('user')
    this.$el.html(this.template({
      scope: 'new',
      archive: t,
    }))
    this.playbook.get('clean') || this.$el.find('.compress').hide()
    // this.scopeMenu = new Container({
    //   label: 'Scope',
    //   name: 'scope',
    //   value: 'new',
    //   data: ['all', 'new', 'artifact'],
    //   reverseDisable: true,
    //   action: 'scope:change',
    //   freeform: false,
    // })
    // this.$el.find('div.scope').append(this.scopeMenu.render().el)
    this.$el.find('input').keypress(_.bind(this.handleKeypress, this))
    this.editMode(this.coa, this.coa.get('editMode'))
    return this
  },
  setOpen: function () {
    this.$el.addClass('open')
  },
  setClosed: function () {
    this.clearError()
    this.$el.removeClass('open')
  },
  showMessage: function () {
    this.coa.get('editMode') && this.$el.find('div.save-message').stop(true, false).fadeIn(200).delay(5e3).fadeOut(200)
  },
  toggle: function () {
    this.dispatcher.trigger('debug:toggle')
  },
  expand: function () {
    this.dispatcher.trigger('debug:expand')
  },
  compress: function () {
    this.dispatcher.trigger('debug:compress')
  },
  close: function () {
    this.dispatcher.trigger('debug:close')
  },
  handleKeypress: function (t) {
    var e = t.keyCode || t.which
    e === 13 && this.testPlaybook(t)
  },
  editMode: function (t, e) {
    // || this.playbook.get('current_id') !== ''
    if (e) {
      this.$el.find('button, input').attr('disabled', 'disabled')
      this.$el.find('.debug-input').addClass('disabled')
      this.clearError()
    } else {
      this.$el.find('button, input').removeAttr('disabled')
      this.$el.find('.debug-input').removeClass('disabled')
      this.$el.find('.save-message').stop(true, false).hide()
    }
  },
  frameState: function (t, e) {
    e === 'full' && this.coa.get('coaData') ? this.$el.find('.compress').show() : this.$el.find('.compress').hide()
    e !== 'full' || this.coa.get('coaData') ? this.$el.find('.close').show() : this.$el.find('.close').hide()
  },
  frameSplit: function (t, e) {
    e !== 'none' || this.playbook.get('clean') ? this.$el.find('.close').show() : this.$el.find('.close').hide()
  },
  testPlaybook: function (t) {
    t.preventDefault()
    this.$el.find('button').removeClass('test').addClass('cancel').html('Cancel')
    this.playbook_run_id = null
    this.startDebug()
  },
  resetTest: function (t) {
    t && t.preventDefault()
    this.$el.find('button').removeClass('cancel').addClass('test').html('Test')
    this.$el.find('.end').remove()
    this.running = false
  },
  cancelPlaybook: function () {
    this.dispatcher.trigger('notification:clear')
    this.resetTest()
    this.closeWebsocket()
    this.cancelTimer()
    if (this.call_rest) {
      this.call_rest = false
      void this.setStatusMessage('Canceled')
    } else {
      this.setStatusMessage('Canceling...')
      this.dispatcher.trigger('notification:show', {
        message: 'Cancelling playbook...',
        autoHide: true,
      })
    }
  },
  startDebug: function () {
    if (!this.running) {
      this.dispatcher.trigger('notification:clear')
      this.$el.find('.copy-debug').hide()
      var containerId = this.$el.find('#containerId').val().trim()
      var i = this.$el.find('#artifactId').val().replace(/\s+/g, ',').replace(/,+/g, ',').split(',')
      if (containerId === '') {
        var message = 'Enter a numeric container ID.'
        this.dispatcher.trigger('notification:show', {
          message,
          autoHide: false,
        })
        this.$el.find('#containerId').addClass('error')
        return void this.resetTest()
      }
      this.running = true
      this.call_rest = true
      this.dbg_token = (new Date()).getTime() + ''
      this.setStatusMessage('Running...')
      $('#debug_output').empty()
      this.startWebsocket(containerId)
    }
  },
  runPlaybook: function () {
    var t = this
    var container_id = this.$el.find('#containerId').val().trim()
    var i = this.$el.find('#scope').val()
    var n = $('#debug-as:checked').length > 0
    i === 'artifact' && (i = _.map(this.$el.find('#artifactId').val().replace(/\s+/g, ',').replace(/,+/g, ',').split(','), function (t) {
      return parseInt(t)
    }))
    var s = {
      run: true,
      playbook_id: parseInt(this.playbook.get('id')),
      container_id: container_id,
      test_mode: true,
      run_as_user: n,
      scope: i,
      dbg_token: this.dbg_token,
    }
    // this.debug('post /rest/playbook_run', s), $.ajax({
    //   url: '/rest/playbook_run',
    //   type: 'POST',
    //   dataType: 'json',
    //   data: JSON.stringify(s),
    // }).done(function (e) {
    //   t.playbook_run_id = parseInt(e.playbook_run_id)
    // }).fail(function (e, i, n) {
    //   var s = 'Failed to connect to server.'
    //   e.readyState === 4 ? s = JSON.parse(e.responseText).message ? JSON.parse(e.responseText).message : e.statusText : e.readyState === 0 && (s = 'Network error, connection failed.'), t.dbg_token = null, t.setStatusMessage('Error'), t.dispatcher.trigger('notification:show', {
    //     message: s,
    //     autoHide: true,
    //   }), t.resetTest()
    // })
  },
  showTimeoutMessage: function (t) {
    var e = t ? 'Request timed out. Unable to display debug messages.' : 'An error occurred while communicating with the server.'
    $('#debug_output').append('<div><span class="error-message">' + e + '</span></div>')
    this.call_rest = false
    this.$el.find('.copy-debug').show()
    this.setStatusMessage('Error')
    this.resetTest()
  },
  startWebsocket: function (t) {
    var e = {
      container_id: parseInt(t),
    }
    this.closeWebsocket()
    // ws://10.200.76.183:8886/ws-api/v1.0.2/playbook/{token}/{pID}/{artifactsID}/
    this.websocket = this.initWebsocket(`ws://${location.host}/ws-api/v1.0.2/playbook/${getCookie('token')}/${this.playbook.get('id')}/${t}/`, e, _.bind(this.handleMessage, this))
    // this.websocket = this.initWebsocket(`ws://10.200.76.183:8886/ws-api/v1.0.2/playbook/abc/745/ZPxnh24BZssH9GT7JEpD/`, e, _.bind(this.handleMessage, this))
  },
  closeWebsocket: function () {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  },
  initWebsocket: function (url, e, handleMessage) {
    var n = this
    var ws = new WebSocket(url)
    var o = {
      register: true,
    }
    this.debug('init web socket')
    $.extend(o, e)
    ws.onerror = function (url) {
      n.debug('web socket error', ws.readyState)
      if (ws.readyState !== 1) {
        n.cancelTimer()
        n.showTimeoutMessage(false)
      }
    }
    ws.onopen = function () {
      n.debug('web socket opened')
      // ws.send(JSON.stringify(o))
    }
    window.onbeforeunload = function () {
      ws.close()
      ws = null
    }
    ws.onmessage = handleMessage
    this.debug('start timer')
    this.timer = setInterval(_.bind(this.checkTimer, this), 1e3)
    return ws
  },
  checkTimer: function () {
    if (this.timerValue > 0) {
      this.timerValue -= 1
      this.debug('timer value', this.timerValue)
    } else {
      this.debug('timer expired')
      this.timerExpired()
    }
  },
  cancelTimer: function () {
    clearInterval(this.timer)
    this.timerValue = this.timerStart
    this.debug('cancel timer')
  },
  timerExpired: function () {
    this.debug('timer expired', this.websocket.readyState)
    if (this.websocket.readyState !== 1) {
      this.showTimeoutMessage(true)
    }
    this.cancelTimer()
  },
  handleMessage: function (t) {
    var _this = this
    t = JSON.parse(t.data)
    // && t[0] && t[0].received)
    if (_this.call_rest && t.status === 200) {
      this.cancelTimer()
      // this.call_rest = false
      this.runPlaybook()
    }
    // 判断服务端的token是否和浏览器的相同 相同就输出返回内容
    _.each(t, function (t) {
      // if (_this.dbg_token && t.dbg_token === _this.dbg_token) {
      //   _this.updateTestLog(t)
      // }
      _this.updateTestLog(t)
    })
  },
  updateTestLog: function (t) {
    var e = ($('#debug_output'), $('<div />'))
    var i = $('<span />')
    var n = $('<span />')
    var output_msg = ''
    // 输出服务端返回的信息
    _.each(t, function (t) {
      output_msg += t
    })
    n.text(output_msg)
    t['class'] === 'user' ? n.addClass('user-message') : t['class'] === 'error' && n.addClass('error-message')
    i.addClass('message-ts')
    i.text(parseTime(Date(t.timestamp).toString()) + ': ')
    e.append(i, n)
    this.messages.push(e)
    t.type === 'dbg_done' && this.checkIfPlaybookFinished(t)
    this.throttledUpdateLog()
  },
  updateMessages: function () {
    var t = $('#debug_output')
    var e = t.find('.end').detach()
    var i = this.messages.length
    var n = []
    this.debug('display ' + i + ' messages')
    for (var s = 0; i > s; s++) n.push(this.messages.shift())
    if (this.running) {
      e.length < 1 && (e = $('<div class="end"><span class="blink">&block;</span></div>'))
      n.push(e)
    }
    t.append(n)
    n[i - 1][0].scrollIntoView({
      block: 'end',
      inline: 'end',
    })
  },
  setStatusMessage: function (t) {
    t === '' ? this.$el.find('.status').empty() : this.$el.find('.status').html('<div class="message">Status: ' + t + '</div>')
  },
  clearError: function () {
    this.$el.find('input').removeClass('error')
  },
  copyDebug: function () {
    if (document.selection) {
      var t = document.body.createTextRange()
      t.moveToElementText(document.getElementById('debug_output'))
      t.select()
    } else if (window.getSelection) {
      var e = window.getSelection()
      var createRange = document.createRange()
      t.selectNodeContents(document.getElementById('debug_output'))
      e.removeAllRanges()
      e.addRange(createRange)
    }
    document.execCommand('copy')
    document.getSelection().removeAllRanges()
    this.$el.find('.output-copied').fadeIn(300).delay(2e3).fadeOut(300)
  },
  scopeChange: function () {
    this.$el.find('#scope').val() === 'artifact' ? this.$el.find('#artifactId').show() : this.$el.find('#artifactId').hide()
  },
  showTip: function (t) {
    var e = $(t.currentTarget)
    var i = e.data('tooltip')
    var n = e.offset()
    var s = this.coa.get('frameState') === 'full' ? 'bottom' : 'top'
    this.tooltip = $('<div/>').addClass('tooltip confined ' + s).html(i).css({
      visibility: 'hidden',
    })
    $('body').append(this.tooltip)
    var o = this.tooltip.width()
    var a = this.tooltip.height()
    var r = s === 'top' ? n.top - a - 22 : n.top + 25
    this.tooltip.css({
      display: 'none',
      visibility: 'visible',
      top: r,
      left: n.left - o / 2 - 4,
    })
    this.tooltip.fadeIn(200)
  },
  hideTip: function (t) {
    var e = this
    this.tooltip && this.tooltip.fadeOut(200, function () {
      e.tooltip.remove()
    })
  },
  debug: function () {
    window.DEBUG && (arguments.length === 1 ? console.log(arguments[0]) : console.log(arguments[0], arguments[1]))
  },
  checkIfPlaybookFinished: function (t) {
    if (t.playbook_run_id === this.playbook_run_id) {
      this.resetTest()
      this.setStatusMessage('Done')
      this.$el.find('.copy-debug').show()
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
