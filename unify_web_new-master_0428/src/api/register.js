import request from '@/utils/request'

// 开户(真实账号)
export function openRealAccount (data = {}) {
    let url = '/account/open/openRealAccount'
    if (data.bindRealAccount) { // 模拟绑定真实账号
        url = '/account/open/realGoldExperienceAccountBandReal'
        delete data.bindRealAccount
    }
    return request({
        url: url,
        method: 'post',
        data: {
            data
        }
    })
}
// 开户(模拟账号)
export function openDemoAccount (data = {}) {
    return request({
        url: '/account/open/openDemoAccount',
        method: 'post',
        data: {
            data
        }
    })
}
// 补充真实资料开户
export function openRealAccountByUuid (data = {}) {
    return request({
        url: '/account/open/openRealAccountByUuid',
        method: 'post',
        data: {
            data
        }
    })
}
// 验证手机号是否存在(真实账号)
export function checkRealMobileIsExit (data = {}) {
    return request({
        url: '/account/open/checkRealMobileIsExit',
        method: 'post',
        data: {
            data
        }
    })
}
// 验证手机号是否存在(模拟账号)
export function checkDemoMobileIsExit (data = {}) {
    return request({
        url: '/account/open/checkDemoMobileIsExit',
        method: 'post',
        data: {
            data
        }
    })
}
// 发送验证码（真实账号）
export function sendVerifyRealCode (data = {}) {
    return request({
        url: '/account/open/sendVerifyRealCode',
        method: 'post',
        data: {
            data
        }
    })
}
// 发送验证码（模拟账号）
export function sendVerifyDemoCode (data = {}) {
    return request({
        url: '/account/open/sendVerifyDemoCode',
        method: 'post',
        data: {
            data
        }
    })
}

// 验证验证码（真实账号）
export function checkVerifyRealCode (data = {}) {
    return request({
        url: '/account/open/checkVerifyRealCode',
        method: 'post',
        data: {
            data
        }
    })
}
// 验证验证码（真实账号）
export function checkVerifyDemoCode (data = {}) {
    return request({
        url: '/account/open/checkVerifyDemoCode',
        method: 'post',
        data: {
            data
        }
    })
}

// 验证身份证
export function checkIdDocumentNumber (data = {}) {
    return request({
        url: '/account/open/checkIdDocumentNumber',
        method: 'post',
        data: {
            data
        }
    })
}
// 验证邮箱
export function checkEmail (data = {}) {
    return request({
        url: '/account/open/checkEmail',
        method: 'post',
        data: {
            data
        }
    })
}

/* 查询手机号的归属地 */
export function getMobileDistrict (data) {
    return new Promise(resolve => {
        request({
            url: '/account/front/getMobileDistrict',
            method: 'post',
            data: { data },
            hideError: true
        }).then(resolve).catch(err => {
            console.log(err)
            resolve(false)
        })
    })
}
/* 查询IP归属地 */
export function getClientIpDistrict (data) {
    return new Promise(resolve => {
        request({
            url: '/account/front/getClientIpDistrict',
            method: 'post',
            data: { data },
            hideError: true
        }).then(resolve).catch(err => {
            console.log(err)
            resolve(false)
        })
    })
}
