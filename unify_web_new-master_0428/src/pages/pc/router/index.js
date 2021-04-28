import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@pc/layout/index.vue'
import To from '@m/views/to.vue'
import store from '@m/store/index'
import outLayout from '@pc/layout/outLayout.vue'
import LayoutModule from '@pc/layout/module.vue'
import { getLoginData, delayAwait } from '@/utils/index'
// import { Toast } from 'vant'
import { setProphet } from '@/utils/prophet'

import { loadLanguageAsync, i18n } from '@m/lang'
Vue.use(Router)

// 缓存渠道广告信息
if (location.search && location.search.indexOf('?') >= 0) sessionStorage.setItem('sourceParams', location.search)

let pageLoading
const beforeEnterPage = (to, from, next) => {
    let loading = Vue.prototype.$loading()
    store.dispatch('funds/getUserInfo').then(res => {
        loading.clear()
        loading = null
        next()
    })
}
const beforeEnterMT4Page = (to, from, next) => {
    let loading = Vue.prototype.$loading()
    delayAwait(() => {
        return store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo
    }, true).then(() => {
        store.dispatch('funds/getUserInfo').then(res => {
            loading.clear()
            loading = null
            next()
        }).catch(() => {
            next()
        })
    })
}
// 交易相关页面需要拿到 GroupSymbolListRet 信息才进入
const beforeEnterTradePage = (to, from, next) => {
    if (window['GroupSymbolList'].length > 0) return next()
    window.addEventListener(
        'GroupSymbolListRet',
        function (e) {
            next(true)
        },
        false
    )
}

