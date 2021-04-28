import Vue from 'vue'
import { minus, toFixed } from '@/utils/calculation'
import { getBLen, timeZone, localGet } from '@/utils/index'
import { pipCalc } from '@/store/ix_utils'
import { getProductInfo } from '@/api/base'

// 封装Vue.set方法
function vue_set (obj, name, val) {
    if (obj.hasOwnProperty(name)) {
        obj[name] = val
    } else {
        Vue.set(obj, name, val)
    }
}

// 设置市价买/卖，最小点数转价格
// 点数（pip）换算为价格：X * 大点比率 * point
function crate_min_stop_price (symbolItem) {
    symbolItem.stop_level_price = toFixed(symbolItem.stop_level * Math.pow(0.1, symbolItem.digits), symbolItem.digits)
}
// 设置市价买/卖，最大点数转价格
// 点数（pip）换算为价格：X * 大点比率 * point
function crate_max_stop_price (symbolItem) {
    symbolItem.max_stop_level_price = toFixed(symbolItem.max_stop_level * Math.pow(0.1, symbolItem.digits), symbolItem.digits)
}
// 处理显示的点差  点差=（买价-卖价）/pip
function spreadText (product) {
    product.spread_text = priceToPip(product.buy_price - product.sell_price, product)
}

/** 价格转点数  点数=价差/（Point*大点比率）
 * 点差小数位显示规则：
    根据大点比率进行显示，大点比率的值一般为1（10的0次方）、10（10的1次方）、100（10的2次方）、1000（10的3次方）
    则点差的小数位分别对应为0位、1位、2位、3位
    例如：EURUSD卖价：1.19323 ，买价：1.19341，大点比率为10，则点差=（1.19341-1.19323）/10*0.00001=1.8
 */
function priceToPip (price, product) {
    const groupSymbol = product.groupSymbol
    if (!groupSymbol || !groupSymbol.id) return null
    const spDigit = String(groupSymbol.pips_ratio).length - 1 // 点差小数位
    const point = Math.pow(0.1, groupSymbol.digits)
    const pip = point * groupSymbol.pips_ratio // 1pip=point*大点比率
    return (price / pip).toFixed(spDigit)
}

/** 价格计算点差
 * item 实时报价对象
 * groupSymbol 组信息
 */
function price_spread (item, groupSymbol) {
    const buy_price = item.b1 || item.buy_price
    const sell_price = item.a1 || item.sell_price
    const digits = groupSymbol.digits
    const point = Math.pow(0.1, digits).toFixed(digits) * 1
    const sb = 0
    const sp = groupSymbol.spread || 0
    /**
         *  如果sp是偶数：(sb是点差偏移，sp是点差)
                bid'=bid+(sb-sp/2)/(10的digits方)
                ask'= ask +( sb+sp/2)/(10的digits方)
            如果sp是奇数：(sb是点差偏移，sp是点差)
                bid'=bid+(sb-(sp+1point)/2)/(10的digits方)
                ask'= ask + (sb+(sp-1point)/2)/(10的digits方)
        */
    const p = Math.pow(10, digits)
    let buy_point, sell_point
    if (sp % 2 === 0) {
        buy_point = (sb + sp / 2) / p
        sell_point = (sb - sp / 2) / p
    } else {
        sell_point = (sb - (sp + point) / 2) / p
        buy_point = (sb + (sp - point) / 2) / p
    }
    item.b1 = item.buy_price = toFixed(buy_price + buy_point, digits) * 1
    item.a1 = item.sell_price = toFixed(sell_price + sell_point, digits) * 1
    /**
         *  若计算完ask'<bid',则采用中间价计算新的点差：中间价=(ask'+bid')/2
            顶层ask=bid=(ask'+bid')/2
            其他层级行情需要根据新的点差计算：(暂不处理)
            新的点差spread_ask’ = ask’ - 中间价
            新的点差spread_bid’ = 中间价 - bid’
         */
    if (item.buy_price < item.sell_price) {
        let cur_price = (item.buy_price + item.sell_price) / 2
        cur_price = toFixed(cur_price, digits) * 1
        item.b1 = item.buy_price = cur_price
        item.a1 = item.sell_price = cur_price
        item.cur_price = cur_price
    }
    return item
}

