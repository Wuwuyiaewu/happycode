/**
 * 填写姓名的指令
 * 只能输入中文
 */
export default {
    inserted: function (el, binding, vnode) {
        // console.log(binding, vnode);
        const vm = vnode.context
        el.handler = function ($event) {
            const newval = $event.target.value.replace(/[^\u4e00-\u9fa5]/g, '')
            $event.target.value = newval
            vm[binding.value] = newval
            vm.$v[binding.value] && vm.$v[binding.value].$touch()
        }
        el.addEventListener('input', el.handler)
    },
    unbind: function (el) {
        el.removeEventListener('input', el.handler)
    }
}
