<template>
    <div
        class='appMainWrapper'
        :class="{ 'pageFull': $route.meta.pageFull || ($store.state.inApp && notLinkWs),'Home':$route.name ==='Home', 'pageNav':$route.meta.haveNav }"
    >
        <template>
            <Top v-if='!$route.meta.pageFull && !($store.state.inApp && notLinkWs)' />
            <AppMain />
        </template>
        <NavBar v-if='$route.meta.haveNav' />
        <!-- <MainScreen v-if='screenVisible' :screen.sync='screenVisible' /> -->
        <FullEnteredDialog v-if='fullEnteredDialogVisible' />
        <BackExperience v-if='backExperienceVisible' :class="[$route.name==='PositionIndex' ? 'left':'right']" @close='backExperienceVisible=false' />
        <LimitBalance :data='limitBalanceData' :show.sync='limitBalanceVisible' />
    </div>
</template>

<script>
import Top from './top'
import AppMain from './appMain'
import NavBar from './nav'
import { delayAwait, keyInUrlPath, localGet, localSet } from '@/utils/index'
import { isAPP, isFakeAPP } from '@m/base/appHybrid'
import MainScreen from '@m/components/MainScreen'
import FullEnteredDialog from './components/fullEnteredDialog'
import BackExperience from './components/backExperience'
import LimitBalance from './components/limitBalance'
export default {
    name: 'Layout',
    components: {
        Top,
        AppMain,
        NavBar,
        FullEnteredDialog,
        BackExperience,
        LimitBalance,
        MainScreen
    },
    data () {
        return {
            showMainScreenTime: 0,
            notLinkWs: keyInUrlPath(),
            screenVisible: false,
            fullEnteredDialogVisible: false,
            backExperienceVisible: false,
            limitBalanceVisible: false,
            limitBalanceData: {},
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 显示添加主屏幕的条件
            const sourceParams = sessionStorage.getItem('sourceParams')
            const isOpenbrowser = sourceParams && sourceParams.indexOf('openbrowser') > -1
            const allowShowRoute = ['Home', 'SelfSymbolIndex', 'TradeIndex'].indexOf(to.name) > -1
            const cacheViewScreen = localGet('viewScreen')
            const inOrigin = window === window.top
            if (allowShowRoute && inOrigin && !isAPP && !isFakeAPP && !isOpenbrowser && !cacheViewScreen) {
                if (vm.showMainScreenTime === 0) {
                    vm.screenVisible = true
                    vm.showMainScreenTime++
                }
            } else {
                vm.screenVisible = false
            }
            const isMainNav = ['Home', 'SelfSymbolIndex', 'TradeIndex', 'PositionIndex', 'Mine'].includes(to.name)
            const { state, getters } = vm.$store
            vm.fullEnteredDialogVisible = false
            vm.backExperienceVisible = false
            if (to.name === 'PositionIndex' && sourceParams && sourceParams.includes('fullEnteredDialog') && getters.isExperience) { // 显示您已进入体验场的弹窗
                vm.fullEnteredDialogVisible = true
                sessionStorage.setItem('sourceParams', sourceParams.replace('fullEnteredDialog', `t${parseInt(Math.random() * 10000)}`))
            } else if (getters.userType === 'real' && state.accInfo?.maxAmount > 0 && ['PositionIndex', 'Mine'].includes(to.name) && !localGet('backExperienceVisible')) {
                vm.backExperienceVisible = true
                localSet('backExperienceVisible', 'true')
            // } else if (isMainNav && !localGet('activity.lowBalance') && getters.isExperience && state.ix_user.userLoginInfo.balance < state.accInfo?.minAmount) { // 账户余额<账户重置触发额度 (已经不需要此逻辑)
            //     vm.limitBalanceVisible = true
            //     vm.limitBalanceData = {
            //         title: vm.$t('activity.balance'),
            //         desc: vm.$t('activity.tip4'),
            //         btnText: vm.$t('activity.resetAccount'),
            //         amount: state.ix_user.userLoginInfo.balance,
            //         type: 'lowBalance',
            //     }
            //     localSet('activity.lowBalance', 'true')
            } else if (isMainNav && !localGet('activity.overLimitJZ') && getters.isExperience && getters.assetAboutInfo.accountData.jz > state.accInfo?.maxAmount) { // 净值>余额上限
                vm.limitBalanceVisible = true
                vm.limitBalanceData = {
                    title: vm.$t('activity.curJZ'),
                    desc: vm.$t('activity.tip5', [state.accInfo?.maxAmount + getters.symbolCode, getters.activateTime ? vm.$t('activity.recharge') : vm.$t('activity.upgradeAccount')]),
                    btnText: vm.$t('iKnow'),
                    amount: getters.assetAboutInfo.accountData.jz,
                    type: 'iKnow',
                }
                localSet('activity.overLimitJZ', 'true')
            }
            if (to.name === 'Home') {
                delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
                    const uiPageList = res.uiPageList || []
                    const Home = uiPageList.filter(item => (item.code === 'Home'))[0] || {}
                    if (Home.url) {
                        return next(true)
                    } else {
                        return next({ name: 'TradeIndex' })
                    }
                })
            }
        })
    },
    mounted () {
        this.hiddenBackExperience = () => {
            this.backExperienceVisible = false
        }
        window.addEventListener('SwitchAccountSuccess', this.hiddenBackExperience, false)
    },
    beforeDestroy () {
        window.removeEventListener('SwitchAccountSuccess', this.hiddenBackExperience, false)
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.appMainWrapper {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: rem(90px);
    &.pageNav {
        padding-bottom: rem(98px);
    }
    &.pageFull,
    &.Home {
        padding: 0;
    }
}
</style>
