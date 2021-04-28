// 防抖
import { getUserInfo } from '@/utils/funds/auth'
import { FILE_TYPE } from '@/utils/funds/constant'
import dayjs from 'dayjs'
import { appClose } from '@m/base/appHybrid'

const UA = navigator.userAgent
export const isAndroid = /android|adr/gi.test(UA)
export const isIos = /iphone|ipod|ipad/gi.test(UA)
export const toStockMmarket = function (id) {
    if (isIos) {
        window.webkit.messageHandlers.ixMarketPage.postMessage({ functionName: 'appSymbolDetail', data: id })
    }
    if (isAndroid) {
        window.IxJsHook.appSymbolDetail(Number(id))
    }
}

// 是否在APP内打开
export const isAPP = (function () {
    if (sessionStorage.getItem('isAPP')) {
        return true
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        return true
    } else {
        return false
    }
})()

// 是否在壳包内打开
export const isFakeAPP = (function () {
    if (isAPP) {
        return false
    } else if (window.UIObject && UIObject.appOpenBrower) {
        return true
    } else if (window.JsHook && JsHook.appOpenBrower) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        return true
    } else {
        return false
    }
})()

export function debounce (func, delay) {
    let timer
    return function (e) {
        clearTimeout(timer)
        const self = this
        const args = arguments

        timer = setTimeout(function () {
            func.apply(self, args)
        }, delay)
    }
}

// 封装用户资料参数
export function getUserInfoParams () {
    const userInfo = getUserInfo()
    const customerInfoFiles = userInfo.customer_info_files
    let id_url1 = ''
    let id_url2 = ''
    customerInfoFiles &&
        customerInfoFiles.forEach(item => {
            if (item.file_type === FILE_TYPE.FILE_TYPE_IDCARD_FRONT) {
                id_url1 = item.ftp_file_path
            }
            if (item.file_type === FILE_TYPE.FILE_TYPE_IDCARD_BACK) {
                id_url2 = item.ftp_file_path
            }
        })

    const status = userInfo.id_document_status
    const params = {
        name: userInfo.chinese_name || '',
        user_icon_url: userInfo.user_icon_url,
        mobile: userInfo.mobile_phone || '',
        email: userInfo.email || '',
        address: userInfo.address || '',
        postal_code: userInfo.postal_code || '',
        // national_code: 'ISO_3166_156',
        province_code: userInfo.province || '',
        province_name: userInfo.province_name || '',
        city_code: userInfo.city || '',
        city_name: userInfo.city_name || '',
        cert: {
            id: userInfo.id_document_number || '', // 身份证号码
            id_type: 'identity card',
            id_url1: id_url1,
            id_url2: id_url2
        }
    }
    const nameArr = params.name.split('.')
    if (nameArr.length === 2) nameArr.splice(1, 0, '')
    if (nameArr.length > 2) {
        params.firstname = nameArr[0]
        params.middlename = nameArr[1] && nameArr[1] !== 'undefined' ? nameArr[1] : ''
        params.surname = nameArr[2]
        params.idType = userInfo.id_document
        params.idCode = userInfo.id_document_number || ''
    }
    console.log('params', params)
    // if (Number(status) === -6) {
    //     // 不是审核通过，个人数据清空
    //     params.name = ''
    //     params.email = ''
    //     params.address = ''
    //     params.province_code = ''
    //     params.province_name = ''
    //     params.city_code = ''
    //     params.city_name = ''
    //     params.cert = {
    //         id: '',
    //         id_url1: '',
    //         id_url2: ''
    //     }
    // }
    return params
}

// 上传图片获取错误的编码
export function uploadError (code) {
    let m = ''
    switch (code) {
    case '100':
        m = '浏览器不支持'
        break
    case '101':
        m = '图片大小超出预设'
        break
    case '102':
        m = '图片读取失败'
        break
    case '103':
        m = '图片数量超出限制'
        break
    default:
        m = '上传图片出错'
    }
    return m
}

// 城市和省份数据转换
export function provinceAndCityFormatData (data, language) {
    const langMap = {
        'zh-CN': 'zh_cn',
        'en-US': 'zh_en',
    }
    const lang_code = langMap[language] || 'zh_cn'
    const list = data.map(item => {
        let msg = ''
        item.lang &&
            item.lang.forEach(aaa => {
                if (aaa.lang_code === lang_code) {
                    msg = aaa.lang_name
                }
            })
        return {
            text: msg,
            value: item.code,
            id: item.id
        }
    })

    return list
}