// 右侧弹窗路由
const rightRoutes = [
    {
        path: '/msg',
        name: 'MsgList',
        component: () => import('@m/views/msg/index.vue'),
        meta: {
            title: 'router.msgCenter',
            position: 'right',
            cache: false
        }
    },
    {
        path: '/nest/:id',
        name: 'Nest',
        component: () => import('@m/views/iframe.vue'),
        meta: {
            title: '',
            position: 'right',
            cache: false,
            roles: ['Guest']
        }
    },
    {
        path: '/mine',
        component: LayoutModule,
        redirect: '/mine/setting',
        children: [
            {
                path: 'setting',
                name: 'Setting',
                component: () => import('@m/views/mine/setting.vue'),
                meta: {
                    title: 'router.setting',
                    position: 'right',
                    cache: false,
                    roles: ['Guest']
                }
            },
            {
                path: 'resetpwd',
                name: 'ResetPwd',
                component: () => import('@m/views/mine/resetPwd.vue'),
                meta: {
                    title: 'setting.updatePwd',
                    // showTitle: true,
                    position: 'right',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'fundingDetails',
                name: 'FundingDetails',
                component: () => import('@m/views/mine/fundingDetails/index.vue'),
                meta: {
                    title: 'router.fundingDetails',
                    disabledInApp: false,
                    position: 'right',
                    cache: false,
                    roles: []
                }
            }
        ]
    }
]

// 居中弹窗路由
const centerRoutes = [
    {
        path: '/my',
        component: LayoutModule,
        redirect: '/home',
        beforeEnter: beforeEnterPage,
        children: [
            {
                path: 'bankList',
                component: () => import('@m/views/my/bankList/index.vue'),
                name: 'BankList',
                meta: {
                    title: 'router.myBank',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'addBank',
                component: () => import('@m/views/my/addBank/index.vue'),
                name: 'AddBank',
                meta: {
                    title: 'router.addBank',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'authentication',
                component: () => import('@m/views/my/authentication/index.vue'),
                name: 'Authentication',
                meta: {
                    title: 'router.authentication',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'certified',
                component: () => import('@m/views/my/certified.vue'),
                name: 'Certified',
                meta: {
                    title: 'router.profile',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'withAmount',
                component: () => import('@m/views/my/withAmount/index.vue'),
                name: 'WithAmount',
                meta: {
                    title: 'router.withdraw',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'payInfo',
                component: () => import('@m/views/my/payInfo/payInfo.vue'),
                name: 'PayInfo',
                meta: {
                    title: 'router.editInfo',
                    position: 'center',
                    showTitle: true,
                    cache: false,

                    roles: []
                }
            },
            {
                path: 'kyc',
                component: () => import('@m/views/my/kyc/kyc.vue'),
                name: 'KYC',
                meta: {
                    title: 'router.kyc',
                    position: 'center',
                    showTitle: true,
                }
            },
            {
                path: 'depositFunds',
                component: () => import('@m/views/my/depositFunds/index.vue'),
                name: 'DepositFunds',
                meta: {
                    title: 'router.deposit',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'capitalFlow/:type',
                component: () => import('@m/views/my/capitalFlow/index.vue'),
                name: 'CapitalFlow',
                meta: {
                    title: 'form.title.depositRecord',
                    position: 'center',
                    showTitle: true,
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'bankName',
                component: () => import('@m/views/my/bankName/index.vue'),
                name: 'BankName',
                meta: {
                    title: 'router.deposit',
                    showTitle: true,
                    position: 'center',
                }
            },
            {
                path: 'paymentDetails',
                component: () => import('@m/views/my/paymentDetails/index.vue'),
                name: 'PaymentDetails',
                meta: {
                    title: 'router.paymentDetails',
                    showTitle: true,
                    position: 'center'
                }
            },
        ]
    },
    {
        path: '/mt4',
        component: () => import('@m/views/mt4/index.vue'),
        name: 'mt4',
        meta: {
            position: 'right',
            title: 'router.MT4',
        },
        beforeEnter: beforeEnterMT4Page,
        children: [
            {
                path: 'depositFunds',
                name: 'MT4Depositfunds',
                component: () => import('@m/views/my/depositFunds/index.vue'),
                meta: {
                    title: 'router.MT4deposit',
                    position: 'right',
                    pageFull: true,
                    roles: ['Guest']
                }
            },
            {
                path: 'withAmount',
                name: 'MT4WithAmount',
                component: () => import('@m/views/my/withAmount/index.vue'),
                meta: {
                    title: 'router.MT4withdraw',
                    position: 'right',
                    pageFull: true,
                    roles: ['Guest']
                }
            }
        ]
    },
    // {
    //     path: '/search',
    //     component: LayoutModule,
    //     children: [
    //         {
    //             path: '',
    //             name: 'Search',
    //             component: () => import('@m/views/search/index.vue'),
    //             meta: {
    //                 title: 'router.search',
    //                 position: 'center',
    //                 cache: false,
    //                 roles: ['Guest']
    //             }
    //         }
    //     ]
    // },
    {
        path: '/contractInfo',
        component: LayoutModule,
        redirect: '/contractInfo/:id',
        children: [
            {
                path: ':id',
                name: 'ContractInfo',
                component: () => import('@m/views/contractInfo/index.vue'),
                meta: {
                    title: 'router.productInfo',
                    position: 'center',
                    // showTitle: true,
                    cache: false,
                    roles: []
                }
            }
        ]
    },
    {
        path: '/trade',
        // component: LayoutModule,
        redirect: '/home',
        // children: [
        //     {
        //         path: '',
        //         name: 'TradeIndex',
        //         component: () => import('@m/views/trade/trade.vue'),
        //         meta: {
        //             title: 'router.trade',
        //             position: 'center',
        //             cache: false,
        //             roles: ['Guest']
        //         }
        //     },
        //     {
        //         path: 'category',
        //         name: 'TradeCategory',
        //         component: () => import('@m/views/trade/category/category.vue'),
        //         meta: {
        //             title: '',
        //             position: 'center',
        //             cache: false,
        //             roles: ['Guest']
        //         }
        //     },
        //     {
        //         path: 'myorderinfo/:id',
        //         name: 'MyOrderInfo',
        //         component: () => import('@m/views/myOrderInfo/'),
        //         meta: {
        //             title: 'router.positionDetail',
        //             position: 'center',
        //             cache: false
        //         }
        //     }
        // ]
    },
    {
        path: '/order',
        component: LayoutModule,
        redirect: '/order/:id',
        children: [
            {
                path: ':id',
                name: 'Order',
                component: () => import('@m/views/order/order.vue'),
                meta: {
                    title: 'router.placeOrder',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'buyorderinfo/:id',
                name: 'BuyOrderInfo',
                component: () => import('@m/views/buyOrderInfo/'),
                meta: {
                    title: 'router.pendingDetail',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'changebuyorder/:id',
                name: 'ChangeBuyOrder',
                component: () => import('@m/views/changeBuyOrder/'),
                meta: {
                    title: 'router.updatePending',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'sellorderinfo/:id',
                name: 'SellOrderInfo',
                component: () => import('@m/views/sellOrderInfo/'),
                meta: {
                    title: 'router.closedDetail',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'sellsuccess/:id',
                name: 'SellSuccess',
                component: () => import('@m/views/sellSuccess/'),
                meta: {
                    title: 'router.closeSuccess',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            },
            {
                path: 'orderSuccess/:id',
                name: 'OrderSuccess',
                component: () => import('@m/views/order/orderSuccess.vue'),
                meta: {
                    title: 'router.placeOrderSuccess',
                    position: 'center',
                    cache: false,
                    roles: []
                }
            }
        ]
    },

    {
        path: 'tag',
        name: 'Tag',
        component: () => import('@m/views/tag/tag.vue'),
        meta: {
            title: '',
            position: 'center',
            // showTitle: true,
            cache: false,
            roles: ['Guest']
        }
    }
]

const routes = [
    {
        path: '/home',
        component: Layout,
        beforeEnter: beforeEnterTradePage,
        name: 'Layout',
        meta: {
            title: 'router.index',
            cache: false,
            roles: ['Guest'] // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面
        },
        children: [...rightRoutes, ...centerRoutes]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@m/views/login.vue'),
        meta: {
            title: 'router.index',
            cache: false,
            roles: ['Guest'] // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面
        }
    },
    {
        path: '/forgetEntry',
        component: outLayout,
        children: [
            {
                path: 'forgetCourse/:phone/:type/:account/:email',
                name: 'forgetCourse',
                component: () => import('@m/views/forgetPassword/forgetCourse.vue'),
                meta: {
                    roles: ['OnlyGuest'],
                    pageFull: true,
                    disabledInApp: true,
                    title: 'router.forgetPwd'
                }
            },
            {
                path: '',
                name: 'forgetEntry',
                component: () => import('@m/views/forgetPassword/forgetEntry.vue'),
                meta: {
                    roles: ['OnlyGuest'],
                    pageFull: true,
                    title: 'router.forgetPwd'
                }
            },
            {
                path: 'forgetResult/:state',
                name: 'forgetResult',
                component: () => import('@m/views/forgetPassword/forgetResult.vue'),
                meta: {
                    roles: ['OnlyGuest'],
                    pageFull: true,
                    title: 'router.forgetPwd'
                }
            }
        ]
    },
    {
        path: '/openaccount/:id',
        name: 'OpenAccount',
        component: () => import('@m/views/openAccount/openRealAccount.vue'),
        meta: {
            title: 'router.index',
            cache: false,
            roles: ['Guest']
        }
    },
    {
        path: '/opendemoaccount/:id',
        name: 'OpenDemoAccount',
        component: () => import('@m/views/openAccount/openDemoAccount.vue'),
        meta: {
            roles: ['Guest']
        }
    },
    {
        path: '/register',
        component: outLayout,
        redirect: '/register/openreal/1',
        children: [
            {
                path: ':type/success',
                name: 'RegisterSuccess',
                component: () => import('@m/views/register/registerSuccess.vue'),
                meta: {
                    title: 'router.openAccount',
                    pageFull: true,
                    roles: ['Guest']
                }
            },
            {
                path: ':type/fail',
                name: 'RegisterFail',
                component: () => import('@m/views/register/registerFail.vue'),
                meta: {
                    title: 'router.openAccount',
                    pageFull: true,
                    roles: ['Guest']
                }
            },
            {
                path: ':type/manul',
                name: 'RegisterManul',
                component: () => import('@m/views/register/registerManul.vue'),
                meta: {
                    title: 'router.openAccount',
                    pageFull: true,
                    roles: ['Guest']
                }
            },
            {
                path: ':type/:step',
                name: 'Register',
                component: () => import('@m/views/register/register.vue'),
                meta: {
                    title: 'router.openAccount' /* 注册 */,
                    pageFull: true,
                    roles: ['Guest']
                }
            }
        ]
    },
    {
        path: '/to',
        name: 'To',
        component: To,
        meta: {
            roles: ['Guest'],
            cache: false,
            title: ''
        }
    },
    {
        path: '*',
        redirect: '/home'
    }
]

const basePath = '/' + location.pathname.split('/')[1]
const router = new Router({
    mode: 'history',
    base: basePath,
    routes: routes
})

router.scrollBehavior = function (to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return {
            x: 0,
            y: 0
        }
    }
}
const loadedRoutes = [] // 加载过的路由
router.beforeEach(async (to, from, next) => {
    // if (loadedRoutes.indexOf(to.name) === -1) {
    //     pageLoading = Toast.loading({
    //         duration: 0,
    //         forbidClick: false
    //     })
    // }
    const loginData = getLoginData()
    const { roles = [] } = to.meta
    const isGuestPage = roles.some(el => ['Guest', 'OnlyGuest'].includes(el)) // 游客能访问的页面
    // const isOnlyGuestPage = roles.includes('OnlyGuest') // 只有游客能访问的页面
    // // if (isOnlyGuestPage && loginData) {
    // //     return next({
    // //         name: 'Home'
    // //     })
    // // }
    const isGuest = !loginData // 当前用户是否为游客
    loadLanguageAsync().then(() => {
        if (isGuest && !isGuestPage) {
            // 游客不能进入非游客访问的页面
            next({
                name: 'Login',
                query: {
                    cb: encodeURIComponent(to.fullPath),
                    oid: from.query.oid
                }
            })
        } else if (!isGuest && !isGuestPage && !window['UserLoginInfoRet']) {
            // 登录后需要拿到 UserLoginInfoRet 信息才进入
            beforeEnterLoginPage(to, from, next)
        } else {
            resolveQueryOid(to, from, next)
        }
    })
})
router.afterEach((to, from) => {
    setProphet()
    loadedRoutes.push(to.name)
    if (pageLoading) {
        pageLoading.clear()
        pageLoading = null
    }
    if (to.meta && to.meta.title) {
        document.title = i18n.t(to.meta.title)
    } else {
        document.title = i18n.t('router.position')
    }
    if (from.path != '/' && window.dataLayer && window.dataLayer.length > 0 && typeof gtag === 'function') {
        gtag('config', window.dataLayer[1][1], {
            page_path: basePath + to.path
        })
    }
    sessionStorage.setItem('routeFrom', from.fullPath)
})
// 登录后需要拿到 UserLoginInfoRet 信息才进入
const beforeEnterLoginPage = (to, from, next) => {
    const socket = Vue.prototype.$socket
    socket.addEventListener(
        'message',
        function (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            let { msg_code, code, content, remark } = JSON.parse(evt.data)
            if (typeof content === 'string' && content) content = JSON.parse(content)
            if (msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()) {
                resolveQueryOid(to, from, next)
                return Promise.resolve(to)
            }
        },
        false
    )
}
export default router

/**
 * 统一处理路由携带oid参数逻辑
 *
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
function resolveQueryOid (to, from, next) {
    if (!to.params.removeOid && from.query.oid && !to.query.oid) {
        next({
            ...to,
            query: {
                ...to.query,
                oid: from.query.oid
            }
        })
    } else {
        next()
    }
}
