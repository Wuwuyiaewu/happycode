<template>
    <div class='wrapper'>
        <p v-if='value<min || value>max' class='errorFixedTip'>
            {{ $t('trade.tradevolumesOutScope',[min,max]) }}
        </p>
        <p
            v-else-if='volumeInvalid'
            class='errorFixedTip 11'
        >
            {{ $t('trade.volumeInvalid',{ volume:groupSymbol.volumes_step }) }}
        </p>
        <van-row class='pendingOrderSet' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ $t('trade.orderVolume') }}
                </p>
            </van-col>
            <van-col class='relative'>
                <transition name='fade'>
                    <ToolTip
                        v-if='toolTipVisible && marginPercent'
                        class='toolTipWrapper'
                    >
                        {{ $t('trade.marginPercent') }} {{ marginPercent }}%
                    </ToolTip>
                </transition>
                <StepperComp
                    v-model='value'
                    class='stepper'
                    :class="{ 'warn':value<min || value>max }"
                    :controlbtn='true'
                    :digits='getDecimalNum(groupSymbol.volumes_step)'
                    :max='max'
                    :min='min'
                    :step='groupSymbol.volumes_step'
                    @change='change'
                />
            </van-col>
        </van-row>
        <ul class='volumeSteps'>
            <li v-for='step in volumeSteps'>
                <a class='item' href='javascript:;' @click='addStep(step)'>
                    {{ step < 0 ? step:'+'+step }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDecimalNum, plus, divide, toFixed } from '@/utils/calculation'
import { volumeStepControl } from '@/store/ix_utils'
import StepperComp from '@m/components/stepper'
import ToolTip from '@m/components/toolTip'

export default {
    props: ['value', 'product', 'openMargin', 'feeAccountCurrency'],
    data () {
        return {
            warn: true,
            toolTipVisible: false,
        }
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo']),
        stepDigit () {
            return getDecimalNum(this.step)
        },
        groupSymbol () {
            return this.product.groupSymbol
        },
        min () {
            return this.groupSymbol.volumes_min
        },
        max () {
            return this.groupSymbol.volumes_max
        },
        volumeSteps () {
            const volumes_min = this.groupSymbol.volumes_min
            return volumeStepControl(this.value > 0 ? this.value : volumes_min, volumes_min)
        },
        // 保证金占比
        marginPercent () {
            const kybzj = this.assetAboutInfo.accountData.kybzj * 1
            const feeAccountCurrency = this.feeAccountCurrency * -1 || 0
            const openMargin = this.openMargin * 1 || 0
            const percent = kybzj ? (openMargin * 1 + feeAccountCurrency) / kybzj * 100 : 0
            return kybzj && percent > 0 ? toFixed(percent, 3) : '0.000'
        },
        // 手数不是步长的整数倍
        volumeInvalid () {
            const m = divide(this.value, this.groupSymbol.volumes_step)
            return getDecimalNum(m) > 0
        }

    },
    watch: {
        value (newval) {
            if (this.st) clearTimeout(this.st)
            this.toolTipVisible = true
            this.st = setTimeout(() => {
                this.toolTipVisible = false
            }, 2000)
        }
    },
    methods: {
        change (val) {
            this.$emit('input', val)
        },
        addStep (val) {
            let newval = plus(this.value * 1, val * 1)
            const volumes_min = this.groupSymbol.volumes_min
            const volumes_max = this.groupSymbol.volumes_max
            newval = Math.max(newval, volumes_min)
            newval = Math.min(newval, volumes_max)
            this.$emit('input', newval)
        },
        getDecimalNum
    },
    components: {
        StepperComp,
        ToolTip,
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.wrapper {
    align-items: center;
    line-height: 1.5;
    .title {
        line-height: rem(80px);
    }
}
.stepper {
    &.warn {
        color: $red;
    }
}
.volumeSteps {
    display: flex;
    text-align: right;
    justify-content: flex-end;
    margin-top: rem(30px);
    font-size: rem(24px);
    li {
        margin-left: rem(20px);
    }
    .item {
        display: inline-block;
        width: rem(120px);
        height: rem(40px);
        text-align: center;
        line-height: rem(40px);
        color: #333;
        background: #f9f9f9;
        border-radius: rem(6px);
    }
}
.toolTipWrapper {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
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
</style>
