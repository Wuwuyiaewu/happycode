import Vue from 'vue'
import Layout from '@m/layout/index.vue'
import store from '@m/store/index'
import { delayAwait } from '@/utils/index'
const DepositFunds = () => import(/* webpackChunkName: "depositFunds" */ '@m/views/my/depositFunds')
const PayInfo = () => import(/* webpackChunkName: "PayInfo" */ '@m/views/my/payInfo/payInfo')
const kyc = () => import(/* webpackChunkName: "KYC" */ '@m/views/my/kyc/kyc')
const CapitalFlow = () => import(/* webpackChunkName: "capitalFlow" */ '@m/views/my/capitalFlow')
const WithAmount = () => import(/* webpackChunkName: "withAmount" */ '@m/views/my/withAmount')
const AddBank = () => import(/* webpackChunkName: "addBank" */ '@m/views/my/addBank')
const BankList = () => import(/* webpackChunkName: "bankList" */ '@m/views/my/bankList')
const Authentication = () => import(/* webpackChunkName: "authentication" */ '@m/views/my/authentication')
const Certified = () => import(/* webpackChunkName: "certified" */ '@m/views/my/certified.vue')
const BankName = () => import(/* webpackChunkName: "bankType" */ '@m/views/my/bankName')
const PaymentDetails = () => import(/* webpackChunkName: "paymentDetails" */ '@m/views/my/paymentDetails')

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

export default [{
    path: '/my',
    component: Layout,
    redirect: '/mine',
    beforeEnter: beforeEnterPage,
    children: [
        {
            path: 'depositFunds',
            component: DepositFunds,
            name: 'DepositFunds',
            meta: {
                title: 'router.deposit',
            }
        },
        {
            path: 'payInfo',
            component: PayInfo,
            name: 'PayInfo',
            meta: {
                title: 'router.editInfo',
            }
        },
        {
            path: 'kyc',
            component: kyc,
            name: 'KYC',
            meta: {
                title: 'router.kyc',
            }
        },
        {
            path: 'withAmount',
            component: WithAmount,
            name: 'WithAmount',
            meta: {
                title: 'router.withdraw',
            }
        },
        {
            path: 'capitalFlow/:type',
            component: CapitalFlow,
            name: 'CapitalFlow',
            meta: {
                title: ''
            }
        },
        {
            path: 'addBank',
            component: AddBank,
            name: 'AddBank',
            meta: {
                title: 'router.addBank',
            }
        },
        {
            path: 'bankList',
            component: BankList,
            name: 'BankList',
            meta: {
                title: 'router.myBank',
            }
        },
        {
            path: 'authentication',
            component: Authentication,
            name: 'Authentication',
            meta: {
                title: 'router.authentication',
                pageFull: true
            }
        },
        {
            path: 'certified',
            component: Certified,
            name: 'Certified',
            meta: {
                title: 'router.profile',
                pageFull: true
            }
        },
        {
            path: 'bankName',
            component: BankName,
            name: 'BankName',
            meta: {
                title: 'router.deposit'
            }
        },
        {
            path: 'paymentDetails',
            component: PaymentDetails,
            name: 'PaymentDetails',
            meta: {
                title: 'router.paymentDetails',
                pageFull: true
            }
        },
    ]
}, {
    path: '/mt4',
    component: () => import('@m/views/mt4/index.vue'),
    beforeEnter: beforeEnterMT4Page,
    name: 'mt4',
    meta: {
        position: 'right',
        title: 'router.MT4',
        roles: ['Guest'],
    },
    children: [
        {
            path: 'depositFunds',
            name: 'MT4Depositfunds',
            component: DepositFunds,
            meta: {
                title: 'router.MT4deposit',
                pageFull: true,
                roles: ['Guest']
            }
        },
        {
            path: 'withAmount',
            name: 'MT4WithAmount',
            component: WithAmount,
            meta: {
                title: 'router.MT4withdraw',
                pageFull: true,
                roles: ['Guest']
            }
        }
    ]
}]
