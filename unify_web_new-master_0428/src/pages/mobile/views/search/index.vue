<template>
    <div class='search-page' :class='{ pc:isPC }'>
        <div class='search-header'>
            <van-search
                ref='keywords'
                v-model='keywords'
                autofocus
                :focus='true'
                :placeholder="$t('search.placeholder')"
                show-action
                @clear='onClear'
                @input='handleInput'
                @search='handleSearch'
            >
                <div slot='action' class='van-search__action' @click='onCancel'>
                    {{ $t('compLang.cancel') }}
                </div>
            </van-search>
        </div>
        <div class='search-body'>
            <div v-if='isShowCache' class='recent-search'>
                <div class='label'>
                    {{ $t('search.lastest') }}
                </div>
                <div v-if='searchRecord.length>0' class='clear-operate'>
                    <van-icon name='delete' @click='clearRecord' />
                </div>
            </div>
            <div class='search-record'>
                <div v-if='isShowCache' class='search-list'>
                    <ul>
                        <li v-for='(item, index) in sortSearchRecord' :key='index' @click='toProductDetail(item,true)'>
                            <div class='product'>
                                <div class='name'>
                                    <span>{{ item.simplified }}</span>
                                </div>
                                <div class='block'>
                                    <span class='symbol-code'>
                                        {{ item.name }}
                                    </span>
                                </div>
                            </div>
                            <div class='optional'></div>
                        </li>
                    </ul>
                </div>
                <div v-if='isAnomaly' class='no-record'>
                    <div v-if='anomalyType' class='icon-area'>
                        <i></i>
                    </div>
                    <p v-if="anomalyType === 'norecord'">
                        {{ $t('search.norecord') }}
                    </p>
                    <p v-if="anomalyType === 'nodata'">
                        {{ $t('search.nodata') }}
                    </p>
                    <p v-if="anomalyType === 'network'">
                        {{ $t('search.network') }}
                    </p>
                    <p v-if="anomalyType === 'interface'">
                        {{ $t('search.interface') }}
                    </p>
                </div>
                <div v-else class='search-container'>
                    <div class='search-list'>
                        <ul>
                            <li v-for='(item, index) in aliasList' :key='index' @click='toProductDetail(item,false)'>
                                <div class='product'>
                                    <div class='name'>
                                        <span>{{ item.simplified }}</span>
                                    </div>
                                    <div class='block'>
                                        <span class='symbol-code' v-html='item.haskeyWords'></span>
                                    </div>
                                </div>
                                <div class='optional'>
                                    <i
                                        class='icon_zixuan1'
                                        :class="{ 'icon_zixuan2':item.optional, 'loading':item.toggleSelfimg }"
                                        @click.stop='toggleSelf(item, $event)'
                                    ></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { localSet, localGet, localRemove, getLoginData } from '@/utils/index'
