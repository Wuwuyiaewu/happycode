<template>
    <div class='form-item' :class="{ 'is-error': validateStatus==='error' }">
        <slot></slot>
    </div>
</template>

<script>
import schema from 'async-validator'

export default {
    name: 'FormItem',
    componentName: 'FormItem',
    inject: ['rules', 'dispatch', 'model'],
    provide: function () {
        return {
            rule: this.rule
        }
    },
    props: {
        prop: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            validateStatus: ''
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
        // value暂时不用
        async validate (trigger, value, allFormData = {}) {
            const { prop, rule } = this
            const matchRule = trigger ? rule.filter(item => item.trigger === trigger) : rule

            if (!matchRule.length) {
                return Promise.resolve()
            }

            const descriptor = {
                [prop]: matchRule
            }

            descriptor[prop] = descriptor[prop].map(item => {
                const { trigger, ...others } = item
                return others
            })

            const validator = new schema(descriptor)

            return validator.validate({ ...allFormData, [prop]: await this._getValue() }, { first: true }).then(result => {
                this.validateStatus = ''
                return result
            }).catch(({ errors, fields }) => {
                this.validateStatus = 'error'
                return Promise.reject({ errors, fields })
            })
        },

        _getValue () {
            return new Promise((resolve, reject) => {
                this.$nextTick(() => {
                    const { model, prop } = this
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
        },
    }
}
</script>

<style lang="scss">
.form-item {
    &.is-error {
        .bottom-line {
            border-color: #ff6c6c !important;
        }
    }
}
</style>

<style lang="scss" scoped>
.form-item {
}
</style>
