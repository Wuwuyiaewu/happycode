import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@m/layout/index.vue'
import To from '@m/views/to.vue'
import { getLoginData, delayAwait } from '@/utils/index'
import { setProphet } from '@/utils/prophet'
import { Toast } from 'vant'
import { loadLanguageAsync, i18n } from '@m/lang'
import { isAPP, appGoHome, appSetTitle } from '@m/base/appHybrid'
import Funds from './modules/funds'
Vue.use(Router)

// 缓存渠道广告信息
if (location.search && location.search.indexOf('?') >= 0)
    sessionStorage.setItem('sourceParams', location.search)





let pageLoading
    // 交易相关页面需要拿到 GroupSymbolListRet 信息才进入
const beforeEnterTradePage = (to, from, next) => {
    if (window['GroupSymbolList'].length > 0)
        return next()



    window.addEventListener('GroupSymbolListRet', function(e) {
        next(true)
    }, false)
}

// 升级账户进度校验
const UpgradeAccountBeforeEnter = (to, from, next) => {
    if (to.params._routeOk) {
        next()
    } else {
        delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
            if (!res.toKenCompanyInfoVo.accountNo) {
                if (to.params.step + '' === '1') {
                    next()
                } else {
                    next({
                        name: 'UpgradeAccountStep',
                        replace: !to.redirectedFrom,
                        params: {
                            step: 1,
                            _routeOk: true
                        }
                    })
                }
            } else if (!res.toKenCompanyInfoVo.activateTime) {
                if (to.params.step + '' === '2') {
                    next()
                } else {
                    next({
                        name: 'UpgradeAccountStep',
                        replace: !to.redirectedFrom,
                        params: {
                            step: 2,
                            _routeOk: true
                        }
                    })
                }
            } else {
                next({ name: 'DepositFunds' })
            }
        })
    }
}

