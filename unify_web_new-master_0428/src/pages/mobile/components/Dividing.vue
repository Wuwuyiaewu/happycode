<template>
    <div ref='container' class='container'>
        <div class='ruler_container'>
            <div class='interval left'>
                <div v-for='i in half.small' :key='i' class='scale'></div>
            </div>
            <div v-for='n in half.big' :key='n' class='interval left'>
                <div v-for='i in interval' :key='i' class='scale'></div>
            </div>
            <div v-for='n in count' :key='n' class='interval'>
                <div v-for='i in interval' :key='i' class='scale'></div>
                <span v-if='shownumber' class='number'>
                    {{ min + interval * (n - 1) }}
                </span>
                <span v-if='n == count && shownumber' class='after_number'>
                    {{ min + interval * n }}
                </span>
            </div>
            <div v-for='n in half.big' :key='n' class='interval right'>
                <div v-for='i in interval' :key='i' class='scale'></div>
            </div>
            <div class='interval right'>
                <div v-for='i in half.small' :key='i' class='scale'></div>
            </div>
        </div>
        <div class='pointer'>
            <span class='content'>
                <slot name='content'>
                    {{ value }}{{ $t('optional.pip') }}
                </slot>
            </span>
        </div>
    </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { throttle } from '@/store/ix_utils'
export default {
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 300
        },
        shownumber: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 10
        },
        value: {
            type: Number,
            default: 0
        },
        intervalwidth: {
            type: Number,
            default: 50
        }
    },
    data () {
        return {
            myDividing: null,
            scrollDom: null,
            scrollMin: 0,
            scrollMax: 0,
            half: {
                big: 0,
                small: 0
            },
            showMax: 100,
            showMin: 0,
            showMaxPoint: 0,
            active: false,
            localValue: null
        }
    },
    computed: {
        count () {
            return Math.ceil((this.showMax - this.showMin) / this.interval)
        }
    },
    watch: {
        'value' (val) {
            console.log(val)
            this.localValue = val
            if (!this.active) {
                if (val > this.showMax) {
                    let _showMax = val + 100
                    if (_showMax > this.max) {
                        _showMax = this.max
                    }
                    this.showMax = _showMax
                    this.$nextTick(() => {
                        this.setValue(val)
                    })
                } else {
                    this.setValue(val)
                }
            }
        }
    },
    mounted () {
        if (this.showMax < this.value) {
            this.showMax = this.value + 100
        }
        if (this.max < this.showMax) {
            this.showMax = this.max
        }
        this.showMin = this.min

        const width = this.$refs.container.getBoundingClientRect().width
        // 刻度尺一半宽度需要多少个大区间，向上取整
        const _half = (Math.ceil((width / 2 / this.intervalwidth) * 10) / 10).toString()
        this.half = {
            big: parseInt(_half.split('.')[0]),
            small: parseInt(_half.split('.')[1])
        }
        // 滚动条最小值
        this.scrollMin = -(parseFloat(_half) * this.intervalwidth - width / 2)
        // 滚动条最大值
        this.scrollMax = this.scrollMin - this.count * this.intervalwidth
        this.showMaxPoint = Math.ceil(this.width * 8 / this.intervalwidth)

        const throttleFun = throttle((ev) => {
            const _value = -Math.round((ev.x - this.scrollMin) / this.intervalwidth * this.interval) + this.showMin
            if (_value == this.localValue) {
                return
            }
            this.localValue = _value
            console.log(_value)
            this.$emit('valueChange', _value)
            // 计算添加卡尺然后更新 refresh
            if (this.myDividing.maxScrollX - ev.x > this.myDividing.maxScrollX * 0.3) {
                //
                this.showMax += 100
                this.$nextTick(() => {
                    this.myDividing.refresh()
                })
            }
        }, 200)

        this.$nextTick(() => {
            this.myDividing = new BScroll(this.$refs.container, {
                scrollX: true,
                probeType: 3,
                momentum: false
            })
            this.setValue()
            this.myDividing.on('scrollEnd', (ev) => {
                // 纠正距离
                let _value = -Math.round((ev.x - this.scrollMin) / this.intervalwidth * this.interval) + this.showMin
                if (_value < this.min) {
                    _value = this.min
                } else if (_value > this.max) {
                    _value = this.max
                }
                // 反算滚动距离
                this.setValue(_value)
                this.$emit('input', _value)
            })
            this.myDividing.on('scroll', (ev) => {
                // 计算值
                throttleFun(ev)
            })
            this.myDividing.on('scrollStart', (ev) => {
                this.active = true
            })
            this.myDividing.on('scrollEnd', (ev) => {
                // 计算值
                this.active = false
            })
        })
    },
    beforeDestroy () {
        this.myDividing.destroy()
    },
    methods: {
        setValue (val) {
            const scrollWidth = this.scrollMin - ((val || this.value) - this.showMin) / this.interval * this.intervalwidth
            this.myDividing.scrollTo(scrollWidth, 0, 0)
        },
        addMax () {
            this.showMax += 100
            this.$nextTick(() => {
                this.myDividing.refresh()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.container {
    position: relative;
    width: 100%;
    font-size: rem(20px);
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    .ruler_container {
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        height: rem(60px);
        padding-top: rem(24px);
        .interval {
            display: inline-block;
            box-sizing: border-box;
            position: relative;
            width: 50px;
            &.right,
            &.left {
                opacity: 0.2;
            }
            &::before {
                content: "";
                position: absolute;
                display: block;
                left: 0;
                top: 0;
                width: 1px;
                height: rem(28px);
                background: #666;
            }
            &last-child::after {
                content: "";
                position: absolute;
                display: block;
                right: 0;
                top: 0;
                width: 1px;
                height: rem(20px);
                background: #000;
            }
            .scale {
                margin-top: rem(8px);
                display: inline-block;
                box-sizing: border-box;
                height: rem(20px);
                width: 5px;
                &:not(:first-child) {
                    border-left: solid 1px #999;
                }
            }
            .after_number,
            .number {
                display: block;
                position: absolute;
                z-index: 2;
                top: rem(-24px);
            }
            .number {
                transform: translateX(-50%);
                left: 0;
            }
            .after_number {
                transform: translateX(50%);
                right: 0;
            }
        }
    }
    .pointer {
        position: absolute;
        left: 50%;
        top: rem(30px);
        z-index: 3;
        .content {
            position: relative;
            top: rem(-32px);
            display: inline-block;
            z-index: 5;
            margin-top: -10px;
            background-color: #000;
            transform: translateX(-50%);
            color: #fff;
            font-size: rem(18px);
            padding: 0 2px;
        }
        &:before {
            content: "";
            position: absolute;
            z-index: 3;
            left: 0;
            transform: translateX(-50%);
            bottom: 0;
            width: 0;
            height: 0;
            border-left: rem(10px) solid transparent;
            border-right: rem(10px) solid transparent;
            border-bottom: rem(18px) solid #000;
        }
        &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 3;
            width: 2px;
            height: rem(35px);
            transform: translateX(-50%);
            background-color: #000;
        }
    }
}
</style>
