<template>
    <div ref='optionalList' class='optionalList' :class="{ 'whiteBg':optinalList.length===0,pc:isPC }" :suball='true'>
        <component :is="'ad'" v-for='ad in addInfo.top' :key='ad.id' ref='admap' :data='ad' />
        <div class='titleBar'>
            <van-dropdown-menu>
                <van-dropdown-item
                    ref='dropdownItem'
                    v-model='displayType'
                    :options='displayTypeOptions'
                    @change='handleDisplayTypeChange'
                    @open='menuOpen'
                />
            </van-dropdown-menu>
            <div class='sortTypeWrap' :class='sortIcon' @click='handleSortTypeClick'>
                <span>{{ sortType | filterSortType(sortTypeOptions) }}</span>
            </div>
            <!-- <van-dropdown-menu class="sortMenu">
                <van-dropdown-item v-model="sortType" :options="sortTypeOptions" :title-class="sortIcon" />
            </van-dropdown-menu>-->
        </div>
        <!-- <van-loading v-if="loadStatus==='loading'" class="m-loading" size="30px">{{$t('compLang.loading')}}</van-loading> -->
        <a v-if='optinalList.length===0' class='toProductList' href='javascript:;' @click='handleAddOptional'>
            <span class='plusBLock'>
                <i class='icon_icon_plus'></i>
            </span>
            <!-- 您还未添加自选 -->
            <p class='muted'>
                {{ $t('optional.addOptional') }}
            </p>
        </a>
        <div v-else-if='optinalList.length>0' class='optionalListUlWrap'>
            <ul class='optionalListUl'>
                <li
                    v-for='(item, i) in optinalList'
                    :key='item.selfSymbol.id'
                    :class="{ 'active':product_activatedId===item.selfSymbol.symbolId }"
                >
                    <ProductItem
                        :active-tab='activeTab'
                        :buy-price='item.buy_price'
                        :display-type='displayType'
                        :index='i'
                        :language='language'
                        :product='item'
                        :sell-price='item.sell_price'
                        :tab-index='index'
                        :tab-title='tabTitle'
                        @toTab='toTab'
                    />
                </li>
            </ul>
            <span
                v-if='optinalList.length!==0'
                class='gotoAdd'
                @click='handleAddOptional'
            >
                {{ $t('optional.addOptional') }}
            </span>
            <component :is="'ad'" v-for='ad in addInfo.bottom' :key='ad.id' class='adBottom' :data='ad' />
        </div>
    </div>
</template>

