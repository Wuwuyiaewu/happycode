<template>
    <div>
        <van-row
            v-if="currency!='CNY' && optionList.length>1"
            v-click-outside='closeDropdown'
            class='estimated-currency'
            justify='space-between'
            type='flex'
        >
            <van-col span='12'>
                {{ $t('form.title.amountTo') }}：
                <van-icon name='question' @click='showDialog' />
            </van-col>
            <van-col
                class='alignRgiht'
                span='12'
                @click='openDropdown'
            >
                <span v-if='!currencyVal'>
                    {{ $t('label.placeholderEntryCurrency') }}
                </span>
                <span v-else>
                    <i class='mainColor'>
                        {{ transAmount }}
                    </i>
                    {{ $te('trade.'+currencyVal)?$t('trade.'+currencyVal):currencyVal }}
                </span>
                <van-icon v-if='optionList.length!==2' name='arrow-down' />
            </van-col>
            <div v-show='isOpen' class='currency-wrap'>
                <ul>
                    <li
                        v-for='(item,index) in optionList'
                        :key='index'
                        :class='{ selected: isSelected(item) }'
                        @click='select(item,index)'
                    >
                        {{ item }}
                    </li>
                </ul>
            </div>
        </van-row>
    </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
    name: 'CurrencySelect',
    directives: {
        ClickOutside
    },
    props: {
        optionList: {
            type: Array,
            default: []
        },
        currency: {
            type: String,
            default: ''
        },
        currencyVal: {
            type: String,
            default: ''
        },
        transAmount: {
            type: String,
            default: ''
        },
        isPC: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isOpen: false
        }
    },
    methods: {
        isSelected (value) {
            return this.currencyVal === value
        },
        closeDropdown () {
            this.isOpen = false
        },
        openDropdown () {
            // debugger
            if (this.isPC) {
                this.isOpen = true
            } else {
                this.$emit('sheet', true)
            }
        },
        showDialog () {
            this.$emit('dialog', true)
        },
        select (value, i) {
            this.isOpen = false
            this.$emit('change', value, i)
        },
    }
}
</script>

<style lang="scss" scoped>
.estimated-currency {
    position: relative;
    .van-col {
        width: auto;
        float: none;
        &:first-child {
            white-space: nowrap;
        }
    }
    .alignRgiht{
        cursor: pointer;
    }
}
.currency-wrap{
    position: absolute;
    background-color: #fff;
    width: 100%;
    top: 27px;
    box-shadow: 0px 0px 40px 0px #E6E6E6;
    z-index: 10;
    ul{
        li{
            font-size: 14px;
            padding: 0 20px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
            &.selected {
                background-color: #f5f7fa;
                color: #409eff;
                font-weight: 700;
            }
            &:hover {
                background-color: #f5f7fa;
            }
        }
    }
}
</style>
