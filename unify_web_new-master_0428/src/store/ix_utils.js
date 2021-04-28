import { toFixed, plus, minus, mul } from '@/utils/calculation'
import { marginLevelCalculate, productMarginLevelList, productSamePosition, positionVolumAll, jqhl, calcOpenMargin_YZ } from '@/utils/bzj'

/** @method 计算层级保证金
 * @param {Object} opts 参数 必传
 * @param {Object} opts.product 当前操作的产品对象
 * @param {Object} opts.groupGet websocket下发的GroupGetRet命令里面的content完整对象
 * @param {Object} opts.positionList 持仓列表完整对象
 * @param {Object} opts.groupSymbolMarginLeveMap store.getters['ix_quote/groupSymbolMarginLeveMap']完整对象
 * @param {Number} opts.volume 手数
 * @param {Number} opts.direction 方向 1买入 2卖出
 * @param {Number} opts.usdcnyRate usdcny产品报价的中间价cur_price
 * @param {Number} opts.usdhkdRate usdhkd产品报价的中间价cur_price
 * @return {Number} result 保证金值
 */
export function calcOpenMargin ({ product, groupGet, positionList, groupSymbolMarginLeveMap, volume = 0, direction, usdcnyRate = 1, usdhkdRate = 1 }) {
    return calcOpenMargin_YZ(...arguments)
}

/** @method 保证金水平  (净值/占用保证金*100%)
 * @param {Object} opts 参数 必传
 * @param {Object} opts.assetAboutInfo store.getters.assetAboutInfo完整对象
 * @param {Number} opts.openMargin 保证金
 * @return {Number} result 保证金值 1328.00 显示时需要加上百分号(%)
 */
export function marginLevel ({ assetAboutInfo, openMargin }) {
    const zybzj = Number(assetAboutInfo.accountData.csbzj || 0) + Number(openMargin)
    if (zybzj === 0) return 0
    const jz = assetAboutInfo.accountData.jz || 0
    const num = toFixed((jz / zybzj) * 100)
    return num === Infinity ? 0 : num
}

/** 止盈止损公式
 * 1、市价卖
 止损价格范围：卖价+最小点数转价格<=X<=卖价+最大点数转价格
 止盈价格范围：卖价-最大点数转价格 <=X<=卖价-最小点数转价格
 2、市价买
 止损价格范围：买价-最大点数转价格<=X<=买价-最小点数转价格
 止盈价格范围：买价+最小点数转价格<=X<=买价+最大点数转价格
 */
/** @method 止损范围最小值
 * @param {Object} opts 参数 必传
 * @param {Object} opts.groupSymbol 当前操作的产品对应的groupSymbol对象(这里需要取store.state.ix_quote.product_map下面对应产品的groupSymbol属性)
 * @param {Number} opts.direction 方向 1买入 2卖出
 * @param {Number} opts.price 1.挂单时直接取挂单价 2.非挂单时再取产品的实时报价，买方向时传b1，卖方向时传a1
 * @return {Number} result
 */
export function minStop ({ groupSymbol, direction, price }) {
    if (!groupSymbol) return -Infinity
    const min = Number(direction) === 1 ? minus(price, groupSymbol.max_stop_level_price) : plus(price, groupSymbol.stop_level_price)
    return toFixed(min, groupSymbol.digits)
}

/** @method 止损范围最大值
 * @param {Object} opts 参数和minStop一致
 */
export function maxStop ({ groupSymbol, direction, price }) {
    if (!groupSymbol) return Infinity
    const max = Number(direction) === 1 ? minus(price, groupSymbol.stop_level_price) : plus(price, groupSymbol.max_stop_level_price)
    return toFixed(max, groupSymbol.digits)
}

/** @method 止盈范围最小值
 * @param {Object} opts 参数和minStop一致
 */
export function minProfit ({ groupSymbol, direction, price }) {
    if (!groupSymbol) return -Infinity
    const min = Number(direction) === 1 ? plus(price, groupSymbol.stop_level_price) : minus(price, groupSymbol.max_stop_level_price)
    return toFixed(min, groupSymbol.digits)
}

/** @method 止盈范围最大值
 * @param {Object} opts 参数和minStop一致
 */