// 产品属性扩展
function strongProductInfo (el, state) {
    // 美股、港股的short_name显示成股票代码
    if (el.code) {
        el.short_name = el.code
    }
    el.class = getBLen(el.simplified) > 15 ? 'ellipsis' : ''
    el.name = el.id
    el.pip = pipCalc(el)
    if (state.lang === 'en-US') el.market_name = el.market_name_en
    if (el.volumes_min) {
        const contract_size = el.contract_size
        el.volumes_min = el.volumes_min / contract_size
        el.volumes_step = el.volumes_step / contract_size
        el.volumes_max = el.volumes_max / contract_size
        crate_min_stop_price(el) // 设置市价卖，止损价格范围最小值
        crate_max_stop_price(el) // 设置市价卖，止损价格范围最大值
    }
    if (el.margin_set_list && el.margin_set_list.length) {
        el.margin_set_list.forEach(margin => {
            margin.margin_initial = margin.percent
            margin.range_min = margin.range_left
            margin.range_max = margin.range_right
        })
    }
    const newItem = {
        simplified: state.lang === 'en-US' ? el.short_name : el.simplified,
        code: el.code,
        short_name: el.short_name,
        code_id: el.id,
        digit: el.digits,
        class: el.class,
        market_id: el.market_id,
        isStock: [0, 1, 2, 9].includes(el.market_id),
        groupSymbol: JSON.parse(JSON.stringify(el))
    }
    return newItem
}

// 设置基础货币兑USD、盈利货币兑USD的产品列表
function relativeProduct (product, product_toUSD) {
    if (product.market_id !== 8) return
    const base = product.groupSymbol.base_currency
    const profit = product.groupSymbol.profit_currency
    if (base === 'USD' && profit === 'USD') {
        if (!product_toUSD[profit + 'USD']) Vue.set(product_toUSD, profit + 'USD', product)
    } else if (base === 'USD' && profit !== 'USD') {
        if (!product_toUSD[profit + 'USD']) Vue.set(product_toUSD, profit + 'USD', product)
    } else if (base !== 'USD' && profit === 'USD') {
        if (!product_toUSD[base + 'USD']) Vue.set(product_toUSD, base + 'USD', product)
    }
}

