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
            </div>
        </div>
        <div class='cell'>
            <div class='price'>
                <div>
                    <div class='price_item'>
                        <span
                            :class="{ 'riseColor':item.direction===1,'fallColor':item.direction===2 }"
                        >
                            {{ item.direction | direction }}
                        </span>
                        <span>{{ item.request_volume }} {{ $t('trade.volumeUnit') }}</span>
                    </div>
                    <div class='price_item'>
                        <span>{{ $t('trade.pendingPrice') }}</span>
                        <span
                            :class="Math.abs(item.direction === 1?item.productData.buy_price-item.request_price:item.productData.sell_price-item.request_price)<=item.groupSymbol.pip*5?'warn':''"
                        >
                            {{ item.request_price }}
                        </span>
                    </div>
                </div>
                <div>
                    <div class='price_item'>
                        <span>{{ $t('trade.expired') }}</span>
                        <span>{{ item.expireType | expireType }}</span>
                    </div>
                    <div class='price_item'>
                        <span>{{ $t('trade.currentPrice') }}</span>
                        <span :class='item.direction === 1?item.productData.buy_color:item.productData.sell_color'>
                            <template v-if='item.direction === 2'>
                                {{ item.productData.sell_price || '--' }}
                            </template>
                            <template v-else-if='item.direction === 1'>
                                {{ item.productData.buy_price || '--' }}
                            </template>
                        </span>
                    </div>
                </div>
            </div>
            <div class='ft'>
                <div class='bd'>
                    <i
                        v-prophet="['trackEvent', '交易', '挂单', '持仓_图表', 72]"
                        class='icon_icon_chart hidden'
                        @click.prevent='toChart(item)'
                    ></i>
                </div>
                <van-button
                    v-prophet="['trackEvent', '交易', '挂单', '持仓_取消', 71]"
                    color='#F3F8FF'
                    size='mini'
                    @click.prevent='handleCancelOrderTip(item)'
                >
                    {{ $t('compLang.cancel') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'PositionListBItem',
    props: ['item', 'language'],
    data () {
        return {}
    },
    methods: {
        toChangeOrder (id) {
            this.$emit('toChangeOrder', id)
        },
        handleCancelOrderTip (item) {
            this.$emit('handleCancelOrderTip', item)
        },
        toChart (item) {
            this.$router.push({ name: 'ProductDetail', params: { id: item.code_id } })
        }
    },
}
</script>

<style lang="scss" scoped>
</style>
