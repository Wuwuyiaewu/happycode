<template>
    <div>
        <van-popup
            v-model='showDialog'
            class='m-dialog m-dialogPc'
            :class='{ pc:isPC }'
            get-container='body'
            :position="isPC?'center':'bottom'"
            @closed='close'
            @open='open'
        >
            <p v-if='tipWords' class='errorFixedTip tip-words'>
                {{ tipWords }}
            </p>
            <div class='dialog-header'>
                <div class='title'>
                    <p class='productName'>
                        {{ orderinfo.simplified }}
                    </p>
                    <p v-if="language!=='en-US'" class='lot'>
                        {{ orderinfo.short_name }}
                    </p>
                </div>
                <div class='right' @click='cancel'>
                    <i class='icon_icon_close_big'></i>
                </div>
            </div>
            <div class='dialog-body'>
                <template v-if='showDialog'>
                    <div class='inputNumber'>
                        <div class='left'>
                            <div class='name'>
                                {{ $t('trade.hold') }}
                            </div>
                            <div class='val'>
                                <span
                                    :class="{ 'riseColor':orderinfo.direction===1,'fallColor':orderinfo.direction===2 }"
                                >
                                    {{ orderinfo.direction | direction }}
                                </span>
                                {{ orderinfo.volume }} {{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='right'>
                            <div>
                                <div class='name'>
                                    {{ $t('trade.positionPrice') }}
                                </div>
                                <div>{{ orderinfo.open_price }}</div>
                            </div>
                            <div class='line'>
                                <div class='lineInfo van-hairline--bottom'>
                                    {{ point }}
                                    <template v-if='!orderinfo.isStock'>
                                        {{ $t('trade.point') }}
                                    </template>
                                </div>
                            </div>
                            <div>
                                <div class='name'>
                                    {{ $t('trade.currentPrice') }}
                                </div>
                                <div :class='orderinfo.direction === 1?orderinfo.sell_color:orderinfo.buy_color'>
                                    <template v-if='orderinfo.direction === 1'>
                                        {{ orderinfo.sell_price || '--' }}
                                    </template>
                                    <template v-else-if='orderinfo.direction === 2'>
                                        {{ orderinfo.buy_price || '--' }}
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if='step === 1'>
                        <div class='inputNumber'>
                            <div class='title'>
                                <div>{{ $t('trade.closedNum') }}({{ $t('trade.volumeUnit') }})</div>
                            </div>
                            <stepper
                                class='stepper'
                                :class='{ warn: numberTip || tipWords }'
                                :controlbtn='true'
                                :digits='getDecimalNum(orderinfo.groupSymbol.volumes_step)'
                                :max='orderinfo.volume'
                                :min='min'
                                :placeholder="$t('trade.positionNum')"
                                :step='orderinfo.volumes_step'
                                :value='sellNum'
                                @change='change'
                            />
                        </div>
                        <van-tabs v-model='activeBtn' class='pcBtns' type='card' @click='changeValue'>
                            <van-tab name style='display:none' />
                            <van-tab
                                v-for='item in btns'
                                :key='item.value'
                                :disabled='item.disabled'
                                :name='item.value'
                            >
                                <van-button slot='title' round>
                                    {{ item.title }}
                                </van-button>
                            </van-tab>
                        </van-tabs>
                    </template>
                    <div v-else-if='step === 2' class='step-2'>
                        {{ $t('trade.closedNumWarn',{ volume:orderinfo.volume }) }}
                    </div>
                    <div class='info'>
                        <!-- <div class="row">base:{{orderinfo.interest_exchange_base}}</div>
                        <div class="row">profit:{{orderinfo.interest_exchange_profit}}</div>
                        <div class="row">buy_price:{{orderinfo.exchange_buy_price}}</div>
                        <div class="row">sell_price:{{orderinfo.exchange_sell_price}}</div>-->
                        <div class='row'>
                            <div class='name'>
                                {{ $t('trade.closeProfit') }}
                            </div>
                            <div class='val'>
                                <template
                                    v-if='orderinfo.groupSymbol.profit_currency !=symbolCode'
                                >
                                    {{ orderinfo.profitOrLoss/orderinfo.exchangeRate/orderinfo.volume*sellNum | moneyAccuracy }} {{ orderinfo.groupSymbol.profit_currency }}≈
                                </template>
                                {{ orderinfo.profitOrLoss/orderinfo.volume*sellNum | moneyAccuracy }} {{ symbolCode }}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='name'>
                                {{ $t('trade.swap') }}
                            </div>
                            <div class='val'>
                                <!-- <template
                                    v-if="symbolCode !=orderinfo.groupSymbol.profit_currency "
                                >{{orderinfo.swap/orderinfo.exchangeRate/orderinfo.volume*sellNum | moneyAccuracy}} {{orderinfo.groupSymbol.profit_currency}}≈</template>-->
                                {{ orderinfo.swap/orderinfo.volume*sellNum | moneyAccuracy }} {{ symbolCode }}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='name'>
                                {{ $t('trade.fee') }}
                            </div>
                            <div class='val'>
                                <!-- <template
                                    v-if="symbolCode !=orderinfo.groupSymbol.profit_currency "
                                >{{orderinfo.commission/orderinfo.exchangeRate/orderinfo.volume*sellNum | moneyAccuracy}} {{orderinfo.groupSymbol.profit_currency}}≈</template>-->
                                {{ orderinfo.commission/orderinfo.volume*sellNum | moneyAccuracy }} {{ symbolCode }}
                            </div>
                        </div>
                        <div class='row'>
                            <div class='name'>
                                {{ $t('trade.closeNetProfit') }}
                            </div>
                            <div class='val'>
                                <!-- <template
                                    v-if="symbolCode !=orderinfo.groupSymbol.profit_currency "
                                >{{(orderinfo.profitOrLoss+ orderinfo.swap+orderinfo.commission)/orderinfo.exchangeRate/orderinfo.volume*sellNum | moneyAccuracy}} {{orderinfo.groupSymbol.profit_currency}}≈</template>-->
                                <span
                                    :class="{ 'riseColor':(orderinfo.profitOrLoss+ orderinfo.swap+orderinfo.commission)>0, 'fallColor':(orderinfo.profitOrLoss+ orderinfo.swap+orderinfo.commission)<0 }"
                                >
                                    {{ (orderinfo.profitOrLoss+ orderinfo.swap+orderinfo.commission)/orderinfo.volume*sellNum | moneyAccuracy }}
                                </span>
                                {{ symbolCode }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class='dialog-footer'>
                <!-- <van-button plain @click="cancel">{{$t('compLang.cancel')}}</van-button> -->
                <van-button
                    v-prophet="['trackEvent', '交易', '市价平仓', '平仓_确认平仓', 75]"
                    color='#477FD3'
                    :loading='loading'
                    @click='submit'
                >
                    {{ $t('trade.confirmClose') }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { toFixed, divide, getDecimalNum } from '@/utils/calculation'
import { mapGetters } from 'vuex'
import { msg_id } from '@/utils/index'
import Stepper from '@m/components/stepper'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'DialogPc',
    components: {
        stepper: Stepper
    },
    mixins: [pcMixin],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        from: {
            type: String,
            default: ''
        },
        orderid: {
            default: ''
        },
        // orderinfo: {
        //     // 订单信息
        //     type: Object,
        //     default() {
        //         return {}
        //     }
        // }
    },
    data () {
        return {
            showDialog: false,
            btns: [],
            sellNum: '',
            step: 1,
            loading: false,
            numberTip: false,
            tipWords: '',
            activeBtn: 1
        }
    },
    computed: {
        ...mapGetters(['accountData', 'symbolCode']),
        min () {
            if (this.orderinfo.volume < this.orderinfo.volumes_min) {
                return this.orderinfo.volume
            } else {
                return this.orderinfo.volumes_min
            }
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo ? this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language : 'zh-CN'
        },
        orderinfo () {
            const position = this.accountData.positionList || []
            return (position.filter(item => (item.id == this.orderid))[0]) || {}
        },
        point () {
            let _point = String(this.orderinfo.groupSymbol.pips_ratio).length - 1
            if (this.orderinfo.isStock) {
                _point = this.orderinfo.groupSymbol.digits
            }
            if (this.orderinfo.direction === 1) {
                return ((this.orderinfo.sell_price - this.orderinfo.open_price) / (this.orderinfo.isStock ? 1 : this.orderinfo.groupSymbol.pip)).toFixed(_point)
            } else {
                return ((this.orderinfo.open_price - this.orderinfo.buy_price) / (this.orderinfo.isStock ? 1 : this.orderinfo.groupSymbol.pip)).toFixed(_point)
            }
        }
    },
    watch: {
        show (val) {
            this.showDialog = val
        }
    },
    methods: {
        close () {
            this.step = 1
            this.activeBtn = 1
            this.loading = false
            this.$emit('update:show', false)
            delete this.$options.sockets.onmessage
        },
        open () {
            const point = getDecimalNum(this.orderinfo.volumes_step)
            const fastBtns = [
                { title: this.$t('trade.allPosition'), value: 1 },
                { title: '1/2', value: 0.5 },
                { title: '1/3', value: 1 / 3 },
                { title: '1/4', value: 0.25 }
            ]
            const step = Math.round(this.orderinfo.volume / this.orderinfo.volumes_step)
            fastBtns.forEach(item => {
                const number = this.orderinfo.volumes_step * Math.floor(step * item.value)
                const num = toFixed(number, point + 1)
                item.value = (number / this.orderinfo.volume).toFixed(8) * 1
                if ((parseFloat(num) <= 0 || parseFloat(num) < this.orderinfo.volumes_min) && item.value != 1) {
                    item.disabled = true
                } else {
                    item.disabled = false
                }
            })
            console.log(fastBtns)
            this.btns = fastBtns
            this.change(this.orderinfo.volume, true)
            // if (this.orderinfo.volume <= this.orderinfo.volumes_min) {
            //     this.step = 2
            // }
        },
        changeValue (val) {
            // 步长*（取整（当前数字的步数/比例））
            const point = getDecimalNum(this.orderinfo.volumes_step)
            if (this.orderinfo.volume < this.orderinfo.volumes_min) {
                this.change(toFixed(this.orderinfo.volume), true)
            } else {
                this.change(toFixed(this.orderinfo.volumes_step * Math.round((this.orderinfo.volume / this.orderinfo.volumes_step) * parseFloat(val)), point), true)
            }
        },
        /*  blurSellNum() {
            this.sellNum = toFixed(this.sellNum)
            if (this.sellNum > this.orderinfo.volume) {
                this.sellNum = this.orderinfo.volume
            } else if (this.sellNum < this.orderinfo.volumes_min) {
                if (this.orderinfo.volume < this.orderinfo.volumes_min) {
                    this.sellNum = this.orderinfo.volume
                } else {
                    this.sellNum = this.orderinfo.volumes_min
                }
            }
        }, */
        change (newval, unUpdateBtn) {
            this.tipWords = ''
            this.numberTip = false
            this.sellNum = newval
            if (this.sellNum < this.min || this.sellNum > this.orderinfo.volume) {
                this.tipWords = this.tipWords = this.$t('trade.volumesOutScope', {
                    min: this.min,
                    max: this.orderinfo.volume,
                    volumeUnit: this.$t('trade.volumeUnit')
                })
                this.numberTip = true
            } else if (divide(this.sellNum, this.orderinfo.volumes_step) % 1 !== 0 && this.orderinfo.volume > this.orderinfo.volumes_min) {
                this.tipWords = this.$t('trade.volumesOutScopeTip', { volume: this.orderinfo.volumes_step })
                this.numberTip = false
            }
            // 切换高亮btn
            if (!unUpdateBtn) {
                const btnValue = (1 / (this.orderinfo.volume / newval)).toFixed(8) * 1
                let flg = true
                this.btns.forEach(item => {
                    if (!item.disabled && item.value == btnValue) {
                        this.activeBtn = item.value
                        flg = false
                    }
                })
                if (flg) {
                    this.activeBtn = null
                }
            }
        },
        submit () {
            if (this.tipWords || this.numberTip) {
                return
            }
            this.loading = true

            this.$store.dispatch('sendUserRiskInfo', {
                type: 5
            }) // 调用指纹采集接口

            this.$mSocket
                .send(
                    'openOrder',
                    {
                        msg_id: msg_id(),
                        account_id: this.orderinfo.account_id,
                        position_id: this.orderinfo.id,
                        group_id: this.orderinfo.groupSymbol.group_id,
                        direction: this.orderinfo.direction === 1 ? 2 : 1,
                        type: 8,
                        contract_size: this.orderinfo.groupSymbol.contract_size,
                        status: this.orderinfo.status,
                        client_type: 4,
                        symbol: this.orderinfo.symbol,
                        request_volume: parseFloat(this.sellNum),
                        request_price: this.orderinfo.direction === 1 ? parseFloat(this.orderinfo.sell_price) : parseFloat(this.orderinfo.buy_price),
                        expire_type: 1,
                        range: this.orderinfo.groupSymbol.range_initial || 100
                    },
                    [],
                    Math.max(60, this.orderinfo.groupSymbol.order_timeout)
                )
                .then(res => {
                    this.loading = false
                    if (res.errorType) {
                        if (res.errorData && res.errorData.ret) {
                            this.$dialog.alert(
                                {
                                    title: this.$t('trade.closedFail'),
                                    confirmButtonText: this.$t('iKnow'),
                                    message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.msg
                                })
                            return
                        }
                        this.$toast({ duration: 1000, message: res.remark })
                    }
                    const orderInfo = {
                        execute_price: res.DealAddRet.execute_price.toFixed(this.orderinfo.groupSymbol.digits),
                        src_price: res.DealAddRet.src_price.toFixed(this.orderinfo.groupSymbol.digits),
                        execute_volume: parseFloat(this.sellNum),
                        totalprofit: toFixed(res.DealAddRet.profit + res.DealAddRet.swap + res.DealAddRet.commission),
                        profit: res.DealAddRet.profit,
                        swap: res.DealAddRet.swap,
                        symbol: res.DealAddRet.symbol,
                        direction: res.DealAddRet.direction,
                        commission: res.DealAddRet.commission,
                        codeid: this.orderinfo.code_id || res.DealAddRet.symbol
                    }
                    this.$store.commit('UPDATE_disabledSuccAnimtion', false)
                    this.$router.push({ name: 'SellSuccess', params: { id: res.DealAddRet.id }, query: orderInfo })
                    this.showDialog = false
                    this.$ws.send('positions', {
                        account_id: this.$store.state.ix_user.userLoginInfo.account_id
                    })
                })
                .catch(error => {
                    this.loading = false
                    if (error && error.errorType === 'TimeOut') {
                        this.$dialog
                            .alert({
                                title: this.$t('trade.closedFail'),
                                messageAlign: 'left',
                                message: this.$t('trade.closedFailTip'),
                                confirmButtonText: this.$t('iKnow')
                            })
                            .then(() => {
                                this.showDialog = false
                            })
                    }
                })
        },
        cancel () {
            this.showDialog = false
        },
        getDecimalNum,
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-dialogPc {
    height: rem(740px);
    z-index: 1000;
    &.pc{
        width:400px;
        height: 600px;
        border-radius: 6px;
        .dialog-footer{
            position: absolute;
            left:20px;
            right:20px;
            bottom: 20px;
            .van-button{
                border-radius: 2px;
            }
        }
        .dialog-header{
            .title{
                    padding: 0 60px;
                .productName{
                    @include single-line-clamp();
                }
            }
        }

    }
    .errorFixedTip {
        height: rem(50px);
        line-height: rem(50px);
        background: rgba(255, 240, 226, 1);
        color: #e3525c;
        text-align: center;
        font-size: rem(24px);
        width:100%;
        top:57px !important;
    }
    .lot {
        color: #999;
        text-align: center;
        font-size: rem(20px);
    }

    .dialog-body {
        ::v-deep {
            .pcBtns {
                padding-bottom: rem(30px);
                text-align: right;
                .van-tabs__wrap {
                    height: rem(60px);
                }
                .van-tabs__nav--card {
                    margin: 0 rem(30px);
                    height: rem(60px);
                }
                .van-tabs__nav {
                    border: none;
                    justify-content: flex-end;
                }
                .van-tab {
                    border-right: none;
                    padding: 0;
                    height: rem(50px);
                    width: rem(120px);
                    flex: none;
                    margin-left: rem(30px);
                }
                .van-button {
                    width: rem(120px);
                    height: rem(50px);
                    line-height: rem(50px);
                    background-color: #f9f9f9;
                    border-color: #f9f9f9;
                    border-radius: rem(6px);
                    color: #333333;
                    padding: 0;
                    text-align: center;
                }
                .van-tab--active {
                    background-color: #fff;
                    .van-button {
                        background-color: #477fd3;
                        color: #fff;
                        border-color: #477fd3;
                    }
                }
            }
            .inputNumber {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 rem(40px) rem(40px) rem(35px);
                .title {
                    font-size: rem(28px);
                    color: #333333;
                }
                .stepper {
                    &.warn {
                        color: $red;
                    }
                }
                .tipNumber {
                    font-size: rem(24px);
                    color: #666;
                    &.warn {
                        color: $red;
                    }
                }
                .tipWords {
                    position: absolute;
                    color: $red;
                    bottom: rem(-30px);
                    left: rem(330px);
                    font-size: rem(24px);
                }
                .name {
                    font-size: rem(20px);
                    color: #999;
                    padding-bottom: rem(20px);
                }
                .left,
                .right {
                    font-size: rem(20px);
                }
                .left {
                    width: rem(300px);
                }
                .right {
                    flex: 1;
                    display: flex;
                    .line {
                        flex: 1;
                        position: relative;
                        .lineInfo {
                            margin: 0 rem(40px);
                            padding-top: rem(20px);
                            padding-bottom: rem(10px);
                            text-align: center;
                            border-color: #999;
                        }
                    }
                }
            }
            .info {
                margin: 0 rem(40px) rem(20px) rem(35px);
                font-size: rem(20px);
                color: #999;
                .row {
                    display: flex;
                    justify-content: space-between;
                }
                .name {
                    padding-bottom: rem(8px);
                }
                .val {
                    flex: 1;
                    text-align: right;
                }
            }
        }
        .step-2 {
            padding-bottom: rem(60px);
            font-size: rem(28px);
            text-align: center;
            color: #333;
        }
    }
}
</style>
