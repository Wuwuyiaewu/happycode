<template>
    <div class='assetsInfo'>
        <div class='left'>
            <p>
                <i class='muted'>
                    {{ $t('trade.estimatedMargin') }}
                </i>
                <i v-if='product && product.market_id===2 && openMarginHKD'>
                    &nbsp; HKD {{ openMarginHKD }}
                    ({{ symbolCode+openMargin }})
                </i>
                <i v-else>
                    {{ symbolCode+openMargin }}
                </i>

                <i class='muted' style='margin-left:.5em;'>
                    {{ $t('trade.free') }}
                </i>
                {{ symbolCode+freeMargin }}
            </p>
        </div>
        <!-- <div class="center">
            <van-circle
                class="circle"
                ref="circle"
                v-model="realRate"
                :rate="circleRate"
                :text="circleText"
                :speed="100"
                size="8vw"
                :color="activeColor"
                layer-color="#E3E3E3"
                :stroke-width="60"
            />
        </div>-->
        <!-- <div class="right">
            <p>
                <i class="muted">{{$t('trade.marginLevel')}}</i>
                <span v-if="volume>0">{{marginLevel}}%</span>
                <span v-else class="muted">&nbsp;--</span>
            </p>
            <p v-if="freeMargin==0" :style="{'color':activeColor}">{{$t('trade.freeMarginEmpty')}}</p>
            <p class="green" v-else-if="bzjWarn===1 || volume==0">{{$t('trade.marginGood')}}</p>
            <p v-else-if="bzjWarn===2" :style="{'color':activeColor}">{{$t('trade.marginInsufficient')}}</p>
            <p v-else :style="{'color':activeColor}">{{$t('trade.marginLess')}}</p>
        </div>-->
    </div>
</template>

<script>
import { Circle } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { toFixed } from '@/utils/calculation'
export default {
    components: {
        [Circle.name]: Circle,
    },
    props: ['bzjWarn', 'product', 'symbolCode', 'openMargin', 'marginLevel', 'activeColor', 'volume'],
    data () {
        return {
            circleText: '$',
            realRate: 0,
        }
    },
    computed: {
        ...mapState({
            product_map: state => state.ix_quote.product_map,
            baseSymbol: state => state.ix_quote.baseSymbol,
            groupGet: state => state.ix_user.groupGet,
        }),
        ...mapGetters(['style', 'assetAboutInfo']),
        // 可用保证金
        freeMargin () {
            return toFixed(this.assetAboutInfo.accountData.kybzj)
        },
        usdhkd () {
            const id = String(this.baseSymbol.USDHKD)
            const product_map = this.product_map
            return product_map && product_map[id] ? product_map[id] : {}
        },
        usdcny () {
            const id = String(this.baseSymbol.USDCNY)
            const product_map = this.product_map
            return product_map && product_map[id] ? product_map[id] : {}
        },
        // 港股产品的保证金换算HKD
        openMarginHKD () {
            const usdhkdRate = this.usdhkd['buy_price'] || 1
            let usdcnyRate = this.usdcny['buy_price'] || 1
            if (this.groupGet.currency !== 'CNY') usdcnyRate = 1
            // if (!usdhkdRate) return '--';
            const hkd = Number(this.openMargin) / usdcnyRate * usdhkdRate
            return hkd ? toFixed(hkd) : ''
        },
        circleRate () {
            const openMargin = Number(this.openMargin) || 0
            let rate = openMargin / Number(this.freeMargin) * 100
            rate = (rate.toFixed(2)) * 1
            rate = Math.max(0, rate)
            rate = Math.min(100, rate)
            return rate
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.assetsInfo {
    margin-top: rem(60px);
    height: rem(110px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: rem(20px);
    line-height: 1.5;
    background: linear-gradient(
        -90deg,
        rgba(255, 255, 255, 1),
        rgba(249, 249, 249, 1),
        rgba(255, 255, 255, 1)
    );
    .left {
        text-align: center;
        flex: 1;
    }
    .right {
        margin-left: rem(30px);
        flex: 1;
    }
    .center {
        position: relative;
        width: rem(60px);
        height: rem(60px);
        margin: 0 rem(24px);
        ::v-deep {
            .circle {
                position: initial;
            }
        }
    }
    .green {
        color: $green;
    }
    .red {
        color: $red;
    }
    .warn {
        color: $warn;
    }
}
.circle ::v-deep {
    .van-circle__text {
        font-size: rem(28px);
        color: inherit;
    }
}
</style>
