import { Locale, Button, Toast, Dialog, Loading, Sticky, Tab, Tabs, DropdownMenu, DropdownItem, NoticeBar, Tag, Popup, Stepper, Cell, CellGroup, Col, Row, Search, Icon, Form, ActionSheet } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import { i18n } from '@m/lang'

if (localStorage.getItem('lang') === 'en-US') {
    Locale.use('en-US', enUS)
}
const components = [Button, Toast, Dialog, Form, Loading, Sticky, NoticeBar, Tag, Popup, Stepper, Search, Icon, ActionSheet]
const install = function (Vue) {
    components.forEach(component => {
        Vue.use(component)
    })
    Vue.use(Toast)
    Vue.use(Tab).use(Tabs)
    Vue.use(Col).use(Row)
    Vue.use(DropdownMenu).use(DropdownItem)
    Vue.use(Cell).use(CellGroup)

    Toast.setDefaultOptions('loading', { forbidClick: true, duration: 0 })
    Vue.prototype.$loading = Toast.loading
    Vue.prototype.$alert = function (message) {
        return Dialog.alert({
            title: i18n.t('tip'),
            message
        })
    }
}
export default install
