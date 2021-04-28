import VueNativeSock from 'vue-native-websocket'
import { wsParams, localSet, localGet, getLoginData, removeLoginData, removeSkeleton, keyInUrlPath } from '@/utils/index'
import { Toast, Dialog } from 'vant'
import { isAPP } from '@m/base/appHybrid'
import Listen from '@/store/ix_listenSocket'
import dayjs from 'dayjs'
import { i18n } from '@m/lang'
let store, router, VUE
const isDie = sessionStorage.getItem('isDie')
if (isDie) sessionStorage.removeItem('isDie')
window['GroupSymbolList'] = []
window['dayjs'] = dayjs
const notLinkWs = keyInUrlPath()
class WS {
    constructor (ws) {
        this.ws = ws
        this.Vue = null
        this.logoutType = ''
        this.reconnectCount = 0
        this.reLogin = 0
        this.loginStatus = 0 // 0 ws未登录  1 ws登录成功
        this.userForceLogout = false // 是否已经被强制退出
        this.loginLoading = false
        this.toast = null
        this.switchAccountSuccess = null //  切换账户成功回调函数
        this.ping_interval = 25000
        this.pingTime = 0 // 发送心跳的时间点
    }

    setInstance (ws) {
        this.ws = ws
        Listen(ws, store, VUE)
    }

    send (type, data = {}) {
        if (!this.loginStatus && type !== 'login') return
        const params = wsParams(type, data)
        this.ws.send(params)
    }

    // websocket 心跳
    HeartBeatConf (content) {
        this.ping_interval = content.ping_interval
    }

    // 手动退出
    send_logout (logoutType = 'logout') {
        this.logoutType = logoutType
        const userLoginInfo = store.state.ix_user.userLoginInfo
        this.send('logout', {
            company_id: userLoginInfo.company_id,
            account_id: userLoginInfo.account_id,
            account_no: userLoginInfo.account_no
        })
    }

    // 切换账户
    send_switchAccount (callback) {
        this.switchAccountSuccess = callback
        if (Date.now() - window['UserLoginInfoRet']['loginTime'] < 3000) return Toast(i18n.t('loginTip.dataLoading'))
        const info = store.state.ix_user.info
        if (!info) return new Error('store.state.ix_user.info is empty')
        const userInfo = info.toKenCompanyInfoVo

        if (!userInfo.accountDemoNo || !userInfo.accountNo) {
            Toast(i18n.t('loginTip.onlyOneAccount'))
            return false
        }
        // 如果是下单页面切换账号，则跳转到交易页面。
        if (router.app.$route.name === 'Order') router.replace({ name: 'TradeIndex' })
        this.send_logout('switchAccount')
        this.toast = Toast.loading({
            mask: true,
            duration: 0,
            message: i18n.t('accountSwitch')
        })
        this.emptyUserData() // 清空用户相关数据

        // 模拟退出登录
        // setTimeout(() => {
        //     this.UserLogoutRet()
        // }, 1000)
    }

    // 清空用户相关数据
    emptyUserData () {
        window['GroupSymbolList'] = []
        store.commit('ix_quote/EMPTY_data') // 清空产品数据
        store.commit('ix_user/EMPTY_userData') // 清空用户数据
        store.commit('ix_baseInfo/UPDATE_COMPANYINFO', {}) // 清空登陆信息
    }

    // 登录http接口
    httpLogin (data) {
        return store
            .dispatch('login', data)
            .then(res => {
                if (parseInt(res.code) === 1) {
                    return res.data
                } else if (res.msg) {
                    Toast(res.msg)
                    removeLoginData()
                    if (router.currentRoute.name !== 'Login' && !isAPP) {
                        setTimeout(() => {
                            store.commit('UPDATE_loginReload', true)
                            router.push({ name: 'Login' })
                        }, 400)
                    }
                    return false
                }
            })
            .catch(err => {
                console.log('httpLogin', err)
                Toast(typeof err === 'string' ? err : err.toString())
                return false
            })
    }

    // 重新登录
    reHttpLogin () {
        const loginData = getLoginData()
        let loginParams
        if (loginData) {
            loginParams = {
                accountNo: loginData.accountNo,
                passWord: loginData.passWord,
                rawPassword: !!(loginData && loginData.passWord?.length !== 32),
                accountType: loginData.accountType
            }
        }
        this.httpLogin(loginParams).then(res => {
            this.send_wsLogin()
        })
    }

