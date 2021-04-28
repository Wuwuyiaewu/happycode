import { getCoordinate, getCorssData } from './utils.js'
import { globalStorage } from './config.js'

// 横坐标图
export class InitXAxis {
    constructor (options) {
        this._canvas = options.el
        this.ctx = this._canvas.getContext('2d')

        this._options = options
        this._crossE = 0
        this.isShowCross = false
        this._draw()
    }

    _draw (e) {
        const { ctx } = this
        ctx.clearRect(0, 0, globalStorage.style.canvasWidth, this._canvas.height)

        ctx.save()
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, globalStorage.style.canvasWidth, globalStorage.style.areaCanvasHeight)

        // 渲染横坐标
        if (globalStorage.start_time) {
            this._drawPoint({
                x: 2,
                time: globalStorage.start_time,
                textAlign: 'left',
                offsetX: 5
            })
        }
        if (globalStorage.end_time) {
            this._drawPoint({
                x: this._canvas.width - 2,
                time: globalStorage.end_time,
                textAlign: 'right',
                offsetX: -5
            })
        }
        ctx.restore()

        e && (this._crossE = e)
        this.isShowCross && (e || this._crossE) && this._drawCrossValue(e)
    }

    // 绘画单个坐标点
    _drawPoint (options) {
        const { ctx } = this
        const { textAlign = 'center', x, time, offsetX } = options
        ctx.save()
        ctx.beginPath()
        ctx.translate(0.5, 0.5)
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 4 * window.devicePixelRatio)
        ctx.strokeStyle = '#505361'
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.stroke()

        // 时间显示
        const M = ('0' + (new Date(time).getMonth() + 1)).substr(-2)
        const d = ('0' + new Date(time).getDate()).substr(-2)
        const h = ('0' + new Date(time).getHours()).substr(-2)
        const m = ('0' + new Date(time).getMinutes()).substr(-2)
        ctx.font = globalStorage.style.font
        ctx.fillStyle = '#505361'
        ctx.textAlign = textAlign
        ctx.fillText(`${M}/${d} ${h}:${m}`, x + offsetX * window.devicePixelRatio, 20 * window.devicePixelRatio)
        ctx.restore()
    }

    // 绘画十字光标对应的x值
    _drawCrossValue (e) {
        const coordinate = getCoordinate(e || this._crossE)
        const x = Math.round(coordinate.x)

        const { ctx } = this
        const target = getCorssData({ x }, globalStorage.data)
        if (!target) {
            return
        }
        const { time } = target
        const positionX = Math.floor(x - 40 * window.devicePixelRatio)
        const rectWidth = 80 * window.devicePixelRatio
        const rectMinX = 0
        const rectMaxX = globalStorage.style.canvasWidth - rectWidth
        const rectX = Math.floor(positionX >= 0 ? (positionX <= rectMaxX ? positionX : rectMaxX) : rectMinX)

        // const textMinX = rectWidth / 2
        // const textMaxX = globalStorage.style.canvasWidth - rectWidth / 2
        // const textX = x >= textMinX ? (x <= textMaxX ? x : textMaxX) : textMinX
        // const textX = Math.floor(rectX + rectWidth / 2)
        // console.log(rectX - textX)
        const textX = rectX + 8 * window.devicePixelRatio
        ctx.save()
        // 矩形框
        ctx.fillStyle = 'rgb(76,82,94)'
        ctx.fillRect(rectX, 0, rectWidth, 15 * window.devicePixelRatio)
        // 文字
        const M = ('0' + (new Date(time * 1000).getMonth() + 1)).substr(-2)
        const d = ('0' + new Date(time * 1000).getDate()).substr(-2)
        const h = ('0' + new Date(time * 1000).getHours()).substr(-2)
        const m = ('0' + new Date(time * 1000).getMinutes()).substr(-2)
        ctx.font = globalStorage.style.font
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'left'
        ctx.fillText(`${M}/${d} ${h}:${m}`, textX, 11 * window.devicePixelRatio)
        ctx.restore()
    }
}
