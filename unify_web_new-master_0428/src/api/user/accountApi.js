/**
 *  @name 用户账户接口
 **/

import request from '@/utils/request'

// 获取用户信息
export function getUserInfo (data) {
    return request({
        url: '/account/front/user/info',
        method: 'post',
        data: {
            data
        }
    })
}

// 用户资料修改
export function modifyUserInfo (data) {
    return request({
        // url: '/user/modify',
        url: '/account/front/modifyUserInfo',
        method: 'post',
        data: { data: data }
    })
}

// 获取账户可提款金额
export function getWithAmountApi (data) {
    if (data.platform === 'mt4') {
        return MT4WithAmountApi(data)
    }
    return request({
        url: '/account/front/getWithdrawAmount',
        method: 'post',
        data: { data: data }
    })
}

// MT4获取账户可提款金额
export function MT4WithAmountApi (data) {
    return request({
        url: '/account/front/mt4/getWithdrawAmount',
        method: 'post',
        data: { data: data }
    })
}

/* 查询用户是否为MT4账户 */
export function boolMt4Account (data = {}) {
    return request({
        url: '/account/open/boolMt4Account',
        method: 'post',
        data: { data }
    })
}

// 获取用户操作权限
export function getUserAuthority (data) {
    return request({
        url: '/account/front/authority/status',
        method: 'post',
        data: { data: data }
    })
}
// 获取用户活动查询列表接口
export function getUserStatLimit () {
    return request({
        url: '/account/front/stat/limit',
        method: 'post',
        data: {
            data: {}
        }
    })
}
// 获取公司支持汇率币种
export function getCompanyCurrencys () {
    return request({
        url: '/account/front/company/exchange/rate',
        method: 'post',
        data: {
            data: {}
        }
    })
}
// 自动生成提样账户data
export function openRealGoldExperienceAccount (data) {
    return request({
        url: '/account/open/openRealGoldExperienceAccount',
        method: 'post',
        data: {
            data
        }
    })
}
