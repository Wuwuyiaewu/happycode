<template>
    <div
        class='form-item form-item-select'
        :class="{ 'is-error': validateStatus==='error' }"
        :style='{ zIndex:zIndex }'
    >
        <div
            v-click-outside='closeDropdown'
            class='form-input-wrap'
        >
            <div class='input-wrap'>
                <div class='flex-item'>
                    <input
                        class='el-input__inner'
                        :disabled='disabled'
                        readonly
                        type='text'
                        :value='value'
                        @focus='openDropdown'
                    />
                    <div
                        class='label'
                        :class="{ 'not-empty':value }"
                    >
                        {{ label }}
                    </div>
                </div>
                <div class='append'>
                    <i class='van-icon van-icon-arrow-down'></i>
                </div>
            </div>
            <div class='bottom-line'></div>
            <!-- Select popover, show/hide based on select state. -->
            <div
                v-show='isOpen'
                class='el-select-dropdown-wrap'
            >
                <ul
                    aria-activedescendant='listbox-item-3'
                    aria-labelledby='listbox-label'
                    role='listbox'
                    tabindex='-1'
                >
                    <template v-if='isBank'>
                        <li
                            v-for='(d,i) in data'
                            id='listbox-item-0'
                            :key='d.code'
                            :class='{ selected: isSelected(d.name) }'
                            role='option'
                            @click='select(d,i)'
                        >
                            <i
                                class='bank-icons-sm'
                                :class="'bk-'+d.code"
                            ></i>
                            <span class='block truncate'>
                                {{ d.name }}
                            </span>
                        </li>
                    </template>
                    <template v-else>
                        <li
                            v-for='d in data'
                            id='listbox-item-0'
                            :key='d.code'
                            :class='{ selected: isSelected(d.text) }'
                            role='option'
                            @click='select(d)'
                        >
                            <span class='block truncate'>
                                {{ d.text }}
                            </span>
                        </li>
                    </template>
                    <!-- More options... -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import schema from 'async-validator'
export default {
    name: 'VueSelect',
    directives: {
        ClickOutside
    },
    props: {
        data: {
            type: Array,
            default: []
        },
        value: {
            type: String,
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
        prop: {
            type: String,
            default: ''
        },
        isBank: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        zIndex: {
            type: Number,
            default: 100
        }
    },
    data () {
        return {
            'isOpen': false,
            validateStatus: ''
        }
    },
    inject: ['rules', 'dispatch', 'model'],
    provide: function () {
        return {
            rule: this.rule
        }
    },
    computed: {
        rule () {
            return this.rules[this.prop] || []
        }
    },
    mounted () {
        if (this.prop) {
            this.dispatch('addField', this)
        }
    },
    methods: {
        isSelected (value) {
            return this.value === value
        },
        closeDropdown () {
            this.isOpen = false
        },
        openDropdown () {
            this.isOpen = true
        },
        select (value) {
            this.isOpen = false
            this.$emit('change', value)
            this.isBank ? this.validate('change', value.name) : this.validate('change', value.text)
        },
        async validate (trigger, value, allFormData = {}) {
            const {
                prop,
                rule
            } = this
            const matchRule = trigger ? rule.filter(item => item.trigger === trigger) : rule

            if (!matchRule.length) {
                return Promise.resolve()
            }

            const descriptor = {
                [prop]: matchRule
            }

            descriptor[prop] = descriptor[prop].map(item => {
                const {
                    trigger,
                    ...others
                } = item
                return others
            })

            const validator = new schema(descriptor)

            return validator.validate({
                ...allFormData,
                [prop]: await this._getValue()
            }, {
                first: true
            }).then(result => {
                this.validateStatus = ''
                return result
            }).catch(({
                errors,
                fields
            }) => {
                this.validateStatus = 'error'
                return Promise.reject({
                    errors,
                    fields
                })
            })
        },

        _getValue () {
            return new Promise((resolve, reject) => {
                this.$nextTick(() => {
                    const {
                        model,
                        prop
                    } = this
                    const value = prop.split('.').reduce((data, key) => {
                        return data[key]
                    }, model)
                    resolve(value)
                })
            })
        },

        // 清除当前校验状态
        clearValidate () {
            this.validateStatus = ''
        }
    }
}
</script>

<style lang="scss"
       scoped>
    @import "@m/sass/mixin.scss";

    .form-item-select {
        position: relative;
        z-index: 100;

        .form-input-wrap {
            position: relative;
            width: 100%;
            background: #fff;
            padding: 0.66667rem 0.37333rem 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 1.73333rem;
        }

        .input-wrap {
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            width: 100%;
            margin-bottom: 0.13333rem;

            .flex-item {
                flex: 1;
            }
        }

        input {
            width: 100%;
            cursor: pointer;
            border: 0;
            height: 1rem;
            line-height: 0.53333rem;
            font-size: 0.37333rem;
            color: #333;
            text-indent: 0;
            font-size: 0.37333rem;
            -webkit-box-shadow: 0 0 0px 1000px white inset;
            box-shadow: 0 0 0px 1000px white inset;

        }

        .label {
            position: absolute;
            top: 50%;
            left: 0;
            display: block;
            font-size: 0.37333rem;
            font-weight: 300;
            color: #c4c4c4;
            line-height: 0.4rem;
            -webkit-transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
            transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            -webkit-transform-origin: bottom left;
            transform-origin: bottom left;

            &.not-empty {
                transform: scale(0.8) translateY(-300%);
                transition: transform 0s;
            }
        }

        .bottom-line {
            margin: 0 0.37333rem;
            bottom: 0;
            position: absolute;
            z-index: 1;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            content: '';
            pointer-events: none;
            right: 0;
            left: 0;
            border-bottom: 1px solid #ebedf0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }

        .el-select-dropdown-wrap {
            background-color: #fff;
            position: absolute;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);
            right: 0.37333rem;
            left: 0.37333rem;

            ul {
                max-height: 224px;
                overflow-x: hidden;
                overflow-y: auto;
                @include scroll();
                outline: none;
                padding-bottom: 20px;
                li {
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

                    span {
                        margin-left: 0.13333rem;
                    }

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
</style>
