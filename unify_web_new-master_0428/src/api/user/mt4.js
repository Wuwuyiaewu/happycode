import request from '@/utils/request'
// 账户入金申请
export function depositApply (data) {
    return request({
        url: '/account/front/deposit/mt4/apply',
        method: 'post',
        data: {
            data
        }
    })
}
// 账户出金申请
export function withAmountApi (data) {
    return request({
        url: '/account/front/withdraw/mt4/apply',
        method: 'post',
        data: {
            data
        }
    })
}
// 获取账户可提款金额
export function getWithAmountApi (data) {
    return request({
        url: '/account/front/mt4/getWithdrawAmount',
        method: 'post',
        data: { data: data }
    })
}
