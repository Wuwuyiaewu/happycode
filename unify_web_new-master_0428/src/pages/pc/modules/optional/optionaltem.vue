<template>
    <div v-if='product.code_id' class='productItem'>
        <div class='cell'>
            <div class='th' @click='toDetail(product)'>
                <span
                    class='name'
                    :class="{
                        'mainColor':product.selfSymbol && product.selfSymbol.inPosition,
                        'small': product.simplified && getStringLength(product.simplified) > 16,
                        'mini': product.simplified && getStringLength(product.simplified) > 20
                    }"
                >
                    {{ product.simplified }}
                </span>
                <span v-if='product.symbolIcon && product.symbolIcon.includes(1)' class='iconHot icon_icon_hot'></span>
                <span v-if='product.symbolIcon && product.symbolIcon.includes(2)' class='iconHui icon_icon_offer'></span>
                <p class='short_name' v-html='formatProductCode(product,lang)'></p>
                <div class='riseLenght'>
                    <span :class='product.upDownColor'>
                        <template
                            v-if='displayType == 1'
                        >
                            {{ product.upDownAmount_pip | filterNumberSign }}{{ product.upDownAmount_pip | filterPipUnit }}
                        </template>
                        <template v-else>
                            {{ product.upDownAmount | filterNumberSign }}
                        </template>
                    </span>
                    <span :class='product.upDownColor'>
                        {{ product.upDownWidth | filterNumberSign }}
                    </span>
                    <!-- <span :class="product.cur_color">{{ product.cur_price }}</span> -->
                </div>
            </div>
            <div class='ft actionBox'>
                <div class='btn-wrap'>
                    <button
                        class='btn'
                        :class="[product.sell_color + 'Bg', product.ko_type===1?'disabled':'']"
                        @click.stop="toOrder(product, 'sell')"
                    >
                        <span
                            class='row'
                        >
                            {{ !product.sell_price && product.sell_price != 0 ? '--' : product.sell_price }}
                        </span>
                        <span class='row direction'>
                            {{ $t(product.ko_type ? 'bear' :'trade.sell') }}
                        </span>
                    </button>
                    <div v-if='product.spread_text' class='spread_text'>
                        <span>{{ product.spread_text }}</span>
                    </div>
                    <button
                        class='btn'
                        :class="[product.buy_color + 'Bg',product.ko_type===2?'disabled':'']"
                        @click.stop="toOrder(product, 'buy')"
                    >
                        <span class='row'>
                            {{ !product.buy_price && product.buy_price != 0 ? '--' : product.buy_price }}
                        </span>
                        <span class='row direction'>
                            {{ $t(product.ko_type ? 'bull' :'trade.buy') }}
                        </span>
                    </button>
                </div>
                <!-- <div class="diff-wrap">
                    <span v-if="product.low_price">{{$t('chart.low')}} {{product.low_price| priceDigit(digit)}}</span>
                    <span v-if="product.high_price">{{product.high_price | priceDigit(digit)}} {{$t('chart.high')}}</span>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
/**  点数（pip）换算为价格：X * 大点比率 * point
 *  1、市价卖
       止损价格范围：卖价+最小点数转价格<=X<=卖价+最大点数转价格
       止盈价格范围：卖价-最大点数转价格 <=X<=卖价-最小点数转价格
    2、市价买
       止损价格范围：买价-最大点数转价格<=X<=买价-最小点数转价格
       止盈价格范围：买价+最小点数转价格<=X<=买价+最大点数转价格
 */
import { Cell, Tag } from 'vant'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { getLoginData, formatProductCode, getStringLength } from '@/utils/index'
import { i18n } from '@m/lang'

