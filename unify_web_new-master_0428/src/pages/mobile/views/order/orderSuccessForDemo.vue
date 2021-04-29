<template>
    <!-- 开仓成功 -->
    <div class='orderSuccess' :class='{ pc:isPC, miniTrade: origin === "miniTrade" }'>
        <a class='back' href='javascript:;' @click='back'>
            <!-- 隱藏 X 關閉 -->
            <i class='icon_icon_close_small'></i>
        </a>
        <span class='successIcon'>
            <SuccessAnimation :disabled-succ-animtion='disabledSuccAnimtion' />
        </span>
        <p
            v-if='orderAdd.type==1'
            class='title subColor'
            :class="{ 'animate':!disabledSuccAnimtion }"
        >
            {{ $t('trade.openPositionSuccess') }}
        </p>
        <p v-else class='title subColor' :class="{ 'animate':!disabledSuccAnimtion }">
            {{ $t('trade.openPendingSuccess') }}
        </p>
        <!-- 不显示添加自选的文字 -->
        <!-- <p v-if='addSelfSymbolSuccess' class='hasAdded'>
            {{ $t('optional.hasAdded') }}
        </p> -->
        <!-- 体验账户显示界面 -->
        <div v-if='isExperience' class='miniTradeInfo'>
            <p class='miniTradeTip'>
                {{ $t(activateTime ? 'activity.tip6':'activity.tip1') }}
                <span class='amount'>
                    {{ $store.state.accInfo.singleMaxGive }}{{ symbolCode }}
                </span>
            </p>
            <van-row class='btnGroup' gutter='10'>
                <van-col span='12'>
                    <button
                        v-prophet="['trackEvent', '交易', '市价下单', '市价_查看持仓', 60]"
                        class='mainColor toDetail'
                        @click='toPosition'
                    >
                        {{ $t('trade.lookPositions') }}
                    </button>
                </van-col>
                <van-col span='12'>
                    <button
                        v-prophet="['trackEvent', '交易', '市价下单', '市价_继续下单', 61]"
                        class='mainColorBg goonOrder'
                        @click='upgradeAccount'
                    >
                        {{ $t(activateTime ? 'activity.receive':'activity.upgradeAccount') }}
                        <p class='smallRow'>
                            <span>{{ $t('activity.getItNow') }}</span>
                            <i>{{ $t('trade.allPosition') }}</i>
                            <span>{{ $t('fundingDetails.balance') }}</span>
                        </p>
                        <span class='curBalance'>
                            {{ $t('curBalance') }}：{{ $store.state.ix_user.userLoginInfo.balance }}{{ symbolCode }}
                        </span>
                    </button>
                </van-col>
            </van-row>
        </div>
        <template v-else>
            <div class='adTopBox'>
                <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
            </div>
            <div class='orderInfo'>
                <div class='product'>
                    <p class='productTitle'>
                        {{ product.simplified }}
                    </p>
                    <p v-if="language!=='en-US'" class='productCode'>
                        {{ product.short_name }}
                    </p>
                </div>
                <template v-if='orderAdd.type==1'>
                    <van-cell class='dataBar' :title="$t('trade.positionPrice')" :value='openPrice' />
                    <!-- <van-cell
                        :title="orderAdd.direction===1?$t('trade.buy'):$t('trade.sell')"
                        :value="position.init_volume+$t('trade.volumeUnit')"
                        class="dataBar"
                    />-->
                    <van-cell class='dataBar' :title="$t('trade.volumes')">
                        <template>
                            <span
                                :class="[orderAdd.direction===1?'riseColor':'fallColor']"
                            >
                                {{ orderAdd.direction===1?$t('trade.buy'):$t('trade.sell') }}
                            </span>
                            {{ orderAdd.request_volume+$t('trade.volumeUnit') }}
                        </template>
                    </van-cell>
                    <van-cell v-if='position.commission' class='dataBar' :title="$t('trade.fee')">
                        <template>
                            <span
                                :class="[position.commission?'':'muted']"
                            >
                                {{ position.commission | priceDigit(2) }} {{ symbolCode }}
                            </span>
                        </template>
                    </van-cell>
                    <van-cell class='dataBar' :title="$t('trade.takeLoss')">
                        <template>
                            <span
                                v-if='orderAdd.stopLoss'
                                :class="[orderAdd.stopLoss?'':'muted']"
                            >
                                {{ orderAdd.stopLoss|priceDigit(product.digit) }}
                            </span>
                            <span v-else>
                                {{ $t('noSetup') }}
                            </span>
                        </template>
                    </van-cell>
                    <van-cell class='dataBar' :title="$t('trade.takeProfit')">
                        <template>
                            <span
                                v-if='orderAdd.takeProfit'
                                :class="[orderAdd.takeProfit?'':'muted']"
                            >
                                {{ orderAdd.takeProfit|priceDigit(product.digit) }}
                            </span>
                            <span v-else>
                                {{ $t('noSetup') }}
                            </span>
                        </template>
                    </van-cell>
                </template>
                <div v-else>
                    <!-- <van-cell
                        :title="$t('trade.pendingType')"
                        :value="$t(orderAdd.type===4?'trade.stopLoss':'trade.limitPirce')"
                        class="dataBar"
                    />-->
                    <van-cell class='dataBar' :title="$t('trade.pendingPrice')" :value='openPrice' />
                    <van-cell class='dataBar' :title="$t('trade.volumes')">
                        <template>
                            <span
                                :class="[orderAdd.direction===1?'riseColor':'fallColor']"
                            >
                                {{ orderAdd.direction===1?$t('trade.buy'):$t('trade.sell') }}
                            </span>
                            {{ orderAdd.request_volume+$t('trade.volumeUnit') }}
                        </template>
                    </van-cell>
                    <van-cell
                        class='dataBar'
                        :title="$t('trade.expireTime')"
                        :value="orderAdd.expireType===1?$t('trade.expireType1'):$t('trade.expireType2')"
                    />
                    <van-cell v-if="origin !== 'miniTrade'" class='dataBar' :title="$t('trade.takeLoss')">
                        <template>
                            <span
                                v-if='orderAdd.stopLoss'
                                :class="[orderAdd.stopLoss?'':'muted']"
                            >
                                {{ orderAdd.stopLoss|priceDigit(product.digit) }}
                            </span>
                            <span v-else>
                                {{ $t('noSetup') }}
                            </span>
                        </template>
                    </van-cell>
                    <van-cell v-if="origin !== 'miniTrade'" class='dataBar' :title="$t('trade.takeProfit')">
                        <template>
                            <span
                                v-if='orderAdd.takeProfit'
                                :class="[orderAdd.takeProfit?'':'muted']"
                            >
                                {{ orderAdd.takeProfit|priceDigit(product.digit) }}
                            </span>
                            <span v-else>
                                {{ $t('noSetup') }}
                            </span>
                        </template>
                    </van-cell>
                    <!-- <van-cell title="占用保证金($)" :value="orderAdd.open_margin" class="dataBar" /> -->
                </div>
                <van-row class='btnGroup' gutter='10'>
                    <van-col span='12'>
                        <button
                            v-prophet="['trackEvent', '交易', '挂单', '挂单_查看挂单', 67]"
                            class='mainColor toDetail'
                            @click='toDetail'
                        >
                            {{ $t(orderAdd.type==1?'trade.lookPositions':'trade.lookPendings') }}
                        </button>
                    </van-col>
                    <van-col span='12'>
                        <button
                            v-prophet="['trackEvent', '交易', '挂单', '挂单_继续下单', 68]"
                            class='mainColorBg goonOrder'
                            @click='goBack'
                        >
                            {{ $t('trade.buyAgain') }}
                        </button>
                    </van-col>
                </van-row>
            </div>
            <div class='adBottomBox'>
                <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
            </div>
        </template>

        <ActivityProcess v-if='activityProcessVisible' />
    </div>
