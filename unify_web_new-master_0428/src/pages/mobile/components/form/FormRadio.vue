<template>
    <div class='form-radio-wrap'>
        <div class='label'>
            {{ label }}
        </div>
        <van-radio-group direction='horizontal' :value='value'>
            <van-radio
                v-for=' radio in options'
                :key='radio.code'
                :name='radio.code'
                @click='handleOnClick(radio.code)'
            >
                {{ radio.title }}
                <template #icon='props'>
                    <span class='radioIcon' :class="props.checked ? 'icon_xuanzhong' : 'icon_weixuanzhong'"></span>
                </template>
            </van-radio>
        </van-radio-group>

        <div class='borderLine'></div>
    </div>
</template>

<script>
import { Toast, Icon, RadioGroup, Radio } from 'vant'

export default {
    name: 'FormRadio',
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: []
        }
    },
    methods: {
        handleOnClick (value) {
            this.$emit('input', value)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.form-radio-wrap {
    position: relative;
    width: 100%;
    background: #fff;
    padding: rem(50px) rem(28px) 0;
    box-sizing: border-box;
    // height: rem(120px);
    .label {
        font-size: rem(20px);
        font-weight: 300;
        color: rgba(196, 196, 196, 1);
        line-height: rem(36px);
    }
    .van-radio-group {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: rem(75px);
        ::v-deep {
            .van-radio {
                flex: 0 0 50%;
                margin: 0;
            }
            .van-radio__icon {
                font-size: 0;
                .radioIcon {
                    font-size: rem(28px);
                    &.icon_xuanzhong {
                        color: $primary;
                    }
                }
            }
            .van-radio__label {
                font-size: rem(28px);
            }
        }
    }
    .borderLine {
        margin: 0 rem(28px);
        bottom: 0;
        @include borderline();
        &.active {
            border-color: rgba(71, 127, 211, 1);
        }
        &.error {
            border-color: #ff6c6c;
        }
    }
}
</style>
