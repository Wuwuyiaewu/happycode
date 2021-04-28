
export function getMobileBrand () {
    //   debugger
    const sUserAgent = navigator.userAgent.toLowerCase()
    var isIphone = sUserAgent.match(/iphone/i) == 'iphone'
    var isHuawei = sUserAgent.match(/huawei/i) == 'huawei'
    var isHonor = sUserAgent.match(/honor/i) == 'honor'
    var isOppo = sUserAgent.match(/oppo/i) == 'oppo'
    var isOppoR15 = sUserAgent.match(/pacm00/i) == 'pacm00'
    var isVivo = sUserAgent.match(/vivo/i) == 'vivo'
    var isXiaomi = sUserAgent.match(/mi\s/i) == 'mi '
    var isXiaomi2s = sUserAgent.match(/mix\s/i) == 'mix '
    var isRedmi = sUserAgent.match(/redmi/i) == 'redmi'
    var isSamsung = sUserAgent.match(/sm-/i) == 'sm-'

    if (isIphone) {
        return 'iphone'
    } else if (isHuawei || isHonor) {
        return 'huawei'
    } else if (isOppo || isOppoR15) {
        return 'oppo'
    } else if (isVivo) {
        return 'vivo'
    } else if (isXiaomi || isRedmi || isXiaomi2s) {
        return 'xiaomi'
    } else if (isSamsung) {
        return 'samsung'
    } else {
        return 'default'
    }
}
