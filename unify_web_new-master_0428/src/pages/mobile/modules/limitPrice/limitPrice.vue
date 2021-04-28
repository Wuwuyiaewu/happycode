<template>
    <div class='limitPrice' :class='{ pc:isPC }'>
        <!-- <van-cell v-if="!hideTitleBar" class="limitPirceContent">
            <template slot="title">
                <span class="custom-title">{{$t('trade.limitPirce')}}</span>
                <span class="subTitle">{{$t('trade.priceMeet')}} {{direction==='buy'?$t('trade.buy'):$t('trade.sell')}}</span>
            </template>
            <template>
                <van-switch
                    v-model="enabled"
                    size="24px"
                    class="switch"
                    :active-color="style.subColor"
                    @click.native="_collect('限价')"
                />
            </template>
        </van-cell>-->
        <div v-bind='rangePrices' class='setBox'>
            <!-- <p
                class="errorFixedTip"
                v-if="warn"
            >{{$t('trade.pending')}}{{language=='en-US'?' ':''}}{{$t('trade.pendingPriceOutScopeTip',{start:priceDigit(min,digit),end:priceDigit(max,digit)})}}</p>-->
            <p v-if='warn' class='errorFixedTip limit-tip'>
                {{ warn }}
            </p>

            <PendingOrder
                :default-num='defaultPrice'
                :digits='product.groupSymbol.digits'
                :direction='direction'
                :max='rangePrices.b2'
                :min='rangePrices.b3'
                :product='product'
                :step='step'
                :tool='true'
                :warn='warn'
                @change='change'
                @firstClick='firstClick'
            />
        </div>
    </div>
</template>

<script>
import { Row, Col, Cell, Switch } from 'vant'
import { mapGetters } from 'vuex'
import PendingOrder from './pendingOrder'
import { plus, minus, toFixed } from '@/utils/calculation'
import { priceDigit } from '@/filters'
import { pendingRangePrices, pendingOrderStep, pendingMin, pendingMax, pendingPriceDefault } from '@/store/ix_utils'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'LimitPrice',
    mixins: [pcMixin],
    props: ['product', 'direction', 'config'],
    data () {
        return {
            defaultPrice: '',
            price: '',
            type: 2, // 挂单类型， 2限价  4停损
        }
    },
    computed: {
        ...mapGetters(['style']),
        warn () {
            const { b1, b2, b3, b4, b5, b6 } = this.rangePrices
            const price = this.price * 1
            const min = this.product.isStock ? b6 : b4
            const max = this.product.isStock ? b5 : b1
            if (price < b2 && price > b3) {
                return this.$t('trade.pendingPriceWarn')
            } else if (price < min || price > max) {
                return this.$t('trade.pendingPriceWarn2')
            } else {
                return false
            }
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        // 挂单价范围的价格点，返回对象里面的{b1,b2,b3,b4,b5,b6}按照原型里面的数据意义定义
        rangePrices () {
            return pendingRangePrices(this.product, this.direction === 'buy' ? 1 : 2)
        },
        step () { // 步长, 每次点击“+”“-”增减价格为1点转换成的价格值
            const product = this.product || {}
            return pendingOrderStep(product.groupSymbol)
        },
        digit () {
            return this.product.groupSymbol.digits
        }
    },
    // watch: {
    //     enabled(newval) {
    //         if (newval) this.initDefaultPrice()
    //         this.change(newval ? this.defaultPrice : '');
    //     },
    // },
    created () {
        const config = this.config
        const product = this.product
        if (config) {
            this.type = config.type
        }
        this.initDefaultPrice()
    },
    methods: {
        initDefaultPrice () {
            const config = this.config
            const product = this.product
            if (config) {
                this.defaultPrice = config.defaultPrice
                this.price = config.defaultPrice
            } else {
                this.defaultPrice = this.initPriceDefault() // 开仓设置默认挂单价
                this.price = this.defaultPrice
                this.$emit('priceChange', this.price)
            }
        },
        priceDigit (val, digit) {
            return priceDigit(val, digit)
        },
        // setType(val) {
        //     this.type = val;
        //     this.initDefaultPrice();
        //     this.change(this.defaultPrice);
        // },
        change (newval) {
            this.defaultPrice = newval
            this.price = newval
            this.$emit('priceChange', newval)
        },
        submit () {
            const price = Number(this.price)
            const product = this.product
            if (price == '') {
                this.$toast(this.$t('trade.pendingPriceEnpty'))
                return false
            } else if (this.warn) {
                return false
            }
            // 订单类型市价建仓（1）、限价建仓（2）、停损建仓（4）、市价平仓（8）
            //  a）买入方向：挂单价格低于买入价且在价格范围内，按【限价挂单】提交；挂单价格高于买入价且在价格范围内，按【停损挂单】提交
            //  b）卖出方向：挂单价格高于卖出价且在价格范围内，按【限价挂单】提交；挂单价格低于卖出价且在价格范围内，按【停损挂单】提交
            const { b1, b2, b3, b4, b5, b6 } = this.rangePrices
            let type
            if (this.direction === 'buy') {
                type = price < product.buy_price ? 2 : 4
            } else {
                type = price > product.sell_price ? 2 : 4
            }
            if (!type) {
                this.$toast(this.$t('pendingPriceEnpty'))
                return false
            }
            const params = {
                type: type,
                request_price: this.price,
            }
            return params
        },
        // 这只默认的挂单价
        initPriceDefault () {
            return pendingPriceDefault(this.product, this.direction === 'buy' ? 1 : 2)
        },
        firstClick () {
            this.defaultPrice = this.rangePrices.defaultPrice
            this.price = this.defaultPrice
            this.$emit('priceChange', this.price)
        }
    },
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Cell.name]: Cell,
        [Switch.name]: Switch,
        PendingOrder
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.limitPrice {
    background: #fff;
    .custom-title {
        font-size: rem(28px);
    }
    .subTitle {
        font-size: rem(20px);
        vertical-align: middle;
        color: $muted;
        margin-left: rem(14px);
    }
    .switch {
        float: right;
    }
    .cellBar {
        align-items: center;
        padding: 0 rem(30px) rem(40px);
    }
    .limitPirceContent {
        flex-wrap: nowrap;
        .van-cell__value {
            flex: none;
        }
    }
}
.errorFixedTip {
    position: fixed;
    z-index: 9;
    top: rem(90px);
    left: 0;
    width: 100%;
    height: rem(50px);
    line-height: rem(50px);
    background: rgba(255, 240, 226, 1);
    color: #e3525c;
    text-align: center;
    font-size: rem(24px);
}
.pc{
    .errorFixedTip{
        position: absolute;
    }
}
.radioGroup {
    .btn {
        min-width: rem(160px);
        padding: 0 rem(10px);
        height: rem(70px);
        line-height: rem(70px);
        text-align: center;
        color: #333;
        font-size: rem(28px);
        border-radius: rem(6px);
        &.mainColorBg {
            color: #fff;
        }
        & + .btn {
            margin-left: rem(20px);
        }
        &:disabled {
            opacity: 0.5;
        }
    }
}
</style>
