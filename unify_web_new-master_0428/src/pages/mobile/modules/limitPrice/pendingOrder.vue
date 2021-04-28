<template>
    <div class='pendingOrder'>
        <van-row class='pendingOrderSet' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ $t('trade.priceLabel') }}
                    <van-icon
                        v-if="$route.name==='Order'"
                        class='alignmiddle muted'
                        name='question-o'
                        size='14'
                        @click='priceIntroduce'
                    />
                </p>
                <!-- <p class="priceSecticon">{{min|priceDigit(digits)}} - {{max|priceDigit(digits)}}</p> -->
                <p
                    class='priceSecticon'
                    :class="{ 'warn':warn }"
                >
                    ≤ {{ min|priceDigit(digits) }} {{ $t('or') }} ≥ {{ max|priceDigit(digits) }}
                </p>
            </van-col>
            <van-col class='relative'>
                <transition name='fade'>
                    <ToolTip v-if='toolTipVisible && num' class='toolTipWrapper'>
                        {{ tipText }}
                    </ToolTip>
                </transition>
                <Stepper
                    v-model='num'
                    class='stepper'
                    :class="{ 'warn':warn }"
                    :digits='digits'
                    :max='max'
                    :min='min'
                    :step='step'
                    @change='change($event)'
                    @firstClick="$emit('firstClick')"
                />
            </van-col>
        </van-row>
    </div>
</template>

<script>
/**
 *  价格范围
    限价卖出： 卖价+最小点数转价格 <=X<=卖价+最大点数转价格
    限价买入： 买价-最大点数转价格  <=X<=买价-最小点数转价格

    停损卖出： 卖价-最大点数转价格 <=X<=卖价-最小点数转价格
    停损买入： 买价+最小点数转价格 <=X<=买价+最大点数转价格
 */
import { Row, Col } from 'vant'
import Stepper from '@m/components/stepper'
import ToolTip from '@m/components/toolTip'
import { toFixed } from '@/utils/calculation'
export default {
    name: 'PendingOrder',
    components: {
        [Col.name]: Col,
        [Row.name]: Row,
        Stepper,
        ToolTip,
    },
    props: ['max', 'min', 'step', 'warn', 'digits', 'defaultNum', 'tool', 'direction', 'product'],
    data () {
        return {
            num: '',
            toolTipVisible: false,
        }
    },
    computed: {
        tipText () {
            const product = this.product
            const price = this.direction === 'buy' ? product.buy_price : product.sell_price
            const compare = this.$t(Number(this.num) < price ? 'trade.below' : 'trade.higher')
            const priceLabel = this.$t(this.direction === 'buy' ? 'trade.buyPrice' : 'trade.sellPrice')
            let rate = ''
            if (product.isStock) {
                rate = toFixed(Math.abs(this.num - price) * 100 / price, 2) + '%'
            } else {
                const spDigit = String(product.groupSymbol.pips_ratio).length - 1 // 点差小数位
                rate = toFixed(Math.abs(this.num - price) / product.groupSymbol.pip, spDigit) + this.$t('trade.point')
            }
            return compare + priceLabel + rate
        }
    },
    watch: {
        defaultNum (newval) {
            this.num = newval
        },
    },
    created () {
        if (this.defaultNum) this.num = this.defaultNum
        this.watchNum()
    },
    methods: {
        change (n) {
            this.$emit('change', n)
            this.num = n
        },
        watchNum () {
            this.$watch('num', function () {
                if (this.st) clearTimeout(this.st)
                this.toolTipVisible = true
                this.st = setTimeout(() => {
                    this.toolTipVisible = false
                }, 2000)
            })
        },
        priceIntroduce () {
            this.$dialog.alert({
                title: this.$t('trade.priceIntroduce'),
                message: this.$t('trade.priceIntroContent'),
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.pendingOrder {
    align-items: center;
    line-height: 1.5;
    font-size: rem(28px);
    .priceSecticon {
        color: $muted;
        font-size: rem(20px);
        &.warn {
            color: $red;
        }
    }
}
.stepper {
    &.warn {
        color: $red;
    }
}
.toolTipWrapper {
    position: absolute !important;
    z-index: 10;
    bottom: 100%;
    left: 0;
    right: 0;
}
</style>
