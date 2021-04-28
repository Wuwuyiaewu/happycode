<template>
    <div class='orderCapitalBox muted'>
        <van-row justify='space-between' type='flex'>
            <van-col @click="$emit('popupExplain',1)">
                {{ $t('trade.contractVal') }}
                <van-icon class='alignmiddle' name='question-o' size='14' />
            </van-col>
            <van-col>
                {{ volumePip | priceDigit(2) }} {{ groupSymbol.profit_currency }}
                <span
                    v-if='groupSymbol.profit_currency!==accountCurrency'
                >
                    ，≈ {{ volumePipsAccount | priceDigit(2) }} {{ accountCurrency }}
                </span>
            </van-col>
        </van-row>
        <van-row justify='space-between' type='flex'>
            <van-col @click="$emit('popupExplain',2)">
                {{ $t('trade.estimatedMargin') }}
                <van-icon class='alignmiddle' name='question-o' size='14' />
            </van-col>
            <van-col>
                {{ profitPriceMargin | priceDigit(2) }} {{ groupSymbol.profit_currency }}
                <span
                    v-if='groupSymbol.profit_currency!==accountCurrency'
                >
                    ，≈ {{ openMarginVal }} {{ accountCurrency }}
                </span>
            </van-col>
        </van-row>
        <van-row v-if='groupSymbol.commission' justify='space-between' type='flex'>
            <van-col>{{ $t('trade.fee') }}</van-col>
            <van-col>
                {{ feeProfit | priceDigit(2) }} {{ groupSymbol.profit_currency }}
                <span
                    v-if='groupSymbol.profit_currency!==accountCurrency'
                >
                    ，≈ {{ feeAccountCurrency | priceDigit }} {{ accountCurrency }}
                </span>
            </van-col>
        </van-row>
        <van-row justify='space-between' type='flex'>
            <van-col>
                {{ $t('trade.freeMargin') }}
                <template v-if='!isPC'>
                    <button
                        v-if="accountInfo.accountType === 'real' && origin!=='miniTrade'"
                        v-prophet="$attrs['v-prophet-value']"
                        class='miniBtn mainColorBg'
                        @click="$router.push({ name: 'DepositFunds' })"
                    >
                        {{ $t('trade.capitalAdd') }}
                    </button>
                </template>
            </van-col>
            <van-col>{{ freeMargin }} {{ accountCurrency }}</van-col>
        </van-row>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { pipCalc, volumePips, volumePipsAccount, priceTransformByCurrency, priceTransformToUSD } from '@/store/ix_utils'
import { toFixed, mul } from '@/utils/calculation'
import pcMixin from '@m/mixins/pc'
export default {
    mixins: [pcMixin],
    props: ['value', 'product', 'profitToUSD', 'direction', 'volume', 'openMargin', 'feeAccountCurrency', 'feeProfit'],
    data () {
        return {
        }
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo', 'usdcnyRate']),
        ...mapState({
            product_list: state => state.ix_quote.product_list,
            origin: state => state.origin,
        }),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accountCurrency () {
            return this.$store.getters.symbolCode
        },
        groupSymbol () {
            return this.product.groupSymbol
        },
        volumePip () {
            const volume = this.volume
            return volume ? volumePips(this.product) * volume : 0
        },
        volumePipsAccount () {
            const volume = this.volume
            if (!volume) return 0
            const result = volumePipsAccount(this.direction, this.product, this.profitToUSD) * volume
            return toFixed(result * this.usdcnyRate, 2)
        },
        // 可用保证金
        freeMargin () {
            return toFixed(this.assetAboutInfo.accountData.kybzj)
        },
        // USD保证金转换成盈利货币的价格
        profitPriceMargin () {
            let margin = this.openMargin
            if (this.accountCurrency === 'CNY') margin = margin / this.usdcnyRate // 算出USD货币
            if (this.groupSymbol.profit_currency !== 'USD') margin = priceTransformByCurrency(margin, this.profitToUSD)
            return margin
        },
        // 保证金
        openMarginVal () {
            return toFixed(this.openMargin, 2)
        },
    },

}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.orderCapitalBox {
    font-size: rem(24px);
    line-height: 1.8;
}
.miniBtn {
    padding: 0 rem(15px);
    height: rem(40px);
    line-height: rem(40px);
    border-radius: rem(6px);
    color: #fff;
    font-size: rem(20px);
    @include active();
}
</style>
