import { profitOrLoss_YZ, throttle, calcOpenMargin } from '@/store/ix_utils'
let positionData = {
    positionList: [],
    accountData: {},
    colorClass: ''
}

const getters = {
    errorLogs: state => state.errorLog.logs,
    companyInfo: state => state.ix_baseInfo.companyInfo,
    style: state => state.ix_baseInfo.style,
    accountCurrency: state => state.ix_user.groupGet.currency,
    userInfo: state => state.ix_user.info,
    symbolCode: (state, getters) => (getters.accountCurrency === 'IXD' ? 'USD' : getters.accountCurrency),
    userType: state => (state.ix_user.info && state.ix_user.info.toKenCompanyInfoVo ? state.ix_user.info.toKenCompanyInfoVo.accountType : 'guest'),
    usdcny: state => state.ix_quote.product_map[state.ix_quote.baseSymbol.USDCNY],
    usdcnyRate: (state, getters) => (getters.accountCurrency === 'CNY' ? getters.usdcny?.buy_price ?? 1 : 1),
    usdhkd: state => state.ix_quote.product_map[state.ix_quote.baseSymbol.USDHKD],
    usdhkdRate: (state, getters) => getters.usdhkd?.buy_price ?? 1,
    isExperience: (state, getters) => state.accInfo?.maxAmount > 0 && getters.userType === 'demo', // 是否为体验账户
    activateTime: (state, getters) => state.ix_user.info?.toKenCompanyInfoVo?.activateTime, // 激活时间，存在表示已激活
    hasRealAccount: (state, getters) => state.ix_user.info?.toKenCompanyInfoVo?.accountNo, // 是否开真实账户
    accountData: (state, getters) => {
        // 计算订单的浮动盈亏，并标记最大盈亏的订单
        // {positionList:[],accountData:{}，colorClass:colorClass}
        // colorClass---资产水平颜色 adequate:充足  stopout:强平  less:不足
        // accountData.csbzj 初始保证金：持仓中所有产品所需初始保证金总和
        // accountData.kybzj 可用保证金
        // accountData.gylx 隔夜利息:当前持仓的隔夜利息
        // accountData.yk 盈亏：当前持仓的盈亏之和
        // accountData.jyk 净盈亏:当前持仓的净盈亏之和
        // accountData.yj 佣金:佣金
        // accountData.jz 净值

        throttle(() => {
            const obj = {
                gylx: 0,
                yk: 0,
                yj: 0
            }
            const positionList = []
            let USDCNYInfo = {}
            const maxLossInfo = {
                index: -1,
                value: 0
            }
            const accountCurrency = state.ix_user.info && state.ix_user.groupGet.currency === 'CNY' ? 'CNY' : 'USD'
            const baseSymbol = state.ix_quote.baseSymbol
            if (accountCurrency === 'CNY') {
                USDCNYInfo = state.ix_quote.product_map[baseSymbol.USDCNY] || {}
            }
            state.ix_user.postionList.map((item, itemIndex) => {
                const _baseInfo = state.ix_quote.product_map[item.symbol] || {
                    groupSymbol: {}
                }
                let aboutSymoblInfo = {}
                let _profitOrLoss = null
                let _exchangeRate = null
                if (_baseInfo.market_id === 2) {
                    const aboutInfo = state.ix_quote.product_map[state.ix_quote.baseSymbol.USDHKD] || {
                        groupSymbol: {}
                    }
                    aboutSymoblInfo = {
                        interest_exchange_base: aboutInfo.groupSymbol.base_currency,
                        interest_exchange_profit: aboutInfo.groupSymbol.profit_currency,
                        exchange_buy_price: aboutInfo.buy_price,
                        exchange_sell_price: aboutInfo.sell_price
                    }
                    const profitOrLossAndRate = profitOrLoss_YZ(
                        Object.assign(aboutSymoblInfo, {
                            base_currency: 'ABCEFGHIJK',
                            profit_currency: _baseInfo.groupSymbol.profit_currency,
                            direction: item.direction,
                            order_price: item.open_price,
                            buy_price: _baseInfo.buy_price,
                            sell_price: _baseInfo.sell_price,
                            contract_size: _baseInfo.groupSymbol.contract_size,
                            volume: item.volume
                        })
                    )
                    _profitOrLoss = profitOrLossAndRate.profitOrLoss
                    _exchangeRate = profitOrLossAndRate.exchangeRate
                } else {
                    if (_baseInfo.groupSymbol.base_currency !== 'USD' && _baseInfo.groupSymbol.profit_currency !== 'USD') {
                        const aboutInfo = state.ix_quote.product_toUSD[_baseInfo.groupSymbol.profit_currency + 'USD']
                        if (aboutInfo) {
                            aboutSymoblInfo = {
                                interest_exchange_base: aboutInfo.groupSymbol.base_currency,
                                interest_exchange_profit: aboutInfo.groupSymbol.profit_currency,
                                exchange_buy_price: aboutInfo.buy_price,
                                exchange_sell_price: aboutInfo.sell_price
                            }
                        }
                    }
                    const profitOrLossAndRate = profitOrLoss_YZ(
                        Object.assign(aboutSymoblInfo, {
                            base_currency: _baseInfo.groupSymbol.base_currency,
                            profit_currency: _baseInfo.groupSymbol.profit_currency,
                            direction: item.direction,
                            order_price: item.open_price,
                            buy_price: _baseInfo.buy_price,
                            sell_price: _baseInfo.sell_price,
                            contract_size: _baseInfo.groupSymbol.contract_size,
                            volume: item.volume
                        })
                    )
                    _profitOrLoss = profitOrLossAndRate.profitOrLoss
                    _exchangeRate = profitOrLossAndRate.exchangeRate
                }

                obj.gylx += item.swap
                obj.yj += item.commission

                // 处理价格的小数点位
                if (_baseInfo.groupSymbol.digits) {
                    item.open_price = parseFloat(item.open_price).toFixed(_baseInfo.groupSymbol.digits)
                    if (item.stop_loss) {
                        item.stop_loss = parseFloat(item.stop_loss).toFixed(_baseInfo.groupSymbol.digits)
                    }
                    if (item.take_profit) {
                        item.take_profit = parseFloat(item.take_profit).toFixed(_baseInfo.groupSymbol.digits)
                    }
                }
                // 如果收益货币是港元，需要把港元换算成美元
                /* if (_profitOrLoss !== '--' && _baseInfo.groupSymbol.margin_currency === 'HKD') {
                        const USDHKDInfo = state.ix_quote.product_map[baseSymbol.USDHKD] || {}
                        if (USDHKDInfo.cur_price) {
                            _profitOrLoss = _profitOrLoss / USDHKDInfo.cur_price
                        } else {
                            _profitOrLoss = '--'
                        }
                    } */
                if (accountCurrency === 'CNY' && _profitOrLoss != '--') {
                    _profitOrLoss = _profitOrLoss > 0 ? _profitOrLoss * USDCNYInfo.sell_price : _profitOrLoss * USDCNYInfo.buy_price
                    _exchangeRate = _profitOrLoss > 0 ? _exchangeRate * USDCNYInfo.sell_price : _exchangeRate * USDCNYInfo.buy_price
                }

                positionList.push(
                    Object.assign(
                        {
                            volumes_max: _baseInfo.groupSymbol.volumes_max,
                            volumes_min: _baseInfo.groupSymbol.volumes_min,
                            volumes_step: _baseInfo.groupSymbol.volumes_step,
                            profitOrLoss: _profitOrLoss,
                            exchangeRate: _exchangeRate
                        },
                        _baseInfo,
                        item
                    )
                )
                if (_profitOrLoss === '--' || obj.yk === '--') {
                    obj.yk = '--'
                } else {
                    obj.yk += _profitOrLoss
                    if (maxLossInfo.index == -1) {
                        maxLossInfo.index = itemIndex
                        maxLossInfo.value = _profitOrLoss
                    } else {
                        if (_profitOrLoss < maxLossInfo.value) {
                            maxLossInfo.index = itemIndex
                            maxLossInfo.value = _profitOrLoss
                        }
                    }
                    // 给盈亏最大的打标记
                    if (maxLossInfo.index !== -1) {
                        positionList[maxLossInfo.index].maxLoss = true
                    }
                }
            })
            /* if (obj.yk === "--") {
        obj.kybzj = ""
        obj.jyk = ""
        obj.jz = ""
        obj.yk = ""
      } else {
        // 计算图表的颜色
        // 有盈亏才算这些

        if (accountCurrency === "CNY") {
          obj.yk = obj.yk * USDCNYInfo.cur_price
        }
        // 给盈亏最大的打标记
        if (maxLossInfo.index !== -1) {
          positionList[maxLossInfo.index].maxLoss = true
        }
        if (
          state.ix_user.userLoginInfo.margin ||
          state.ix_user.userLoginInfo.margin == 0
        ) {
          obj.csbzj = state.ix_user.userLoginInfo.margin
          obj.jyk = obj.gylx + obj.yk + obj.yj
          obj.jz = state.ix_user.userLoginInfo.balance + obj.jyk
          obj.kybzj = obj.jz - obj.csbzj
          if (obj.jz < state.ix_user.userLoginInfo.margin_stop_out) {
            colorClass = "stopout"
          } else if (obj.jz < state.ix_user.userLoginInfo.margin_maintenance) {
            colorClass = "less"
          } else {
            colorClass = "adequate"
          }
        }
      } */
            positionData = {
                positionList: positionList,
                accountData: obj
                // colorClass: colorClass
            }
        })(state, positionData)

        return positionData
    },
    assetAboutInfo: (state, getters) => {
        // 资产相关信息，依赖持仓数据
        const accountData = getters.accountData.accountData
        const obj = {
            csbzj: 0,
            kybzj: 0,
            gylx: accountData.gylx,
            yk: accountData.yk,
            yj: accountData.yj,
            jyk: 0,
            jz: 0
        }
        let colorClass = ''
        if (obj.yk != '--' && (state.ix_user.userLoginInfo.margin || state.ix_user.userLoginInfo.margin == 0)) {
            obj.csbzj = state.ix_user.userLoginInfo.margin
            obj.csbzj = calcMargin(state, getters)
            obj.jyk = obj.gylx + obj.yk + obj.yj
            obj.jz = state.ix_user.userLoginInfo.balance + obj.jyk
            obj.kybzj = obj.jz - obj.csbzj
            if ((obj.jz / obj.csbzj) * 100 < state.ix_user.userLoginInfo.margin_stop_out) {
                colorClass = 'stopout'
            } else if ((obj.jz / obj.csbzj) * 100 < state.ix_user.userLoginInfo.margin_call_level) {
                colorClass = 'less'
            } else {
                colorClass = 'adequate'
            }
        }
        return {
            accountData: obj,
            colorClass: colorClass
        }
    }
}

