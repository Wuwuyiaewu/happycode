import request from '@/utils/request_ims'
import CryptoJS from 'crypto-js'

/* 用户获取活动余额上限和客户待领取金额 */
export function getAccPriceInfo (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/accPriceInfo',
        method: 'post',
        data: data
    })
}
/* 用户是否参加活动 */
export function getJoinResult (data = {}) {
    const _data = Object.assign({}, data)
    if (_data.accountNo) {
        const encryptedData = CryptoJS.AES.encrypt(_data.accountNo, CryptoJS.enc.Utf8.parse('GTSAPP123457890a'), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        _data.key = encryptedData.ciphertext.toString()
    }

    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/getJoinResult',
        method: 'post',
        data: _data
    })
}
/* 获取待领取赠金列表 */
export function getPendingBounsList (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/priceRecordList',
        method: 'post',
        data: data
    })
}
/* 获取待领取赠金 */
export function getPriceRecordReady (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/priceRecordReady',
        method: 'post',
        data: data
    })
}

/* 超出余额上限，重置余额 */
export function resetmaxAmountToAccount (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/resetmaxAmountToAccount',
        method: 'post',
        data: data
    })
}

/* 生成提案 */
export function addBonusFlowRecords (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/addBonusFlowRecords',
        method: 'post',
        data: data
    })
}
/* 重置账户接口 */
export function resetAccount (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/resetAccount',
        method: 'post',
        data: data
    })
}
/* 确认认领赠金待发放流水 */
export function acceptPriceRecordReady (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/acceptPriceRecordReady',
        method: 'post',
        data: data
    })
}
/* 确认认领赠金待发放流水 */
export function cancelPriceRecordReady (data = {}) {
    return request({
        url: '/unify-activity/act/ix/newCustBonusAcc/cancelPriceRecordReady',
        method: 'post',
        data: data
    })
}

/* 获取用户手机号归属地 */
export function getPhoneBelongs (data = {}) {
    return request({
        url: '/unify-activity/act/ix/phone/district/check',
        method: 'post',
        params: data,
        timeout: 5000,
        hideError: true
    })
}