export default {
    namespaced: true,
    state: {
        current_connection_number: 0, // 行情服务器连接信，当前连接数
        product_list: [], // 所有产品
        product_map: {}, // 所有产品，和product_list的区别是一个是对象，一个是数组，以code_id为key值
        product_toUSD: {}, // 外汇产品 基础货币、盈利货币兑USD的产品
        // product_source: {}, // 所有产品，以产品列表里面的source为key值
        // product_groupSymbolName: {}, // 所有产品，以GroupSymbolList里面的name为key值
        product_category: [], // 所有产品分类
        product_activatedId: 0, // 当前操作的产品ID，下单、查看详情时的产品ID
        // quote_map: {}, // 当前订阅的行情列表
        subscription_proList: [], // 订阅的产品列表
        positionCode: [], // 持仓的codes
        positionAboutCode: [], // 持仓相关的codes
        lang: 'zh-CN',
        baseSymbol: {
            // 基础产品依赖
            USDCNY: 3224113,
            USDHKD: 3289649
        }
    },
    getters: {
        // 当前操作的产品，下单、查看详情时的产品
        product_activated: state => {
            const product_activatedId = String(state.product_activatedId)
            return state.product_map[product_activatedId]
        },
        // 层级保证金列表，对象形式，以symbol_id为key值
        groupSymbolMarginLeveMap: state => {
            const obj = {}
            const list = state.product_list
            list.forEach(el => {
                const code_id = el.code_id
                obj[code_id] = el.groupSymbol.margin_set_list
            })
            return obj
        }
    },
    actions: {
        showTradeTime ({ state }, params) {
            return new Promise((resolve, reject) => {
                if (!params.symbolId) {
                    return resolve({})
                }
                const schedule = state.product_map[params.symbolId].groupSymbol.schedule || []

                const showSchedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
                const secondOffset = params.timeZone * 60
                schedule.forEach((_item, index) => {
                    // 复制数据，转换到当前时区
                    const item = Object.assign({}, _item)
                    item.start_time = item.start_time + secondOffset
                    item.end_time = item.end_time + secondOffset
                    if (item.start_time < 0) {
                        const _dayOfWeek = item.day_of_week === 0 ? 6 : item.day_of_week - 1
                        // 开始时间小于0,换到前一天
                        showSchedule[_dayOfWeek].push({
                            start_time: 1440 + item.start_time,
                            end_time: 1440,
                            day_of_week: _dayOfWeek
                        })

                        item.start_time = 0
                        showSchedule[item.day_of_week].push(item)
                    } else if (item.start_time > 1440) {
                        // 开始时间大于1440，换算到第二天
                        const _dayOfWeek = item.day_of_week === 6 ? 0 : item.day_of_week + 1
                        showSchedule[_dayOfWeek].push({
                            start_time: item.start_time - 1440,
                            end_time: item.end_time - 1440,
                            day_of_week: _dayOfWeek
                        })
                        item.start_time = 0
                        item.end_time = 0
                    }
                    if (item.end_time > 1440) {
                        // 结束时间大于1440，换算到第二天
                        const _dayOfWeek = item.day_of_week === 6 ? 0 : item.day_of_week + 1
                        showSchedule[_dayOfWeek].push({
                            start_time: 0,
                            end_time: item.end_time - 1440,
                            day_of_week: _dayOfWeek
                        })
                        item.end_time = 1440
                        showSchedule[item.day_of_week].push(item)
                    } else {
                        showSchedule[item.day_of_week].push(item)
                    }
                })
                for (const key in showSchedule) {
                    const groupArr = showSchedule[key]
                    if (groupArr && groupArr.length > 0) {
                        groupArr.sort((a, b) => a.end_time - b.end_time)
                        for (let i = groupArr.length - 1; i > 0; i--) {
                            // 删掉开始时间跟结束时间为0的区间
                            if (groupArr[i].start_time == 0 && groupArr[i].end_time == 0) {
                                groupArr.splice(i, 1)
                            }
                            if (groupArr[i].start_time - 1 == groupArr[i - 1].end_time || groupArr[i].start_time == groupArr[i - 1].end_time) {
                                groupArr[i - 1].end_time = groupArr[i].end_time
                                groupArr.splice(i, 1)
                            }
                            if (groupArr[i] && groupArr[i - 1] && groupArr[i].start_time <= groupArr[i - 1].start_time && groupArr[i].end_time >= groupArr[i - 1].end_time) {
                                groupArr.splice(i - 1, 1)
                            }
                        }
                    }
                }
                resolve(showSchedule)
            })
        },
        // http接口拉取某个产品的详细信息
        getProductInfo ({ dispatch, commit, state, rootGetters }, id) {
            if (!id) return false
            const product_map = state.product_map
            // if (product_map[id] && product_map[id]['groupSymbol']['volumes_step']) return false
            return Vue.prototype.$mSocket.send('symbolInfo', { code_id: id }).then(res => {
                commit('UPDATE_ProductInfo', res)
                return res
            })
        },
        // 获取新产品数据
        getNewProduct ({ dispatch, commit, state, rootGetters }, params) {
            return Vue.prototype.$mSocket.send('symbolInfo', params).then(res => {
                commit('ADD_Product', res)
                return res
            })
        }
    },
    mutations: {
        // 清空数据，在切换账户的时候清空一下数据
        EMPTY_data (state) {
            state.product_list = []
            state.product_map = {}
            state.product_toUSD = {}
            // state.product_source = {}
            // state.product_groupSymbolName = {}
            state.product_category = []
            state.positionCode = []
            state.positionAboutCode = []
        },
        UPDATE_CUR_CONNECT_NUM (state, data) {
            state.current_connection_number = data
        },
        // 更新产品分类，并生成新的产品列表，一维数组
        UPDATE_PRODUCT_CATEGORY (state, data) {
            const _product_category = []
            let localTopData = localGet('moduleTop')
            localTopData = localTopData ? JSON.parse(localTopData) : {}
            data.forEach(item => {
                if (item.tagDiplay == '1' && localTopData.hasOwnProperty(item.id)) {
                    let index = 0
                    item.tagsList.forEach((tag, i) => {
                        if (tag.id == localTopData[item.id]) {
                            index = i
                        }
                    })
                    const topTag = item.tagsList.splice(index, 1)
                    item.tagsList = topTag.concat(item.tagsList)
                }
                _product_category.push(item)
            })
            state.product_category = _product_category
        },
        // 标签置顶
        UPDARE_PRODUCT_CATEGORY_TAGTOTOP (state, data) {
            const moduleData = state.product_category.filter(item => item.id == data.moduleId)[0]
            const topTag = moduleData.tagsList.splice(data.index, 1)
            moduleData.tagsList = topTag.concat(moduleData.tagsList)
        },
        // 关联产品列表和 GroupSymbolList
        PRODUCT_CONTACT_GROUPSYMBOL (state, list) {
            if (!list) return
            const product_map = state.product_map
            const product_list = state.product_list
            const product_toUSD = state.product_toUSD
            // const product_groupSymbolName = state.product_groupSymbolName
            list.forEach(el => {
                if (!el || product_map[el.id]) return false
                const newItem = strongProductInfo(el, state)
                product_list.push(newItem)
                Vue.set(product_map, String(el.id), newItem)

                // 设置基础货币兑USD、盈利货币兑USD的产品列表
                relativeProduct(newItem, product_toUSD)
                return newItem
            })
            sessionStorage.setItem('GroupSymbolList', JSON.stringify(product_list))
        },
        // 更新订阅的行情列表
        UPDATE_SUBSCRIPTION_PROLIST (state, code_ids) {
            state.subscription_proList = code_ids
        },
        UPDATE_PRODUCT_ACTIVATED_ID (state, id) {
            sessionStorage.setItem('product_activated', JSON.stringify(state.product_map[String(id)]))
            state.product_activatedId = id * 1
        },
        // 修改产品报价信息
        ProductRealTimePrice (state, content) {
            // 尝试优化20毫秒计算一次，这里严重影响性能卡的很
            content.forEach(str => {
                // p(700832,1.42029,1.42052,1.42041,1588815860,1.42395,1.41907)
                // sym ,a1 ,b1 ,cur ,tm ,high_price ,low_price
                let stallsStr = '' // 五档行情
                const matched = str.match(/([^\]]*),(\[.*\])/)
                if (matched) {
                    str = matched[1]
                    stallsStr = matched[2]
                }

                str = str.split(',').map(el => Number(el))
                const item = {
                    sym: str[0],
                    a1: str[1],
                    b1: str[2],
                    cur: str[3],
                    tm: str[4],
                    stallsStr
                    // high_price: str[5],
                    // low_price: str[6]
                }
                const product = state.product_map[item.sym] // 产品基本属性

                if (!product) return
                if (item.b1 === product.buy_price * 1 && item.a1 === product.sell_price * 1 && item.cur === product.cur_price * 1) {
                    // console.log('相同报价')  // , item.sym, item.b1, item.a1
                    return
                }
                const groupSymbol = product.groupSymbol
                // groupSymbol.mayTrade = true
                const digit = groupSymbol.digits
                const point = Math.pow(0.1, digit).toFixed(digit)
                if (groupSymbol && groupSymbol.id) {
                    // item.b1 = item.buy_price = toFixed(item.b1 + point * Math.round(groupSymbol.spread - groupSymbol.spread_balance), digit) * 1
                    // item.a1 = item.sell_price = toFixed(item.a1 - point * groupSymbol.spread_balance, digit) * 1
                    price_spread(item, groupSymbol)
                }

                if (!product.buy_price_prev) {
                    item.buy_price_prev = product.buy_price
                    item.sell_price_prev = product.sell_price
                    item.cur_price_prev = product.cur_price
                    item.cur_color = 'grayColor'
                    item.buy_color = 'grayColor'
                    item.sell_color = 'grayColor'
                }
                item.cur_color = item.cur === product.cur_price * 1 ? product.cur_color : item.cur < product.cur_price ? 'fallColor' : 'riseColor'
                item.buy_color = item.b1 === product.buy_price * 1 ? product.buy_color : item.b1 < product.buy_price ? 'fallColor' : 'riseColor'
                item.sell_color = item.a1 === product.sell_price * 1 ? product.sell_color : item.a1 < product.sell_price ? 'fallColor' : 'riseColor'
                // 根据最后一口报价计算涨跌幅
                if (product.lastPrice) {
                    const lastPrice = product.lastPrice
                    const yesterday_price = lastPrice.yesterday_price // 昨天收盘价
                    item.upDownAmount = minus(item.cur, yesterday_price).toFixed(digit) // 涨跌额(价格)
                    item.upDownAmount_pip = priceToPip(item.upDownAmount, product) // 涨跌额(点)
                    item.upDownWidth = yesterday_price == 0 ? '--' : toFixed((item.upDownAmount / yesterday_price) * 100) + '%' // 涨跌幅
                    item.upDownColor = item.upDownAmount >= 0 ? 'riseColor' : 'fallColor'
                }
                if (product.high_price && item.cur > product.high_price) item.high_price = item.cur
                if (product.low_price && item.cur < product.low_price) item.low_price = item.cur
                item.buy_price_prev = product.buy_price
                item.sell_price_prev = product.sell_price
                item.cur_price_prev = product.cur_price
                item.buy_price = item.b1.toFixed(digit)
                item.sell_price = item.a1.toFixed(digit)
                item.cur_price = item.cur.toFixed(digit)
                if (item.highPrice) item.high_price = item.highPrice.toFixed(digit)
                if (item.lowPrice) item.low_price = item.lowPrice.toFixed(digit)
                for (const key in item) {
                    if (!item.hasOwnProperty(key)) return
                    if (product.hasOwnProperty(key)) {
                        product[key] = item[key]
                    } else {
                        Vue.set(product, key, item[key])
                    }
                }
                spreadText(product) // 处理显示的点差
            })
        },
        // 成交记录
        UpdateTransactionRecord (state, content) {
            const str = content.match(/\[([^,]+),/)
            const sym = str ? str[1] : ''
            const product = state.product_map[sym] // 产品基本属性
            if (!product) return

            const key = 'dealStr'
            if (product.hasOwnProperty(key)) {
                product[key] = content
            } else {
                Vue.set(product, key, content)
            }
        },

        // 更新最后一口报价
        UPDATE_LastPrice (state, content) {
            const product_map = state.product_map
            content.forEach(el => {
                const code_id = el.code_id
                const product = product_map[code_id]
                if (!product) return
                // 处理点差
                const digit = product.digit
                const groupSymbol = product.groupSymbol

                if (!product.lastPrice) {
                    if (groupSymbol && groupSymbol.id) {
                        // digit = groupSymbol.digits // 小数位，已登录使用交易服务器的
                        // const point = Math.pow(0.1, digit)
                        // const spread_buy = Math.round(groupSymbol.spread - groupSymbol.spread_balance)
                        // el.buy_price = toFixed(el.buy_price + point * spread_buy, digit) * 1
                        // el.sell_price = toFixed(el.sell_price - point * groupSymbol.spread_balance, digit) * 1
                        price_spread(el, groupSymbol)
                    }
                    el.cur_price = el.cur_price.toFixed(digit)
                    el.buy_price = el.buy_price.toFixed(digit)
                    el.sell_price = el.sell_price.toFixed(digit)
                    el.cur_color = 'grayColor'
                    el.buy_color = 'grayColor'
                    el.sell_color = 'grayColor'
                    if (el.highPrice) el.high_price = el.highPrice.toFixed(digit)
                    if (el.lowPrice) el.low_price = el.lowPrice.toFixed(digit)

                    if (!product.buy_price) {
                        for (const key in el) {
                            if (el.hasOwnProperty(key) && !product.hasOwnProperty(key)) {
                                Vue.set(product, key, el[key])
                            }
                        }
                    } else {
                        product.cur_price = el.cur_price
                        product.buy_price = el.buy_price
                        product.sell_price = el.sell_price
                        product.high_price = el.high_price
                        product.low_price = el.low_price
                    }

                    Vue.set(product, 'lastPrice', el)

                    // 根据最后一口报价计算涨跌幅
                    if (el) {
                        const cur_price = product.cur_price * 1 // 当前价
                        const yesterday_price = el.yesterday_price // 昨天收盘价
                        const upDownAmount = minus(cur_price, yesterday_price).toFixed(digit) // 涨跌额
                        const upDownAmount_pip = priceToPip(upDownAmount, product) // 涨跌额(点)
                        const upDownWidth = toFixed((upDownAmount / yesterday_price) * 100) + '%' // 涨跌幅
                        vue_set(product, 'upDownAmount', upDownAmount)
                        vue_set(product, 'upDownAmount_pip', upDownAmount_pip)
                        vue_set(product, 'upDownColor', upDownAmount >= 0 ? 'riseColor' : 'fallColor')
                        vue_set(product, 'upDownWidth', yesterday_price == 0 ? '--' : upDownWidth)
                        spreadText(product) // 处理显示的点差
                    }
                } else {
                    product.high_price = el.high_price
                    product.low_price = el.low_price
                }
            })
        },
        // 更新持仓codelist
        UPDATE_PositionCode (state, data) {
            if (data.reset) {
                state.positionCode = data.data
            } else {
                state.positionCode = state.positionCode.concat(data.data)
            }
        },
        // 更新持仓相关codelist
        UPDATE_PositionAboutCode (state, data) {
            if (data.reset) {
                state.positionAboutCode = data.data
            } else {
                state.positionAboutCode = state.positionAboutCode.concat(data.data)
            }
        },
        // 组类型更新， 比如设置为可用、不可用时
        UPDATE_SymbolUpdate (state, content) {
            const product_list = state.product_list
            const product = product_list.find(el => el.source === content.source)
            if (!product) return
            if (product && product.groupSymbol) {
                const groupSymbol = product.groupSymbol
                Object.assign(groupSymbol, content)
                crate_min_stop_price(groupSymbol) // 设置市价卖，止损价格范围最小值
                crate_max_stop_price(groupSymbol) // 设置市价卖，止损价格范围最大值
            }
        },
        // 更新基础产品依赖
        UPDATE_baseSymbol (state, data) {
            const baseSymbol = state.baseSymbol
            Object.assign(baseSymbol, data)
        },
        // 更新语言
        UPDATE_lang (state, data) {
            state.lang = data
        },
        // 更新单个产品属性
        UPDATE_ProductInfo (state, content) {
            const product_map = state.product_map
            const product = product_map[content.id]
            if (!product) return
            content.name = content.id
            content.pip = pipCalc(content)
            if (state.lang === 'en-US') content.market_name = content.market_name_en
            const contract_size = content.contract_size
            content.volumes_min = content.volumes_min / contract_size
            content.volumes_step = content.volumes_step / contract_size
            content.volumes_max = content.volumes_max / contract_size
            if (content.margin_set_list && content.margin_set_list.length) {
                content.margin_set_list.forEach(margin => {
                    margin.margin_initial = margin.percent
                    margin.range_min = margin.range_left
                    margin.range_max = margin.range_right
                })
            }
            const newItem = {
                code: content.code,
                zone: content.zone,
                source: content.source,
                groupSymbol: JSON.parse(JSON.stringify(content))
            }
            crate_min_stop_price(newItem.groupSymbol) // 设置市价卖，止损价格范围最小值
            crate_max_stop_price(newItem.groupSymbol) // 设置市价卖，止损价格范围最大值
            Object.assign(product, newItem)
            sessionStorage.setItem('product_activated', JSON.stringify(product))
        },
        // 添加产品
        ADD_Product (state, el) {
            const product_map = state.product_map
            const product_list = state.product_list
            const newItem = strongProductInfo(el, state)
            product_list.push(newItem)
            Vue.set(product_map, String(el.id), newItem)
        }
        // UPDATE_GROUPSYMBOL_MAYTRADE(state, data) {
        //     console.log(data)
        //     // state.product_map
        //     const baseData = state.product_map
        //     data.forEach(item => {
        //         if (item) {
        //             console.log(item)
        //             let product = baseData[item.symoblId]
        //             product.groupSymbol.mayTrade = item.mayTrade
        //         }
        //     })
        // },
    }
}
