<template>
    <div class='warpScroll'>
        <slot name='top'></slot>
        <div v-if="data.tagDiplay == '3' && data.code_ids.length>0" class='titleBar'>
            <span class='item'>
                {{ $t('trade.nameCode') }}
            </span>
            <span class='item'>
                {{ $t('trade.sellPrice') }}
            </span>
            <span class='item'>
                {{ $t('trade.buyPrice') }}
            </span>
        </div>
        <div ref='scrollList' class='scrollList'>
            <template v-if="data.tagDiplay == '3' && data.code_ids.length>0">
                <ProductItem
                    v-for='(item,index) in showCodeList'
                    :key='data.id+item+index'
                    :code-id='item'
                    :data-symbolid='item'
                    :tab-title='tabTitle'
                    @disableTip='showDisableTip=true'
                />
            </template>
            <template v-if="data.tagDiplay == '1'">
                <template v-if='data.tagsList.length>0'>
                    <ProductModule
                        v-for='(tag,index) in data.tagsList'
                        :key='tag.id'
                        :data='tag'
                        :display='data.tagDiplay'
                        :index='index'
                        :module-id='data.id'
                        :tab-title='tabTitle'
                    />
                </template>
            </template>
            <template v-else-if="data.tagDiplay == '2'">
                <van-collapse v-if='data.tagsList.length>0' v-model='activeNames' @change='changeShowSymbol'>
                    <template v-for='(tag,index) in data.tagsList'>
                        <van-collapse-item
                            v-if='tag.code_ids.length>0'
                            :key='tag.id'
                            :border='false'
                            :name='index.toString()'
                            :title='tag.name'
                        >
                            <ProductModule
                                :data='tag'
                                :display='data.tagDiplay'
                                :index='index'
                                :module-id='data.id'
                                :tab-title='tabTitle'
                            />
                        </van-collapse-item>
                    </template>
                </van-collapse>
            </template>
        </div>
        <slot name='bottom'></slot>
        <DisableTip :show.sync='showDisableTip' />
    </div>
</template>

<script>

