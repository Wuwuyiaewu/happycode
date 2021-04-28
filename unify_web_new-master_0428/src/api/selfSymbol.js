import request from '@/utils/request'

/* 查询列表 */
export function list (data) {
    return request({
        url: '/account/selfSymbol/list',
        method: 'post',
        data: {
            data
        }
    })
}
/* 添加 */
export function add (data) {
    return request({
        url: '/account/selfSymbol/addSelfSymbol',
        method: 'post',
        data: {
            data
        }
    })
}
/* 删除 */
export function del (data) {
    return request({
        url: '/account/selfSymbol/deleteSelfSymbol',
        method: 'post',
        data: {
            data
        }
    })
}
