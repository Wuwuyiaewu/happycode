import dayjs from 'dayjs'
/** 4小时K线组装重点：
 *  每四个小时一组数据，不管一组数据里面有几条
 *  如果最后一组数据不够4条，则删除最后一组数据，下次重新拉取
 **/

/** 根据数组里面的某个字段找出最大值
 * param ${Array} list 数据列表
 * param ${String} name 字段名称
 * e·g a=[{"a":1},{"a":2}]; arrayMaxByName(a,'name');
 */
function arrayMaxByName (list, name) {
    const nameVals = list.reduce((accumulator, el) => {
        accumulator.push(el[name])
        return accumulator
    }, [])
    return Math.max(...nameVals)
}
/** 根据数组里面的某个字段找出最小值
 * param ${Array} list 数据列表
 * param ${String} name 字段名称
 * e·g a=[{"a":1},{"a":2}]; arrayMaxByName(a,'name');
 */
function arrayMinByName (list, name) {
    const nameVals = list.reduce((accumulator, el) => {
        accumulator.push(el[name])
        return accumulator
    }, [])
    return Math.min(...nameVals)
}

/** 处理4小时K线，将K线数据按日期分组，把00:00:00的数据划分到前一天
 * 这里的list为服务器下发的时间倒序排列
 */
function groupByDay (list) {
    const result = []
    let prevItemTime = ''
    let prevArr = []
    list.forEach((el, i) => {
        const itemDay = el.time.slice(0, 10)
        if (i === 0) {
            prevArr.push(el)
            result.push(prevArr)
        } else {
            const prevDay = prevItemTime.slice(0, 10)
            if (itemDay === prevDay && el.time.slice(11) !== '00:00:00') {
                prevArr.push(el)
            } else if (el.time.slice(11) === '00:00:00') {
                prevArr = [el] // 新的一天的数据
                result.push(prevArr)
            } else if (
                dayjs(prevItemTime)
                    .subtract(1, 'minute')
                    .format('YYYY-MM-DD') === itemDay
            ) {
                prevArr.push(el)
            } else {
                prevArr = [el] // 新的一天的数据
                result.push(prevArr)
            }
        }
        prevItemTime = el.time
    })
    return result
}

/* 4小时K线，把一天里面每4个小时分组 */
function splitBy4Hour (list) {
    const hours = []
    let item = []
    // console.log('splitBy4Hour', list)
    list.forEach((el, i) => {
        const time = el.time
        const m = dayjs(time).hour() % 4
        if (i === 0 || m === 0 || dayjs(item[0]).unix() - dayjs(time).unix() >= 4 * 60 * 60) {
            item = [el]
            hours.push(item)
        } else {
            item.push(el)
        }
    })
    // console.log('hours', hours[0][0]['time'], hours)
    // 最后一组数据可能不完全4小时的数据，删除掉，下次重新拉取
    // const lastHourArr = hours[hours.length - 1]
    // hours.splice(hours.length - 1, 1)

    const result = []
    hours.forEach(el => {
        result.push(mergerBy4Hour(el))
    })
    return result
}

/* 4小时K线，将四组数据按照高开低收合并成一条数据 */
function mergerBy4Hour (list) {
    const len = list.length
    const result = Object.assign({}, list[len - 1])
    result.close_price = list[0]['close_price']
    const time = list[0].time
    // 先计算这组数据属于哪个时间点
    if (time.slice(11) === '00:00:00') {
        result.time = time
    } else {
        const day = time.slice(0, 10)
        let hour = parseInt(time.slice(11, 13))
        hour = Math.ceil(hour / 4) * 4
        result.time = dayjs(day)
            .hour(hour)
            .format('YYYY-MM-DD HH:mm:ss')
    }
    list.forEach((el, i) => {
        if (result.high_price < el.high_price) {
            result.high_price = el.high_price
        }
        if (result.low_price > el.low_price) {
            result.low_price = el.low_price
        }
    })
    return result
}

/* 处理时间最近的一条数据，补充到被4小时整除的区间
 * 如果最近一条数据是4点，则不用补充；
 * 如果最近一条数据是5点，则补充6点，7点，8点；
 */
export function handleLatelyData (list) {
    if (list.length === 0) return list
    const lately = list[0]
    const time = lately.time
    const hour = parseInt(time.slice(11, 13))
    const m = hour % 4
    if (m === 0) return list
    for (let i = 1; i <= 4 - m; i++) {
        const fillItem = Object.assign({}, lately)
        fillItem.time = dayjs(time)
            .add(i, 'hour')
            .format('YYYY-MM-DD HH:mm:ss')
        list.unshift(fillItem)
    }
    return list
}

/** K线分隔计算，比如4小时k线，需要由1小时的k小组成
 * param ${Array} list 数据列表， 这里的list为服务器下发的时间倒序排列
 */
export function kLineDataGroup (list) {
    if (!Array.isArray(list)) return console.error('list must be Array!')
    let data = list.slice(0)
    handleLatelyData(data) // 补充数据
    data = groupByDay(data)
    const result = []
    data.forEach(el => {
        result.push(...splitBy4Hour(el))
    })
    // 最后一组数据可能不完全4小时的数据，删除掉，下次重新拉取
    result.splice(result.length - 1, 1)
    // console.log('newData', result)
    return result
}

/** 计算MA指标 (5,10,20,30,60)的均线
 * list {Array} K线数据
 * typeval {Number} 指标类型 如 5,10,20,30,60
 */
export function maLineData (list, typeval, digits = 2) {
    // const newList = JSON.parse(JSON.stringify(list))
    // newList.forEach(el => {
    //     el.time = dayjs(el.time.timestamp * 1000).format('YYYY-MM-DD HH:mm')
    // })
    // console.log('newList', newList)
    const len = list.length
    if (len <= typeval) return []
    const result = []
    list.forEach((el, i) => {
        if (i < typeval - 1) return
        const items = list.slice(i - typeval + 1, i + 1)
        const value = average_close(items, digits)
        if (!value) console.log('value', value)
        result.push({
            value: value,
            time: el.time.timestamp
        })
    })
    // console.log('ma_5', result)
    return result
}
// 根据收盘价计算列表的平均值
export function average_close (items, digits = 2) {
    const len = items.length
    const m = items.reduce((acc, cur) => {
        return acc + cur.value[3]
    }, 0)
    return (m / len).toFixed(digits) * 1
}
