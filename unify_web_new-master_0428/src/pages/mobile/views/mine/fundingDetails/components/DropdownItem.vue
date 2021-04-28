<template>
    <van-dropdown-item ref='dropdownItem' class='dropdown-item' :title='title' @closed='onClosed'>
        <div slot='title'>
            <slot name='title'></slot>
        </div>
        <div class='content'>
            <div v-for='(option, i) in options' :key='i'>
                <DropdownOptions v-model='localValues[i]' :option='option' @change='onChange'>
                    <div v-if="$slots['append_item_' + (i + 1)]" slot='append'>
                        <slot :name="'append_item_' + (i + 1)"></slot>
                    </div>
                </DropdownOptions>
            </div>
        </div>
        <div class='btns'>
            <van-button block class='button' type='default' @click='onReset'>
                {{ $t('fundingDetails.resetBtn') }}
            </van-button>
            <van-button block class='button confirm' type='info' @click='onConfirm'>
                {{ $t('fundingDetails.confirmBtn') }}
            </van-button>
        </div>
    </van-dropdown-item>
</template>

<script>
import DropdownOptions from './DropdownOptions'
export default {
    name: 'DropdownItem',
    components: {
        DropdownOptions
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            localValues: [],
        }
    },
    watch: {
        value (val) {
            if (JSON.stringify(val) === JSON.stringify(this.localValues)) {
                return
            }
            this.localValues = JSON.parse(JSON.stringify(this.value))
        }
    },
    created () {
        this.localValues = JSON.parse(JSON.stringify(this.value))
    },
    methods: {
        onReset () {
            this.$emit('reset')
        },
        onConfirm () {
            this.$refs.dropdownItem.toggle(false)
            this.$emit('confirm', this.localValues)
        },
        onChange (option) {
            this.$emit('input', this.localValues)
            this.$emit('change', option)
        },
        onClosed () {
            this.localValues.splice(0, this.localValues.length, ...JSON.parse(JSON.stringify(this.value)))
            this.$emit('closed')
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.dropdown-item {
    ::v-deep {
        .van-dropdown-item__content {
            padding: rem(29px) 0 rem(42px);
            box-sizing: border-box;
            background: #fff;
        }
    }

    .btns {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        .button {
            flex: 0 0 rem(335px);
            height: rem(80px);
            border: 0;
            &:first-child {
                color: #477fd3;
                margin-right: rem(25px);
                background: rgb(243, 248, 255);
            }
            &.confirm {
                background: #497fd3;
            }
        }
    }
}
</style>
