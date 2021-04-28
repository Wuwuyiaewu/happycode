<template>
    <div class='stepper'>
        <button ref='minus' class='minus van-stepper__minus' :disabled='value<=min && controlbtn' @click='minus'></button>
        <input
            class='input inputEl'
            :placeholder='placeholderText'
            type='number'
            :value='value'
            @blur='blur'
            @input='input'
        />
        <button ref='plus' class='plus van-stepper__plus' :disabled='value>=max && controlbtn' @click='plus'></button>
    </div>
</template>

<script>

import { plus, minus, toFixed, getDecimalNum } from '@/utils/calculation'
import { addEvent } from '@/utils/bindEvent'
export default {
    name: 'Stepper',
    props: {
        digits: {
            type: Number,
            default: 2
        },
        value: {
            type: [Number, String],
            default: 3
        },
        step: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: Infinity
        },
        placeholder: {
            type: [Number, String],
            default: ''
        },
        controlbtn: {
            default: false,
            type: Boolean
        }
    },
    data () {
        return {
            data: 'value'
        }
    },
    computed: {
        placeholderText () {
            return this.placeholder || this.$t('noSetup')
        }
    },
    mounted () {
        this.initEvent()
    },
    methods: {
        minus () {
            let curval = (this.value == '' || this.value == 'NaN') && this.max && this.max !== Infinity ? this.max : this.value
            if (this.controlbtn) {
                curval = this.value || 0
            }

            if (this.controlbtn && curval <= this.min) {
                return
            }
            const newval = minus(curval, this.step)
            this.$emit('input', toFixed(newval, this.digits))
            this.$emit('change', toFixed(newval, this.digits))
            if (this.value == '') this.$emit('firstClick')
        },
        input (e) {
            let newval = e.target.value
            const digits = this.digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            this.$emit('input', newval)
            this.$emit('change', newval)
        },
        blur (e) {
            const value = e.target.value
            value ? toFixed(value, this.digits) : value
            this.$emit('change', value)
        },
        plus () {
            const curval = this.value == '' || this.value == 'NaN' && this.min ? this.min : this.value
            if (this.controlbtn && curval >= this.max) {
                return
            }
            const newval = plus(curval, this.step)
            this.$emit('input', toFixed(newval, this.digits))
            this.$emit('change', toFixed(newval, this.digits))
            if (this.value == '') this.$emit('firstClick')
        },
        longPressStep (type) {
            const timer = Date.now() - this.longPressTimerStart > 3000 ? 50 : 200
            this.longPressTimer = setTimeout(() => {
                this[type]()
                this.longPressStep(type)
            }, timer)
        },
        initEvent () {
            if (window.isPC) return
            const minus = this.$refs.minus
            const plus = this.$refs.plus
            const touchFn = (e) => {
                e.stopPropagation()
                e.preventDefault()
                const target = e.target
                const type = target.classList.contains('minus') ? 'minus' : 'plus'
                this[type]()
                this.longPressTimerStart = Date.now()
                this.longPressTimer = setTimeout(() => {
                    this.longPressStep(type)
                }, 600)
                return false
            }
            const touchendFn = (e) => {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer)
                }
            }
            addEvent(minus, 'touchstart', touchFn)
            addEvent(plus, 'touchstart', touchFn)
            addEvent(minus, 'touchend', touchendFn)
            addEvent(plus, 'touchend', touchendFn)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.stepper {
    font-size: 0;
    background: rgba(249, 249, 249, 1);
    button,
    input {
        vertical-align: middle;
        width: rem(80px);
        height: rem(80px);
        text-align: center;
        line-height: 1;
        background: none;
    }
    .input {
        font-size: rem(28px);
        width: rem(180px);
        color: inherit;
    }
    button {
        font-size: rem(28px);
        font-weight: 400;
        color: $text;
        &:disabled {
            color: $muted;
        }
    }
    .van-stepper__minus::before,
    .van-stepper__plus::before {
        width: 30%;
        border-color: transparent;
    }
    .van-stepper__plus::after {
        height: 30%;
        border-color: transparent;
    }
}
</style>
