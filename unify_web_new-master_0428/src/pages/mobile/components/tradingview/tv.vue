<template>
    <div :class='{ pc: isPC }'>
        <div ref='placeholder' class='placeholder'></div>
        <div class='tv-head'>
            <div v-if='isShowTab' v-show='!selected' ref='tabsWrap' class='tabs-wrap'>
                <van-tabs
                    ref='tabs'
                    v-model='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    :color='style.mainColor'
                    line-height='2'
                    line-width='20'
                    :title-active-color='style.mainColor'
                    @change='tabChange'
                >
                    <template v-if='!isPC'>
                        <van-tab v-for='(item,i) in candleKTypeList.slice(0,6)' :key='i' :name='item.ktype' :title='item.title' />
                        <van-tab name='moreKTypes'>
                            <div slot='title' class='other-time-tab'>
                                {{ moreKType.title }}
                            </div>
                        </van-tab>
                    </template>
                    <template v-else>
                        <van-tab v-for='(item,i) in candleKTypeList' :key='i' :name='item.ktype' :title='item.title' />
                    </template>
                </van-tabs>

                <div class='more-time' :class='{ opened: moreTimeIsOpened }'>
                    <div v-show='moreTimeIsOpened' class='options van-hairline--surround'>
                        <div
                            v-for='(item,i) in candleKTypeList.slice(6)'
                            :key='i'
                            class='option'
                            :class='{ active: moreKType.title === item.title }'
                            @click='onClickMoreTime(item)'
                        >
                            {{ item.title }}
                        </div>
                    </div>
                    <div
                        v-show='moreTimeIsOpened'
                        class='mask'
                        @click.stop='moreTimeIsOpened = false'
                        @touchmove.stop='moreTimeIsOpened = false'
                    ></div>
                </div>

                <div class='flex-right'>
                    <van-dropdown-menu v-show="activeTab!=='timeSharing'" class='kIcon-wrap'>
                        <van-dropdown-item ref='klineType' v-model='klineType' :title="$t('indicator')">
                            <span slot='title'>
                                <KIcon class='kIcon' :value='klineTypeIndex' />
                            </span>
                            <van-cell
                                v-for='(item, i) in klineTypeList'
                                :key='item.name'
                                :class="{ 'mainColor':klineType===item.value }"
                                is-link
                                @click='setKlineType(item)'
                            >
                                <template #title>
                                    <span class='custom-title'>
                                        <KIcon class='kIcon' :value='i+1' />
                                        {{ item['title_'+lang] }}
                                    </span>
                                </template>
                                <template #right-icon>
                                    <van-icon v-if='klineType===item.value' class='klineTypeRightIcon' name='success' />
                                </template>
                            </van-cell>
                        </van-dropdown-item>
                    </van-dropdown-menu>
                    <van-loading v-if='loading' class='loadingIcon' color='#1989fa' size='18px' />
                    <div v-else class='setting' @click='settingStatus = !settingStatus'>
                        <van-icon class='icon' name='setting-o' />
                        <div v-show='settingStatus' class='content van-hairline--surround' @click.stop>
                            <template v-for='item in lineList'>
                                <!-- 仅外汇显示：买卖五档和成交记录选项 -->
                                <template v-if='product.market_id === 8 || (product.market_id !== 8 && !["stalls", "deal"].includes(item.value))'>
                                    <van-checkbox
                                        v-if="(item.value === 'position' && groupGet && groupGet.id) || item.value !== 'position'"
                                        :key='item.value'
                                        v-model='linesData[item.value].status'
                                        class='item'
                                        :class='{ active: linesData[item.value].status }'
                                        :disabled='activeTab === "timeSharing" && !["stalls", "deal"].includes(item.value)'
                                        icon-size='16px'
                                        @change='bool => toogleLine(item.value, bool)'
                                    >
                                        {{ $t(item.title) }}
                                    </van-checkbox>
                                </template>
                            </template>
                        </div>
                        <div
                            v-show='settingStatus'
                            class='mask'
                            @click.stop='settingStatus = false'
                            @touchmove.stop='settingStatus = false'
                        ></div>
                    </div>
                </div>
            </div>
            <template v-if='selected'>
                <div v-if='activeTab === "timeSharing"' class='selected-data'>
                    <div class='time'>
                        <span>{{ selectedDataForTS.time * 1000 | formatTime('YYYY/MM/DD') }}</span>
                        <span>{{ selectedDataForTS.time * 1000 | formatTime('HH:mm:ss') }}</span>
                    </div>
                    <div class='content'>
                        <div class='item'>
                            <div>
                                <span>{{ $t('trade.priceLabel') }}</span>
                                <span class='item-value'>
                                    {{ selectedDataForTS.close }}
                                </span>
                            </div>
                        </div>
                        <div class='item'>
                            <div>
                                <span>{{ $t('chart.diffPrice') }}</span>
                                <span
                                    v-if='product.lastPrice && product.lastPrice.yesterday_price'
                                    class='item-value'
                                    :style='{ color: getColorStr(selectedDataForTS.close, product.lastPrice.yesterday_price) }'
                                >
                                    {{ selectedDataForTS.diff | filterNumberSign }}
                                </span>
                            </div>
                        </div>
                        <div class='item'>
                            <div>
                                <span>{{ $t('chart.quoteChange') }}</span>
                                <span
                                    v-if='product.lastPrice && product.lastPrice.yesterday_price'
                                    class='item-value'
                                    :style='{ color: getColorStr(selectedDataForTS.close, product.lastPrice.yesterday_price) }'
                                >
                                    <template v-if='selectedDataForTS.diffPercent * 1 === 0'>
                                        {{ (selectedDataForTS.diff > 0 ? '+' : (selectedDataForTS.diff < 0 ? '-' : '')) + selectedDataForTS.diffPercent }}%
                                    </template>

                                    <template v-else>
                                        {{ selectedDataForTS.diffPercent | filterNumberSign }}%
                                    </template>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class='selected-data'>
                    <div class='time'>
                        <span>{{ selectedBar.dateStr }}</span>
                        <span>{{ selectedBar.timeStr }}</span>
                    </div>
                    <div class='content'>
                        <template v-if='!isPC'>
                            <div class='item'>
                                <div v-show='selectedBar.open' class='open'>
                                    {{ $t('chart.open') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.open }'
                                    >
                                        {{ selectedBar.open }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.low' class='low'>
                                    {{ $t('chart.low') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.low }'
                                    >
                                        {{ selectedBar.low }}
                                    </span>
                                </div>
                            </div>

                            <div class='item'>
                                <div v-show='selectedBar.high' class='high'>
                                    {{ $t('chart.high') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.high }'
                                    >
                                        {{ selectedBar.high }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.close' class='close'>
                                    {{ $t('chart.close') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.close }'
                                    >
                                        {{ selectedBar.close }}
                                    </span>
                                </div>
                            </div>
                            <div class='item'>
                                <div v-show='selectedBar.diff' class='diff'>
                                    {{ $t('chart.diffPrice') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diff }'
                                    >
                                        {{ ( selectedBar.diff > 0 ? '+' : '' ) + selectedBar.diff }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.diffPercent' class='diff-percent'>
                                    {{ $t('chart.quoteChange') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diffPercent }'
                                    >
                                        <template v-if='selectedBar.diffPercent * 1 === 0'>
                                            {{ (selectedBar.diff > 0 ? '+' : (selectedBar.diff < 0 ? '-' : '')) + selectedBar.diffPercent }}%
                                        </template>
                                        <template v-else>
                                            {{ selectedBar.diffPercent | filterNumberSign }}%
                                        </template>
                                    </span>
                                </div>
                            </div>
                        </template>

                        <template v-if='isPC'>
                            <div class='item'>
                                <div v-show='selectedBar.open' class='open'>
                                    {{ $t('chart.open') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.open }'
                                    >
                                        {{ selectedBar.open }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.low' class='low'>
                                    {{ $t('chart.low') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.low }'
                                    >
                                        {{ selectedBar.low }}
                                    </span>
                                </div>
                            </div>

                            <div class='item'>
                                <div v-show='selectedBar.high' class='high'>
                                    {{ $t('chart.high') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.high }'
                                    >
                                        {{ selectedBar.high }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.close' class='close'>
                                    {{ $t('chart.close') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.close }'
                                    >
                                        {{ selectedBar.close }}
                                    </span>
                                </div>
                            </div>
                            <div class='item'>
                                <div v-show='selectedBar.diff' class='diff'>
                                    {{ $t('chart.diffPrice') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diff }'
                                    >
                                        {{ ( selectedBar.diff > 0 ? '+' : '' ) + selectedBar.diff }}
                                    </span>
                                </div>
                                <div v-show='selectedBar.diffPercent' class='diff-percent'>
                                    {{ $t('chart.quoteChange') }}
                                    <span
                                        class='item-value'
                                        :style='{ color: selectedBar.colorStr.diffPercent }'
                                    >
                                        {{ ( selectedBar.diffPercent > 0 ? '+': '' ) + selectedBar.diffPercent }}%
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <div v-show='activeTab === "timeSharing"' class='TSArea'>
            <TimeSharing ref='timeSharing' @mounted='handleTSMounted' @onSelected='handleTSSelected' />
            <StallsAndDeal
                v-if='false && activeTab === "timeSharing" && product.market_id === 8'
                :deal-str='dealStr'
                :digit='product.digit'
                :product-id='productId'
                :stalls-str='stallsStr'
                :status="{ stalls: linesData['stalls'].status, deal: linesData['deal'].status }"
            />
        </div>

        <div v-show='activeTab !== "timeSharing"' class='tv-wrap'>
            <div class='tv-main'>
                <!-- 主图指标 -->
                <div ref='mainStudyArea' class='study-area'>
                    <div class='main-study'>
                        <div class='content'>
                            <div
                                v-for='(item, i) in mainStudyList'
                                :key='i'
                                class='item'
                                :class='{ active: mainStudy === item.name, disabled: !TVHasInit }'
                            >
                                <span
                                    class='inner-label'
                                    @click='!H5Device && onClickStudy("main", item.name)'
                                    @touchend='H5Device && onClickStudy("main", item.name)'
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                            <span class='item more' @click='openStudyDialog'>
                                <span class='inner-label'>
                                    {{ $t('chart.more') }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class='TVArea'>
                    <div id='tv_chart_container' ref='tv_chart_container'></div>
                    <div v-if="origin === 'miniTrade'" class='cover-right'></div>
                </div>

                <div ref='studyArea' class='study-area van-hairline--top'>
                    <!-- <div class='split'></div> -->
                    <div class='side-study'>
                        <div class='content'>
                            <div
                                v-for='(item, i) in sideStudyList'
                                :key='i'
                                class='item'
                                :class='{ active: subStudy === item.name, disabled: !TVHasInit }'
                            >
                                <span
                                    class='inner-label'
                                    @click='!H5Device && onClickStudy("sub", item.name)'
                                    @touchend='H5Device && onClickStudy("sub", item.name)'
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                            <span class='item more' @click='openStudyDialog'>
                                <span class='inner-label'>
                                    {{ $t('chart.more') }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <StallsAndDeal
                v-if=' false && activeTab !== "timeSharing" && product.market_id === 8'
                :deal-str='dealStr'
                :digit='product.digit'
                :product-id='productId'
                :stalls-str='stallsStr'
                :status="{ stalls: linesData['stalls'].status, deal: linesData['deal'].status }"
            />
        </div>

        <StudyList :prop-main-study='mainStudy' :prop-sub-study='subStudy' :show.sync='showStudyDialog' @createStudy='createStudy' @removeStudy='removeStudy' />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { WidgetConfig, candleKTypeList, klineTypeList } from './widget.config'
import KIcon from './icons/kIcon'
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { KtypeList, tvKtype } from './datafeeds/udf/lib/ktype'
import { localSet, localGet, localRemove } from '@/utils'
import dayjs from 'dayjs'
import { customIndicatorsGetter } from './customStudy'
import { Switch, Icon, Checkbox } from 'vant'
import { MAINSTUDIES, SUBSTUDIES } from './constant'
import { toFixed } from '@/utils/calculation'
import zh from 'dayjs/locale/zh-cn'
import en from 'dayjs/locale/en'
import TimeSharing from '@m/components/TimeSharing'
import StallsAndDeal from '@m/components/StallsAndDeal'
import StudyList from './components/StudyList'

const timeZone = dayjs().utcOffset() * 60 * 1000 // 时区，单位为分钟
export default {
    components: {
        KIcon,
        [Icon.name]: Icon,
        [Switch.name]: Switch,
        [Checkbox.name]: Checkbox,
        TimeSharing,
        StallsAndDeal,
        StudyList
    },
    filters: {
        toFixed (num, digit) {
            return toFixed(num, digit)
        },
        formatTime (timestamp, format) {
            return timestamp ? dayjs(timestamp).format(format) : '- -'
        }
    },
    props: {
        productId: {
            type: [Number, String],
            default: 0
        },
        height: {
            type: Number,
            default: 320
        },
        isapp: {
            type: Boolean,
            default: false
        },
        positions: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            H5Device: 'ontouchend' in document.body,
            activeTab: null,
            klineData: [],
            resolution: KtypeList[0],
            awaitCount: 0,
            loading: false,
            studyLimit: 3,
            klineType: 1,
            klineTypeList: klineTypeList,
            hasMouseDown: false, // 切换周期后标记用户是否点击(防止自动触发十字光标事件)
            selected: false,
            selectedBar: {
                colorStr: {}
            },
            moreTimeIsOpened: false,
            storageKTypeKey: 'productDetailNewKTypeActive',
            moreKType: {},
            mainStudyList: MAINSTUDIES.slice(0, 5), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 5), // 副图
            settingStatus: false,
            lineList: [
                {
                    title: this.$t('chart.lastValueLine'),
                    value: 'lastValue'
                },
                {
                    title: this.$t('chart.positionLine'),
                    value: 'position',
                },
                {
                    title: this.$t('chart.buyLine'),
                    value: 'buy',
                },
                {
                    title: this.$t('chart.sellLine'),
                    value: 'sell',
                },
                // {
                //     title: '买卖五档',
                //     value: 'stalls',
                // },
                // {
                //     title: '成交数据',
                //     value: 'deal',
                // }
            ],

            linesData: {
                lastValue: {
                    status: true
                },
                position: {
                    status: true
                },
                buy: {
                    status: false
                },
                sell: {
                    status: false
                },
                // stalls: {
                //     status: true
                // },
                // deal: {
                //     status: true
                // }
            },
            lineEntities: {}, // 价格线实体
            TVHasInit: false,
            studyMoveTimeEnd: 0,
            isShowTab: true,
            selectedDataForTS: {},
            showStudyDialog: false,
            mainStudy: '',
            subStudy: '',
        }
    },
    computed: {
        ...mapGetters(['style']),
        ...mapState({
            groupGet: state => state.ix_user.groupGet,
            userConfigInfo: state => state.userConfigInfo,
            origin: state => state.origin
        }),
        product () {
            return this.$store.state.ix_quote.product_map[this.productId]
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        // 路由携带的涨跌颜色值
        upColor () {
            return (this.isapp && this.$route && this.$route.query.up) ? this.$route.query.up : ''
        },
        downColor () {
            return (this.isapp && this.$route && this.$route.query.down) ? this.$route.query.down : ''
        },
        lang () {
            return this.language === 'en-US' ? 'en' : 'zh'
        },
        klineTypeIndex () {
            const curIndex = this.klineTypeList.findIndex(el => el.value === this.klineType)
            return curIndex + 1
        },

        // 涨跌色(路由携带的颜色参数最高，其次是$store存的颜色值)
        styleColors () {
            return {
                up: this.upColor || this.style.riseColor,
                down: this.downColor || this.style.fallColor
            }
        },
        isPC () {
            return window['isPC']
        },
        candleKTypeList () {
            const list = candleKTypeList(this)
            let result = []
            if ([0, 1, 2, 9].includes(this.product.market_id)) {
                result = list.filter(item => !['240'].includes(item.ktype))
            } else {
                result = list
            }

            if (this.isPC) {
                const obj = {
                    '1D': 60 * 24,
                    '1W': 60 * 24 * 7,
                    '1M': 60 * 24 * 30,
                }
                result.sort((a, b) => {
                    const aVal = obj[a.ktype] ? obj[a.ktype] : a.ktype
                    const bVal = obj[b.ktype] ? obj[b.ktype] : b.ktype
                    return aVal - bVal
                })
            }

            return result
        },
        stallsStr () {
            return this.product.stallsStr
        },
        dealStr () {
            return this.product.dealStr
        }
    },
    watch: {
        height (val) {
            if (!this.isPC) {
                console.log(this.getChartHeight(val))
                this.$refs['tv_chart_container'].getElementsByTagName('iframe')[0].style.height = `${this.getChartHeight(val)}px`

                this.handleTSMounted()
            }
        },
        productId (val, oldVal) {
            if (val && val !== oldVal) {
                this.init()
                this.isShowTab = false
                this.initTradingView()

                this.$refs['timeSharing'].reset()
                console.log('productId')

                this.$ws.send('dealSubscription', {
                    'code_ids': [val],
                    'type': 'yz-deal',
                    'subscribeType': 'reSubscribe',
                })
            }
        },
        'product.buy_price' (val) {
            const entity = Array.isArray(this.lineEntities['buy']) && this.lineEntities['buy'][0] && this.lineEntities['buy'][0].entity
            entity && entity.setPrice(val)
        },
        'product.sell_price' (val) {
            const entity = Array.isArray(this.lineEntities['sell']) && this.lineEntities['sell'][0] && this.lineEntities['sell'][0].entity
            entity && entity.setPrice(val)
        },
        'product.low_price' (val) {
            this.updateTSPrice()
        },
        'product.high_price' (val) {
            this.updateTSPrice()
        },
        'product.lastPrice': {
            deep: true,
            immediate: true,
            handler (val) {
                if (val && val.open_price && val.yesterday_price) {
                    this.handleTSMounted()
                }
            },
        },
        userConfigInfo: {
            deep: true,
            handler (val) {
                this.init()
                this.initTradingView()
            }
        },
        activeTab (val) {
            if (val === 'timeSharing') {
                this.handleTSMounted()
            }
        }
    },
    created () {
        this.init()
    },
    mounted () {
        this.initTradingView()
        this.initTSChart()
        this.$ws.send('dealSubscription', {
            'code_ids': [this.productId],
            'type': 'yz-deal',
            'subscribeType': 'reSubscribe',
        })
    },
    beforeDestroy () {
        // console.log('%c tvvm销毁前', 'background:#8ef;');
        this.tvWidget.remove()
        window['datafeed'] = undefined
        window['tvvm'] = undefined
        window['tvWidget'] = undefined
    },
    methods: {
        // 初始化
        init () {
            this.initOtherTime()
            try {
                const data = JSON.parse(localGet('tvLines')) || {}
                Object.assign(this.linesData, data)

                const { mainStudy, subStudy } = this.getLocalStudy()
                if (mainStudy + '' !== 'null') {
                    this.mainStudy = mainStudy ? mainStudy.name : 'Moving Average mock'
                }
                if (subStudy + '' !== 'null') {
                    this.subStudy = subStudy ? subStudy.name : 'Custom MACD'
                }
            } catch (error) {
                console.log(error)
            }
        },
        // tab切换
        tabChange (name, title) {
            this.hasMouseDown = false
            const { tvWidget, datafeed } = this
            const activeChart = tvWidget.activeChart && tvWidget.activeChart()
            const oldCycle = tvWidget.activeChart().resolution()
            if (['timeSharing', '1'].includes(name)) {
                // 分时
                activeChart.setResolution('1', () => {
                    console.log('tv数据更新周期：', title)
                })

                if (oldCycle === activeChart.resolution() && datafeed) {
                    this.loading = true
                    datafeed.onResetCacheNeededCallback && datafeed.onResetCacheNeededCallback()
                    activeChart.resetData()
                }
                this.setKType(name)
            } else {
                if (name !== 'moreKTypes') {
                    activeChart.setResolution(name, () => {
                        console.log('tv数据更新周期：', title)
                    })
                    this.setKType(name)

                    // if (oldCycle === activeChart.resolution()) {
                    //     this.loading = true
                    //     datafeed.onResetCacheNeededCallback()
                    //     activeChart.resetData()
                    // }
                }
            }
            console.log()
        },
        // 切换标签前的回调函数
        onBeforeChange (name, title) {
            if (name !== 'moreKTypes') {
                this.initOtherTime()
                return true
            }
            this.moreTimeIsOpened = !this.moreTimeIsOpened
        },
        // 更多周期
        onClickMoreTime ({ title, ktype }) {
            this.activeTab = 'moreKTypes'
            this.initOtherTime(title, ktype)
            this.moreTimeIsOpened = false

            const activeChart = tvWidget.activeChart()
            activeChart.setResolution(ktype)
            this.setKType(ktype)
        },

        getKType () {
            const oldIndex = localGet('productDetailKTypeActive')
            const newStorage = localGet(this.storageKTypeKey)
            let result = this.candleKTypeList[0]

            if ([0, 1, 2, 9].includes(this.product.market_id)) {
                // 股票K线为日K
                const i = this.candleKTypeList.findIndex(e => e.ktype === '1D')
                i !== -1 && (result = this.candleKTypeList[i])
            } else if (oldIndex) {
                // 兼容旧缓存
                const kTypeData = this.candleKTypeList[oldIndex]
                kTypeData && (result = kTypeData)
                if (oldIndex >= 6 && !this.isPC) {
                    result.activeTab = 'moreKTypes'
                }
                localRemove('productDetailKTypeActive')
                localSet(this.storageKTypeKey, result.ktype)
            } else if (newStorage) {
                const i = this.candleKTypeList.findIndex(e => e.ktype === localGet(this.storageKTypeKey))
                i !== -1 && (result = this.candleKTypeList[i])
                if (i >= 6 && !this.isPC) {
                    result.activeTab = 'moreKTypes'
                }
            }
            return result
        },

        setKType (ktype) {
            localSet(this.storageKTypeKey, ktype)
        },

        initOtherTime (title = this.$t('chart.more'), ktype = null) {
            this.moreKType = { title, ktype }
        },

        // 选择指标
        onClickStudy (type, name) {
            if (!this.TVHasInit) {
                return
            }
            const obj = {
                main: 'mainStudy',
                sub: 'subStudy'
            }
            const oldStudyName = this[obj[type]]

            if (oldStudyName === name) {
                this.removeStudy(type)
            } else {
                this.removeStudy(type)
                this.createStudy(type, name)
            }
        },
        // 增加单个指标
        createStudy (type, name) {
            const { tvWidget } = this
            const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === name) || null))
            const localStudy = this.getLocalStudy()
            if (!target) {
                return
            }

            const _temp = {
                main: 'mainStudy',
                sub: 'subStudy',
            }
            const localStudyKey = _temp[type]
            const localStudyData = localStudy[localStudyKey]
            const params = target.params || [false, false]
            if (localStudyData && Array.isArray(localStudyData.params) && localStudyData.params.length) {
                params[2] = localStudyData.params
            }

            tvWidget.chart().createStudy(target.name, ...params)
                .then(studyId => {
                    switch (type) {
                        case 'main': {
                            this.mainStudy = name
                            this.setLocalStudy({
                                mainStudy: {
                                    name,
                                    params: params[2],
                                    studyId
                                }
                            })
                            break
                        }
                        case 'sub': {
                            this.subStudy = name
                            this.setLocalStudy({
                                subStudy: {
                                    name,
                                    params: params[2],
                                    studyId
                                }
                            })
                            break
                        }
                    }
                })
        },
        // 移除主/副指标
        removeStudy (type) {
            const { tvWidget } = this
            const allStudies = tvWidget.activeChart().getAllStudies()

            switch (type) {
                case 'main': {
                    const mainStudies = MAINSTUDIES.map(item => item.name)
                    allStudies.forEach(item => {
                        if (mainStudies.includes(item.name)) {
                            tvWidget.chart().removeEntity(item.id)
                        }
                    })
                    this.mainStudy = ''
                    // this.setLocalStudy({
                    //     mainStudy: null
                    // })
                    break
                }
                case 'sub': {
                    const subStudies = SUBSTUDIES.map(item => item.name)
                    allStudies.forEach(item => {
                        if (subStudies.includes(item.name)) {
                            tvWidget.chart().removeEntity(item.id)
                        }
                    })
                    this.subStudy = ''
                    // this.setLocalStudy({
                    //     subStudy: null
                    // })
                    break
                }
            }
        },
        // 监听图表指标操作事件(hide/show/move/remove/click)
        handleStudyEvent (id, event) {
            if (['remove'].includes(event)) {
                const allStudyIds = this.tvWidget.activeChart().getAllStudies().map(item => item.id)
                const oldLocalStudy = this.getLocalStudy()

                Object.keys(oldLocalStudy).forEach((key) => {
                    const obj = oldLocalStudy[key]
                    if (obj && obj.studyId && !allStudyIds.includes(obj.studyId)) {
                        if (key === 'mainStudy') {
                            this.mainStudy = ''
                            this.setLocalStudy({
                                mainStudy: null
                            })
                        }
                        if (key === 'subStudy') {
                            this.subStudy = ''
                            this.setLocalStudy({
                                subStudy: null
                            })
                        }
                    }
                })
            }
        },
        // 监听指标属性更改事件
        handleStudyPropertiesChanged (id) {
            const oldLocalStudy = this.getLocalStudy()
            const data = this.getStudyentity(id)

            Object.keys(oldLocalStudy).forEach(key => {
                const obj = oldLocalStudy[key]
                if (obj && obj.studyId === id) {
                    this.setLocalStudy({
                        [key]: {
                            ...obj,
                            params: data.values.map(item => item.value)
                        }
                    })
                }
            })
        },
        // 统一设置指标缓存(包括属性)
        setLocalStudy (args) {
            const oldLocalStudy = this.getLocalStudy()
            if (args) {
                localSet('user_studies', {
                    ...oldLocalStudy,
                    ...args
                })
            } else {
                localSet('user_studies', {})
            }
        },
        // 统一获取指标缓存(包括属性)
        getLocalStudy () {
            let result = {}
            try {
                const localData = JSON.parse(localGet('user_studies'))
                if (Object.prototype.toString.call(localData) === '[object Object]') {
                    const temp = {}
                    Object.keys(localData).forEach(key => {
                        temp[key] = localData[key]
                    })
                    result = temp
                }
            } catch (error) {
                console.log(error)
            }
            return result
        },

        // 获取单个现存指标实例的数据
        getStudyentity (id) {
            let result = null
            try {
                const entity = this.tvWidget.activeChart().getStudyById(id)
                const info = entity._study.metaInfo()
                const values = entity.getInputValues()
                result = {
                    description: info.description,
                    values
                }
            } catch (error) {
                console.log(error)
            }
            return result
        },
        getChartHeight (num = this.height) {
            return Math.max(num, 200) - this.$refs['tabsWrap'].offsetHeight - this.$refs['studyArea'].offsetHeight - this.$refs['mainStudyArea'].offsetHeight
        },
        // 初始化 TradingView
        initTradingView () {
            // this.linesData.positionLineVisible = localGet('positionLineVisible') !== 'false';
            const { candleKTypeList } = this
            const kTypeData = this.getKType()
            this.activeTab = kTypeData.activeTab || kTypeData.ktype
            const kType = this.activeTab === 'timeSharing' ? '1' : kTypeData.ktype

            kTypeData.activeTab && this.initOtherTime(kTypeData.title, kType)

            this.$nextTick(() => {
                this.isShowTab = true
            })

            const datafeed = this.datafeed = new UDFCompatibleDatafeed('', { store: this.$store, vm: this })
            window['datafeed'] = datafeed
            window['tvvm'] = this
            const style = {
                riseColor: this.styleColors.up,
                fallColor: this.styleColors.down,
            }

            const config = WidgetConfig(style)
            // if (this.upColor) {
            //     Object.assign(config.overrides, {
            //         ...config.overrides,
            //         'mainSeriesProperties.candleStyle.upColor': this.upColor,
            //         'mainSeriesProperties.candleStyle.borderUpColor': this.upColor,
            //         'mainSeriesProperties.candleStyle.wickUpColor': this.upColor,
            //     })
            // }
            // if (this.downColor) {
            //     Object.assign(config.overrides, {
            //         ...config.overrides,
            //         'mainSeriesProperties.candleStyle.downColor': this.downColor,
            //         'mainSeriesProperties.candleStyle.borderDownColor': this.downColor,
            //         'mainSeriesProperties.candleStyle.wickDownColor': this.downColor
            //     })
            // }
            let chartH = this.height - this.$refs['tabsWrap'].offsetHeight - this.$refs['placeholder'].offsetHeight - this.$refs.studyArea.offsetHeight - this.$refs['mainStudyArea'].offsetHeight
            console.log('chartH', chartH)
            !this.isapp && chartH < 320 && (chartH = 320)

            const digit = this.product.digit
            const options = {
                // debug: true, // uncomment this line to see Library errors and warnings in the console
                ...config,
                width: document.documentElement.clientWidth,
                height: this.isPC ? this.getChartHeight() : chartH,
                locale: this.language === 'en-US' ? 'en' : 'zh',
                symbol: this.productId,
                interval: kType,
                container_id: 'tv_chart_container',

                //	BEWARE: no trailing slash is expected in feed URL
                datafeed: datafeed,
                custom_indicators_getter: function (PineJS) {
                    return customIndicatorsGetter(PineJS, digit)
                }
            }
            if (this.isPC) {
                delete options.height
                options.autosize = true
            }
            this.tvWidget = window.tvWidget = new TradingView.widget(options)
            this.tvWidget.onChartReady(() => {
                // if (this.activeTab === 'timeSharing') {
                //     // 分时
                //     this.tvWidget.activeChart().setChartType(3)
                // }

                this.TVHasInit = true

                this.mainStudy && this.createStudy('main', this.mainStudy)
                this.subStudy && this.createStudy('sub', this.subStudy)

                this.$watch('product.cur_price', function (newval) {
                    if (this.activeTab === 'timeSharing') {
                        this.$refs.timeSharing.onTick({
                            time: this.product.tm * 1000,
                            close: newval
                        })
                    } else {
                        this.watchPrice(newval)
                    }
                })

                this.tvWidget.subscribe('study_event', (id, event) => {
                    this.handleStudyEvent(id, event)
                })

                this.tvWidget.subscribe('study_properties_changed', (entityId) => {
                    this.handleStudyPropertiesChanged(entityId)
                })
                // K线数据加载完之后显示持仓线
                const activeChart = this.tvWidget.activeChart()
                let hasInitLines = false
                activeChart.onDataLoaded().subscribe(null, e => {
                    this.onDataLoaded = true
                    // console.log('%c开始画持仓线', 'background:#e8f;')
                    // this.setPositionLine();

                    // 绘画价格线
                    if (!hasInitLines) {
                        hasInitLines = true
                        Object.keys(this.linesData).forEach(key => {
                            this.linesData[key].status && this.setLine(key)
                        })
                    }

                    this.$watch('positions', function (newval, oldval) {
                        this.watchPosition(newval, oldval)
                    })
                })
                // 十字光标位置
                activeChart.crossHairMoved(({ time, price }) => {
                    this.isPC && (this.hasMouseDown = true)

                    if (!this.hasMouseDown) {
                        return
                    }
                    this.handleCrossHairMoved(time)
                        .then(() => {
                            this.selected = true
                            tvWidget.applyOverrides({
                                'paneProperties.legendProperties.showStudyValues': true
                            })
                        })
                        .catch(() => {
                            this.selected = false
                            tvWidget.applyOverrides({
                                'paneProperties.legendProperties.showStudyValues': false
                            })
                        })
                })
                // 鼠标进入/离开(监听事件)
                this.tvWidget.subscribe('mouse_down', (event) => {
                    this.hasMouseDown = true
                })
                this.tvWidget.subscribe('mouse_up', (event) => {
                    this.selected = false
                    tvWidget.applyOverrides({
                        'paneProperties.legendProperties.showStudyValues': false
                    })
                })

                if (this.isPC) {
                    this.$refs['tv_chart_container'].addEventListener('mouseleave', () => {
                        this.selected = false
                    })
                }

                this.tvWidget.subscribe('onTick', (data) => {
                    if (this.selected && this.selectedBar.time === data.time) {
                        this.handleCrossHairMoved(data.time)
                    }
                })
            })
        },
        // 监听行情报价
        watchPrice (newval) {
            newval = newval * 1
            const product = this.product
            if (!this.tvWidget.chart) return false
            try {
                const _series = this.tvWidget.chart().getSeries()._series
                const last = _series.bars().last().value
                const lastTime = last[0] * 1000
                const curTime = product.tm * 1000
                let isSameCandleChart = false
                const resolution = this.tvWidget.activeChart().resolution()

                const formatTimes = {
                    '1D': 'YYYY-MM-DD',
                    '1M': 'YYYY-MM',
                }

                if (formatTimes[resolution] && dayjs(lastTime).format(formatTimes[resolution]) === dayjs(curTime).format(formatTimes[resolution])) {
                    isSameCandleChart = true
                } else if (resolution === '1W' && dayjs(curTime).diff(lastTime, 'week') === 0) {
                    isSameCandleChart = true
                } else if (curTime <= lastTime) {
                    isSameCandleChart = true
                }
                // 如果报价属于最后一根K线的时间则继续绘制最后一根K线，否则加载下一根K线
                if (isSameCandleChart) {
                    this.datafeed.onTick({
                        time: lastTime,
                        open: last[1],
                        high: Math.max(last[2], newval),
                        low: Math.min(last[3], newval),
                        close: newval,
                        volume: last[5]
                    })
                } else {
                    const chart = this.tvWidget.chart()
                    const resolution = chart.resolution()
                    const ktype = tvKtype[resolution]
                    console.log({ resolution, ktype, tvKtype })
                    if (!ktype) throw Error(resolution + ' K线类型未定义')
                    this.loadingNextKline(ktype)
                }
            } catch (error) {
                console.log(error)
            }
        },
        /* 计算下一根K线的时间
         * resolution 周期类型
         * time 报价时间， 单位秒
         * 返回时间单位毫秒
        */
        nextKlineTime (resolution, time) {
            let nextTime
            if (parseInt(resolution) <= 60) {
                nextTime = time - time % (60 * resolution) + 60 * resolution
            }
            return nextTime * 1000
        },
        // 日期字符串转时间戳 +时区
        toTimestamp (timestr) {
            return dayjs(timestr).unix() * 1000 + timeZone
        },
        // 加载最近两根K线，结束正在画的一条，以及绘制新的K线数据
        loadingNextKline (resolution) {
            this.$mSocket
                .send('klineHistoryData', {
                    code_id: Number(this.productId),
                    ktype: resolution,
                    msg_id: Date.now(),
                    num: 2,
                    flag: 0, // 取值0或1，0表示向历史方向请求，1表示向后请求, 比如 starttime = 2016-08-05 00:00:00，flag为0 请求数据往小于2016-08-05 方向， flag为1 ，请求数据往大于 2016-08-05方向
                    startTime: 0, // 最新的K线时间传0
                }).then(res => {
                    // console.log(res);
                    const list = res.kline_data_list
                    const toTimestamp = this.toTimestamp
                    list.sort((a, b) => a.time - b.time)
                    list.forEach(el => {
                        const time = toTimestamp(el.time)
                        this.datafeed.onTick({
                            time: el.time * 1000,
                            open: el.open_price,
                            high: el.high_price,
                            low: el.low_price,
                            close: el.close_price,
                            volume: 0
                        })
                    })
                })
        },
        // 设置K线类型样式
        setKlineType (item) {
            this.klineType = item.value
            this.tvWidget.activeChart().setChartType(item.value)
            setTimeout(() => {
                this.$refs.klineType.toggle()
            }, 50)
        },
        // 十字光标监听事件
        handleCrossHairMoved (time) {
            const { digit } = this.product
            const _series = this.tvWidget.chart().getSeries()._series
            const bars = _series.bars()
            let prevBar = null
            const currentBar = bars.findFirst((i, item) => {
                if (item[0] === time) {
                    prevBar = bars.state().data[i - 1]
                    return true
                }
            })

            return new Promise((resolve, reject) => {
                if (currentBar) {
                    const ktype = this.getKType().ktype
                    let timeStr = dayjs(time * 1000).format('HH:mm:ss')
                    if (['1D', '1M', '1W'].includes(ktype)) {
                        const locale = this.lang === 'en' ? en : zh
                        timeStr = dayjs(time * 1000).locale(locale).format('dddd')
                    } else {
                        const timeStr = dayjs(time * 1000).format('HH:mm:ss')
                    }

                    // 当前K线
                    const { value } = currentBar
                    this.selectedBar = {
                        open: toFixed(value[1], digit),
                        low: toFixed(value[3], digit),
                        high: toFixed(value[2], digit),
                        close: toFixed(value[4], digit),
                        diff: 'n/a',
                        diffPercent: 'n/a',
                        dateStr: dayjs(time * 1000).format('YYYY/MM/DD'),
                        timeStr: timeStr,
                        time,
                        colorStr: {}
                    }

                    if (prevBar) {
                        // 上一条k线
                        const { value: prevValue } = prevBar
                        const prevClose = prevValue[4]
                        const { selectedBar, getColorStr } = this

                        const diff = toFixed(selectedBar.close - prevClose, digit)
                        const diffPercent = toFixed((selectedBar.close - prevClose) / prevClose * 100, 2)

                        Object.assign(selectedBar, {
                            diff,
                            diffPercent,
                            colorStr: {
                                open: getColorStr(selectedBar.open, prevClose),
                                low: getColorStr(selectedBar.low, prevClose),
                                high: getColorStr(selectedBar.high, prevClose),
                                close: getColorStr(selectedBar.close, prevClose),
                                diff: getColorStr(diff, 0),
                                diffPercent: getColorStr(diff, 0)
                            }
                        })
                    }
                    resolve()
                } else {
                    this.selectedBar = {
                        colorStr: {}
                    }
                    reject()
                }
            })
        },

        getColorStr (a, b) {
            a *= 1
            b *= 1
            return a === b ? '' : (a > b ? this.styleColors.up : this.styleColors.down)
        },
        // 图标里面设置持仓线
        setPositionLine () {
            // if (!this.linesData.positionLineVisible) return false;
            const chart = this.tvWidget.chart()
            // if (!chart || this.positions.length === 0 || this.positionLine) return false;
            // this.positionLine = true;
            const volumeUnit = this.$t('trade.volumeUnit')
            const buy = this.$t('trade.buy')
            const sell = this.$t('trade.sell')
            let currency = this.groupGet.currency
            currency = currency === 'IXD' ? 'USD' : currency

            const lines = []
            this.positions.forEach(el => {
                let text = el.direction === 1 ? buy : sell
                text += ` ${el.volume}` + volumeUnit
                const profitOrLoss = el.profitOrLoss + el.swap
                const n = profitOrLoss >= 0 ? '+' : ''
                const color = profitOrLoss < 0 ? this.styleColors.down : this.styleColors.up
                const entity = chart.createPositionLine()
                    .setPrice(el.open_price)
                    .setText(text)
                    .setExtendLeft(false)
                    .setLineStyle(0)
                    .setQuantity(n + profitOrLoss.toFixed(2) + ' ' + currency)
                    .setQuantityBackgroundColor(color)
                    .setBodyBorderColor(color)
                    .setLineColor(color)
                    .setQuantityBorderColor(color)
                    .setLineLength(55)
                // this['positionLine_' + el.id] = entity;
                lines.push({
                    id: el.id,
                    entity
                })
            })

            return lines
        },

        toogleLine (key, isShow) {
            if (isShow) {
                this.setLine(key)
            } else {
                this.revmoeLine(key)
            }
            localSet('tvLines', this.linesData)
        },

        // 设置价格线
        setLine (key) {
            const chart = this.tvWidget.chart()
            const entities = []
            switch (key) {
                case 'position': {
                    if (this.positions.length === 0) {
                        return
                    }
                    entities.push(...this.setPositionLine())
                    break
                }
                case 'buy': {
                    entities.push({
                        id: '',
                        entity: chart.createOrderLine()
                            .setPrice(this.product.buy_price)
                            .setText('')
                            .setLineStyle(0)
                            .setLineColor(this.styleColors.up)
                            .setQuantity(false)
                    })
                    break
                }
                case 'sell': {
                    entities.push({
                        id: '',
                        entity: chart.createOrderLine()
                            .setPrice(this.product.sell_price)
                            .setText('')
                            .setLineStyle(0)
                            .setLineColor(this.styleColors.down)
                            .setQuantity(false)
                    })
                    break
                }
                case 'lastValue': {
                    // 现价线
                    this.tvWidget.applyOverrides({
                        'mainSeriesProperties.showPriceLine': true,
                        'scalesProperties.showSeriesLastValue': true,
                    })
                }
            }

            Object.assign(this.lineEntities, {
                [key]: entities
            })
        },

        // 删除价格线
        revmoeLine (key) {
            switch (key) {
                case 'lastValue': {
                    this.tvWidget.applyOverrides({
                        'mainSeriesProperties.showPriceLine': false,
                        'scalesProperties.showSeriesLastValue': false,
                    })
                    break
                }
                default: {
                    if (!(Array.isArray(this.lineEntities[key]) && this.lineEntities[key].length > 0)) {
                        return
                    }
                    this.lineEntities[key].forEach(item => {
                        item.entity.remove()
                    })
                    this.lineEntities[key] = []
                }
            }
        },

        // 获取主窗格
        getMainPanes () {
            const activeChart = this.tvWidget.activeChart()
            return activeChart.getPanes().find(el => el.hasMainSeries())
        },
        // 获取时间刻度范围
        getVisiblePriceRange () {
            const mainPanes = this.getMainPanes()
            return mainPanes && mainPanes.getMainSourcePriceScale().getVisiblePriceRange()
        },
        // 监听持仓，更新图表持仓线的盈亏
        watchPosition (newval, oldval) {
            // console.log(JSON.parse(JSON.stringify(newval)), JSON.parse(JSON.stringify(oldval)));
            let currency = this.groupGet.currency
            currency = currency === 'IXD' ? 'USD' : currency

            if (!this.linesData['position'].status) {
                return
            }

            if (Array.isArray(this.lineEntities['position']) && newval.length === oldval.length) {
                newval.forEach((el, i) => {
                    // const line = this.lineEntities['positionLine_' + el.id];
                    const line = this.lineEntities['position'].find(item => item.id === el.id)
                    if (!line) return false
                    const profitOrLoss = el.profitOrLoss + el.swap
                    const color = profitOrLoss < 0 ? this.styleColors.down : this.styleColors.up
                    const n = profitOrLoss >= 0 ? '+' : ''
                    line.entity.setQuantity(n + profitOrLoss.toFixed(2) + ' ' + currency)
                        .setQuantityBackgroundColor(color)
                        .setBodyBorderColor(color)
                        .setLineColor(color)
                        .setQuantityBorderColor(color)
                })
            } else {
                // this.removePositionLine(oldval);
                this.revmoeLine('position')
                newval.length && this.setLine('position')
                // newval.length && this.setPositionLine();
            }
        },
        // 删除持仓线
        // removePositionLine(positions) {
        //     positions.forEach(el => {
        //         const line = this['positionLine_' + el.id];
        //         if (line) {
        //             line.remove();
        //             delete this['positionLine_' + el.id];
        //         }
        //     })
        //     this.positionLine = false;
        // },

        // 切换周期重置x/y轴缩放比例
        resetZoom (list) {
            // 注：因activeChart().getSeries()._series.bars()的数据不可控，需使用getBars()内接口返回的数据
            const maxLen = this.isPC ? 200 : 80
            const from = Math.floor(list[list.length > maxLen ? list.length - maxLen : 0].timeStr)
            const to = Math.floor(list[list.length - 1].timeStr)

            this.tvWidget.activeChart().setVisibleRange({ from, to }, { applyDefaultRightMargin: true })
            this.tvWidget.activeChart()._chartWidget.model().model().setPriceAutoScaleForAllMainSources(true)
        },

        openStudyDialog () {
            this.showStudyDialog = true
            // this.tvWidget.activeChart().executeActionById('insertIndicator')
        },
        // 初始化分时图
        initTSChart () {
            if (this.$refs['timeSharing']) {
                if (!this.isPC) {
                    let chartH = this.height - this.$refs['tabsWrap'].offsetHeight - this.$refs['placeholder'].offsetHeight

                    !this.isapp && chartH < 320 && (chartH = 320)

                    this.$refs['timeSharing'].$el.style.height = Math.floor(chartH) + 'px'
                }
                this.$refs['timeSharing'].applyConfig({
                    colors: {
                        up: this.styleColors.up,
                        down: this.styleColors.down
                    },
                    digit: this.product.digit
                })
            }
        },

        resized () {
            this.$refs['timeSharing'].updateChart()
        },

        // 更新数据
        updateTSData (data) {
            this.$refs['timeSharing'] && this.$refs['timeSharing'].updateTSData(data)
        },

        handleTSSelected (data) {
            if (!data) {
                this.selectedDataForTS = {}
                this.selected = false
                return
            }
            const { lastPrice: { yesterday_price }, digit } = this.product

            this.selectedDataForTS = {
                ...data,
                diff: toFixed(data.close - yesterday_price, digit),
                diffPercent: toFixed((data.close - yesterday_price) / yesterday_price * 100, 2)
            }
            this.selected = !!data
        },

        // 分时渲染完成回调函数
        handleTSMounted () {
            if (!this.isPC && this.$refs['tabsWrap'] && this.$refs['placeholder'] && this.$refs['timeSharing']) {
                let chartH = this.height - this.$refs['tabsWrap'].offsetHeight - this.$refs['placeholder'].offsetHeight

                !this.isapp && chartH < 320 && (chartH = 320)

                this.$refs['timeSharing'].$el.style.height = Math.floor(chartH) + 'px'
            }

            this.updateTSPrice()
        },

        // 实时更新分时价格
        updateTSPrice () {
            const lastPrice = this.product.lastPrice
            if (this.$refs['timeSharing'] && lastPrice) {
                this.$refs['timeSharing'].applyConfig({
                    openPrice: lastPrice.open_price,
                    highPrice: lastPrice.high_price,
                    lowPrice: lastPrice.low_price,
                    closePrice: lastPrice.yesterday_price,
                    colors: {
                        up: this.styleColors.up,
                        down: this.styleColors.down
                    },
                    digit: this.product.digit
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.placeholder {
    height: rem(10px);
}
.tv-head{
    // 若高度调整，需同时处理vant-tab组件内的高度和行高等
    width: 100%;
    box-sizing: border-box;
    height: rem(60px);
}
.tabs-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100%;
    ::v-deep{
        .van-popup{
            @include scroll();
        }
    }
    .tabs {
        flex: 1;
        ::v-deep {
            .van-tab {
                line-height: rem(60px);
                font-size: rem(24px);
                flex: 1;
                flex-basis: auto !important;
                white-space: nowrap;
                padding: 0;
                .van-tab__text {
                    white-space: nowrap;
                }
            }
            .van-tabs__wrap {
                height: rem(60px);
                .van-tabs__nav--line{
                    padding-bottom: 0;
                }
                .van-tabs__line{
                    bottom: 0;
                }
            }
        }
    }
    .other-time-tab {
        min-width: rem(61px);
        text-align: center;
        white-space: nowrap;
    }
    .more-time {
        position: relative;
        height: 100%;
        line-height: rem(60px);
        font-size: rem(24px);
        background: #fff;
        padding: 0 4px 0 0;
        color: #646566;
        &:after {
            position: absolute;
            top: 50%;
            right: 1px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent #dcdee0 #dcdee0;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            opacity: 0.8;
            content: "";
        }
        &.opened {
            &:after {
                margin-top: -1px;
                transform: rotate(135deg);
                border-color: transparent transparent currentColor currentColor;
            }
        }
        .options {
            position: absolute;
            top: rem(71px);
            left: rem(-100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
            margin-top: rem(1px);
            z-index: 10;
            box-shadow: 0px 0px 2px 0px #ebedf0;
            .option {
                white-space: nowrap;
                line-height: rem(30px);
                padding: rem(20px) rem(50px) rem(10px);
                &.active {
                    color: $primary;
                }
            }
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
            opacity: 0;
        }
    }
    .loadingIcon {
        background: #fff;
        width: rem(80px);
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .flex-right{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .study-wrap,
    .kIcon-wrap {
        height: auto;
        ::v-deep {
            .van-dropdown-menu__title {
                font-size: rem(24px);
                color: #646566;
            }
            .van-dropdown-menu__bar {
                width: 100%;
                height: 100%;
                box-shadow: none;
            }
        }
    }
    .chartPositinLine {
        font-size: rem(40px);
    }
    .study-wrap {
        width: rem(120px);
        ::v-deep {
            .van-dropdown-menu__bar {
                width: 100%;
                height: 100%;
                padding-right: 13px;
                box-sizing: border-box;
            }
        }
    }

    .kIcon-wrap {
        width: rem(80px);
        padding-right: 0;
        ::v-deep {
            .van-dropdown-menu__title::after {
                display: none;
            }
        }
    }
    .kIcon {
        display: inline-block;
        vertical-align: middle;
    }
    .klineTypeRightIcon {
        font-size: rem(36px);
        padding-top: rem(10px);
    }
}

.selected-data {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: nowrap;
    font-size: rem(20px);
    color: #a7a7a7;
    .time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 rem(30px) 0 rem(20px);
        white-space: nowrap;
    }
    .content {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-wrap: nowrap;
            white-space: nowrap;
            min-width: 20%;
            margin: 0 rem(15px) 0 0;
            .item-value {
                color: #646566;
                padding-left: rem(5px);
            }
        }
    }
}

.tv-wrap{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .tv-main{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow: hidden;
    }

    .TVArea{
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        position: relative;
        .cover-right{
            position: absolute;
            right: 0;
            top: 0;
            width: rem(140px);
            height: 100%;
            box-sizing: border-box;
            z-index: 1;
            opacity: 0;
        }
    }
}

.TSArea{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

#tv_chart_container {
    flex: 1;
    ::v-deep {
        iframe {
            width: 100%;
        }
    }
}

.study-area {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: rem(60px);
    line-height: rem(60px);
    background: #fff;
    .main-study,
    .side-study {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-end;
        flex: 1;
        overflow-x: auto;
        height: 100%;
        .content {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            white-space: nowrap;
            justify-content: space-around;
            flex: 1;
            .item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-end;
                padding: 0 rem(10px);
                color: #646566;
                font-size: rem(24px);
                flex: 1;
                text-align: center;
                &.active {
                    color: $primary;
                }
                &.disabled {
                    color: $muted;
                }

                .inner-label{
                    flex: 1;
                    height: rem(50px);
                    line-height: rem(45px);
                }
            }
        }
    }
    .split {
        display: block;
        flex: 0 0 1px;
        height: rem(30px);
        margin: 0 rem(20px);
        background: #f8f8f8;
    }
    .more {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        margin: 0 rem(10px);
        .inner-label{
            flex: 1;
            height: rem(50px);
            line-height: rem(45px);
        }
    }
}
.setting {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: rem(80px);
    background: #fff;
    .icon {
        font-size: rem(32px);
    }
    .content {
        position: absolute;
        right: 0;
        top: rem(72px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-items: flex-start;
        background: #fff;
        z-index: 10;
        box-shadow: 0px 0px 2px 0px #ebedf0;
        .item {
            white-space: nowrap;
            line-height: rem(30px);
            padding: rem(20px) rem(50px) rem(10px);
            &.active {
                ::v-deep {
                    &.van-checkbox__icon--disabled{
                        .van-icon {
                            background-color: #ebedf0;
                            border-color: #c8c9cc;
                        }
                    }
                    .van-icon {
                        border-color: $primary;
                        background-color: $primary;

                    }
                    .van-checkbox__label {
                        color: $primary;
                        &.van-checkbox__label--disabled{
                            color: #c8c9cc;
                        }
                    }
                }
            }
        }
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
        opacity: 0;
    }
}

.pc{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
    .tv-wrap{
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .tv-main{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
        }
    }
    #tv_chart_container{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex: 1;
        width: 100%;
        ::v-deep iframe{
            flex: 1;
        }
    }
    .study-area{
        height: 30px;
        line-height: 30px;
        user-select: none;
        .main-study, .side-study{
            &::-webkit-scrollbar {
                display: none;
            }
            .content{
                .item{
                    font-size: rem(26px);
                    padding: 0 2px;
                     .inner-label{
                        cursor: pointer;
                    }
                    &.more{
                        margin-left: 0;
                        padding-left: 0;
                    }
                }
            }
        }

        .main-study{
            max-width: 490px;
        }
        .side-study{
            max-width: 490px;
        }
        .split{
            background: #999;
        }
    }
    // .main-study{
    //     flex: none;
    // }

    .tv-head{
        height: 26px;
        .selected-data{
            .time{
                flex-direction: row;
                flex-wrap: nowrap;
                >span{
                    margin-right: 10px;
                }
            }
            .content{
                .item{
                    min-width: auto;
                    flex-direction: row;
                    align-items: center;
                    min-width: auto;
                    justify-content: flex-start;
                    >div{
                        min-width: 80px;
                        margin-right: 20px;
                        text-align: left;
                    }
                }
            }
        }
    }

    ::v-deep{
        .tabs-wrap{
            justify-content: space-between;
            .tabs{
                flex: 1;
                max-width: 620px;
                .van-tabs__wrap{
                    height: 26px;
                }
                .van-tab{
                    flex: 1;
                    // padding: 0 rem(35px);
                    padding: 0;
                    font-size: 12px;
                    white-space: nowrap;
                }
            }
            .kIcon-wrap{
                .van-dropdown-item{
                    position: absolute;
                    top: 142px!important;
                }
            }
            .setting{
                cursor: pointer;
                .content{
                    top: 27px;
                }
            }
            .more-time{
                display: none;
                .options{
                    left: rem(-138px);
                    .option{
                        cursor: pointer;
                    }
                }
            }
        }

    }
}

</style>
