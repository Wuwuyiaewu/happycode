<template>
    <div class='byLot' :class='{ pc:isPC }'>
        <div class='lots'>
            <a
                v-for='item in lots'
                :key='item'
                class='lotNumItem'
                href='javascript:;'
                @click='setLot(item)'
            >
                {{ item }}{{ $t('trade.volumeUnit') }}
            </a>
        </div>
        <p v-if='groupSymbol.volumes_min>lotNum || groupSymbol.volumes_max<lotNum' class='errorFixedTip'>
            {{ $t('trade.tradevolumesOutScope') }}
            [{{ groupSymbol.volumes_min }}-{{ groupSymbol.volumes_max }}]
        </p>
        <p
            v-else-if='volumeInvalid'
            class='errorFixedTip'
        >
            {{ $t('trade.volumeInvalid',{ volume:groupSymbol.volumes_step }) }}
        </p>
        <div class='steeperBox'>
            <StepperComp
                v-model='lotNum'
                class='stepper'
                :controlbtn='true'
                :digits='getDecimalNum(groupSymbol.volumes_step)'
                :max='groupSymbol.volumes_max'
                :min='groupSymbol.volumes_min'
                :step='groupSymbol.volumes_step'
                @change='change'
            />
        </div>
        <AssetsInfo
            :active-color='activeColor'
            :bzj-warn='bzjWarn'
            :current-rate='currentRate'
            :margin-level='marginLevel'
            :open-margin='openMargin'
            :product='product'
            :symbol-code='symbolCode'
            :volume='lotNum'
        />
    </div>
</template>

<script>
import { Stepper } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { plus, minus, getDecimalNum, toFixed, divide } from '@/utils/calculation'
import { marginLevelCalculate } from '@/utils/bzj'
import mixin from './mixin'
import StepperComp from '@m/components/stepper'
import AssetsInfo from './assetsInfo'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'ByLot',
    components: {
        [Stepper.name]: Stepper,
        StepperComp,
        AssetsInfo
    },
    mixins: [pcMixin],
    mixins: [mixin],
    props: ['value', 'product', 'groupSymbol'],
    data () {
        return {
            currentRate: 0,
            step: 0.01, // +-步长
            max: 100,
            lotNum: '',
            lots: [0.1, 0.2, 0.5, 1, 2]
        }
    },
    computed: {
        // 保证金  (持仓手数+开仓手数总和的保证金 - 持仓手数的保证金)
        openMargin () {
            // calcOpenMargin({ groupSymbol, groupGet, positionList, groupSymbolMarginLeveMap, volume, direction, usdcnyRate = 1, usdhkdRate = 1 })
            // return this.openMarginFn(this.lotNum);
            const groupSymbol = this.groupSymbol
            if (!groupSymbol.id || !this.lotNum) return '0.00'
            return this.openMarginFn(this.lotNum)
        },
        // 手数不是步长的整数倍
        volumeInvalid () {
            const m = divide(this.lotNum, this.groupSymbol.volumes_step)
            return getDecimalNum(m) > 0
        }
    },
    created () {
        this.lotNum = this.value
        this.step = this.groupSymbol.volumes_step
        this.change(this.lotNum)

        // 处理快速下单
        // 最小手数为 0.01、0.1时，手数列表计算按【 最小手数 x1，x10，x50，x100，x200】
        // 最小手数为 1时，手数列表显示【最小手数 x1，x5，x10，x50，x100】
        const volumes_min = this.groupSymbol.volumes_min
        const baseVolumes = volumes_min >= 1 ? [1, 5, 10, 50, 100] : [1, 10, 50, 100, 200]
        this.lots = baseVolumes.map(el => volumes_min * el)

        // window['bylot'] = this;
    },
    methods: {
        // 当输入数字不是手数最小颗粒倍数时，在关闭数字键盘时自动跳转到离数字最近的可购买手数
        blur (e) {
            const target = e.target
            let val = target.value
            val = this.formatVolum(val)
            target.value = val
            this.$emit('input', val)
            this.lotNum = val
            this.$nextTick(() => {
                this.lotNum = val
            })
        },
        change (n) {
            this.$emit('input', n)
        },
        // 检查手数是否小于最小手数
        checkLot (n) {
            const volumes_min = this.groupSymbol.volumes_min
            const volumes_max = this.groupSymbol.volumes_max
            if (n < volumes_min) {
                n = volumes_min
            } else if (n > volumes_max) {
                n = volumes_max
            }
            return n
        },
        setLot (n) {
            this.lotNum = n
            this.$emit('input', n)
            this._collect(n + '手')
        },
        formatRate (rate) {
            this.currentRate = Math.min(Math.max(rate, 0), this.assetAboutInfo.accountData.kybzj)
        },
        getDecimalNum: getDecimalNum
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.byLot {
    background: #fff;
    padding-bottom: rem(40px);
}
.lots {
    padding: rem(50px) rem(30px) 0;
    display: flex;
    justify-content: center;
    .lotNumItem {
        width: rem(120px);
        height: rem(60px);
        text-align: center;
        line-height: rem(60px);
        color: $muted;
        background: #f9f9f9;
        border-radius: rem(30px);
        & + .lotNumItem {
            margin-left: rem(22px);
        }
    }
}
.errorFixedTip {
    position: absolute;
    top: rem(90px);
    left: 0;
    width: 100%;
    height: rem(50px);
    line-height: rem(50px);
    background: rgba(255, 240, 226, 1);
    color: #e3525c;
    text-align: center;
    font-size: rem(24px);
}

.steeperBox {
    position: relative;
    margin: rem(50px) auto 0;
    width: rem(400px);
    padding-bottom: rem(20px);

    &::after {
        @include borderline();
        bottom: 0;
        border-color: #e3e3e3;
    }
    .stepper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        background: #fff;
    }
    ::v-deep {
        .input {
            font-size: rem(60px);
            width: rem(220px);
        }
        .input::placeholder {
            font-size: rem(30px);
        }
    }
}
</style>
