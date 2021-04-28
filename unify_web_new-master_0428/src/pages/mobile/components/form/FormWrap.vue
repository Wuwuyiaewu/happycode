<template>
    <div class='form-wrap'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'FormWrap',
    componentName: 'FormWrap',
    provide: function () {
        return {
            rules: this.rules,
            dispatch: this.dispatch,
            model: this.model
        }
    },
    props: {
        rules: {
            type: Object,
            default: () => ({})
        },
        model: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            fields: [],
            originalModel: '{}'
        }
    },
    created () {
        this.originalModel = JSON.stringify(this.model)
    },
    methods: {
        validate (options) {
            //  顺序校验，直到有第一个验证未通过即停止校验
            return this._sequenceValidate(options)

            // 同时校验，所有校验结果同时返回
            // return this._simultaneouslyalidate(options)
        },

        /**
         * 校验部分字段
         * related 决定是否导入其他数据导入进该字段验证处理器
         */
        async validateField (props = [], options) {
            if (typeof props === 'string') {
                props = [props]
            }
            const { related = false } = options || {}
            for (const filed of this.fields) {
                if (props.includes(filed.prop)) {
                    await filed.validate('', this._getValue(filed.prop), related ? this.model : {})
                }
            }
            return Promise.resolve(true)
        },

        _getValue (keyStr) {
            const { model } = this
            const value = keyStr.split('.').reduce((data, key) => {
                return data[key]
            }, model)
            return value
        },

        //  顺序校验，遇到第一个错误验证即停止校验，不再继续校验
        async _sequenceValidate (options) {
            const { related = false } = options || {}
            for (const filed of this.fields) {
                await filed.validate('', this._getValue(filed.prop), related ? this.model : {})
            }
            return Promise.resolve(true)
        },

        // 同时校验，所有校验结果同时返回
        async _simultaneouslyalidate (options) {
            const { related = false } = options || {}
            const result = {
                errors: [],
                fields: {}
            }
            const validateArr = await Promise.allSettled(this.fields.map(filed => filed.validate('', this._getValue(filed.prop), related ? this.model : {})))
            validateArr.forEach(item => {
                if (item.status === 'rejected') {
                    result.errors.push(...item.reason.errors)
                    Object.assign(result.fields, item.reason.fields)
                }
            })

            if (!result.errors.length) {
                return Promise.resolve(true)
            }
            return Promise.reject(result)
        },

        dispatch (eventName, field) {
            switch (eventName) {
                case 'addField': {
                    this.fields.push(field)
                }
            }
        },

        // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        resetFields () {
            this.fields.forEach(field => field.clearValidate())
            Object.assign(this.model, JSON.parse(this.originalModel))
        }
    }
}
</script>
