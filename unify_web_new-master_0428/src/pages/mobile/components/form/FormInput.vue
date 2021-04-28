<template>
    <div class='form-input-wrap'>
        <div class='input-wrap'>
            <div v-if='$slots.prefix' class='prefix'>
                <slot name='prefix'></slot>
            </div>
            <div class='flex-item'>
                <input
                    ref='input'
                    class='input'
                    :class='{ disabled: disabled }'
                    :disabled='disabled'
                    :maxlength='maxlength'
                    :name='name'
                    :readonly='readonly'
                    :type='inputType'
                    :value='(value !== "" && formatValue) ? formatValue(value) : value'
                    @blur='_onBlur'
                    @change='_onChange'
                    @focus='_onFocus'
                    @input='_onInput'
                />
                <div
                    v-if="['', null, undefined].includes(value)"
                    class='label'
                    :class='{ active: label && (isFocus || value) }'
                    @click='focus'
                >
                    {{ isFocus ? label : placeholder }}
                </div>
                <div v-else class='label not-empty'>
                    {{ label }}
                </div>
            </div>

            <van-icon v-if="clearable && value != ''" class='input-clear' name='clear' size='18' @click='_onClear' />
            <div v-if='$slots.append' class='append'>
                <slot name='append'></slot>
            </div>
            <div v-if="type === 'password' && showPassword" class='toggle-icon'>
                <i v-if='inputType === type' class='icon_icon_default' @click='_togglePWD'></i>
                <i v-else class='icon_icon_pressed' @click='_togglePWD'></i>
            </div>
        </div>
        <div class='bottom-line' :class='{ active: isFocus }'></div>
    </div>
</template>

<script>
export default {
    name: 'FormInput',
    componentName: 'FormInputaaa',
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
        placeholder: {
            type: String,
            default: ''
        },
        maxlength: {
            type: [Number, String],
            default: '32'
        },
        name: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        clearable: {
            type: Boolean,
            default: false
        },
        showPassword: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        formatValue: {
            type: Function,
            default: null // 默认为null，避免交互冲突
        }
    },
    data () {
        return {
            isFocus: false,
            inputType: this.type
        }
    },
    methods: {
        validate (trigger, value = this.value) {
            const { $options: { componentName }, validate: parentValidate } = this.$parent
            if (componentName !== 'FormItem') {
                return
            }
            parentValidate(trigger, value)
        },
        focus () {
            this.$refs.input.focus()
        },

        // focus/blur浏览器会多次重复触发，仅用input或change触发validate
        // 若非必要，最好仅使用input/change最佳
        _onInput (event) {
            this.$emit('input', event.target.value)
            this.validate('input', event.target.value)
        },
        _onChange (event) {
            this.$emit('change', event.target.value)
            this.validate('change', event.target.value)
        },
        _onFocus () {
            this.isFocus = true
            this.$emit('focus')
        },
        _onBlur (event) {
            this.isFocus = false
            this.$emit('blur')
            this.validate('blur', event.target.value)
        },

        _onClear () {
            this.$emit('input', '')
        },
        _togglePWD () {
            const mapTypes = {
                password: 'text',
                text: 'password'
            }
            mapTypes[this.inputType] && (this.inputType = mapTypes[this.inputType])
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.form-input-wrap {
    position: relative;
    width: 100%;
    background: #fff;
    padding: rem(50px) rem(28px) 0;
    box-sizing: border-box;
    height: rem(130px);
    overflow: hidden;
    .input-wrap {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        width: 100%;
        margin-bottom: rem(10px);
        .flex-item {
            position: relative;
            flex: 1;
        }

        .input:-webkit-autofill ~ .label {
            transform: scale(0.8) translateY(-300%);
        }

        .label {
            position: absolute;
            top: 50%;
            left: 0;
            display: block;
            font-size: rem(28px);
            font-weight: 300;
            color: rgba(196, 196, 196, 1);
            line-height: rem(30px);
            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(-50%);
            transform-origin: bottom left;
            &.active {
                transform: scale(0.8) translateY(-300%);
            }
            &.not-empty {
                transition: transform 0s;
                transform: scale(0.8) translateY(-300%);
            }
        }

        .input {
            width: 100%;
            border: 0;
            height: rem(75px);
            line-height: rem(40px);
            font-size: rem(28px);
            color: #333;
            text-indent: 0;
            font-size: rem(28px);
            box-shadow: 0 0 0px 1000px white inset;
            animation: resetBg forwards; //解决自动填充背景色(ios)
            filter: none !important; // 火狐输入框自动填充时黄色背景
            &:-webkit-autofill ~ .label {
                transition: transform 0s;
            }
            &.disabled {
                color: rgba(196, 196, 196, 1) !important;
            }
        }

        .input-clear {
            color: #bdbdbd;
        }

        .append {
            margin-left: rem(20px);
        }
        .toggle-icon {
            margin-left: rem(20px);
            i {
                font-size: rem(35px);
            }
        }
    }
    .bottom-line {
        margin: 0 rem(28px);
        bottom: 0;
        @include borderline();
        &.active {
            border-color: rgba(71, 127, 211, 1);
        }
    }
}

@keyframes resetBg {
    99% {
        background: #fff;
    }
}
</style>
