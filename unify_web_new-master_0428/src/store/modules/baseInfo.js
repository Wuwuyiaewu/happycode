import dayjs from 'dayjs'
export default {
    namespaced: true,
    state: {
        companyInfo: {},
        style: {},
        // addPlatformCode: false, //是否添加平台错误码
        localTimeDiffServer: 'error', // 本地时间跟服务器时间的时间差 本地时间-服务器时间 error未获取到交易服务器时间
        tradeServerTime: 0 // 交易服务器时间
        // groupTradeTimeListRet: {}, // 产品交易时间信息
        // serverget: {} // 交易服务器信息
    },
    mutations: {
        UPDATE_COMPANYINFO (state, data) {
            const prevCompanyInfo = state.companyInfo
            if (prevCompanyInfo?.toKenCompanyInfoVo?.accountType === 'visitor' && data.toKenCompanyInfoVo?.accountType === 'visitor') {
                // 游客重连后拉取到公司的配置信息不处理，避免重新渲染开户页面，导致之前填写的开户信息丢失
                return
            }
            const ads = {}
            const uiPageList = data.uiPageList || []
            uiPageList.forEach((pageInfo, index) => {
                if (pageInfo.type === 'external') {
                    // 内嵌的外部页面，不存在广告
                    ads[pageInfo.code] = Object.assign(pageInfo, { uiModules: null })
                } else {
                    // 自己的页面会有广告位
                    const uiModules = pageInfo.uiModules
                    if (!uiModules) return false
                    if (!ads[pageInfo.code]) {
                        ads[pageInfo.code] = {
                            index,
                            top: [],
                            middle: [],
                            uiModules: [],
                            bottom: [],
                            other: '',
                            title: ''
                        }
                    }
                    const pageAd = ads[pageInfo.code]
                    pageInfo.uiModules.forEach(ui => {
                        const locating = ui.locating
                        if (ui.moduless === 'menu' && ui.uiComponent) {
                            pageAd[locating] = ui.uiComponent.map(item => Object.assign(item, { page: pageInfo.code, position: locating }))
                        } else if (pageAd[locating] && ui.uiComponent) {
                            pageAd[locating].push(ui)
                        }
                        pageAd.uiModules = pageInfo.uiModules
                        pageAd.type = pageInfo.type
                        pageAd.other = pageInfo.other
                        pageAd.title = pageInfo.title
                    })
                }
            })
            state.companyInfo = Object.assign(data, { uiPageList: ads })
        },
        UPDATE_STYLE (state, data) {
            state.style = data
        },
        UPDATE_localTimeDiffServer (state, data) {
            state.localTimeDiffServer = data
        },
        UPDATE_tradeServerTime (state, data) {
            state.tradeServerTime = data
        }
        // UPDATE_SERVERGET(state, data) {
        //     state.serverget = data
        // },
        // UPDATE_addPlatformCode(state, flg) {
        //     state.addPlatformCode = flg
        // }
    },
    actions: {
        symoblCanTrade ({ comit, dispatch }, symoblId) {
            // msgCode 0 正常 2 symbold未匹配到  3 获取服务器时间失败
            // mayTrade true 可交易 false 不可交易
            return new Promise((resolve, reject) => {
                resolve({
                    msgCode: 0,
                    mayTrade: true
                })
            })
        }
        // symoblCanTradeQuote({ comit, dispatch, state }, symoblId) {
        //     // msgCode 0 正常 2 symbold未匹配到  3 获取服务器时间失败
        //     // mayTrade true 可交易 false 不可交易
        //     return new Promise((resolve, reject) => {
        //         if (!symoblId) {
        //             return resolve({
        //                 msgCode: 2,
        //                 mayTrade: false,
        //                 symoblId: symoblId
        //             })
        //         }
        //         if (state.localTimeDiffServer == 'error') {
        //             return resolve({
        //                 msgCode: 0,
        //                 mayTrade: true,
        //                 symoblId: symoblId
        //             })
        //         }
        //         dispatch('ix_quote/showTradeTime', { symbolId: symoblId }, { root: true }).then(showSchedule => {
        //             const date = dayjs(parseInt(Math.round(new Date().getTime() / 1000) + state.localTimeDiffServer + '000'))
        //             const baseData = showSchedule[date.day()]
        //             if (baseData && baseData.length > 0) {
        //                 const minus = parseInt(date.format('HH')) * 60 + parseInt(date.format('mm'))
        //                 const params = {
        //                     mayTrade: false,
        //                     msgCode: 0,
        //                     symoblId: symoblId
        //                 }

        //                 for (let i = 0; i < baseData.length; i++) {
        //                     if (minus >= baseData[i].start_time && minus <= baseData[i].end_time) {
        //                         params.mayTrade = true
        //                         break
        //                     }
        //                 }
        //                 resolve(params)
        //             } else {
        //                 resolve({
        //                     mayTrade: false,
        //                     msgCode: 2,
        //                     symoblId: symoblId
        //                 })
        //             }
        //         })
        //     })
        // }
    }
}
