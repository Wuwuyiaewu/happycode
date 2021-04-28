import request, { axios } from '@/utils/request'

import { httpUrl } from '@/config'
if (location.hostname.indexOf("uativmarket.ixmiddle.site") != -1 || location.hostname.indexOf("localhost") != -1) {
    axios.defaults.baseURL = " http://testapi.ixmiddle.com";//"http://52.194.161.93:20888";
} else if(location.hostname.indexOf("preivmarket.ixmiddle.site") != -1||location.hostname.indexOf("preixmiddle.ixmiddle.com") != -1||location.hostname.indexOf("prepcixmiddle.ixmiddle.site") != -1) {
    axios.defaults.baseURL = "https://preapi.axd-t.com/payapi"; //pre
}else{
     axios.defaults.baseURL = "https://api.dragonfly8.com:1315/payapi"; //prd
}
/**
 *  @name 用户资金接口
 **/

// 存款汇率
export function depositRate (data) {
    return request({
        url: '/account/front/deposit_currency_convert',
        method: 'post',
        data: {
            data
        }
    })
}

// 取款汇率
export function withdrawRate (data) {
    return request({
        url: '/account/front/withdraw_currency_convert',
        method: 'post',
        data: {
            data
        }
    })
}

// 账户入金申请
export async function depositApply (data, store) {
    await store.dispatch('sendUserRiskInfo', { type: 3 }) // 调用指纹采集接口
    return request({
        url: '/account/front/deposit/apply',
        method: 'post',
        data: {
            data
        }
    })
}
// 四要素认证接口
export async function userCustomerAuth (data) {
    return request({
        url: '/account/open/userCustomerAuth',
        method: 'post',
        data: {
            data
        }
    })
}
// iv 特殊账户入金申请
export async function ivDepositApply (data, store) {
    await store.dispatch('sendUserRiskInfo', { type: 3 }) // 调用指纹采集接口

    return axios({
        url: '/payment/pay?api_token=' + store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo.apiToken + '&open_id=' + store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo.openId,
        method: 'post',
        header: {},
        data: data
    })
}

// 账户出金申请
export function withAmountApi (data, store) {
    store.dispatch('sendUserRiskInfo', { type: 6 }) // 调用指纹采集接口

    return request({
        url: '/account/front/withdraw/apply',
        method: 'post',
        data: {
            data
        }
    })
}

// 获取支付渠道列表
export function getDepostChannelList (data) {
    return request({
        url: '/account/front/channel/list',
        method: 'post',
        data: {
            data
        }
    })
}
// 获取支付渠道列表 (新)
export function getDepostChannelListNew (data) {
    return request({
        url: '/pay/payment/channel/list',
        method: 'post',
        data: {
            data
        }
    })
}

// 入金明细查询
export function getDepositDetalis () {
    return '/account/front/deposit/list'
}

// 出金明细查询
export function getWithFuncDetalis () {
    return '/account/front/withdraw/list'
}

// 充值到账查询
export function getDepositOrder (data) {
    return request({
        url: '/account/front/deposit/status',
        method: 'post',
        data: {
            data
        }
    })
}

// 获取支付渠道配置
export function getDepostChannelConfig (data) {
    return axios.get(`${httpUrl}/json/pay/channelConfig.json`, {
        params: {
            timestamp: Date.now(),
        },
    })
}

// 开仓校验成功回调执行 更新用户开仓校验状态
export function verifySuccessCallback (data) {
    return request({
        url: '/account/open/captcha/verify',
        method: 'post',
        data
    })
}
//入金申请
export function paymentApply(data) {
    return request({
        url: '/pay/payment/apply',
        method: 'post',
        header: {},
        data: {
            data
        }
    })
}
