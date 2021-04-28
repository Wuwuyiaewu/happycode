import axios from 'axios'
const _key = 'qazxsw888!@#123QAZXSW'
/* 上传开户数据 */
export function receive (data) {
    return axios.request({
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        url: '/apidata/receive',
        method: 'post',
        data: data
    })
}
export const mc888Key = _key