export function maxProfit ({ groupSymbol, direction, price }) {
    if (!groupSymbol) return -Infinity
    const max = Number(direction) === 1 ? plus(price, groupSymbol.max_stop_level_price) : minus(price, groupSymbol.stop_level_price)
    return toFixed(max, groupSymbol.digits)
}
/** @method 市价止盈止损范围价格点
 * @param {Object} product 当前操作的产品对象
 * @param {Number} price 价格
 * @param {Number} direction 方向 1买入 2卖出
 * @return {Object} 返回对象里面的{P1,P2,P3,L1,L2,L3}按照原型里面的数据意义定义
 *                  P1 止盈最小值， P2 止盈最大值， P3 股票类加40%幅度判断，
 *                  L1 止损最大值， L2 止损最小值， L3 股票类减40%幅度判断
 */
export function profitStopRange (price, product, direction) {
    const stop_level_price = product.groupSymbol.stop_level_price
    const max_stop_level_price = product.groupSymbol.max_stop_level_price
    return {
        L1: direction === 1 ? minus(price, stop_level_price) : plus(price, max_stop_level_price),
        L2: direction === 1 ? minus(price, max_stop_level_price) : plus(price, stop_level_price),
        L3: toFixed(price * (direction === 1 ? 0.6 : 1.4), product.digit),
        P1: direction === 1 ? plus(price, max_stop_level_price) : minus(price, stop_level_price),
        P2: direction === 1 ? plus(price, stop_level_price) : minus(price, max_stop_level_price),
        P3: toFixed(price * (direction === 1 ? 1.4 : 0.6), product.digit),
    }
}

/** @method 止盈止损价格步长
 * @param {Object} groupSymbol 当前操作的产品对应的groupSymbol对象
 */
export function profitStopStep (groupSymbol) {
    if (!groupSymbol) return 0.01
    return toFixed(groupSymbol.pips_ratio * Math.pow(0.1, groupSymbol.digits), groupSymbol.digits) * 1
}

/**
 *  挂单价格范围
    限价卖出： 卖价+最小点数转价格 <=X<=卖价+最大点数转价格
    限价买入： 买价-最大点数转价格  <=X<=买价-最小点数转价格

    停损卖出： 卖价-最大点数转价格 <=X<=卖价-最小点数转价格
    停损买入： 买价+最小点数转价格 <=X<=买价+最大点数转价格
 */

/** @method 挂单价格步长
 * @param {Object} groupSymbol 当前操作的产品对应的groupSymbol对象
 */
export function pendingOrderStep (groupSymbol) {
    if (!groupSymbol) return 0.01
    return toFixed(groupSymbol.pips_ratio * Math.pow(0.1, groupSymbol.digits), groupSymbol.digits) * 1
}
/** @method 挂单价范围的价格点
 * @param {Object} product 当前操作的产品对象
 * @param {Number} direction 方向 1买入 2卖出
 * @return {Object} 返回对象里面的{b1,b2,b3,b4,b5,b6}按照原型里面的数据意义定义
 *                  b1 停损最大值， b2 停损最小值，b3 限价最大值，
 *                  b4 限价最小值，b5 股票类加40%幅度判断， b6 股票类减40%幅度判断
 *                  default 默认填充价格
 */
export function pendingRangePrices (product, direction) {
    const stop_level_price = product.groupSymbol.stop_level_price
    const max_stop_level_price = product.groupSymbol.max_stop_level_price
    const price = direction === 1 ? product.buy_price : product.sell_price
    return {
        defaultPrice: pendingPriceDefault(product, direction),
        b1: plus(price, max_stop_level_price),
        b2: plus(price, stop_level_price),
        b3: minus(price, stop_level_price),
        b4: minus(price, max_stop_level_price),
        b5: toFixed(price * 1.4, product.digit),
        b6: toFixed(price * 0.6, product.digit),
    }
}
/** @method 挂单价默认值
 * @param {Object} product 当前操作的产品对象
 * @param {Number} direction 方向 1买入 2卖出
 */
