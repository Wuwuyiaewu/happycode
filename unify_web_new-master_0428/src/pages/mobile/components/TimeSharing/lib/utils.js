import { globalStorage } from './config'

export const isPC = !/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(navigator.userAgent.toLowerCase())

// 获取焦点坐标
export let getCoordinate = e => {
    if (isPC) {
        getCoordinate = function (e) { return { x: e.offsetX * window.devicePixelRatio, y: e.offsetY * window.devicePixelRatio } }
    } else {
        getCoordinate = function (e) {
            const x = (e.targetTouches[0].pageX - globalStorage.style.boundingClientRect.left) * window.devicePixelRatio
            const y = (e.targetTouches[0].pageY - globalStorage.style.boundingClientRect.top) * window.devicePixelRatio
            return { x, y }
        }
    }
    return getCoordinate(e)
}

// 获取事件名称
export let getEventName = () => {
    if (!isPC) {
        getEventName = function () {
            return {
                start: 'touchstart',
                end: 'touchend',
                move: 'touchmove'
            }
        }
    } else {
        getEventName = function () {
            return {
                start: 'mousedown',
                end: 'mouseup',
                move: 'mousemove',
                leave: 'mouseleave',
                wheel: 'mousewheel'
            }
        }
    }
    return getEventName()
}

// 获取最高价
export function getHighPrice () {
    // const data = globalStorage.data
    // return Math.max(...data.map(item => item.close))

    return globalStorage.highPrice
}
// 获取最低价
export function getLowPrice () {
    // const data = globalStorage.data
    // return Math.min(...data.map(item => item.close))
    return globalStorage.lowPrice
}

// 获取最高值
export function getHighestValue () {
    const highPrice = getHighPrice()
    const lowPrice = getLowPrice()
    const closePrice = globalStorage.closePrice

    // (取 |最高价-开盘价|、|最低价-开盘价| 对应绝对值中的最高值)
    const highestValue = Math.max(Math.abs(highPrice - closePrice), Math.abs(lowPrice - closePrice))

    return highestValue * 1.15
}

// 获取图表高度差值
export function getChartHeightDiff () {
    const { upperPoint, bottomPoint } = getCriticalValue()
    return upperPoint - bottomPoint
}

// 获取上下坐标点
export function getCriticalValue () {
    const closePrice = globalStorage.closePrice
    const highestValue = getHighestValue()
    // 上轴坐标点
    const upperPoint = closePrice + highestValue
    // 下轴坐标点
    const bottomPoint = closePrice - highestValue

    return {
        upperPoint,
        bottomPoint
    }
}

// 格式化数据
export function formatData (data = globalStorage.data) {
    const highestValue = getHighestValue()
    const result = data.map((item, i) => {
        return {
            ...item,
            x: priceToXAxis(i, globalStorage.zoomX),
            y: priceToYAxis(item.close, highestValue)
        }
    })
    return result
}

// 价格转换y轴坐标
export function priceToYAxis (price) {
    const closePrice = globalStorage.closePrice
    var heightDiff = getChartHeightDiff()
    const result = Math.round((1 - (price - closePrice + heightDiff / 2) / heightDiff) * globalStorage.style.areaCanvasHeight)
    return result
}

// 任意y坐标计算对应的价格
export function yAxisToPrice (y) {
    const closePrice = globalStorage.closePrice
    var heightDiff = getChartHeightDiff()

    return (1 - y / globalStorage.style.areaCanvasHeight) * heightDiff - heightDiff / 2 + closePrice
}

// 价格转换x轴坐标
export function priceToXAxis (index, zoomX) {
    const result = index * zoomX
    return result
}

// 获取x坐标对应的数据
export function getCorssData ({ x, y }, data) {
    const index = Math.round(x / globalStorage.zoomX)
    return data[index] ? data[index] : null
}

export function priceDigit (val, digit = 2) {
    if (/^(\-|\+)?\d+(\.\d+)?$/.test(val)) {
        return toFixed(val, digit)
    } else {
        return '- -'
    }
}

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

/**
 * 创建dom节点
 *
 * @export
 */
