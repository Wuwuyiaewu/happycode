<template>
    <div class='homeWrapper'>
        <div id='mainContainter' class='mainContainter'>
            <div class='vertical-panes multipane layout-v' layout='vertical'>
                <div
                    class='pane symbol-area'
                    :class='{ pucker:collected }'
                >
                    <span class='stuff' @click.stop='toggleCollected'>
                        <i class='iconfont icon_icon_back'></i>
                    </span>
                    <Trade @search='visibilitySearch' />
                    <Search v-if='showSearch' @search='visibilitySearch' />
                </div>
                <div ref='product-wrap' class='pane center-pane'>
                    <Multipane class='horizontal-panes' layout='horizontal' @paneResize='resized'>
                        <div ref='chart-area' class='chart-area' :style='pane'>
                            <div ref='product-info' class='productInfo'>
                                <div class='info-top'>
                                    <div class='name'>
                                        <p class='name_cn'>
                                            {{ product.simplified }}
                                        </p>
                                        <p class='name_en'>
                                            {{ product.short_name }}
                                            <span class='priceTime'>
                                                &nbsp;{{ $t('trade.update') }}:{{ priceTime }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class='price-item operation'>
                                        <span class='collectIcon' @click='toggleSelf(product.code_id)'>
                                            <i
                                                ref='collect'
                                                class='icon_zixuan1'
                                                :class="{ 'icon_zixuan2':isSelfSymbol, 'loading':toggleSelfimg }"
                                            ></i>
                                        </span>

                                        <a
                                            v-prophet="['trackEvent', '行情', '图表', '图表_合约属性', 53]"
                                            href='javascript:void(0)'
                                            @click='toContractInfo'
                                        >
                                            <i class='icon_guanyu'></i>
                                        </a>
                                    </div>
                                </div>

                                <div class='info-bottom'>
                                    <div class='increase'>
                                        <p class='cur_price' :class='[product.cur_color]'>
                                            {{ product.cur_price }}
                                        </p>
                                        <div class='others'>
                                            <span
                                                :class='product.upDownColor'
                                            >
                                                {{ product.upDownAmount | filterNumberSign }}
                                                <template
                                                    v-if='product.upDownAmount_pip'
                                                >
                                                    ({{ product.upDownAmount_pip + $t('trade.point') }})
                                                </template>
                                            </span>
                                            <span
                                                class='upDownAmount'
                                                :class='product.upDownColor'
                                            >
                                                {{ product.upDownWidth | filterNumberSign }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class='price-item open-close'>
                                        <p class='priceBottom'>
                                            <span>{{ $t('trade.todayOpen') }}</span>
                                            <span>{{ (product.lastPrice && product.lastPrice.open_price)|priceDigit(digit) }}</span>
                                        </p>
                                        <p class='priceBottom'>
                                            <span>{{ $t('trade.yesterdayClosed') }}</span>
                                            <span>{{ (product.lastPrice && product.lastPrice.yesterday_price) |priceDigit(digit) }}</span>
                                        </p>
                                    </div>

                                    <div class='price-item high-close'>
                                        <p v-if='product.low_price' class='priceBottom'>
                                            <span>{{ $t('trade.low') }}</span>
                                            <span>{{ product.low_price | priceDigit(digit) }}</span>
                                        </p>
                                        <p v-if='product.high_price' class='priceBottom'>
                                            <span>{{ $t('trade.high') }}</span>
                                            <span>{{ product.high_price | priceDigit(digit) }}</span>
                                        </p>
                                    </div>

                                    <div class='price-item'>
                                        <p v-if='product.high_price' class='priceBottom'>
                                            <span>
                                                {{ $t('trade.amplitude') }}
                                            </span>
                                            <span>
                                                <template v-if='amplitude'>
                                                    {{ amplitude + $t('trade.point') }}
                                                </template>
                                            </span>
                                        </p>
                                        <p v-if='product.low_price' class='priceBottom'>
                                            <span class='point-value'>
                                                <i class='point-i'>
                                                    {{ $t('trade.pointValue') }}
                                                </i>
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

                                    <div v-if='product.groupSymbol && product.groupSymbol.expiry_time' class='price-item'>
                                        <p class='priceBottom'>
                                            <span>{{ $t('trade.expired') }}</span>
                                            <span>{{ product.groupSymbol.expiry_time * 1000 | formatTime('DD/MM/YYYY') }}</span>
                                        </p>
                                    </div>

                                    <div class='trade-btn-wrap'>
                                        <div class='trade-btn'>
                                            <div
                                                class='btn sell'
                                                :class="product.sell_color+'Bg'"
                                                @click="toOrder('sell')"
                                            >
                                                <span class='price'>
                                                    {{ product.sell_price }}
                                                </span>
                                                <span class='label'>
                                                    {{ $t('trade.sell') }}
                                                </span>
                                            </div>
                                            <div
                                                class='btn buy'
                                                :class="product.buy_color+'Bg'"
                                                @click="toOrder('buy')"
                                            >
                                                <span class='price'>
                                                    {{ product.buy_price }}
                                                </span>
                                                <span class='label'>
                                                    {{ $t('trade.buy') }}
                                                </span>
                                            </div>
                                            <span v-if='product.spread_text' class='spread_text'>
                                                {{ product.spread_text }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='tv-wrap'>
                                <TVChart
                                    v-if='product_activatedId'
                                    ref='TVChart'
                                    :height='chartHeight'
                                    :positions='position.position'
                                    :product-id='product_activatedId'
                                />
                            </div>
                        </div>
                        <MultipaneResizer />
                        <div ref='position' class='position-area' :class='{ collapsed:collapsed }' :style="{ minHeight: '190px' }">
                            <div class='accordion'>
                                <div class='collapse-header'>
                                    <ul>
                                        <li :class='{ active:subTabActive===0 }' @click.stop='tabClick(0)'>
                                            <span>{{ $t('router.positionList') }}({{ positionNum }})</span>
                                        </li>
                                        <li :class='{ active:subTabActive===1 }' @click.stop='tabClick(1)'>
                                            <span>{{ $t('router.pending') }}({{ billQuantity }})</span>
                                        </li>
                                        <li :class='{ active:subTabActive===2 }' @click.stop='tabClick(2)'>
                                            <span>{{ $t('router.closed') }}</span>
                                        </li>
                                    </ul>
                                    <div @click.stop='toggleCollapsed'>
                                        <van-icon name='arrow-down' />
                                    </div>
                                </div>
                                <div ref='table' class='collapse-content'>
                                    <PositionListA v-if='subTabActive===0' />
                                    <PositionListB
                                        v-if='subTabActive===1'
                                        ref='pending'
                                        :data-list='pendingDataList'
                                        @get-pendings='getPendings'
                                    />
                                    <PositionListC v-if='subTabActive===2' />
                                </div>
                            </div>
                        </div>
                    </Multipane>
                </div>
                <div class='pane fixed-menu-bar'>
                    <ul>
                        <li
                            v-for='(item, index) in rightMenu'
                            :key='index'
                            v-prophet='prophetObj[item.url.trim()]'
                            v-tooltip.left='item.title'
                            :class='{ active:linkActiveIndex===index }'
                            :data-href='item.url'
                            placement='auto'
                            @click='toPage(item,index)'
                            @click.native='_collect(item.title)'
                        >
                            <em v-if="item.url&& item.url.indexOf('/msg') === 0 && totalMsgNum>0">
                                {{ totalMsgNum | showMsgNum }}
                            </em>
                            <span class='s-img'>
                                <img class='icon_icon' :src='item.img' />
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class='footer-bar'>
            <div class='update-time'>
                {{ new Date().getTime() | formatTime('HH:mm:ss') }}
                (GMT+{{ new Date().getTimezoneOffset()/-60 }})
            </div>
            <template v-if='userLoginInfo.account_id'>
                <div class='fund-content' :class='{ hover:showAsset }' @mouseleave='hideMyAsset' @mouseover='showMyAsset'>
                    <MyAssetPc v-show='showAsset' @childToParent='toggleMyAsset' />
                    <ul>
                        <li>
                            <div class='label'>
                                {{ $t('fundingDetails.balance') }}({{ symbolCode }})
                            </div>
                            <div class='value'>
                                {{ userLoginInfo.balance | moneyAccuracy(false) }}
                            </div>
                        </li>
                        <li>
                            <div class='label'>
                                {{ $t('trade.netAssets') }}
                            </div>
                            <div class='value'>
                                {{ assetAboutInfo.accountData.jz | formatNetAssets }}
                            </div>
                        </li>
                        <li>
                            <div class='label'>
                                {{ $t('trade.netProfit') }}
                            </div>
                            <div
                                class='value'
                                :class="{
                                    'riseColor':assetAboutInfo.accountData.jyk>0,
                                    'fallColor':assetAboutInfo.accountData.jyk<0 }"
                            >
                                {{ assetAboutInfo.accountData.jyk | moneyAccuracy }}
                            </div>
                        </li>
                        <li>
                            <div class='label'>
                                {{ $t('trade.marginLevel') }}
                            </div>
                            <div
                                class='value'
                                :class='assetAboutInfo.colorClass'
                            >
                                {{ marginLevel }}
                            </div>
                        </li>
                        <li>
                            <div class='label'>
                                {{ $t('trade.free') }}
                            </div>
                            <div class='value'>
                                {{ assetAboutInfo.accountData.kybzj | moneyAccuracy(false) }}
                            </div>
                        </li>
                        <li>
                            <div class='show-operate'>
                                <van-icon name='arrow-down' />
                            </div>
                        </li>
                    </ul>
                </div>
                <template v-if='isActivityUser'>
                    <div
                        class='activity-content'
                        :class='{ hover:showActivity }'
                        @mouseleave='hideMyActivity'
                        @mouseover='showMyActivity'
                        @show='hideMyActivity'
                    >
                        <Activity v-show='showActivity' ref='activity' />
                        <ul>
                            <li @click='showData'>
                                <div class='label'>
                                    {{ $t('activity.balanceMax') }}
                                    <van-icon class='tip' name='question-o' />
                                </div>
                                <div class='value'>
                                    {{ accInfo.maxAmount }}
                                </div>
                            </li>
                            <li>
                                <div class='label'>
                                    {{ $t('activity.pendingBonus') }}
                                </div>
                                <div class='value'>
                                    {{ accInfo.pendingAmount }}
                                </div>
                            </li>
                            <li>
                                <div class='show-operate'>
                                    <van-icon name='arrow-down' />
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>

                <div class='cash-in' :class="{ hidden:!accountInfo.accountNo && accountInfo.accountType === 'demo' }">
                    <template v-if='isActivityUser'>
                        <a href='javascript:void(0)' @click='resetDemoAccount'>
                            {{ $t('activity.resetAccount') }}
                        </a>
                        <router-link
                            v-prophet="['trackEvent', '我的', '我的页面', '我的页面_入金', 28]"
                            :to="{ name: 'DepositFunds' }"
                        >
                            {{ $t('activity.received') }}
                        </router-link>
                    </template>
                    <template v-else-if="accountInfo.accountType === 'demo'">
                        <a href='javascript:void(0)' @click.stop='changeAccountType(accountInfo.accountType)'>
                            {{ $t('trade.toReal') }}
                        </a>
                    </template>
                    <template v-else>
                        <router-link
                            v-prophet="['trackEvent', '我的', '我的页面', '我的页面_入金', 28]"
                            :to="{ name: 'DepositFunds' }"
                        >
                            {{ $t('trade.deposit') }}
                        </router-link>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import Trade from '@pc/views/trade/trade'
import TVChart from '@m/components/tradingview/tv'
import { Multipane, MultipaneResizer } from '@pc/components/multipane'
import PositionListA from '@m/views/trade/position/PositionListA'
import PositionListB from '@m/views/trade/position/PositionListB'
import PositionListC from '@m/views/trade/position/PositionListC'
import Tab from '@m/modules/tab'
import MyAssetPc from '@m/components/MyAssetPc'
import Search from '@m/views/search'
import Activity from '@m/views/mine/Activity.vue'
import { add, del } from '@/api/selfSymbol'
import { getLoginData, localGet, localSet } from '@/utils/index'
import CustomEvent from '@/utils/custom-event'
import { debounce } from '@/utils/tools'
import { toFixed } from '@/utils/calculation'
import { volumePips, profitToUSD } from '@/store/ix_utils'
import { resetAccount } from '@/api/mine'
import geoPermission from '@/pages/mobile/mixins/geoPermission.js'

export default {
    name: 'Home',
    components: {
        Tab,
        Trade,
        MyAssetPc,
        Activity,
        TVChart,
        Multipane,
        Search,
        rzIndex: 1004,
        MultipaneResizer,
        PositionListA,
        PositionListB,
        PositionListC,
    },
    mixins: [geoPermission],
    filters: {
        formatNetAssets (value) {
            return typeof value === 'number' ? value.toFixed(2) : '--'
        },
        formatTime (timestamp, format) {
            return dayjs(timestamp).format(format)
        }
    },
    data () {
        return {
            screenHeight: 0,
            toggleSelfimg: false,
            chartHeight: 309,
            showAsset: false,
            showSearch: false,
            showActivity: false,
            showBonus: false,
            collapsed: false,
            collected: false,
            showService: false,
            pane: {
                minHeight: '400px'
            },
            updateHeight: null,
            updateActivity: null,
            positionHeight: 190,
            pendingDataList: [],
            linkActiveIndex: -1,
            subTabList: [
                { title: this.$t('router.positionList'), value: 'PositionListA' },
                { title: this.$t('router.pending'), value: 'PositionListB' },
                { title: this.$t('router.closed'), value: 'PositionListC' }
            ],
            subTabActive: 0,
            prophetObj: {
                '/mine/fundingDetails': ['trackEvent', '我的', '我的页面', '我的页面_资金明细', 33],
                '/mine/setting': ['trackEvent', '我的', '我的页面', '我的页面_设置', 35],
                '/pay/user/userSelfInfo': ['trackEvent', '我的', '我的页面', '我的页面_个人信息', 31],
                '/mt4': ['trackEvent', '我的', '我的页面', '我的页面_MT4出入金', 34],
                'msg': ['trackEvent', '我的', '我的页面', '我的页面_消息中心', 32]
            }
        }
    },
    computed: {
        ...mapGetters(['accountData', 'symbolCode', 'assetAboutInfo']),
        ...mapActions(['getAccPriceInfo', 'getMsgTotal']),
        ...mapState({
            product_map: state => state.ix_quote.product_map,
            product_list: state => state.ix_quote.product_list,
            selfSymbolList: state => state.selfSymbolList,
            subSymbolList: state => state.ix_quote.subscription_proList,
        }),
        totalMsgNum () {
            if (this.$store.state.msgData.msgTypeList.length > 0) {
                return this.$store.state.msgData.msgTypeList[0].msgNum
            } else {
                return 0
            }
        },
        accInfo () {
            return this.$store.state.accInfo ? this.$store.state.accInfo : {}
        },
        isActivityUser () {
            return this.accInfo.maxAmount > 0 && this.accountInfo.accountType === 'demo'
        },
        // 是否为自选产品
        isSelfSymbol () {
            return this.selfSymbolList.find(el => el.symbolId === parseInt(this.productId))
        },
        productId () {
            const id = this.product_activatedId
            if (isNaN(id)) {
                const item = this.product_list.find(el => el.short_name === id)
                return item ? item.code_id : 0
            } else {
                return id
            }
        },
        product () {
            // debugger
            return this.product_map[this.productId] || {}
        },
        priceTime () {
            const product = this.product
            const t = product.tm || product.time
            return t ? dayjs(t * 1000).format('HH:mm:ss') : null
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo
        },
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        showListType () {
            return this.subTabList[this.subTabActive] && this.subTabList[this.subTabActive].value
        },
        marginLevel () {
            return this.assetAboutInfo.accountData.csbzj <= 0 ? '--' : (this.assetAboutInfo.accountData.jz.toFixed(2) / this.assetAboutInfo.accountData.csbzj * 100).toFixed(2) + '%'
        },
        rightMenu () {
            return this.menu.filter(link => {
                const mt4Deposit = '/mt4'
                if (link.url.includes(mt4Deposit)) {
                    Object.assign(link, { url: mt4Deposit })
                }
                // 隐藏代理系统，盯盘，个人信息，Cats出金，Cats入金
                if (link.url.indexOf('watch') > -1 || ['/pay/user/userSelfInfo', '/my/withAmount', '/my/depositFunds'].indexOf(link.url) > -1) {
                    return false
                } else {
                    return true
                }
            })
        },
        menu () {
            // debugger
            return (this.$store.state.ix_baseInfo.companyInfo.uiPageList.Mine && this.$store.state.ix_baseInfo.companyInfo.uiPageList.Mine.menu) || []
        },
        billQuantity () {
            return this.pendingDataList.length
        },
        product_activatedId () {
            // debugger
            return this.$store.state.ix_quote.product_activatedId
        },
        productMap () {
            return this.$store.state.ix_quote.product_map
        },
        positionNum () {
            return this.accountData.positionList.length
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
            return data
        },
        productInfo () {
            if (this.productId) {
                return this.$store.state.ix_quote.product_map[this.productId] || { groupSymbol: {} }
            } else {
                return { groupSymbol: {} }
            }
        },
        // 该产品盈利货币兑美元的币种
        profitToUSD () {
            return profitToUSD(this.productInfo, this.product_list)
        },
        // 振幅
        amplitude () {
            const product = this.product
            return toFixed((product.high_price - product.low_price) / product.groupSymbol.pip, String(this.product.groupSymbol.pips_ratio).length - 1)
        },
        volumePips () {
            return volumePips(this.productInfo)
        },
        digit () {
            const product = this.product
            return product.groupSymbol && product.groupSymbol.hasOwnProperty('digits') ? product.groupSymbol.digits : product.digit
        },
    },
    watch: {
        productId (newval) {
            this.$ws.send_addSubscription_proList([...this.subSymbolList, newval])
            this.$store.dispatch('ix_quote/getProductInfo', newval).then(res => {
                console.log(res)
            })
            this.$ws.send('lastPrice', { code_ids: [newval] })
        },
        $route (to, from) {
            // 对路由变化作出响应...
            if (to.query.tab === 1) {
                this.subTabActive = 1
            }
            if (to.query.tab === 0) {
                this.subTabActive = 0
            }
            if (from.name === 'SellSuccess') {
                this.subTabActive = 2
            }
        }
    },
    created () {
        this.screenHeight = window.innerHeight
        if (localGet('positionH')) {
            this.positionHeight = localGet('positionH')
        }
        // console.log('menu', this.menu)
        // this.$store.dispatch("getAccPriceInfo") //获取消息数据
    },
    mounted () {
        if (this.accountInfo.accountType === 'demo') {
            this.$store.dispatch('getMsgTotal')
        }
        this.$options.sockets.onmessage = this.wsMessage
        this.userLoginInfo.account_id && this.getPendings()
        this.updateHeight = debounce(this.updateWindowHeight, 400)
        if (this.isActivityUser) {
            this.updateActivity = debounce(this.$refs['activity'].getPendingBounsList, 1000)
        }
        this.updateHeight()
        setTimeout(this.toggleCollapsed, 500)
        //     this.toggleCollapsed()
        window.onresize = () => {
            return ((that) => {
                that.updateWindowHeight()
            })(this)
        }
        // window.addEventListener('message', (ev) => {
        //      const data = ev.data || {}
        //     if(data.type==="resetDemoAccount"){
        //         this.updateDemoAccount()
        //     }
        // })
        CustomEvent.on('resetDemoAccount', (data) => {
            console.log(data.detail) // { name: 'GitHub' }
            this.updateDemoAccount()
        })
    },
    activated () {
        this.userLoginInfo.account_id && this.getPendings()
    },
    methods: {
        updateDemoAccount (ev, pageName) {
            // window.top.postMessage({ type: 'toPage', data: urlPath }, '*')
            // const data = ev.data || {}
            this.getPendings(true)
        },
        showData (type) {
            this.$dialog.alert({
                title: this.$t('activity.description'),
                message: this.$t('activity.descriptionTip', { amount: this.accInfo.maxAmount }),
                confirmButtonText: this.$t('activity.determine'),
            })
        },
        reSubscription () {
            const ids = this.selfSymbolList.map(item => item.symbolId)
            this.$ws.send_addSubscription_proList(ids)
        },
        raiseIndex () {
            this.rzIndex = 2020
        },
        reduceIndex () {
            this.rzIndex = 1004
        },
        visibilitySearch (flag) {
            this.showSearch = flag
        },
        updateWindowHeight () {
            // debugger
            const SH = window.innerHeight
            this.screenHeight = SH
            const LH = localGet('positionH') || 190
            this.pane.maxHeight = (SH - 310) + 'px'
            this.pane.height = (SH - parseInt(LH) - 120) + 'px'
            // this.$refs['position'].setAttribute('style', `height: ${LH}px;`)
            //  console.log(SH,this.pane.height,LH)
            this.$refs['table'].setAttribute('style', `height: ${LH - 40}px;`)
            //  this.resetPanleH()
        },
        toggleCollapsed () {
            //  debugger
            if (!this.collapsed) {
                this.$refs['position'].setAttribute('style', 'height: 40px;')
                // 165 = 头部60+底部60+拖动5+持仓头部40
                const MH = (this.screenHeight - 165) + 'px'
                this.pane.maxHeight = MH
                this.pane.height = MH
            } else {
                this.$refs['position'].setAttribute('style', 'height: auto;')
                this.updateWindowHeight()
            }
            this.collapsed = !this.collapsed
        },
        resized (pane, container, size) {
            //  console.log('size',size)
            let PH = (this.screenHeight - parseInt(size) - 120)
            if (PH < 190) { PH = 190 }
            this.$refs['position'].setAttribute('style', `height: ${PH}px;`)
            this.$refs['table'].setAttribute('style', `height: ${PH - 40}px;`)
            localSet('positionH', PH)

            this.$refs['TVChart'].resized()
        },
        resetPanleH () {
            const LH = localGet('positionH') || 190
            this.$refs['chart-area'].setAttribute('style', `height: ${this.screenHeight - LH - 140}px;`)
            this.$refs['position'].setAttribute('style', `height: ${LH}px;`)
            this.$refs['table'].setAttribute('style', `height: ${LH - 40}px;`)
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code } = JSON.parse(evt.data)
            // console.log(msg_code.toLowerCase())
            if (msg_code.toLowerCase() === 'OrderUpdateRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'OrderCancelRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'OrderAddRet'.toLowerCase() ||
                // msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase() ||
                // msg_code.toLowerCase() === 'positionlistret'.toLowerCase() ||
                msg_code.toLowerCase() === 'PositionAddRet'.toLowerCase()) {
                // 收到订单变化
                console.log('Home收到订单变化')
                this.getPendings()
            }
        },
        getPendings (flag) {
            if (flag) {
                this.reSubscription()
                if (this.subTabActive === 1) {
                    this.$refs['pending'].getPendings()
                }
            }
            this.$mSocket.send('pendings', {
                account_id: this.userLoginInfo.account_id,
                count: 200
            })
                .then(res => {
                    if (res.errorType) {
                        this.$toast({
                            duration: 1000,
                            message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark
                        })
                        this.loading = false
                        return
                    }

                    const baseDataList = res.data_list || []
                    const _arr = []
                    const code_arr = []
                    baseDataList.forEach(item => {
                        if (item.status === 1) {
                            const _baseInfo = this.productMap[item.symbol] || { groupSymbol: {} }
                            item.request_volume = item.request_volume / _baseInfo.groupSymbol.contract_size
                            if (code_arr.indexOf(_baseInfo.code_id) < 0) {
                                code_arr.push(_baseInfo.code_id)
                            }
                            if (_baseInfo.groupSymbol && _baseInfo.groupSymbol.digits && item.request_price) {
                                item.request_price = parseFloat(item.request_price).toFixed(_baseInfo.groupSymbol.digits)
                            }
                            _arr.push(Object.assign({
                                volumes_max: _baseInfo.groupSymbol.volumes_max,
                                volumes_min: _baseInfo.groupSymbol.volumes_min,
                                volumes_step: _baseInfo.groupSymbol.volumes_step,
                                productData: _baseInfo
                            }, item, _baseInfo))
                        }
                    })
                    this.pendingDataList = _arr
                    console.log('pendingDataList', this.pendingDataList)
                    this.$ws.send_addSubscription_proList(code_arr)
                })
                .catch(() => {
                    console.log('timeOut')
                })
        },
        changeAccountType (type) {
            const accountType = type === 'real' ? 'demo' : 'real'
            const loginData = getLoginData()
            if (loginData) {
                loginData.accountType = accountType
            }
            localSet('loginData', JSON.stringify(loginData))
            this.$toast.loading({
                mask: true,
                duration: 0,
                message: this.$t('accountSwitch')
            })
            location.reload()
            // this.$ws.send_switchAccount(()=>{
            //     this.getPendings (true)
            // })
        },
        toggleCollected () {
            this.collected = !this.collected
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs['TVChart'].resized()
                }, 500)
            })
        },
        toggleActivity (val) {
            this.showBonus = val
        },
        showMyAsset () {
            this.showAsset = true
        },
        hideMyAsset () {
            this.showAsset = false
        },
        showMyActivity () {
            this.updateActivity && this.updateActivity()
            this.showActivity = true
        },
        hideMyActivity () {
            // debugger
            this.showActivity = false
        },
        toggleMyAsset (val) {
            this.showAsset = val
        },
        tabClick (index) {
            this.$router.replace({ query: { tab: index } })
            this.subTabActive = index
        },
        changeTabActive (index) {
            this.subTabActive = index
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
        toOrder (direction) {
            const product = this.product
            const id = product.code_id
            const groupSymbol = product.groupSymbol
            const loginData = getLoginData()
            if (!loginData) return this.$router.push({ name: 'Order', params: { id }, query: { direction } })
            if (!groupSymbol || !groupSymbol.name) { //  || groupSymbol.tradable !== 1 暂时去掉tradable判断，ix系统没有
                return this.$alert(this.$t('loginTip.productClose'))
            } else if (!groupSymbol.volumes_step) {
                return this.$toast(this.$t('compLang.loading'))
            } else if (groupSymbol.enable !== 1) {
                return this.$alert(this.$t('productStatus.' + groupSymbol.enable) + this.$t('productStatus.linkService'))
            }
            this._collect(direction === 'sell' ? '卖出' : '买入')
            this.$router.push({ name: 'Order', params: { id }, query: { direction } })
        },
        toPage (item, index) {
            if (!item.url.trim()) {
                return
            }
            this.linkActiveIndex = index
            if (item.urlType === '1') {
                if (item.url.indexOf('http') == 0) {
                    if (item.url.indexOf('chat_type=')) {
                        window.open(item.url, '_blank')
                        return
                    }
                    // 外部地址
                    const url = `${item.url}${item.url.indexOf('?') > 0 ? '&' : '?'}reffer=${encodeURIComponent(window.navigator.userAgent)}&lastPage=H5APP`
                    if (url.indexOf('hidehead=1') >= 0) {
                        this.jumpPage({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: url, title: item.title, hidehead: 1 } })
                    } else {
                        this.jumpPage({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: url, title: item.title } })
                    }
                } else {
                    // 内部地址
                    if (item.url.indexOf('/SettingTradeColor') === 0) {
                        // 设置涨跌颜色
                        this.orColorSetting.show = true
                    } else {
                        this.jumpPage({ path: item.url })
                    }
                }
            } else if (item.urlType === '2') {
                if (item.url.indexOf('/user/userSelfInfo') >= 0) {
                    this.jumpPage({ name: 'Certified' })
                }
            }
        },
        jumpPage (route) {
            if (route.path == this.$route.path || route.name == this.$route.name) {
                this.$router.go(-1)
            } else {
                if (this.$route.name == 'Layout') {
                    this.$router.push(route)
                } else {
                    this.$router.replace(route)
                }
            }
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
        // 跳转到合约属性
        toContractInfo () {
            if (!this.$store.state.ix_user.userLoginInfo.account_id) return this.$router.push({ name: 'Login' })
            if (!this.profitToUSD.buy_price) this.$ws.send_addSubscription_proList([this.productId, this.profitToUSD.code_id])
            this.$router.push({ name: 'ContractInfo', params: { id: this.product.code_id } })
        },
        resetDemoAccount () {
            const loading = this.$toast.loading({
                message: this.$t('activity.reseting'),
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0
            })
            resetAccount()
                .then(res => {
                    loading.clear()
                    if (res.code !== '0') {
                        this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                    }
                    CustomEvent.dispatch('resetDemoAccount', { name: 'home' })
                    //  this.updateDemoAccount()
                })
                .catch(error => {
                    loading.clear()
                    console.log(error)
                })
        }
    }

}
</script>

