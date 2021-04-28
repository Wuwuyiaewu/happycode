import dayjs from 'dayjs'
import { toFixed } from '@/utils/calculation'
import { i18n } from '@m/lang'
export function accountType (val) {
    if (val === 'real') {
        return i18n.t('trade.real')
    } else if (val === 'demo') {
        return i18n.t('trade.demo')
    } else {
        return i18n.t('trade.guest')
    }
}
export function moneyAccuracy (val, signbit = true) {
    if (/^(\-|\+)?\d+(\.\d+)?$/.test(val)) {
        if (signbit) {
            return (toFixed(val) > 0 ? '+' : '') + toFixed(val)
        } else {
            return toFixed(val)
        }
    } else {
        return '--'
    }
}
export function direction (val) {
    if (val === 1 || val === '1') {
        return i18n.t('trade.buy')
    } else if (val === 2 || val === '2') {
        return i18n.t('trade.sell')
    } else {
        return ''
    }
}
// export function showSymbol(val) {
//     if (val && val.length > 3) {
//         return val.slice(0, 3) + '/' + val.slice(3)
//     } else {
//         return val
//     }
// }
export function orderType (orderType) {
    if (orderType === 1) {
        return i18n.t('trade.orderType1')
    } else if (orderType === 2) {
        return i18n.t('trade.orderType2')
    } else if (orderType === 4) {
        return i18n.t('trade.orderType4')
    } else if (orderType === 8) {
        return i18n.t('trade.orderType8')
    } else {
        return orderType
    }
}
export function expireType (expireType) {
    if (expireType === 1) {
        return i18n.t('trade.expireType1')
    } else if (expireType === 2) {
        return i18n.t('trade.expireType2')
    } else {
        return expireType
    }
}
export function formatTimestamp (str) {
    if (str) {
        return dayjs(new Date(parseInt(str.toString() + '000'))).format('YYYY/MM/DD HH:mm:ss')
    } else {
        return ''
    }
}

export function priceDigit (val, digit = 2) {
    if (/^(\-|\+)?\d+(\.\d+)?$/.test(val)) {
        return toFixed(val, digit)
    } else {
        return '- -'
    }
}

export function showMsgNum (val) {
    if (val > 99) {
        return '99+'
    } else {
        return val
    }
}

export function filterNumberSign (val = '') {
    if (!/[0-9]+/g.test(val)) {
        return '- -'
    }

    let result = val
    const num = val.replace('%', '') * 1
    if (num > 0) {
        result = result.replace(num, '+' + num)
    }
    return result
}

export function bankNumFilter (val) {
    if (!val) return ''
    return val.slice(0, 4) + ' **** ' + val.slice(-4)
}
