import config from '../config'
import {
  Model,
  View,
} from './base.js'

const startWidth = config.gridSize * 4
const startHeight = config.gridSize * 3
// const iconHeight = 13
const bottomIconY = startHeight - 17 - 10

const template = `<g class="rotatable">
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g>
  <rect class="background"/>
  <rect class="color-band"/>
  <g class="icon"><image/></g>
  <text class="title"/>
  <g class="error"><image/></g>
  <g class="btn code"><image/></g>
</g>
`

export const StartEndModel = Model.extend({
  markup: template,
  defaults: _.defaultsDeep({
    type: 'coa.StartEnd',
    size: {
      width: startWidth,
      height: startHeight,
    },
    inPorts: [],
    outPorts: [],
    attrs: {
      '.': {
        magnet: false,
      },
      '.port-body': {
        r: 10,
        magnet: true,
      },
      '.background': {
        fillOpacity: 1,
        strokeWidth: 2,
        // stroke: '#333',
        fill: config.colors.background_start,
        stroke: config.colors.border,
        width: startWidth,
        height: startWidth,
        x: 0,
        y: 0,
        rx: startWidth,
        ry: startWidth,
        // rx: 3,
        // ry: 3,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 2,
            dy: 2,
            blur: 2,
            opacity: 0.3,
          },
        },
      },
      // 这是节点title的背景设置
      // '.color-band': {
      //   fillOpacity: 1,
      //   fill: config.colors.header,
      //   x: 1,
      //   y: 1,
      //   width: 78,
      //   height: 27,
      // },
      'text.title': {
        // fill: '#FFFFFF',
        fill: '#333',
        fontSize: 18,
        // fontFamily: 'Roboto',
        fontWeight: 700,
        text: '',
        // width: 96,
        // height: 20,
        width: 96,
        height: 20,
        ref: '.background',
        // refY: 8,
        // refX: 12 + 13 + 8,
        refY: 30,
        refX: 12 + 12,
        textAnchor: 'left',
        alignmentBaseline: 'central',
      },
      'g.error image': {
        xlinkHref: `${config.staticPrefix}/block_icon_error.svg`,
        ref: '.background',
        // refX: 54,
        refX: 61,
        refY: bottomIconY,
        width: 16,
        height: 16,
      },
      'g.icon image': {
        xlinkHref: '',
        ref: '.background',
        refX: 12,
        refY: 8,
        width: 13,
        // height: iconHeight,
        height: 0, // 小旗子
      },
      'g.code image': {
        xlinkHref: `${config.staticPrefix}/block_icon_code_light_off.svg`,
        ref: '.background',
        refX: 32,
        // refY: bottomIconY,
        refY: 50,
        width: 17,
        height: 17,
      },
      '.inPorts circle': {
        type: 'input',
        ref: '.background',
        refY: config.gridSize * 2,
        fill: config.portBgColor,
      },
      '.outPorts circle': {
        type: 'output',
        ref: '.background',
        refX: startWidth,
        refY: config.gridSize * 2,
        fill: config.portBgColor,
      },
    },

    name: '',
    blockType: '',
  }, Model.prototype.defaults),

  initialize: function (blockType, title) {
    Model.prototype.initialize.apply(this, arguments)

    this.initEvent()
    this.set({
      blockType,
      title,
      name: '',
    })
  },

  /// ----以下是自定义方法----

  /** 初始化事件监听 */
  initEvent: function () {
    this.on('change:title', function (node, title) {
      node.attr('.title/text', title)
    })

    this.on('change:blockType', function (node, blockType) {
      if (blockType === 'start') {
        // 针对起点类型端点的配置
        node.attr({
          'g.icon image': {
            xlinkHref: `${config.staticPrefix}/block_icon_start.svg`,
            // refX: 13,
          },
        })
        // 针对起点类型颜色的配置
        node.attr({
          '.background': {
            fill: config.colors.background_start,
            // refX: 13,
          },
        })
      } else {
        // 终点端点配置
        node.attr({
          'g.icon image': {
            xlinkHref: `${config.staticPrefix}/block_icon_end.svg`,
          },
        })
        // 针对起点类型颜色的配置
        node.attr({
          '.background': {
            fill: config.colors.background_end,
          },
        })
        node.attr({
          'text.title': {
            fill: '#ffffff',
          },
        })
      }
    })

    this.on('change:custom_code', function (node, code) {
      if (code === '') {
        node.attr({
          'g.code image': {
            xlinkHref: `${config.staticPrefix}/block_icon_code_light_off.svg`,
          },
        })
      } else {
        node.attr({
          'g.code image': {
            xlinkHref: `${config.staticPrefix}/block_icon_code_light_on.svg`,
          },
        })
        this.set('warn', false)
      }
    })

    this.on('change:active', function (t, active) {
      active
        ? this.set('status', 'active')
        : this.set('status', '')
    })

    this.on('change:status', function (node, status) {
      var i = this.coaSettings.getBlockBorderColor()
      if (status === 'active') {
        i = this.coaSettings.strokeColors[status]
      } else if (this.errors > 0) {
        i = this.coaSettings.strokeColors.error
        node.attr({
          'g.error image': {
            'xlink:href': `${config.staticPrefix}/block_icon_error.svg`,
          },
        })
      }
      if (status === 'warn' || status === 'error') {
        node.attr('g.error/opacity', 1)
      } else {
        node.attr('g.error/opacity', 0)
      }
      node.attr('.background/stroke', i)
    })
  },

  getBlockName: function () {
    return this.get('title').toLowerCase()
  },
  getFunctionName: function () {
    return ''
  },
  getCallbackName: function () {
    return ''
  },
})

export const StartEndView = View.extend({
  initialize: function () {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    View.prototype.render.call(this, arguments)

    this.$el.addClass(this.model.get('blockType').toLowerCase())
  },
})
