import { wsParams, blodToBuffer, ungzip } from '@/utils/index'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import SocketEvent from '@/utils/socketEvent'
function isH5 () {
    if (window.webkit && window.webkit.messageHandlers) {
        return false
    } else if (window.UIObject) {
        return false
    } else if (window.JsHook) {
        return false
    } else {
        return true
    }
}
class Listen {
    constructor (ws, store, Vue) {
        this.ws = ws
        this.mySocketEvent = new SocketEvent(ws)
        Vue.prototype.$mSocket = this.mySocketEvent
        ws.userLoginInfoResult = false
        ws.groupSymbolListResult = false
        this.store = store
        this.preSetTime = 1 // 上一次保存价格的时间
        this.newPrice = [] // 保存最新的报价数组
        this.wsBindEvent()
        this.mySocketEvent.clearData()
        this.newPriceTimer = window.setInterval(() => {
            if (this.newPrice.length > 0) {
                store.commit('ix_quote/ProductRealTimePrice', this.newPrice)
                this.newPrice = []
            }
        }, 500)
    }

    send (type, data = {}) {
        const params = wsParams(type, data)
        this.ws.send(params)
    }

    // 登录成功获取持仓列表
    send_positions () {
        const ws = this.ws
        if (ws.userLoginInfoResult && ws.groupSymbolListResult) {
            const store = this.store
            this.send('positions', { account_id: store.state.ix_user.userLoginInfo.account_id, count: 100 }) // 获取持仓记录列表
        }
    }

    // 清空用户相关数据
    emptyUserData () {
        const ws = this.ws
        window['GroupSymbolList'] = []
        ws.userLoginInfoResult = false
        ws.groupSymbolListResult = false
        const store = this.store
        store.commit('ix_quote/EMPTY_data') // 清空产品数据
        store.commit('ix_user/EMPTY_userData') // 清空用户数据
    }

