/*
 * @Description: 解决ios输入框失焦时页面高度问题
 * @Author: dawn
 * @Date: 2019-12-27 15:12:13
 * @LastEditors  : dawn
 * @LastEditTime : 2019-12-30 10:42:17
 */
export default {
    mounted () {
        document.body.addEventListener('focusout', function () {
            window.scrollTo(0, 0)
        })
    },
    destroyed () {
        document.body.removeEventListener('focusout', function () {
            window.scrollTo(0, 0)
        })
    }
}
