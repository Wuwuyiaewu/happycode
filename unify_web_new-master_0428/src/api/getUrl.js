import request from '@/utils/request'

/* 获取入金地址 */
export function deposit (data) {
    return request({
        headers: {
            module: 'uat-pay'
        },
        url: '/pay/fundDepositOnline',
        method: 'post',
        data: {
            data
        }
    })
}
/* 获取取款地址 */
export function drawings (data) {
    return request({
        headers: {
            module: 'uat-pay'
        },
        url: '/pay/fundDrawings',
        method: 'post',
        data: {
            data
        }
    })
}
export function userinfo (data) {
    return request({
        headers: {
            module: 'uat-pay'
        },
        url: '/pay/user/userSelfInfo',
        method: 'post',
        data: {
            data
        }
    })
}
