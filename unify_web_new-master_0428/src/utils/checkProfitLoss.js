import { toFixed } from '@/utils/calculation'
/**
 * 比较止盈止损价格
 * https://testdocs.ixmiddle.com/pd/Trade/IX_H5_3.3.0/#g=1&p=%E7%8E%B0%E8%B4%A7_%E6%AD%A2%E6%8D%9F%E6%AD%A2%E7%9B%88
 */

/**
 * 市价下单比较
 * @param {*} type  stopLoss 止损  profit 止盈
 * @param {*} direction  1 买入 2卖出
 * @param {*} price  价格
 * @param {*} profitStopRange 止盈止损范围的对象，包含L1,L2,L3,P1,P2,P3
 * @param {*} product 产品数据对象
 * @param {*} $t i18n多语言的方法
 * @return  {*} false 在正常范围内， 否则返回具体的错误信息
 */
export function profitLossPriceCompare (type, direction, price, profitStopRange, product, $t) {
    const { L1, L2, L3, P1, P2, P3 } = profitStopRange
    price = price * 1
    if (direction === 1) {
        if (type === 'stopLoss') {
            const min = product.isStock ? L3 : L2
            if (price > L1) {
                return $t('trade.takeLoss') + $t('trade.profitLossWarnTip1', ['≤' + toFixed(L1, product.digit)])
            } else if (price < min) {
                return $t('trade.takeLoss') + $t('trade.profitLossWarnTip2')
            } else {
                return false
            }
        } else if (type === 'profit') {
            const max = product.isStock ? P3 : P1
            if (price < P2) {
                return $t('trade.takeProfit') + $t('trade.profitLossWarnTip1', ['≥' + toFixed(P2, product.digit)])
            } else if (price > max) {
                return $t('trade.takeProfit') + $t('trade.profitLossWarnTip2')
            } else {
                return false
            }
        }
    } else {
        if (type === 'stopLoss') {
            const max = product.isStock ? L3 : L1
            if (price < L2) {
                return $t('trade.takeLoss') + $t('trade.profitLossWarnTip1', ['≥' + toFixed(L2, product.digit)])
            } else if (price > max) {
                return $t('trade.takeLoss') + $t('trade.profitLossWarnTip2')
            } else {
                return false
            }
        } else if (type === 'profit') {
            const min = product.isStock ? P3 : P2
            if (price > P1) {
                return $t('trade.takeProfit') + $t('trade.profitLossWarnTip1', ['≤' + toFixed(P1, product.digit)])
            } else if (price < min) {
                return $t('trade.takeProfit') + $t('trade.profitLossWarnTip2')
            } else {
                return false
            }
        }
    }
}
