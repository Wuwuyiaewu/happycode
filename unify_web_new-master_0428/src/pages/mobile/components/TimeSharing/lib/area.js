import { getCoordinate, priceToYAxis, getCorssData, getCriticalValue, priceDigit, yAxisToPrice } from './utils.js'
import { globalStorage } from './config.js'

// 面积图
export class InitArea {
    constructor (options) {
        this._init(options)
        this._drawArea()
    }

    _init (options) {
        this._options = options
        this._canvas = this._options.el
        this.ctx = this._canvas.getContext('2d')

        // 渐变色
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 1)
        gradient.addColorStop(0, 'rgba(61,114,228,0.3)')
        gradient.addColorStop(1, 'rgba(61,114,228,0.1)')
        this._bgColor = gradient
    }

    _drawArea () {
        if (globalStorage.data.length === 0) {
            return
        }

        const { ctx } = this
        // 绘制背景色
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, globalStorage.style.canvasWidth, globalStorage.style.areaCanvasHeight)

        ctx.save()

        // 绘制曲线
        ctx.beginPath()
        ctx.lineWidth = 1 * window.devicePixelRatio
        globalStorage.data.forEach((item, i) => {
            ctx.lineTo(item.x, item.y)
        })
        ctx.strokeStyle = 'rgb(71, 127, 211)'
        ctx.stroke()

        ctx.lineTo(globalStorage.data[globalStorage.data.length - 1].x, this._canvas.height)
        // 路径闭合
        globalStorage.data.length && ctx.lineTo(globalStorage.data[0].x, this._canvas.height)

        ctx.fillStyle = this._bgColor
        ctx.fill()
        ctx.restore()

        this._drawOpenLine()
        this._drawPoint()
    }

    // 平均价格
    get averagePrice () {
        const result = globalStorage.data.reduce((total, cur) => {
            return total + cur.close
        }, 0) / globalStorage.data.length

        return result.toFixed(2)
    }

    // 中轴线(当天开盘价)
    _drawOpenLine () {
        const { ctx } = this
        const y = Math.round(globalStorage.style.areaCanvasHeight / 2)
        ctx.save()
        ctx.beginPath()
        ctx.translate(0.5, 0.5)
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.moveTo(0, y)
        ctx.lineTo(globalStorage.style.canvasWidth, y)
        ctx.setLineDash([4 * window.devicePixelRatio, 4 * window.devicePixelRatio]) // [实线长度, 间隙长度]
        ctx.lineDashOffset = 0
        ctx.strokeStyle = 'rgba(200, 200, 200, 1)'
        ctx.stroke()

        ctx.font = globalStorage.style.font
        ctx.textAlign = 'left'
        ctx.fillStyle = '#666'
        ctx.fillText(priceDigit(globalStorage.closePrice, globalStorage.digit), 12 * window.devicePixelRatio, globalStorage.style.areaCanvasHeight / 2 - 5 * window.devicePixelRatio)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#aaa'
        ctx.fillText(priceDigit(0, 2) + '%', globalStorage.style.canvasWidth - 12 * window.devicePixelRatio, globalStorage.style.areaCanvasHeight / 2 - 5 * window.devicePixelRatio)

        ctx.restore()
    }

    // 上下坐标点、涨跌幅
    _drawPoint () {
        const { ctx } = this
        const { upperPoint, bottomPoint } = getCriticalValue()
        const { closePrice, style, digit, colors } = globalStorage
        const upperChange = (upperPoint - closePrice) / closePrice * 100
        const bottomChange = (bottomPoint - closePrice) / closePrice * 100

        ctx.save()
        ctx.font = globalStorage.style.font

        ctx.fillStyle = colors.up
        ctx.textAlign = 'left'
        ctx.fillText(priceDigit(upperPoint, digit), 12 * window.devicePixelRatio, 16 * window.devicePixelRatio)
        ctx.textAlign = 'right'
        ctx.fillText(priceDigit(upperChange, 2) + '%', style.canvasWidth - 12 * window.devicePixelRatio, 16 * window.devicePixelRatio)

        ctx.fillStyle = colors.down
        ctx.textAlign = 'left'
        ctx.fillText(priceDigit(bottomPoint, digit), 12 * window.devicePixelRatio, style.areaCanvasHeight - 6 * window.devicePixelRatio)
        ctx.textAlign = 'right'
        ctx.fillText(priceDigit(bottomChange, 2) + '%', style.canvasWidth - 12 * window.devicePixelRatio, style.areaCanvasHeight - 6 * window.devicePixelRatio)

        ctx.restore()
    }
}

// 面积交互
export class InitCorss {
    constructor (options) {
        this._canvas = options.el
        this.ctx = this._canvas.getContext('2d')

        this._options = options

        this._crossE = null
        this.isShowCross = false
        this._drawRound()
    }

