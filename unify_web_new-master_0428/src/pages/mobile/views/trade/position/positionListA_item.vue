<template>
    <div class='item'>
        <div class='cell'>
            <div class='th'>
                <div class='name'>
                    {{ item.simplified }}
                </div>
                <div v-if="language!=='en-US'" class='lot'>
                    {{ item.short_name }}
                </div>
                <!-- <van-tag v-if="showErrorMsg(item.maxLoss) && showTip" type="danger">{{$t('trade.dangerTag')}}</van-tag> -->
                <p>
                    <span
                        :class="{ 'riseColor':item.direction===1,'fallColor':item.direction===2 }"
                    >
                        {{ item.direction | direction }}
                    </span>
                    {{ item.volume }} {{ $t('trade.volumeUnit') }}
                </p>
            </div>
            <div>
                <span
                    class='ft amount'
                    :class="{ 'riseColor':(item.profitOrLoss+item.swap+item.commission)>0, 'fallColor':(item.profitOrLoss+item.swap+item.commission)<0 }"
                >
                    {{ (item.profitOrLoss+item.swap+item.commission) | moneyAccuracy(false) }}
                </span>
                <span class='currency'>
                    {{ symbolCode }}
                </span>
            </div>
        </div>
        <div class='cell'>
            <div class='price'>
                <div>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.positionPrice') }}
                        </span>
                        <span>{{ item.open_price }}</span>
                    </div>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.currentPrice') }}
                        </span>
                        <span :class='item.direction === 1?item.sell_color:item.buy_color'>
                            <template v-if='item.direction === 1'>
                                {{ item.sell_price || '--' }}
                            </template>
                            <template v-else-if='item.direction === 2'>
                                {{ item.buy_price || '--' }}
                            </template>
                        </span>
                    </div>
                </div>
                <div>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.stopProfitPrice') }}
                        </span>
                        <span
                            :class="Math.abs(item.direction === 1?item.sell_price-item.take_profit:item.buy_price-item.take_profit)<=item.groupSymbol.pip*5?'warn':''"
                        >
                            {{ item.take_profit != 0? item.take_profit:$t('noSetup') }}
                        </span>
                    </div>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.stopLossPrice') }}
                        </span>
                        <span
                            :class="Math.abs(item.direction === 1?item.sell_price-item.stop_loss:item.buy_price-item.stop_loss)<=item.groupSymbol.pip*5?'warn':''"
                        >
                            {{ item.stop_loss != 0? item.stop_loss:$t('noSetup') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class='ft'>
                <div class='bd'>
                    <i
                        v-prophet="['trackEvent', '交易', '持仓', '持仓_图表', 70]"
                        class='icon_icon_chart hidden'
                        @click.stop.prevent='toChart(item)'
                    ></i>
                </div>
                <!-- <van-button
                    color="#F3F8FF"
                    size="mini"
                    @click.prevent="handleActivePosition(item,'profit')"
                >{{$t('trade.tackStopSetup')}}</van-button>-->
                <van-button
                    v-prophet="['trackEvent', '交易', '持仓', '持仓_市价平仓', 69]"
                    color='#F3F8FF'
                    size='mini'
                    @click.prevent="handleActivePosition(item,'sell')"
                >
                    {{ $t('trade.closed') }}
                </van-button>
            </div>
        </div>
        <!-- <div v-if="showErrorMsg(item.maxLoss) && showTip" @click.stop.prevent>
            <error-tips from="position" :type="assetAboutInfo.colorClass" @close="closeTip" />
        </div>-->
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ErrorTips from '@m/components/ErrorTips'
export default {
    name: 'PositionChart',
    components: {
        // MinuteChart,
        ErrorTips
    },
    props: ['item', 'showTip', 'index', 'language'],
    data () {
        return {}
    },
    computed: {
        ...mapGetters(['assetAboutInfo', 'symbolCode']),
    },
    methods: {
        handleActivePosition (item, type) {
            this._collect(type === 'profit' ? '持仓_止盈止损' : '持仓_平仓')
            this.$emit('handleActivePosition', item, type)
        },
        closeTip () {
            this.$emit('closeTip')
        },
        // showErrorMsg(maxLoss) {
        //     if (maxLoss && this.assetAboutInfo.colorClass === 'stopout') {
        //         return true
        //     } else {
        //         return false
        //     }
        // },
        toChart (item) {
            this.$router.push({ name: 'ProductDetail', params: { id: item.code_id } })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
