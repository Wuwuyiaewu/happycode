<template>
    <div>
        <van-popup
            v-model='showDialog'
            class='m-dialog m-dialogZyzs'
            :class='{ pc:isPC }'
            get-container='body'
            :position="isPC?'center':'bottom'"
            @closed='close'
            @open='open'
        >
            <template v-if='showDialog'>
                <div class='dialog-header'>
                    <div class='title'>
                        <p class='productName'>
                            {{ orderinfo.simplified }}
                        </p>
                        <p v-if="language!=='en-US'" class='lot'>
                            {{ orderinfo.short_name }}
                        </p>
                    </div>
                    <div class='right' @click='close'>
                        <i class='icon_icon_close_big'></i>
                    </div>
                </div>
                <div class='dialog-body'>
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
                    <profit-loss
                        ref='profitLoss'
                        v-model='setData'
                        class='mtop'
                        :digits='product.groupSymbol.digits'
                        :direction="direction === 1 ? 'buy' : 'sell'"
                        from='zyzs'
                        :open-price='orderinfo.open_price'
                        :position-close-price="isPosition ? positionClosePrice : ''"
                        :product='orderinfo'
                        :volume='orderinfo.volume'
                    />
                </div>
                <div class='dialog-footer'>
                    <van-button color='#477FD3' @click='submit'>
                        {{ $t('save') }}
                    </van-button>
                </div>
            </template>
        </van-popup>
    </div>
</template>

<script>
import profitLoss from '@m/modules/profitLossSet/profitLoss'
import { mapGetters } from 'vuex'
import { msg_id } from '@/utils/index'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'DialogZyzs',
    components: {
        profitLoss
    },
    mixins: [pcMixin],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isPosition: {
            type: Boolean,
            default: false
        },
        product: {
            type: Object,
            default () {
                return {}
            }
        },
        direction: {
            default: ''
        }
    },
    data () {
        return {
            showDialog: false,
            setData: {
                take_profit: '',
                stop_loss: ''
            },
            baseSetData: {
                take_profit: '',
                stop_loss: ''
            }
        }
    },
    computed: {
        ...mapGetters(['accountData']),
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        orderinfo () {
            let data = {}
            if (this.product && this.product.id) {
                data = this.accountData.positionList.filter(item => item.id === this.product.id)[0]
            }
            return data
        },
        positionClosePrice () {
            return this.direction == 1 ? this.orderinfo.sell_price : this.orderinfo.buy_price
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
    destroyed () {
        this.close()
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        open () {
            this.setData = {
                take_profit: this.product.take_profit || '',
                stop_loss: this.product.stop_loss || ''
            }
            this.baseSetData = {
                take_profit: this.product.take_profit || '',
                stop_loss: this.product.stop_loss || ''
            }
        },
        submit () {
            // 设置止盈止损
            if (this.$refs.profitLoss.profitWarn || this.$refs.profitLoss.lossWarn) {
                return
            }
            if (this.setData.take_profit === this.baseSetData.take_profit && this.setData.stop_loss === this.baseSetData.stop_loss) {
                this.$toast({ duration: 2000, message: this.$t('trade.orderNotChange') })
                return
            }
            const product = this.product
            const setData = this.setData
            const userLoginInfo = this.userLoginInfo
            this.loading = this.$loading({ mask: true, duration: 0 })
            this.$mSocket
                .send('profitloss', {
                    msg_id: msg_id(),
                    account_id: product.account_id,
                    id: product.id,
                    group_id: product.group_id,
                    direction: product.direction,
                    type: product.type || 1,
                    symbol: product.symbol,
                    volume: product.volume,
                    init_volume: product.init_volume,
                    contract_size: product.groupSymbol.contract_size,
                    open_price: product.open_price,
                    open_time: product.open_time,
                    close_price: product.close_price,
                    close_time: product.close_time,
                    stop_loss: setData.stop_loss * 1,
                    take_profit: setData.take_profit * 1,
                    profit: product.profit,
                    swap: product.swap,
                    status: 1,
                    last_account_id: userLoginInfo.account_id
                })
                .then(res => {
                    this.loading.clear()
                    if (res.errorType) {
                        this.$alert(this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark)
                        return
                    }
                    this.$emit('submit')
                    this.$alert(this.$t('updateSuccess'))
                    this.close()
                })
                .catch(error => {
                    this.loading.clear()
                    this.$alert(error && error.errorType ? error.errorType : error)
                    console.log(error)
                })

            // this.$emit('submit', this.setData)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-dialogZyzs {
    height: rem(630px);
    overflow-y: visible;
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
    .lot {
        color: #999;
        text-align: center;
        font-size: rem(20px);
    }
    .dialog-body {
        overflow-y: visible;
        ::v-deep {
            .layout-1 {
                padding-bottom: rem(30px);
            }
        }
        .mtop {
            padding: 0 rem(40px);
        }
        .inputNumber {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 rem(40px) rem(20px) rem(35px);
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
                width: rem(200px);
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
    }
}
</style>
