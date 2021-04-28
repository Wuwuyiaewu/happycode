import request from '@/utils/request'

/* 查询消息总数 */
export function msgTotal (data) {
    return request({
        url: '/account/message/total',
        method: 'post',
        data: {
            data
        }
    })
}
/* 消息分类数据 */
export function msgTypeList (data) {
    return request({
        url: '/account/message/type',
        method: 'post',
        data: {
            data
        }
    })
}
/* 分页查询消息列表 */
export function msgPages (data) {
    return request({
        url: '/account/message/page',
        method: 'post',
        data: {
            data
        }
    })
}
/* 标记消息已读 */
export function msgSign (data) {
    return request({
        url: '/account/message/sign',
        method: 'post',
        data: {
            data
        }
    })
}
