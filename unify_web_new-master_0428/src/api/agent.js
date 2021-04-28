import request from '@/utils/request'

// 查询用户代理信息
export function agentUserFind (data) {
    return request({
        url: '/account/third/agent/user/find',
        method: 'post',
        headers: {
            module: 'uat-agent'
        },
        data: {
            data
        }
    })
}

/* 还款统计接口 */
export function agentRepayStatic (data) {
    return request({
        url: '/account/third/agent/repay/static',
        method: 'post',
        headers: {
            module: 'uat-agent'
        },
        data: {
            data
        }
    })
}