export default {
    name: 'ProductItem',
    props: ['product', 'index', 'activeTab', 'tabIndex', 'displayType'],
    data () {
        return {
            showMore: true,
            chartData: [],
            chartLoading: false,
            chartVisible: false,
            chartConfig: {
                type: 'price',
                precision: 2
            },
            tabTitle: '自选'
        }
    },
    computed: {
        ...mapState({
            userLoginInfo: state => state.ix_user.userLoginInfo,
            product_activatedId: state => state.ix_quote.product_activatedId,
        }),
        ...mapGetters(['accountData']),
        isLogined () {
            const loginData = getLoginData()
            return loginData && this.userLoginInfo
        },
        digit () {
            const product = this.product
            return product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
        },
        lang () {
            return this.$store.state.ix_baseInfo.companyInfo?.transBaseConfigVo?.language || 'zh-CN'
        },
    },
    components: {
        [Cell.name]: Cell,
        [Tag.name]: Tag,
    },
    filters: {
        filterPipUnit (val) {
            if (!val) {
                return ''
            }
            return val <= 1 ? i18n.t('optional.pip') : i18n.t('optional.pips')
        }
    },
    methods: {
        formatProductCode,
        getStringLength,
        ...mapMutations({
            UPDATE_PRODUCT_ACTIVATED_ID: 'ix_quote/UPDATE_PRODUCT_ACTIVATED_ID'
        }),
        toOrder (data, direction) {
            return
            if (data.ko_type === 1 && direction === 'sell') return false
            else if (data.ko_type === 2 && direction === 'buy') return false
            const groupSymbol = data.groupSymbol
            const loginData = getLoginData()
            if (!loginData) return this.$router.push({ name: 'Login' })
            else if (!this.isLogined) return this.$alert(this.$t('loginTip.loginEmpty'))

            this._collect(direction === 'sell' ? `${this.tabTitle}_卖出` : `${this.tabTitle}_买入`)
            this.$router.push({ name: 'Order', params: { id: data.code_id }, query: { direction } })
        },
        toDetail (data) {
            this.UPDATE_PRODUCT_ACTIVATED_ID(data.code_id)
        },
        sell (item) {
            this._collect(this.tabTitle + '_平仓')
            this.$emit('sellOrder', item)
        },
        toPosition () {
            this.$emit('toTab', { name: 'position' })
        },
        // 路由跳转统计
        routerClick () {
            this._collect(`交易_${this.tabTitle}_查看`, true)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productItem {
    &.active {
        background: #f2f2f2;
    }
    .mtop {
        margin-top: 7px;
    }
    .iconHot,
    .iconHui {
        font-size: rem(30px);
        color: #e3525c;
        vertical-align: middle;
        margin-left: 3px;
    }
    .iconHui {
        color: #f39800;
    }
    .cell {
        margin-bottom: 5px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $muted;
        padding: 0 rem(30px);
        font-size: rem(24px);
        .th {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
        .bd {
            flex: 1;
            padding-right: rem(30px);
            text-align: center;
        }
        .ft {
            width: rem(386px);
            text-align: right;
        }
        .name {
            display: block;
            width: 100%;
            color: $text;
            font-size: rem(32px);
            line-height: rem(32px);
            vertical-align: middle;
            padding: rem(5px) rem(10px) 0 0;
            @include ellipsis();
            &.small {
                font-size: rem(28px);
            }
            &.mini {
                font-size: rem(24px);
            }
        }
        .short_name {
            font-size: rem(20px);
            line-height: rem(20px);
            padding-top: rem(20px);
        }
        .riseLenght {
            font-size: rem(24px);
            line-height: rem(24px);
            padding-top: rem(16px);
            span {
                display: inline-block;
                &:last-child {
                    margin-left: rem(15px);
                }
            }
        }
    }
    .chart {
        padding: 0 rem(30px);
    }
    .klineIcon {
        position: absolute;
        right: rem(30px);
        top: 50%;
        transform: translateY(-50%);
        width: rem(52px);
        height: rem(48px);
        text-align: center;
        border-radius: rem(6px);
        font-style: normal;
        font-size: 16px;
        &.loading {
            font-size: 0;
            &::before {
                content: "";
            }
            margin-top: rem(-24px);
            background: url(~@public/images/loading.svg) center no-repeat;
            background-size: rem(52px) rem(48px);
            animation: loading 1s linear infinite;
            opacity: 0.7;
        }
        &.hidden {
            color: #477fd3;
            background-color: #f3f8ff;
        }
        &.visible {
            color: #fff;
            background-color: #477fd3;
        }
    }
}
.actionBox {
    .btn-wrap {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        .btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: rem(186px);
            height: rem(84px);
            box-sizing: border-box;
            border-radius: rem(6px);
            color: #fff;
            background: #858c9a;
            cursor: pointer;
            &.disabled {
                background: #eee !important;
                color: $muted !important;
            }
        }
        .row {
            display: block;
            font-size: rem(28px);
            line-height: rem(28px);
            overflow: hidden;
            word-break: break-all;
            padding: 0 rem(12px);
        }
        .direction {
            padding-top: rem(3px);
            font-size: rem(20px);
            line-height: rem(22px);
        }
        .spread_text {
            position: absolute;
            top: 50%;
            left: 50%;
            width: rem(53px);
            min-height: rem(26px);
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background: #fff;
            border-radius: rem(3px);
            padding: rem(5px) 0;
            box-sizing: border-box;
            span {
                font-size: rem(18px);
                line-height: rem(26px);
                font-weight: 300;
                color: rgba(72, 72, 72, 1);
                color: #666;
                text-align: center;
                word-break: break-all;
            }
        }
    }

    .diff-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        font-size: rem(18px);
        line-height: rem(18px);
        color: rgba(153, 153, 153, 1);
        padding-top: 6px;
        > span {
            flex: 0 0 50%;
            text-align: left;
            &:last-child {
                text-align: right;
                padding-right: rem(10px);
            }
        }
    }
}
.positionList {
    background-color: #f9f9f9;
    margin-bottom: rem(-20px);
    .link {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: rem(30px);
        border-bottom: solid 1px #efefef;
        color: #333333;
        font-size: rem(24px);
        &:last-child {
            border-bottom: 0;
        }
        ::v-deep {
            .left {
                color: #333333;
                .van-tag {
                    margin-right: rem(25px);
                    background-color: #477fd3;
                }
                .direction {
                    margin-right: rem(30px);
                }
                div {
                    display: inline-block;
                }
            }
            .right {
                .van-button {
                    border-color: #fff;
                    color: #477fd3;
                    width: rem(104px);
                    height: rem(48px);
                    font-size: rem(24px);
                }
            }
        }
    }
    .more {
        display: inline-block;
        width: 100%;
        padding: rem(30px);
        text-align: center;
        color: #477fd3;
        font-size: rem(24px);
        i {
            position: relative;
            top: rem(4px);
        }
    }
}
</style>
