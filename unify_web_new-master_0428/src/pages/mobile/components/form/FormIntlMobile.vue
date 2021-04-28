<template>
    <div class='form-mobile-wrap'>
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
            <IntlMobile
                slot='prefix'
                @change='onCodeChange'
                @closed='onClosed'
                @open='onOpen'
            />
        </FormInput>
    </div>
</template>

<script>
import FormInput from './FormInput'
import IntlMobile from './components/IntlMobile'

export default {
    name: 'FormIntlMobile',
    components: {
        FormInput,
        IntlMobile
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
        },
        intlCode: {
            type: [Number, String],
            default: ''
        }
    },
    data () {
        return {
            isCount: false
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
        handleOnInput (value) {
            this.$emit('input', value)
            this.validate('input', value)
        },
        handleOnChange (value) {
            this.$emit('change', value)
            this.validate('change', value)
        },
        handleOnFocus () {
            this.isFocus = true
            this.$emit('focus')
        },
        handleOnBlur (value) {
            this.isFocus = false
            this.$emit('blur')
            this.validate('blur', value)
        },
        onCodeChange (val) {
            this.$emit('update:intlCode', val)
        },
        onOpen () {
            this.$emit('open')
        },
        onClosed () {
            this.$emit('closed')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.form-mobile-wrap{
}
</style>
