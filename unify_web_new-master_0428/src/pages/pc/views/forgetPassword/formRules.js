import { i18n } from '@m/lang'
import * as checkFn from '@/api/register.js'
import { checkMobileIsExit, checkEmail, checkVerifyRealCode, checkIdDocumentNumber } from '@/utils/formValidator.js'
import { REGEXPDATA } from '@/utils/regExp'

export default {
    phone: [
        { required: true, message: i18n.t('phoneEmpty'), trigger: 'input' },
        { pattern: REGEXPDATA.phone, message: i18n.t('form.rule.phoneFormat'), trigger: 'change' },
        {
            validator: (rule, value) => {
                if (!value) return false
                var reg = /^(13|14|15|16|17|18|19)\d{9}$/
                return reg.test(value)
            },
            message: i18n.t('registerInfo.phoneError')
        },
        {
            asyncValidator: (rule, value, callback, source) => {
                const { isDemo, mobilePhonePrefix } = source
                checkMobileIsExit({ isDemo, mobilePhone: value, mobilePhonePrefix })
                    .then((bool) => {
                        if (!bool) {
                            callback(i18n.t('retMsg.A_LOGIN_ACCOUNT_ERRER'))
                        } else {
                            callback()
                        }
                    })
                    .catch((err) => callback(err))
            }
        },
    ],

    verifyCode: [
        { required: true, message: i18n.t('forgetInfo.enterCode'), trigger: 'input' },
    ],

    password: [
        { required: true, message: i18n.t('forgetInfo.enterNewPwd'), trigger: 'input' },
        { max: 16, message: i18n.t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'input' },
        { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: i18n.t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'change' }
    ],
    password1: [
        { required: true, message: i18n.t('forgetInfo.pwdConfirm'), trigger: 'input' },
        { max: 16, message: i18n.t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'input' },
        { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: i18n.t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'change' },
    ],

    email: [
        {
            validator: (rule, value) => {
                if (!value) return false
                var reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
                return reg.test(value)
            },
            message: i18n.t('registerInfo.emailError')
        },
        {
            asyncValidator: (rule, value, callback, source) => {
                console.log('checkEamil', source)
                return new Promise((resolve, reject) => {
                    const type = 'checkEmail'
                    checkFn[type]({
                        email: value
                    })
                        .then(result => {
                            if (result.code === 1 && result.data && result.success) resolve()
                            return reject(i18n.t('retMsg.A_LOGIN_ACCOUNT_ERRER'))
                        })
                        .catch(err => {
                            console.log('checkmobilePhone', err)
                            reject(i18n.t('registerInfo.phoneVerifyFailed'))
                        })
                })
            }
        }
    ]
}
