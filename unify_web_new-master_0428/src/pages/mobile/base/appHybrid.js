// appOpenBrower(String url) //跳转到浏览器
// appOpenNewpage(String url)  //打开一个新页面（不带标题）
// appOpenNewpage(String url，String title)  //打开一个新页面（带标题）
// appSetTitle(String title)  //设置网页标题
// appGoHome()  //跳转至APP首页
// appGoQuote() //跳转到行情页面
// appGoChart(long symbolId) //跳转到图表页
// appGoNewOrder(long symbolId, int direction)//跳转到下单页；1买 2卖
// appGoPosition(long positionId)  //查看持仓详情
// appGoOrder(long orderId)  //查看挂单详情
// appGoDeal(String dealId)  //查看已平仓详情
// appGoPositionList()    //跳转到持仓列表
// appGoOrderList()  //跳转到挂单列表
// appGoDealList()    //跳转到已平仓列表
// appGoMine()    //跳转到我的
// appGoLogin()  //跳转至登录页
// appGoRegister()  //跳转至注册开户
// appGoCS()  //跳转到客服
// appGoDeposit() //跳转到入金
// appGoWithdrawal()  //跳转到出金
// appGoAssets()  //跳转到资产页
// appGetImei()  //APP获取设备唯一码，Android返回的是oaid
// 链接里面带入webViewNoTop=yes参数，不使用APP头部

import { getQueryVariable } from '@/utils/index'

function appFunction (funcName, ...arg) {
    if (window.JsHook && JsHook[funcName]) {
        // 万年历的方法
        JsHook[funcName](...arg)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[funcName]) {
        window.webkit.messageHandlers[funcName].postMessage(arg)
    }
}

// APP打开浏览器
export function openAdUrl (url, $event) {
    if (!url) return
    if (url.indexOf('appOpenBrower=true') >= 0) {
        appOpenBrower(url)
        $event.preventDefault()
        $event.stopPropagation()
        return false
    }
}
// 打开外部浏览器
export function appOpenBrower (dlUrl) {
    if (!dlUrl) return alert('请提供下载地址')
    try {
        if (window.UIObject && UIObject.appOpenBrower) {
            // 站点的方法
            UIObject.appOpenBrower(dlUrl)
        } else if (window.JsHook && JsHook.appOpenBrower) {
            // 万年历的方法
            JsHook.appOpenBrower(dlUrl)
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
            window.webkit.messageHandlers.appOpenBrower.postMessage({
                url: dlUrl
            })
        } else {
            window.location.href = dlUrl
        }
    } catch (err) {
        console.log('appOpenBrower', err.message)
    }
}
// 关闭app窗口
export function appClose () {
    if (window.JsHook && JsHook.appClose) {
        JsHook.appClose()
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appClose) {
        window.webkit.messageHandlers.appClose.postMessage({ url: '123' })
    } else {
        window.close()
    }
}
// 是否在APP内打开
export const isAPP = (function () {
    if (sessionStorage.getItem('isAPP')) {
        return true
    } else if (getQueryVariable('isAPP')) {
        return true
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        return true
    } else {
        return false
    }
})()
// 是否在壳包内打开
export const isFakeAPP = (function () {
    if (isAPP) {
        return false
    } else if (window.UIObject && UIObject.appOpenBrower) {
        return true
    } else if (window.JsHook && JsHook.appOpenBrower) {
        return true
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        return true
    } else {
        return false
    }
})()

export function appOpenNewpage (url, title = '') {
    appFunction('appOpenNewpage', url, title)
}