const routes = [{
        path: '',
        component: Layout,
        redirect: 'home',
        children: [{
            path: 'home',
            name: 'Home',
            component: () =>
                import ('@m/views/home.vue'),
            meta: {
                title: 'router.index',
                disabledInApp: true,
                cache: true,
                pageFull: true,
                haveNav: true,
                roles: ['Guest']
            } // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面
        }, {
            path: '/nest/:id',
            name: 'Nest',
            component: () =>
                import ('@m/views/iframe.vue'),
            meta: {
                roles: ['Guest'],
                pageFull: true
            }
        }]
    },
    {
        path: '/demohome',
        name: 'Demohome',
        component: Layout,
        meta: {
            title: 'Demohome首頁',
            roles: ['Guest'],
            // disabledInApp: true,
            // cache: true,
            pageFull: true,
            haveNav: true,
        }, // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面
        children: [{
                path: 'demo',
                name: 'demo',
                component: () =>
                    import ('@m/views/homeForDemo.vue'),
            }]
            // component: Layout,
            // redirect: 'demohome',
            // children: [{
            //     path: 'demohome',
            //     name: 'Demohome',
            //     component: () =>
            //         import ('@m/views/homeForDemo.vue'),
            // }, ]
    },
    {
        path: '/trade',
        component: Layout,
        redirect: '/trade/index',
        beforeEnter: beforeEnterTradePage,
        children: [{
            path: '',
            name: 'TradeIndex',
            component: () =>
                import ('@m/views/trade/trade.vue'),
            meta: {
                title: 'router.trade',
                disabledInApp: true,
                cache: true,
                pageFull: true,
                haveNav: true,
                roles: ['Guest']
            }
        }, {
            path: 'category',
            name: 'TradeCategory',
            component: () =>
                import ('@m/views/trade/category/category.vue'),
            meta: {
                title: '',
                cache: false,
                roles: ['Guest']
            }
        }, {
            path: 'myorderinfo/:id',
            name: 'MyOrderInfo',
            component: () =>
                import ('@m/views/myOrderInfo/'),
            meta: {
                title: 'router.positionDetail',
                pageFull: true
            } // pageFull 页面是否全屏显示
        }]
    },
    {
        path: '/selfSymbol',
        component: Layout,
        redirect: '/selfSymbol/index',
        beforeEnter: beforeEnterTradePage,
        children: [{
            path: '',
            name: 'SelfSymbolIndex',
            component: () =>
                import ('@m/views/selfSymbol/selfSymbol.vue'),
            meta: {
                title: 'optional.title',
                cache: false,
                disabledInApp: false,
                pageFull: true,
                haveNav: true,
                roles: ['Guest']
            }
        }]
    },
    {
        path: '/position',
        component: Layout,
        redirect: '/position/index',
        beforeEnter: beforeEnterTradePage,
        children: [{
            path: '',
            name: 'PositionIndex',
            component: () =>
                import ('@m/views/trade/position/Index.vue'),
            meta: {
                title: 'router.position',
                cache: true,
                disabledInApp: true,
                pageFull: true,
                haveNav: true,
                roles: ['Guest']
            }
        }]
    }, {
        path: '/order',
        component: Layout,
        redirect: '/order/:id',
        beforeEnter: beforeEnterTradePage,
        roles: ['Guest'],
        children: [{
                path: ':id',
                name: 'Order',
                component: () =>
                    import ('@m/views/order/order.vue'),
                meta: {
                    title: 'router.placeOrder',
                    disabledInApp: true,
                    pageFull: true
                } // pageFull 页面是否全屏显示
            },
            {
                path: 'buyorderinfo/:id',
                name: 'BuyOrderInfo',
                component: () =>
                    import ('@m/views/buyOrderInfo/'),
                meta: {
                    title: 'router.pendingDetail',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            },
            {
                path: 'changebuyorder/:id',
                name: 'ChangeBuyOrder',
                component: () =>
                    import ('@m/views/changeBuyOrder/'),
                meta: {
                    title: 'router.updatePending',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            },
            {
                path: 'sellorderinfo/:id',
                name: 'SellOrderInfo',
                component: () =>
                    import ('@m/views/sellOrderInfo/'),
                meta: {
                    title: 'router.closedDetail',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            }, {
                path: 'sellsuccess/:id',
                name: 'SellSuccess',
                component: () =>
                    import ('@m/views/sellSuccess/'),
                meta: {
                    title: 'router.closeSuccess',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            }, {
                path: 'orderSuccess/:id',
                name: 'OrderSuccess',
                component: () =>
                    import ('@m/views/order/orderSuccess.vue'),
                meta: {
                    title: 'router.placeOrderSuccess',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            }
        ]
    }, {
        path: '/productDetail',
        component: Layout,
        redirect: '/productDetail/:id',
        beforeEnter: beforeEnterTradePage,
        children: [{
                path: 'tag',
                name: 'Tag',
                component: () =>
                    import ('@m/views/tag/tag.vue'),
                meta: {
                    title: '',
                    disabledInApp: true,
                    pageFull: true,
                    roles: ['Guest']
                } // pageFull 页面是否全屏显示
            },
            {
                path: 'empty',
                name: 'ProductEmpty',
                component: () =>
                    import ('@m/views/productDetail/productEmpty.vue'),
                meta: {
                    pageFull: true,
                    cache: false,
                    roles: ['Guest']
                } // pageFull 页面是否全屏显示
            },
            {
                path: ':id',
                name: 'ProductDetail',
                component: () =>
                    import ('@m/views/productDetail/productDetail.vue'),
                meta: {
                    pageFull: true,
                    disabledInApp: true,
                    cache: false,
                    roles: ['Guest']
                } // pageFull 页面是否全屏显示
            },
            {
                path: 'chart/:id',
                name: 'chartInApp',
                component: () =>
                    import ('@m/views/productDetail/chartInApp.vue'),
                meta: {
                    pageFull: true,
                    cache: false,
                    roles: ['Guest']
                } // pageFull 页面是否全屏显示
            }, {
                path: 'contractInfo/:id',
                name: 'ContractInfo',
                component: () =>
                    import ('@m/views/contractInfo/index.vue'),
                meta: {
                    title: 'router.productInfo',
                    pageFull: true
                } // pageFull 页面是否全屏显示
            }
        ]
    }, {
        path: '/mine',
        component: Layout,
        children: [{
            path: '',
            name: 'Mine',
            beforeEnter: beforeEnterTradePage,
            component: () =>
                import ('@m/views/mine/index.vue'),
            meta: {
                title: 'router.mine',
                disabledInApp: true,
                pageFull: true,
                haveNav: true,
                roles: ['Guest']
            }
        }, {
            path: 'setting',
            name: 'Setting',
            component: () =>
                import ('@m/views/mine/setting.vue'),
            meta: {
                title: 'router.setting',
                pageFull: true,
                roles: ['Guest']
            }
        }, {
            path: 'resetpwd',
            name: 'ResetPwd',
            component: () =>
                import ('@m/views/mine/resetPwd.vue'),
            meta: {
                title: 'router.updatePwd',
                pageFull: true
            }
        }, {
            path: 'fundingDetails',
            name: 'FundingDetails',
            component: () =>
                import ('@m/views/mine/fundingDetails/index.vue'),
            meta: {
                title: 'router.fundingDetails',
                disabledInApp: false,
                pageFull: true
            }
        }]
    }, {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@m/views/login.vue'),
        meta: {
            title: 'router.login',
            pageFull: true,
            disabledInApp: true,
            roles: ['Guest']
        } // pageFull 页面是否全屏显示
    }, {
        path: '/openaccount/:id',
        name: 'OpenAccount',
        component: () =>
            import ('@m/views/openAccount/openRealAccount.vue'),
        meta: {
            roles: ['Guest']
        }
    }, {
        path: '/opendemoaccount/:id',
        name: 'OpenDemoAccount',
        component: () =>
            import ('@m/views/openAccount/openDemoAccount.vue'),
        meta: {
            roles: ['Guest']
        }
    }, {
        path: '/postmessage', // 调试页面
        name: 'Postmessage',
        component: () =>
            import ('@m/views/postmessage.vue'),
        meta: {
            roles: ['Guest']
        }
    }, {
        path: '/register',
        component: Layout,
        redirect: '/register/openreal/1',
        children: [{
            path: ':type/success',
            name: 'RegisterSuccess',
            component: () =>
                import ('@m/views/register/registerSuccess.vue'),
            meta: {
                title: 'router.openAccount',
                pageFull: true,
                roles: ['Guest']
            }
        }, {
            path: ':type/fail',
            name: 'RegisterFail',
            component: () =>
                import ('@m/views/register/registerFail.vue'),
            meta: {
                title: 'router.openAccount',
                pageFull: true,
                roles: ['Guest']
            }
        }, {
            path: ':type/manul',
            name: 'RegisterManul',
            component: () =>
                import ('@m/views/register/registerManul.vue'),
            meta: {
                title: 'router.openAccount',
                pageFull: true,
                roles: ['Guest']
            }
        }, {
            path: ':type/:step',
            name: 'Register',
            component: () =>
                import ('@m/views/register/register.vue'),
            meta: {
                title: 'router.openAccount',

                /* 注册 */
                /* 注册 */
                pageFull: true,
                roles: ['Guest']
            }
        }]
    }, {
        path: '/upgrade',
        component: Layout,
        children: [{
            path: 'account',
            name: 'UpgradeAccount',
            redirect: 'account/1'
        }, {
            path: 'account/:step',
            name: 'UpgradeAccountStep',
            beforeEnter: UpgradeAccountBeforeEnter,
            component: () =>
                import ('@m/views/register/upgradeAccount.vue'),
            meta: {
                title: 'router.upgradeAccount',
                pageFull: true,
                roles: ['Guest']
            }
        }, ]
    }, {
        path: '/msg',
        component: Layout,
        beforeEnter: beforeEnterTradePage,
        children: [{
            path: '',
            name: 'MsgList',
            component: () =>
                import ('@m/views/msg/index.vue'),
            meta: {
                pageFull: true,
                cache: false,
                title: 'router.msgCenter'
            }
        }]
    },
    // {
    //     path: '/completeInfo',
    //     component: Layout,
    //     beforeEnter: (to, from, next) => {
    //         delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties'))).then(res => {
    //             setTimeout(() => {
    //                 next()
    //             }, 0)
    //         })
    //     },
    //     children: [
    //         {
    //             path: '',
    //             name: 'completeInfo',
    //             component: () => import('@m/views/fillData/fillData.vue'),
    //             meta: {
    //                 title: 'router.addData' /*注册*/,
    //                 pageFull: true,
    //                 roles: ['Guest']
    //             }
    //         },
    //         {
    //             path: 'fail',
    //             name: 'completeFail',
    //             component: () => import('@m/views/fillData/fillDataFail.vue'),
    //             meta: {
    //                 title: 'router.addData',
    //                 pageFull: true,
    //                 roles: ['Guest']
    //             }
    //         },
    //         {
    //             path: 'manul',
    //             name: 'completeManul',
    //             component: () => import('@m/views/fillData/fillDataManul.vue'),
    //             meta: {
    //                 title: 'router.addData',
    //                 pageFull: true,
    //                 roles: ['Guest']
    //             }
    //         },
    //         {
    //             path: 'success',
    //             name: 'completeSuccess',
    //             component: () => import('@m/views/fillData/fillDataSuccess.vue'),
    //             meta: {
    //                 title: 'router.addData',
    //                 pageFull: true,
    //                 roles: ['Guest']
    //             }
    //         }
    //     ]
    // },
    {
        path: '/forgetEntry',
        component: Layout,
        children: [{
            path: 'forgetCourse/:phone/:type/:account/:email',
            name: 'forgetCourse',
            component: () =>
                import ('@m/views/forgetPassword/forgetCourse.vue'),
            meta: {
                roles: ['Guest'],
                pageFull: true,
                disabledInApp: true,
                title: 'router.forgetPwd'
            }
        }, {
            path: '',
            name: 'forgetEntry',
            component: () =>
                import ('@m/views/forgetPassword/forgetEntry.vue'),
            meta: {
                roles: ['Guest'],
                pageFull: true,
                title: 'router.forgetPwd'
            }
        }, {
            path: 'forgetResult/:state',
            name: 'forgetResult',
            component: () =>
                import ('@m/views/forgetPassword/forgetResult.vue'),
            meta: {
                roles: ['Guest'],
                pageFull: true,
                title: 'router.forgetPwd'
            }
        }]
    }, {
        path: '/search',
        component: Layout,
        children: [{
            path: '',
            name: 'Search',
            component: () =>
                import ('@m/views/search/index.vue'),
            meta: {
                roles: ['Guest'],
                disabledInApp: true,
                pageFull: true,
                cache: true,
                title: 'router.search'
            }
        }]
    }, {
        path: '/playGuide',
        component: Layout,
        children: [{
            path: '',
            name: 'PlayGuide',
            component: () =>
                import ('@m/views/playGuide.vue'),
            meta: {
                roles: ['Guest'],
                cache: true,
                title: 'router.playGuide'
            }
        }]
    }, {
        path: '/to',
        name: 'To',
        component: To,
        meta: {
            roles: ['Guest'],
            cache: false,
            title: ''
        }
    }, {
        path: '/apphybrid',
        component: Layout,
        children: [{
            path: '',
            name: 'AppHybrid',
            component: () =>
                import ('@m/views/apphybrid.vue'),
            meta: {
                roles: ['Guest'],
                pageFull: true,
                title: ''
            }
        }]
    },
    ...Funds
]

const basePath = '/' + location.pathname.split('/')[1]
const router = new Router({ mode: 'history', base: basePath, routes: routes })

router.scrollBehavior = function(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
}

const loadedRoutes = [] // 加载过的路由
router.beforeEach((to, from, next) => {
    if (loadedRoutes.indexOf(to.name) === -1) {
        pageLoading = Toast.loading({ duration: 0, forbidClick: false })
    }
    const loginData = getLoginData()
    const {
        roles = []
    } = to.meta
    const isGuestPage = roles.some(el => ['Guest', 'OnlyGuest'].includes(el)) // 游客能访问的页面
    const isOnlyGuestPage = roles.includes('OnlyGuest') // 只有游客能访问的页面
    if (isOnlyGuestPage && loginData && loginData.accountType !== 'demo') {
        return next({ name: 'Home' })
    }

    const isGuest = !loginData // 当前用户是否为游客
    loadLanguageAsync().then(() => {
        if (isGuest && !isGuestPage && !to.query.experience) { // 游客不能进入非游客访问的页面
            next({
                name: 'Login',
                query: {
                    cb: encodeURIComponent(to.fullPath)
                }
            })
        } else if (!isGuest && !isGuestPage && !window['UserLoginInfoRet']) { // 登录后需要拿到 UserLoginInfoRet 信息才进入
            beforeEnterLoginPage(to, from, next)
        } else {
            next(true)
        }
    })
})
router.afterEach((to, from) => {
        setProphet()

        // 某些页面禁止在原生APP里面访问，直接访问APP自己的页面，例如行情、交易等
        if (isAPP && to.meta && to.meta.disabledInApp) {
            appGoHome()
        }
        // if (isAPP) {
        //     appSetTitle(i18n.t(to.meta.title))
        // }

        loadedRoutes.push(to.name)
        if (pageLoading) {
            pageLoading.clear()
            pageLoading = null
        }
        // 移动端不切换标题
        // if (to.meta && to.meta.title) {
        //     document.title = i18n.t(to.meta.title)
        // } else {
        //     document.title = i18n.t('router.position')
        // }

        if (from.path != '/' && window.dataLayer && window.dataLayer.length > 0 && typeof gtag === 'function') {
            const uaItem = window.dataLayer.find(el => el[0] === 'config' && typeof(el[1]) === 'string' && el[1].trim().indexOf('UA-') === 0)
            const ua = uaItem && uaItem[1]
            window.gtag('config', ua, {
                page_path: basePath + to.path
            })
        }
        sessionStorage.setItem('routeFrom', from.fullPath)
    })
    // 登录后需要拿到 UserLoginInfoRet 信息才进入
const beforeEnterLoginPage = (to, from, next) => {
    const socket = Vue.prototype.$socket
    socket.addEventListener('message', function(evt) {
        if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
            return
        }
        let { msg_code, code, content, remark } = JSON.parse(evt.data)
        if (typeof content === 'string' && content)
            content = JSON.parse(content)



        if (msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()) {
            next(true)
            return Promise.resolve(to)
        }
    }, false)
}
export default router