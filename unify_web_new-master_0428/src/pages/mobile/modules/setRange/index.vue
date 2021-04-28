<template>
    <van-collapse v-model='active' :accordion='true' class='m-setRange'>
        <van-collapse-item name='1'>
            <span slot='title' class='custom-title'>
                {{ $t('trade.maxRange') }}
            </span>
            <span slot='value' class='number' @click="_collect('最大偏移')">
                {{ value }}{{ $t('trade.point') }}
            </span>
            <div slot='right-icon' class='right'>
                <i :class="{ 'up': !!active,'down': !active }"></i>
            </div>
            <div>
                <div class='row'>
                    <div class='left'>
                        0
                    </div>
                    <van-slider
                        v-model='range'
                        active-color='#11B873'
                        bar-height='5px'
                        :max='max'
                        :min='0'
                        @input='change'
                    />
                    <div class='right'>
                        {{ max }}
                    </div>
                </div>
            </div>
            <div class='tip'>
                {{ $t('trade.maxRangeTip') }}
            </div>
        </van-collapse-item>
    </van-collapse>
</template>

<script>
import Vue from 'vue'
import { Collapse, CollapseItem, Slider } from 'vant'
Vue.use(Collapse).use(CollapseItem)
Vue.use(Slider)
export default {
    name: 'SetRange',
    props: ['value', 'max'],
    data () {
        return {
            active: '',
            range: ''
        }
    },
    watch: {
        value (val) {
            if (this.range != val) {
                this.range = val
            }
        }
    },
    created () {
        this.range = this.value
    },
    methods: {
        change (val) {
            this.$emit('updateRange', val)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-setRange {
    .custom-title {
        font-size: rem(28px);
    }
    .right {
        position: relative;
        margin-right: rem(18px);
        .down {
            &::after {
                content: "";
                position: absolute;
                top: 50%;
                margin-top: -rem(4px);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: rem(6px) rem(6px) 0 rem(6px);
                border-color: #333333 transparent transparent transparent;
            }
        }
        .up {
            &::after {
                content: "";
                position: absolute;
                top: 50%;
                margin-top: -rem(4px);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 rem(6px) rem(6px) rem(6px);
                border-color: transparent transparent #333333 transparent;
            }
        }
    }
    .number {
        color: #333;
        font-size: rem(28px);
        padding-right: rem(24px);
    }
    .row {
        position: relative;
        padding: 0 rem(70px) 0 rem(60px);
        .left,
        .right {
            position: absolute;
            top: -6px;
            font-size: rem(24px);
            color: #999999;
        }
        .left {
            left: 0;
        }
        .right {
            right: 0;
            margin-right: 0;
        }
        ::v-deep {
            .van-slider {
                .van-slider__bar {
                }
            }
        }
    }
    .tip {
        font-size: rem(20px);
        color: #999999;
        margin-top: rem(40px);
    }
}
</style>
