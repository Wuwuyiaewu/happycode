<template>
    <section class='content'>
        <h2 class='title'>
            {{ $t('trade.estMargin') }}
        </h2>
        <dl class='list'>
            <dt>
                <span class='fr'>
                    {{ $t('trade.originalMargin') }}
                </span>
                {{ $t('trade.unitNum') }}
            </dt>
            <dd v-for='(item,i) in marginList' :key='i'>
                <span
                    class='fr'
                >
                    {{ item.margin_initial['toFixed'](2) }}% x {{ $t('productInfo.orderValue') }} ({{ accountCurrency }})
                </span>
                <span
                    v-if='i!==marginList.length-1'
                >
                    {{ item.range_min.toFixed(decimalNum)*1 }} &lt; {{ $t('trade.unitNum') }} ≤ {{ item.range_max.toFixed(decimalNum)*1 }}
                </span>
                <span v-else>
                    {{ $t('trade.unitNum') }} &gt; {{ item.range_min.toFixed(decimalNum)*1 }}
                </span>
            </dd>
        </dl>
        <p class='desc'>
            {{ $t('trade.estMarginDesc') }}
        </p>
    </section>
</template>

<script>
import { getDecimalNum } from '@/utils/calculation'
export default {
    props: ['value', 'product'],
    computed: {
        accountCurrency () {
            return this.$store.getters.symbolCode
        },
        groupSymbol () {
            return this.product.groupSymbol
        },
        decimalNum () {
            return getDecimalNum(this.groupSymbol.volumes_step)
        },
        marginList () {
            const contract_size = this.groupSymbol.contract_size
            const decimalNum = this.decimalNum
            return this.groupSymbol.margin_set_list.map(el => {
                return {
                    range_min: (el.range_min / contract_size).toFixed(decimalNum) * 1,
                    range_max: (el.range_max / contract_size).toFixed(decimalNum) * 1,
                    margin_initial: el.margin_initial / 100,
                }
            })
        }
    }
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
