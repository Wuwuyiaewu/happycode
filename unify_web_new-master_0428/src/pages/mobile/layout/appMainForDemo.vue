<template>
    <section id='appMain' class='appMain'>
        <transition mode='out-in' name='routerView-fade'>
            <keep-alive :include='cachedViews'>
                <div class="wrap_product">
                    <router-view :key='$route.path' />
        <button @click="gotopr">gotopr</button>
                </div>
            </keep-alive>
        </transition>
        <product/>
        <!-- <my-iframe
            v-if='!isAPP'
            ref='homePage'
            class='homePageIframe'
            :class="{ 'hiddenPage': $route.name !== 'Home' }"
            page-name='homePage'
            :page-url='homePageSrc'
        /> -->
    </section>
</template>

<script>
import { isAPP } from '@m/base/appHybrid'
import iframe from '@m/components/iframe'
import ProductDetailForDemo from '@m/views/productDetail/productDetailForDemo.vue'
export default {
    name: 'AppMain',
    components: {
        myIframe: iframe,
        product:ProductDetailForDemo
    },
    data () {
        return {
            isAPP: isAPP
        }
    },
    computed: {
        cachedViews () {
            return this.$store.state.tagsView.cachedViews
        },
        userConfigInfo () {
            return this.$store.state.userConfigInfo
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo
        },
        customConfig () {
            return this.$store.state.customConfig
        },
        homePageSrc () {
            const uiPageList = this.$store.state.ix_baseInfo.companyInfo.uiPageList || {}
            const customConfig = this.customConfig
            let url = uiPageList.Home ? uiPageList.Home.url : ''
            if (!this.userLoginInfo.account_id && customConfig && customConfig.GuestHomeURL) url = customConfig.GuestHomeURL
            if (!url) {
                url = 'about:blank'
            }
            return url
        }
    },
    watch: {
        '$route.name' (newval) {
            if (this.homePageSrc) {
                this.$refs.homePage && this.$refs.homePage.routerChange(newval)
                if (newval == 'Home') {
                    this.$refs.homePage && this.$refs.homePage.configChange({
                        orColorType: this.userConfigInfo.type
                    })
                }
            }
        },
        homePageSrc (val) {
            this.$refs.homePage && this.$refs.homePage.setIframeUrl(val)
        }
    },
    methods:{
        gotopr(){
            if (!window.isPC) this.$router.push({ name: 'ProductDetailForDemo', params: { id: 553133 } })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.appMain {
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    // -webkit-overflow-scrolling: touch;
    .hiddenPage {
        position: absolute;
        z-index: -1;
        top: -100%;
        left: -100%;
        opacity: 0;
    }
    .homePageIframe {
        padding-bottom: rem(98px);
    }
    .wrap_product{
       
    }
}
</style>