/**
 * 计算是否休市
 *
 * @param {array} schedule 股市交易时间段
 * @param {number} currentTime 实时时间(毫秒)
 * @returns {bool} 休市-false, 开市-true
 */
export function computendSchedule (schedule = [], currentTime) {
    if (!currentTime) {
        return false
    }
    if (schedule === null) {
        schedule = []
    }
    // 获取当前时间数据
    const momentTime = dayjs.utc(currentTime)
    const currentDay = momentTime.day()
    const time = momentTime.hour() + (momentTime.minute() / 60).toFixed(2) * 1
    // 获取股市对应交易时间段
    const scheduleTimes = schedule.filter(item => item.day_of_week === currentDay)

    const result = scheduleTimes.some(item => {
        const startTimeH = item.start_time / 60
        const endTimeH = item.end_time / 60
        if (time >= startTimeH && time < endTimeH) {
            return true
        }
        return false
    })
    return result
}

/**
 *
 * 计算成交量-股数/手数
 * @export
 * @param {*} val 数量
 * @param {*} marketId 市场
 * @param {*} displayUnit 显示单位：true;隐藏单位：false
 * @returns
 */
export function formatVolume (val, marketId, displayUnit) {
    if (!val) {
        return '- -'
    }
    // 成交量默认显示为股、万股，注：除以10000为股
    // A股需显示为手、万手，注：除以10000后为股，再除以100为手

    let num = val / 10000 // 股
    let unit = '股'
    let prefix = ''
    let unitPrefix = ''
    if (marketId === 0 || marketId === 1) {
        // A股处理
        num = num / 100
        unit = '手'
    }

    if (num / 10000 > 1) {
        num = num / 10000
        prefix = '万'
        if (num / 10000 > 1) {
            num = num / 10000
            prefix = '亿'
        }
    }
    unitPrefix = displayUnit ? prefix + unit : ''
    num = num.toFixed(3)
    return num + unitPrefix
}

// 计算买卖五档的成交量
export function formatTickVolume (val, market_id) {
    if (!val) {
        return ''
    }
    let num = val / 10000
    let unit = ''
    if (market_id === 0 || market_id === 1) {
        // A股处理
        num = num / 100
    }

    if (num / 1000 > 1) {
        num = num / 1000
        unit = 'K'
        if (num / 1000 > 1) {
            num = num / 1000
            unit = 'M'
        }
    }
    num = num.toFixed(1) * 1
    return num + unit
}

// 数字四舍五入
export function NumFixed (val, digit = 0) {
    let result = val * 1
    if (typeof val === 'number') {
        result = result.toFixed(digit)
    }

    return result
}

/**
 * 判断浏览器
 *
 * @export
 * @returns 浏览器/设备信息 {browser: '', os: '', device: ''}
 */
export function getBrowserInfo () {
    const u = navigator.userAgent
    const match = {
        UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
        Baidu: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1 || u.indexOf('baiduboxapp') > -1,
        Safari: u.indexOf('Safari') > -1,
        Huawei: u.indexOf('Build/HUAWEI') > -1,
        XiaoMi: u.indexOf('MiuiBrowser') > -1,
        // 设备
        Mobile: u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
        IOS: u.indexOf('like Mac OS X') > -1,
        Android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    }

    // 修正
    if (match['Mobile']) {
        match['Mobile'] = !(u.indexOf('iPad') > -1)
    }
    if (match['Baidu'] && match['Opera']) {
        match['Baidu'] = false
    } else if (!match['IOS']) {
        match['Safari'] = false
    }

    const hash = {
        browser: ['UC', 'Baidu', 'Huawei', 'XiaoMi', 'Safari'],
        os: ['Android', 'IOS'],
        device: ['Mobile']
    }

    const result = {}

    Object.keys(hash).forEach(key => {
        let temp = ''
        hash[key].some(val => {
            if (match[val]) {
                temp = val
                return true
            }
        })
        result[key] = temp
    })
    return result
}

export function uuid () {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
}
/**
 *  获取url参数
 *
 * @export
 * @param {string} [character='&'] url路径和参数分割符
 * @param {string} [objChart='='] 参数key-value的分割符
 * @returns {object} 所有参数
 */
