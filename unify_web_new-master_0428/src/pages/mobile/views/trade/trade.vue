<template>
    <div class='tradeWrapper' :class='{ hasNoticeBar: adNotice && !noticeClosed }'>
        <div class='m-tradeNav'>
            <Tab
                ref='tabList'
                v-model='activeTab'
                class='tradeSortNav'
                :dot='true'
                line-height='0'
                line-width='0'
                :list='categoryList'
                title-active-color='#333'
                title-inactive-color='#333'
                @change='tabChange'
                @tabClick='tabClick'
            />
            <router-link class='searchIcon' tag='div' :to="{ name:'Search' }">
                <i class='icon_sousuo'></i>
            </router-link>
        </div>

        <!-- 跑马灯广告 -->
        <van-notice-bar
            v-if='adNotice && !noticeClosed'
            ref='vanNotice'
            class='notice'
            left-icon='volume-o icon_tongzhi'
            mode='closeable'
            @close='noticeClose'
        >
            <a
                v-if='adNotice.url'
                :href='adNotice.url'
                target='_blank'
                @click='openUrl(adNotice.url, $event)'
            >
                {{ adNotice.title }}
            </a>
            <div v-else>
                {{ adNotice.title }}
            </div>
        </van-notice-bar>
        <van-swipe
            ref='tradeSwiper'
            class='trade-swipe'
            :initial-swipe='activeTab'
            :lazy-render='true'
            :loop='false'
            :show-indicators='false'
            @change='swiperChange'
        >
            <van-swipe-item v-for='(comp, i) in categoryList' :key='comp.id'>
                <component
                    :is='comp.component'
                    :active-tab='activeTab'
                    :data='comp'
                    :index='i'
                    :tab-title='comp.title'
                />
            </van-swipe-item>
        </van-swipe>

        <ProductGuide v-if='productGuideVisible' />
    </div>
</template>