    _draw (e) {
        e && (this._crossE = e)
        this.ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._canvas.height)
        this.isShowCross && (e || this._crossE) && this._drawCrossLine(e)
    }

    // 绘画十字线
    _drawCrossLine (e) {
        const { ctx } = this
        const coordinate = getCoordinate(e || this._crossE)
        const x = Math.round(coordinate.x)
        const y = Math.round(coordinate.y)

        ctx.save()
        ctx.beginPath()
        ctx.translate(0.5 / window.devicePixelRatio, 0.5 / window.devicePixelRatio)
        ctx.setLineDash([5 * window.devicePixelRatio, 8 * window.devicePixelRatio]) // [实线长度, 间隙长度]
        ctx.lineDashOffset = 0
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.strokeStyle = '#000'
        ctx.moveTo(0, y)
        ctx.lineTo(this._canvas.width, y)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, this._canvas.height)
        ctx.stroke()
        ctx.restore()

        const { digit, closePrice, style } = globalStorage
        const price = priceDigit(yAxisToPrice(y), digit)
        const priceChange = priceDigit((price - closePrice) / closePrice * 100, 2) + '%'
        ctx.save()
        ctx.beginPath()
        // ctx.fillStyle = '#000'
        // let rectWidth = (price + '').length * 8
        // ctx.rect(0, y - 8 * window.devicePixelRatio, (price + '').length * 8, 16)
        // ctx.fill()
        ctx.font = style.font
        ctx.textAlign = 'left'
        ctx.fillStyle = '#333'
        ctx.fillText(price, 12 * window.devicePixelRatio, y - 4 * window.devicePixelRatio)

        ctx.beginPath()
        // ctx.fillStyle = '#000'
        // rectWidth = (priceChange + '').length * 8 * window.devicePixelRatio + 5 * window.devicePixelRatio
        // ctx.rect(style.canvasWidth - rectWidth, y - 8 * window.devicePixelRatio, rectWidth, 16 * window.devicePixelRatio)
        // ctx.fill()
        ctx.font = style.font
        ctx.textAlign = 'right'
        ctx.fillStyle = '#333'
        ctx.fillText(priceChange, style.canvasWidth - 12 * window.devicePixelRatio, y - 5 * window.devicePixelRatio)
        ctx.restore()
        this._drawColumnPrice(e)
    }

    // 对应列的价格显示
    _drawColumnPrice (e) {
        const { ctx } = this
        const coordinate = getCoordinate(e || this._crossE)
        const x = coordinate.x
        const _y = coordinate.y
        const target = getCorssData({ x, y: _y }, globalStorage.data)
        if (!target) {
            return
        }

        const { close: price } = target
        const { closePrice, digit, style } = globalStorage
        const y = target.y

        ctx.save()
        ctx.translate(0.5, 0.5)
        ctx.beginPath()
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.arc(x, y, 3 * window.devicePixelRatio, 0, Math.PI * 2, false)
        ctx.fillStyle = '#f6822f'
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(this._canvas.width, y)
        ctx.setLineDash([5 * window.devicePixelRatio, 5 * window.devicePixelRatio]) // [实线长度, 间隙长度]
        ctx.lineDashOffset = 0
        ctx.strokeStyle = '#f6822f'
        ctx.stroke()

        // ctx.fillStyle = 'rgb(76,82,94)'
        // ctx.fillRect(globalStorage.style.canvasWidth - 60 * window.devicePixelRatio, y - 10 * window.devicePixelRatio, 60 * window.devicePixelRatio, 20 * window.devicePixelRatio)
        ctx.font = globalStorage.style.font
        ctx.fillStyle = '#f6822f'
        ctx.textAlign = 'center'
        ctx.fillText(price, 30 * window.devicePixelRatio, y - 5 * window.devicePixelRatio)

        const priceChange = (price - closePrice) / closePrice * 100
        ctx.textAlign = 'right'
        ctx.fillText(priceDigit(priceChange, 2) + '%', style.canvasWidth - 12 * window.devicePixelRatio, y - 5 * window.devicePixelRatio)

        ctx.restore()
    }

    _drawRound () {
        const { ctx } = this
        let zoom = 2
        let direction = 1
        drawRound.call(this, zoom)

        function drawRound () {
            const leng = globalStorage.data.length
            if (leng) {
                const { x, y, time: lastTime } = globalStorage.data[leng - 1]
                const { end_time } = globalStorage
                if (lastTime >= Math.floor(end_time / 1000 - end_time / 1000 % 60)) {
                    // 休市停止闪烁
                    return
                }

                ctx.save()
                ctx.beginPath()
                ctx.fillStyle = 'rgba(71, 127, 211, 1)'
                ctx.arc(x, y, 2 * window.devicePixelRatio, 0, Math.PI * 2, true)
                ctx.fill()
                ctx.restore()

                ctx.save()
                ctx.fillStyle = 'rgba(71, 127, 211, 0.28)'
                ctx.arc(x, y, zoom * window.devicePixelRatio, 0, Math.PI * 2, true)
                ctx.fill()
                ctx.restore()

                if (zoom > 9) {
                    zoom = 9
                    direction *= -1
                } else if (zoom < 2) {
                    zoom = 2
                    direction *= -1
                }

                zoom += direction * zoom / 40
            }

            requestAnimationFrame(() => {
                this._draw()
                drawRound.call(this, zoom)
            },)
        }
    }
}
