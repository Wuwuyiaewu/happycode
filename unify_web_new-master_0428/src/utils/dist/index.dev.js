'use strict'

Object.defineProperty(exports, '__esModule', {
    value: true
})
exports.guid = guid
exports.msg_id = msg_id
exports.wsParams = wsParams
exports.randomTrack = randomTrack
exports.localSet = localSet
exports.localGet = localGet
exports.localRemove = localRemove
exports.getLoginData = getLoginData
exports.removeLoginData = removeLoginData
exports.checkLoginDataValid = checkLoginDataValid
exports.debounce = debounce
exports.getElementPagePosition = getElementPagePosition
exports.delayAwait = delayAwait
exports.checkAPIField = checkAPIField
exports.randomNum = randomNum
exports.replaceMsgContent = replaceMsgContent
exports.getBLen = getBLen
exports.verifyBlen = verifyBlen
exports.timeZone = timeZone
exports.ungzip = ungzip
exports.formatProductCode = formatProductCode
exports.removeSkeleton = removeSkeleton
exports.getStringLength = getStringLength
exports.keyInUrlPath = keyInUrlPath
exports.encrypt = encrypt

var _dayjs = _interopRequireDefault(require('dayjs'))

var _pako = _interopRequireDefault(require('pako'))

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function _typeof (obj) { if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

// import protobuf from 'protobufjs'
function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c == 'x' ? r : r & 0x3 | 0x8
        return v.toString(16)
    })
}
/* 创建9位随机数 */

function msg_id () {
    return String(Date.now() / 1000000000).split('.')[1] * 1
}

function wsParams (type) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    var authorization = authorization || sessionStorage.getItem('authorization__' + window.htmlKey)
    var getAppProperties = JSON.parse(sessionStorage.getItem('getAppProperties'))
    var platform = getAppProperties.transBaseConfigVo.platform
    var result = {
        head: {
            server: platform.toLowerCase(),
            msgType: type,
            sendTime: Date.now()
        },
        content: data,
        device: 'h5',
        trace: guid(),
        version_code: 1
    }

    if (type === 'login') {
        var clientIp = window['clientIp'] || sessionStorage.getItem('clientIp')
        result.head.Authorization = authorization
        result.content.appKey = window.htmlKey
        result.content.clientIp = clientIp
        if (getAppProperties) result.head.lang = getAppProperties.transBaseConfigVo.language
    }

    if (Object.prototype.toString.call(type) === '[object Object]') Object.assign(result, type)
    return JSON.stringify(result)
}

function randomTrack () {
    var _trackArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var _track = ''

    for (var i = 0; i < 2; i++) {
        _track += _trackArr[Math.floor(Math.random() * (_trackArr.length - 1))]
    }

    _track += Date.now()
    return _track
} // 更加公司的htmlKey区分localStorage

function localSet (key, val) {
    if (_typeof(val) == 'object') val = JSON.stringify(val)
    return localStorage.setItem(key + '__' + htmlKey, val) // htmlKey 全局变量
}

function localGet (key) {
    return localStorage.getItem(key + '__' + htmlKey)
}

function localRemove (key) {
    return localStorage.removeItem(key + '__' + htmlKey)
} // 获取用户登录信息

function getLoginData () {
    var data = localGet('loginData') // const data = JSON.stringify({
    //     // accountNo: '18600248624',
    //     // passWord: 'a111111',
    //     accountNo: '15986639372',
    //     passWord: 'p123456',
    //     accountType: 'real'
    // })

    if (data) {
        var dataObj = JSON.parse(data)
        return dataObj // .accountNo && dataObj.accountNo !== 'real' ? dataObj : null
    } else {
        return data
    }
} // 删除本地缓存的用户登录信息

function removeLoginData () {
    var sourceParams = sessionStorage.getItem('sourceParams')
    sessionStorage.clear()
    if (sourceParams) sessionStorage.setItem('sourceParams', sourceParams)
    localStorage.removeItem('loginData__' + htmlKey)
} // 检测本地缓存的用户登录信息

function checkLoginDataValid () {
    var sourceParams = sessionStorage.getItem('sourceParams')
    sessionStorage.clear()
    if (sourceParams) sessionStorage.setItem('sourceParams', sourceParams)
    localStorage.removeItem('loginData__' + htmlKey)
}

function debounce (fn) {
    var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200
    var timer
    return function () {
        for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key]
        }

        if (timer) {
            clearTimeout(timer)
            timer = null
        }

        timer = setTimeout(function () {
            fn.apply(this, rest)
        }, wait)
    }
}

function getElementPagePosition (e) {
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
    var position = e.getBoundingClientRect()
    return {
        x: position.left,
        y: position.top
    }
}
/* 延迟处理 */

var awaitCount = 0

function delayAwait (fn) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true
    if (reset) awaitCount = 0
    return new Promise(function (resolve, reject) {
        awaitCount++
        console.log('>> Await count:: '.concat(awaitCount * 300, 'ms'))
        var flag = fn()

        if (flag) {
            return resolve(flag)
        } else {
            return awaitCount < 100 ? reject() : resolve()
        }
    })['catch'](function () {
        return new Promise(function (resolve) {
            setTimeout(resolve, 300)
        }).then(function () {
            return delayAwait(fn, false)
        })
    })
}
/* 效验ix接口参数适配是否正确 */