export function pendingPriceDefault (product, direction) {
    const point = Math.pow(0.1, product.digit)
    const stoplevel = product.groupSymbol.stop_level + 10
    const stoplevelPrice = toFixed(stoplevel * point, product.digit)
    return direction === 1 ? minus(product.buy_price, stoplevelPrice) : plus(product.sell_price, stoplevelPrice)
}
/** @method 止盈止损价格默认值
 * @param {Number} type 方向 1止损 2止盈
 * @param {Object} product 当前操作的产品对象
 * @param {Number} direction 方向 1买入 2卖出
 * @param {Number} price 价格 买入方向传买入价，卖出方向传卖出价，挂单传挂单价
 */
export function profitLossPriceDefault (type, product, direction, price) {
    const point = Math.pow(0.1, product.digit)
    const stoplevel = product.groupSymbol.stop_level + 10
    const stoplevelPrice = toFixed(stoplevel * point, product.digit)
    if (direction === 1) {
        return type === 1 ? minus(price, stoplevelPrice) : plus(price, stoplevelPrice)
    } else {
        return type === 1 ? plus(price, stoplevelPrice) : minus(price, stoplevelPrice)
    }
}
/* 节流函数 */
export function throttle (func, wait = 200) {
    let last = 1
    let timer
    return function (...rest) {
        const now = +new Date()
        if (last && now - last < wait) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                last = now
                func.apply(this, rest)
            }, wait)
        } else {
            last = now
            func.apply(this, rest)
            clearTimeout(timer)
        }
    }
}
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce (func, wait = 200, immediate = false) {
    let timer
    return function (...rest) {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timer = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}

/**
 * @desc 函数防抖(用于异步Promise)
 * @param func 函数
 * @param wait 延迟执行毫秒数
 */
export function debouncePromise (func, wait = 200) {
    let timer
    return function (...rest) {
        return new Promise((resolve, reject) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                resolve(func.apply(this, rest))
            }, wait)
        })
    }
}

export function profitOrLoss_YZ (params) {
    if (!params.buy_price || !params.sell_price || (params.interest_exchange && !params.exchange_buy_price && !params.exchange_sell_price)) {
        return {
            profitOrLoss: '--',
            exchangeRate: '--'
        }
    }
    if (params.base_currency !== 'USD' && params.profit_currency !== 'USD') {
        // 交叉货币或者其他

        if (params.profit_currency === params.interest_exchange_profit) {
            // 交叉间接货币
            // 买入方向，浮动盈亏（USD）=（市价-开仓价）*合约单位*手数/该相对货币兑美元卖出方向即时汇率
            // 卖出方向，浮动盈亏（USD）=（开仓价-市价）*合约单位*手数/该相对货币兑美元买入方向即时汇率

            if (parseInt(params.direction) === 1) {
                const exchangeRate = params.sell_price - params.order_price > 0 ? params.exchange_buy_price : params.exchange_sell_price
                return {
                    profitOrLoss: ((params.sell_price - params.order_price) * params.contract_size * params.volume) / exchangeRate,
                    exchangeRate: 1 / exchangeRate
                }
            } else if (parseInt(params.direction) === 2) {
                const exchangeRate = params.order_price - params.buy_price > 0 ? params.exchange_buy_price : params.exchange_sell_price
                return {
                    profitOrLoss: ((params.order_price - params.buy_price) * params.contract_size * params.volume) / exchangeRate,
                    exchangeRate: 1 / exchangeRate
                }
            }
        } else {
            // 交叉直接货币
            // 买入方向，浮动盈亏（USD）=（市价-开仓价）*合约单位*手数*该相对货币兑美元卖出方向即时汇率
            // 卖出方向，浮动盈亏（USD）=（开仓价-市价）*合约单位*手数*该相对货币兑美元买入方向即时汇率

            if (parseInt(params.direction) === 1) {
                const exchangeRate = params.sell_price - params.order_price > 0 ? params.exchange_sell_price : params.exchange_buy_price
                return {
                    profitOrLoss: (params.sell_price - params.order_price) * params.contract_size * params.volume * exchangeRate,
                    exchangeRate: exchangeRate
                }
            } else if (parseInt(params.direction) === 2) {
                const exchangeRate = params.order_price - params.buy_price > 0 ? params.exchange_sell_price : params.exchange_buy_price
                return {
                    profitOrLoss: (params.order_price - params.buy_price) * params.contract_size * params.volume * exchangeRate,
                    exchangeRate: exchangeRate
                }
            }
        }
    } else if (params.base_currency === 'USD' && params.profit_currency !== 'USD') {
        // 间接货币
        // 买入方向，浮动盈亏（USD）=（市价-开仓价）*合约单位*手数/(盈亏>0?'美元相对货币卖出即时汇率':'美元相对货币买入即时汇率')
        // 卖出方向，浮动盈亏（USD）=（开仓价-市价）*合约单位*手数/(盈亏>0?'美元相对货币卖出即时汇率':'美元相对货币买入即时汇率')
        if (parseInt(params.direction) === 1) {
            const exchangeRate = params.sell_price - params.order_price > 0 ? params.buy_price : params.sell_price
            return {
                profitOrLoss: ((params.sell_price - params.order_price) * params.contract_size * params.volume) / exchangeRate,
                exchangeRate: 1 / exchangeRate
            }
        } else if (parseInt(params.direction) === 2) {
            const exchangeRate = params.order_price - params.buy_price > 0 ? params.buy_price : params.sell_price
            return {
                profitOrLoss: ((params.order_price - params.buy_price) * params.contract_size * params.volume) / exchangeRate,
                exchangeRate: 1 / exchangeRate
            }
        }
    } else {
        // 直接货币
        // 买入方向，浮动盈亏（USD）=（市价-开仓价）*合约单位*手数
        // 卖出方向，浮动盈亏（USD）=（开仓价-市价）*合约单位*手数
        if (parseInt(params.direction) === 1) {
            return {
                profitOrLoss: (params.sell_price - params.order_price) * params.contract_size * params.volume,
                exchangeRate: 1
            }
        } else if (parseInt(params.direction) === 2) {
            return {
                profitOrLoss: (params.order_price - params.buy_price) * params.contract_size * params.volume,
                exchangeRate: 1
            }
        }
    }
}

