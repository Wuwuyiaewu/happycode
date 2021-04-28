import request from '@/utils/request'
import { appLoginInfo, isAPP } from '@m/base/appHybrid'
import { keyInUrlPath } from '@/utils/index'
export function login (data = {}) {
    const notLinkWs = keyInUrlPath()
    if (isAPP && notLinkWs) {
        return new Promise((resolve, reject) => {
            appLoginInfo()
                .then(res => {
                    const resData = res || {}
                    window.authorization = resData.authorization
                    window['UserLoginInfoRet'] = {}
                    sessionStorage.setItem('authorization__' + window.htmlKey, resData.authorization)
                    resolve({
                        code: 1,
                        data: resData
                    })
                })
                .catch(error => {
                    resolve({ code: 1 })
                })
        })
    } else {
        return request({
            url: '/account/appProperties/getAccountProperties',
            method: 'post',
            data: {
                data
            }
        })
    }
}
/* 获取语言包配置文件 */
export function getLanageContent (data = {}) {
    return request({
        url: '/account/appProperties/getLanageContent',
        method: 'post',
        data: {
            data
        }
    })
}

// 验证登录验证码接口
export function checkLoginVerifyCode (data = {}) {
    return request({
        url: '/account/open/checkLoginVerifyCode',
        method: 'post',
        data: {
            data
        }
    })
}
