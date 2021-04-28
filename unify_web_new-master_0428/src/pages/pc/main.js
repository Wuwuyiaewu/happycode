import Vue from 'vue'
import { i18n } from '@m/lang'
import App from './App.vue'
import { apiHost } from '@/config'
// import 'vant/lib/icon/local.less'
import { localGet } from '@/utils/index'
import * as filters from '@/filters/index'
import router from '@pc/router/index'
import store from '@m/store/index'
import '@m/permission'
import VantBase from '@/utils/vantBase'
import Ad from '@m/modules/ad/index'
import Notification from '@pc/components/notification/index'
// import VTooltip from 'v-tooltip'
// import 'v-tooltip/dist/v-tooltip.css'
import Tooltip from '@pc/components/tooltip'
// 解决在桌面端无法操作组件
import '@vant/touch-emulator'
import { prophetPlugin } from '@/utils/prophet'

import socketBus from '@/utils/socketBus'
Vue.prototype.$notify = Notification
Vue.use(Tooltip, {
    // delay: 500,
    placement: 'left',
    class: 'tooltip-red',
    triggers: ['hover'],
    offset: 0
})
VantBase(Vue)
Vue.use(prophetPlugin)

const protocol = 'wss://'
const socketPath = localGet('useRealWSS') ? '/v/websocket' : '/websocket' // useRealWSS 有useRealWSS记录可以使用更优的websocket地址
Vue.use(socketBus, protocol + apiHost + socketPath, {
    store,
    router
})
// Vue.use(VTooltip,{
//     offset: -400,
// })
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$fundsCode = '0'
Vue.component('Ad', Ad)
// 数据埋点
/**
 * @param {String} actionName 事件名称
 * @param {Boolean} isFullName  true:直接统计actionName, false:统计事件名称为'页面名称_+actionName'
 */
const appKey = location.pathname.split('/')[1]
Vue.prototype._collect = function (actionName = '', isFullName = false) {
    let title = this.$route.meta.title
    try {
        title = this.$t(this.$route.meta.title)
    } catch (err) {
        console.log(err)
    }
    const name = isFullName ? actionName : `${title}_${actionName}`
    // console.log('_collect', name)
    if (typeof gtag === 'function') {
        gtag('event', name, {
            event_category: appKey,
            event_label: name + '_button',
            value: 1
        })
    }
}
const isDie = sessionStorage.getItem('isDie')
if (isDie) sessionStorage.removeItem('isDie')
window.addEventListener('storage', (ev) => {
    const isDie = sessionStorage.getItem('isDie')
    if (!isDie && ev.key === 'REMOVE_LOGIN_DATA') {
        window.localStorage.setItem('CALLBACK_REMOVE_LOGIN_DATA', Date.now())
    }
})

store.dispatch('genUserRiskInfo') // 生成指纹

const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

Vue.prototype.$bus = new Vue()
