<template>
    <section class='content'>
        <h2 class='title'>
            {{ $t('trade.contractInfo') }}
        </h2>
        <dl class='list'>
            <dt>
                <span class='fr'>
                    {{ product.short_name }}
                </span>
                {{ $t('productInfo.productCode') }}
            </dt>
            <dd>
                <div class='fr'>
                    <span
                        v-if='[8,13].includes(product.market_id)'
                    >
                        {{ groupSymbol.contract_size +' '+ groupSymbol.base_currency }}
                    </span>
                    <span v-else-if='[10,12,14,15].includes(product.market_id)'>
                        {{ groupSymbol.contract_size }}
                    </span>
                    <span
                        v-else-if='[11].includes(product.market_id)'
                    >
                        {{ groupSymbol.contract_size +' '+ $t('trade.indexPoint') }}
                    </span>
                    <span
                        v-else-if='[0,1,2,9].includes(product.market_id)'
                    >
                        {{ groupSymbol.contract_size +' '+ $t('productInfo.gu') }}
                    </span>
                </div>
                {{ $t('productInfo.contractSize') }}
            </dd>
            <dd>
                <span class='fr'>
                    {{ groupSymbol.profit_currency }}
                </span>
                {{ $t('productInfo.profitCurrency') }}
            </dd>
            <dd>
                <span class='fr'>
                    {{ $t('productInfo.priceFluctuation') }} {{ pip }}
                </span>
                {{ $t('productInfo.pipExpress') }}
            </dd>
            <dd>
                <div class='fr'>
                    {{ volumePip|priceDigit(2) }} {{ groupSymbol.profit_currency }}
                    <span
                        v-if='groupSymbol.profit_currency!==accountCurrency'
                    >
                        ，≈ {{ volumePipsAccount|priceDigit(2) }} {{ accountCurrency }}
                    </span>
                </div>
                {{ $t('productInfo.pipVolumeVal') }}
            </dd>
            <dd v-if='groupSymbol.commission && groupSymbol.commission_type===1'>
                <span class='fr'>
                    {{ $t('trade.orderVolume') }} x {{ commission | priceDigit(2) }}%
                </span>
                {{ $t('productInfo.openOrderSwap') }}
            </dd>
            <dd v-else-if='groupSymbol.commission && groupSymbol.commission_type===0'>
                <span
                    class='fr'
                >
                    {{ $t('productInfo.orderValue') }}({{ accountCurrency }}) x {{ commission | priceDigit(2) }}%
                </span>
                {{ $t('productInfo.openOrderSwap') }}
            </dd>
            <dd>
                <span
                    class='fr'
                >
                    {{ groupSymbol.long_swap?groupSymbol.long_swap.toFixed(2):'--' }}%/{{ groupSymbol.short_swap?groupSymbol.short_swap.toFixed(2):'--' }}% ({{ $t('productInfo.yearRate') }})
                </span>
                {{ $t('productInfo.swap') }}
            </dd>
        </dl>
        <p v-if='product.isStock' class='desc'>
            {{ $t('trade.volumeExplain2') }}
        </p>
        <p v-else class='desc'>
            {{ $t('trade.volumeExplain3') }}
        </p>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { pipCalc, volumePips, volumePipsAccount } from '@/store/ix_utils'
export default {
    props: ['value', 'product', 'profitToUSD'],
    data () {
        return {
            pip: '',
            volumePip: '',
            volumePipsAccount: '',
        }
    },
    computed: {
        ...mapGetters(['usdcnyRate']),
        accountCurrency () {
            return this.$store.getters.symbolCode
        },
        groupSymbol () {
            return this.product.groupSymbol
        },
        commission () {
            if (this.groupSymbol.commission_type === 0) { // 0 合约价值类型
                return this.groupSymbol.commission / 10000
            } else { // 1 交易数量类型
                return this.groupSymbol.commission * 100
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.pip = pipCalc(this.groupSymbol)
            this.volumePip = volumePips(this.product)
            this.volumePipsAccount = volumePipsAccount('contract', this.product, this.profitToUSD) * this.usdcnyRate
        },
    },

}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.content {
    padding: rem(40px);
}
.title {
    font-size: rem(30px);
    font-weight: normal;
    line-height: 1.8;
    padding-bottom: rem(20px);
    text-align: center;
}
.list {
    border: 1px solid #eee;
    dt {
        background: #eee;
        padding: rem(20px) rem(20px);
    }
    dd {
        padding: rem(20px) rem(20px);
    }
    .fr {
        float: right;
    }
}
.desc {
    margin-top: rem(20px);
    color: $muted;
}
</style>
