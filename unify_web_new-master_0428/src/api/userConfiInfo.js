import request from '@/utils/request'

/* 查询列表 */
export function getData (data) {
    return request({
        url: '/account/appProperties/getUserConfiInfo',
        method: 'post',
        data: {
            data
        }
    })
}
/* 修改 */
export function setData (data) {
    return request({
        url: '/account/appProperties/saveOrUpdateUserConfiInfo',
        method: 'post',
        data: {
            data
        }
    })
}