<script>
import ProductItem from './optionaltem'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getLoginData, localSet, localGet } from '@/utils/index'
import dayjs from 'dayjs'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'OptionalList',
    components: {
        ProductItem
    },
    mixins: [pcMixin],
    filters: {
        filterSortType (val, options) {
            const target = options.find(item => item.value === val)
            return target ? target.text : ''
        }
    },
    props: ['data', 'activeTab', 'index', 'tabTitle'],
    data () {
        return {
            loadStatus: 'loading',
            displayType: localGet('displayType') * 1 || 2,
            displayTypeOptions: [
                { text: this.$t('optional.changePoints'), value: 1 },
                { text: this.$t('optional.changePrice'), value: 2 },
            ],
            sortType: 1,
            sortTypeOptions: [
                { text: this.$t('optional.sortDefault'), value: 1 },
                { text: this.$t('optional.sortIncrease'), value: 2 },
                { text: this.$t('optional.sortDecline'), value: 3 },
            ],
            isFirst: true,
            isPC: window.isPC,
        }
    },
    computed: {
        ...mapState({
            product_map: state => state.ix_quote.product_map,
            selfSymbolList: state => state.selfSymbolList,
            product_activatedId: state => state.ix_quote.product_activatedId,
        }),
        addInfo () {
            const { uiPageList } = this.$store.state.ix_baseInfo.companyInfo
            return (uiPageList && uiPageList.SelfSymbolIndex) ? uiPageList.SelfSymbolIndex : { top: [], bottom: [] }
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        optinalList () { // 自选产品列表
            this.handleTheFirstSelfSymbol()
            return this.data.list
        },
        isGuest () {
            return !getLoginData()
        },
        sortIcon () {
            const enumObj = {
                1: 'default',
                2: 'up',
                3: 'down',
            }
            return enumObj[this.sortType]
        }
    },
    watch: {
        activeTab (newval) {
            if (newval === 0 && this.isPC) {
                if (typeof (this.$refs['admap'][0].$refs.notice) !== 'undefined') {
                    this.$refs['admap'][0].$refs.notice.start()
                }
                this.handleTheFirstSelfSymbol()
            }
        },
        'selfSymbolList.length' () {
            this.sortSelfSymbolList()
        }
    },
    created () {
        this.handleTheFirstSelfSymbol()
    },
    methods: {
        toTab (data) {
            this.$emit('toTab', data)
        },
        // 切换至第一个产品分类
        toProductList () {
            this.toTab(1)
        },
        handleAddOptional () {
            if (this.isGuest) {
                this.$router.push({
                    name: 'Login'
                })
                return
            }
            if (this.isPC) {
                this.$emit('search', true)
                return
            }
            this.$router.push({
                name: 'Search'
            })
        },
        handleDisplayTypeChange (val) {
            localSet('displayType', val)
            this.sortSelfSymbolList()
        },
        handleSortTypeClick () {
            const { sortType, sortTypeOptions } = this
            const newSortType = this.sortType + 1
            const target = sortTypeOptions.find(item => item.value === newSortType)
            if (target) {
                this.sortType = target.value
            } else {
                this.sortType = sortTypeOptions[0].value
            }
            this.sortSelfSymbolList()
        },

        sortSelfSymbolList () {
            const { selfSymbolList, sortType, optinalList, displayType } = this

            const upDownKey = displayType === 1 ? 'upDownAmount_pip' : 'upDownWidth'
            const newList = JSON.parse(JSON.stringify(selfSymbolList))
            const _getUpDownVal = ({ id }, upDownKey) => {
                const target = optinalList.find(item => item.selfSymbol.id === id)
                return (target && target[upDownKey]) ? target[upDownKey].replace('%', '') * 1 : null
            }

            switch (sortType) {
                case 1: {
                    newList.sort((a, b) => {
                        return dayjs(b.createDate, 'YYYY-MM-DD HH:mm:ss').valueOf() - dayjs(a.createDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
                    })
                    break
                }
                case 2: {
                    newList.sort((a, b) => {
                        const value1 = _getUpDownVal(b, upDownKey) || -Math.pow(10, 10)
                        const value2 = _getUpDownVal(a, upDownKey) || -Math.pow(10, 10)
                        return value1 - value2
                    })
                    break
                }
                case 3: {
                    newList.sort((a, b) => {
                        const value1 = _getUpDownVal(a, upDownKey) || Math.pow(10, 10)
                        const value2 = _getUpDownVal(b, upDownKey) || Math.pow(10, 10)
                        return value1 - value2
                    })
                    break
                }
            }

            this.$store.commit('UPDATE_selfSymbolList', newList)
        },

        handleTheFirstSelfSymbol () {
            if (!this.isFirst) {
                return
            }
            this.isFirst = false
            this.sortSelfSymbolList()
            const ids = this.selfSymbolList.map(item => item.symbolId)

            if (window['isPC']) {
                if (this.$route.query.oid) {
                    ids.push(this.$route.query.oid)
                    this.$store.dispatch('setDefaultProduct', this.$route.query.oid)
                } else {
                    this.$store.dispatch('setDefaultProduct')
                }
            }

            this.$ws.send_addSubscription_proList(ids)
        },
        reSubscription () {
            const ids = this.selfSymbolList.map(item => item.symbolId)
            this.$ws.send_addSubscription_proList(ids)
        },
        // 菜单打开时，处理pc的兼容
        menuOpen ($event) {
            if (!window.isPC) return
            const optionalList = this.$refs.optionalList
            const dropdownItem = this.$refs.dropdownItem
            const el = dropdownItem.$el.querySelector('.van-dropdown-item')
            const _width = optionalList.clientWidth
            if (el) el.style.width = _width + 'px'
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.optionalList {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    @include scroll();
    &.whiteBg {
        background: #fff;
    }
    &.pc{
        .optionalListUlWrap {
            .optionalListUl {
                padding:0;
                li {
                    &.active,
                    &:hover {
                        cursor: pointer;
                        background: #f2f2f2;
                    }
                }
            }
        }
    }
}
.optionalListUlWrap {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    @include scroll();
    .optionalListUl {
        background: #fff;
        padding: 10px 0 0;
        li {
            padding: rem(20px) 0;
            border-bottom: 1px solid #f8f8f8;
        }
    }
}

.titleBar {
    background: #f9f9f9;
    color: $muted;
    height: rem(76px);
    line-height: rem(76px);
    padding: 0 rem(30px);
    display: flex;
    justify-content: space-between;
    .van-dropdown-menu {
        background: none;
        height: auto;

        &:after {
            border: none;
        }
        ::v-deep {
            .van-dropdown-menu__title {
                font-size: rem(24px);
                color: rgba(153, 153, 153, 1);
            }
            .van-dropdown-menu__bar {
                height: 100%;
                background: none;
                box-shadow: none;
                .van-dropdown-menu__item:active {
                    opacity: 1;
                }
            }
            .van-dropdown-item__option--active{
                    color: #1989fa;
                    .van-dropdown-item__icon{
                        color: #1989fa;
                    }
            }
        }
    }

    .sortTypeWrap {
        position: relative;
        font-size: rem(24px);
        color: rgba(153, 153, 153, 1);
        padding-right: rem(26px);
        cursor: pointer;
        &:after {
            display: block;
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: rem(20px);
            height: rem(20px);
        }
        &.default:after {
            background: url("../../images/moren_default.png") #fff center center
                no-repeat;
            background-size: rem(20px) auto;
        }
        &.up {
            color: rgb(71, 127, 211);
            &:after {
                background: url("../../images/moren_up.png") #fff center center
                    no-repeat;
                background-size: rem(20px) auto;
            }
        }
        &.down {
            color: rgb(71, 127, 211);
            &:after {
                background: url("../../images/moren_down.png") #fff center
                    center no-repeat;
                background-size: rem(20px) auto;
            }
        }
    }
}
.m-loading {
    text-align: center;
    padding-top: rem(60px);
}
.toProductList {
    display: block;
    margin: 40% auto 0;
    width: rem(200px);
    text-align: center;
    .plusBLock {
        display: block;
        margin: auto;
        width: rem(160px);
        height: rem(160px);
        line-height: rem(160px);
        background: #f2f2f2;
        color: #666;
    }
    .icon_icon_plus {
        font-size: rem(44px);
    }
    .muted {
        padding-top: rem(20px);
        color: $muted;
        font-size: rem(24px);
    }
}

.gotoAdd {
    display: flex;
    height: rem(80px);
    line-height: rem(80px);
    font-size: rem(24px);
    font-weight: 300;
    color: rgba(51, 51, 51, 1);
    padding-left: rem(64px);
    box-sizing: border-box;
    cursor: pointer;
    background: url("../../images/add-optional.png") #fff rem(28px) center
        no-repeat;
    background-size: rem(24px) auto;
}

.adBottom {
    font-size: rem(18px);
    font-weight: 300;
    color: rgba(153, 153, 153, 1);
    line-height: rem(24px);
    margin: rem(30px) 0;
    text-align: center;
    ::v-deep a {
        color: rgba(153, 153, 153, 1);
    }
}
</style>