<style lang="scss">
@import "~@m/views/trade/position/style.scss";
</style>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.homeWrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .left {
        width: 280px;
        height: 100%;
        overflow: auto;
        background-color: #e2e2e2;
        @include scroll();
    }
    .mainContainter {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    ::v-deep {
        .van-icon {
            &.van-icon-arrow-down {
                font-size: 16px;
                color: #707080;
            }
        }
    }
}
.chart-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #fff;
    width: 100% !important;
}
.position-area {
    background-color: #fff;
    flex:1;
    &.collapsed {
        .collapse-content {
            height: 0;
            overflow: hidden;
            transition: all 1s ease-in-out;
        }
        .collapse-header {
            div {
                transform: rotate(0deg);
            }
        }
    }
}
.accordion {
    box-shadow: 0px -1px 0px 0px #ecedf2;
    height: 100%;
    display: flex;
    flex-direction: column;
    .collapse-header {
        display: flex;
        align-items: center;
        flex: 0 0 40px;
        ul {
            flex: 1;
            li {
                display: inline-block;
                height: 40px;
                line-height: 40px;
                margin: 0;
                position: relative;
                font-weight: bold;
                font-size: 14px;
                padding: 0 10px;
                cursor: pointer;
                &.active {
                    color: #477fd2;
                }
            }
        }
        & > div {
            padding: 0 20px;
            transition: all 0.3s ease-in-out;
            transform: rotate(180deg);
            i {
                cursor: pointer;
            }
        }
    }
    .collapse-content {
        flex: 1;
        overflow: auto;
        @include scroll();
        ::v-deep {
            .m-ccgd,
            .table-scroll {
                height: 100%;
                padding: 0;
                background-color: #fff;
            }
        }
    }
}

.productInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 18px;
    height: 110px;
    .info-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .info-bottom {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 10px;
    }
    .name {
        padding-top: 10px;
        .name_cn {
            font-size: 20px;
        }
        .name_en {
            color: $muted;
        }
    }
    .increase {
        flex: 0 0 120px;
        .cur_price {
            font-size: 18px;
        }
        .others {
            white-space: nowrap;
            .upDownAmount {
                margin-left: 15px;
            }
        }
    }

    .trade-btn-wrap {
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        .trade-btn {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 2.34667rem;
            height: 1.12rem;
            border-radius: 0.08rem;
            color: #fff;
            margin: 0 5px;
            box-sizing: border-box;
            padding: 6px 10px;
            background: #858c9a;
            cursor: pointer;
            .label {
                font-size: 12px;
            }
            .price {
                font-size: 14px;
            }
            &.sell {
                align-items: flex-start;
            }
            &.buy {
                align-items: flex-end;
            }
        }
        .spread_text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 3px;
            font-size: 12px;
            color: #666;
            padding: 0 5px;
            height: 16px;
            line-height: 16px;
            border-radius: 2px;
        }
    }

    .operation {
        text-align: right;
    }
    .name_cn {
        color: #3f3f3f;
        font-weight: bold;
    }
    .grayColor {
        color: #646566;
    }

    .price-item {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        white-space: nowrap;
        i {
            font-size: 24px;
            margin: 0 10px;
            cursor: pointer;
        }
        .priceBottom {
            display: flex;
            flex-direction: column;
            margin: 0 20px;
            font-size: 13px;
            > span {
                &:first-child {
                    text-align: left;
                    margin-bottom: 5px;
                    color:#999;
                }
            }
        }
        .point-value{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            .point-i{
                font-size: 12px;
                margin: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .van-icon{
                font-size: 18px;
                margin: 0 10px;
                cursor: pointer;
            }
        }
    }
}
.tv-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    width: 100%;
}
.vertical-panes {
    width: 100%;
    height: 100%;
    border: 1px solid #d5d8e0;
    .stuff {
        position: absolute;
        display: inline-block;
        width: 10px;
        height: 32px;
        line-height: 32px;
        background: #ecedf1;
        right: 0;
        top: 50%;
        z-index: 100;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        margin-top: -5px;
        i {
            color: #6f6f7f;
        }
        &:hover {
            i {
                color: #fff;
            }
            background-color: #5b95eb;
        }
    }
    & > .pane {
        text-align: left;
        // padding: 15px;
        overflow: hidden;
        background: #ecedf1;
        transition: all 0.5s ease-in-out;
        &.center-pane{
            flex:1;
        }
        &:first-child {
            border-right: 5px solid #dddee3;
        }
        &:last-child {
            border-left: 1px solid #dddee3;
        }
        &.pucker {
            width: 0 !important;
            max-width: initial !important;
            min-width: initial !important;
            position: relative;
            z-index: 10;
            overflow: initial;
            ::v-deep {
                .emit-search {
                    display: none;
                }
            }
            .stuff {
                background-color: #477fd3;
                transform: rotate(180deg);
                right: -15px;
                i {
                    color: #fff;
                }
                &:hover {
                    background-color: #2d6cc9;
                }
            }
        }
        &.fixed-menu-bar {
            z-index: 104;
        }
        .icon_icon_back {
            font-size: 12px;
        }
        &.symbol-area {
            width:340px;
            background-color: #fff;
        }
    }
}
.fixed-menu-bar {
    overflow: visible !important;
    width: 60px;
    ul {
        li {
            text-align: center;
            cursor: pointer;
            height: 60px;
            line-height: 60px;
            position: relative;
            em{
                position: absolute;
                display: inline-block;
                background-color: #e3525c;
                z-index: 1;
                font-style: normal;
                color: #fff;
                border-radius: 32%;
                line-height: 16px;
                padding: 0 6px;
                right: 4px;
                top: 35px;
                font-size: 12px;
            }
            span {
                &.s-img {
                    display: inline-block;
                    width: 40px;
                    height: 40px;

                    border-radius: 2px;
                    line-height: 40px;
                }
                &.tooltiptext {
                    position: absolute;
                    background-color: #6f6f7f;
                    color: #fff;
                    text-align: center;
                    border-radius: 2px;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.6s;
                    top: 15px;
                    bottom: auto;
                    right: 54px;
                    white-space: nowrap;
                    display: none;
                    line-height: 30px;
                    padding: 0 10px;
                    &::after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: 100%;
                        margin-top: -5px;
                        border-width: 5px;
                        border-style: solid;
                        border-color: transparent transparent transparent
                            #6f6f7f;
                    }
                }
            }
            &:hover,
            &.active {
                span {
                    &.s-img {
                        background: #d4d6d8;
                    }
                }
            }
            &:hover {
                span {
                    &.tooltiptext {
                        opacity: 1;
                        display: inline-block;
                    }
                }
            }
            img {
                width: 24px;
                height: 24px;
                vertical-align: middle;
            }
        }
    }
}
.footer-bar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;

    background: #ecedf1;
    box-shadow: 0px 1px 0px 0px #d5d8e0;

    .update-time {
        padding-left: 15px;
        flex: 1;
    }
    .fund-content {

    }
    .fund-content,
    .activity-content {
        position: relative;

        height: 100%;
        &:hover {
            .show-operate {
                transition: all 0.5s ease-in-out;
                transform: rotate(180deg);
            }
        }
        ul {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-left: 5px;
            margin-top: 10px;
            li {
                text-align: left;
                cursor: pointer;
                margin: 0 12px;
                line-height: 20px;
                position: relative;
                &.nav {
                    width: 55px;
                    & > div {
                        position: relative;
                    }
                }
                &.active {
                    position: relative;
                    &::before {
                        content: "";
                        display: inline-block;
                        width: 50px;
                        height: 55px;
                        background-color: #fff;
                        position: absolute;
                        top: -9px;
                        left: 0;
                    }
                }
                .label {
                    font-size: 12px;
                    color: #787b86;
                }
                .value {
                    font-size: 14px;
                    color: #3f3f3f;
                            &.adequate {
            color: #11b873;
        }
        &.less {
            color: #f39800;
        }
        &.stopout {
            color: #e3525c;
        }
                }
                a {
                    color: #777b85;
                }
                i {
                    font-size: 12px;
                }
            }
        }
    }
    .cash-in {
        padding:0 30px;
        text-align: center;
        border-left: 1px solid #d5d8e0;
        &.hidden {
            display: none;
        }
        a {
            width: 92px;
            height: 30px;
            display: inline-block;
            line-height: 30px;
            text-align: center;
            background: #477fd2;
            border-radius: 2px;
            font-size: 12px;
            color: #fff;
             margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                background-color: #2d6cc9;
            }
        }
    }
}
::v-deep {
    .van-popup--bottom {
        width: 300px;
        height: 460px;
        left: 50%;
        margin-left: -140px;
        bottom: 60px;
    }
    .van-button--mini {
        border-width: 0;
        min-width: initial;
        background-color: transparent;
    }
}
.collectIcon {
    display: inline-block;
    height: 100%;
    width: rem(40px);
    vertical-align: top;
    color: #777;
    margin: 0 25px;
    .icon_zixuan1,
    .icon_zixuan2 {
        display: block;
        width: 100%;
        height: 100%;
    }
    .icon_zixuan1 {
        vertical-align: top;
        font-weight: normal !important;
    }
    .icon_zixuan2 {
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
            left: 0;
            animation: loading 0.6s linear infinite;
        }
    }
    .zoomIn {
        position: relative;
        &::before {
            position: absolute;
            left: 0;
            animation: zoomIn 0.6s linear forwards;
        }
    }
}
.icon_guanyu {
    color: rgb(153, 153, 153);
}
</style>
