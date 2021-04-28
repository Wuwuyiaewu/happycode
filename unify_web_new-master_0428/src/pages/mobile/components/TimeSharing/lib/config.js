export const globalStorage = getOptions()

// 初始化配置
export function setOption (options) {
    const {
        zoomX = globalStorage.zoomX,
        style = globalStorage.style,
        data = globalStorage.data,
        highPrice = globalStorage.highPrice,
        lowPrice = globalStorage.lowPrice,
        closePrice = globalStorage.closePrice,
        digit = globalStorage.digit,
        colors = globalStorage.colors,
        start_time = globalStorage.start_time,
        end_time = globalStorage.end_time,
        schedule_day = globalStorage.schedule_day
    } = options

    Object.assign(globalStorage, {
        zoomX,
        data,
        highPrice,
        lowPrice,
        closePrice,
        digit,
        colors,
        start_time,
        end_time,
        schedule_day
    })

    Object.assign(globalStorage.style, style)
}

// 恢复默认参数
export function getOptions () {
    return {
        zoomX: 1,
        data: [],
        highPrice: null,
        lowPrice: null,
        closePrice: null,
        digit: 2,
        start_time: '',
        end_time: '',
        style: {
            font: `${12 * window.devicePixelRatio}px sans-serif`,
            containerWidth: null, // dom的宽度
            canvasWidth: null, // canvas 宽度
            areaCanvasHeight: null // canvas绘制曲线的高度
        },
        colors: {
            up: '',
            down: ''
        }
    }
}
