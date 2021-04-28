<template>
    <div class='setBox' :class="{ 'orderProfitLoss': $route.name==='Order',pc:isPC }">
        <p v-show='profitWarn' class='errorFixedTip loss-warn'>
            {{ profitWarn }}
        </p>
        <p v-show='lossWarn' class='errorFixedTip loss-warn'>
            {{ lossWarn }}
        </p>

        <ProfitLossItem
            ref='loss'
            :class="[lossWarn?'warn':'']"
            :compare-num="profitStopRange[direction === 'buy'? 'L1':'L2']"
            :compare-symbol="direction === 'buy'?'≤':'≥'"
            :digits='digits'
            :direction='direction'
            :from='from'
            :order-price='price'
            :product='product'
            :step='step'
            type='takeLoss'
            :value='baseData.stop_loss'
            @change="change('stop_loss', $event)"
            @firstClick="firstClick('stop_loss')"
        />
        <!-- <p
            class="profitAmountTip"
            v-if="stop_loss && $refs.loss.dividVal<=max_stop_level && $refs.loss.dividVal>=(max_stop_level*-1)"
        >
            {{$t('trade.lossLabel')}}
            {{lossEstimate|priceDigit}}
            {{profit_currency}}
            <span
                v-if="profit_currency!==symbolCode"
            >，≈ {{lossEstimateAccountCurrency|priceDigit}} {{symbolCode}}</span>
        </p>-->

        <ProfitLossItem
            ref='profit'
            :class="[profitWarn?'warn':'']"
            :compare-num="profitStopRange[direction === 'buy'? 'P2':'P1']"
            :compare-symbol="direction === 'buy'?'≥':'≤'"
            :digits='digits'
            :direction='direction'
            :from='from'
            :order-price='price'
            :product='product'
            :step='step'
            type='takeProfit'
            :value='baseData.take_profit'
            @change="change('take_profit', $event)"
            @firstClick="firstClick('take_profit')"
        />
        <!-- <p
            class="profitAmountTip"
            v-if="take_profit && $refs.profit.dividVal<=max_stop_level && $refs.profit.dividVal>=(max_stop_level*-1)"
        >
            {{$t('trade.profitLabel')}}
            {{profitEstimate|priceDigit}}
            {{profit_currency}}
            <span
                v-if="profit_currency!==symbolCode"
            >，≈ {{profitEstimateAccountCurrency|priceDigit}} {{symbolCode}}</span>
        </p>-->
    </div>
</template>

<script>
/**
 * 1、市价卖
 止损价格范围：卖价+最小点数转价格<=X<=卖价+最大点数转价格
 止盈价格范围：卖价-最大点数转价格 <=X<=卖价-最小点数转价格
 2、市价买
 止损价格范围：买价-最大点数转价格<=X<=买价-最小点数转价格
 止盈价格范围：买价+最小点数转价格<=X<=买价+最大点数转价格
 */
