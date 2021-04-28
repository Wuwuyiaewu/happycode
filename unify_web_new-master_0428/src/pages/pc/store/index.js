import { customConfig, userRiskInfo, userStatus } from '@/api/base'
import { login } from '@/api/login'
import { getAccPriceInfo } from '@/api/mine'
import { msgTotal, msgTypeList } from '@/api/msg'
import { list } from '@/api/selfSymbol'
import { getData } from '@/api/userConfiInfo'
import { setORColor } from '@/config'
import getters from '@/store/getters'
import { ix_baseInfo, ix_quote, ix_user } from '@/store/ix_store'
import gaAnalytics from '@/utils/gaAnalytics'
import { delayAwait, deviceType, getFingerprint, getGeolocation, getQueryVariable, localGet, localRemove, localSet, resolveUserRiskInfoParams } from '@/utils/index'
import { isAPP } from '@m/base/appHybrid'
import { i18n } from '@m/lang'
import { Toast } from 'vant'
import Vue from 'vue'
import Vuex from 'vuex'
import funds from './modules/funds'
import tagsView from './modules/tagsView'
import { createProphetFunction } from '@/utils/prophet.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        ix_baseInfo,
        ix_user,
        ix_quote,
        tagsView,
        funds
    },
    state: {
        origin: getQueryVariable('origin'), // 'miniTrade' ||
        selfSymbolList: [], // 自选产品列表，
        selfSymbolListFinish: false, // 自选产品列表拉取成功
        userConfigInfo: {
            type: '' // 涨跌颜色设置
        },
        msgData: {
            mineDot: false,
            totalNewMsg: 0,
            msgTypeList: []
        },
        loginReload: false,
        disabledSuccAnimtion: true,
        userStatus: {
            bankInfoRejectedReason: null,
            bankInfoStatus: null,
            idDocumentRejectedReason: null,
            idDocumentStatus: null,
            infoApprovalStatus: -1
        },
        customConfig: null,
        accInfo: {},
        inApp: isAPP,
        userRiskInfo: {} // 指纹
    },
    mutations: {
        UPDATE_selfSymbolList (state, data) {
            state.selfSymbolList = data
            state.selfSymbolListFinish = true
        },
        UPDATE_userConfigInfo (state, data) {
            state.userConfigInfo.type = data
        },
        UPDATE_msgDataMineDot (state, data) {
            state.msgData.mineDot = data
        },
        UPDATE_msgDataTotalNewMsg (state, data) {
            state.msgData.totalNewMsg = data
        },
        UPDATE_msgTypeList (state, data) {
            state.msgData.msgTypeList = data
        },
        UPDATE_loginReload (state, data) {
            state.loginReload = data
        },
        UPDATE_disabledSuccAnimtion (state, data) {
            state.disabledSuccAnimtion = data
        },
        UPDATE_accInfo (state, data) {
            state.accInfo = data
        },
        UPDATE_userStatus (state, data) {
            Object.assign(state.userStatus, data)
        },
        UPDATE_customConfig (state, data) {
            state.customConfig = data
        },
        UPDATE_userRiskInfo (state, data) {
            state.userRiskInfo = data
        }
    },
    actions: {
        login ({ dispatch, commit, state }, data = {}) {
            const sourceParams = sessionStorage.getItem('sourceParams') || ''
            const utmSource = getQueryVariable('utm_source', sourceParams)
            Object.assign(data, { imei: deviceType(), utmSource })
            const loading = Toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            return login(data)
                .then(async res => {
                    loading.clear()
                    if (parseInt(res.code) === 1) {
                        window.loginTimestamp = Date.now()
                        localSet('loginTimestamp', window.loginTimestamp) // 缓存记录登录时间
                        const resultData = res.data
                        checkMineSetting(resultData.uiPageList)
                        const transBaseConfigVo = resultData.transBaseConfigVo
                        sessionStorage.setItem('getAppProperties', JSON.stringify(resultData))
                        window['clientIp'] = resultData.clientIp
                        sessionStorage.setItem('clientIp', resultData.clientIp)
                        localSet('loginTime', (transBaseConfigVo ? transBaseConfigVo.loginTime : 86400) * 1000) // 登录有效时间
                        commit('ix_baseInfo/UPDATE_COMPANYINFO', res.data, { root: true })
                        commit('ix_quote/UPDATE_lang', transBaseConfigVo.language)
                        commit(
                            'ix_quote/UPDATE_baseSymbol',
                            {
                                USDCNY: transBaseConfigVo.usdcnyCodeid,
                                USDHKD: transBaseConfigVo.usdhkdCodeid
                            },
                            { root: true }
                        )
                        if (data.accountNo) {
                            data.accountType = resultData.toKenCompanyInfoVo.accountType
                            const loginData = Object.assign({ lastActivityTime: Date.now() }, data)
                            commit('ix_user/UPDATE_LOGINDATA', loginData)
                            commit('ix_user/UPDATE_INFO', res.data)
                            localSet('useRealWSS', 'true') // 记录登录动作，下次可使用 /v/websocket 地址链接
                            localSet('loginData', JSON.stringify(loginData)) // 保存登录信息到localstorage里边
                            localStorage['loginData'] = JSON.stringify(loginData)
                            localSet('latelyAccount', JSON.stringify({ accountNo: data.accountNo, accountType: data.accountType })) // 缓存最近登录的账号
                            const globalTip = JSON.parse(localGet('globalTip')) || {}
                            if (globalTip.accountNo !== resultData.toKenCompanyInfoVo.accountNo && globalTip.accountNo !== resultData.toKenCompanyInfoVo.accountDemoNo) {
                                localRemove('globalTip')
                            }
                            if (transBaseConfigVo.otherConfigJ && transBaseConfigVo.otherConfigJ.activity) {
                                const accPriceInfo = await dispatch('getAccPriceInfo') // 获取消息数据
                                const inAccPriceInfo = accPriceInfo?.code === '0' && accPriceInfo?.data?.maxAmount > 0 // 是否参与了活动
                                const inActivate = resultData.toKenCompanyInfoVo.activateTime // 是否已升级账户(入金)
                                if (inAccPriceInfo && data.accountType === 'real' && !inActivate) return dispatch('login', { ...data, accountType: 'demo' }) // 如果是已经参与了活动但是未升级账户，重新登录体验账户
                            }
                            // if (data.accountType == 'real') {
                            dispatch('getMsgTypeList') // 获取消息数据
                            // }
                        }
                        dispatch('getSelfSymbolList')
                        dispatch('getUserConfiInfo', { language: transBaseConfigVo.language, accountType: data ? data.accountType : '' })
                        gaAnalytics(res.data.transBaseConfigVo.googleAnalytics)
                        createProphetFunction(res.data.transBaseConfigVo.prophet)
                    } else if (res.message) {
                        Toast(res.message)
                    }
                    return res
                })
                .catch(err => {
                    console.log('loginFailure', err.response)
                    const data = err.response && err.response.data
                    let msg = i18n.t('loginFailure')
                    if (data && data.msg) msg = data.msg
                    if (loading) loading.clear()
                    Toast({
                        message: msg,
                        duration: 3000
                    })
                    return err
                })
        },
        // PCUI进入页面时，设置默认显示的产品
        setDefaultProduct ({ commit, state }, queryId) {
            if (!state.selfSymbolListFinish && state.ix_quote.product_activatedId) return
            let id = 0
            const selfSymbolList = state.selfSymbolList
            const product_map = state.ix_quote.product_map

            // 路由携带产品id
            if (queryId && product_map[queryId]) {
                console.log('queryId: ', queryId)
                commit('ix_quote/UPDATE_PRODUCT_ACTIVATED_ID', queryId)
                return
            }

            const selfSymbol = selfSymbolList.find(el => product_map[el.symbolId]) // 找出自选列表里面第一个有权限的产品
            if (selfSymbol) {
                id = selfSymbol.symbolId
            } else if (state.ix_quote.product_category.length) {
                const category = state.ix_quote.product_category[0]
                const idsList = parseInt(category.tagDiplay) === 3 ? category.code_ids : category.tagsList[0]?.code_ids
                const item = idsList.find(el => product_map[el]) // 找出列表里面第一个有权限的产品
                console.log(item)
                id = item
            }
            if (id) {
                commit('ix_quote/UPDATE_PRODUCT_ACTIVATED_ID', id)
            }
        },
        // 获取自选股
        getSelfSymbolList ({ commit }) {
            return list()
                .then(res => {
                    if (parseInt(res.code) === 1 && res.data) {
                        commit('UPDATE_selfSymbolList', res.data)
                    }
                    return res
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 获取开户活动信息
        getAccPriceInfo ({ commit, dispatch }) {
            return new Promise(resolve => {
                getAccPriceInfo()
                    .then(res => {
                        if (parseInt(res.code) === 0) {
                            commit('UPDATE_accInfo', res.data)
                        }
                        resolve(res)
                    })
                    .catch(error => {
                        console.log(error)
                        resolve({ code: '0001' })
                    })
            })
        },
        // 获取消息分类，未读消息数量
        getMsgTypeList ({ commit, dispatch }) {
            return msgTypeList()
                .then(res => {
                    if (res.code == '1' && res.data) {
                        const _data = res.data || []
                        commit(
                            'UPDATE_msgTypeList',
                            _data.map(item => Object.assign({ msgNum: 0 }, item))
                        )
                        dispatch('getMsgTotal')
                    }
                    return res
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getMsgTotal ({ commit, state }) {
            let data = JSON.parse(JSON.stringify(state.msgData.msgTypeList))
            if (data[0] && data[0].code == 'all') {
                data = data.splice(1)
            }
            return msgTotal({
                status: 'NO',
                type: data.map(item => item.code).join(',')
            })
                .then(res => {
                    if (res.code == '1' && res.data) {
                        const type_total_map = res.data.type_total_map || {}
                        const _data = [
                            {
                                msgNum: res.data.total || 0,
                                code: 'all',
                                name: i18n.t('msg.allMsg')
                            }
                        ]
                        data.forEach(item => {
                            _data.push(Object.assign({}, item, { msgNum: type_total_map[item.code] || 0 }))
                        })
                        commit('UPDATE_msgTypeList', _data)
                        commit('UPDATE_msgDataTotalNewMsg', res.data.total || 0)
                        if (res.data.total > 1) {
                            commit('UPDATE_msgDataMineDot', true)
                        }
                    }
                    return res
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getUserConfiInfo ({ commit }, data) {
            // 0 未设置，1 绿涨红跌，2 红涨绿跌
            return new Promise((resolve, reject) => {
                if (data.accountType) {
                    // 已登录
                    getData()
                        .then(res => {
                            let userSet = res.data ? parseInt(res.data.type) : ''
                            if (!userSet) {
                                // userSet = data.language == 'zh-CN' ? '2' : '1'
                                userSet = '1'
                            }
                            setORColor(commit, userSet)
                            resolve(userSet)
                        })
                        .catch(error => {
                            // let userSet = data.language == 'zh-CN' ? '2' : '1'
                            const userSet = '1'
                            setORColor(commit, userSet)
                            resolve(userSet)
                        })
                } else {
                    // 游客
                    let userSet = localGet('orColorSetting')
                    if (!userSet) {
                        userSet = '1'
                        // userSet = data.language == 'zh-CN' ? '2' : '1'
                    }
                    setORColor(commit, userSet)
                    resolve(userSet)
                }
            })
        },
        getUserStatus ({ commit }, data) {
            return userStatus()
                .then(res => {
                    if (parseInt(res.code) === 1 && res.data) {
                        const data = res.data
                        if (parseInt(data.idDocumentStatus) === 3 || parseInt(data.bankInfoStatus) === 3) {
                            data.infoApprovalStatus = 3 // 3-认证失败
                        } else if (parseInt(data.idDocumentStatus) === 0 || parseInt(data.bankInfoStatus) === 0) {
                            data.infoApprovalStatus = 0 // 0-未认证
                        } else if (parseInt(data.idDocumentStatus) === 1 && parseInt(data.bankInfoStatus) === 1) {
                            data.infoApprovalStatus = 1 // 1-已认证
                        } else {
                            data.infoApprovalStatus = 2 // 2-认证审核中
                        }
                        commit('UPDATE_userStatus', data)
                    }
                    return res
                })
                .catch(error => {
                    console.log(error)
                    return error
                })
        },
        getCustomConfig ({ commit }, data) {
            return customConfig()
                .then(res => {
                    commit('UPDATE_customConfig', res)
                    return res
                })
                .catch(err => {
                    console.log(err)
                    return err
                })
        },
        genUserRiskInfo ({ commit, state }, data) {
            if (Object.keys(state.userRiskInfo).length) {
                return
            }
            const result = {}
            return getFingerprint()
                .then(res => {
                    Object.assign(result, res)
                    return getGeolocation()
                })
                .then(location => {
                    result['geolocation'] = location
                    commit('UPDATE_userRiskInfo', result)
                })
        },

        sendUserRiskInfo ({ state }, data) {
            return new Promise((resolve, reject) => {
                const { loginName, mobilePhone } = state.ix_baseInfo.companyInfo.toKenCompanyInfoVo
                const params = resolveUserRiskInfoParams(data, {
                    mobilePhone: mobilePhone,
                    accountNo: loginName,
                })

                delayAwait(() => Object.keys(state.userRiskInfo).length, true)
                    .then(() => {
                        return userRiskInfo({
                            ...state.userRiskInfo,
                            ...params
                        })
                            .then(res => {
                            })
                            .catch(error => {
                                console.error('sendUserRiskInfo: ', error)
                            })
                    })
                setTimeout(resolve, 200)
            })
        }
    },
    getters
})

// 检查我的页面是否配置设置功能，如果没有配置则主动加上
function checkMineSetting (data = []) {
    const mine = data.find(el => el.code === 'Mine')
    if (!mine) return false
    const { uiComponent } = mine.uiModules[0] || {}
    if (!uiComponent) return false
    const resetpwd = uiComponent.findIndex(el => el.url === '/mine/resetpwd')
    if (resetpwd > -1) uiComponent.splice(resetpwd, 1)
    const SettingTradeColor = uiComponent.findIndex(el => el.url === '/SettingTradeColor')
    if (SettingTradeColor > -1) uiComponent.splice(SettingTradeColor, 1)
    const setting = uiComponent.findIndex(el => el.url === '/mine/setting')
    if (setting === -1) {
        let title = '设置'
        if (localStorage['lang'] == 'en-US') {
            title = 'Setting'
        }
        uiComponent.push({
            accountStatus: 'G,D,N,A',
            code: '',
            img: 'https://i.loli.net/2019/09/29/jPAsGvoiXCF8UBH.png',
            modules: '9af8cb5239f1405ba7493391484a1639',
            name: '',
            openUrlType: '_self',
            title: title,
            type: 'menu',
            url: '/mine/setting',
            urlType: '1'
        })
    }
}

export default store
