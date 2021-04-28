import request from '@/utils/funds/requestFund'
// 文件上传接口
export function uploadUrl (data) {
    return request({
        url: '/base/upload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data,
        upload: true
    })
}
