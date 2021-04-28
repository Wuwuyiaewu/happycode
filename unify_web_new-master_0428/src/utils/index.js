/*
 * 生成随机字符串
 *
 * */
import { sigin_data, autoLoginKeyCodeList } from '@/config'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'
import pako from 'pako'

// import protobuf from 'protobufjs'
window['CryptoJS'] = CryptoJS

export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    }) + '-' + Date.now()
}
/* 创建9位随机数 */
export function msg_id () {
    return String(Date.now() / 1000000000).split('.')[1] * 1
}

export function wsParams (type, data = {}) {
    const authorization = authorization || sessionStorage.getItem('authorization__' + window.htmlKey)
    const tokenstr = authorization ? authorization.split(' ')[1] : null
    const _index = tokenstr ? (tokenstr.charAt(20).charCodeAt() % 5) : 1
    const getAppProperties = JSON.parse(sessionStorage.getItem('getAppProperties'))
    const platform = getAppProperties.transBaseConfigVo?.platform ?? 'YZ'
    const timestamp = Date.now()
    const result = {
        head: {
            server: platform.toLowerCase(),
            msgType: type,
            sendTime: timestamp
        },
        content: data,
        timestamp: timestamp,
        execute: 'vsids',
        sign: _csrf(timestamp, sigin_data[_index]),
        device: window['isPC'] ? 'pc' : 'h5', // h5
        trace: guid(),
        version_code: 1
    }

    if (type === 'login') {
        const clientIp = window['clientIp'] || sessionStorage.getItem('clientIp')
        result.head.Authorization = authorization
        result.content.appKey = window.htmlKey
        result.content.clientIp = clientIp
        if (getAppProperties) result.head.lang = getAppProperties.transBaseConfigVo.language
    }
    if (Object.prototype.toString.call(type) === '[object Object]') Object.assign(result, type)
    return JSON.stringify(result)
}

export function randomTrack () {
    const _trackArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let _track = ''
    for (let i = 0; i < 2; i++) {
        _track += _trackArr[Math.floor(Math.random() * (_trackArr.length - 1))]
    }
    _track += Date.now()
    return _track
}

// 更加公司的htmlKey区分localStorage
export function localSet (key, val) {
    if (typeof val === 'object') val = JSON.stringify(val)
    return localStorage.setItem(key + '__' + htmlKey, val) // htmlKey 全局变量
}
export function localGet (key) {
    return localStorage.getItem(key + '__' + htmlKey)
}
export function localRemove (key) {
    return localStorage.removeItem(key + '__' + htmlKey)
}
// 获取用户登录信息
export function getLoginData () {
    const data = localGet('loginData')
    // const data = JSON.stringify({
    //     // accountNo: '18600248624',
    //     // passWord: 'a111111',
    //     accountNo: '15986639372',
    //     passWord: 'p123456',
    //     accountType: 'real'
    // })
    if (data) {
        const dataObj = JSON.parse(data)
        return dataObj // .accountNo && dataObj.accountNo !== 'real' ? dataObj : null
    } else {
        return data
    }
}
// 删除本地缓存的用户登录信息
export function removeLoginData () {
    const sourceParams = sessionStorage.getItem('sourceParams')
    sessionStorage.clear()
    if (sourceParams) sessionStorage.setItem('sourceParams', sourceParams)
    localStorage.removeItem('loginData__' + htmlKey)
}
// 检测本地缓存的用户登录信息
export function checkLoginDataValid () {
    const sourceParams = sessionStorage.getItem('sourceParams')
    sessionStorage.clear()
    if (sourceParams) sessionStorage.setItem('sourceParams', sourceParams)
    localStorage.removeItem('loginData__' + htmlKey)
}
export function debounce (fn, wait = 200) {
    let timer
    return function (...rest) {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(function () {
            fn.apply(this, rest)
        }, wait)
    }
}
export function getElementPagePosition (e) {
    // left and top value
    // let left = 0
    // let top = 0
    // while (e.offsetParent) {
    //     // 计算偏移量
    //     left += e.offsetLeft + (e.currentStyle ? parseFloat(e.currentStyle.borderLeftWidth) : 0)
    //     top += e.offsetTop + (e.currentStyle ? parseFloat(e.currentStyle.borderTopWidth) : 0)

    //     // 最近的定位元素或者body
    //     e = e.offsetParent
    // }
    // left += e.offsetLeft + (e.currentStyle ? parseFloat(e.currentStyle.borderLeftWidth) : 0)
    // top += e.offsetTop + (e.currentStyle ? parseFloat(e.currentStyle.borderTopWidth) : 0)
    // return {
    //     x: left,
    //     y: top
    // }
    const position = e.getBoundingClientRect()
    return {
        x: position.left,
        y: position.top
    }
}