    // 交易服务登录
    send_wsLogin () {
        const loginData = getLoginData()
        if (loginData) {
            const accountTypeText = loginData.accountType === 'real' ? i18n.t('trade.toReal') : store.state.accInfo.maxAmount > 0 ? i18n.t('trade.toExperi') : i18n.t('trade.toDemo')
            this.loginLoading = Toast.loading({
                mask: true,
                duration: 0,
                message: this.logoutType === 'switchAccount' ? accountTypeText : i18n.t('logining')
            })
        }
        const info = store.state.ix_user.info
        let login_name = 'Guest'
        if (info && loginData && loginData.accountNo && loginData.passWord) {
            const toKenCompanyInfoVo = info.toKenCompanyInfoVo
            login_name = toKenCompanyInfoVo.accountType === 'real' ? toKenCompanyInfoVo.accountNo : toKenCompanyInfoVo.accountDemoNo
        }
        if (this.ws.ping) clearInterval(this.ws.ping)
        this.send('login', {
            company_id: store.getters.companyInfo.toKenCompanyInfoVo.companyId,
            login_name: login_name,
            password: loginData && loginData.passWord ? loginData.passWord : '',
            rawPassword: !!(loginData && loginData.passWord?.length !== 32),
            user_type: loginData && loginData.accountType === 'real' ? 0 : 1 // 数据是反的
        })
    }

    // 用户退出
    UserLogoutRet (content) {
        clearInterval(this.ws.ping)
        this.loginStatus = 0
        if (this.logoutType === 'logout') {
            this.logoutType = ''
        } else if (this.logoutType === 'switchAccount') {
            const { toKenCompanyInfoVo } = store.state.ix_user.info
            const localLoginData = getLoginData()
            const loginData = store.state.ix_user.loginData
            store
                .dispatch('login', {
                    accountNo: localLoginData.accountNo,
                    passWord: loginData.passWord,
                    rawPassword: !!(loginData && loginData.passWord?.length !== 32),
                    accountType: toKenCompanyInfoVo.accountType === 'real' ? 'demo' : 'real'
                })
                .then(res => {
                    console.log('passWord', res)
                    if (res && res.code === 1) this.send_wsLogin()
                })
                .catch(error => {
                    console.log(error)
                    this.logoutType = ''
                    this.toast.clear()
                    this.toast = null
                })
        }
    }

    // 初始化产品信息消息
    InitProductInfo (content) {
        // 删除骨架屏动画
        removeSkeleton()
        window['InitProductInfo'] = content
    }

    // 增加订阅的产品
    send_addSubscription_proList (arr = []) {
        /*
         * 自动订阅持仓产品相关code
         * */
        const ix_quote = store.state.ix_quote
        let code = []
        if (arr.length <= 0) {
            code = [].concat(ix_quote.subscription_proList)
        } else {
            code = [].concat(arr)
            store.commit('ix_quote/UPDATE_SUBSCRIPTION_PROLIST', arr)
        }
        const baseSymbol = ix_quote.baseSymbol
        const product_activatedId = ix_quote.product_activatedId
        const baseProduct = [baseSymbol.USDCNY, baseSymbol.USDHKD] // 基础产品 USDCNY  USDHKD
        if (product_activatedId) baseProduct.push(product_activatedId)
        // console.log(ix_quote.positionAboutCode)
        const code_ids = Array.from(new Set(code.concat(ix_quote.positionCode, baseProduct, ix_quote.positionAboutCode)))
        if (code_ids.length === 0) return false
        // 获取产品的最后一口报价s
        // const lastPrice_code_ids = code_ids.filter(el => ix_quote.product_map[el] && !ix_quote.product_map[el].lastPrice)
        if (code_ids.length) this.send('lastPrice', { code_ids: code_ids })
        // 订阅行情
        // const companyId = store.getters.companyInfo.toKenCompanyInfoVo.companyId
        this.send('productSubscription', {
            subscribeType: 'reSubscribe',
            code_ids: code_ids,
            type: 'yz'
        })
    }

    // 登录成功信息s
    UserLoginInfoRet (content) {
        this.loginStatus = 1
        content.loginTime = Date.now()
        this.send_addSubscription_proList() // 重连后登陆成功重新调用产品报价
        const product_activatedId = store.state.ix_quote.product_activatedId
        if (product_activatedId) {
            // 重新拉取产品详细属性
            store.dispatch('ix_quote/getProductInfo', product_activatedId).then(res => {
                console.log(res)
            })
        }
        window['UserLoginInfoRet'] = content
        if (this.logoutType === 'switchAccount') {
            this.logoutType = ''
            Toast({
                message: i18n.t('loginTip.switchSuccess'),
                icon: 'passed'
            })

            const event = new Event('SwitchAccountSuccess')
            window.dispatchEvent(event)

            // 执行回调函数
            if (typeof this.switchAccountSuccess === 'function') {
                this.switchAccountSuccess()
                this.switchAccountSuccess = null
            }
        }
        if (this.loginLoading) {
            setTimeout(() => {
                this.loginLoading.clear()
                this.loginLoading = null
            }, 1000)
        }

        // 发送心跳
        if (this.ws.ping) clearInterval(this.ws.ping)
        this.ws.ping = setInterval(() => {
            // console.log(this.pingTime)
            if (!this.pingTime) {
                this.pingTime = Date.now()
            } else if (process.env.NODE_ENV === 'production') {
                console.log('heartbeat response timeout', this.pingTime)
                this.pingTime = 0
                this.ws.close()
                clearInterval(this.ws.ping)
                return false
            }
            const loginData = getLoginData()
            if (loginData) {
                loginData.lastActivityTime = this.pingTime
                localSet('loginData', loginData)
            }
            this.ws.send(
                wsParams('ping', {
                    beat: 1
                })
            )
        }, this.ping_interval)
    }

