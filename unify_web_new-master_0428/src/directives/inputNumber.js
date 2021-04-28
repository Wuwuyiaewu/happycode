/**
 * 填写手机号，验证码
 * 只能输入数字
 */
export default {
    inserted: function (el, binding, vnode) {
        // console.log(binding, vnode);
        const vm = vnode.context
        el.handler = function ($event) {
            const newval = $event.target.value.replace(/[^0-9]/g, '')
            $event.target.value = newval
            vm[binding.expression] = newval
        }
        el.addEventListener('input', el.handler)
    },
    unbind: function (el) {
        el.removeEventListener('input', el.handler)
    }
}