/* 延迟处理 */
let awaitCount = 0
export function delayAwait (fn, reset = true) {
    if (reset) awaitCount = 0
    return new Promise((resolve, reject) => {
        awaitCount++
        console.log(`>> Await count:: ${awaitCount * 300}ms`)
        const flag = fn()
        if (flag) {
            return resolve(flag)
        } else {
            return awaitCount < 100 ? reject() : resolve()
        }
    }).catch(() => {
        return new Promise(resolve => {
            setTimeout(resolve, 300)
        }).then(() => delayAwait(fn, false))
    })
}

/* 效验ix接口参数适配是否正确 */
export function checkAPIField (target, origin) {
    // target = target.split('\n').map(el => subVal(el))
    origin = origin.split('\n').map(el => subVal(el))

    const fieldError = []
    const fieldValError = []
    for (const field in target) {
        const item = origin.find(o => o[0] === field)
        if (!item) {
            fieldError.push({
                [field]: target[field]
            })
        }
        const itemVal = origin.find(o => o[0] === field && matchType(o[1], target[field]))
        if (!itemVal) {
            fieldValError.push({
                [field]: target[field]
            })
        }
    }
    // console.log(target, origin)
    // if (fieldValError.length) console.log(target, origin)
    return {
        fieldError,
        fieldValError
    }
    // console.log('fieldError', fieldError)
    // console.log('fieldValError', fieldValError)
}
window['checkAPIField'] = checkAPIField

