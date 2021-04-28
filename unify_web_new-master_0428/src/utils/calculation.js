/** 四舍五入转化为指定小数位数，不足补0
 * @num num表示需要四舍五入的小数
 * @pNum s表示需要保留几位小数
 */
export function toFixed (num, s = 2) {
    const times = Math.pow(10, s)
    let des = 0
    if (num > 0) {
        des = num * times + 0.5
    } else {
        des = num * times - 0.5
    }
    des = parseInt(des, 10) / times
    return Number(des).toFixed(s)
}

/* 获取数字小数位长度 */
export function getDecimalNum (num) {
    try {
        const arr = num.toString().split('.')
        return arr.length > 1 ? arr[1].length : 0
    } catch (e) {
        return 0
    }
}

/* 加法 */
export function plus (num1, num2) {
    const r1 = getDecimalNum(num1)
    const r2 = getDecimalNum(num2)
    const m = Math.pow(10, Math.max(r1, r2))
    return +(Math.round(num1 * m + num2 * m) / m)
}

/* 减法 */
export function minus (num1, num2) {
    const r1 = getDecimalNum(num1)
    const r2 = getDecimalNum(num2)
    const m = Math.pow(10, Math.max(r1, r2))
    const n = r1 >= r2 ? r1 : r2
    return +(Math.round(num1 * m - num2 * m) / m).toFixed(n)
}

/* 除法 */
export function divide (num1, num2) {
    const r1 = getDecimalNum(num1)
    const r2 = getDecimalNum(num2)
    const m = Math.pow(10, Math.max(r1, r2))
    return (num1 * m).toFixed(0) / (num2 * m).toFixed(0)
}
/* 乘法 */
export function mul (a, b) {
    let c = 0 // a的小数部分长度
    let d = 0 // b的小数部分长度
    try {
        c = a.toString().split('.')[1].length
    } catch (f) { }
    try {
        d = b.toString().split('.')[1].length
    } catch (f) { }

    return (Number(a.toString().replace('.', '')) * Number(b.toString().replace('.', ''))) / Math.pow(10, (c + d))
}
