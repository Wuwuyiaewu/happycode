<template>
    <!-- 产品详情 -->
    <div class='productDetail' :style="origin === 'miniTrade' && isExperience && 'padding-top: 0'">
        <Top v-show="!(origin === 'miniTrade' && isExperience)" ref='top'>
            <div v-if='product' class='productTopInfo'>
                <p class='productName'>
                    {{ product.simplified }}
                </p>
                <p v-if="language!=='en-US'" class='short_name'>
                    {{ product.short_name }}
                    <span class='priceTime'>
                        &nbsp;{{ $t('trade.update') }}:{{ priceTime }}
                    </span>
                </p>
            </div>
            <div slot='right' class='right-wrap'>
                <div class='collectIcon' @click='toggleSelf(product.code_id)'>
                    <i
                        ref='collect'
                        class='icon_zixuan1'
                        :class="{ 'icon_zixuan2':isSelfSymbol, 'loading':toggleSelfimg }"
                    ></i>
                </div>
                <div class='ft'>
                    <a
                        v-prophet="['trackEvent', '行情', '图表', '图表_合约属性', 53]"
                        href='javascript:;'
                        @click='toContractInfo'
                    >
                        <i class='icon_guanyu'></i>
                    </a>
                </div>
            </div>
        </Top>

        <section ref='container' class='container'>
            <div v-if='product' ref='productInfo' class='productInfo'>
                <div class='hd'>
                    <div class='hd-left' :class="origin === 'miniTrade' && isExperience && 'flex-auto'">
                        <p class='cur_price' :class='[product.cur_color]'>
                            {{ product.cur_price }}
                        </p>
                        <div v-if='origin === "miniTrade" && isExperience' class='hd-left-others'>
                            <span :class='product.upDownColor'>
                                {{ product.upDownAmount | filterNumberSign }}
                                <template
                                    v-if='product.upDownAmount_pip'
                                >
                                    ({{ product.upDownAmount_pip + $t('trade.point') }})
                                </template>
                            </span>
                            <div class='others-bottom'>
                                <span
                                    class='upDownAmount'
                                    :class='product.upDownColor'
                                >
                                    {{ product.upDownWidth | filterNumberSign }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if='!(origin === "miniTrade" && isExperience)' class='others'>
                        <span :class='product.upDownColor'>
                            {{ product.upDownAmount | filterNumberSign }}
                            <template
                                v-if='product.upDownAmount_pip'
                            >
                                ({{ product.upDownAmount_pip + $t('trade.point') }})
                            </template>
                        </span>
                        <div class='others-bottom'>
                            <span
                                class='upDownAmount'
                                :class='product.upDownColor'
                            >
                                {{ product.upDownWidth | filterNumberSign }}
                            </span>

                            <div v-if='product.groupSymbol.expiry_time' class='expire-date'>
                                <span class='label'>
                                    {{ $t('trade.expired') }}
                                </span>
                                <span class='value'>
                                    <template>{{ product.groupSymbol.expiry_time * 1000 | formatTime('DD/MM/YYYY') }}</template>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-if='origin === "miniTrade" && isExperience' class='account-info' @click='() => isAccountInfo=!isAccountInfo'>
                        <span class='text'>
                            {{ $t('trade.experibBalance') }}
                        </span>
                        <div class='balance'>
                            ${{ $store.state.ix_user.userLoginInfo.balance | moneyAccuracy(false) }}
                        </div>
                    </div>
                </div>
                <div v-if='!(origin === "miniTrade"&& isExperience)' class='bd'>
                    <div class='item'>
                        <p class='priceBottom'>
                            <span>{{ $t('trade.todayOpen') }}</span>
                            <span>{{ (product.lastPrice && product.lastPrice.open_price)|priceDigit(digit) }}</span>
                        </p>
                        <p>
                            <span>{{ $t('trade.yesterdayClosed') }}</span>
                            <span>{{ (product.lastPrice && product.lastPrice.yesterday_price) |priceDigit(digit) }}</span>
                        </p>
                    </div>

                    <div class='item'>
                        <p v-if='product.high_price' class='priceBottom'>
                            {{ $t('trade.high') }}
                            <span>{{ product.high_price | priceDigit(digit) }}</span>
                        </p>
                        <p v-if='product.low_price'>
                            {{ $t('trade.low') }}
                            <span>{{ product.low_price | priceDigit(digit) }}</span>
                        </p>
                        <!-- <p :data-high_price="product.high_price | priceDigit(digit)"></p>
                        <p :data-low_price="product.low_price | priceDigit(digit)"></p>-->
                    </div>

                    <div class='item'>
                        <p v-if='product.high_price' class='priceBottom'>
                            {{ $t('trade.amplitude') }}
                            <span>
                                <template v-if='amplitude'>
                                    {{ amplitude + $t('trade.point') }}
                                </template>
                            </span>
                        </p>
                        <p v-if='product.low_price'>
                            <span class='point-value'>
                                {{ $t('trade.pointValue') }}
                                <van-icon name='question-o' @click='showTips' />
                            </span>
                            <span>
                                <template
                                    v-if='volumePips'
                                >
                                    {{ volumePips | priceDigit }} {{ product.groupSymbol.profit_currency }}
                                </template>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <TVChart
                v-if='product && showChart'
                :height='chartHeight'
                :positions='position.position'
                :product-id='product.code_id'
            />
            <div class='positionList'>
                <p class='myPositions'>
                    {{ $t('trade.myPosition') }}
                </p>
                <template v-if='position.total>0'>
                    <template v-for='(item,index) in position.position'>
                        <a
                            v-if='index <3'
                            :key='item.id'
                            class='link'
                            href='javascript:;'
                            @click='positionRoute(item)'
                        >
                            <div class='left'>
                                <van-tag
                                    :class="[item.direction==1 ? 'riseColorBg':'fallColorBg']"
                                >
                                    {{ item.direction | direction }}
                                </van-tag>
                                <div class='direction'>
                                    {{ item.volume }}{{ $t('trade.volumeUnit') }}
                                </div>
                                <div class='amount'>
                                    {{ $t('trade.positionNetProfit') }}：
                                    <span
                                        :class="{ 'riseColor':(item.profitOrLoss+item.swap+item.commission)>0, 'fallColor':(item.profitOrLoss+item.swap+item.commission)<0 }"
                                    >
                                        {{ item.profitOrLoss+item.swap+item.commission | moneyAccuracy }}
                                    </span>
                                </div>
                            </div>
                            <div class='right'>
                                <van-button
                                    v-if='position.flg.last === index'
                                    class='positionBtn'
                                    size='mini'
                                >
                                    {{ $t('trade.check') }}
                                </van-button>
                                <template v-else>
                                    <!-- LP活动 -->
                                    <van-button
                                        v-if='origin === "miniTrade" && isExperience'
                                        class='positionBtn'
                                        size='mini'
                                        @click.prevent='fullToPath(item.id)'
                                    >
                                        {{ $t('trade.closed') }}
                                    </van-button>
                                    <van-button
                                        v-else
                                        class='positionBtn'
                                        size='mini'
                                        @click.prevent='sell(item)'
                                    >
                                        {{ $t('trade.closed') }}
                                    </van-button>
                                </template>
                            </div>
                        </a>
                    </template>
                    <a v-if='position.total >3' class='more' href='javascript:void(0)' @click='toPositionList'>
                        <span>
                            {{ $t('trade.morePosition') }}
                            <i class='van-icon van-icon-arrow'></i>
                        </span>
                    </a>
                </template>
                <div v-else-if='position.total === 0' class='noDataWrap'>
                    <ListEmpty icon-size='44px' :txt="$t(isGuest?'trade.positionForGuestTip':'trade.noPositions')" />
                </div>
            </div>
            <!-- <TVChartContainer class="productDetailChart" :product="product" /> -->
            <!-- <chart
                v-if="product && chartHeight>0"
                ref="candleChart"
                class="productDetailChart"
                :product="product"
                :height="chartHeight"
            />-->
        </section>

        <!-- 底部按钮 -->
        <div v-if='product' ref='footerBtnBox' class='footerBtnBox'>
            <div v-if='containsWatch' class='watch' @click='toWatch'>
                <i class='icon icon_icon_earlywarning'></i>
                <p class='text'>
                    {{ $t('trade.watch') }}
                </p>
            </div>
            <div class='trade-btn-wrap'>
                <div
                    v-prophet="['trackEvent', '行情', '图表', '图表_卖出', 56]"
                    class='sell'
                    :class="product.sell_color+'Bg'"
                    @click="toOrder('sell')"
                >
                    <span>{{ $t('trade.sell') }}</span>
                    <span class='price'>
                        {{ product.sell_price }}
                    </span>
                </div>
                <div
                    v-prophet="['trackEvent', '行情', '图表', '图表_买入', 55]"
                    class='buy'
                    :class="product.buy_color+'Bg'"
                    @click="toOrder('buy')"
                >
                    <span>{{ $t('trade.buy') }}</span>
                    <span class='price'>
                        {{ product.buy_price }}
                    </span>
                </div>
                <span v-if='product.spread_text' class='spread_text'>
                    {{ product.spread_text }}
                </span>
            </div>

            <div v-if='origin === "miniTrade" && isExperience' class='scrollToPosition' @click='handleScrollToPosition'>
                <span>
                    {{ $t('trade.position') }}
                </span>
            </div>
        </div>

        <DialogPc :orderid='activeOrder.id' :show.sync='showSell' />

        <!-- 合约属性 -->
        <van-popup v-model='contractInfoVisible' position='right' :style="{ width: '85%' }">
            <ContractInfo @close='contractInfoVisible=false' />
        </van-popup>

        <!--  -->
        <accountInfoDialog :is-show.sync='isAccountInfo' />

        <ActivityProcess v-if='activityProcessVisible' />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { add, del } from '@/api/selfSymbol'
import DialogPc from '@m/components/DialogPc'
import { getLoginData, encryptLoginData } from '@/utils/index'
import Top from '@m/layout/top'
import dayjs from 'dayjs'
// import Chart from './chart.vue'
import TVChart from '@m/components/tradingview/tv'
import ContractInfo from '@m/views/contractInfo'
import ListEmpty from '@m/components/ListEmpty'
import { toFixed } from '@/utils/calculation'
import { volumePips, profitToUSD } from '@/store/ix_utils'
import accountInfoDialog from './accountInfoDialog'
import ActivityProcess from '@m/components/activityProcess'

export default {
    name: 'ProductDetail',
    components: {
        Top,
        // Chart,
        TVChart,
        ListEmpty,
        ContractInfo,
        DialogPc,
        accountInfoDialog,
        ActivityProcess
    },
    filters: {
        formatTime (timestamp, format) {
            return dayjs(timestamp).format(format)
        }
    },
    data () {
        return {
            showSell: false,
            showChart: false,
            contractInfoVisible: false,
            chartHeight: 320, // tradingview图表高度
            toggleSelfimg: false,
            activeOrder: {},
            isAccountInfo: false,
            activityProcessVisible: false
        }
    },
    computed: {
        ...mapGetters(['isExperience']),
        ...mapState({
            product_map: state => state.ix_quote.product_map,
            product_list: state => state.ix_quote.product_list,
            selfSymbolList: state => state.selfSymbolList,
            origin: state => state.origin
        }),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        ...mapGetters(['accountData', 'accountCurrency', 'symbolCode']),
        productId () {
            const id = this.$route.params.id
            if (isNaN(id)) {
                const item = this.product_list.find(el => el.short_name === id)
                return item ? item.code_id : 0
            } else {
                return id
            }
        },
        product () {
            return this.product_map[this.productId]
        },
        symbol () {
            return this.product.short_name
        },
        position () {
            const positions = this.accountData.positionList.filter(item => (item.code_id == this.productId))
            const data = {
                flg: {
                    last: -1,
                    max: -1,
                    min: -1
                },
                total: positions.length,
                position: positions
            }
            /*  if (data.total > 0) {
                 const times = []
                 positions = positions.sort((preItem, item) => {
                     if (preItem.profitOrLoss !== '--' && preItem.profitOrLoss !== '--') {
                         return item.profitOrLoss - preItem.profitOrLoss
                     } else {
                         return true
                     }
                 })
                 if (data.total < 2) {
                     data.position.push(positions[0])
                     if (positions[0].profitOrLoss >= 0) {
                         data.flg.max = 0
                     } else {
                         data.flg.min = 0
                     }
                 } else {
                     const positinoPushIndex = []
                     if (positions[0].profitOrLoss > 0) {
                         data.position.push(positions[0])
                         times.push(positions[0].open_time)
                         positinoPushIndex.push(positions[0].id)
                         data.flg.max = data.position.length - 1
                     }
                     if (positions[data.total - 1].profitOrLoss < 0 && positions[0].profitOrLoss !== positions[data.total - 1].profitOrLoss) {
                         data.position.push(positions[data.total - 1])
                         times.push(positions[data.total - 1].open_time)
                         data.flg.min = data.position.length - 1
                         positinoPushIndex.push(positions[data.total - 1].id)
                     }

                     const positionsSortTime = positions.sort((preItem, item) => {
                         return item.open_time - preItem.open_time
                     })
                     if (times.indexOf(positionsSortTime[0].open_time) < 0) {
                         data.position.push(positions[0]) - 1
                         data.flg.last = data.position.length - 1
                         positinoPushIndex.push(positions[0].id)
                     }
                     if (data.position.length < 3) {
                         for (let i = 0; i < positions.length; i++) {
                             if (data.position.length < 3 && positinoPushIndex.indexOf(positions[i].id) < 0) {
                                 data.position.push(positions[i])
                                 if (data.position.length >= 3) {
                                     continue
                                 }
                             }
                         }
                     }
                 }
             } */

            return data
        },
        digit () {
            const product = this.product
            return product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
        },
        priceTime () {
            const product = this.product
            const t = product.tm || product.time
            return t ? dayjs(t * 1000).format('HH:mm:ss') : null
        },
        // 是否为自选产品
        isSelfSymbol () {
            return this.selfSymbolList.find(el => el.symbolId === parseInt(this.productId))
        },
        isGuest () {
            return !getLoginData()
        },
        // 是否配置盯盘入口
        containsWatch () {
            return this.ad.uiModules && this.ad.uiModules.find(el => el.img.includes('/watch/record'))
        },
        // 振幅
        amplitude () {
            const product = this.product
            return toFixed((product.high_price - product.low_price) / product.groupSymbol.pip, String(this.product.groupSymbol.pips_ratio).length - 1)
        },
        productInfo () {
            if (this.$route.params && this.$route.params.id) {
                return this.$store.state.ix_quote.product_map[this.$route.params.id] || { groupSymbol: {} }
            } else {
                return { groupSymbol: {} }
            }
        },
        // 该产品盈利货币兑美元的币种
        profitToUSD () {
            return profitToUSD(this.productInfo, this.product_list)
        },
        volumePips () {
            return volumePips(this.productInfo)
        }
    },
    created () {
        this.init()
    },
    mounted () {
        this.$ws.send_addSubscription_proList([this.productId])
        this.calculatHeight()
        window['productDetail'] = this
    },
    methods: {
        ...mapActions({
            'symoblCanTrade': 'ix_baseInfo/symoblCanTrade'
        }),
        init () {
            this.$store.dispatch('ix_quote/getProductInfo', this.productId)
            this.$store.commit('ix_quote/UPDATE_PRODUCT_ACTIVATED_ID', this.productId)
        },
        toPositionList () {
            this.$router.push({ name: 'PositionIndex' })
        },
        toOrder (direction) {
            const product = this.product
            const id = product.code_id
            const groupSymbol = product.groupSymbol
            const loginData = getLoginData()
            const LPJump = () => {
                const path = '/order'
                window.top.location = `${location.protocol}//${location.host}/${window.htmlKey + path}/${id}?direction=${direction}&t=${encryptLoginData()}`
            }

            if (!loginData) {
                if (this.origin === 'miniTrade' && !this.isExperience) {
                    return LPJump()
                } else {
                    return this.$router.push({ name: 'Order', params: { id }, query: { ...this.$route.query, direction } })
                }
            }
            if (!groupSymbol || !groupSymbol.name) { //  || groupSymbol.tradable !== 1 暂时去掉tradable判断，ix系统没有
                return this.$alert(this.$t('loginTip.productClose'))
            } else if (!groupSymbol.volumes_step) {
                return this.$toast(this.$t('compLang.loading'))
            } else if (groupSymbol.enable !== 1) {
                return this.$alert(this.$t('productStatus.' + groupSymbol.enable) + this.$t('productStatus.linkService'))
            }
            this._collect(direction === 'sell' ? '卖出' : '买入')

            if (this.origin === 'miniTrade' && !this.isExperience) {
                LPJump()
            } else {
                this.$router.push({ name: 'Order', params: { id }, query: { ...this.$route.query, direction } })
            }
        },
        // 显示全屏过渡效果
        showActivityProcess () {
            return new Promise(resolve => {
                this.activityProcessVisible = true
                setTimeout(resolve, 2500)
            })
        },
        // 全屏打开持仓页面
        fullToPath (positionId) {
            this.showActivityProcess().then(() => {
                const path = '/position'
                window.top.location = `${location.protocol}//${location.host}/${window.htmlKey + path}?close=${positionId}&t=${encryptLoginData()}`
            })
        },
        sell (data) {
            this.symoblCanTrade(data.groupSymbol.id)
                .then(res => {
                    if (!res.mayTrade) {
                        this.$toast({ duration: 2000, message: this.$t('trade.marketIsClosed') })
                        return
                    }
                    this.activeOrder = data
                    this.showSell = true
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        calculatHeight () {
            const top = this.$refs.top.$el
            const productInfo = this.$refs.productInfo
            const footerBtnBox = this.$refs.footerBtnBox
            this.chartHeight = document.body.clientHeight - top.clientHeight - productInfo.clientHeight - footerBtnBox.clientHeight - 100
            this.showChart = true
        },
        toggleSelf (code_id) {
            if (this.toggleSelfimg) return false
            if (this.accountInfo && this.accountInfo.accountType) {
                let submit
                if (this.isSelfSymbol) {
                    submit = del([this.isSelfSymbol.id])
                } else {
                    if (this.selfSymbolList.length >= 200) {
                        return this.$toast(this.$t('optional.optionalMoreThanMax'))
                    }
                    submit = add({
                        symbolId: code_id
                    })
                }

                const collect = this.$refs.collect
                this.toggleSelfimg = true

                submit.then(res => {
                    if (parseInt(res.code) === 1) {
                        const msg = this.$t(this.isSelfSymbol ? 'optional.cancelSuccess' : 'optional.addSuccess')
                        this.$store.dispatch('getSelfSymbolList')
                            .then(() => {
                                this.toggleSelfimg = false
                                this.$toast(msg)
                                // 取消自选动画
                                this.$nextTick(function () {
                                    const className = this.isSelfSymbol ? 'heartBeat' : 'zoomIn'
                                    collect.classList.add(className)
                                    setTimeout(() => {
                                        collect.classList.remove(className)
                                    }, 500)
                                })
                            })
                    } else {
                        this.$toast(res.errMsg || res.msg || res.message)
                        this.toggleSelfimg = false
                    }
                })
                    .catch(error => {
                        this.toggleSelfimg = false
                        console.log(error)
                    })
            } else {
                this.$router.push({ name: 'Login' })
            }
        },
        // 跳转到合约属性
        toContractInfo () {
            if (!this.$store.state.ix_user.userLoginInfo.account_id) return this.$router.push({ name: 'Login' })
            this.contractInfoVisible = true
            if (!this.profitToUSD.buy_price) this.$ws.send_addSubscription_proList([this.productId, this.profitToUSD.code_id])
            // this.$router.push({ name: 'ContractInfo', params: { id: this.product.code_id } })
        },
        toWatch () {
            const uiModules = this.ad.uiModules && this.ad.uiModules.find(el => el.img.includes('/watch/record'))
            const link = uiModules.img
            const watchOrigin = link.slice(0, link.indexOf('/watch'))
            const url = `${watchOrigin}/watch/product/` + this.productId
            if (!this.$store.state.ix_user.userLoginInfo.account_id) {
                const cb = `/nest/queryinfo?hidehead=1&title=${this.$t('trade.watch')}&url=` + encodeURIComponent(url)
                this.$router.push({ name: 'Login', query: { cb: encodeURIComponent(cb) } })
                return false
            }
            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url, title: this.$t('trade.watch'), hidehead: 1 } })
        },

        showTips () {
            const { market_id } = this.product
            let message = ''
            if ([0, 1, 2, 9].includes(market_id)) {
                // 股票
                message = this.$t('trade.stocksPointDesc')
            } else if ([100, 101, 102, 103].includes(market_id)) {
                // 牛熊期权
                message = this.$t('trade.bullBearPointDesc')
            } else {
                // 其他
                message = this.$t('trade.nonStocksAndnonBullPointDesc')
            }

            this.$dialog.alert({
                title: this.$t('trade.descTitle'),
                message: message,
            })
        },
        handleScrollToPosition () {
            this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight
        },
        positionRoute (item) {
            if (this.origin === 'miniTrade') return
            this.$router.push({ name: 'MyOrderInfo', params: { id: item.id } })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/animations.scss";
@import "~@m/sass/mixin.scss";
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .productName {
        @include ellipsis;
    }
    .short_name {
        margin-top: rem(8px);
        font-size: rem(20px);
        color: $muted;
    }
}
.right-wrap {
    display: flex;
    flex-direction: row;
    height: 100%;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    .ft {
        margin-left: rem(30px);
        a {
            display: inline-block;
        }
        .icon_guanyu {
            color: rgb(153, 153, 153);
        }
    }
}
.collectIcon {
    height: 100%;
    width: rem(40px);
    vertical-align: top;
    color: #777;
    .icon_zixuan1 {
        vertical-align: top;
        font-weight: normal !important;
    }
    .icon_zixuan2 {
        position: absolute;
        top: 0;
        vertical-align: top;
        color: #fc822f;
        &.heartBeat {
            animation: heartBeat 1.3s ease-in-out forwards;
        }
    }
    .loading {
        position: relative;
        &::before {
            position: absolute;
            animation: loading 0.6s linear infinite;
        }
    }
    .zoomIn {
        position: relative;
        &::before {
            position: absolute;
            animation: zoomIn 0.6s linear forwards;
        }
    }
}
.productDetail {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding: rem(90px) 0 rem(100px);
    .container {
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        @include scroll();
    }
    .productDetailChart {
        min-height: 450px;
        height: calc(100% - 23.2vw);
    }
}
.productInfo {
    position: relative;
    padding: rem(10px) rem(20px) rem(10px) rem(20px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    transform: translateZ(1px);
    background: #fff;
    // margin-bottom: rem(10px);
    .hd {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        min-width: rem(265px);
        line-height: 1;
        font-size: rem(24px);
        .others {
            flex: 1;
            margin-left: rem(10px);
            > span {
                display: block;
                margin: rem(5px) 0;
            }
            .others-bottom {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
            }
        }
        .expire-date {
            flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-end;
            align-self: flex-end;
            color: #646566;
            font-size: rem(24px);
            white-space: nowrap;
            .value {
                min-width: rem(153px);
                text-align: right;
            }
        }

        .account-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: rem(21px);
            border: 2px solid #FF8400;
            border-radius:rem(10px);
            font-weight: 500;
            color: #FF8400;
            padding: rem(14px) rem(17px) rem(10px);
            .text{
                display: block;
                font-size: rem(22px);
                line-height: rem(24px);
                margin-bottom: rem(5px);
            }
            .balance{
                font-size: rem(30px);
                font-weight: 400;
                line-height: rem(32px);
            }
        }

        .hd-left{
            &.flex-auto{
                flex:1
            }
            .hd-left-others{
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                .others-bottom{
                    margin-left: rem(20px);
                }
            }
        }
    }
    .bd {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding-top: rem(20px);
        color: #646566;
        font-size: rem(24px);
        .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-left: rem(50px);
            &:first-child {
                margin-left: 0;
            }
            &:first-child {
                margin-right: rem(5px);
            }
            > p {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: nowrap;
                white-space: nowrap;
                &.priceBottom {
                    margin-bottom: rem(10px);
                }
            }
        }
        .point-value {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            .van-icon {
                padding: 0 rem(5px);
            }
        }
    }
    .priceTime {
        position: absolute;
        right: rem(20px);
        top: rem(35px);
        color: #777;
    }

    .cur_price {
        font-size: rem(60px);
        // padding-bottom: rem(13px);
    }
    .upDownAmount {
        // padding-left: rem(20px);
    }

    .icon_icon_prompt {
        font-size: rem(40px);
        vertical-align: middle;
        color: $muted;
        @include active();
    }
}
// 底部按钮
.footerBtnBox {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    height: rem(100px);
    line-height: rem(100px);
    text-align: center;
    .watch {
        width: rem(110px);
        background-color: #fff;
        line-height: 1;
        padding-top: rem(20px);
        @include active();
        .icon {
            font-size: rem(40px);
        }
        .text {
            padding-top: rem(8px);
            font-size: rem(20px);
        }
    }

    .trade-btn-wrap {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        white-space: nowrap;
    }

    .sell,
    .buy {
        position: relative;
        flex: 1;
        color: #fff;
        background-color: #858c9a;
        @include active();
    }
    .sell::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.15);
    }
    .sell {
        .price {
            padding-right: rem(50px);
        }
    }
    .buy {
        .text {
            padding-left: rem(50px);
        }
    }
    .text {
        font-size: rem(28px);
        vertical-align: middle;
    }
    .price {
        padding-left: rem(10px);
        font-size: rem(40px);
        vertical-align: middle;
    }
    .spread_text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 3px;
        font-size: rem(28px);
        color: #666;
        height: rem(44px);
        line-height: rem(46px);
        padding: 0 rem(14px);
    }

    .scrollToPosition{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        flex: 0 0 rem(140px);
        background: #F6F6F6;
        font-size: rem(28px);
        font-weight: 500;
        color: #333333;
    }
}

.positionList {
    background-color: #ffffff;
    padding-bottom: rem(30px);
    margin-top: rem(10px);
    .myPositions {
        height: rem(80px);
        line-height: rem(80px);
        text-align: center;
        background: #fff;
        border-bottom: 1px solid #f9f9f9;
    }
    .positionBtn {
        background: #f3f8ff;
        border-radius: 0.2em;
    }
    .link {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: rem(30px);
        border-top: solid 1px #efefef;
        color: #333333;
        font-size: rem(24px);
        background: #fff;
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
                    min-width: rem(104px);
                    padding: 0 rem(10px);
                    height: rem(48px);
                    font-size: rem(24px);
                }
            }
        }
    }
    .more {
        display: inline-block;
        border-top: solid 1px #efefef;
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

    .noDataWrap {
        margin: rem(40px);
        text-align: center;
        .text {
            color: #bbbbbb;
            font-size: rem(24px);
        }
        ::v-deep {
            .m-listEmpty {
                padding-top: 0;
                line-height: 1.2;
            }
        }
    }
}
</style>
