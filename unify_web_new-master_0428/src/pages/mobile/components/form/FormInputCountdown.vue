<template>
    <div class='form-input-countdown-wrap'>
        <FormInput
            :clearable='clearable'
            :label='label'
            :maxlength='maxlength'
            :name='name'
            :placeholder='placeholder'
            :type='type'
            :value='value'
            @blur='handleOnBlur'
            @change='handleOnChange'
            @focus='handleOnFocus'
            @input='handleOnInput'
        >
            <Countdown slot='append' @click='handleOnClick' />
        </FormInput>
    </div>
</template>

<script>
import FormInput from './FormInput'
import Countdown from './components/Countdown'

export default {
    name: 'FormInputCountdown',
    components: {
        FormInput,
        Countdown
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
        placeholder: {
            type: String,
            default: ''
        },
        maxlength: {
            type: String,
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
        }
    },
    data () {
        return {
            isCount: false
        }
    },
    methods: {
        handleOnInput (value) {
            this.$emit('input', value)
        },
        handleOnChange (value) {
            this.$emit('change', value)
        },
        handleOnFocus () {
            this.isFocus = true
            this.$emit('focus')
        },
        handleOnBlur () {
            this.isFocus = false
            this.$emit('blur')
        },
        handleOnClick (callback) {
            this.$emit('getCheckCode', (a) => {
                callback()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.form-input-countdown-wrap {
}
</style>
