import * as openAccount from '@/api/register.js'
import { i18n } from '@m/lang'

// 校验手机号
export const checkMobileIsExit = ({ isDemo = false, mobilePhone, mobilePhonePrefix }) => {
    const type = isDemo ? 'checkDemoMobileIsExit' : 'checkRealMobileIsExit'
    const params = {
        mobilePhone: mobilePhone,
        mobilePhonePrefix: mobilePhonePrefix
    }

    return openAccount[type](params)
        .then(result => {
            if (result && result.code === 1 && result.success) {
                // result.data为true表示账号已经存在
                return Promise.resolve(result.data)
            }
            return Promise.reject()
        })
        .catch(err => {
            return Promise.reject(err || i18n.t('registerInfo.phoneVerifyFailed'))
        })
}

// 校验邮箱
export const checkEmail = (value) => {
    return openAccount.checkEmail({
        email: value
    })
        .then(result => {
            if (result && result.code === 1 && result.success) {
                // result.data为true表示账号已经存在
                return Promise.resolve(result.data)
            }
            return Promise.reject()
        })
        .catch(err => {
            return Promise.reject(err || i18n.t('registerInfo.emailVerifyFailed')) // reject('电邮地址验证失败')
        })
}

// 校验验证码
export const checkVerifyRealCode = ({ checkCode, mobilePhone, email, mobilePhonePrefix, sendType, rules }) => {
    let msg = ''
    const params = {
        checkCode,
        sendType,
    }
    mobilePhonePrefix && (params['mobilePhonePrefix'] = mobilePhonePrefix)

    if (sendType === 'SMS') {
        params['mobilePhone'] = mobilePhone + ''
        msg = i18n.t('registerInfo.phoneCodeError')
    } else if (sendType === 'EMAIL') {
        params['email'] = email
        msg = i18n.t('registerInfo.emailCodeError')
    }

    return openAccount
        .checkVerifyRealCode(params)
        .then(result => {
            if (result.invalid() || !result.data) {
                return Promise.reject(result.errorMsg() || msg)
            }
        })
        .catch(err => {
            console.log('checkCode', err)
            return Promise.reject(err)
        })
}

// 校验身份证号
export const checkIdDocumentNumber = (value) => {
    return openAccount.checkIdDocumentNumber({
        idDocumentNumber: value
    })
        .then(result => {
            if (!result || result.code !== 1 || result.data) {
                return Promise.reject(i18n.t('registerInfo.idCardExist'))
            }
        })
        .catch(err => {
            console.log('checkCode', err)
            return Promise.reject(i18n.t('registerInfo.idCardVerifyFailed')) // reject('身份证验证失败')
        })
}