// 设置网页标题
export function appSetTitle (title = '') {
    if (window.JsHook && JsHook.appSetTitle) {
        JsHook.appSetTitle(title)
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appSetTitle) {
        window.webkit.messageHandlers.appSetTitle.postMessage(title)
    } else {
        document.title = title
    }
}
// 跳转至APP首页
export function appGoHome () {
    appFunction('appGoHome')
}
// 跳转到行情页面
export function appGoQuote () {
    appFunction('appGoQuote')
}
// 跳转到图表页
export function appGoChart (symbolId) {
    appFunction('appGoChart', symbolId)
}
// appGoNewOrder(long symbolId, int direction)//跳转到下单页；1买 2卖
export function appGoNewOrder (symbolId, direction = 1) {
    appFunction('appGoNewOrder', symbolId, direction)
}

// appGoPosition(long positionId)  //查看持仓详情 暂不支持
// export function appGoPosition(positionId) {
//     appFunction('appGoPosition', positionId)
// }
// appGoOrder(long orderId)  //查看挂单详情 暂不支持
// export function appGoOrder(orderId) {
//     appFunction('appGoOrder', orderId)
// }
// appGoDeal(String dealId)  //查看已平仓详情 暂不支持
// export function appGoDeal(dealId) {
//     appFunction('appGoDeal', dealId)
// }
// appGoPositionList()    //跳转到持仓列表
export function appGoPositionList () {
    appFunction('appGoPositionList')
}
// appGoOrderList()  //跳转到挂单列表
export function appGoOrderList () {
    appFunction('appGoOrderList')
}
// appGoDealList()    //跳转到已平仓列表
export function appGoDealList () {
    appFunction('appGoDealList')
}
// appGoMine()    //跳转到我的
export function appGoMine () {
    appFunction('appGoMine')
}
// appGoLogin()  //跳转至登录页
export function appGoLogin () {
    appFunction('appGoLogin')
}
// appGoRegister()  //跳转至注册开户
export function appGoRegister () {
    appFunction('appGoRegister')
}
// appGoCS()  //跳转到客服
export function appGoCS () {
    appFunction('appGoCS')
}
// appGoDeposit() //跳转到入金
export function appGoDeposit () {
    appFunction('appGoDeposit')
}
// appGoWithdrawal()  //跳转到出金
export function appGoWithdrawal () {
    appFunction('appGoWithdrawal')
}
// appGoAssets()  //跳转到资产页
export function appGoAssets () {
    appFunction('appGoAssets')
}
// appAccountLogin()  //调用APP登录方法，开户成功页面调用，如果传第四个参数表示登录成功后立即入金
export function appAccountLogin (code, account, pwd, something) {
    appFunction('appAccountLogin', code, account, pwd, something)
}

