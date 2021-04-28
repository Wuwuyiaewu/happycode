/**
 * 计算层级保证金
 * volume {Number} 手数(下单手数+持仓手数之和)
 * marginLevels 该产品对应的层级保证金列表
 */
import { toFixed, plus } from './calculation'
export function marginLevelCalculate (volume, marginLevels = []) {
    let amount = 0
    if (volume * 1 === 0 || marginLevels.length === 0) return 0
    const len = marginLevels.length
    const last = marginLevels[len - 1]
    let lastAmount = 0
    amount = marginLevels.reduce((acc, cur, index) => {
        return acc + calculateMarginItem(volume, cur)
    }, 0)
    if (volume > last.range_max) {
        lastAmount = (volume - last.range_max) * last.margin_initial
    }
    return toFixed(amount + lastAmount)
}
/* 计算每个层级的保证金 */
function calculateMarginItem (volume, marginItem) {
    if (volume >= marginItem.range_min && volume <= marginItem.range_max) {
        return (volume - marginItem.range_min) * marginItem.margin_initial
    } else if (volume < marginItem.range_min) {
        return 0
    } else if (volume > marginItem.range_max) {
        return (marginItem.range_max - marginItem.range_min) * marginItem.margin_initial
    }
}

/** 根据层级保证金计算金额对应的手数 ( 层级保证金使用 )
 * amount 金额
 * marginLevelAmountList 每组层级保证金的最大金额列表
 * marginLevels 层级保证列表
 */
export function marginLevelVolume (amount, marginLevelAmountList, marginLevels = []) {
    if (marginLevels.length === 0) return 0
    let index = 0 // 金额对应的第几个层级保证金
    let volume = 0 // 手数
    const marginLevelLen = marginLevels.length
    marginLevelAmountList.forEach((el, i) => {
        if (amount > el * 1) index = i + 1
    })

    if (index === 0) {
        volume = amount / marginLevels[index].margin_initial
    } else {
        const i = index >= marginLevelLen ? marginLevelLen - 1 : index
        const indexMarginLevel_amount = amount - marginLevelAmountList[index - 1]
        const marginLevel = marginLevels[i]
        volume = indexMarginLevel_amount / marginLevel.margin_initial
        volume += index < marginLevelLen ? marginLevel.range_min : marginLevel.range_max
    }
    return volume
}
/** 根据层级保证金计算金额对应的手数 ( 层级保证金使用 ) (YZ 平台) 根据下面(YZ_bzj)的公式逆推
 *  保证金比例: (数量*第一层万分比+数量*第二层万分比+...)/总数量
 *  直接货币：数量*保证金比例*rate
    间接货币：数量*保证金比例
    交叉货币直接盘：数量*保证金比例*基础货币兑换美元的买入报价
    交叉货币间接盘：数量*保证金比例/基础货币兑换美元的卖出报价
 */
export function marginLevelVolume_yz (amount, marginLevelAmountList, marginLevels = [], product, relativeProduct, direction, YZ_rate) {
    if (amount == 0 || marginLevels.length === 0) return 0
    const groupSymbol = product.groupSymbol
    let index = 0 // 金额对应的第几个层级保证金
    let volume = 0 // 手数
    let num = 0 // 交易数量
    let bzjbiliAmount = 0 // 保证金比例对应的金额
    marginLevelAmountList.forEach((el, i) => {
        if (amount > el * 1) index = i + 1
    })
    if (index >= marginLevelAmountList.length - 1) index = marginLevelAmountList.length - 1
    if ([8].indexOf(product.market_id) === -1) {
        const price = direction === 1 ? product.buy_price : product.sell_price
        if (groupSymbol.base_currency === 'USD') {
            bzjbiliAmount = amount / price
        } else if (relativeProduct.groupSymbol.profit_currency === 'USD') {
            bzjbiliAmount = amount / price / relativeProduct.buy_price
        } else {
            bzjbiliAmount = (amount / price) * relativeProduct.sell_price
        }
    } else if (groupSymbol.profit_currency === 'USD') {
        // 直接货币
        bzjbiliAmount = amount / YZ_rate
    } else if (groupSymbol.base_currency === 'USD') {
        // 间接货币
        bzjbiliAmount = amount
    } else if (relativeProduct.groupSymbol.profit_currency === 'USD') {
        // 交叉货币直接盘
        bzjbiliAmount = amount / Number(relativeProduct.buy_price)
    } else if (relativeProduct.groupSymbol.base_currency === 'USD') {
        // 交叉货币间接盘
        bzjbiliAmount = amount * Number(relativeProduct.sell_price)
    }
    num = calcMarginBili_yz(marginLevels, bzjbiliAmount, index)
    volume = num / groupSymbol.contract_size
    return volume
}

// 计算保证金比例对应的保证金层级的手数  YZ用保证金规则用
function calcMarginBili_yz (marginLevels = [], bzjbiliAmount, index) {
    let num = 0
    if (index === 0) {
        num = bzjbiliAmount / (marginLevels[0].margin_initial / 10000)
    } else {
        marginLevels.forEach((el, i, originArr) => {
            if (i < index) {
                bzjbiliAmount -= (el.margin_initial / 10000) * (el.range_max - el.range_min)
            } else if (i === index) {
                num = bzjbiliAmount / (el.margin_initial / 10000) + el.range_min
            }
        })
    }
    return num
}

/** 该产品同方向的持仓列表
 * positionList 持仓列表
 * symbolName 产品的symbolname
 * direction 方向 1买入 2卖出
 */
