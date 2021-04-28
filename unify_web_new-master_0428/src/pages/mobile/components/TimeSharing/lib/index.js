import { InitArea, InitCorss } from './area.js'
import { InitXAxis } from './xAxis.js'
import { getEventName, getCoordinate, formatData, getCorssData, createEls } from './utils.js'
import { globalStorage, setOption, getOptions } from './config.js'

export class InitChart {
    constructor (args) {
        const _rootElm = document.querySelector(args.el)
        this._initDOM(_rootElm)
        this._elms = {
            root: _rootElm,
            area: document.querySelector('[data-name="area"]'),
            areaCross: document.querySelector('[data-name="areaCross"]'),
            xAxis: document.querySelector('[data-name="xAxis"]'),
        }
        const styleWidth = Math.floor(_rootElm.getBoundingClientRect().width)
        const areaElm = document.querySelector('[data-name="area"]')
        const areaCanvasHeight = areaElm.getBoundingClientRect().height

        // 初始化配置
        setOption({
            ...args.config,
            highPrice: args.highPrice,
            lowPrice: args.lowPrice,
            closePrice: args.closePrice,
            digit: args.digit,
            style: {
                containerWidth: styleWidth,
                canvasWidth: _rootElm.getBoundingClientRect().width * window.devicePixelRatio,
                areaCanvasHeight: areaCanvasHeight * window.devicePixelRatio,
                boundingClientRect: areaElm.getBoundingClientRect()
            }
        })

        window.addEventListener('resize', this.updateChart.bind(this))

        // 面积图
        this._areaInstance = new InitArea({
            el: this._elms.area,
        })
        // 面积图交互层
        this._areaCrossInstance = new InitCorss({
            el: this._elms.areaCross,
        })
        // 横坐标图
        this._xAxisInstance = new InitXAxis({
            el: this._elms.xAxis,
        })

        this._subs = {}

        this._init()
    }

    _init () {
        // 绑定事件(面积图交互层#area-cross)
        this._bindEventForAreaCross()
    }

    // 渲染DOM节点
    _initDOM (_rootElm) {
        _rootElm.childNodes.forEach(e => {
            _rootElm.removeChild(e)
        })
        _rootElm.appendChild(createEls())
    }

    _bindEventForAreaCross () {
        const areaCrossElm = this._areaCrossInstance._canvas
        const eventName = getEventName()
        let timer = 0
        // 是否长按状态
        let isPress = false

        areaCrossElm.oncontextmenu = () => false
        /* mousedown/touchstart */
        areaCrossElm.addEventListener(eventName.start, e => {
            if (eventName.start === 'touchstart') {
                isPress = false
                timer = setTimeout(() => {
                    isPress = true
                    console.log('进入长按平移')
                    this._renderCrosshair(e)
                }, 500)
            } else {
                e.preventDefault()
            }
            e.stopPropagation()
            this._subs['mouse_down'] && this._subs['mouse_down']()
        })
        /* mousedown/touchstart */

        /* mousemove/touchmove */
        // 左右平移
        areaCrossElm.addEventListener(eventName.move, e => {
            if (eventName.move === 'touchmove') {
                if (!isPress) {
                    clearTimeout(timer)
                    return
                } else {
                    e.preventDefault()
                }
            } else {
                e.preventDefault()
            }
            e.stopPropagation()
            this._renderCrosshair(e)

            const target = getCorssData({ x: getCoordinate(e).x }, globalStorage.data)
            this._subs['cross'] && this._subs['cross'](target || null)
        })
        /* mousemove/touchmove */

        /* mouseup */
        areaCrossElm.addEventListener(eventName.end, e => {
            clearTimeout(timer)
            this._areaCrossInstance.isShowCross = false
            this._xAxisInstance.isShowCross = false
            this._handleMouseUp()

            this._subs['mouse_up'] && this._subs['mouse_up']()

            this.updateChart()
        })
        /* mouseup */

        /* mouseleave */
        if (eventName.leave) {
            areaCrossElm.addEventListener(eventName.leave, e => {
                this._areaCrossInstance.isShowCross = false
                this._xAxisInstance.isShowCross = false
                clearTimeout(timer)
                this._handleMouseLeave()
                this._subs['mouse_leave'] && this._subs['mouse_leave']()

                this.updateChart()
            })
        }
        /* mouseleave */
    }