// 计算YZ平台保证金
function calcMargin (state, getters) {
    const positionList = getters.accountData.positionList
    const positionVolumes = {}
    const baseSymbol = state.ix_quote.baseSymbol
    const usdcny = state.ix_quote.product_map[baseSymbol.USDCNY]
    const groupGet = state.ix_user.groupGet

    positionList.forEach(el => {
        const code_id = el.code_id
        const direction = el.direction
        if (!positionVolumes[code_id]) positionVolumes[code_id] = { sell: 0, buy: 0, product: el }
        const pos = positionVolumes[code_id]
        pos[direction === 1 ? 'buy' : 'sell'] += el.volume
    })
    let marginAll = 0
    for (const key in positionVolumes) {
        const el = positionVolumes[key]
        const symbol = el.product.groupSymbol
        const relativePro = relativeProduct(symbol, state.ix_quote.product_list)
        let YZ_rate = 1
        if (!symbol || !symbol.id) {
            YZ_rate = 1
        } else if (symbol.base_currency === 'USD') {
            YZ_rate = 1
        } else if (symbol.profit_currency === 'USD') {
            YZ_rate = el.product.buy_price * 1
        } else {
            YZ_rate = (relativePro && relativePro.buy_price) || 1
        }
        let usdcnyRate = 1
        if (usdcny && usdcny.buy_price) {
            // const direction = el.buy > el.sell ? 1 : 2
            usdcnyRate = usdcny.buy_price // direction === 1 ? usdcny.buy_price : usdcny.sell_price
        }
        const margin = calcOpenMargin({
            product: el.product,
            groupGet: groupGet,
            positionList: positionList,
            relativeProduct: relativePro, // YZ平台使用
            YZ_rate: YZ_rate, // YZ平台使用
            groupSymbolMarginLeveMap: getters['ix_quote/groupSymbolMarginLeveMap'] || {},
            volume: Math.max(el.sell, el.buy),
            direction: el.buy >= el.sell ? 1 : 2,
            usdcnyRate: usdcnyRate,
            usdhkdRate: 1
        })
        marginAll += margin * 1
    }
    return marginAll
}
// 该产品基础货币兑美元的币种
function relativeProduct (groupSymbol, product_list) {
    const symbol = groupSymbol
    if (!symbol || !symbol.id) return {}
    const base_currency = symbol.base_currency
    const targetProduct = product_list.find(el => {
        const groupSymbol = el.groupSymbol
        return (groupSymbol.base_currency == base_currency && groupSymbol.profit_currency === 'USD') || (groupSymbol.profit_currency == base_currency && groupSymbol.base_currency === 'USD')
    })
    return targetProduct
}
export default getters