export function productSamePosition (positionList, symbolName, direction) {
    const productsByPosition = positionList.filter(el => el.symbol === symbolName && el.direction * 1 === direction)
    return productsByPosition
}
/** 该产品同方向手数总和
 * positionList 持仓列表
 * symbolName 产品的symbolname
 * direction 方向 1买入 2卖出
 */
export function positionVolumAll (positionList, symbolName, direction) {
    const samePosition = productSamePosition(positionList, symbolName, direction)
    const volumAll = samePosition.reduce((acc, cur) => {
        return plus(acc, cur.volume)
    }, 0)
    return volumAll * 1
}

// 该产品的保证金列表
export function productMarginLevelList ({ groupSymbol, groupSymbolMarginLeveMap, groupGet, usdhkdRate = 1 }) {
    // const groupSymbolMarginLeveMap = getters['groupSymbolMarginLeveMap'] || {}
    let resultList = groupSymbolMarginLeveMap[groupSymbol.id] || []
    // const groupGet = rootState.ix_user.groupGet
    if (groupGet.margin_type === 1 && groupSymbol.margin_currency === 'HKD') {
        // 处理HKD币种的保证金
        // const usdhkd = state.product_map[String(baseSymbol.USDHKD)]
        // const usdhkdRate = usdhkd && usdhkd['cur_price'] ? usdhkd['cur_price'] : 1
        resultList = resultList.map(el => {
            const margin = (el.margin_initial / usdhkdRate).toFixed(5) * 1
            return Object.assign({}, el, { margin_initial: margin })
        })
    }
    return resultList
}
/** 计算加权汇率
 * openVolume 开仓手数，传openVolume计算的是开仓的加权汇率，不传openVolume计算的是持仓中的加权汇率
 */
export function jqhl (openVolume, productSamePosition) {
    // positionVolumAll 该产品同方向手数总和
    let positionVolumAll = productSamePosition.reduce((acc, cur) => {
        return acc + cur.volume
    }, 0)
    // positionRateAll 该产品同方向汇率总和
    let positionRateAll = productSamePosition.reduce((acc, cur) => {
        return acc + cur.volume * cur.open_margin_rate
    }, 0)
    if (openVolume) {
        const usdcnyRate = this.usdcny && this.usdcny['cur_price'] ? this.usdcny['cur_price'] : 1
        positionVolumAll += Number(openVolume)
        positionRateAll += openVolume * usdcnyRate
    }
    if (positionVolumAll === 0) {
        return 1
    }
    return positionRateAll / positionVolumAll
}

/** 计算YZ平台保证金
 * 保证金比例   (数量*第一层万分比+数量*第二层万分比+...)/总数量
 * */
export function calcOpenMargin_YZ ({ product, groupGet, relativeProduct, groupSymbolMarginLeveMap, volume = 0, direction, YZ_rate, usdhkdRate = 1, usdcnyRate = 1, zone }) {
    if (!product || !volume || Number(volume) === 0) return '0.00'
    const groupSymbol = product.groupSymbol
    const proMarginLevelList = productMarginLevelList({ groupSymbol, groupSymbolMarginLeveMap, groupGet, usdhkdRate }) // 该产品的层级保证金列表
    const num = volume * groupSymbol.contract_size // 计算出数量
    let bzj_bili = marginLevelCalculate(num, proMarginLevelList) // 拿到的是后台设置的万分比
    bzj_bili = bzj_bili / num / 10000 // 后台设置的是万分比
    // console.log('bzj_bili', volume, bzj_bili)
    const result_bzj = YZ_bzj({ product, relativeProduct, num, bzj_bili, YZ_rate, direction })
    if (groupGet.currency !== 'CNY') usdcnyRate = 1
    return result_bzj * usdcnyRate
}
/** YZ保证金
 * @param {Object} opts 参数 必传
 * @param {Object} opts.num 数量
 * @param {Object} opts.bzj_bili 保证金比例
 * @param {Object} opts.rate 汇率
 * @return {Number} result 保证金值
 */
/** 外汇-保证金
 *          直接货币：数量*保证金比例 * rate
            间接货币：数量*保证金比例
            交叉货币直接盘：数量*保证金比例*基础货币兑换美元的买入报价
            交叉货币间接盘：数量*保证金比例/基础货币兑换美元的卖出报价
 * */
export function YZ_bzj ({ product, relativeProduct, num, bzj_bili, YZ_rate = 1, direction }) {
    const groupSymbol = product.groupSymbol
    let bzj = 0

    if ([8].indexOf(product.market_id) === -1) {
        // 买仓：ask顶层价*数量*保证金比例*rate
        // 卖仓：bid顶层报价*数量*保证金比例*rate
        const price = direction === 1 ? product.buy_price : product.sell_price
        if (groupSymbol.base_currency === 'USD') {
            bzj = price * num * bzj_bili * 1
        } else if (relativeProduct && relativeProduct.groupSymbol.profit_currency === 'USD') {
            bzj = price * num * bzj_bili * relativeProduct.buy_price
        } else if (relativeProduct) {
            bzj = (price * num * bzj_bili) / relativeProduct.sell_price
        }
    } else if (groupSymbol.profit_currency === 'USD') {
        // 直接货币
        bzj = num * bzj_bili * YZ_rate
    } else if (groupSymbol.base_currency === 'USD') {
        // 间接货币
        bzj = num * bzj_bili
    } else if (relativeProduct && relativeProduct.groupSymbol.profit_currency === 'USD') {
        // 交叉货币直接盘
        bzj = num * bzj_bili * relativeProduct.buy_price
    } else if (relativeProduct && relativeProduct.groupSymbol.base_currency === 'USD') {
        // 交叉货币间接盘
        bzj = (num * bzj_bili) / relativeProduct.sell_price
    }
    return bzj || 0
}
