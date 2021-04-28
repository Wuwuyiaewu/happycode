'use strict'

Object.defineProperty(exports, '__esModule', {
    value: true
})
exports['default'] = void 0

var _vue = _interopRequireDefault(require('vue'))

var _vueRouter = _interopRequireDefault(require('vue-router'))

var _index = _interopRequireDefault(require('@pc/layout/index.vue'))

var _outLayout = _interopRequireDefault(require('@pc/layout/outLayout.vue'))

var _module = _interopRequireDefault(require('@pc/layout/module.vue'))

var _index2 = require('@/utils/index')

var _vant = require('vant')

var _lang = require('@m/lang')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

function _typeof (obj) { if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

function _getRequireWildcardCache () { if (typeof WeakMap !== 'function') return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache () { return cache }; return cache }

function _interopRequireWildcard (obj) { if (obj && obj.__esModule) { return obj } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { 'default': obj } } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj) } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc) } else { newObj[key] = obj[key] } } } newObj['default'] = obj; if (cache) { cache.set(obj, newObj) } return newObj }

_vue['default'].use(_vueRouter['default']) // 缓存渠道广告信息

if (location.search && location.search.indexOf('?') >= 0) sessionStorage.setItem('sourceParams', location.search)
var pageLoading // 交易相关页面需要拿到 GroupSymbolListRet 信息才进入

var beforeEnterTradePage = function beforeEnterTradePage (to, from, next) {
    if (window['GroupSymbolList'].length > 0) return next()
    window.addEventListener('GroupSymbolListRet', function (e) {
        next(true)
    }, false)
} // 右侧弹窗路由

var rightRoutes = [{
    path: '/msg',
    name: 'MsgList',
    component: function component () {
        return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('@m/views/msg/index.vue'))
        })
    },
    meta: {
        title: 'router.msgCenter',
        position: 'right',
        cache: false
    }
}, {
    path: '/nest/:id',
    name: 'Nest',
    component: function component () {
        return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('@m/views/iframe.vue'))
        })
    },
    meta: {
        title: '',
        position: 'right',
        cache: false,
        roles: ['Guest']
    }
}, {
    path: '/mine',
    component: _module['default'],
    redirect: '/mine/setting',
    children: [{
        path: 'setting',
        name: 'Setting',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/mine/setting.vue'))
            })
        },
        meta: {
            title: 'router.setting',
            position: 'right',
            cache: false,
            roles: []
        }
    }, {
        path: 'resetpwd',
        name: 'ResetPwd',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/mine/resetPwd.vue'))
            })
        },
        meta: {
            title: 'setting.updatePwd',
            showTitle: true,
            position: 'right',
            cache: false,
            roles: []
        }
    }, {
        path: 'fundingDetails',
        name: 'FundingDetails',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/mine/fundingDetails/index.vue'))
            })
        },
        meta: {
            title: 'router.fundingDetails',
            disabledInApp: false,
            position: 'right',
            cache: false,
            roles: []
        }
    }]
}] // 居中弹窗路由