import { pluck } from '@/utils/arr'
import { debounce } from '@/store/ix_utils'
import { add, del } from '@/api/selfSymbol'
import { getSearchRecord } from '@/api/search'
import { isPC } from '../../components/TimeSharing/lib/utils'
import { removeOid } from '@/utils/router'
export default {
    name: 'Search',
    data () {
        return {
            keywords: '',
            inputSearch: debounce(this.onSearch, 200),
            isAnomaly: true, // 是否异常(无匹配结果,网络异常无结果,接口异常无结果)
            isShowCache: true, // 是否显示搜索记录
            anomalyType: null,
            isRequest: false,
            searchRequest: null,
            searchRecord: [],
            activeTab: 0,
            cacheOptional: 0, //
            list: []
        }
    },
    computed: {
        ...mapState({
            product_map: (state) => state.ix_quote.product_map,
            product_list: (state) => state.ix_quote.product_list,
            product_category: (state) => state.ix_quote.product_category,
            selfSymbolList: (state) => state.selfSymbolList,
            subSymbolList: state => state.ix_quote.subscription_proList,
        }),
        productIds () {
            return pluck(this.product_list, 'code_id')
        },
        sortSearchRecord () { // 对搜索记录做排序
            return this.searchRecord.sort(function (a, b) {
                if (a.time > b.time) {
                    return -1
                }
                if (a.time < b.time) {
                    return 1
                }
                // a must be equal to b
                return 0
            })
        },
        accountInfo () {
            return this.$store.state.ix_user.info
                ? this.$store.state.ix_user.info.toKenCompanyInfoVo
                : {}
        },
        optionalIds () {
            return pluck(this.selfSymbolList, 'id')
        },
        optionalProduct () {
            // console.log(this.selfSymbolList)
            return pluck(this.selfSymbolList, 'symbolId')
        },
        // markitEnumerate() {
        //     return {
        //         '0': '上海',
        //         '1': '深圳',
        //         '2': '香港',
        //         '8': '外汇',
        //         '9': '美股',
        //         '10': '贵金属',
        //         '11': '指数',
        //         '12': '期货',
        //         '13': '数字货币',
        //         '14': '农产品',
        //         '15': '能源'
        //     }
        // },
        aliasList () {
            // console.log('this.list', this.list)
            return this.list.map((el) => {
                const gs = el.groupSymbol
                // el['markit'] = this.markitEnumerate[String(gs.market_id)]
                el['optional'] = this.optionalProduct.indexOf(el.code_id) > -1
                // 高亮关键字
                // market_name  string  股票市场名称
                // countries_code  string  国家代码
                // countries_name  string  国家名称
                // exchanger_code  string  交易所代码
                // exchange_name  string  交易所名称
                // name - market_name - exchanger_code
                let suffixName = gs.market_name ? ' - ' + gs.market_name : ''
                if (['0', '1', '2', '9'].indexOf(String(gs.market_id)) > -1) {
                    suffixName += (gs.exchanger_code ? ' - ' + gs.exchanger_code : '')
                }
                if (String(gs.market_id) === '11') {
                    suffixName += (gs.country_code ? ' - ' + gs.country_code : '')
                }
                const hightName = this.keywords === '' ? el.name : this.keywordscolorful(el.name, this.keywords)
                el['haskeyWords'] = hightName + suffixName
                // 判断产品是否为自选 是否过期 分组统计
                return el
            })
        },
        categoryList () {
            const categoryArr = this.product_category
                .slice()
                .filter((el) => el.display)
            const newArr = categoryArr.map((el) => {
                el['component'] = 'ProductList'
                return el
            })

            return [
                {
                    code_ids: [],
                    display: true,
                    list: [],
                    sort: 0,
                    title: '全部',
                    zone: 0,
                },
            ].concat(newArr)
        },
        marktList () {
            // this.$store.state.ix_quote.positionCode
            const arr = []
            this.categoryList.map((item) => {
                if (
                    this.$store.state.ix_quote.positionCode.indexOf(item.code_id) >= 0
                ) {
                    arr.unshift(item)
                } else {
                    arr.push(item)
                }
            })
            return arr
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo
                .language
        },
    },
    watch: {
        selfSymbolList: function (val) {
            this.list.forEach((item, index) => {
                if (item.code_id === this.cacheOptional) {
                    const optionalVal = this.optionalProduct.indexOf(item.code_id) > -1
                    this.$set(this.list[index], 'optional', optionalVal)
                }
            })
            this.$forceUpdate()
        },
    },
    activated () {
        this.initView()
    },
    created () {
        this.initView()
    },
    mounted () {
        this.changfouce()
    },
    methods: {
        ...mapMutations({
            UPDATE_PRODUCT_ACTIVATED_ID: 'ix_quote/UPDATE_PRODUCT_ACTIVATED_ID'
        }),
        initView () {
            // 判断是否存在搜索记录
            if (localGet('searchRecord')) {
                this.searchRecord = JSON.parse(localGet('searchRecord'))
            } else {
                this.anomalyType = 'norecord'
            }
            // 判断是否显示上一次的搜索记录
            if (localGet('keywords')) {
                this.keywords = localGet('keywords')
                this.onSearch(this.keywords)
            }
        },
        changfouce () {
            const keywordsComp = this.$refs.keywords
            const input = keywordsComp.querySelector('input')
            if (input) input.focus()
        },
        // 高亮搜索关键字
        keywordscolorful (str, key) {
            // debugger
            var reg = new RegExp('(' + key + ')', 'gi')
            var newstr = (str || '').replace(reg, '<em>$1</em>')
            return newstr
        },
        // 是否为自选产品
        isSelfSymbol (code_id) {
            return this.optionalProduct.indexOf(code_id) > -1
        },
        toProductDetail (data) {
            // 添加搜索记录
            if (this.addSearchRecord(data)) {
                this.UPDATE_PRODUCT_ACTIVATED_ID(data.code_id)

                // 删除路由参数
                this.isPC && removeOid(this.$router)

                // this.$emit('search', false)
                // this.$router.push({ name: 'Layout' })
                if (!this.isPC) {
                    this.$router.push({ name: 'ProductDetail', params: { id: data.code_id } })
                }
                //
            }
        },
        addSearchRecord (data) { // 添加搜索记录
            let isValidSymbol = true
            const time = new Date().getTime()
            const gs = data.groupSymbol
            let longName = data.name + (gs.market_name ? ' - ' + gs.market_name : '')
            if (['0', '1', '2', '9'].indexOf(String(gs.market_id))) {
                longName += (gs.exchanger_code ? ' - ' + gs.exchanger_code : '')
            }
            const cacheItem = {
                short_name: data.short_name,
                name: longName,
                code_id: data.code_id,
                groupSymbol: {
                    markit_id: gs.market_id,
                    market_name: gs.market_name,
                    exchanger_code: gs.exchanger_code,
                },
                // markit: this.markitEnumerate[String(gs.market_id)],
                simplified: data.simplified,
                time: time,
            }
            const cacheSearch = localGet('searchRecord')
            let cacheList = []
            if (cacheSearch) {
                cacheList = JSON.parse(cacheSearch)
                const searchIds = pluck(cacheList, 'code_id')
                // 若产品已下架，用户点击产品名后：隐藏该产品
                if (this.productIds.indexOf(data.code_id) === -1) {
                    isValidSymbol = false
                    this.$toast(this.$t('search.shelf'))
                    const shelfIndex = searchIds.indexOf(data.code_id)
                    cacheList.splice(shelfIndex, 1)
                    this.searchRecord = cacheList
                }
                if (searchIds.indexOf(data.code_id) === -1) {
                    // 仅记录最近前10个搜索
                    if (cacheList.length >= 10) {
                        cacheList.shift()
                    }
                    cacheList.push(cacheItem)
                } else {
                    // 更新已记录的产品时间
                    const curProduct = cacheList.find(el => el.code_id === data.code_id)
                    curProduct.time = time
                }
            } else {
                cacheList = [cacheItem]
            }
            localSet('searchRecord', JSON.stringify(cacheList))
            return isValidSymbol
        },
        // 添加取消自选
        toggleSelf (data, $event) {
            const code_id = data.code_id
            // 将添加取消自选的产品放进搜索记录里面
            this.addSearchRecord(data)
            if (this.accountInfo && this.accountInfo.accountType) {
                let submit
                this.cacheOptional = code_id
                // 判断是否为自选产品
                const isOptional = this.isSelfSymbol(code_id)
                // 根据是否为自选产品进行添加取消自选操作
                if (isOptional) {
                    const optionalId = this.optionalIds[
                        this.optionalProduct.indexOf(code_id)
                    ]
                    submit = del([optionalId])
                } else {
                    if (this.selfSymbolList.length >= 200) {
                        return this.$toast(this.$t('optional.optionalMoreThanMax'))
                    }
                    submit = add({
                        symbolId: code_id,
                    })
                }
                this.$set(data, 'toggleSelfimg', true)
                const icon = $event.target
                submit
                    .then((res) => {
                        if (parseInt(res.code) === 1) {
                            this.$ws.send_addSubscription_proList([...this.subSymbolList, code_id])
                            this.$ws.send('lastPrice', { code_ids: [code_id] })

                            const msg = this.$t(
                                isOptional ? 'optional.cancelSuccess' : 'optional.addSuccess'
                            )
                            // 重新拉取自选产品列表
                            this.$store.dispatch('getSelfSymbolList')
                                .finally(() => {
                                    this.$set(data, 'toggleSelfimg', false)
                                    this.$toast(msg)

                                    // 取消自选动画
                                    this.$nextTick(function () {
                                        if (isOptional) {
                                            icon.classList.add('zoomIn')
                                            setTimeout(() => {
                                                icon.classList.remove('zoomIn')
                                            }, 500)
                                        }
                                    })
                                })
                        } else {
                            this.$set(data, 'toggleSelfimg', false)
                            this.$toast(res.errMsg || res.msg || res.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        this.$set(data, 'toggleSelfimg', false)
                    })
            } else {
                this.$router.push({ name: 'Login' })
            }
        },
        handleSearch () {
            this.onSearch()
        },
        onSearch (val) {
            this.isAnomaly = false
            // 搜索最新的40条数据
            getSearchRecord({ code: this.keywords, pageSize: 40 }).then(res => {
                const newList = []
                if (res.code === 1) {
                    // 根据搜索结果取出对应的产品属性
                    res.data.forEach(el => {
                        const recordItem = this.product_map[String(el.id)]
                        if (recordItem) {
                            recordItem['name'] = el.code ? el.code : el.name
                            // recordItem['code'] = el.code
                            newList.push(recordItem)
                        }
                    })
                    // debugger
                    if (newList.length === 0) {
                        this.isAnomaly = true
                        this.isShowCache = false
                        this.anomalyType = 'nodata'
                    } else {
                        this.isShowCache = false
                        this.isAnomaly = false
                    }
                } else {
                    this.isAnomaly = true
                    this.isShowCache = false
                    this.anomalyType = 'nodata'
                    this.$toast(res.msg)
                }
                console.log('newList', newList)
                this.list = newList
            }).catch((error) => {
                this.isAnomaly = true
                this.isShowCache = false
                this.anomalyType = 'interface'
                console.log(error)
            })
        },
        onCancel () {
            /* 当在搜索页输入条件查询后点击取消返回原页面后再次点击搜索按钮进入搜索页时应清空上次查询输入信息 */
            // debugger
            localRemove('keywords')
            this.keywords = ''
            if (this.isPC) {
                this.$emit('search', false)
            } else {
                window.history.go(-1)
            }

            // window.history.go(-1)

            // this.$router.push({ name: 'Layout' })
        },
        onClear () {
            this.list = []
            this.isShowCache = true
            this.isAnomaly = true

            // this.$toast('清除')
        },
        clearRecord () {
            localRemove('searchRecord')
            this.searchRecord = []
            this.anomalyType = 'norecord'
        },
        handleInput (val) { // 搜索输入
            if (val === '') {
                this.isShowCache = true
                this.isAnomaly = true
            } else {
                this.inputSearch(val)
            }
        },
        tabClick () { },
        sellOrder () { },
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            // 如果从行情页面进来保留上一次的搜索记录，反之恢复默认
            if (from.name !== 'ProductDetail') {
                localRemove('keywords')
            }
            //    document.getElementById('appMain') &&
            //  (document.getElementById('appMain').style.backgroundColor = '#fff')
        })
    },
    beforeRouteLeave (to, from, next) {
        //   document.getElementById('appMain').style.backgroundColor = ''
        to.name === 'ProductDetail' ? localSet('keywords', this.keywords) : localRemove('keywords')
        this.onClear()
        next()
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/animations.scss";
@import "~@m/sass/mixin.scss";
.search-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 100;
    &.pc{
        ::v-deep{
            .van-search__content{
                    border: 1px solid #ecedf2;
                    background-color: transparent;
            }
            .van-search{
                padding: 13px 12px 10px;
                .van-cell{
                        padding: 2px 8px 2px 0;
                }
            }
            .van-search__action{
                font-size: rem(26px);
                color:#333;
            }
        }
    }
    .search-body {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        @include scroll();
    }
    ::v-deep {
        .van-search__action {
            color: #3c71e4;
            font-size: rem(30px);
        }
        .van-field__control {
            font-size: rem(26px);
        }
    }
}
.recent-search {
    display: flex;
    padding: 0 rem(28px);
    height: rem(68px);
    align-items: center;

    .label {
        flex: 1;
        font-size: rem(26px);
        line-height: rem(36px);
        color: #333;
    }
}
.search-list {
    ul {
        li {
            display: flex;
            align-items: center;
            height: rem(124px);
            padding: 0 rem(32px);
            border-bottom: 1px solid #efefef;
            &:hover {
                background-color: #f2f2f2;
            }
            .product {
                flex: 1;
            }
            .name {
                font-size: rem(34px);
                line-height: rem(36px);
                color: #333;
                ::v-deep {
                    em {
                        font-style: normal;
                        color: #3c71e4;
                    }
                }
            }
            .block {
                font-size: rem(20px);
                line-height: rem(36px);
                padding-top: rem(14px);
                color: #999;
            }
            .symbol-code {
                ::v-deep {
                    em {
                        font-style: normal;
                        color: #3c71e4;
                    }
                }
            }
            .optional {
                width: rem(48px);
                height: rem(124px);
                line-height: rem(124px);
                font-size: rem(33px);
                color: #777;
                .icon_zixuan2 {
                    color: #fc822f;
                }
                .loading {
                    position: relative;
                    &::before {
                        position: absolute;
                        animation: loading 0.6s linear infinite;
                    }
                }
                .zoomIn {
                    position: relative;
                    &::before {
                        position: absolute;
                        animation: zoomIn 0.6s linear forwards;
                    }
                }
            }
        }
    }
}
.no-record {
    text-align: center;
    font-size: rem(28px);
    color: #ccc;
    padding: rem(138px) 0 0;
    p {
        padding-top: rem(34px);
    }
    i {
        display: inline-block;
        width: rem(172px);
        height: rem(185px);
        background: url(~@m/images/no_data.png) no-repeat center center;
        background-size: 100%;
    }
}
</style>