export function getQuery (_search = location.search, character = '&', objChart = '=') {
    ; /([^?]+)/.test(decodeURIComponent(_search))

    const result = RegExp.$1
        .split(character)
        .map(str => {
            const [key, val] = str.split(objChart)
            return {
                [key]: val
            }
        })
        .reduce((result, cur) => {
            Object.assign(result, cur)
            return result
        }, {})

    return result
}

// 判断Safari
export function isSafari () {
    const u = navigator.userAgent
    return u.indexOf('Safari') > -1 && u.indexOf('Chrome') === -1 // 判断是否Safari浏览器
}

// 打开外部浏览器
export function appOpenBrower (dlUrl, isBlank = false) {
    if (!dlUrl) return alert('请提供下载地址')
    try {
        if (window.UIObject && UIObject.appOpenBrower) {
            // 站点的方法
            UIObject.appOpenBrower(dlUrl)
        } else if (window.JsHook && JsHook.appOpenBrower) {
            // 万年历的方法
            JsHook.appOpenBrower(dlUrl)
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
            window.webkit.messageHandlers.appOpenBrower.postMessage({
                url: dlUrl
            })
        } else {
            if (isBlank) {
                window.open(dlUrl, '_blank')
            } else {
                if (window['isPC'] && !isSafari()) {
                    window.open(dlUrl, '_blank')
                } else {
                    top.location.href = dlUrl
                }
            }
            // window.open(dlUrl)
        }
    } catch (err) {
        console.log('appOpenBrower', err.message)
    }
}

// export function getAppScheme () {
//   return new Promise((resolve, reject) => {
//     let result = ''
//     if (window.JsHook && window.JsHook.appScheme) {
//       result = window.JsHook.appScheme()
//     } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appScheme) {
//       // window['appScheme'] = function (data) {
//       //   resolve(data)
//       // }
//       return window.webkit.messageHandlers.appScheme.postMessage('')
//     }
//     resolve(result)
//   })
// }

export function getAppToken () {
    window.parent.postMessage({ type: 'getAppToken', data: {} }, '*')
    return new Promise((resolve, reject) => {
        const _getHost = e => {
            // console.log('e:  ', e.data)
            window.removeEventListener('message', _getHost)
            resolve(e.data || {})
        }
        window.addEventListener('message', _getHost)
    })
}

/**
 * 获取入金回调地址
 *
 * @export {String} 地址
 */
export function getCallbackUrl () {
    return new Promise(async (resolve, reject) => {
        // let url = await getAppScheme()
        // if (url) {
        //   url = url + '://'
        // } else {
        //   let { data = {} } = await getAppToken()
        //   if (data.origin) {
        //     url = `${data.origin}/${data.appKey}/mine`
        //   }
        // }
        let url = ''
        const { data = {} } = await getAppToken()

        if (data.appScheme) {
            url = data.appScheme + '://'
        } else if (data.origin) {
            url = `${data.origin}/${data.appKey}/mine`
        }
        console.log(url)
        resolve(url)
    })
}

/**
 * 判断pc端还是移动端
 *
 * @export
 * @returns {Boolean}
 */
export function isPC () {
    var userAgentInfo = navigator.userAgent
    var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    var flag = true
    for (var i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
            flag = false
            break
        }
    }
    return flag
}

// 跳到"联系客服"
export function gotoOnlineService (router) {
    if (isAPP) {
        appClose()
        appGoCS()
    } else {
        router.replace({
            name: 'Nest',
            params: {
                id: 'service'
            }
        })
    }
}

// 通知查询资产
export function sendQueryAccountInfo () {
    window.parent.postMessage({ type: 'queryAccountInfo', data: {} }, '*')
}

// 用户的customer_number区分sessionStorage
export function sessionSet (key, val, customer_number) {
    if (typeof val === 'object') val = JSON.stringify(val)
    return sessionStorage.setItem(key + '__' + customer_number, val) // htmlKey 全局变量
}
export function sessionGet (key, customer_number) {
    return sessionStorage.getItem(key + '__' + customer_number)
}
export function sessionRemove (key, customer_number) {
    return sessionStorage.removeItem(key + '__' + customer_number)
}

// appGoCS()  //跳转到客服
export function appGoCS () {
    appFunction('appGoCS')
}
function appFunction (funcName, ...arg) {
    if (window.JsHook && JsHook[funcName]) {
        // 万年历的方法
        JsHook[funcName](...arg)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[funcName]) {
        window.webkit.messageHandlers[funcName].postMessage(arg)
    }
}