    // 鼠标松开
    _handleMouseUp () {
    }

    // 鼠标离开
    _handleMouseLeave () {
        this._updateAreaCross()
        this._updataXAxis()
    }

    _renderCrosshair (e) {
        this._areaCrossInstance.isShowCross = true
        this._xAxisInstance.isShowCross = true
        // 更新面积十字光标
        this._updateAreaCross(e)
        // 更新x轴
        this._updataXAxis(e)
    }

    // 更新十字光标图层
    _updateAreaCross (e) {
        this._areaCrossInstance.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._areaCrossInstance._canvas.height)
        e && this._areaCrossInstance._draw(e)
    }

    // 更新x轴图层
    _updataXAxis (e) {
        this._xAxisInstance.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._xAxisInstance._canvas.height)
        this._xAxisInstance._draw(e)
    }

    updateChart () {
        globalStorage.data = formatData()
        this._resetSize()
        this.clearAllRect()
        this._areaInstance._drawArea()
        this._xAxisInstance._draw()
    }

    resetGlobal () {
        setOption(getOptions())
    }

    _resetSize () {
        this._initSize(this._elms.area)
        this._initSize(this._elms.areaCross)
        this._initSize(this._elms.xAxis)

        const elm = this._elms.root
        const styleWidth = Math.floor(elm.getBoundingClientRect().width)
        const areaElm = this._elms.area
        const areaCanvasHeight = areaElm.getBoundingClientRect().height

        const style = {
            containerWidth: styleWidth,
            canvasWidth: elm.getBoundingClientRect().width * window.devicePixelRatio,
            areaCanvasHeight: areaCanvasHeight * window.devicePixelRatio,
            boundingClientRect: areaElm.getBoundingClientRect()
        }
        // 初始化配置
        setOption({
            style,
            zoomX: this._getZoomX(style.canvasWidth)
        })

        setOption({
            data: formatData()
        })
    }

    _getZoomX (canvasWidth) {
        const { data = [] } = globalStorage
        const len = this._getTotalLen() || canvasWidth
        // const ratio = Math.floor(data.length / this._getTotalLen() * 100)
        // let scale = 1
        // if (ratio < 25) {
        //     scale = 2
        // } else if (ratio < 50) {
        //     scale = 1.5
        // }

        let result = canvasWidth / len
        const dataLen = data.length
        if (dataLen) {
            const { time: lastTime } = data[dataLen - 1]
            const { end_time } = globalStorage
            if (lastTime >= Math.floor(end_time / 1000 - end_time / 1000 % 60)) {
                result = canvasWidth / dataLen
            }
        }

        return result
    }

    _getTotalLen () {
        const { schedule_day } = globalStorage
        if (!schedule_day) {
            return
        }
        const len = schedule_day[0].schedule_time.reduce((total, item) => {
            return Math.ceil(total + (item.end_time - item.start_time) / 60)
        }, 0)
        return len !== 0 ? len : undefined
    }

    _initSize (elm) {
        // elm.style.width = '100%'
        // elm.style.height = '100%'

        // 初始化属性
        const elmWidth = Math.floor(elm.getBoundingClientRect().width)
        const elmHeight = Math.floor(elm.getBoundingClientRect().height)
        // elm.style.width = elmWidth + 'px'
        // elm.style.height = elmHeight + 'px'
        elm.width = elmWidth * window.devicePixelRatio
        elm.height = elmHeight * window.devicePixelRatio
    }

    subscribe (eventName, func) {
        if (!['cross', 'mouse_down', 'mouse_up', 'mouse_leave'].includes(eventName)) {
            throw new Error('no event: ', eventName)
        }
        this._subs[eventName] = func.bind(this)
    }

    applyConfig (options) {
        setOption({
            ...options
        })

        setOption({
            zoomX: this._getZoomX(globalStorage.style.canvasWidth)
        })
        this.updateChart()
    }

    // 清空所有绘图
    clearAllRect () {
        this._areaInstance.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._areaInstance._canvas.height)
        this._areaCrossInstance.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._areaInstance._canvas.height)
        this._xAxisInstance.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._areaInstance._canvas.height)
    }
}