import { mapState, mapGetters } from 'vuex'
import ProfitLossItem from '@m/components/profitLossItem'
import { plus, minus, toFixed } from '@/utils/calculation'
import { profitLossPriceCompare } from '@/utils/checkProfitLoss'
import { profitStopStep, profitStopRange, profitLossPriceDefault, priceTransformToUSD, USDToFee, feeToUSD } from '@/store/ix_utils'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'ProfitLoss',
    mixins: [pcMixin],
    model: {
        prop: 'baseData',
        event: 'changeBaseData'
    },
    props: ['product', 'direction', 'from', 'baseData', 'pendingOrderPrice', 'digits', 'positionClosePrice', 'volume', 'openPrice'],
    data () {
        return {
            take_profit: '', // 止盈价格
            stop_loss: '' // 止损价格
        }
    },
    computed: {
        ...mapState({
            product_toUSD: state => state.ix_quote.product_toUSD,
        }),
        ...mapGetters(['style', 'symbolCode', 'usdcny', 'usdcnyRate', 'accountCurrency']),
        price () {
            const product = this.product || {}
            const direction = this.direction
            let price = direction === 'buy' ? product.buy_price : product.sell_price
            price = this.pendingOrderPrice ? this.pendingOrderPrice : price
            price = this.positionClosePrice ? this.positionClosePrice : price // 持仓里面取平仓价
            return price
        },
        max_stop_level () {
            return this.product.groupSymbol.max_stop_level
        },
        profit_currency () {
            return this.product.groupSymbol.profit_currency
        },
        profitToUSD () {
            return this.product_toUSD[this.profit_currency + 'USD']
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        step () { // 步长, 每次点击“+”“-”增减价格为1点转换成的价格值
            return profitStopStep(this.product.groupSymbol)
        },
        profitStopRange () {
            const product = this.product
            const price = this.price
            return profitStopRange(price, product, this.direction === 'buy' ? 1 : 2)
        },
        profitWarn () {
            const { profitStopRange, product, direction, take_profit } = this
            const dire = direction === 'buy' ? 1 : 2
            return this.take_profit && profitLossPriceCompare('profit', dire, take_profit, profitStopRange, product, this.$t.bind(this))
        },
        lossWarn () {
            const { profitStopRange, product, direction, stop_loss } = this
            const dire = direction === 'buy' ? 1 : 2
            return this.stop_loss && profitLossPriceCompare('stopLoss', dire, stop_loss, profitStopRange, product, this.$t.bind(this))
        },
        // 预计亏损 盈利货币
        lossEstimate () {
            let diffPrice = 0
            const price = this.from === 'zyzs' ? this.openPrice : this.price
            if (this.direction === 'buy') {
                diffPrice = minus(this.stop_loss, price)
            } else {
                diffPrice = minus(price, this.stop_loss)
            }
            const volume = this.volume > 0 ? this.volume : 0
            diffPrice = diffPrice * this.product.groupSymbol.contract_size * volume
            return diffPrice
        },
        // 预计亏损 账户货币
        lossEstimateAccountCurrency () {
            let price = this.lossEstimate
            if (this.profit_currency !== 'USD') price = feeToUSD(price, this.profitToUSD) // 算出USD币种
            if (this.accountCurrency === 'CNY') price = USDToFee(price, this.usdcny) // 算出CNY币种
            return price
        },
        // 预计盈利
        profitEstimate () {
            let diffPrice = 0
            const price = this.from === 'zyzs' ? this.openPrice : this.price
            if (this.direction === 'buy') {
                diffPrice = minus(this.take_profit, price)
            } else {
                diffPrice = minus(price, this.take_profit)
            }
            const volume = this.volume > 0 ? this.volume : 0
            diffPrice = diffPrice * this.product.groupSymbol.contract_size * volume
            return diffPrice
        },
        // 预计盈利 账户货币
        profitEstimateAccountCurrency () {
            let price = this.profitEstimate
            if (this.profit_currency !== 'USD') price = feeToUSD(price, this.profitToUSD) // 算出USD币种
            if (this.accountCurrency === 'CNY') price = USDToFee(price, this.usdcny) // 算出CNY币种
            return price
        },

    },
    beforeDestroy () {
        this.$emit('changeBaseData', {
            take_profit: '', // 止盈价格
            stop_loss: '' // 止损价格
        })
    },
    components: {
        ProfitLossItem
    },
    methods: {
        // 止盈止损价格变动事件
        change (type, newval) {
            this.take_profit = this.baseData.take_profit
            this.stop_loss = this.baseData.stop_loss
            this[type] = newval
            this.$emit('changeBaseData', {
                take_profit: this.take_profit, // 止盈价格
                stop_loss: this.stop_loss // 止损价格
            })
        },
        firstClick (type) {
            const { product, direction } = this
            const price = profitLossPriceDefault(type === 'stop_loss' ? 1 : 2, product, direction === 'buy' ? 1 : 2, this.price)
            this[type] = toFixed(price, product.digit)
            this.$emit('changeBaseData', {
                take_profit: this.take_profit, // 止盈价格
                stop_loss: this.stop_loss // 止损价格
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.profitLossSetBar {
    background: #fff;
}
.orderProfitLoss .errorFixedTip {
    top: rem(90px);
}
.errorFixedTip {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: rem(50px);
    line-height: rem(50px);
    background: rgba(255, 240, 226, 1);
    color: #e3525c;
    text-align: center;
    font-size: rem(24px);
}
.warn ::v-deep {
    .priceSecticon,
    .inputEl {
        color: $red;
    }
}
.profitAmountTip {
    margin-top: rem(-10px);
    margin-left: rem(160px);
    color: $muted;
    text-align: center;
    font-size: rem(20px);
}
</style>
