<template>
    <div class='m-svgpercent'>
        <svg
            class='doughnut-svg'
            :height='svgData.height'
            :viewBox='`0 0 ${svgData.width} ${svgData.height}`'
            :width='svgData.width'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                v-for='(cur, index) in renderList'
                :key='index'
                :d='cur | getPath(arcData)'
                fill='none'
                :stroke='cur.color'
                :stroke-width='arcData.stockWidth'
            />
        </svg>
        <div class='centerInfo'>
            <div class='title'>
                {{ $t('trade.netAssets') }}
            </div>
            <div class='val'>
                {{ typeof jz == "number"? jz.toFixed(2):'--' }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SvgPercent',
    filters: {
        getPath (cur, arcData) {
            // 这里在通过 圆心(x0, y0) r ,拼接好路径数据
            const { x0, y0, r } = arcData
            let str = 'M'
            const isLargeArc = cur.relayPer > 50 ? 1 : 0
            const startX = cur.start.x * r + x0
            const startY = cur.start.y * r + y0
            const endX = cur.end.x * r + x0
            let endY = cur.end.y * r + y0
            endY = endY.toFixed(0) === '100' ? 99.99 : endY
            str += ' ' + startX +
                ' ' + startY +
                ' ' + 'A' +
                ' ' + r +
                ' ' + r +
                ' ' + '0' +
                ' ' + isLargeArc +
                ' ' + '1' +
                ' ' + endX +
                ' ' + endY
            return str
        }
    },
    props: {
        dataList: {
            type: Array,
            default () {
                return []
            }
        },
        jz: {
            default: ''
        }
    },
    data: function () {
        return {
            svgData: { // svg 数据 即画布参数
                width: 200,
                height: 200
            },
            arcData: { // 环形图参数
                r: 84, // 环形图的半径
                x0: 100, // 圆心x，一般把环形图放在画布中心位置就好
                y0: 95, // 同上
                stockWidth: 16 // 环形图的粗度...
            }
        }
    },
    computed: {
        renderList () {
            return this.handleChartData(this.dataList)
        }
    },
    methods: {
        handleChartData (list) {
            // 这里按照 圆心点为(0,0), r 为 1 来处理
            const newList = []
            let total = 0
            list.forEach(item => {
                total += item.value
            })
            list.forEach((item, index) => {
                const obj = {}
                let per = +(item.value / total) * 100
                // 保留真实占比,后面需要判断是否是大小弧
                obj.color = item.color
                obj.relayPer = per
                if (index !== 0) {
                    per += newList[index - 1].per
                }
                // 因为是拼接，所以本次的终点要在之前的基础上，所要要累加占比
                obj.per = per
                const deg = ((per - 0.0001) / 100) * Math.PI * 2
                obj.start = {}
                obj.end = {}
                if (index === 0) {
                    obj.start.x = Math.cos(0)
                    obj.start.y = Math.sin(0)
                } else {
                    obj.start = newList[index - 1].end
                }
                obj.end.x = Math.cos(deg)
                obj.end.y = Math.sin(deg)
                newList.push(obj)
            })

            return newList
        }
    }
}
</script>

<style lang="scss" scoped>
.m-svgpercent {
    position: relative;
    .doughnut-svg {
        display: inline-block;
        transform: rotate(-90deg);
    }
    .centerInfo {
        position: absolute;
        top: 30%;
        left: 52%;
        margin-left: -90px;
        width: 155px;
        .title {
            color: #333;
            margin-bottom: 5px;
        }
        .val {
            font-weight: 500;
            color: #000;
            font-size: 28px;
        }
    }
}
</style>
