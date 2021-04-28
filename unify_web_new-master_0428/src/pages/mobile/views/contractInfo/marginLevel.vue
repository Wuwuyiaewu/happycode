<template>
    <div class='marginList'>
        <van-row justify='end' type='flex'>
            <van-col span='12'>
                <p>{{ $t('productInfo.volumesScope') }}</p>
                <p v-for='(item,i) in marginList' :key='item.id'>
                    <span
                        v-if='i !== marginList.length-1'
                    >
                        {{ item.range_min.toFixed(decimalNum)*1 }} &lt; {{ $t('trade.unitNum') }} ≤ {{ item.range_max.toFixed(decimalNum)*1 }}
                    </span>
                    <span v-else>
                        {{ $t('trade.unitNum') }} &gt; {{ item.range_min.toFixed(decimalNum)*1 }}
                    </span>
                </p>
            </van-col>
            <van-col offset='1' span='11'>
                <p>{{ $t('productInfo.marginNum') }}</p>
                <p v-for='item in marginList' :key='item.id'>
                    <span>{{ (item[feild]/100)['toFixed'](2) }}% *{{ $t('orderAmount') }}({{ symbolCode }})</span>
                    <!-- <span v-else>{{item[feild]['toFixed'](2)}}</span> -->
                </p>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { getDecimalNum } from '@/utils/calculation'
export default {
    props: ['marginList', 'volumes_step', 'feild', 'groupGet'],
    computed: {
        ...mapGetters(['symbolCode']),
        decimalNum () {
            return getDecimalNum(this.volumes_step)
        }
    }
}
</script>

<style lang="scss" scoped>
.marginList {
    text-align: right;
}
</style>