    wsBindEvent () {
        if (!this.ws) return false
        this.ws.addEventListener(
            'message',
            evt => {
                if (evt && typeof evt.data === 'object') {
                    const startTime = Date.now()
                    try {
                        ungzip(evt.data).then(res => {
                            if (isH5()) console.warn('ungzip 解析消耗的时间', Date.now() - startTime, 'ms', JSON.parse(JSON.stringify(res)))
                            const msg_code = res.msg_code
                            if (res.code === '0000' && this[msg_code] && res.content) {
                                this[msg_code](res.content)
                            }
                            this.mySocketEvent.emit(res)
                        })
                    } catch (error) {
                        console.log(error)
                    }

                    // 性能测试代码
                    // ;(function() {
                    //     const result = []
                    //     if (evt.data.size > 180) return false
                    //     for (let i = 0; i < 10; i++) {
                    //         setTimeout(() => {
                    //             const startTime = Date.now()
                    //             ungzip(evt.data).then(res => {
                    //                 result.push(Date.now() - startTime)
                    //                 console.log('ungzip 解析消耗的时间', Date.now() - startTime, 'ms', JSON.parse(res))
                    //             })
                    //         }, i * 100 * Math.random())
                    //     }
                    //     console.log(result)
                    // })()
                    return
                } else if (evt && evt.data.indexOf('{') !== 0) {
                    const funcName = evt.data.match(/\w+(?=\()/) // 取出方法名称，例如p(700796,12.64862....) 方法名称是p
                    if (!funcName || !this[funcName]) return false
                    const args = evt.data.match(/\((.+)\)/)
                    if (args) this[funcName](args[1])
                    return false
                }
                const res = JSON.parse(evt.data)
                this.mySocketEvent.emit(res)
                const msg_code = res.msg_code
                if (res.code === '0000' && this[msg_code]) {
                    this[msg_code](res.content)
                }
            },
            false
        )
    }

    // 用户退出
    UserLogoutRet (content) {
        this.emptyUserData()
    }

    // 初始化产品信息消息
    InitProductInfo (content) {
        this.store.commit('ix_quote/UPDATE_PRODUCT_CATEGORY', content.product_category)
    }

    // 行情服务器连接信息消息
    ServerStatus (content) {
        this.store.commit('ix_quote/UPDATE_CUR_CONNECT_NUM', content.current_connection_number)
    }

    // 产品实时价格信息t
    p (content) {
        // 尝试优化计算太频繁的问题，10毫秒保存一次数据
        const now = new Date().getTime()
        if (this.preSetTime + 20 <= now) {
            this.preSetTime = now
            this.newPrice.push(content)
            if (this.newPrice.length > 0) {
                const store = this.store
                store.commit('ix_quote/ProductRealTimePrice', this.newPrice)
                this.newPrice = []
            }
        } else {
            this.newPrice.push(content)
        }
        // store.commit('ix_quote/ProductRealTimePrice', content)
    }

    // 成交记录
    d (content) {
        this.store.commit('ix_quote/UpdateTransactionRecord', content)
    }

    // 登录成功信息s
    UserLoginInfoRet (content) {
        this.ws.userLoginInfoResult = true
        content.loginTime = Date.now()
        this.store.commit('ix_user/UPDATE_USERLOGININFO', content)
        this.send_positions()
    }

    // 更新用户信息
    AccountGetRet (content) {
        this.store.commit('ix_user/UPDATE_USERLOGININFO', content)
    }

    AccountUpdateRet (content) {
        this.store.commit('ix_user/UPDATE_USERLOGININFO', content)
        this.send('positions', { account_id: this.store.state.ix_user.userLoginInfo.account_id, count: 100 })
    }

    AccountUpdate (content) {
        this.store.commit('ix_user/UPDATE_USERLOGININFO', content)
        this.send('positions', { account_id: this.store.state.ix_user.userLoginInfo.account_id, count: 100 })
    }

    PositionUpdateRet (content) {
        // this.store.commit('ix_user/UPDATE_USERLOGININFO', content)
        this.send('positions', { account_id: this.store.state.ix_user.userLoginInfo.account_id, count: 100 })
    }

    // ServerGetRet(content) {
    //     this.store.commit('ix_baseInfo/UPDATE_SERVERGET', content)
    // }
    // 更新用户组信息
    GroupGetRet (content) {
        this.store.commit('ix_user/UPDATE_groupGet', content)
        // if (content.margin_type === 0) window['GroupSymbolMarginLevelLoaded'] = true // 未开启层级保证金
        // this.send('serverGetReq', { account_id: this.store.state.ix_user.userLoginInfo.account_id, server_id: content.server_id }) // 获取结算事件
    }

    GroupUpdateRet (content) {
        this.store.commit('ix_user/UPDATE_groupGet', content)
        // this.send('serverGetReq', { account_id: this.store.state.ix_user.userLoginInfo.account_id, server_id: content.server_id }) // 获取结算事件
    }

    // 最后一口报价
    LastPrice (content) {
        this.store.commit('ix_quote/UPDATE_LastPrice', content || [])
    }

    TradeServerTimeRet (content) {
        // 获取到交易时间计算本地时间跟服务器时间的时间差
        const localData = parseInt(Date.now() / 1000)
        if (content.server_time && typeof content.server_time === 'number') {
            this.store.commit('ix_baseInfo/UPDATE_localTimeDiffServer', localData - content.server_time)
        } else {
            this.store.commit('ix_baseInfo/UPDATE_localTimeDiffServer', 'error')
        }
        this.store.commit('ix_baseInfo/UPDATE_tradeServerTime', content.server_time)
    }

    // 用户持仓相关的产品属性列表
    GroupSymbolInitListRet (content) {
        const store = this.store
        store.commit('ix_quote/PRODUCT_CONTACT_GROUPSYMBOL', content.data_list)
    }

    // 获取用户组类型列表
    GroupSymbolListRet (content) {
        window['GroupSymbolList'] = window['GroupSymbolList'].concat(content.data_list)
        const store = this.store
        if (content.tag) {
            store.commit('ix_quote/PRODUCT_CONTACT_GROUPSYMBOL', window['GroupSymbolList'])
            const event = new Event('GroupSymbolListRet')
            window.dispatchEvent(event)
            this.ws.groupSymbolListResult = true
            if (store.getters.userType !== 'guest') {
                this.send_positions()
            }
        }
    }

    // 组类型更新， 比如设置为可用、不可用时
    SymbolUpdateRet (content) {
        this.store.commit('ix_quote/UPDATE_SymbolUpdate', content)
    }

    // 获取持仓记录列表
    PositionListRet (content) {
        // 更新持仓列表信息
        const data = content.data_list || []
        // 更新订阅产品信息,处理手数的小数位长度
        const code_arr = [] // 持仓产品的code列表
        const aboutCode_arr = [] // 持仓产品相关的产品code
        const aboutSymbol = [] // 产品集合
        const baseSymbol = [] // 产品基础货币集合，YZ平台用
        const store = this.store
        data.map(item => {
            const _baseInfo = store.state.ix_quote.product_map[item.symbol] || { groupSymbol: {} }
            item.volume = item.volume / _baseInfo.groupSymbol.contract_size
            item.init_volume = item.init_volume / _baseInfo.groupSymbol.contract_size
            if (_baseInfo.groupSymbol.base_currency !== 'USD' && _baseInfo.groupSymbol.profit_currency !== 'USD') {
                // 除去股票板块需要获取交叉货币关联货币的行情
                aboutSymbol.push(_baseInfo.groupSymbol.profit_currency)
                baseSymbol.push(_baseInfo.groupSymbol.base_currency)
            }
            if (code_arr.indexOf(_baseInfo.code_id) < 0 && _baseInfo.code_id) {
                code_arr.push(_baseInfo.code_id)
            }
            // 处理手数的小数位长度，开仓价格小数点位数
            return Object.assign(item, {
                volume: parseFloat(toFixed(item.volume, getDecimalNum(_baseInfo.groupSymbol ? _baseInfo.groupSymbol.volumes_step : 4))),
                open_price: _baseInfo.groupSymbol.digits ? item.open_price.toFixed(_baseInfo.groupSymbol.digits) : item.open_price
            })
        })
        if (content.total > content.offset) {
            // 分页获取
            this.send('positions', { account_id: store.state.ix_user.userLoginInfo.account_id, offset: content.offset, count: 100 })
        }
        store.commit('ix_user/UPDATE_postionList', { data: data, reset: content.offset === content.count })
        // 订阅持仓相关产品的行情
        if (aboutSymbol.length > 0) {
            aboutSymbol.forEach(item => {
                let aboutInfo = {}
                for (let i = 0; i < store.state.ix_quote.product_list.length; i++) {
                    if (
                        (store.state.ix_quote.product_list[i].groupSymbol.base_currency === item || store.state.ix_quote.product_list[i].groupSymbol.profit_currency === item) &&
                        (store.state.ix_quote.product_list[i].groupSymbol.base_currency === 'USD' || store.state.ix_quote.product_list[i].groupSymbol.profit_currency === 'USD')
                    ) {
                        aboutInfo = store.state.ix_quote.product_list[i]
                        break
                    }
                }
                if (aboutInfo.code_id && aboutCode_arr.indexOf(aboutInfo.code_id) < 0) {
                    aboutCode_arr.push(aboutInfo.code_id)
                }
            })
        }
        // YZ平台订阅基础货币兑美元的币种行情
        aboutCode_arr.push(...calcPositionsBaseCurrency(baseSymbol, store))
        store.commit('ix_quote/UPDATE_PositionCode', { data: code_arr, reset: content.offset === content.count })
        store.commit('ix_quote/UPDATE_PositionAboutCode', { data: aboutCode_arr, reset: content.offset === content.count })
    }

    // 用户持仓添加信息
    PositionAddRet (content) {
        const store = this.store
        if (store.state.ix_user && store.state.ix_user.userLoginInfo) this.send('positions', { account_id: store.state.ix_user.userLoginInfo.account_id, count: 100 })
    }
}

// 计算YZ平台持仓的产品交叉货币的相对币种
// return 需要订阅的产品id列表
function calcPositionsBaseCurrency (baseSymbol, store) {
    const product_list = store.state.ix_quote.product_list
    const result = []
    const products = product_list.filter(el => {
        const groupSymbol = el.groupSymbol
        return (baseSymbol.includes(groupSymbol.base_currency) && groupSymbol.profit_currency === 'USD') || (baseSymbol.includes(groupSymbol.profit_currency) && groupSymbol.base_currency === 'USD')
    })
    products.forEach(el => {
        result.push(el.code_id)
    })
    return result
}

// 初始化
const init = function (socket, store, Vue) {
    new Listen(socket, store, Vue)
}
export default init