function subVal (val) {
    const a = val.split(':')
    const newval = a[1].trim()
    a[0] = a[0].trim()
    if (newval === 'true' || newval === 'false') {
        a[1] = newval === 'true'
    } else {
        a[1] = newval.includes('"') ? newval.replace(/"/g, '').trim() : Number(newval)
    }

    return a
}

function matchType (a, b) {
    return Object.prototype.toString.call(a) === Object.prototype.toString.call(b)
}

// 生成从minNum到maxNum的随机整数
export function randomNum (minNum, maxNum) {
    switch (arguments.length) {
    case 1:
        return parseInt(Math.random() * minNum + 1, 10)
    case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
        return 0
    }
}
// 替换消息中自定义标签的内容
export function replaceMsgContent (str) {
    const reg = /<time>(.*?)<\/time>/g
    const newStr = str.replace(reg, function (res) {
        const result = reg.exec(res)
        if (result) {
            return dayjs(new Date(parseInt(result[1]))).format('YYYY-MM-DD HH:mm:ss')
        }
    })
    return newStr
}
// 获取字符长度 （英文占1个字符，中文汉字占2个字符）
export function getBLen (str) {
    // 把双字节的替换成两个单字节的然后再获得长度
    if (str == null) return 0
    if (typeof str !== 'string') {
        str += ''
    }
    return str.replace(/[^\x00-\xff]/g, '01').length
}
export function verifyBlen (str, max, min) {
    const strLen = getBLen(str)
    if (max && strLen > max) {
        return false
    }
    if (min && strLen < min) {
        return false
    }
    return true
}
// export function blodToBuffer(blod) {
//     return new Promise((reslove, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => {
//             reslove(protobuf.util.newBuffer(reader.result))
//         }
//         reader.readAsArrayBuffer(blod)
//         reader.onerror = () => reject()
//     })
// }
export function timeZone () {
    return dayjs().utcOffset() / 60
}
export function ungzip (blod) {
    return new Promise((reslove, reject) => {
        const reader = new FileReader()
        // const startTime = Date.now()
        reader.onload = () => {
            const charData = reader.result.split('').map(x => x.charCodeAt(0))
            const data = pako.inflate(new Uint8Array(charData))
            let strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            const chunk = 8 * 1024
            let i
            const uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            const result = JSON.parse(decodeURIComponent(strData))
            reslove(result)
        }
        reader.readAsBinaryString(blod)
        reader.onerror = () => reject()
    })

    // return Base64.decode(result)
}

// 产品属性显示
export function formatProductCode (product) {
    const {
        market_id,
        short_name = '',
        groupSymbol: {
            country_code = '',
            exchanger_code = '',
            market_code = ''
        }
    } = product
    const countryCode = country_code.length > 6 ? country_code.slice(0, 6) + '...' : country_code
    const exchangerCode = exchanger_code.length > 6 ? exchanger_code.slice(0, 6) + '...' : exchanger_code
    let result = short_name

    const countryCodeTemp = countryCode ? `${countryCode}&nbsp;&nbsp;` : countryCode

    if ([0, 1, 2, 9].includes(market_id)) {
        result += `&nbsp;&nbsp;${countryCodeTemp}${exchangerCode}`
    } else if ([11].includes(market_id)) {
        result += `&nbsp;&nbsp;${countryCodeTemp}${market_code}`
    } else if ([8, 10, 12, 13, 14, 15].includes(market_id)) {
        result += `&nbsp;&nbsp;${market_code}`
    }
    return result
}
// 删除骨架屏效果
export function removeSkeleton () {
    const skeleton_wrapper = document.querySelector('#skeleton_trade')
    const skeleton_home = document.querySelector('#skeleton_home')
    if (skeleton_wrapper) document.body.removeChild(skeleton_wrapper)
    if (skeleton_home) document.body.removeChild(skeleton_home)
}

// 获取字符长度
export function getStringLength (str) {
    let slength = 0
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
            slength += 1
        } else {
            slength += 2
        }
    }
    return slength
}
export function keyInUrlPath () {
    const notLinkWsPageList = ['mine/fundingDetails', 'my/withAmount', 'my/depositFunds', 'my/paymentDetails', 'my/bankName', 'my/certified', 'mt4/depositfunds', 'mt4/withAmount', 'mt4']
    const pathname = window.location.pathname
    const newArr = notLinkWsPageList.filter(item => pathname.indexOf(item) >= 0)
    if (newArr.length > 0) {
        return true
    } else {
        return false
    }
}
export function encrypt (num) {
    const encodeStr = 'ABCDEFGOPQRSTabcdefg_uvwxyzHIJKLMNUVWXYZ0152384967hijklmnopqrst'
    const b = []
    let m
    while (num != 0) {
        m = num % 63
        num = parseInt(num / 63)
        b.unshift(encodeStr.charAt(m))
    }
    return b.join('')
}
// 设备类型
export function deviceType (num) {
    let openFrom = 'H5_APP' // h5
    if (window['isPC']) {
        openFrom = 'WEBSITE' // PCUI
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        openFrom = 'ANDROID' // 原生Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        openFrom = 'IOS' // 原生IOS
    } else if (window.JsHook && JsHook.appOpenBrower) {
        openFrom = 'WEBSITE_ANDROID' // 壳包Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        openFrom = 'WEBSITE_IOS' // 壳包IOS
    }
    return openFrom
}
// 获取连接参数
export function getQueryVariable (variable, search = location.search) {
    if (!search) {
        return undefined
    }
    var query = search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return undefined
}
// 获取连接参数
export function queryToJson (qs) {
    var qList = ''
    if (qs) {
        qList = qs.trim().split('&')
    } else {
        qList = (window.location.search ? window.location.search : '?').trim()
            .substring(1)
            .split('&')
    }
    var json = {}
    var i = 0
    var len = qList.length

    for (; i < len; i++) {
        if (qList[i]) {
            var hash = qList[i].split('=')
            var key = hash[0]
            var value = hash[1]
            // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
            if (hash.length < 2) {
                value = key
                key = '$nullName'
            }
            if (!(key in json)) {
                // 如果缓存堆栈中没有这个数据，则直接存储
                json[key] = decodeURIComponent(value)
            } else {
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                json[key] = [].concat(json[key], decodeURIComponent(value))
            }
        }
    }
    return json
}