</template>

<script>
import { Cell } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { add } from '@/api/selfSymbol'
import SuccessAnimation from '@m/components/successAnimation'
import pcMixin from '@m/mixins/pc'
import ActivityProcess from '@m/components/activityProcess'
import { encryptLoginData } from '@/utils/index'
import { getDecimalNum } from '@/utils/calculation'
import { addBonusFlowRecords } from '@/api/mine'
export default {
    name: 'OrderSuccess',
    components: {
        [Cell.name]: Cell,
        ActivityProcess,
        SuccessAnimation
    },
    mixins: [pcMixin],
    // 此页面不能刷新访问
    beforeRouteEnter (to, from, next) {
        next(from.path === '/' ? '/trade' : true)
    },
    data () {
        return {
            info: '',
            orderAdd: '',
            position: '',
            addSelfSymbolSuccess: false,
            activityProcessVisible: false,
        }
    },
    computed: {
        ...mapState({
            disabledSuccAnimtion: state => state.disabledSuccAnimtion,
            product_map: state => state.ix_quote.product_map,
            selfSymbolList: state => state.selfSymbolList,
            origin: state => state.origin,
        }),
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        ...mapGetters(['symbolCode', 'hasRealAccount', 'activateTime', 'isExperience']),
        product () {
            return this.product_map[this.orderAdd.symbol]
        },
        openPrice () {
            const price = this.orderAdd.type == 1 ? this.position.open_price : this.orderAdd.request_price
            return price.toFixed(this.product.groupSymbol.digits)
        }
    },
    created () {
        const openOrderInfo = JSON.parse(sessionStorage.getItem('orderSuccess' + this.$route.params.id))
        const DealAddRet = openOrderInfo.DealAddRet
        if (DealAddRet) {
            this.position = {
                init_volume: DealAddRet.execute_volume,
                open_price: DealAddRet.execute_price,
                commission: DealAddRet.commission,
                id: DealAddRet.positionId
            }
        }
        const orderAdd = this.orderAdd = openOrderInfo.OrderAddRet
        const contract_size = this.product.groupSymbol.contract_size
        const volumes_step = this.product.groupSymbol.volumes_step
        orderAdd.request_volume = (orderAdd.request_volume / contract_size).toFixed(getDecimalNum(volumes_step))
        if (this.position) this.position.init_volume = this.position.init_volume / contract_size
        const isSelfSymbol = this.selfSymbolList.find(el => el.symbolId === orderAdd.symbol)
        if (!isSelfSymbol) {
            this.addSelfSymbol()
        }
    },
    methods: {
        back () {
            if (this.$route.query.fullEnteredDialog) {
                return this.$router.push({ name: 'PositionIndex', query: { fullEnteredDialog: 'true' } })
            }
            const tabActive = this.orderAdd.type == 1 ? 0 : 1
            this.isPC ? this.$router.push({ name: 'Layout', query: { tab: tabActive } }) : this.$router.go(-2)
        },
        toDetail () {
            // const orderAdd = this.orderAdd;
            // const position = this.position;
            // const id = orderAdd.type == 1 ? position.id : orderAdd.id;
            // const routerName = orderAdd.type == 1 ? 'MyOrderInfo' : 'BuyOrderInfo'
            // this.$router.push({ name: routerName, params: { id: id } });
            // this.$store.commit('tagsView/DEL_CACHED_VIEW', { name: 'TradeIndex' });
            const tabActive = this.orderAdd.type == 1 ? 0 : 1
            setTimeout(() => {
                //  this.$router.push({ name: 'PositionIndex', query: { tab: tabActive } });
                if (this.isPC) {
                    this.$router.push({ name: 'Layout', query: { tab: tabActive } })
                } else {
                    this.$router.push({ name: 'PositionIndex', query: { tab: tabActive } })
                }
            }, 100)
        },
        // 添加自选
        addSelfSymbol () {
            if (this.selfSymbolList.length >= 200) {
                return this.$toast(this.$t('optional.optionalMoreThanMax'))
            }
            add({
                symbolId: this.product.code_id
            }).then(res => {
                if (parseInt(res.code) === 1 && res.data) {
                    this.addSelfSymbolSuccess = true
                    this.$store.dispatch('getSelfSymbolList')
                }
            })
        },
        // 显示全屏过渡效果
        showActivityProcess () {
            return new Promise(resolve => {
                this.activityProcessVisible = true
                setTimeout(resolve, 2500)
            })
        },
        // 全屏打开持仓页面
        fullToPath (path = '/mine') {
            if (this.origin === 'miniTrade') {
                this.showActivityProcess().then(() => {
                    path += path.includes('?') ? `&t=${encryptLoginData()}` : `?t=${encryptLoginData()}`
                    window.top.location = `${location.protocol}//${location.host}/${window.htmlKey + path}`
                })
            } else {
                this.$router.push(path)
            }
        },
        upgradeAccount () {
            addBonusFlowRecords()
                .then(res => {
                    if (res.invalid()) {
                        res.toast()
                        return
                    }
                    this.fullToPath(this.hasRealAccount ? '/my/depositFunds' : '/upgrade/account/1')
                })
                .catch(error => {
                    console.log(error)
                })
        },
        toPosition () {
            this.fullToPath(this.origin === 'miniTrade' ? '/position?fullEnteredDialog=true' : '/position')
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/animations.scss";
@import "~@m/sass/mixin.scss";
.orderSuccess {
    overflow: auto;
    height: 100%;
    position: relative;
    &.pc{
        padding-bottom: 20px;
        .hasAdded{
            margin-bottom: 16px;
            margin-top:0;
            font-size: 14px;
        }
    }
    &.miniTrade{
        background: #fff;
    }
    .back {
        position: absolute;
        right: rem(40px);
        top: rem(40px);
        font-size: rem(40px);
        font-style: normal;
        color: inherit;
        &:active {
            opacity: 0.7;
            box-shadow: 0px 0px 999px rgba(0, 0, 0, 0.05) inset;
        }
    }
    .successIcon {
        display: block;
        position: relative;
        width: rem(90px);
        height: rem(90px);
        line-height: rem(110px);
        margin: rem(120px) auto 0;
        border-radius: 100%;
        text-align: center;
        color: #fff;
        font-size: rem(70px);
    }
    .title {
        text-align: center;
        padding-top: rem(20px);
        line-height: 1;
        font-size: rem(34px);
        padding-bottom: rem(20px);
        &.animate {
            opacity: 0;
            animation: fadeInUp 0.3s linear 0.9s forwards;
        }
    }
    .adTopBox {
        margin: rem(50px) auto 0;
        width: rem(580px);
    }
    .fullScreenLink {
        margin: rem(30px) auto rem(90px);
        width: rem(580px);
        text-align: center;
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
        padding: rem(66px) rem(40px);
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
    .dataBar ::v-deep {
        .van-cell__title {
            color: $muted;
        }
        .van-cell__value {
            color: #333;
        }
    }
    .dataBar {
        padding: 6px 0;
        white-space: nowrap;
        &::after {
            opacity: 0;
        }
    }
    .goonOrder,
    .toDetail {
        display: block;
        color: #fff;
        width: 100%;
        text-align: center;
        height: rem(80px);
        line-height: 1;
        border-radius: rem(6px);
        font-size: rem(26px);
        cursor: pointer;
    }
    .toDetail {
        background-color: #f4f7fc;
    }
    .btnGroup {
        margin-top: rem(45px);
    }
    .hasAdded {
        text-align: center;
        margin-top: rem(40px);
        color: $muted;
    }
}
.miniTradeInfo{
    margin: rem(45px) auto 0;
    width: rem(590px);
    .toDetail{
        height: rem(90px);
        font-size: rem(36px);
        background: #F3F8FE;
        border-radius: rem(10px);
    }
    .goonOrder{
        position: relative;
        height: rem(90px);
        font-size: rem(36px);
        line-height: 1.3;
    }
    .curBalance{
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
        top: 110%;
        color: #F39801;
        font-size: rem(26px);
    }
    .smallRow{
        font-size: 0;
        span{
            font-size: rem(20px);
            margin: 0;
        }
        i{
            font-size: rem(20px);
            color: #FFFC00;
            font-style: normal;
        }
    }
}
.miniTradeTip{
    margin: 0 auto;
    width: rem(500px);
    font-size: rem(30px);
    text-align: center;
    line-height: 1.5;
    .amount{
        color: #F39801;
    }
}
</style>