export function appLoginInfo () {
    return new Promise((resolve, reject) => {
        const IOS_funcname = 'IOS_funcname' + Date.now()
        window[IOS_funcname] = function (dataStr) {
            if (typeof dataStr === 'string') dataStr = JSON.parse(dataStr)
            resolve(dataStr)
        }
        const urlToken = getQueryVariable('token')
        try {
            if (window.JsHook && window.JsHook.appAccountInfo) {
                // Android
                let result = window.JsHook.appAccountInfo()
                if (typeof result === 'string') result = JSON.parse(result)
                resolve(result)
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['appAccountInfo']) {
                // ios
                window.webkit.messageHandlers['appAccountInfo'].postMessage([IOS_funcname])
            } else if (urlToken) {
                resolve({
                    authorization: 'Bearer ' + urlToken,
                })
            } else {
                reject({})
                // resolve({
                //     authorization: 'Bearer ' + getQueryVariable('token'),
                //     clientIp: '183.14.135.215',
                //     selfSymbolVoList: [],
                //     toKenCompanyInfoVo: {
                //         accMaxPosSwapRate: null,
                //         accountDemoNo: '86001307',
                //         accountNo: '86001307',
                //         accountType: 'real',
                //         activateTime: null,
                //         apiToken: '6D583536493465326B524C4E657472554877343679453875545251456C63656A62397931655872316936593D',
                //         companyId: '112010',
                //         companyToken: 'yhyttest',
                //         currency: 'USD',
                //         customerId: '1088482',
                //         demoAccMaxPosSwapRate: null,
                //         demoAccountGroupId: '181055',
                //         demoCurrency: 'IXD',
                //         demoCustomerId: '1088481',
                //         demoHedgingType: '0',
                //         demoMarginCallLevel: 200,
                //         demoStopOutLevel: 180,
                //         demoTradeAccountId: 2528410,
                //         hedgingType: '0',
                //         loginName: '13200001211',
                //         marginCallLevel: 300,
                //         mobilePhone: '13200001211',
                //         openId: '65656C7330757A492B4232314E35424869372B423549346541684B2F43636C2B456245387972686833543173427039545969457A6E364A765951744849756E6F4A534942654556657745777541416549536D696B35673D3D',
                //         openMt4Account: false,
                //         passWord: '******',
                //         realAccountGroupId: '181056',
                //         stopOutLevel: 200,
                //         tradeAccountId: 2528411,
                //         uuid: null,
                //         visitAccountGroupId: null
                //     },
                //     transBaseConfigVo: {
                //         apiKey: '',
                //         appId: 'yzkey',
                //         appKey: 'yzkey',
                //         businessType: '',
                //         companyId: '112010',
                //         createDate: 1608795268000,
                //         googleAnalytics: null,
                //         gts2platform: null,
                //         id: '63c823c1cfa549d090e5bb2e6ff7f97b',
                //         language: 'zh-CN',
                //         loginTime: 86400,
                //         marginLevel: '{marginLess:100, marginWarn:500}',
                //         onlineService: null,
                //         paySwitchFlowTagCode: 'P2',
                //         paySwitchSeqTagCode: 'N',
                //         platform: 'YZ',
                //         sensorsData: null,
                //         status: '1',
                //         transId: 9069,
                //         usdcnyCodeid: 3224113,
                //         usdhkdCodeid: 3289649,
                //         otherConfigJ: {
                //             activity: true,
                //             agent: true,
                //             newPay: true,
                //             param: 'yzhtml',
                //             url: 'https://testixmiddle.ixmiddle.com',
                //             url2: 'https://testixmiddle.ixmiddle.com'
                //         }
                //     }
                // })
            }
        } catch (err) {
            reject(err.message)
        }
    })
}
export function appGroupSymbolList () {
    return new Promise((resolve, reject) => {
        const IOS_funcname = 'IOS_funcname_symbol_list' + Date.now()
        window[IOS_funcname] = function (dataStr) {
            if (typeof dataStr === 'string') dataStr = JSON.parse(dataStr)
            resolve(dataStr)
        }
        try {
            if (window.JsHook && window.JsHook.appGroupSymbolList) {
                // Android
                let result = window.JsHook.appGroupSymbolList()
                if (typeof result === 'string') result = JSON.parse(result)
                resolve(result)
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['appGroupSymbolList']) {
                // ios
                window.webkit.messageHandlers['appGroupSymbolList'].postMessage([IOS_funcname])
            } else {
                reject({})
            }
        } catch (err) {
            reject(err.message)
        }
    })
}

// APP获取设备唯一码，Android返回的是oaid, 目前只有Android实现了此方法
export function appGetImei () {
    return new Promise((resolve, reject) => {
        const IOS_funcname = 'IOS_funcname_symbol_list' + Date.now()
        window[IOS_funcname] = function (dataStr) {
            if (typeof dataStr === 'string') dataStr = JSON.parse(dataStr)
            resolve(dataStr)
        }
        try {
            if (window.JsHook && window.JsHook.appGetImei) {
                // Android
                const result = window.JsHook.appGetImei()
                resolve(result)
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers['appGetImei']) {
                // ios
                window.webkit.messageHandlers['appGetImei'].postMessage([IOS_funcname])
            } else {
                resolve('')
            }
        } catch (err) {
            console.log(err)
            resolve('')
        }
    })
}
