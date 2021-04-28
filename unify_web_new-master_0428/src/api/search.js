import request from '@/utils/request'
/* 获取产品搜索 */
export function getSearchRecord (data = {}) {
    return request({
        url: '/account/front/productSearch',
        method: 'post',
        data: {
            data
        }
    })
}