export function _csrf (str, key) {
    const strKey = key.map((item, index) => (String.fromCharCode(1000 - parseInt(item, 5)))).join('')
    const encryptedData = CryptoJS.AES.encrypt(str.toString(), CryptoJS.enc.Utf8.parse(strKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encryptedData.ciphertext.toString()
}

/* 自动登录的账户信息的key */
export function autoLoginKey (listArr) {
    let str = parseInt(Date.now() / 1000 / 60 / 10).toString() // 加密key在10分钟之内有效
    str += listArr.map(el => String.fromCharCode(el)).join('')
    return str
}
/* 将当前账户密码加密 */
export function encryptLoginData (listArr) {
    const key = autoLoginKey(autoLoginKeyCodeList)
    const loginData = localGet('loginData')
    const ciphertext = CryptoJS.AES.encrypt(loginData, key).toString()
    return encodeURIComponent(ciphertext)
}

/* 关联账号缓存 */
export function setLocalCustomer (val, companyId) {
    try {
        const key = 'customers' + '_' + companyId
        const nums = getLocalCustomer(companyId)
        if (!nums.includes(val)) {
            nums.push(val)
            localStorage.setItem(key, JSON.stringify(nums))
        }
    } catch (error) {
        console.error(error)
    }
}

/* 获取关联账号缓存 */
export function getLocalCustomer (companyId) {
    let nums = []
    const key = 'customers' + '_' + companyId
    try {
        nums = JSON.parse(localStorage.getItem(key))
    } catch (error) {
        console.error(error)
    }

    return nums || []
}

/* 获取经纬度 */
export function getGeolocation () {
    return Promise.resolve('')
    // return new Promise((resolve, reject) => {
    //     navigator.geolocation.getCurrentPosition(
    //         function (position) {
    //             const { coords: { latitude, longitude } } = position
    //             resolve(JSON.stringify({ latitude, longitude }))
    //         },
    //         function (error) {
    //             resolve('') // resolve 输出空值， 勿用reject
    //         },
    //         {
    //             timeout: 5000
    //         }
    //     )

    //     // 超过一定时间后，就不再等待gps的信息(未添加定位权限的app内，会出现该场景)
    //     setTimeout(() => {
    //         resolve('') // resolve 输出空值， 勿用reject
    //     }, 5000)
    // })
}

/* 获取浏览器指纹 */

export function getFingerprint () {
    const enumObj = {
        errorFF: 'errorFf',
        indexedDB: 'indexedDb'
    }
    const result = {}
    return FingerprintJS.load()
        .then(fp => fp.get())
        .then(res => {
            const { components } = res
            components['userAgent'] = navigator.userAgent
            components['adBlock'] = isAdblockUsed()
            components['plugins'] = {
                ...components['plugins'],
                value: FingerprintJS.hashComponents(components['plugins'].value)
            }
            components['fonts'] = {
                ...components['fonts'],
                value: FingerprintJS.hashComponents(components['fonts'].value)
            }
            components['userAgent'] = components['userAgent'].substring(0, 250)
            result['bhash'] = FingerprintJS.hashComponents(components)

            Object.keys(components).forEach(key => {
                const item = components[key]
                if (key === 'canvas' && typeof item === 'object') {
                    result[key] = JSON.stringify({
                        ...item,
                        value: FingerprintJS.hashComponents(item.value)
                    })
                } else {
                    if (enumObj[key]) {
                        result[enumObj[key]] = typeof item === 'object' ? JSON.stringify(item) : item
                    } else {
                        result[key] = typeof item === 'object' ? JSON.stringify(item) : item
                    }
                }
            })

            return result
        })
}

// 指纹纬度: 广告插件
function isAdblockUsed () {
    const timestamp = Date.now()

    const d = document
    if (!d.body.appendChild) {
        return {
            value: false,
            duration: Date.now() - timestamp
        }
    }

    const ads = d.createElement('div')
    ads.innerHTML = '&nbsp;'
    ads.className = 'adsbox'

    try {
        d.body.appendChild(ads)
        const node = d.querySelector('.adsbox')
        return {
            value: !node || node.offsetHeight === 0,
            duration: Date.now() - timestamp
        }
    } finally {
        ads.parentNode.removeChild(ads)
    }
}

/**
 * 统一处理接口入参(采集指纹)
 *
 * @export
 * @param {*} [obj={}] 若obj内不存在任一字段(email, mobilePhone, accountNo),则启用localData数据
 * @param {*} localData store存储的用户信息(mobilePhone/loginName)
 * @return {*}
 */
export function resolveUserRiskInfoParams (obj = {}, localData) {
    const temp = {
        ...obj
    }

    const params = {
        type: obj.type
    }

    if (!(temp.accountNo || temp.mobilePhone || temp.email)) {
        Object.assign(temp, {
            mobilePhone: localData.mobilePhone,
            accountNo: localData.accountNo,
        })
    }

    if (temp.email || temp.mobilePhone) {
        temp.email ? (params['email'] = temp.email) : (params['mobilePhone'] = temp.mobilePhone)
    } else {
        if (temp.accountNo.indexOf('@') > -1) {
            params['email'] = temp.accountNo
        } else {
            params['mobilePhone'] = temp.accountNo
        }
    }

    if ([0, 1].includes(obj.isLogin)) {
        params.isLogin = obj.isLogin
    } else {
        params.isLogin = 0
    }

    return params
}
