<template>
    <van-row class='profitLossItem' justify='space-between' type='flex'>
        <van-col class='hd'>
            <p class='title'>
                {{ $t( 'takeProfit'===type?'trade.stopProfitPrice':'trade.stopLossPrice') }}
            </p>
            <p class='priceSecticon' :class="{ 'warn':warn }">
                <slot>{{ compareSymbol }} {{ compareNum|priceDigit(digits) }}</slot>
            </p>
        </van-col>
        <van-col class='bd'>
            <div @mousedown="active='stepper'" @touchstart="active='stepper'">
                <Stepper
                    class='stepper'
                    :class="{ 'warn':warn }"
                    :digits='digits'
                    :step='step'
                    :value='value'
                    @change='change'
                    @firstClick="$emit('firstClick')"
                />
            </div>
            <!-- <div @touchstart="active='dividing'" @mousedown="active='dividing'">
                <dividing
                    v-if="value && dividVal>=(product.groupSymbol.max_stop_level*-1) && dividVal<=product.groupSymbol.max_stop_level"
                    :value="dividVal"
                    @valueChange="DividChange"
                    class="dividing"
                    :max="product.groupSymbol.max_stop_level"
                    :min="product.groupSymbol.max_stop_level*-1"
                />
            </div>-->
        </van-col>

        <van-col>
            <button class='cleanBtn icon_huishou' :disabled="value===''" @click='changeNum'></button>
        </van-col>
    </van-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { Row, Col } from 'vant'
import Stepper from './stepper'
import { priceDigit } from '@/filters'
import { toFixed, plus, minus, mul } from '@/utils/calculation'
import Dividing from '@m/components/Dividing/index'
export default {
    name: 'ProfitLossItem',
    components: {
        [Col.name]: Col,
        [Row.name]: Row,
        Stepper,
        Dividing,
    },
    props: ['type', 'direction', 'from', 'step', 'value', 'digits', 'compareSymbol', 'compareNum', 'warn', 'product', 'orderPrice'],
    data () {
        return {
            num: '',
            dividVal: 0,
            active: ''
        }
    },
    computed: {
        ...mapGetters({
            'ko_openPrice': 'order/openPrice', // KO开仓价
        })
    },
    // watch: {
    //     value(val) {
    //         this.updateDividVal(val)
    //     },
    //     orderPrice(val) {
    //         if (this.value) {
    //             if (this.active == 'stepper') {
    //                 this.updateDividVal()
    //             } else if (this.active == 'dividing') {
    //                 this.DividChange(this.dividVal)
    //             }
    //         }

    //     }
    // },
    mounted () {
        this.updateDividVal(this.value)
    },
    methods: {
        change (newval) {
            this.num = newval
            this.$emit('change', newval)
        },
        changeNum () {
            this.change('')
        },
        priceDigit (val, digit) {
            return priceDigit(val, digit)
        },
        // 价格转点
        updateDividVal (val) {
            const product = this.product
            const _point = String(product.groupSymbol.pips_ratio).length - 1
            const _val = val || this.value
            const pip = product.ko_type ? 1 : product.groupSymbol.pip
            if (this.type == 'takeProfit') {
                // 止盈
                if (this.direction == 'buy') {
                    // 买入
                    this.dividVal = parseFloat(((_val - this.orderPrice) / pip).toFixed(_point))
                } else {
                    // 卖出
                    this.dividVal = parseFloat(((this.orderPrice - _val) / pip).toFixed(_point))
                }
            } else if (this.type == 'takeLoss') {
                // 止损
                if (this.direction == 'buy') {
                    // 买入
                    this.dividVal = parseFloat(((this.orderPrice - _val) / pip).toFixed(_point))
                } else {
                    // 卖出
                    this.dividVal = parseFloat(((_val - this.orderPrice) / pip).toFixed(_point))
                }
            }
        },
        DividChange (val) {
            this.dividVal = val
            // 更新value的值
            // 点转价格
            const pip = this.product.ko_type ? 1 : this.product.groupSymbol.pip
            const _changePoint = val * pip
            let _value = ''
            if (this.type == 'takeProfit') {
                if (this.direction == 'buy') {
                    _value = plus(_changePoint, this.orderPrice)
                } else {
                    _value = minus(this.orderPrice, _changePoint)
                }
            } else {
                if (this.direction == 'buy') {
                    _value = minus(this.orderPrice, _changePoint)
                } else {
                    _value = plus(_changePoint, this.orderPrice)
                }
            }
            console.log(_value)
            this.$emit('change', Number(_value).toFixed(this.digits || 2))
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.profitLossItem {
    padding: rem(30px) 0 rem(15px) 0;
    align-items: top;
    line-height: 1.5;
    font-size: rem(28px);
    .hd {
        flex: 1;
    }
    .bd {
        margin-right: rem(20px);
    }
    .priceSecticon {
        color: $muted;
        font-size: rem(20px);
        &.warn {
            color: $red;
        }
    }
}
.cleanBtn {
    padding: rem(20px);
    height: rem(80px);
    line-height: 1;
    font-size: rem(34px);
    background: #f9f9f9;
    &:not(:disabled) {
        @include active();
    }
    &:disabled {
        color: #c4c4c4;
    }
}
.stepper {
    &.warn {
        color: $red;
    }
}
.dividing {
    width: rem(340px);
}
</style>
