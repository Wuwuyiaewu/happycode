import { mapState, mapGetters } from 'vuex'
import { plus, minus, getDecimalNum, toFixed } from '@/utils/calculation'
import { marginLevelCalculate } from '@/utils/bzj'
import { calcOpenMargin, marginLevel } from '@/store/ix_utils'
export default {
    computed: {
        ...mapState({
            userLoginInfo: state => state.ix_user.userLoginInfo,
            groupGet: state => state.ix_user.groupGet,
            baseSymbol: state => state.ix_quote.baseSymbol,
            product_map: state => state.ix_quote.product_map,
            product_list: state => state.ix_quote.product_list,
            postionList: state => state.ix_user.postionList
        }),
        ...mapGetters(['style', 'assetAboutInfo', 'symbolCode', 'companyInfo']),
        adminMarginLevel () {
            try {
                return JSON.parse(this.companyInfo.transBaseConfigVo.marginLevel)
            } catch (error) {
                return { marginWarn: this.userLoginInfo.margin_stop_out }
            }
        },
        marginCurrency () {
            // 保证金币种
            return this.groupSymbol.margin_currency
        },
        usdcny () {
            const id = String(this.baseSymbol.USDCNY)
            const product_map = this.product_map
            return product_map ? product_map[id] : {}
        },
        usdhkd () {
            const id = String(this.baseSymbol.USDHKD)
            const product_map = this.product_map
            return product_map ? product_map[id] : {}
        },
        // 该产品同方向的持仓列表
        productSamePosition () {
            const symbolName = this.groupSymbol.name
            const direction = this.$route.query.direction === 'buy' ? 1 : 2
            const productsByPosition = this.postionList.filter(el => el.symbol === symbolName && el.direction * 1 === direction)
            return productsByPosition
        },
        // 该产品的保证金列表
        productMarginLevelList () {
            const groupSymbolMarginLeveMap = this.$store.getters['ix_quote/groupSymbolMarginLeveMap'] || {}
            let resultList = groupSymbolMarginLeveMap[this.groupSymbol.id] || []
            if (this.margin_type === 1 && this.marginCurrency === 'HKD') {
                // 处理HKD币种的保证金
                const usdhkdRate = this.usdhkd && this.usdhkd['cur_price'] ? this.usdhkd['cur_price'] : 1
                resultList = resultList.map(el => {
                    const margin = (el.margin_initial / usdhkdRate).toFixed(5) * 1
                    return Object.assign({}, el, { margin_initial: margin })
                })
            }
            return resultList
        },
        margin_type () {
            // 为1 标示开启层级保证金，0 标识关闭
            return this.groupGet.margin_type
        },
        // 手数小数位
        decimalLen () {
            return getDecimalNum(this.groupSymbol.volumes_step)
        },
        // 可用保证金
        freeMargin () {
            return toFixed(this.assetAboutInfo.accountData.kybzj)
            // return toFixed(this.assetAboutInfo.accountData.kybzj - Number(this.openMargin))
        },
        // 保证金水平  (净值/占用保证金*100%)
        marginLevel () {
            if (!this.assetAboutInfo) return 0
            return marginLevel({
                assetAboutInfo: this.assetAboutInfo,
                openMargin: this.openMargin
            })
        },
        // 保证金不足警告
        /* 保证金水平 > 预警水平时，显示：“当前保证金充足”
           预警水平 >= 保证金水平 > 强平水平 时，显示：“保证金过低，建议追回资金”
           保证金水平 <= 强平水平 时，显示：“保证金太低，开仓将有强平风险”
        */
        bzjWarn () {
            const jz = this.assetAboutInfo.accountData.jz || 0 // 净值
            const margin_call_level = this.userLoginInfo.margin_call_level
            const margin_stop_out = this.userLoginInfo.margin_stop_out
            const marginLevel = this.marginLevel * 1 || 0
            if (marginLevel > margin_call_level) {
                return 1
            } else if (marginLevel <= margin_call_level && marginLevel > margin_stop_out) {
                return 2
            } else {
                return 3
            }
        },
        activeColor () {
            const colors = {
                '1': '#59b668',
                '2': '#EFA017',
                '3': '#e3525c'
            }
            return colors[this.bzjWarn]
        },
        // positionVolumAll 该产品同方向手数总和
        positionVolumAll () {
            const productSamePosition = this.productSamePosition
            const positionVolumAll = productSamePosition.reduce((acc, cur) => {
                return plus(acc, cur.volume)
            }, 0)
            return positionVolumAll * 1
        },
        // 该产品同方向持仓保证金
        bzjAmountPosition () {
            return marginLevelCalculate(this.positionVolumAll, this.productMarginLevelList) * 1
        },
        // 该产品基础货币兑美元的币种, YZ平台需要
        relativeProduct () {
            const symbol = this.groupSymbol
            if (!symbol || !symbol.id) return {}
            const product_list = this.product_list
            const base_currency = symbol.base_currency
            const targetProduct = product_list.find(el => {
                const groupSymbol = el.groupSymbol
                return (groupSymbol.base_currency == base_currency && groupSymbol.profit_currency === 'USD') || (groupSymbol.profit_currency == base_currency && groupSymbol.base_currency === 'USD')
            })
            return targetProduct
        },
        // YZ平台保证金汇率 (基础货币如果不是USD,则为基础货币兑换美元买入方向报价)
        YZ_rate () {
            const symbol = this.groupSymbol
            if (!symbol || !symbol.id) {
                return 1
            } else if (symbol.base_currency === 'USD') {
                return 1
            } else if (symbol.profit_currency === 'USD') {
                return this.product.buy_price * 1
            } else {
                const targetPro = this.relativeProduct
                return (targetPro && targetPro.buy_price) || 1
            }
        }
    },
    methods: {
        /** 根据最小手数步长格式化下单手数
         * valum 手数
         * type round 向靠近的手数取值，  floor 向较低的手数取值
         */
        formatVolum (valum, type = 'round') {
            const step = this.step
            const decimalNum = getDecimalNum(step)
            const m = (valum % step).toFixed(decimalNum)
            if (Number(m) !== step && Number(m) !== 0) {
                valum = m < step / 2 || type === 'floor' ? minus(valum, m) : plus(valum, minus(step, m))
            }
            return valum
        },
        // 计算保证金
        openMarginFn (volume) {
            let usdcnyRate = 1
            const direction = this.$route.query.direction === 'buy' ? 1 : 2
            const usdcny = this.usdcny
            if (usdcny && usdcny['cur_price']) {
                usdcnyRate = usdcny.buy_price // direction === 1 ? usdcny.buy_price : usdcny.sell_price
            }
            return calcOpenMargin({
                product: this.product,
                groupGet: this.groupGet,
                positionList: this.postionList,
                relativeProduct: this.relativeProduct, // YZ平台使用
                YZ_rate: this.YZ_rate, // YZ平台使用
                groupSymbolMarginLeveMap: this.$store.getters['ix_quote/groupSymbolMarginLeveMap'] || {},
                volume: volume,
                direction: this.$route.query.direction === 'buy' ? 1 : 2,
                usdcnyRate: usdcnyRate,
                usdhkdRate: this.usdhkd && this.usdhkd['cur_price'] ? this.usdhkd['cur_price'] : 1
            })
        }
    }
}