import { debounce } from '@/store/ix_utils'
import { mapState, mapActions } from 'vuex'
import ProductItem from './productItem'
import ProductModule from './productModule'
import { Collapse, CollapseItem } from 'vant'
import DisableTip from './disableTip'
export default {
    name: 'SymbolList',
    components: {
        ProductModule,
        ProductItem,
        DisableTip,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
    },
    data () {
        return {
            activeNames: ['0'],
            optimizeSub: null,
            showCodeList: [],
            page: {
                pageSize: 50,
                start: 0,
                total: 0,
                lock: false
            }, // 保存分页信息
            scrollTop: 0,
            showDisableTip: false
        }
    },
    computed: {
        ...mapState({
            subSymbolList: state => state.ix_quote.subscription_proList,
        })
    },
    props: {
        data: {
            type: Object,
            default () {
                return {
                    tagsList: [],
                    code_ids: [],
                    tagDiplay: 1
                }
            }
        },
        tabTitle: {
            type: String
        }
    },
    mounted () {
        this.optimizeSub = debounce(this.updateSubSymbol, 200) // 防抖
        // 绑定滚动事件
        this.$refs.scrollList.addEventListener('scroll', (ev) => {
            this.optimizeSub('scroll', ev)
            this.loadMore()
        })
        // //绑定板块切换emit
        this.$bus.$on('UPDATE_SUB_PRODUCT_LIST', () => {
            console.log('UPDATE_SUB_PRODUCT_LIST')
            this.updateSubSymbol()
        })
        // 如果是列表模式，前端采取分页加载的方式
        if (this.data.tagDiplay == '3') {
            this.page.total = this.data.code_ids.length
            this.getShowData()
        }
        // this.updateSubSymbol()
    },
    deactivated () {
        this.scrollTop = this.$refs.scrollList.scrollTop
    },
    activated () {
        this.$refs.scrollList.scrollTop = this.scrollTop
    },
    methods: {
        // ...mapActions({
        //     symoblCanTradeQuote: 'ix_baseInfo/symoblCanTradeQuote'
        // }),
        // symbolMayTrade(arr) {
        //     const promiseArr = []
        //     arr.forEach(item => {
        //         promiseArr.push(this.symoblCanTradeQuote(item))
        //     });
        //     Promise.all(promiseArr)
        //         .then(res => {
        //             this.update_groupsymbol_maytrade(res)
        //         })
        // },
        checkVisible (el) {
            if (!el) {
                return false
            }
            if (el.style.display === 'none' || (el.offsetParent === null && el.style.position !== 'fixed')) {
                return false
            } else {
                const { bottom, top, left, right } = el.getBoundingClientRect()
                const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
                const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth)
                return !(bottom < 0 || top - viewHeight >= 0) && (parseInt(left) >= 0 && parseInt(right) <= viewWidth)
            }
        },
        updateSubSymbol () {
            // 1、判断自己是否在页面可见
            const ele = this.$refs.scrollList
            let startIndex = false
            let endIndex = false
            let _subSymbol = []
            // 父元素可见
            if (this.checkVisible(ele)) {
                // 元素可见处理订阅问题
                const dataList = [...ele.querySelectorAll('[data-symbolid]')]
                for (let i = 0; i < dataList.length; i++) {
                    const _visable = this.checkVisible(dataList[i])
                    if (startIndex === false && _visable) {
                        startIndex = i
                    }
                    if (startIndex !== false && endIndex === false && !_visable) {
                        endIndex = i - 1
                    }
                    if (i === dataList.length - 1) {
                        if (startIndex === false) {
                            startIndex = i
                        }
                        if (endIndex === false) {
                            endIndex = i
                        }
                    }
                    if (startIndex !== false && endIndex !== false) {
                        break
                    }
                }
                const addLength = Math.ceil((endIndex - startIndex) / 2)
                // 往前多订阅半屏产品，往后多订阅半屏产品
                _subSymbol = dataList.splice((startIndex - addLength > 0 ? startIndex - addLength : 0), 2 * (endIndex - startIndex) || 1).map((item) => (parseInt(item.dataset.symbolid)))

                _subSymbol = [...new Set(_subSymbol)]
                if (this.subSymbolList.join('') != _subSymbol.join('')) {
                    // if (_subSymbol.length > 0) {
                    //     this.symbolMayTrade(_subSymbol)
                    // }
                    console.log(_subSymbol)
                    this.$ws.send_addSubscription_proList(_subSymbol)
                }
            }
        },
        loadMore () {
            const el = this.$refs.scrollList
            if (this.page.lock) {
                return
            }
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 300) {
                this.page.lock = true
                this.getShowData()
            }
        },
        getShowData () {
            if (this.page.start > this.page.total) {
                return
            }
            const _data = this.data.code_ids.slice(this.page.start, this.page.start + this.page.pageSize)
            this.showCodeList = this.showCodeList.concat(_data)
            this.page.start += this.page.pageSize
            this.$nextTick(() => {
                this.page.lock = false
                this.optimizeSub('scroll')
            })
        },
        changeShowSymbol () {
            this.optimizeSub('scroll')
        }

    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.warpScroll {
    height: 100%;
    padding-bottom: rem(10px);
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .scrollList {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        overflow: auto;
        @include scroll();
        -webkit-overflow-scrolling: touch;
        z-index: 1;
        ::v-deep {
            .van-collapse-item {
                .van-collapse-item__title {
                    padding: 0 rem(30px);
                    font-size: rem(30px);
                    font-weight: 500;
                    padding-top: rem(28px);
                    padding-bottom: rem(17px);
                    color: #595959;
                }
                .van-collapse-item__content {
                    padding: 0;
                }
                .van-cell__right-icon {
                    color: #595959;
                }
            }
        }
    }
    .titleBar {
        color: $muted;
        background-color: #fff;
        height: rem(60px);
        line-height: rem(60px);
        padding: 0 rem(30px);
        display: flex;
        font-size: rem(20px);
        .item {
            width: rem(190px);
            text-align: right;
            &:first-child {
                flex: 1;
                text-align: left;
            }
            &:nth-child(2) {
                width: rem(176px);
                text-align: left;
            }
        }
    }
}
</style>
