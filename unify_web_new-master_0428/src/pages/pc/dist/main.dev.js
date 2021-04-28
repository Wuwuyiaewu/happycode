'use strict'

function _typeof (obj) { if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

var _vue = _interopRequireDefault(require('vue'))

var _lang = require('@m/lang')

var _App = _interopRequireDefault(require('./App.vue'))

var _index = require('@/utils/index')

var filters = _interopRequireWildcard(require('@/filters/index'))

var _index3 = _interopRequireDefault(require('@pc/router/index'))

var _index4 = _interopRequireDefault(require('@pc/store/index'))

var _vantBase = _interopRequireDefault(require('@/utils/vantBase'))

var _index5 = _interopRequireDefault(require('@m/modules/ad/index'))

require('@vant/touch-emulator')

var _socketBus = _interopRequireDefault(require('@/utils/socketBus'))

function _getRequireWildcardCache () { if (typeof WeakMap !== 'function') return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache () { return cache }; return cache }

function _interopRequireWildcard (obj) { if (obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { 'default': obj } } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj) } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj['default'] = obj; if (cache) { cache.set(obj, newObj) } return newObj }

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

// import 'vant/lib/icon/local.less'
// 解决在桌面端无法操作组件
(0, _vantBase['default'])(_vue['default'])
var socketUrl = window['socketUrl'] || location.host
var protocol = 'wss://'
var socketPath = (0, _index.localGet)('useRealWSS') ? '/v/websocket' : '/websocket' // useRealWSS 有useRealWSS记录可以使用更优的websocket地址

_vue['default'].use(_socketBus['default'], protocol + socketUrl + socketPath, {
    store: _index4['default'],
    router: _index3['default']
})

Object.keys(filters).forEach(function (key) {
    _vue['default'].filter(key, filters[key])
})
_vue['default'].config.productionTip = false
_vue['default'].prototype.$fundsCode = '0'

_vue['default'].component('Ad', _index5['default']) // 数据埋点

/**
 * @param {String} actionName 事件名称
 * @param {Boolean} isFullName  true:直接统计actionName, false:统计事件名称为'页面名称_+actionName'
 */

var appKey = location.pathname.split('/')[1]

_vue['default'].prototype._collect = function () {
    var actionName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
    var isFullName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
    var title = this.$route.meta.title

    try {
        title = this.$t(this.$route.meta.title)
    } catch (err) {
        console.log(err)
    }

    var name = isFullName ? actionName : ''.concat(title, '_').concat(actionName) // console.log('_collect', name)

    if (typeof gtag === 'function') {
        gtag('event', name, {
            event_category: appKey,
            event_label: name + '_button',
            value: 1
        })
    }
}

var app = new _vue['default']({
    router: _index3['default'],
    store: _index4['default'],
    i18n: _lang.i18n,
    render: function render (h) {
        return h(_App['default'])
    }
}).$mount('#app')
_vue['default'].prototype.$bus = new _vue['default']()