function checkAPIField (target, origin) {
    // target = target.split('\n').map(el => subVal(el))
    origin = origin.split('\n').map(function (el) {
        return subVal(el)
    })
    var fieldError = []
    var fieldValError = []

    var _loop = function _loop (field) {
        var item = origin.find(function (o) {
            return o[0] === field
        })
        if (!item) fieldError.push(_defineProperty({}, field, target[field]))
        var itemVal = origin.find(function (o) {
            return o[0] === field && matchType(o[1], target[field])
        })
        if (!itemVal) fieldValError.push(_defineProperty({}, field, target[field]))
    }

    for (var field in target) {
        _loop(field)
    } // console.log(target, origin)
    // if (fieldValError.length) console.log(target, origin)

    return {
        fieldError: fieldError,
        fieldValError: fieldValError
    } // console.log('fieldError', fieldError)
    // console.log('fieldValError', fieldValError)
}

window['checkAPIField'] = checkAPIField

function subVal (val) {
    var a = val.split(':')
    var newval = a[1].trim()
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
} // 生成从minNum到maxNum的随机整数

function randomNum (minNum, maxNum) {
    switch (arguments.length) {
    case 1:
        return parseInt(Math.random() * minNum + 1, 10)
        break

    case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        break

    default:
        return 0
        break
    }
} // 替换消息中自定义标签的内容

function replaceMsgContent (str) {
    var reg = /<time>(.*?)<\/time>/g
    var newStr = str.replace(reg, function (res) {
        var result = reg.exec(res)

        if (result) {
            return (0, _dayjs['default'])(new Date(parseInt(result[1]))).format('YYYY-MM-DD HH:mm:ss')
        }
    })
    return newStr
} // 获取字符长度 （英文占1个字符，中文汉字占2个字符）

function getBLen (str) {
    // 把双字节的替换成两个单字节的然后再获得长度
    if (str == null) return 0

    if (typeof str !== 'string') {
        str += ''
    }

    return str.replace(/[^\x00-\xff]/g, '01').length
}

function verifyBlen (str, max, min) {
    var strLen = getBLen(str)

    if (max && strLen > max) {
        return false
    }

    if (min && strLen < min) {
        return false
    }

    return true
} // export function blodToBuffer(blod) {
//     return new Promise((reslove, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => {
//             reslove(protobuf.util.newBuffer(reader.result))
//         }
//         reader.readAsArrayBuffer(blod)
//         reader.onerror = () => reject()
//     })
// }

function timeZone () {
    return (0, _dayjs['default'])().utcOffset() / 60
}

function ungzip (blod) {
    return new Promise(function (reslove, reject) {
        var reader = new FileReader() // const startTime = Date.now()

        reader.onload = function () {
            var charData = reader.result.split('').map(function (x) {
                return x.charCodeAt(0)
            })

            var data = _pako['default'].inflate(new Uint8Array(charData))

            var strData = ''
            /**
       * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
       * 超过最大调用堆栈大小
       *
       */

            var chunk = 8 * 1024
            var i
            var uint16Arr = new Uint16Array(data)

            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }

            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            var result = JSON.parse(decodeURIComponent(strData))
            reslove(result)
        }

        reader.readAsBinaryString(blod)

        reader.onerror = function () {
            return reject()
        }
    }) // return Base64.decode(result)
} // 产品属性显示

function formatProductCode (product) {
    var market_id = product.market_id
    var _product$short_name = product.short_name
    var short_name = _product$short_name === void 0 ? '' : _product$short_name
    var _product$groupSymbol = product.groupSymbol
    var _product$groupSymbol$ = _product$groupSymbol.country_code
    var country_code = _product$groupSymbol$ === void 0 ? '' : _product$groupSymbol$
    var _product$groupSymbol$2 = _product$groupSymbol.exchanger_code
    var exchanger_code = _product$groupSymbol$2 === void 0 ? '' : _product$groupSymbol$2
    var _product$groupSymbol$3 = _product$groupSymbol.market_code
    var market_code = _product$groupSymbol$3 === void 0 ? '' : _product$groupSymbol$3
    var countryCode = country_code.length > 6 ? country_code.slice(0, 6) + '...' : country_code
    var exchangerCode = exchanger_code.length > 6 ? exchanger_code.slice(0, 6) + '...' : exchanger_code
    var result = short_name
    var countryCodeTemp = countryCode ? ''.concat(countryCode, '&nbsp;&nbsp;') : countryCode

    if ([0, 1, 2, 9].includes(market_id)) {
        result += '&nbsp;&nbsp;'.concat(countryCodeTemp).concat(exchangerCode)
    } else if ([11].includes(market_id)) {
        result += '&nbsp;&nbsp;'.concat(countryCodeTemp).concat(market_code)
    } else if ([8, 10, 12, 13, 14, 15].includes(market_id)) {
        result += '&nbsp;&nbsp;'.concat(market_code)
    }

    return result
} // 删除骨架屏效果

function removeSkeleton () {
    var skeleton_wrapper = document.querySelector('#skeleton_trade')
    var skeleton_home = document.querySelector('#skeleton_home')
    if (skeleton_wrapper) document.body.removeChild(skeleton_wrapper)
    if (skeleton_home) document.body.removeChild(skeleton_home)
} // 获取字符长度

function getStringLength (str) {
    var slength = 0

    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
            slength += 1
        } else {
            slength += 2
        }
    }

    return slength
}

function keyInUrlPath () {
    var notLinkWsPageList = ['mine/fundingDetails', 'my/withAmount', 'my/depositFunds', 'my/certified']
    var pathname = window.location.pathname
    var newArr = notLinkWsPageList.filter(function (item) {
        return pathname.indexOf(item) >= 0
    })

    if (newArr.length > 0) {
        return true
    } else {
        return false
    }
}

function encrypt (num) {
    var encodeStr = 'ABCDEFGOPQRSTabcdefg_uvwxyzHIJKLMNUVWXYZ0152384967hijklmnopqrst'
    var b = []
    var m

    while (num != 0) {
        m = num % 63
        num = parseInt(num / 63)
        b.unshift(encodeStr.charAt(m))
    }

    return b.join('')
}
