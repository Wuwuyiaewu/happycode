<template>
    <!-- 平仓成功 -->
    <div class='orderSuccess'>
        <a class='back' href='javascript:;' @click='back'>
            <i class='van-icon van-icon-cross'></i>
        </a>
        <span class='successIcon'>
            <SuccessAnimation :disabled-succ-animtion='disabledSuccAnimtion' />
        </span>
        <p class='title subColor' :class="{ 'animate':!disabledSuccAnimtion }">
            {{ $t('trade.closedSuccess') }}
        </p>
        <div class='adTopBox'>
            <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
        </div>
        <div class='orderInfo'>
            <div class='product'>
                <p class='productTitle'>
                    {{ groupSymbol.simplified }}
                </p>
                <p v-if="language!=='en-US'" class='productCode'>
                    {{ groupSymbol.short_name }}
                </p>
            </div>

            <van-cell class='dataBar' :title="$t('trade.closedNum')">
                <template>
                    <span
                        :class="[$route.query.direction===1?'riseColor':'fallColor']"
                    >
                        {{ $route.query.direction==1?$t('trade.buy'):$t('trade.sell') }}
                    </span>
                    {{ $route.query.execute_volume+$t('trade.volumeUnit') }}
                </template>
            </van-cell>
            <van-cell class='dataBar' :title="$t('trade.positionPrice')" :value='$route.query.src_price' />
            <van-cell class='dataBar' :title="$t('trade.closedPrice')" :value='$route.query.execute_price' />
            <van-cell
                class='dataBar'
                :class="{
                    'riseColor':$route.query.profit>0,
                    'fallColor':$route.query.profit<0 }"
                :title="$t('trade.closeProfit')"
            >
                <span>{{ $route.query.profit | moneyAccuracy }} {{ symbolCode }}</span>
            </van-cell>
            <!-- <van-cell :title="$t('trade.closedPrice')" :value="$route.query.execute_price" class="dataBar" /> -->
            <van-cell
                class='dataBar'
                :class="{
                    'riseColor':$route.query.swap>0,
                    'fallColor':$route.query.swap<0 }"
                :title="$t('trade.swap')"
                :value='$route.query.swap'
            >
                <span>{{ $route.query.swap | moneyAccuracy }} {{ symbolCode }}</span>
            </van-cell>
            <van-cell
                class='dataBar'
                :class="{
                    'riseColor':$route.query.commission>0,
                    'fallColor':$route.query.commission<0 }"
                :title="$t('trade.fee')"
                :value='$route.query.swap'
            >
                <span>{{ $route.query.commission | moneyAccuracy }} {{ symbolCode }}</span>
            </van-cell>
            <van-cell
                class='dataBar'
                :class="{
                    'riseColor':$route.query.totalprofit>0,
                    'fallColor':$route.query.totalprofit<0 }"
                :title="$t('trade.closeNetProfit')"
            >
                <span>{{ $route.query.totalprofit | moneyAccuracy }} {{ symbolCode }}</span>
            </van-cell>
            <p v-if='!isPC' class='lookInfo'>
                <router-link class='link' :to="{ name:'SellOrderInfo',params:$route.params }">
                    {{ $t('trade.toDetail') }} >
                </router-link>
            </p>
            <van-row gutter='10'>
                <van-col span='12'>
                    <button class='goonOrder mainColor orderBtnBg' @click='toOrder'>
                        {{ $t('trade.backOpenPosition') }}
                    </button>
                </van-col>
                <van-col span='12'>
                    <button class='mainColorBg goonOrder' @click='back'>
                        {{ $t('compLang.confirm') }}
                    </button>
                </van-col>
            </van-row>
        </div>
        <div class='adBottomBox'>
            <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
        </div>
        <BonusNews v-if='isExperience' :info='$route.query' :show.sync='showBonus' />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SuccessAnimation from '@m/components/successAnimation'