<script>
import { NoticeBar, Swipe, SwipeItem } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { openAdUrl } from '@/utils/appHybrid'
import Tab from '../../modules/tab'
import ProductGuide from '../../modules/productList/productGuide'
// import Position from './position/Index'
// import HotList from './hot/Index'
import ProductList from '../../modules/productList/productList'
// import Optional from '../../modules/optional/optional'
export default {
    name: 'TradeIndex',
    components: {
        [NoticeBar.name]: NoticeBar,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        // Optional,
        // HotList,
        ProductList,
        ProductGuide,
        Tab
    },
    data () {
        return {
            activeTab: 0,
            noticeClosed: false,
            productGuideVisible: false,
            noticeTimer: null
        }
    },
    computed: {
        ...mapState({
            product_category: state => state.ix_quote.product_category,
        }),
        ...mapGetters(['isExperience']),
        // tab分类列表
        categoryList () {
            const categoryArr = this.product_category.slice().filter(el => el.display)
            const newArr = categoryArr.map(el => {
                el['component'] = 'ProductList'
                return el
            })
            // 登录后才显示持仓tab
            // if (loginData) {
            //     newArr.unshift({ title: this.$t('router.position'), component: 'Position', code_ids: [] })
            // }
            return newArr
        },
        // activeCategory() {
        //     return this.categoryList && this.categoryList.length > 0 ? this.categoryList[this.activeTab] : []
        // },
        // activeComponent() {
        //     return this.activeCategory.component
        // },
        adNotice () {
            // 这里只能在头部显示一个跑马灯广告，不能显示多个，或者banner模块，会影响到tab切换的滚动条位置的效果，取跑马灯text的配置的第一条数据
            // const top = this.ad.top
            // if (!top || top.length === 0) return null
            // const item = top[0]
            // if (!item.uiComponent || item.uiComponent.length === 0) return null
            // return item.uiComponent[0]
        },
    },
    activated () {
        console.log('tradeIndex activated')
        // this.tabChange(this.activeTab, true)
        this.noticeClosed = false
        this.noticeTimer = window.setTimeout(() => {
            if (this.$refs.vanNotice) this.$refs.vanNotice.onClickIcon()
            this.noticeClose()
        }, 20000)
        window.setTimeout(() => {
            this.subscription()
        }, 0)
    },
    deactivated () {
        console.log('tradeIndex deactivated')
        this.noticeClosed = true
        if (this.noticeTimer) clearTimeout(this.noticeTimer)
    },
    created () {
        if (this.$route.query.tab) {
            this.activeTab = parseInt(this.$route.query.tab)
        }
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        const routeParams = this.$route.params
        window.setTimeout(() => {
            this.subscription()
            if (routeParams.first && this.isExperience) {
                const sourceParams = sessionStorage.getItem('sourceParams')
                sessionStorage.setItem('sourceParams', sourceParams.replace('fullEnteredDialog', `t${parseInt(Math.random() * 10000)}`))
                this.productGuideVisible = true
            }
        }, 0)
        // const loginData = getLoginData()
        // if (!loginData) this.$options.sockets.onmessage = this.wsMessage
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
        if (this.noticeTimer) clearTimeout(this.noticeTimer)
    },
    methods: {
        swiperChange (index) {
            this.activeTab = index
        },
        tabChange (index) {
            this.$refs.tradeSwiper.swipeTo(index, {
                immediate: true
            })
            window.setTimeout(() => {
                this.subscription()
            }, 0)
        },
        subscription () {
            this.$route.query.tab = -1
            this.$bus.$emit('UPDATE_SUB_PRODUCT_LIST')
        },
        noticeClose () {
            if (this.noticeTimer) {
                window.clearTimeout(this.noticeTimer)
            }
            this.noticeClosed = true
        },
        // 事件埋点
        tabClick (item, index) {
            this._collect(item.title)
        },
        // 打开广告链接
        openUrl (url, $event) {
            if (!url) return
            openAdUrl(url, $event)
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            let { msg_code, code, content, remark } = JSON.parse(evt.data)
            if (content && typeof content === 'string') content = JSON.parse(content)
            if (msg_code.toLowerCase() === 'InitProductInfo'.toLowerCase()) {
                // 收到产品列表后重新订阅产品报价
                if (code === '0000') {
                    setTimeout(() => {
                        if (this.$route.name == 'TradeIndex') {
                            this.tabChange(this.activeTab)
                        }
                    }, 600)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.tradeWrapper {
    //background: #fff;
    position: relative;
    padding-top: rem(95px);
    padding-bottom: rem(98px);
    height: 100%;
    &.hasNoticeBar {
        padding-top: rem(130px);
    }
    // .tabWrapper {
    //     position: relative;
    //     // height: 500px;
    // }
    .m-tradeNav {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background-color: #fff;
        padding-bottom: rem(10px);
        .tradeSortNav {
            ::v-deep {
                .van-tabs__wrap {
                    height: rem(96px);
                    padding-right: rem(90px);
                    .van-tab {
                        padding: 0;
                        text-align: left;
                        flex: none;
                        .text {
                            line-height: rem(90px);
                            font-size: rem(26px);
                            font-weight: 400;
                        }
                        .dot {
                            display: block;
                            width: rem(10px);
                            height: rem(10px);
                            background: rgba(60, 113, 228, 1);
                            border-radius: 50%;
                            margin: 0 auto;
                            margin-top: rem(-10px);
                            opacity: 0;
                            transform: scale(0);
                        }

                        &:first-child {
                            margin-left: rem(5px);
                        }
                        &.van-tab--active {
                            .text {
                                animation: zoomText 0.26s ease normal forwards;
                            }
                            .dot {
                                animation: zoomDot 0.26s ease normal forwards;
                            }
                        }
                    }
                    .van-tabs__line {
                        display: none;
                    }

                    @keyframes zoomText {
                        0% {
                            font-size: rem(24px);
                            font-weight: 400;
                        }
                        100% {
                            font-size: rem(40px);
                            font-weight: 700;
                        }
                    }
                    @keyframes zoomDot {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                }
            }
        }
        .searchIcon {
            font-size: rem(30px);
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: rem(-50px);
            color: #333;
            padding: rem(20px) rem(30px) rem(20px) rem(20px);
            background-color: #fff;
            &::before {
                content: "";
                position: absolute;
                top: 0;
                right: 100%;
                width: rem(60px);
                height: 100%;
                background: -webkit-linear-gradient(
                    right,
                    #fff,
                    rgba(255, 255, 255, 0)
                );
                pointer-events: none;
            }
        }
    }
    .trade-swipe {
        height: 100%;
        width: 100%;
    }
}

.notice {
    height: rem(50px);
    color: #477fd3;
    background-color: #edf4ff;
    position: absolute;
    left: 0;
    top: rem(88px);
    width: 100%;
    z-index: 1;
    ::v-deep {
        .van-notice-bar__right-icon {
            color: #a5b5cd;
        }
        .van-notice-bar__content {
            color: #477fd3;
            font-size: rem(24px);
            a {
                color: #477fd3;
                font-size: rem(24px);
            }
        }
    }
}
</style>
