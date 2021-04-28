<template>
    <div class='profitLossSetBar'>
        <van-cell v-if='!hideTitleBar' center class='cellWrapper' :title="$t('trade.tackStopSetup')">
            <template #right-icon>
                <van-switch
                    v-model='enabled'
                    v-prophet="$attrs['v-prophet-value']"
                    :active-color='style.subColor'
                    size='24'
                    @change='switchCellChange'
                />
            </template>
        </van-cell>
        <ProfitLoss
            v-if='enabled'
            ref='profitLoss'
            v-model='value'
            :digits='product.groupSymbol.digits'
            :direction='direction'
            :pending-order-price='pendingOrderPrice'
            :product='product'
            :volume='volume'
            @change='change($event)'
        />
    </div>
</template>

<script>
/**
 * 1、市价卖
       止损价格范围：卖价+最小点数转价格<=X<=卖价+最大点数转价格
       止盈价格范围：卖价-最大点数转价格 <=X<=卖价-最小点数转价格
    2、市价买
       止损价格范围：买价-最大点数转价格<=X<=买价-最小点数转价格
       止盈价格范围：买价+最小点数转价格<=X<=买价+最大点数转价格
 */
import { Switch } from 'vant'
import { mapGetters } from 'vuex'
import ProfitLoss from './profitLoss'
export default {
    name: 'ProfitLossSetBar',
    props: ['product', 'direction', 'pendingOrderPrice', 'hideTitleBar', 'config', 'volume'],
    data () {
        return {
            enabled: false,
            value: {
                take_profit: '', // 止盈价格
                stop_loss: '', // 止损价格
            }
        }
    },
    computed: {
        ...mapGetters(['style']),
    },
    components: {
        [Switch.name]: Switch,
        ProfitLoss,
    },
    created () {
        if (this.hideTitleBar) this.enabled = true
        const config = this.config
        const value = this.value
        if (config) {
            value.take_profit = config.take_profit || ''
            value.stop_loss = config.stop_loss || ''
            this.enabled = !!config.take_profit || !!config.stop_loss
        }
    },
    methods: {
        // 止盈止损价格变动事件
        change (newval) {
            this.value = newval
        },
        // 提交设置， 供外部使用
        submit () {
            const enabled = this.enabled
            const profitLoss = this.$refs.profitLoss
            if (enabled && (profitLoss.profitWarn || profitLoss.lossWarn)) return false
            const value = this.value
            const params = {
                take_profit: 0,
                stop_loss: 0,
            }
            if (enabled && value.take_profit) params.take_profit = value.take_profit
            if (enabled && value.stop_loss) params.stop_loss = value.stop_loss
            return params
        },
        switchCellChange () {
            this._collect('止盈止损')
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.profitLossSetBar {
    background: #fff;
}
.cellWrapper {
    padding-left: 0;
    padding-right: 0;
}
</style>
