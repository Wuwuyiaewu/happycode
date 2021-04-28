import { i18n } from '@m/lang'
import { Toast, Dialog } from 'vant'
export default class CheckAPI {
    constructor (data) {
        Object.assign(this, data)
    }

    // 检查接口是否正常
    check () {
        return parseInt(this.code) === 0
    }

    // 检查接口是否异常
    invalid () {
        return parseInt(this.code) !== 0
    }

    // 获取错误信息
    errorMsg () {
        const msg = this.msg || this.errMsg || this.message
        // if (i18n.te('retMsg.' + this.msgCode)) {
        //     msg = i18n.t('retMsg.' + this.msgCode)
        // }
        return msg
    }

    // toast提示错误信息
    toast () {
        const msg = this.errorMsg()
        Toast(msg)
    }

    // alert提示错误信息
    alert () {
        const msg = this.errorMsg()
        return Dialog.alert({
            title: i18n.t('tip'),
            message: msg,
            confirmButtonText: i18n.t('compLang.OK'),
        })
    }
}