var centerRoutes = [{
    path: '/my',
    component: _module['default'],
    redirect: '/home',
    children: [{
        path: 'bankList',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/bankList/index.vue'))
            })
        },
        name: 'BankList',
        meta: {
            title: 'router.myBank',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'addBank',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/addBank/index.vue'))
            })
        },
        name: 'AddBank',
        meta: {
            title: 'router.addBank',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'authentication',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/authentication/index.vue'))
            })
        },
        name: 'Authentication',
        meta: {
            title: 'router.authentication',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'certified',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/certified.vue'))
            })
        },
        name: 'Certified',
        meta: {
            title: 'router.profile',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'withAmount',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/withAmount/index.vue'))
            })
        },
        name: 'WithAmount',
        meta: {
            title: 'router.withdraw',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'payInfo',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/payInfo/payInfo.vue'))
            })
        },
        name: 'PayInfo',
        meta: {
            title: 'router.editInfo',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'depositFunds',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/depositFunds/index.vue'))
            })
        },
        name: 'DepositFunds',
        meta: {
            title: 'router.deposit',
            position: 'center',
            showTitle: true,
            cache: false,
            roles: []
        }
    }, {
        path: 'capitalFlow/:type',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/my/capitalFlow/index.vue'))
            })
        },
        name: 'CapitalFlow',
        meta: {
            title: 'form.title.depositRecord',
            position: 'center',
            cache: false,
            roles: []
        }
    }]
}, {
    path: '/search',
    component: _module['default'],
    children: [{
        path: '',
        name: 'Search',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/search/index.vue'))
            })
        },
        meta: {
            title: 'router.search',
            position: 'center',
            cache: false,
            roles: ['Guest']
        }
    }]
}, {
    path: '/trade',
    component: _module['default'],
    redirect: '/trade/index',
    children: [{
        path: '',
        name: 'TradeIndex',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/trade/trade.vue'))
            })
        },
        meta: {
            title: 'router.trade',
            position: 'center',
            cache: false,
            roles: ['Guest']
        }
    }, {
        path: 'category',
        name: 'TradeCategory',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/trade/category/category.vue'))
            })
        },
        meta: {
            title: '',
            position: 'center',
            cache: false,
            roles: ['Guest']
        }
    }, {
        path: 'myorderinfo/:id',
        name: 'MyOrderInfo',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/myOrderInfo/'))
            })
        },
        meta: {
            title: 'router.positionDetail',
            position: 'center',
            cache: false
        }
    }]
}, {
    path: '/order',
    component: _module['default'],
    redirect: '/order/:id',
    children: [{
        path: ':id',
        name: 'Order',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/order/order.vue'))
            })
        },
        meta: {
            title: 'router.placeOrder',
            position: 'center',
            cache: false,
            roles: []
        }
    }, {
        path: 'buyorderinfo/:id',
        name: 'BuyOrderInfo',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/buyOrderInfo/'))
            })
        },
        meta: {
            title: 'router.pendingDetail',
            position: 'center',
            cache: false,
            roles: []
        }
    }, {
        path: 'changebuyorder/:id',
        name: 'ChangeBuyOrder',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/changeBuyOrder/'))
            })
        },
        meta: {
            title: 'router.updatePending',
            position: 'center',
            cache: false,
            roles: []
        }
    }, {
        path: 'sellorderinfo/:id',
        name: 'SellOrderInfo',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/sellOrderInfo/'))
            })
        },
        meta: {
            title: 'router.closedDetail',
            position: 'center',
            cache: false,
            roles: []
        }
    }, {
        path: 'sellsuccess/:id',
        name: 'SellSuccess',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/sellSuccess/'))
            })
        },
        meta: {
            title: 'router.closeSuccess',
            position: 'center',
            cache: false,
            roles: []
        }
    }, {
        path: 'orderSuccess/:id',
        name: 'OrderSuccess',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/order/orderSuccess.vue'))
            })
        },
        meta: {
            title: 'router.placeOrderSuccess',
            position: 'center',
            cache: false,
            roles: []
        }
    }]
}, {
    path: '/position',
    component: _module['default'],
    redirect: '/position/index',
    children: [{
        path: '',
        name: 'PositionIndex',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@m/views/trade/position/Index.vue'))
            })
        },
        meta: {
            title: 'router.position',
            position: 'center',
            cache: false,
            roles: []
        }
    }]
}]
var routes = [{
    path: '/home',
    component: _index['default'],
    beforeEnter: beforeEnterTradePage,
    name: 'Layout',
    meta: {
        title: 'router.index',
        cache: false,
        roles: ['Guest'] // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面

    },
    children: [].concat(rightRoutes, centerRoutes)
}, {
    path: '/login',
    name: 'Login',
    component: function component () {
        return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('@pc/views/login.vue'))
        })
    },
    meta: {
        title: 'router.index',
        cache: false,
        roles: ['Guest'] // roles: ['Guest'] 游客可以访问的页面需要增加Guest权限，其他为登录才能访问的页面

    }
}, {
    path: '/forgetEntry',
    component: _outLayout['default'],
    children: [{
        path: 'forgetCourse/:phone/:type/:account/:email',
        name: 'forgetCourse',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/forgetPassword/forgetCourse.vue'))
            })
        },
        meta: {
            roles: ['OnlyGuest'],
            pageFull: true,
            disabledInApp: true,
            title: 'router.forgetPwd'
        }
    }, {
        path: '',
        name: 'forgetEntry',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/forgetPassword/forgetEntry.vue'))
            })
        },
        meta: {
            roles: ['OnlyGuest'],
            pageFull: true,
            title: 'router.forgetPwd'
        }
    }, {
        path: 'forgetResult/:state',
        name: 'forgetResult',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/forgetPassword/forgetResult.vue'))
            })
        },
        meta: {
            roles: ['OnlyGuest'],
            pageFull: true,
            title: 'router.forgetPwd'
        }
    }]
}, {
    path: '/openaccount/:id',
    name: 'OpenAccount',
    component: function component () {
        return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('@pc/views/openAccount/openRealAccount.vue'))
        })
    },
    meta: {
        title: 'router.index',
        cache: false,
        roles: ['Guest']
    }
}, {
    path: '/opendemoaccount/:id',
    name: 'OpenDemoAccount',
    component: function component () {
        return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('@pc/views/openAccount/openDemoAccount.vue'))
        })
    },
    meta: {
        roles: ['Guest']
    }
}, {
    path: '/register',
    component: _outLayout['default'],
    redirect: '/register/openreal/1',
    children: [{
        path: ':type/success',
        name: 'RegisterSuccess',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/register/registerSuccess.vue'))
            })
        },
        meta: {
            title: 'router.openAccount',
            pageFull: true,
            roles: ['Guest']
        }
    }, {
        path: ':type/fail',
        name: 'RegisterFail',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/register/registerFail.vue'))
            })
        },
        meta: {
            title: 'router.openAccount',
            pageFull: true,
            roles: ['Guest']
        }
    }, {
        path: ':type/manul',
        name: 'RegisterManul',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/register/registerManul.vue'))
            })
        },
        meta: {
            title: 'router.openAccount',
            pageFull: true,
            roles: ['Guest']
        }
    }, {
        path: ':type/:step',
        name: 'Register',
        component: function component () {
            return Promise.resolve().then(function () {
                return _interopRequireWildcard(require('@pc/views/register/register.vue'))
            })
        },
        meta: {
            title: 'router.openAccount', /* 注册 */

            pageFull: true,
            roles: ['Guest']
        }
    }]
}, {
    path: '*',
    redirect: '/home'
}]
var basePath = '/' + location.pathname.split('/')[1]
var router = new _vueRouter['default']({
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

var loadedRoutes = [] // 加载过的路由

router.beforeEach(function _callee (to, from, next) {
    var loginData, _to$meta$roles, roles, isGuestPage, isOnlyGuestPage, isGuest

    return regeneratorRuntime.async(function _callee$ (_context) {
        while (1) {
            switch (_context.prev = _context.next) {
            case 0:
                // if (loadedRoutes.indexOf(to.name) === -1) {
                //     pageLoading = Toast.loading({
                //         duration: 0,
                //         forbidClick: false
                //     })
                // }
                loginData = (0, _index2.getLoginData)()
                _to$meta$roles = to.meta.roles, roles = _to$meta$roles === void 0 ? [] : _to$meta$roles
                isGuestPage = roles.some(function (el) {
                    return ['Guest', 'OnlyGuest'].includes(el)
                }) // 游客能访问的页面

                isOnlyGuestPage = roles.includes('OnlyGuest') // 只有游客能访问的页面
                // if (isOnlyGuestPage && loginData) {
                //     return next({
                //         name: 'Home'
                //     })
                // }

                isGuest = !loginData; // 当前用户是否为游客

                (0, _lang.loadLanguageAsync)().then(function () {
                    if (isGuest && !isGuestPage) {
                        // 游客不能进入非游客访问的页面
                        next({
                            name: 'Login',
                            query: {
                                cb: encodeURIComponent(to.fullPath)
                            }
                        })
                    } else if (!isGuest && !isGuestPage && !window['UserLoginInfoRet']) {
                        // 登录后需要拿到 UserLoginInfoRet 信息才进入
                        beforeEnterLoginPage(to, from, next)
                    } else {
                        next()
                    }
                })

            case 6:
            case 'end':
                return _context.stop()
            }
        }
    })
})
router.afterEach(function (to, from) {
    loadedRoutes.push(to.name)

    if (pageLoading) {
        pageLoading.clear()
        pageLoading = null
    }

    if (to.meta && to.meta.title) {
        document.title = _lang.i18n.t(to.meta.title)
    } else {
        document.title = _lang.i18n.t('router.position')
    }

    if (from.path != '/' && window.dataLayer && window.dataLayer.length > 0 && typeof gtag === 'function') {
        gtag('config', window.dataLayer[1][1], {
            page_path: basePath + to.path
        })
    }

    sessionStorage.setItem('routeFrom', from.fullPath)
}) // 登录后需要拿到 UserLoginInfoRet 信息才进入

var beforeEnterLoginPage = function beforeEnterLoginPage (to, from, next) {
    var socket = _vue['default'].prototype.$socket
    socket.addEventListener('message', function (evt) {
        if (_typeof(evt.data) === 'object' || evt.data.indexOf('{') !== 0) {
            return
        }

        var _JSON$parse = JSON.parse(evt.data)
        var msg_code = _JSON$parse.msg_code
        var code = _JSON$parse.code
        var content = _JSON$parse.content
        var remark = _JSON$parse.remark

        if (typeof content === 'string' && content) content = JSON.parse(content)

        if (msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()) {
            next(true)
            return Promise.resolve(to)
        }
    }, false)
}

var _default = router
exports['default'] = _default