    // 获取持仓记录列表
    PositionListRet (content) {
        if (content.total === content.offset) {
            this.send_addSubscription_proList([])
        }
    }

    // 用户被强制退出登录
    UserForceLogoutRet (content, msg) {
        // this.send_logout()
        this.loginStatus = 0
        if (this.ws.ping) clearInterval(this.ws.ping)
        this.userForceLogout = true
        if (msg !== 'isAPP') {
            Dialog.alert({
                message: msg || content.content || i18n.t('loginTip.accountOtherPlaceLogin'),
                confirmButtonText: i18n.t('compLang.OK')
            }).then(() => {
                store.commit('UPDATE_loginReload', true)
                router.push({ name: 'Login' })
            })
        }

        const loginTimestamp = localGet('loginTimestamp')
        if (window.loginTimestamp === Number(loginTimestamp)) { // 如果缓存的登录时间是本次登录的时间，就清理登录账号
            removeLoginData()
        } else {
            const app = document.querySelector('#app')
            app.innerHTML = ''
            sessionStorage.setItem('isDie', 'true')
        }
        store.commit('ix_user/EMPTY_userData') // 清空用户数据
        this.ws.close()
    }

    // 心跳返回
    pong (content) {
        this.pingTime = 0
    }
}

function install (Vue, wsURL, options) {
    store = options.store
    router = options.router
    VUE = Vue // 千万不要删除这里
    const reconnection = !isAPP || (isAPP && !notLinkWs) // APP内嵌的页面不部分页面处理ws重连
    Vue.use(VueNativeSock, wsURL, {
        reconnection: reconnection, // (Boolean) whether to reconnect automatically (false)
        reconnectionAttempts: 1000, // (Number) number of reconnection attempts before giving up (Infinity),
        reconnectionDelay: 3000,
        connectManually: false,
        passToStoreHandler,
        store
    })
    const $socket = Vue.prototype.$socket
    Listen($socket, store, VUE)
    const ws = new WS($socket)
    Vue.prototype.$ws = ws
    function passToStoreHandler (eventName, event) {
        // console.log(eventName)
        if (eventName === 'SOCKET_RECONNECT') {
            ws.reconnectCount++
        } else if (eventName === 'SOCKET_onclose') {
            // 强制退出后不需要显示重连提示
            if (!ws.userForceLogout && reconnection) {
                ws.reconnectLoading = Toast.loading({
                    mask: true,
                    duration: 0,
                    message: i18n.t('websocket.linking')
                })
            }
            ws.pingTime = 0
            ws.loginStatus = 0
        } else if (eventName === 'SOCKET_onopen') {
            if (ws.reconnectLoading) ws.reconnectLoading.clear()
            const newSocket = event.target
            ws.setInstance(newSocket)
            ws.userForceLogout = false
            wsBindEvent(newSocket, ws)
            const isDie = sessionStorage.getItem('isDie')
            if (ws.reconnectCount > 0 && !isDie) {
                // 重新连接之后自动登陆
                // ws.send_wsLogin()
                ws.reHttpLogin()
            }
        }
    }
    wsBindEvent($socket, ws)
}
function localError (evt) {
    const t = dayjs().format('YYYY MM-DD HH:mm:ss SSS')
    localStorage.setItem('t_' + t, evt.data)
}
function wsBindEvent ($socket, ws) {
    if (!$socket) return false
    $socket.addEventListener(
        'message',
        evt => {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const res = JSON.parse(evt.data)
            const msg_code = res.msg_code
            if (res.code === '0000' && ws[msg_code]) {
                ws[msg_code](res.content)
            } else if (msg_code === 'UserLoginInfoRet' && res.code !== '0000') {
                // ws.reLogin++
                // ws.send_wsLogin()
                store.commit('UPDATE_loginReload', true)
                ws.UserForceLogoutRet(null, isAPP ? 'isAPP' : i18n.t('websocket.linkFail'))
                // localError(evt)
            } else if (res.code !== '0000') {
                // localError(evt)
            }
        },
        false
    )
    $socket.addEventListener(
        'close',
        evt => {
            console.warn('$socket close', evt)
            ws.loginStatus = 0
            if (ws.ws.ping) clearInterval(ws.ws.ping)
        },
        false
    )
    $socket.addEventListener(
        'error',
        evt => {
            console.warn('$socket error', evt)
            ws.loginStatus = 0
            if (ws.ws.ping) clearInterval(ws.ws.ping)
        },
        false
    )
}

export default install