/**
 * @desc 计算 1点表示
 * @param groupSymbol 产品对象数据的groupSymbol属性
 */
export function pipCalc (groupSymbol) {
    // （现货_Pip） = 现货_Point x 大点比率
    const pips_ratio = groupSymbol.pips_ratio
    const point = Math.pow(0.1, groupSymbol.digits)
    return (point * pips_ratio).toFixed(6) * 1
}

/**
 * @desc 计算 1手点值（收益货币）
 * @param product 产品对象数据
 */
export function volumePips (product) {
    // 合约大小 x PIP x 1
    const pip = product.groupSymbol.pip
    return (product.groupSymbol.contract_size * pip).toFixed(6) * 1
}

/**
 * @desc 计算 1手点值（USD货币）
 * @param type 使用场景， contract 合约详情、图表  buy 开仓_买入 sell 开仓_卖出
 * @param product 产品对象数据
 * @param relativeProduct 收益货币兑美元的产品对象数据
 */
export function volumePipsAccount (type, product, relativeProduct) {
    const pip = volumePips(product)
    const groupSymbol = product.groupSymbol
    if (groupSymbol.profit_currency === 'USD') {
        // 1手点值（收益货币）
        return pip
    }
    const price = relativeProduct.groupSymbol.profit_currency === 'USD' ? relativeProduct.buy_price : relativeProduct.sell_price
    if (relativeProduct.groupSymbol.profit_currency === 'USD') {
        // 1手点值（收益货币）x 【收益货币/美元】的中间价
        return pip * price
    } else if (relativeProduct.groupSymbol.base_currency === 'USD') {
        // 1手点值（收益货币） / 【美元/收益货币】的中间价
        return pip / price
    }
    return null
}

/**  @desc 一个USD币种的价格转换成另外一个币种的价格
 *  @param price 价格
 *  @param targetProduct 目标币种的产品
 **/
export function priceTransformByCurrency (price, targetProduct) {
    if (targetProduct.groupSymbol.profit_currency === 'USD') {
        return price / targetProduct.sell_price
    } else if (targetProduct.groupSymbol.base_currency === 'USD') {
        return price * targetProduct.buy_price
    }
}

/**  @desc 一个币种A的价格转换成另外USD币种的价格
 *  @param price 价格
 *  @param targetProduct 币种A兑USD币种的产品
 **/
