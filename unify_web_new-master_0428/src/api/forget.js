import request from '@/utils/request'

/**
 * @description: 获取账号信息（手机号、账号）
 * @param {accountOrPhone} 手机号、账号
 * @param {code} 图片验证码
 * @return:
 */
export function getAccountInfo (data = {}) {
    return request({
        url: '/account/open/getaccinfomation',
        method: 'post',
        data: {
            data
        }
    })
}

/**
 * @description: 重置验证短信邮件
 * @param {channel} S 手机号 E 邮箱
 * @param {customerNumber} 账号
 * @param {type} 类型 手机、邮箱
 * @param {email} 邮箱
 * @param {mobilePhone} 手机号
 * @return:
 */
export function resetValidate (data = {}) {
    return request({
        url: '/account/open/resetVerCode',
        method: 'post',
        data: {
            data
        }
    })
}

/**
 * @description: 验证手机、邮箱验证码
 * @param {checkCode} 手机、邮箱验证码
 * @param {customerNumber} 账号
 * @param {type} 账号类型demo real
 * @return:
 */
export function checkReceive (data = {}) {
    return request({
        url: '/account/open/checkResetPwd',
        method: 'post',
        data: {
            data
        }
    })
}

/**
 * @description: 重置密码
 * @param {channel} 手机号 E 邮箱 S
 * @param {customerNumber} 账号
 * @param {type} 类型 demo/real
 * @return:
 */
export function resetPassword (data = {}) {
    return request({
        url: '/account/open/resetPwd',
        method: 'post',
        data: {
            data
        }
    })
}
