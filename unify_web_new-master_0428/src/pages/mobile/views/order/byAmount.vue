<template>
    <div ref='byAmount' class='byAmount'>
        <div class='amountBox'>
            <span class='currency'>
                {{ symbolCode }}
            </span>
            <span class='amount'>
                <input v-model='openMargin' disabled type='text' />
            </span>
            <p class='lot'>
                {{ $t('trade.unitNum') }} : {{ volume | priceDigit(decimalLen) }}
            </p>
            <div class='sliderNum'>
                <van-slider
                    v-model='volume'
                    :active-color='activeColor'
                    bar-height='5px'
                    :max='maxVolume'
                    :min='groupSymbol.volumes_min'
                    :step='step'
                />
            </div>
        </div>

        <AssetsInfo
            :active-color='activeColor'
            :bzj-warn='bzjWarn'
            :margin-level='marginLevel'
            :open-margin='openMargin'
            :product='product'
            :symbol-code='symbolCode'
            :volume='volume'
        />
    </div>
</template>

<script>
import { Slider, Row, Col } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { plus, minus, getDecimalNum, toFixed } from '@/utils/calculation'
import { marginLevelCalculate, marginLevelVolume, marginLevelVolume_yz, jqhl } from '@/utils/bzj'
import { calcOpenMargin, marginLevel } from '@/store/ix_utils'
import mixin from './mixin'
import AssetsInfo from './assetsInfo'
export default {
    name: 'ByAmount',
    components: {
        [Slider.name]: Slider,
        [Row.name]: Row,
        [Col.name]: Col,
        AssetsInfo
    },
    mixins: [mixin],
    props: ['value', 'groupSymbol', 'product'],
    data () {
        return {
            currentRate: 0,
            key: 'value',
            step: 0.01,
            volume: 0
        }
    },
    computed: {
        adminVolumesMax () {
            return this.groupSymbol.volumes_max
        },
        // 根据可用保证金算出最大手数
        maxVolume () {
            // return this.adminVolumesMax;    //暂时直接返回最大手数

            const currency = this.groupGet.currency
            const kybzj = this.assetAboutInfo.accountData.kybzj || 0 // 可用保证金
            const jqhlRate = jqhl(null, this.productSamePosition) // 加权汇率
            const productSamePosition = this.productSamePosition // 层级保证金
            // positionVolumAll 该产品同方向手数总和
            const positionVolumAll = productSamePosition.reduce((acc, cur) => {
                return plus(acc, cur.volume)
            }, 0)
            let bzjAmountPosition = marginLevelCalculate(positionVolumAll, this.productMarginLevelList)
            if (currency === 'CNY') bzjAmountPosition *= jqhlRate
            let bzjAmountAll = bzjAmountPosition * 1 + kybzj
            if (currency === 'CNY') bzjAmountAll /= jqhlRate
            const volumeTotal = this.amountToVolume(bzjAmountAll) // 根据最大金额计算出对应的最大手数
            return Math.min(this.adminVolumesMax, volumeTotal)
        },
        // 计算每组层级保证金的最大金额
        marginLevelAmountList () {
            const arr = []
            const contract_size = this.groupSymbol.contract_size
            this.productMarginLevelList.forEach((el, i) => {
                let val
                val = this.openMarginFn(el.range_max / contract_size)
                arr.push(val)
            })
            return arr
        },
        // 保证金水平  (净值/占用保证金*100%)
        marginLevel () {
            if (!this.assetAboutInfo) return 0
            return marginLevel({
                assetAboutInfo: this.assetAboutInfo,
                openMargin: this.openMargin
            })
        },
        openMargin () {
            const groupSymbol = this.groupSymbol
            if (!groupSymbol.id || isNaN(this.volume)) return '0.00'
            const m = this.openMarginFn(this.volume)
            return m
        }
    },
    watch: {
        volume (newval, oldval) {
            if (isNaN(newval) || Number(newval) == Number(oldval)) return
            if (getDecimalNum(newval) != this.decimalLen) this.volume = toFixed(newval, this.decimalLen) * 1
            if (!isNaN(newval)) this.$emit('input', newval * 1)
        },
        value (newval) {
            if (!isNaN(newval)) this.volume = newval * 1
        }
    },
    created () {
        this.step = this.groupSymbol.volumes_step
        if (this.value) {
            this.volume = this.value * 1
        }
        // window['byamout'] = this
    },
    methods: {
        // gts2金额换算成手数
        amountToVolume (amount) {
            const productMarginLevelList = this.productMarginLevelList
            const marginLevelAmountList = this.marginLevelAmountList
            const direction = this.$route.query.direction === 'buy' ? 1 : 2
            let v = 0
            v = marginLevelVolume_yz(amount, marginLevelAmountList, productMarginLevelList, this.product, this.relativeProduct, direction, this.YZ_rate)
            // console.log('amountToVolume_yz', v);
            return v
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.byAmount {
    background: #fff;
    padding-bottom: rem(40px);
}
.amountBox {
    padding-top: rem(33px);
    text-align: center;
    .currency {
        font-size: rem(30px);
        vertical-align: middle;
    }
    .amount {
        vertical-align: middle;
        display: inline-block;
        margin-left: rem(10px);
        width: rem(320px);
        height: rem(80px);
        position: relative;
        &::after {
            @include borderline();
            bottom: 0;
        }
        input {
            width: 100%;
            height: rem(80px);
            padding: 0;
            line-height: 1;
            text-align: center;
            color: #333;
            font-size: rem(60px);
            &:disabled {
                background: none;
            }
        }
    }
    .lot {
        padding-top: rem(10px);
        font-size: rem(20px);
        color: $muted;
    }
}
.sliderNum {
    margin: rem(60px) rem(80px) 0;
}
.assetsInfo {
    margin: rem(70px) rem(80px) 0;
    line-height: 1.5;
    font-size: rem(20px);
    .green {
        color: $green;
    }
    .red {
        color: $red;
    }
    .warn {
        color: $warn;
    }
}
</style>