export function priceTransformToUSD (price, targetProduct) {
    if (targetProduct.groupSymbol.profit_currency === 'USD') {
        return price * targetProduct.buy_price
    } else if (targetProduct.groupSymbol.base_currency === 'USD') {
        return price / targetProduct.sell_price
    }
}

/**  @desc 计算手数加减档控件
 *  @param volume 输入框里面的手数
 *  @param volumes_min 最小手数
 **/
export function volumeStepControl (volume, volumes_min) {
    const rangConfig = [
        { min: 0.01, max: 0.1, double1: 2, double2: 4 },
        { min: 0.1, max: 1, double1: 2, double2: 4 },
        { min: 1, max: 10, double1: 2, double2: 4 },
        { min: 10, max: 50, double1: 0.2, double2: 0.4 },
        { min: 50, max: 100, double1: 0.1, double2: 0.2 },
        { min: 100, max: 500, double1: 0.1, double2: 0.2 },
        { min: 500, max: 1000, double1: 0.1, double2: 0.2 }
    ]
    const first = rangConfig[0]
    if (volume < first.min) return creatVolumesList(volumes_min, first.double1, first.double2)
    for (let key = 0; key < rangConfig.length; key++) {
        const el = rangConfig[key]
        if (volume >= el.min && volume < el.max) {
            return creatVolumesList(key === 0 ? volumes_min : el.min, el.double1, el.double2)
        }
    }
    const last = rangConfig[rangConfig.length - 1]
    return creatVolumesList(last.min, last.double1, last.double2)
    function creatVolumesList (n, double1, double2) {
        return [mul(n, double2 * -1), mul(n, double1 * -1), mul(n, double1), mul(n, double2)]
    }
}
/** 某货币兑美元的产品
 * @param currency 某货币
 * @param product_list 产品列表对象数据
 */
export function currencyToUSD (currency, product_list) {
    if (currency === 'USD') return null
    const targetProduct = product_list.find(el => {
        const groupSymbol = el.groupSymbol
        return (groupSymbol.base_currency == currency && groupSymbol.profit_currency === 'USD') || (groupSymbol.profit_currency == currency && groupSymbol.base_currency === 'USD')
    })
    return targetProduct
}
/** 该产品盈利货币兑美元的币种
 * @param product 产品对象数据
 * @param product_list 产品列表对象数据
 */
export function profitToUSD (product, product_list) {
    const { profit_currency } = product.groupSymbol
    if (profit_currency === 'USD') return product
    return currencyToUSD(profit_currency, product_list)
}

/** 挂单价范围
 *  @param price 价格
 *  @param groupSymbol 产品对象数据的groupSymbol属性
 */
export function pendingPriceRange (price, groupSymbol) {
    return {
        min: minus(price, groupSymbol.stop_level_price),
        min: plus(price, groupSymbol.stop_level_price),
    }
}

/** 手续费盈亏 USD币种转盈利币种
 *  @param fee 价格
 *  @param profitToUSD 收益货币兑美元的产品对象数据
 */
export function USDToFee (fee, profitToUSD) {
    const sell_price = profitToUSD.sell_price ?? 1
    const buy_price = profitToUSD.buy_price ?? 1
    if (profitToUSD.groupSymbol.profit_currency === 'USD') {
        const rate = fee > 0 ? buy_price : sell_price
        return fee / rate
    } else if (profitToUSD.groupSymbol.base_currency === 'USD') {
        const rate = fee > 0 ? sell_price : buy_price
        return fee * rate
    }
}
/** 手续费盈亏 盈利币种转USD币种
 *  @param fee 价格
 *  @param profitToUSD 收益货币兑美元的产品对象数据
 */
export function feeToUSD (fee, profitToUSD) {
    const sell_price = profitToUSD.sell_price ?? 1
    const buy_price = profitToUSD.buy_price ?? 1
    if (profitToUSD.groupSymbol.profit_currency === 'USD') {
        const rate = fee > 0 ? sell_price : buy_price
        return fee * rate
    } else if (profitToUSD.groupSymbol.base_currency === 'USD') {
        const rate = fee > 0 ? buy_price : sell_price
        return fee / rate
    }
}
