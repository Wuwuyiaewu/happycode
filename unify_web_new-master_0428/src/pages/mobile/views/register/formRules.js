import { isEnglishAndChinese, checkCardIDFormat } from '@/utils/examine.js'
import { i18n } from '@m/lang'
import { checkMobileIsExit, checkEmail, checkVerifyRealCode, checkIdDocumentNumber } from '@/utils/formValidator.js'
import { REGEXPDATA } from '@/utils/regExp'

export const formRules = {
    chineseName: [
        {
            validator: (rule, value, callback) => {
                if (!value) {
                    return callback(rule.message)
                }
                // 姓名字母正则表达式
                var reg = /(^[\u4e00-\u9fa5\s]+$)|(^[A-z\s]+$)/
                if (!reg.test(value)) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.nameMustBeENCH'),
            trigger: 'change'
        }
    ],
    mobilePhone: [
        {
            validator: (rule, value, callback, source) => {
                const { mobilePhonePrefix } = source
                if (!value) return false
                var reg = REGEXPDATA.phone
                if (!reg.test(value) && mobilePhonePrefix === '86') {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.phoneError'),
            trigger: 'input'
        },
        {
            asyncValidator: (rule, value, callback, source) => {
                const { isDemo, mobilePhonePrefix, hasRegisteredTip } = source
                checkMobileIsExit({ isDemo, mobilePhone: value, mobilePhonePrefix })
                    .then((bool) => {
                        if (bool) {
                            callback(hasRegisteredTip || i18n.t('registerInfo.phoneExist'))
                        } else {
                            callback()
                        }
                    })
                    .catch((err) => callback(err))
            }
        }
    ],
    // 邮箱
    email: [
        {
            validator: (rule, value, callback) => {
                var reg = new RegExp("^['_A-Za-z0-9-]+(\\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\\.[a-zA-Z]+)*((\\.[a-zA-Z\\.]{2,}))$")
                if (!reg.test(value)) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.emailError'),
            trigger: 'change'
        },
        {
            asyncValidator: (rule, value, callback) => {
                checkEmail(value)
                    .then((bool) => {
                        if (bool) {
                            callback(i18n.t('registerInfo.emailExist'))
                        } else {
                            callback()
                        }
                    })
                    .catch(err => callback(err))
            }
        }
    ],
    // 身份证号码
    idCardNo: [
        {
            validator: (rule, value, callback) => {
                if (!value || !checkCardIDFormat(value)) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.idCardError'),
            trigger: 'change'
        },
        {
            validator: (rule, value, callback) => {
                const idNum_year = value.slice(6, 10)
                const idNum_month = value.slice(10, 12)
                const idNum_date = value.slice(12, 14)
                const idNum_time = new Date(idNum_year * 1 + 18, idNum_month - 1, idNum_date).getTime()
                if (idNum_time >= Date.now()) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.idCardAgeError'), // idCardAgeError '应监管要求，未满18岁禁止开立账号！'
            trigger: 'change'
        },
        {
            asyncValidator: (rule, value, callback) => {
                checkIdDocumentNumber(value)
                    .then(() => callback())
                    .catch(err => callback(err))
            },
        }
    ],
    // 验证码
    checkCode: [
        {
            asyncValidator: (rule, value, callback, source) => {
                const { checkCode, mobilePhone, email, mobilePhonePrefix, sendType, rules } = source
                checkVerifyRealCode({ checkCode, mobilePhone, email, mobilePhonePrefix, sendType, rules })
                    .then(() => callback())
                    .catch((err) => callback(err))
            }
        }
    ],
    // 密码
    passWord: [
        {
            validator: (rule, value, callback) => {
                if (!value || value.length < 6 || value.length > 16 || isEnglishAndChinese(value)) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.pwdError'),
            trigger: 'change'
        }
    ],
    // 协议
    protocol: [
        {
            validator: (rule, value, callback) => {
                if (!value) {
                    callback(rule.message)
                } else {
                    callback()
                }
            },
            message: i18n.t('registerInfo.protocolError'), // '请先阅读并同意开户协议'
            trigger: 'input'
        }
    ]
}
