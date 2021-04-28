<template>
    <div class='m-ccgd'>
        <van-loading v-if='loading' class='m-loading' size='30px'>
            {{ $t('compLang.loading') }}
        </van-loading>
        <template v-else>
            <template v-if='dataList.length>0'>
                <template v-if='isPC'>
                    <div id='table-scroll' class='table-scroll'>
                        <div class='table-wrap'>
                            <table class='main-table'>
                                <thead>
                                    <tr>
                                        <th>{{ $t('trade.nameCode') }}</th>
                                        <th>{{ $t('trade.direction') }}</th>
                                        <th>{{ $t('trade.pendingNumber') }}({{ $t('trade.volumeUnit') }})</th>
                                        <th>{{ $t('trade.pendingPrice') }}</th>
                                        <th>{{ $t('trade.currentPrice') }}</th>
                                        <th>{{ $t('trade.stopLossPrice') }}</th>
                                        <th>{{ $t('trade.stopProfitPrice') }}</th>
                                        <th>{{ $t('trade.expireTime') }}</th>
                                        <th>{{ $t('trade.pendingNo') }}</th>
                                        <th>{{ $t('trade.pendingTime') }}</th>
                                        <th class='fixed-side' scope='col'>
                                            {{ $t('trade.operating') }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='item in dataList' :key='item.id'>
                                        <td>
                                            <div>
                                                {{ item.simplified }}
                                            </div>
                                            <div v-if="language!=='en-US'">
                                                {{ item.short_name }}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                :class="{ 'riseColor':item.direction===1,'fallColor':item.direction===2 }"
                                            >
                                                {{ item.direction | direction }}
                                            </span>
                                        </td>
                                        <td>{{ item.request_volume }}</td>
                                        <td>
                                            <span
                                                :class="Math.abs(item.direction === 1?item.productData.buy_price-item.request_price:item.productData.sell_price-item.request_price)<=item.groupSymbol.pip*5?'warn':''"
                                            >
                                                {{ item.request_price }}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :class='item.direction === 1?item.productData.buy_color:item.productData.sell_color'
                                            >
                                                <template
                                                    v-if='item.direction === 2'
                                                >
                                                    {{ item.productData.sell_price || '--' }}
                                                </template>
                                                <template
                                                    v-else-if='item.direction === 1'
                                                >
                                                    {{ item.productData.buy_price || '--' }}
                                                </template>
                                            </span>
                                        </td>
                                        <td>{{ item.stop_loss != 0? item.stop_loss:$t('noSetup') }}</td>
                                        <td>{{ item.take_profit != 0? item.take_profit:$t('noSetup') }}</td>
                                        <td>{{ item.expireType | expireType }}</td>
                                        <td>{{ item.id }}</td>
                                        <td>{{ item.request_time | formatTimestamp }}</td>
                                        <td class='fixed-side'>
                                            <van-button
                                                color='#477FD3'
                                                plain
                                                size='mini'
                                                @click.stop='handleCancelOrderTip(item)'
                                            >
                                                {{ $t('compLang.cancel') }}
                                            </van-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <router-link
                        v-for='item in dataList'
                        :key='item.id'
                        class='link'
                        :to="{ name:'BuyOrderInfo',params:{ id:item.id } }"
                    >
                        <Item
                            :item='item'
                            :language='language'
                            @handleCancelOrderTip='handleCancelOrderTip'
                            @toChangeOrder='toChangeOrder'
                        />
                    </router-link>
                </template>
            </template>
            <ListEmpty v-else :txt="$t('trade.pendingEmpty')" />
        </template>
        <DialogBottomTip
            :show.sync='cancelOrderTip'
            :tips="$t('trade.cancelPendingConfirm')"
            :title="$t('trade.cancelPending')"
            @submit='cancelOrder'
        />
    </div>
</template>

<script>
import ListEmpty from '@m/components/ListEmpty'
import { msg_id } from '@/utils/index'
import DialogBottomTip from '@m/components/DialogBottomTip'
import Item from './positionListB_item'
import pcMixin from '@m/mixins/pc'
import { getDecimalNum } from '@/utils/calculation'
export default {
    name: 'PositionListB',
    components: {
        DialogBottomTip,
        ListEmpty,
        Item
    },
    mixins: [pcMixin],
    data () {
        return {
            cancelOrderTip: false,
            loading: false,
            finished: false,
            dataList: [],
            activeItem: {},
            codes: []
        }
    },
    computed: {
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        productMap () {
            return this.$store.state.ix_quote.product_map
        }
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        this.getPendings()
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
    },
    activated () {
        this.getPendings()
    },
    methods: {
        handleCancelOrderTip (item) {
            this.cancelOrderTip = true
            this.activeItem = item
        },
        cancelOrder () {
            this.$mSocket.send('cancelOrder', {
                id: this.activeItem.id,
                msgId: msg_id(),
                accountId: this.activeItem.account_id,
                groupId: this.activeItem.groupSymbol.group_id,
                positionId: this.activeItem.position_id,
                status: 5
            })
                .then(res => {
                    if (res.errorType) {
                        this.$toast(
                            {
                                duration: 1000,
                                message: this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark
                            })
                        return
                    }
                    this.getPendings()
                    this.$toast({ duration: 1000, message: this.$t('trade.cancelPendingSuccess') })
                    this.cancelOrderTip = false
                })
                .catch(error => {
                    this.$toast({ duration: 1000, message: this.$t('timeOut') })
                    console.log(error)
                })
        },
        toChangeOrder (id) {
            this.$router.push({ name: 'ChangeBuyOrder', params: { id: id } })
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code } = JSON.parse(evt.data)
            if (msg_code.toLowerCase() === 'OrderUpdateRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'OrderCancelRet'.toLowerCase() ||
                msg_code.toLowerCase() === 'OrderAddRet'.toLowerCase() ||
                // msg_code.toLowerCase() === 'orderlistret'.toLowerCase() ||
                // msg_code.toLowerCase() === 'positionlistret'.toLowerCase() ||
                msg_code.toLowerCase() === 'PositionAddRet'.toLowerCase()) {
                // 收到订单变化
                console.log('PositionListB收到订单变化')
                this.getPendings()
            }
        },
        getPendings () {
            if (!this.userLoginInfo.account_id) {
                return
            }
            this.loading = true
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
                            item.request_volume = (item.request_volume / _baseInfo.groupSymbol.contract_size).toFixed(getDecimalNum(_baseInfo.groupSymbol.volumes_step))
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
                    this.$emit('get-pendings', _arr)
                    this.dataList = _arr
                    this.codes = code_arr
                    this.loading = false
                    this.$ws.send_addSubscription_proList(this.codes)
                })
                .catch(() => {
                    console.log('timeOut')
                    this.loading = false
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.table-scroll {
    position: relative;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    @include scroll();
    .table-wrap {
        margin-right: 80px;
        overflow: auto;
    }
    table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        .warn {
           background-color: $warn;
        }
        td,
        th {
           padding: 5px 10px;

            box-shadow: 0px -1px 0px 0px #ecedf2;
            background: #fff;
            white-space: nowrap;
            vertical-align: middle;
            height: 43px;
        }
        .fixed-side {
            position: absolute;
            width: 80px;
            text-align: center;
            right: 0;
            top: auto;
            line-height: 36px;
             ::v-deep{
                .van-button--mini{
                    font-size:12px;
                }
            }
        }
    }
}
</style>