export function createEls () {
    const cid = Math.floor(Math.random() * 10000)
    const nodeData = [
        {
            type: 'div',
            id: 'chart_' + cid,
            cssText: 'position: relative;width: 100%;user-select: none;flex: 1;cursor: crosshair;',
            dataProp: {
                name: 'chart'
            },
            children: [
                {
                    type: 'canvas',
                    id: 'area_' + cid,
                    cssText: 'position: absolute;top: 0;left: 0;width: 100%;height: 100%;',
                    dataProp: {
                        name: 'area'
                    },
                },
                {
                    type: 'canvas',
                    id: 'areaCross_' + cid,
                    cssText: 'position: absolute;top: 0;left: 0;width: 100%;height: 100%;',
                    dataProp: {
                        name: 'areaCross'
                    },
                }
            ]
        },
        {
            type: 'div',
            id: 'xAxis_' + cid,
            cssText: 'width: 100%;user-select: none;position: relative;flex:0 0 28px;height: 28px;border-top: 1px solid #505361;box-sizing: border-box;',
            children: [
                {
                    type: 'canvas',
                    id: 'x-coordinate_' + cid,
                    cssText: 'position: absolute;top: 0;left: 0;width: 100%;height: 100%;',
                    dataProp: {
                        name: 'xAxis'
                    },
                },
                {
                    type: 'canvas',
                    id: 'x-cross_' + cid,
                    cssText: 'position: absolute;top: 0;left: 0;width: 100%;height: 100%;'
                }
            ]
        }
    ]

    function recursive (arr) {
        if (!arr.length) return []
        return arr.map(item => {
            const elm = document.createElement(item.type)
            elm.id = item.id
            elm.style.cssText = item.cssText

            if (Object.prototype.toString.call(item.dataProp) === '[object Object]') {
                Object.keys(item.dataProp).forEach(key => {
                    elm.setAttribute('data-' + key, item.dataProp[key])
                })
            }
            if (Array.isArray(item.children)) {
                recursive(item.children).forEach(e => {
                    elm.appendChild(e)
                })
            }
            return elm
        })
    }
    const wrapElm = document.createElement('div')
    wrapElm.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    `

    recursive(nodeData).forEach(e => {
        wrapElm.appendChild(e)
    })

    console.log(wrapElm)

    return wrapElm

    // const wrapElm = document.createElement('div')
    // const chartELm = document.createElement('div')
    // const areaELm = document.createElement('canvas')
    // const areaCrossELm = document.createElement('canvas')
    // wrapElm.id = 'wrap_' + cid
    // chartELm.id = classes.chart.id
    // areaELm.id = 'area'
    // areaCrossELm.id = 'area-cross'

    // const xAxisELm = document.createElement('div')
    // const xCoordinateELm = document.createElement('canvas')
    // const xCrossELm = document.createElement('canvas')
    // xAxisELm.id = classes.xAxis.id
    // xCoordinateELm.id = 'x-coordinate'
    // xCrossELm.id = 'x-cross'

    // ;[areaELm, areaCrossELm].forEach(child => {
    //     chartELm.appendChild(child)
    // })
    // ;[xCoordinateELm, xCrossELm].forEach(child => {
    //     xAxisELm.appendChild(child)
    // })

    // ;[chartELm, xAxisELm].forEach(child => {
    //     wrapElm.appendChild(child)
    // })

    // console.log(wrapElm.getElementsByTagName('canvas'))
    // // wrapElm.getElementsByTagName('canvas').forEach(e => {
    // //     e.style.cssText = `position: absolute;
    // //                             top: 0;
    // //                             left: 0;
    // //                             width: 100%;
    // //                             height: 100%;
    // //                             `
    // // })

    // wrapElm.style.cssText = `
    //         width: 100%;
    //         height: 100%;
    //         display: flex;
    //         flex-direction: column;
    //     `

    // // chartELm.style.cssText = `
    // //         position: relative;
    // //         width: 100%;
    // //         user-select: none;
    // //         flex: 1;
    // //         cursor: crosshair;
    // //     `
    // // xAxisELm.style.cssText = `
    // //         width: 100%;
    // //         user-select: none;
    // //         position: relative;
    // //         flex:0 0 28px;
    // //         border-top: 1px solid #505361;
    // //         box-sizing: border-box;
    // //     `

    // return {
    //     classes,
    //     el: wrapElm
    // }
}
