<template>
    <div class='m-mine'>
        <div class='layout layout-1'>
            <template v-if="accountInfo.accountType === 'real' || accountInfo.accountType === 'demo'">
                <div class='item-1'>
                    <div class='face'>
                        <img src='../../assets/face.png' />
                    </div>
                    <div class='account' @click='toCertified'>
                        <div class='no'>
                            {{ accountInfo.accountType === 'real' ? accountInfo.accountNo : accountInfo.accountType === 'demo' ? accountInfo.accountDemoNo : '' }}
                            <i
                                class='icon van-icon '
                                :class="{ 'van-icon-arrow': accountInfo.accountType === 'real' }"
                            ></i>
                        </div>
                        <div
                            v-if='accountInfo.accountType === "real" && userStatus.infoApprovalStatus !=-1'
                            class='renzheng'
                            :class="'status'+userStatus.infoApprovalStatus"
                        >
                            <i class='icon_icon_renzheng'></i>
                            <span>{{ $t('mine.renzhengStatus.'+userStatus.infoApprovalStatus) }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <AccountChange />
                </div>
            </template>
            <div v-else class='face'>
                <img src='../../assets/face.png' />
            </div>
        </div>
        <div class='asset'>
            <MyAsset
                v-if="accountInfo.accountType === 'real' || accountInfo.accountType === 'demo'"
                :show-asset='true'
            />
        </div>

        <div class='layout layout-2'>
            <template v-if="accountInfo.accountType === 'real'">
                <div class='row-1'>
                    <div
                        v-prophet="['trackEvent', '我的', '我的页面', '我的页面_出金', 29]"
                        class='link link-2'
                        @click="
                            _collect('出金')
                            $router.push({ name: 'WithAmount' })
                        "
                    >
                        {{ $t('trade.drawings') }}
                    </div>
                </div>
                <div class='row-1'>
                    <div
                        v-prophet="['trackEvent', '我的', '我的页面', '我的页面_入金', 28]"
                        class='link link-1'
                        @click="
                            _collect('入金')
                            $router.push({ name: 'DepositFunds' })
                        "
                    >
                        {{ $t('trade.deposit') }}
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-if="accountInfo.accountType === 'demo'" class='item-3'>
                    <div v-if='isExperience' class='item'>
                        <a
                            v-prophet="['trackEvent', '体验活动', '我的页面', '我的页面_重置账户', 81]"
                            class='link-2 haveSub'
                            href='javascript:void(0)'
                            @click='_collect("我的-账户重置");resetDemoAccount()'
                        >
                            <div>{{ $t('setting.resetAccount') }}</div>
                            <div class='sub'>
                                {{ $t('activity.resetAccountTip2',{ amount:accInfo.initAmount }) }}
                            </div>
                        </a>
                        <!-- <template v-if='accountInfo.activateTime'>
                            <a
                                href='javascript:void(0)'
                                @click="_collect('切换到真实账号');changeToReal()"
                            >
                                {{ $t('trade.toReal') }}
                            </a>
                        </template> -->
                        <a
                            v-prophet="['trackEvent', '体验活动', '我的页面', '我的页面_升级账户', 82]"
                            class='link-1 haveSub'
                            href='javascript:void(0)'
                            @click="_collect('我的-点击升级账户');upgradeAccount()"
                        >
                            <div>{{ activateTime ? $t('activity.receive') : $t('activity.upgradeAccount') }}</div>
                            <div class='sub'>
                                {{ $t('activity.getBalance') }}
                            </div>
                        </a>
                        <!-- 不需要显示开通真实账户按钮 -->
                        <!--<router-link
                            v-else
                            :to="{ name: 'OpenAccount', params: { id: 'openreal' } }"
                            @click.native="_collect('开通真实账户')"
                        >{{$t('trade.openReal')}}</router-link>-->
                    </div>
                    <div v-else class='item one'>
                        <a
                            v-if='accountInfo.accountNo'
                            href='javascript:void(0)'
                            @click="_collect('切换到真实账号');changeToReal()"
                        >
                            {{ $t('trade.toReal') }}
                        </a>
                        <a
                            v-else
                            href='javascript:void(0)'
                            @click="_collect('开户');openAccount()"
                        >
                            {{ $t('router.openAccount') }}
                        </a>
                    </div>
                </div>
                <div v-else class='item-4'>
                    <div class='item'>
                        <router-link :to="{ name: 'Login' }" @click.native="_collect('登录')">
                            {{ $t('login') }}
                        </router-link>
                    </div>
                    <div class='item'>
                        <a href='javascript:void(0)' @click='toRegister'>
                            {{ $t('register') }}
                        </a>
                    </div>
                </div>
            </template>
        </div>
        <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
        <div v-if='ad.menu' class='layout-3'>
            <div v-for='(item, index) in mineMenu' :key='index'>
                <van-cell
                    v-if="item.url&& item.url.indexOf('/msg') === 0"
                    v-prophet='prophetObj[item.url.trim()]'
                    :is-link='!!item.url.trim()'
                    :title='item.title'
                    @click='toPage(item)'
                    @click.native='_collect(item.title)'
                >
                    <div v-if='totalMsgNum>1' class='flg'>
                        {{ totalMsgNum | showMsgNum }}
                    </div>
                    <img slot='icon' class='icon_icon' :src='item.img' />
                </van-cell>
                <van-cell
                    v-else-if="item.url&& item.url.indexOf('/borrow.html')>-1"
                    class='borrow'
                    :class='{ visible:!!isAgentUser }'
                    :is-link='!!item.url.trim()'
                    :title='item.title'
                    @click='toPage(item)'
                    @click.native='_collect(item.title)'
                >
                    <img slot='icon' class='icon_icon' :src='item.img' />
                </van-cell>
                <van-cell
                    v-else
                    v-prophet='prophetObj[item.url.trim()]'
                    :is-link='!!item.url.trim()'
                    :title='item.title'
                    @click='toPage(item)'
                    @click.native='_collect(item.title)'
                >
                    <img slot='icon' class='icon_icon' :src='item.img' />
                </van-cell>
            </div>
        </div>
        <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
        <tips />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import request from '@/utils/request'
import { agentUserFind } from '@/api/agent'
import AccountChange from '@m/components/AccountChange.vue'
import MyAsset from '@m/components/MyAsset'
import { resetAccount, addBonusFlowRecords } from '@/api/mine'
export default {
    name: 'Mine',
    data () {
        return {
            isAgentUser: false,
            infoApprovalStatus: -1,
            prophetObj: {
                '/mine/fundingDetails': ['trackEvent', '我的', '我的页面', '我的页面_资金明细', 33],
                '/mine/setting': ['trackEvent', '我的', '我的页面', '我的页面_设置', 35],
                '/pay/user/userSelfInfo': ['trackEvent', '我的', '我的页面', '我的页面_个人信息', 31],
                '/mt4': ['trackEvent', '我的', '我的页面', '我的页面_MT4出入金', 34],
                'msg': ['trackEvent', '我的', '我的页面', '我的页面_消息中心', 32]
            }
        }
    },
    computed: {
        ...mapState(['userStatus']),
        ...mapGetters(['isExperience', 'hasRealAccount', 'activateTime']),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accInfo () {
            return this.$store.state.accInfo
        },
        totalMsgNum () {
            if (this.$store.state.msgData.msgTypeList.length > 0) {
                return this.$store.state.msgData.msgTypeList[0].msgNum
            } else {
                return 0
            }
        },
        mineMenu () {
            return this.ad.menu.map(item => {
                const mt4Deposit = '/mt4'
                if (item.url.includes(mt4Deposit)) {
                    return Object.assign({}, item, { url: mt4Deposit })
                }
                return item
            })
        }
    },
    components: {
        AccountChange,
        MyAsset,
    },
    methods: {
        ...mapActions(['getMsgTotal', 'getUserStatus']),
        toCertified () {
            if (this.accountInfo.accountType !== 'real') {
                return
            }
            this.$router.push({ name: 'Certified' })
        },
        openAccount () {
            this.$router.push({ name: 'OpenAccount', params: { id: 'openreal' }, query: { showtip: true } })
        },
        resetDemoAccount () {
            this._collect('点击重置账户')
            this.$dialog
                .confirm({
                    title: this.$t('tip'),
                    message: this.$t('activity.resetAccountTip', { amount: this.accInfo.initAmount, name: this.$t('activity.resetAccount') }),
                    confirmButtonText: this.$t('activity.resetAccount'),
                    cancelButtonText: this.$t('iKnow')
                })
                .then(() => {
                    const loading = this.$toast.loading({
                        message: this.$t('activity.reseting'),
                        forbidClick: true,
                        loadingType: 'spinner',
                        duration: 0
                    })
                    resetAccount()
                        .then(res => {
                            loading.clear()
                            if (res.invalid()) {
                                res.toast()
                                return
                            }
                            this.$toast(this.$t('setting.resetAccountSuccess', { amount: this.accInfo.initAmount }))
                            this.$store.dispatch('getAccPriceInfo')
                        })
                        .catch(error => {
                            loading.clear()
                            console.log(error)
                        })
                })
                .catch(() => {})
        },
        upgradeAccount () {
            addBonusFlowRecords()
                .then(res => {
                    if (res.invalid()) {
                        res.toast()
                        return
                    }
                    this.$router.push({ name: 'UpgradeAccount' })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        toRegister () {
            const uiPageList = this.$store.getters.companyInfo.uiPageList
            const openRealAccount = uiPageList.openRealAccount
            const RegisterByEmail = uiPageList.RegisterByEmail
            let nextPath = { name: 'OpenAccount', params: { id: 'openreal' } }
            if (!openRealAccount && !RegisterByEmail) {
                return this.$toast({ message: this.$t('registerInfo.failText'), duration: 1500 })
            } else if (openRealAccount && RegisterByEmail) {
                // 两个页面都配置，默认跳转真实
            } else if (!openRealAccount) {
                // 跳转模拟开户地址
                nextPath = { name: 'Register', params: { type: 'RegisterByEmail', step: 1 } }
            } else if (!RegisterByEmail) {
                // 直接跳转真实开户地址
            }
            this.$router.push(nextPath)
        },
        toPage (item) {
            if (!item.url.trim()) {
                return
            }
            if (item.urlType === '1') {
                if (item.url.indexOf('http') == 0) {
                    // 外部地址
                    const url = `${item.url}${item.url.indexOf('?') > 0 ? '&' : '?'}reffer=${encodeURIComponent(window.navigator.userAgent)}&lastPage=H5APP`
                    if (url.indexOf('hidehead=1') >= 0) {
                        this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: url, title: item.title, hidehead: 1 } })
                    } else {
                        this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: url, title: item.title } })
                    }
                } else {
                    // 内部地址
                    if (item.url.indexOf('/SettingTradeColor') === 0) {
                        // 设置涨跌颜色
                        this.orColorSetting.show = true
                    } else {
                        this.$router.push({ path: item.url })
                    }
                }
            } else if (item.urlType === '2') {
                // let _window = null
                // const isSafari = /Safari/.test(window.navigator.userAgent)
                // const isIphone = document.documentElement.dataset.deviceType === 'iphone'
                // if (isIphone && isSafari && this.$store.getters.ix_platform != 'YZ') {
                //     _window = window.open()
                // }
                if (item.url.indexOf('/user/userSelfInfo') >= 0) {
                    this.$router.push({ name: 'Certified' })
                    return
                }
                request({
                    headers: {
                        module: 'uat-pay'
                    },
                    url: item.url,
                    method: 'post'
                })
                    .then(res => {
                        if (res.data && res.data.url) {
                            // if (isIphone && this.$store.getters.ix_platform != 'YZ') {
                            //     if (isSafari) {
                            //         _window.location = res.data.url
                            //     } else {
                            //         window.location.href = res.data.url
                            //     }
                            // } else {
                            //     this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: res.data.url, title: item.title } })
                            // }
                            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: res.data.url, title: item.title } })
                        } else {
                            this.$toast({ duration: 2000, message: this.$t('getSettingError') })
                            // if (_window) {
                            //     _window.close()
                            // }
                        }
                    })
                    .catch(error => {
                        // if (_window) {
                        //     _window.close()
                        // }
                    })
            }
        },
        changeToReal () {
            this.$ws.send_switchAccount()
        },
        checkAgentUser () {
            agentUserFind({
                b_thirdId: this.accountInfo.accountNo
            }).then(res => {
                if (res.code === 1) {
                    this.isAgentUser = true
                }
            })
        },
        // 弹窗提示真实场部分产品点差与体验场有所不同
        riskTipDialog () {
            // if (this.$store.getters.userType === 'real') return false
            this.$dialog.alert({
                title: this.$t('riskTip'),
                message: this.$t('riskTipContent'),
                confirmButtonText: this.$t('iKnow')
            })
        }
    },
    created () {
        if (this.accountInfo.accountNo) {
            this.checkAgentUser()
            this.getUserStatus().then(res => {
                if (res.code != 1) {
                    this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                }
            })
            if (this.accountInfo.accountType == 'real') { this.getMsgTotal([]) }
        }
        if (this.$route.params.activated) this.riskTipDialog()
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-mine {
    overflow: auto;
    height: 100%;
    padding-bottom: rem(90px);
    .asset {
        padding: 0 rem(30px);
        background-color: #fff;
    }
    .layout-1 {
        padding: rem(30px) rem(30px) rem(20px) rem(30px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        .btn {
            display: inline-block;
            padding: 0 rem(20px);
            height: rem(46px);
            line-height: rem(46px);
            border-radius: rem(24px);
            background: #f9f9f9;
            margin-right: rem(10px);
        }
        &.guest {
            text-align: center;
        }
        .renzheng {
            i {
                font-size: rem(30px);
                color: #b7b7b7;
            }
            span {
                position: relative;
                left: (-3px);
                top: rem(-7px);
                display: inline-block;
                background-color: #b7b7b7;
                height: rem(22px);
                line-height: rem(22px);
                border-radius: 0 rem(2px) rem(2px) 0;
                padding-right: rem(6px);
                padding-left: rem(2px);
                font-size: rem(14px);
                color: #fff;
            }
            &.status0 {
                i {
                    color: #fe654c;
                }
                span {
                    background-color: #fe654c;
                }
            }
            &.status1 {
                i {
                    color: #10b873;
                }
                span {
                    background-color: #10b873;
                }
            }
            &.status2 {
                i {
                    color: #feb04c;
                }
                span {
                    background-color: #feb04c;
                }
            }
            &.status3 {
                i {
                    color: #fe654c;
                }
                span {
                    background-color: #fe654c;
                }
            }
        }
        .face {
            display: inline-block;
            width: rem(110px);
            height: rem(110px);
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .account {
            display: inline-block;
            margin-left: rem(20px);
            vertical-align: top;
            color: #333333;
            .no {
                font-size: rem(34px);
                margin-top: rem(20px);
                .icon {
                    font-size: rem(24px);
                    color: #c4c4c4;
                }
            }
        }
    }

    .layout-2 {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: rem(20px) 0 rem(25px) 0;
        margin-bottom: rem(20px);
        background-color: #fff;
        text-align: center;
        .row-1 {
            flex: 1;
            padding: 0 rem(15px);
            &:first-child {
                padding-left: rem(30px);
            }
            &:last-child {
                padding-right: rem(30px);
            }
        }
        .link {
            height: rem(80px);
            line-height: rem(80px);
            font-size: rem(34px);
            // margin-top: rem(20px);
            color: #fff;
            border-radius: rem(80px);
        }
        a {
            display: inline-block;
            text-align: center;
            width: 50%;
            height: rem(80px);
            line-height: rem(80px);
            font-size: rem(34px);
            background-color: #477fd3;
            font-weight: 500;
            border-radius: rem(40px);
            color: #ffffff;
            margin-right: rem(30px);
            &:nth-of-type(2) {
                background-color: #f39800;
                color: #fff;
                margin-right: 0;
            }
            .sub {
                font-size: rem(20px);
                line-height: 1.2;
            }
            &.haveSub {
                line-height: 1.5;
            }
        }
        .link-1 {
            background-color: #f39800;
        }
        .link-2 {
            background-color: #477fd3;
        }
        .item-3 {
            display: flex;
            justify-content: space-between;
            align-content: center;
            flex-direction: column;
            width: 100%;
            .item {
                flex: 1;
                display: flex;
                padding: 0 rem(30px);
                padding: rem(20px) rem(30px) 0;
                &.one {
                    a {
                        width: 100%;
                        margin-right: 0;
                    }
                }
            }
        }

        .item-4 {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .item {
                width: 50%;
                padding: 0 rem(30px);
                a {
                    display: inline-block;
                    text-align: center;
                    width: 100%;
                }
            }
        }
    }
    .layout-3 {
        margin-bottom: rem(20px);
        .settingIcon {
            font-size: rem(43px);
            color: #477fd3;
        }
        ::v-deep {
            .van-cell {
                padding: rem(20px) rem(30px);
                &::after {
                    left: 0;
                }
                &.borrow {
                    display: none;
                    &.visible {
                        display: flex;
                    }
                }
                .icon_icon {
                    color: #477fd3;
                    width: rem(40px);
                    height: rem(40px);
                    &:before {
                        display: none;
                        content: "";
                    }
                }
                .van-cell__title {
                    font-size: rem(28px);
                    color: #333333;
                    margin-left: rem(28px);
                }
                .van-cell__value {
                    font-size: rem(24px);
                    color: #999;
                }
                .van-cell__right-icon {
                    color: #c4c4c4;
                    font-size: rem(16px);
                    margin-left: rem(20px);
                }
            }
        }
        .flg {
            display: inline-block;
            position: relative;
            top: rem(-3px);
            vertical-align: middle;
            width: rem(72px);
            height: rem(40px);
            border-radius: rem(20px);
            background-color: #e95a5a;
            overflow: hidden;
            color: #fff;
            font-size: rem(24px);
            text-align: center;
            line-height: rem(40px);
        }
    }
}
</style>
