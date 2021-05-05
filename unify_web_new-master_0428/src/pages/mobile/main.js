import Vue from 'vue'
import {
    i18n
} from '@m/lang'
import App from './App.vue'

// import 'vant/lib/icon/local.less'
import {
    apiHost
} from '@/config'
import {
    localGet
} from '@/utils/index'
import * as filters from '@/filters/index'
import router from '@m/router/index'
import Ad from '@m/modules/ad/index'
import store from '@m/store/index'
import '@m/permission'
import VantBase from '@/utils/vantBase'
import { prophetPlugin } from '@/utils/prophet'
import socketBus from '@/utils/socketBus'
VantBase(Vue)
const protocol = location.protocol === 'https:' ? 'wss://' : 'wss://'
const socketPath = localGet('useRealWSS') ? '/v/websocket' : '/websocket' // useRealWSS 有useRealWSS记录可以使用更优的websocket地址
Vue.use(socketBus, protocol + apiHost + socketPath, {
    store,
    router
})
Vue.use(prophetPlugin)
Vue.config.devtools = true
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
    // debugger
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

store.dispatch('genUserRiskInfo') // 生成指纹

const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

Vue.prototype.$bus = new Vue()
