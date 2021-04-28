<template>
    <div
        v-if='selfSymbolListFinish'
        class='tradeWrapper'
        :class='{ hasNoticeBar: adNotice && !noticeClosed }'
        :data-activeId='$store.state.ix_quote.product_activatedId'
    >
        <div class='m-tradeNav'>
            <div class='emit-search'>
                <label>
                    <van-icon name='search' />
                    <input :placeholder="$t('search.placeholder')" type='text' @focus='focusEvent' />
                </label>
                <!-- <router-link class="searchIcon" :to="{name:'Search'}" tag="div">
                    <i class="icon_sousuo"></i>
                </router-link>-->
            </div>
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
        </div>
        <component
            :is='comp.component'
            v-for='(comp, i) in categoryList'
            v-show='i==activeTab'
            :key='comp.id'
            :active-tab='activeTab'
            class='tabContent'
            :data='comp'
            :index='i'
            :tab-title='comp.title'
            @search='focusEvent'
        />
    </div>
</template>

<script>
import { NoticeBar, Swipe, SwipeItem } from 'vant'
import { mapState } from 'vuex'
import { openAdUrl } from '@/utils/appHybrid'
import Tab from '@m/modules/tab'
// import Position from './position/Index'
// import HotList from './hot/Index'
import ProductList from '@m/modules/productList/productList'
import Optional from '@m/modules/optional/optional'
export default {
    name: 'TradeIndex',
    components: {
        [NoticeBar.name]: NoticeBar,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        Optional,
        // HotList,
        ProductList,
        Tab
    },
    data () {
        return {
            activeTab: 0,
            noticeClosed: false,
            noticeTimer: null
        }
    },
    computed: {
        ...mapState({
            positionList: state => state.ix_user.postionList,
            product_map: state => state.ix_quote.product_map,
            product_category: state => state.ix_quote.product_category,
            selfSymbolList: state => state.selfSymbolList,
            selfSymbolListFinish: state => state.selfSymbolListFinish,
        }),
        // tab分类列表
        categoryList () {
            const categoryArr = this.product_category.slice().filter(el => el.display)
            const newArr = categoryArr.map(el => {
                el['component'] = 'ProductList'
                return el
            })
            // 自选
            if (window.isPC) {
                newArr.unshift({
                    title: this.$t('router.selfSymbol'),
                    component: 'Optional',
                    list: this.optinalList,
                    display: true,
                    activeTab: this.activeTab,
                    index: 0,
                    tabTitle: '',
                    id: 'bb7e0a0b5c8f495fbe4ee'
                })
            }
            return newArr
        },
        optinalList () { // 自选产品列表
            const defaultList = this.selfSymbolList.slice()
            if (defaultList.length === 0) return []

            const newList = []
            defaultList.forEach(el => {
                const item = this.product_map[String(el.symbolId)]
                if (!item) return false
                const inPosition = this.positionList.find(position => {
                    return parseInt(position.symbol) === parseInt(el.symbolId) || position.symbol === item.groupSymbol.name
                })
                el.inPosition = inPosition
                const newItem = Object.assign({}, item, { selfSymbol: el })
                if (item) newList.push(newItem)
            })
            return newList
        },
        activeCategory () {
            return this.categoryList && this.categoryList.length > 0 ? this.categoryList[this.activeTab] : {}
        },
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
    watch: {
        selfSymbolListFinish: {
            immediate: true,
            handler: function (newval) {
                console.log('selfSymbolListFinish', newval)
                if (newval && this.selfSymbolList.length === 0 && this.activeTab === 0) {
                    this.activeTab++
                }
            },
        }
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
        window.setTimeout(() => {
            this.subscription()
        }, 0)
        // const loginData = getLoginData()
        // if (!loginData) this.$options.sockets.onmessage = this.wsMessage
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
        if (this.noticeTimer) clearTimeout(this.noticeTimer)
    },
    methods: {
        focusEvent () {
            // debugger
            this.$emit('search', true)
        },
        swiperChange (index) {
            this.activeTab = index
        },
        tabChange (index) {
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
@import "~@pc/sass/mixin.scss";
.tradeWrapper {
    //background: #fff;
    position: relative;
    padding-top: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.hasNoticeBar {
        padding-top: rem(130px);
    }
    .tabContent {
        flex: 1;
        background: #fff;
        overflow-y: auto;
    }
    .m-tradeNav {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background-color: #fff;
        padding-bottom: rem(10px);
        .emit-search {
            padding: 15px 15px 0;
            label {
                position: relative;
                i {
                    position: absolute;
                    z-index: 1;
                    font-size: 16px;
                    color: #787b86;
                    left: 9px;
                    top: 8px;
                }
                input {
                    display: block;
                    border: 1px solid #ecedf2;
                    border-radius: 2px;
                    height: 30px;
                    line-height: 30px;
                    width: 100%;
                    padding-left: 33px;
                }
            }

        }
        .tradeSortNav {
            ::v-deep {
                .van-tabs__wrap {
                    height: rem(96px);
                    padding-right: 15px;
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
            // font-size: rem(30px);
            // position: absolute;
            // right: 0;
            // top: 50%;
            // margin-top: rem(-50px);
            // color: #333;
            // padding: rem(20px) rem(30px) rem(20px) rem(20px);
            // background-color: #fff;
            // &::before {
            //     content: "";
            //     position: absolute;
            //     top: 0;
            //     right: 100%;
            //     width: rem(60px);
            //     height: 100%;
            //     background: -webkit-linear-gradient(
            //         right,
            //         #fff,
            //         rgba(255, 255, 255, 0)
            //     );
            //     pointer-events: none;
            // }
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
            @media screen and (min--moz-device-pixel-ratio:0) {
                .emit-search{
                    label {
                        i{
                            top:18px !important;
                        }
                    }
                }

}
</style>
