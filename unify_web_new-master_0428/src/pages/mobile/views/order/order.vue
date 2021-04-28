<template>
    <!-- 下单页面 -->
    <div ref='orderPage' class='orderPage' :class='{ pc:isPC }'>
        <Top>
            <span slot='left' class='userType'>
                <template v-if='isExperience'>
                    {{ $t('trade.experi') }}
                </template>
                <template v-else-if="userType==='real'">
                    {{ $t('trade.real') }}
                </template>
                <template v-else-if="userType==='demo'">
                    {{ $t('trade.demo') }}
                </template>
            </span>
            <div v-if='product' class='productTopInfo'>
                <p class='productName'>
                    {{ product.simplified }}
                </p>
                <p class='short_name'>
                    {{ product.short_name }}
                </p>
            </div>
            <a slot='right' href='javascript:;' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
        </Top>
        <div class='main'>
            <!-- <component :is="'ad'" v-for="ad in ad.top" :data="ad" :key="ad.id"></component> -->
            <div v-if='product' class='directions cellMarginTop'>
                <div class='item sell' :class="{ 'mainColorBg':direction==='sell' }" @click="direction='sell'">
                    {{ $t('trade.sell') }}
                    <span class='flRight price'>
                        {{ product.sell_price }}
                    </span>
                </div>
                <div class='item buy' :class="{ 'mainColorBg':direction==='buy' }" @click="direction='buy'">
                    <span class='price'>
                        {{ product.buy_price }}
                    </span>
                    <span class='flRight'>
                        {{ $t('trade.buy') }}
                    </span>
                </div>
                <span v-if='product.spread_text' class='spread_text'>
                    {{ product.spread_text }}
                </span>
            </div>

            <!-- 订单类型 -->
            <CellType v-model='orderType' :btn-list='orderTypeList' class='cellMarginTop' :title="$t('trade.orderType')" />

            <LimitPrice
                v-if='product && orderType===2'
                ref='limitPrice'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
                @priceChange='pendingOrderPrice=$event'
            />

            <OrderVolume
                v-if='product'
                v-model='lot'
                class='cellMarginTop'
                :fee-account-currency='feeAccountCurrency'
                :open-margin='openMargin'
                :product='product'
            />
            <!-- <van-row type="flex" justify="space-between" v-if="usdcny">
                <van-col>USDCNY {{usdcny.code_id}}</van-col>
                <van-col>
                    {{usdcny.buy_price}} --
                    {{usdcny.sell_price}}
                </van-col>
            </van-row>
            <van-row type="flex" justify="space-between" v-if="profitToUSD">
                <van-col>{{profitToUSD.short_name}} {{profitToUSD.code_id}}</van-col>
                <van-col>
                    {{profitToUSD.buy_price}} --
                    {{profitToUSD.sell_price}}
                </van-col>
            </van-row>
            <van-row type="flex" justify="space-between" v-if="relativeProduct">
                <van-col>{{relativeProduct.short_name}} {{relativeProduct.code_id}}</van-col>
                <van-col>
                    {{relativeProduct.buy_price}} --
                    {{relativeProduct.sell_price}}
                </van-col>
            </van-row>-->

            <OrderCapital
                v-if='product'
                class='cellMarginTop'
                :direction='direction'
                :fee-account-currency='feeAccountCurrency'
                :fee-profit='feeProfit'
                :open-margin='openMargin'
                :product='product'
                :profit-to-u-s-d='profitToUSD'
                :v-prophet-value="() => orderType === 1
                    ? ['trackEvent', '交易', '市价下单', '市价_入金', 57]
                    : ['trackEvent', '交易', '挂单', '挂单_入金', 62]
                "
                :volume='lot'
                @popupExplain='setPopupExplainType'
            />

            <ProfitlossSet
                v-if='product && origin!=="miniTrade"'
                ref='profitloss'
                class='orderProfitloss'
                :direction='direction'
                :pending-order-price="orderType===2?pendingOrderPrice:''"
                :product='product'
                :v-prophet-value="() => orderType === 1
                    ? ['trackEvent', '交易', '市价下单', '市价_止损止盈', 58]
                    : ['trackEvent', '交易', '挂单', '挂单_止损止盈', 63]
                "
                :volume='lot'
            />
            <CellType
                v-if='orderType===2'
                v-model='pendingExpireType'
                :btn-list='expireTimeList'
                class='typeMarginTop'
                :title="$t('trade.expireTime')"
                :v-prophet-value="() => pendingExpireType === 1
                    ? ['trackEvent', '交易', '挂单', '挂单_当日', 64]
                    : ['trackEvent', '交易', '挂单', '挂单_当周', 65]
                "
            />
            <!-- <component :is="'ad'" v-for="ad in ad.bottom" :data="ad" :key="ad.id"></component> -->
        </div>

        <div class='submitBox'>
            <van-button
                v-prophet="() => orderType === 1
                    ? ['trackEvent', '交易', '市价下单', '市价_提交买入', 59]
                    : ['trackEvent', '交易', '挂单', '挂单_提交买入', 66]
                "
                block
                class='submitBtn'
                :color='style.mainColor'
                type='primary'
                @click='openOrderHandle'
            >
                {{ $t('submit') }}{{ language=='en-US'?' ':'' }}{{ direction=='buy'?$t('trade.buy'):$t('trade.sell') }}
            </van-button>
            <van-button v-if="origin === 'miniTrade'" class='fullScreen' plain type='info' @click='fullToPath'>
                {{ $t('fullScreen') }}
            </van-button>
        </div>

        <!-- 下单手数说明 -->
        <van-popup v-model='popupExplainVisible' :class='{ pc:isPC,capital:isPC }' :position="isPC ? 'center':'bottom'" @close='popupExplainVisible=false'>
            <PopupVolumeExplain v-if='popupExplainType===1' class='popup-volume-explain' :product='product' :profit-to-u-s-d='profitToUSD' />
            <PopupOrderMargin v-else-if='popupExplainType===2' class='popup-order-margin' :product='product' />
            <button class='sureBtn mainColorBg' @click='popupExplainVisible=false'>
                {{ $t('compLang.OK') }}
            </button>
        </van-popup>
        <!--拼图验证-->
        <Verify
            ref='verify'
            :captcha-type="'blockPuzzle'"
            :explain="$t('verify.tips')"
            :img-size="{ width: '330px', height: '155px' }"
            :mode="'pop'"
            @success='verifySuccess'
        />

        <!-- 全屏进入体验场 -->
        <ActivityProcess v-if='activityProcessVisible' />
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { msg_id, localSet, localGet, getLoginData, encryptLoginData, queryToJson } from '@/utils/index'
import { getDecimalNum, divide, toFixed } from '@/utils/calculation'
import Top from '@m/layout/top'
import ProfitlossSet from '@m/modules/profitLossSet/profitLossSet'
import LimitPrice from '@m/modules/limitPrice/limitPrice'
import SetRange from '@m/modules/setRange'
import CellType from '@m/components/cellType'
import OrderVolume from '@m/modules/order/orderVolume'
import OrderCapital from '@m/modules/order/orderCapital'
import PopupVolumeExplain from '@m/modules/order/popupVolumeExplain'
import PopupOrderMargin from '@m/modules/order/popupOrderMargin'
import { calcOpenMargin, USDToFee, feeToUSD } from '@/store/ix_utils'
import pcMixin from '@m/mixins/pc'
import Verify from '@m/components/verifition/Verify'
import { verifySuccessCallback } from '@/api/user/funds'
import ActivityProcess from '@m/components/activityProcess'
export default {
    name: 'Order',
    mixins: [pcMixin],
    // 获取到层级保证金才进入
    beforeRouteEnter (to, from, next) {
        const id = to.params.id
        const product = vm.$store.state.ix_quote.product_map[id]
        if (product && product.groupSymbol.volumes_step) {
            next(true)
        } else {
            vm.$store.dispatch('ix_quote/getProductInfo', id).then(res => {
                next(true)
            })
        }
    },
    data () {
        return {
            active: 0,
            range: 100,
            rangeMax: 100,
            lot: 0.1, // ,默认0.1手
            pendingOrderPrice: '', // 挂单价格
            orderType: 1, // 订单类型
            popupExplainVisible: false, // 说明弹窗
            popupExplainType: 1,
            direction: this.$route.query.direction,
            pendingExpireType: 1,
            orderTypeList: [{
                title: this.$t('trade.marketPrice'),
                val: 1
            }],
            activityProcessVisible: false,
        }
    },
    created () {
        const loginData = getLoginData()
        if (!loginData || !loginData.accountNo) return this.$router.replace({ name: 'Login', query: { cb: encodeURIComponent(this.$route.fullPath) } })
        this.init()
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        const addSubscriptions = [this.productId, this.profitToUSD.code_id]
        if (this.relativeProduct && this.relativeProduct.code_id) {
            addSubscriptions.push(this.relativeProduct.code_id)
        }
        this.$ws.send_addSubscription_proList(addSubscriptions)
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
    },
    computed: {
        ...mapState({ 'product_activatedId': state => state.ix_quote.product_activatedId }),
        ...mapState({
            userLoginInfo: state => state.ix_user.userLoginInfo,
            product_map: state => state.ix_quote.product_map,
            product_list: state => state.ix_quote.product_list,
            product_toUSD: state => state.ix_quote.product_toUSD,
            baseSymbol: state => state.ix_quote.baseSymbol,
            groupGet: state => state.ix_user.groupGet,
            origin: state => state.origin,
            postionList: state => state.ix_user.postionList
        }),
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        ...mapGetters(['style', 'usdhkd', 'usdcny', 'usdcnyRate', 'accountCurrency']),
        ...mapGetters({
            'product_activated': 'ix_quote/product_activated',
            'assetAboutInfo': 'assetAboutInfo',
            'isExperience': 'isExperience',
            'userType': 'userType',
        }),
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
        groupSymbol () {
            return this.product ? this.product.groupSymbol : ''
        },
        // 手数不是步长的整数倍
        volumeInvalid () {
            const m = divide(this.lot, this.groupSymbol.volumes_step)
            return getDecimalNum(m) > 0
        },
        // 该产品基础货币兑美元的币种, YZ平台需要
        relativeProduct () {
            const symbol = this.groupSymbol
            if (!symbol || !symbol.id) return {}
            const base_currency = symbol.base_currency
            return this.product_toUSD[base_currency + 'USD']
        },
        // YZ平台保证金汇率 (基础货币如果不是USD,则为基础货币兑换美元买入方向报价)
        YZ_rate () {
            const symbol = this.groupSymbol
            if (!symbol || !symbol.id) {
                return 1
            } else if (symbol.base_currency === 'USD') {
                return 1
            } else if (symbol.profit_currency === 'USD') {
                return this.product.buy_price * 1
            } else {
                const targetPro = this.relativeProduct
                return (targetPro && targetPro.buy_price) || 1
            }
        },
        // 该产品盈利货币兑美元的币种
        profitToUSD () {
            const symbol = this.groupSymbol
            if (symbol.profit_currency === 'USD') return this.product
            return this.product_toUSD[symbol.profit_currency + 'USD']
        },
        openMargin () {
            return this.openMarginFn(this.lot)
        },
        // 手续费 盈利货币币种
        feeProfit () {
            const { commission, commission_type, contract_size } = this.groupSymbol
            if (!commission || commission_type === undefined) return 0
            if (commission_type) { // 1 交易数量类型
                let fee = this.lot * commission
                if (this.groupGet.currency === 'CNY') {
                    const sell_price = this.usdcny?.sell_price ?? 1
                    const buy_price = this.usdcny?.buy_price ?? 1
                    const rate = fee > 0 ? buy_price : sell_price
                    fee = fee / rate // 算出 USD 币种
                }
                if (this.groupSymbol.profit_currency !== 'USD') fee = USDToFee(fee, this.profitToUSD) // 算出盈利货币币种
                return fee
            } else { // 0 合约价值类型
                const price = this.direction === 'buy' ? this.product.buy_price : this.product.sell_price
                const fee = price * this.lot * contract_size * commission / 1000000
                return fee
            }
        },
        // 手续费 账户币种
        feeAccountCurrency () {
            const { commission, commission_type, profit_currency } = this.groupSymbol
            if (!commission || commission_type === undefined) return 0
            if (commission_type) { // 1 交易数量类型
                return this.lot * commission
            } else { // 0 合约价值类型
                let fee = profit_currency === 'USD' ? this.feeProfit : feeToUSD(this.feeProfit, this.profitToUSD) // 手续费 USD币种
                if (this.groupGet.currency === 'CNY') fee = USDToFee(fee, this.usdcny)
                return toFixed(fee, 2)
            }
        },
        // 挂单有效期
        expireTimeList () {
            const market_id = this.product?.market_id
            return market_id === 13 ? [{
                title: this.$t('trade.expireType1'),
                val: 1
            }] : [{
                title: this.$t('trade.expireType2'),
                val: 2
            }, {
                title: this.$t('trade.expireType1'),
                val: 1
            }]
        }
    },
    methods: {
        ...mapMutations({
            update_product_activated_id: 'ix_quote/UPDATE_PRODUCT_ACTIVATED_ID',
            positionAdd: 'ix_position/ADD',
        }),
        init () {
            // 正常模式显示挂单功能
            if (this.origin !== 'miniTrade') {
                this.orderTypeList.push({
                    title: this.$t('trade.pending'),
                    val: 2
                })
            }

            const groupSymbol = this.groupSymbol
            if (this.product_activatedId !== this.productId) {
                this.update_product_activated_id(this.productId)
            }
            if (groupSymbol.enable !== 1) { //  || groupSymbol.tradable !== 1 暂时去掉tradable判断，ix系统没有
                this.$alert(this.$t('loginTip.productClose'))
            }
            this.lot = groupSymbol.volumes_min
            this.range = groupSymbol.range_initial
            this.rangeMax = groupSymbol.range_initial
            const pendingExpireType = localGet('pendingExpireType')
            if (pendingExpireType && this.product?.market_id !== 13) this.pendingExpireType = Number(pendingExpireType)
        },
        // 切换按金额按手数
        orderTypeClick (name, title) {
            // console.log(name,title);
            this._collect(title)
        },
        // 点击下单按钮
        openOrderHandle () {
            // debugger
            const groupSymbol = this.product.groupSymbol
            const enable = groupSymbol.enable
            if (!groupSymbol || !groupSymbol.name) { //  || groupSymbol.tradable !== 1 暂时去掉tradable判断，ix系统没有
                this.$alert(this.$t('loginTip.productClose'))
                return false
            } else if (enable !== 1) {
                this.$alert(this.$t('productStatus.' + enable) + this.$t('productStatus.linkService'))
                return false
            } else if (this.lot == '') {
                this.$toast(this.$t('trade.buyNumEmpty'))
                return false
            } else if (groupSymbol.volumes_min > this.lot) {
                this.$toast(this.$t('trade.buyNumMin') + groupSymbol.volumes_min + this.$t('trade.volumeUnit'))
                return false
            } else if (groupSymbol.volumes_max < this.lot) {
                this.$toast(this.$t('trade.buyNumMax') + groupSymbol.volumes_max + this.$t('trade.volumeUnit'))
                return false
            } else if (this.volumeInvalid) {
                return
            }
            this.openOrder()
        },
        // 发送下单命令
        openOrder () {
            const direction = this.direction
            const userLoginInfo = this.userLoginInfo
            const product_activated = this.product_activated
            const groupSymbol = this.groupSymbol
            const $refs = this.$refs
            if (!userLoginInfo) return this.$toast(this.$t('loginTip.getUserInfoError'))
            const profitlossParams = $refs.profitloss ? $refs.profitloss.submit() : {}
            const limitPriceParams = $refs.limitPrice ? $refs.limitPrice.submit() : {}
            // return console.log('limitPriceParams', limitPriceParams)
            if (profitlossParams === false || limitPriceParams === false) return
            const request_price = direction === 'buy' ? product_activated.buy_price : product_activated.sell_price
            if (!request_price) return this.$toast(this.$t('trade.productEmpty'))
            const params = {
                'msg_id': msg_id(),
                'code_id': product_activated.code_id,
                'account_id': userLoginInfo.account_id,
                'group_id': userLoginInfo.group_id,
                'direction': direction === 'buy' ? 1 : 2, // 交易方向买:1卖:2
                'type': 1, // 订单类型市价建仓（1）、限价建仓（2）、停损建仓（4）、市价平仓（8）
                'status': 1, // 订单状态PLACED（1,等待）、FILLED（2,已执行）、PARTIAL_FILLED(3,不支持)、CANCELED（4,已取消）、REJECTED（5,已拒绝）、DELETED（6,已删除）
                'client_type': 4, // 客户端类型WEBUI:4除）
                'symbol': groupSymbol.name, // 产品编码
                'contract_size': groupSymbol.contract_size, // 产品合约大小
                'request_volume': this.lot * 1,
                'request_price': request_price * 1,
                'use_pips': false, // 是否使用止盈止损點數
                'range': parseFloat(this.range), // 根据已有数据分析，市价最大偏移默认100，不再做为用户主动设置条件
                'expire_type': this.pendingExpireType, // 过期类型1.当日有效2.当周有效3.指定时间
            }
            Object.assign(params, profitlossParams, limitPriceParams)
            if (this.assetAboutInfo.accountData.kybzj < this.openMargin) {
                return this.depositDialog()
            }
            if (this.loading) return false
            this.loading = this.$loading({ mask: true, duration: 0 })
            this.wsOpenOrder(params)
        },
        // 开仓
        wsOpenOrder (params) {
            const groupSymbol = this.groupSymbol
            const margin = this.openMargin
            const backArr = params.type === 1 ? [] : ['OrderAddRet']
            let timeOut = groupSymbol.order_timeout
            timeOut = Math.max(60, timeOut)

            this.$store.dispatch('sendUserRiskInfo', {
                type: 4
            }) // 调用指纹采集接口

            this.$mSocket.send('openOrder', params, backArr, timeOut).then(res => {
                this.loading.clear()
                this.loading = null
                if (res.errorType && res.errorType === 'OpenOrderCaptchaRet') {
                    this.useVerify()
                    return
                }
                if (res.errorType && res.errorData.ret === 39) {
                    this.depositDialog()
                    return
                } else if (res.errorType) {
                    const errorData = res.errorData || {}
                    const ret = errorData.ret
                    if (res.remark == 'TimeOut') res.remark = this.$t('timeOut')
                    let msg = this.$te('retMsg.' + ret) ? this.$t('retMsg.' + ret) : res.remark
                    const msgIdText = errorData.msg_id ? '\n msg_id：' + errorData.msg_id : ''
                    if (['localhost', '192.168.35.218'].includes(location.hostname)) msg += msgIdText // uat 增加显示msg_id 方便后端查日志
                    this.$alert(msg)
                    return
                }
                this.$store.commit('UPDATE_disabledSuccAnimtion', false)
                sessionStorage.setItem('orderSuccess' + res.OrderAddRet.id, JSON.stringify(res))
                localSet('pendingExpireType', this.pendingExpireType)
                const query = { margin }
                if (this.$route.query.fullEnteredDialog) query.fullEnteredDialog = this.$route.query.fullEnteredDialog
                this.$router.push({ name: 'OrderSuccess', params: { id: res.OrderAddRet.id }, query })
            }).catch(err => {
                console.warn(err)
                this.loading.clear()
                this.loading = null
                if (err && err.errorType === 'TimeOut') {
                    this.openOrderTimeout()
                } else if (err.remark === 'TimeOut') {
                    this.$alert(this.$t('timeOut'))
                } else {
                    this.$alert(err.toString())
                }
            })
        },
        // 提示充值
        depositDialog () {
            if (this.accountCurrency === 'IXD') {
                this.$dialog.alert({
                    title: this.$t('trade.placeOrderFail'),
                    message: this.$t('retMsg.39'),
                    confirmButtonText: this.$t('compLang.close'),
                })
                return false
            }
            this.$dialog.confirm({
                title: this.$t('trade.placeOrderFail'),
                message: this.$t('retMsg.39'),
                confirmButtonText: this.$t('trade.toDeposit'),
                cancelButtonText: this.$t('compLang.close'),
            }).then(() => {
                this.$router.push({ name: 'DepositFunds' })
            }).catch(() => {
                console.log('close')
            })
        },
        // 开仓超时提示
        openOrderTimeout () {
            this.$dialog.alert({
                title: this.$t('trade.placeOrderFail'),
                messageAlign: 'left',
                message: this.$t('trade.closedFailTip')
            })
        },
        updateRange (val) {
            this.range = val
        },
        // 设置弹窗类型
        setPopupExplainType (type) {
            this.popupExplainType = type
            this.popupExplainVisible = true
        },
        // 计算保证金
        openMarginFn (volume) {
            const direction = this.direction === 'buy' ? 1 : 2
            return calcOpenMargin({
                product: this.product,
                groupGet: this.groupGet,
                positionList: this.postionList,
                relativeProduct: this.relativeProduct, // YZ平台使用
                YZ_rate: this.YZ_rate, // YZ平台使用
                groupSymbolMarginLeveMap: this.$store.getters['ix_quote/groupSymbolMarginLeveMap'] || {},
                volume: volume,
                direction: this.direction === 'buy' ? 1 : 2,
                usdcnyRate: this.usdcnyRate,
                usdhkdRate: this.usdhkd && this.usdhkd['cur_price'] ? this.usdhkd['cur_price'] : 1
            })
        },
        useVerify () {
            this.$refs.verify.show()
        },
        verifySuccess (params) {
            // todo: 成功后不需在此验证了，重新点击确定去开仓
            verifySuccessCallback({ data: params })
        },
        // 体验账户进入下单页面，点击返回到行情页面
        goBackHome () {
            if (this.$route.query.fullEnteredDialog) {
                return this.$router.push({ name: 'TradeIndex', query: { experience: 'true' }, params: { first: true } })
            }
            this.$router.back()
        },
        // 显示全屏过渡效果
        showActivityProcess () {
            return new Promise(resolve => {
                this.activityProcessVisible = true
                setTimeout(resolve, 2500)
            })
        },
        // 全屏打开持仓页面
        fullToPath () {
            const _queryObj = queryToJson() || {}
            delete _queryObj.pagewidth
            let _search = ''
            for (const key in _queryObj) {
                _search = key + '=' + _queryObj[key] + '&'
            }
            _search.substr(0, _search.length - 1)
            _search = '?' + _search
            const path = location.pathname + _search
            this.showActivityProcess().then(() => {
                window.top.location = `${location.protocol}//${location.host + path}&fullEnteredDialog=true&t=${encryptLoginData()}`
            })
        }
    },
    components: {
        Top,
        ProfitlossSet,
        LimitPrice,
        CellType,
        OrderVolume,
        OrderCapital,
        PopupVolumeExplain,
        PopupOrderMargin,
        SetRange,
        ActivityProcess,
        Verify,
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .short_name {
        margin-top: rem(8px);
        font-size: rem(20px);
        color: $muted;
    }
    .productName{
        @include single-line-clamp();
    }
}
.cellMarginTop {
    margin-top: rem(40px);
}
.typeMarginTop {
    margin-top: rem(10px);
    overflow: hidden;
}
.directions {
    position: relative;
    display: flex;
    .item {
        background: #f2f2f2;
        height: rem(70px);
        line-height: rem(50px);
        border-radius: rem(6px);
        padding: rem(10px) rem(20px);
        box-sizing: border-box;
        flex: 1;
        &.sell {
            margin-right: 5px;
            padding-right: rem(45px);
        }
        &.buy {
            margin-left: 5px;
            padding-left: rem(45px);
        }
        &.mainColorBg {
            color: #fff;
        }
    }
    .price {
        font-size: rem(30px);
    }
    .flRight {
        float: right;
    }
    .spread_text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 1px) scale(1);
        display: inline-block;
        border: 2px solid rgba(255, 255, 255, 0.5);
        background: #f2f2f2;
        height: rem(40px);
        line-height: rem(36px);
        padding: 0 rem(10px);
        text-align: center;
        min-width: rem(20px);
        border-radius: rem(6px);
        font-size: rem(20px);
    }
}
.rowBox {
    padding-top: rem(30px);
}
.sureBtn {
    display: block;
    width: 100%;
    height: rem(90px);
    line-height: 1;
    text-align: center;
    font-size: rem(28px);
    color: #fff;
    @include active();
    cursor: pointer;
}
.orderPage {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding-top: rem(90px);
    &.pc{
        padding-top: 0;
        ::v-deep{
            .van-icon-question-o{
                cursor: pointer;
            }
        }
        .capital{
            border-radius: 6px;
            overflow: hidden;
            padding-bottom: 70px;
            .sureBtn{
                position: absolute;
                width: 360px;
                left: 20px;
                bottom: 20px;
                right: 20px;
                display: inline-block;
                border-radius: 2px;
            }
        }
        .main{
            padding: 0 20px;
            overflow: auto;
            flex: 1;
            margin-bottom: 80px;
            @include scroll();
        }
        .submitBox {
            position: absolute;
            z-index: 10;
            left: 20px;
            bottom: 20px;
            right: 20px;
            width: auto;
        }
    }
    .userType{
        display: inline-block;
        padding: rem(8px) rem(20px) rem(6px);
        line-height: 1.4;
        border-radius: 4px;
        font-size: rem(20px);
        color: #fff;
        background: $primary;
    }
    i.icon_icon_close_big {
        font-size: rem(30px);
    }
    ::v-deep {
        .pc{
            &.van-popup--center{
                width:400px;
            }
            .topNav {
                margin-top: 12px;
            }
        }
        .right {
            padding: 0 20px;
        }
    }
    .main {
        padding: 0 rem(20px) rem(120px) rem(20px);
        overflow: auto;
        flex: 1;
    }

        .productInfo {
            padding: rem(28px) rem(30px);
            line-height: 1.5;
            background: #fff;
            position: relative;
            &::after {
                @include borderline();
                bottom: 0;
            }
            .name {
                font-size: rem(34px);
            }
            .code {
                font-size: rem(20px);
                color: #999;
            }
            .price {
                font-size: rem(34px);
            }
            .alignRight {
                font-size: rem(20px);
                text-align: right;
            }
            .directionPrice {
                color: $muted;
            }
        }
        .pageTabs {
            padding-top: 0;
            width: rem(320px);
            margin: rem(40px) auto;
            ::v-deep {
                .van-tabs__nav--card {
                    margin: 0;
                    border: 0;
                    border-radius: rem(30px);
                    overflow: hidden;
                }
            }
        }
        .container {
            position: relative;
            &::before {
                @include borderline();
                top: 0;
            }
        }
        .orderProfitloss {
            margin-top: rem(15px);
        }
        .submitBox {
            position: absolute;
            z-index: 10;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            .submitBtn{
                flex: 1;
                border-radius: 0;
            }
            .fullScreen{
                width: 23.38%;
                background: #F6F6F6;
                border-color: #F6F6F6;
                color: #333;
            }
        }
    }

</style>
