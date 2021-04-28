<template>
    <div
        v-if='product.code_id'
        ref='productItem'
        class='productItem van-hairline--top-bottom'
        :class="`${bgClass} ${product_activatedId===product.code_id?'active':''}`"
        @click='toDetail(product)'
    >
        <div class='cell'>
            <div
                class='th name'
                :class="[
                    product.class,
                    product.simplified && getStringLength(product.simplified) > 16 && 'small',
                    product.simplified && getStringLength(product.simplified) > 20 && 'mini'
                ]"
            >
                {{ product.simplified }}
            </div>
            <div class='tb'>
                <span
                    class='sell_price'
                    :class='product.sell_color'
                >
                    {{ !product.sell_price && product.sell_price != 0 ? '- -' : product.sell_price }}
                </span>
            </div>
            <div class='ft'>
                <span
                    class='buy_price'
                    :class='product.buy_color'
                >
                    {{ !product.buy_price && product.buy_price != 0 ? '- -' : product.buy_price }}
                </span>
            </div>
        </div>
        <div class='cell'>
            <p class='th' v-html='formatProductCode(product)'>
                <!-- {{ product.short_name }} -->
                <!-- <span class="spread_text" v-if="product.spread_text">({{product.spread_text}})</span> -->
            </p>
            <p>
                <span class='upDownAmount' :class='product.upDownColor'>
                    {{ product.upDownAmount | filterNumberSign }}
                </span>
                <span class='upDownWidth' :class='product.upDownColor'>
                    {{ product.upDownWidth | filterNumberSign }}
                </span>
            </p>
        </div>
        <div v-if='disable' class='disable'>
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
// import { Cell, Tag } from 'vant'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { formatProductCode, getStringLength } from '@/utils/index'
import { removeOid } from '@/utils/router'

// import { getLoginData } from '@/utils/index'
// import MinuteChart from './minuteChart.vue'
export default {
    name: 'ProductItem',
    props: ['tabTitle', 'codeId'],
    data () {
        return {
            // showMore: true,
            // chartData: [],
            // chartLoading: false,
            // chartVisible: false,
            // chartConfig: {
            //     type: 'price',
            //     precision: 2
            // },
            price: 0,
            bgClass: '',
        }
    },
    computed: {
        ...mapState({
            product_activatedId: state => state.ix_quote.product_activatedId,
        }),
        // ...mapGetters(['accountData']),
        // isLogined() {
        //     const loginData = getLoginData()
        //     return loginData && this.userLoginInfo
        // }
        ...mapState({
            product_map: state => state.ix_quote.product_map,
        }),
        product () {
            return this.product_map[this.codeId] || {}
        },
        customConfig () {
            return this.$store.state.customConfig || {}
        },
        ...mapGetters(['activateTime', 'isExperience']),
        disable () {
            const experienceDsiableCodes = this.customConfig.experienceDsiableCodes || []
            if (this.isExperience && !this.activateTime && experienceDsiableCodes.length > 0 && experienceDsiableCodes.indexOf(this.codeId) > -1) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        formatProductCode,
        getStringLength,
        // toOrder(data, direction) {
        //     const groupSymbol = data.groupSymbol
        //     const loginData = getLoginData()
        //     if (!loginData) return this.$router.push({ name: 'Login' })
        //     else if (!this.isLogined) return this.$alert(this.$t('loginTip.loginEmpty'))
        //     if (data.zone === 3) {
        //         return this.$alert(this.$t('loginTip.notTrade'))
        //     } else if (!groupSymbol || !groupSymbol.name) { // || groupSymbol.tradable !== 1 暂时去掉tradable判断，ix系统没有
        //         return this.$alert(this.$t('loginTip.productClose'))
        //     } else if (groupSymbol.enable !== 1) {
        //         return this.$alert(this.$t('productStatus.' + groupSymbol.enable) + this.$t('productStatus.linkService'))
        //     }
        //     this._collect(direction === 'sell' ? `${this.tabTitle}_卖出` : `${this.tabTitle}_买入`)
        //     this.$router.push({ name: 'Order', params: { id: data.code_id }, query: { direction } })
        // },
        ...mapMutations({
            UPDATE_PRODUCT_ACTIVATED_ID: 'ix_quote/UPDATE_PRODUCT_ACTIVATED_ID'
        }),
        toDetail (data) {
            this._collect(this.tabTitle + '_订单区域')
            if (this.disable) {
                this.$prophet(['trackEvent', '体验活动', '行情页面', '行情_解锁', 92])
                this.$emit('disableTip')
                return
            }
            // 删除路由参数
            window.isPC && removeOid(this.$router)
            this.UPDATE_PRODUCT_ACTIVATED_ID(data.code_id)
            if (!window.isPC) this.$router.push({ name: 'ProductDetail', params: { id: data.code_id } })
        },
        animationEnd (ev) {
            this.bgClass = ''
        }
    },
    watch: {
        // 'product.sell_price' (val) {
        //     if (val === 'riseColor') {
        //         this.bgClass = ''
        //         setTimeout(() => {
        //             this.bgClass = 'riseColorBgAni'
        //         }, 20)
        //     } else if (val === 'fallColor') {
        //         this.bgClass = ''
        //         setTimeout(() => {
        //             this.bgClass = 'fallColorBgAni'
        //         }, 20)
        //     }
        // }
        'product.sell_price' (val) {
            if (this.price === 0) {
                if (this.product.sell_color === 'riseColor') {
                    this.bgClass = 'riseColorBgAni'
                } else if (this.product.sell_color === 'fallColor') {
                    this.bgClass = 'fallColorBgAni'
                }
                this.price = val
            } else {
                if (val - this.price > 0) {
                    this.bgClass = 'riseColorBgAni'
                } else if (val - this.price < 0) {
                    this.bgClass = 'fallColorBgAni'
                }
                this.price = val
            }
        }
    },
    mounted () {
        if (this.$refs.productItem) {
            this.$refs.productItem.addEventListener('webkitAnimationEnd', this.animationEnd)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productItem {
    padding: rem(20px) 0;
    border-color: #efefef;
    &:after {
        border-color: #f0f3fa;
    }
    .mtop {
        margin-top: 7px;
    }
    .cell {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $muted;
        line-height: 1.45;
        padding: 0 rem(30px);
        font-size: rem(24px);
        .th {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
        .tb {
            width: rem(176px);
            text-align: left;
        }
        .ft {
            width: rem(190px);
            text-align: right;
        }
        .name {
            color: $text;
            font-weight: 400;
            font-size: rem(30px);
            @include ellipsis();
            &.small {
                font-size: rem(28px);
            }
            &.mini {
                font-size: rem(24px);
            }
        }
        .short_name {
            padding-top: rem(4px);
            font-size: rem(20px);
        }
        .riseLenght {
            margin-top: rem(6px);
            span {
                display: inline-block;
                margin-right: 10px;
            }
        }
        .upDownAmount {
            padding-right: rem(15px);
        }
        .ellipsis {
            font-size: rem(28px);
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .sell_price,
    .buy_price {
        font-size: rem(30px);
    }
    .upDownAmount,
    .upDownWidth {
        font-size: rem(24px);
    }
    .chart {
        padding: 0 rem(30px);
    }
    .disable {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(#000,0.1);
        &::after{
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: rem(-40px);
            margin-left: rem(-40px);
            background-image: url('./images/lock.png');
            background-size: cover;
            width: rem(81px);
            height: rem(81px);
        }
    }
}
</style>
