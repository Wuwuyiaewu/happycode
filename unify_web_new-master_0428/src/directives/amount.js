/**
 * 输入金额的指令
 * 只能输入数字，保留两位小数
 */
export default {
    bind: function (el, binding, vnode) {
        const vm = vnode.context
        el.handler = function ($event) {
            const val = $event.target.value
            const pattern = /[0-9]+[.]?(\d{1,2})?/g
            const matchStr = val.match(pattern)
            const newval = matchStr ? matchStr[0] : ''
            const validAmount = pattern.test(val) // 是否是有效的金额
            if (!validAmount) $event.target.value = newval
            vm[binding.value] = newval
            vm.$v && vm.$v[binding.value] && vm.$v[binding.value].$touch()
        }
        el.blurHandler = function ($event) {
            $event.target.type = 'text'
            let val = $event.target.value
            if (val.endsWith('.')) val = val.slice(0, val.length - 1)
            $event.target.value = val
            vm[binding.value] = val
            vm.$v && vm.$v[binding.value] && vm.$v[binding.value].$touch()
            setTimeout(() => {
                $event.target.type = 'number'
            }, 10)
        }
        el.addEventListener('input', el.handler, false)
        el.addEventListener('blur', el.blurHandler, false)
    },
    unbind: function (el) {
        el.removeEventListener('input', el.handler)
        el.removeEventListener('blur', el.blurHandler)
    }
}