import pcMixin from '@m/mixins/pc'
import BonusNews from './components/BonusNews'
let fromRouteName
export default {
    name: 'SellSuccess',
    components: {
        SuccessAnimation,
        BonusNews
    },
    mixins: [pcMixin],
    beforeRouteEnter (to, from, next) {
        fromRouteName = from.name
        next()
    },
    data () {
        return {
            groupSymbol: {},
            baseInfo: {},
            showBonus: false
        }
    },
    created () {
        if (fromRouteName === 'OrderSuccess') return history.back() // 从开仓成功页面点击X按钮过来，直接返回之前的页面

        this.baseInfo = this.$store.state.ix_quote.product_map[this.$route.query.symbol]
        this.groupSymbol = {
            display_name: this.baseInfo.groupSymbol.display_name,
            simplified: this.baseInfo.simplified,
            short_name: this.baseInfo.short_name,
        }
    },
    mounted () {
        if (this.isExperience && fromRouteName && fromRouteName !== 'UpgradeAccountStep') {
            window.setTimeout(() => {
                this.showBonus = true
            }, 500)
        }
    },
    methods: {
        back () {
            this.$router.go(-1)
        },
        toOrder () {
            this.$router.push({
                name: 'Order',
                params: { id: this.$route.query.codeid },
                query: { direction: this.$route.query.direction == 1 ? 'sell' : 'buy' }
            })
        }
    },
    computed: {
        ...mapState(['disabledSuccAnimtion']),
        ...mapGetters(['symbolCode', 'isExperience']),
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/animations.scss";
@import "~@m/sass/mixin.scss";
.orderSuccess {
    overflow: auto;
    height: 100%;
    position: relative;
    .back {
        position: absolute;
        top: 0;
        right: 0;
        padding: rem(30px) rem(22px);
        color: inherit;
        &:active {
            opacity: 0.7;
            box-shadow: 0px 0px 999px rgba(0, 0, 0, 0.05) inset;
        }
        i {
            font-size: rem(50px);
            color: #333333;
        }
    }
    .successIcon {
        display: block;
        width: rem(118px);
        height: rem(118px);
        line-height: rem(110px);
        margin: rem(60px) auto 0;
        border-radius: 100%;
        text-align: center;
        color: #fff;
        font-size: rem(70px);
        .van-icon {
            vertical-align: middle;
        }
    }
    .title {
        text-align: center;
        padding-bottom: rem(20px);
        line-height: 1;
        font-size: rem(34px);
        &.animate {
            opacity: 0;
            animation: fadeInUp 0.3s linear 0.9s forwards;
        }
    }
    .adTopBox {
        margin: rem(90px) auto 0;
        width: rem(580px);
    }
    .adBottomBox {
        margin: 0 auto rem(90px);
        width: rem(580px);
    }
    .orderInfo {
        margin: 0 auto;
        width: rem(580px);
        background: #fff;
        border-radius: rem(10px);
        box-shadow: 0px 0px 18px 0px rgba(243, 243, 243, 1);
        padding: rem(66px) rem(70px);
        box-sizing: border-box;
        line-height: 1.6;
    }
    .product {
        padding-bottom: rem(40px);
        .productTitle {
            text-align: center;
            font-size: rem(34px);
            @include single-line-clamp();
        }
        .productCode {
            text-align: center;
            font-size: rem(20px);
            color: $muted;
        }
    }
    .dataBar {
        .van-cell__title {
            color: $muted;
        }
        .van-cell__value {
            color: inherit;
        }
    }
    .dataBar {
        padding: 6px 0;
        &::after {
            opacity: 0;
        }
    }
    .goonOrder {
        display: block;
        color: #fff;
        width: 100%;
        text-align: center;
        height: rem(80px);
        line-height: 1;
        margin-top: rem(30px);
        border-radius: rem(6px);
        font-size: rem(28px);
    }
    .orderBtnBg {
        background-color: #f4f7fc;
    }
    .lookInfo {
        text-align: center;
        .link {
            font-size: rem(28px);
            color: #999;
        }
    }
}
</style>
