import Vue from 'vue'
import store from './store'

Vue.mixin({
    computed: {
        ad () {
            const pageAds = store.state.ix_baseInfo.companyInfo.uiPageList || {}
            // console.log(pageAds)
            return pageAds[this.$route.name] || {}
        }
    }
})
