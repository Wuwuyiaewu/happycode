import { httpUrl } from '@/config'
import request from '@/utils/request'
import axios from 'axios'

export function loadHTML (data) {
    return request({
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        url: '/api/html/load',
        // method: 'get',
        params: data
    }).then(res => {
        return res
    })
}

// 获取APP配置信息
export function getAppProperties () {
    return request({
        url: '/account/appProperties/getAppProperties',
        method: 'post',
        data: {}
    })
}

/* 获取已平仓列表 */
export function tradeInfo (data) {
    return request({
        url: '/account/api/tradeInfo',
        method: 'post',
        data: {
            data
        }
    })
}
/* 更新密码 */
export function updatePassword (data) {
    return request({
        url: '/account/api/updatePassword',
        method: 'post',
        data: {
            data
        }
    })
}
/* 真实开模拟 */
export function openDemoByReal (data) {
    return request({
        url: '/account/api/openDemoByReal',
        method: 'post',
        data: {
            data
        }
    })
}

/* 根据token获取账号登录信息 */
export function getRgsLoginInfo (data = {}) {
    return request({
        url: '/account/appProperties/getRgsLoginInfo',
        method: 'post',
        data: {
            data
        }
    })
}

/* 根据产品id获取产品详情 */
export function getProductInfo (data) {
    return request({
        url: '/account/market/getSymbolById',
        method: 'post',
        data: {
            data: {
                id: Number(data)
            }
        }
    })
}

/* 获取客户资料审核状态 */
export function userStatus (data) {
    return request({
        url: '/account/front/userStatus',
        method: 'post',
        data: {
            data
        }
    })
}

/* 资金明细查询 */
export function accountCapitalList (data) {
    return request({
        url: '/account/front/accountCapitalList',
        method: 'post',
        data: { data }
    })
}

/* 业务方自定义配置 */
export function customConfig (data) {
    return axios.get('/customConfig.json', {
        params: {
            timestamp: Date.now(),
        },
    }).then(res => {
        return res.data
    })
}

/* 中文乱码测试接口 */
export function testDecode (data) {
    return request({
        url: '/account/front/test/decode',
        method: 'post',
        data: { data }
    })
}

/* 同浏览器下关联不同账号 */
export function relateCustomerNumber (data) {
    return request({
        url: '/account/open/relateCustomerNumber',
        method: 'post',
        data: { data },
        hideError: true
    })
}

/* 上传指纹 */
export function userRiskInfo (data) {
    return request({
        url: '/account/open/userRiskInfo',
        method: 'post',
        data: { data },
        hideError: true
    })
}

/* 记录用户所用手机的设备号 */
export function saveImei (data) {
    return request({
        url: '/account/open/mobile/imei',
        method: 'post',
        data: { data },
        hideError: true
    })
}

// 获取是否在维护中的配置数据
export function configSystem () {
    return axios.get(`${httpUrl}/json/configSystem.json`, {
        params: {
            timestamp: Date.now()
        }
    }).then(res => res.data)
}
