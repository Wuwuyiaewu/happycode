<template>
    <div class='registerFail' :class='{ noTop: isAPP }'>
        <div class='container'>
            <!-- <a href="javascript:void(0);" class="close" @click="$router.back()">
                <i class="icon_icon_close_big" />
            </a>-->
            <router-link v-if='!isAPP' class='close' :to="{ name: 'Login' }">
                <i class='icon_icon_close_big'></i>
            </router-link>
            <div class='successImg'></div>
            <!-- <i class="icon icon_icon_success mainColor"></i> -->
            <p class='successTip'>
                {{ $t(openRealFailed?'registerInfo.openSuccess':'registerInfo.openApplySuccess') }}
            </p>
            <p v-if='openRealFailed' class='text'>
                {{ $t('registerInfo.openDemoSuccessTip') }}
                <span class='mainColor'>
                    {{ accountNo }}
                </span>
                {{ $t(openAccount.account.mobile ? 'registerInfo.useMobileLogin' : 'registerInfo.useEmailLogin') }}
            </p>
            <p v-else class='failText'>
                {{ $t('registerInfo.customerGetAccount') }}
            </p>
            <!-- <div class="submitBox">
                <button class="submitBtn mainColorBg" @click="openService">{{$t('linkService')}}</button>
                <button class="submitBtn general" @click="goHome">{{$t('router.index')}}</button>
            </div>-->
        </div>
        <component
            :is="'ad'"
            v-for='ad in ad.bottom'
            :key='ad.id'
            class='adWrapper'
            :data='ad'
            :emit-click-enable='true'
            @emitClick='url => adClick(url, openType)'
        />
        <!-- <OnlineService
            v-if="onlineService && onlineServiceUrl"
            :url="onlineServiceUrl"
            @serviceClick="serviceClick"
            :title="onlineService.uiComponent && onlineService.uiComponent.length>0? onlineService.uiComponent[0]['title']:null"
        />-->
    </div>
</template>

<script>
import { mapState } from 'vuex'
import OnlineService from '@m/modules/footerOnlineService'
import wsLogin from '@m/mixins/wsLogin'
import resultMixin from './mixin'
import { isAPP, appGoHome, appGoCS, appAccountLogin } from '@m/base/appHybrid'
export default {
    mixins: [wsLogin, resultMixin],
    data () {
        return {
            isAPP: isAPP,
            openRealFailed: false,
            accountNo: '',
            openTypeText: '真实开户',
            openAccount: ''
        }
    },
    computed: {
        ...mapState({
            userLoginInfo: state => state.ix_user.userLoginInfo,
        }),
        // 开户类型
        openType () {
            return this.$route.params.type
        },
        /* 是否开立Demo账户 */
        isDemo () {
            return this.openType.startsWith('openDemoAccount')
        },
        // 广告
        ad () {
            const companyInfo = this.$store.state.ix_baseInfo.companyInfo || {}
            const uiPageList = companyInfo.uiPageList || {}
            const RegisterManul = uiPageList.RegisterManul
            let newRegisterManul
            if (this.openRealFailed && RegisterManul && RegisterManul.bottom && RegisterManul.bottom.length) {
                newRegisterManul = JSON.parse(JSON.stringify(RegisterManul))
                newRegisterManul.bottom = RegisterManul.bottom.filter(el => {
                    return el.uiComponent.find(item => ['/home', '/trade'].includes(item.url))
                })
            }
            return newRegisterManul || RegisterManul || { top: [], bottom: [], uiModules: [] }
        },
        // 在线客服
        onlineService () {
            const companyInfo = this.$store.state.ix_baseInfo.companyInfo || {}
            const uiPageList = companyInfo.uiPageList
            if (!uiPageList) return null
            const item = uiPageList[this.openType]['uiModules'].find(el => el.locating === 'bottom' && el.moduless === 'menu')
            return item
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
    },
    components: {
        OnlineService,
    },
    created () {
        if (this.openType.startsWith('openDemoAccount')) {
            this.openTypeText = '模拟开户'
        }
        const openAccount = JSON.parse(sessionStorage.getItem('openAccount'))
        if (!openAccount) return false
        this.openAccount = openAccount
        const account = openAccount.account
        if (account && (account.openAccount && account.autoApprove) && account.accountList.length === 1) {
            this.openRealFailed = true
        } else if (account && !account.openAccount) {
            this.openRealFailed = true
        } else {
            this.openRealFailed = false
        }
        this.accountNo = openAccount.account.customerNumber
    },
    methods: {
        // 登录
        // autoLogin(callback) {
        //     const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1'));
        //     const openAccount = JSON.parse(sessionStorage.getItem('openAccount'));
        //     const platform = this.$store.getters.ix_platform;
        //     if (!registerStep1 || !openAccount) {
        //         return this.$router.push({ name: 'Login' });
        //     }
        //     this.loading = true;

        //     const account = openAccount.account
        //     const params = {
        //         accountNo: account.mobile || account.email,
        //         passWord: registerStep1.passWord,
        //         accountType: 'demo'
        //     }
        //     this.$ws.httpLogin(params).then(result => {
        //         this.loading = false;
        //         if (result) {
        //             params._loadMsg = ''
        //             this.wsLogin(result, params, () => {
        //                 if (callback) {
        //                     callback()
        //                 }
        //             })
        //         }
        //     }).catch((err) => {
        //         console.log('err', err);
        //         this.loading = false;
        //     })
        // },
        // 点击立即体验按钮
        // clickTry() {
        //     const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1'));
        //     const openAccount = JSON.parse(sessionStorage.getItem('openAccount'));
        //     const account = openAccount.account
        //     if (isAPP) return appAccountLogin('86', account.mobile, registerStep1.passWord); //APP登录
        //     if (this.userLoginInfo && this.userLoginInfo.account_id) {
        //         this.goHome();
        //     } else {
        //         this.autoLogin(this.goHome.bind(this));
        //     }
        // },
        // openService() {
        //     if (isAPP) return appGoCS();
        //     const onlineService = this.onlineService || {};
        //     const uiComponent = onlineService.uiComponent;
        //     let title = this.$t('onlineService')
        //     if (uiComponent && uiComponent.length) {
        //         title = uiComponent[0]['title'] || title;
        //     };
        //     this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.onlineServiceUrl, title: title } })
        // },
        // serviceClick() {
        //     this._collect(this.openTypeText + '_联系客服', true);
        // },
        // goHome() {
        //     this._collect(this.openTypeText + '_转到首页', true);
        //     if (isAPP) return appGoHome();
        //     this.$router.push({ name: 'Home' })
        // },
        // adClick(url) {
        //     if (['/home', '/trade', '/deposit', '/onlineService'].includes(url)) {
        //         this.clickTry(url)
        //     } else if (url === '/onlineService') {
        //         this.openService()
        //     } else if (url.startsWith('http')) {
        //         window.open(url)
        //     } else {
        //         if (this.userLoginInfo && this.userLoginInfo.account_id) {
        //             this.$router.push(url)
        //         } else {
        //             this.autoLogin(() => {
        //                 this.$router.push(url)
        //             });
        //         }
        //     }
        // }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.registerFail {
    position: relative;
    min-height: 100%;
    padding: rem(90px) rem(40px) rem(130px);
    box-sizing: border-box;
}
.container {
    padding-top: rem(20px);
    padding-bottom: rem(40px);
    text-align: center;
    position: relative;
    .close {
        position: absolute;
        right: 0px;
        top: rem(-60px);
    }
    .icon_icon_close_big {
        font-size: rem(35px);
        color: $muted;
    }
    .icon {
        display: block;
        font-size: rem(120px);
    }
    .successTip {
        font-size: rem(40px);
        color: rgb(51, 51, 51);
    }
    .failText {
        margin: rem(20px) 0;
        font-size: rem(24px);
        color: $muted;
        line-height: 1.7;
    }
}
.adWrapper {
    margin-top: rem(20px);
}
.submitBox {
    margin-top: rem(85px);
    text-align: center;
    .submitBtn {
        display: block;
        margin: 0 auto;
        width: rem(440px);
        height: rem(80px);
        line-height: rem(80px);
        text-align: center;
        font-size: rem(34px);
        border-radius: rem(40px);
        color: #fff;
        @include active();

        &.general {
            margin-top: rem(40px);
            border: 1px solid rgba(191, 191, 191, 0.6);
            background-color: #fff;
            color: #666;
        }
    }
    .loginLink {
        display: inline-block;
        margin-top: rem(50px);
        font-size: rem(28px);
    }
}

.successImg {
    height: rem(220px);
    background: url("../../../mobile/images/icon_chenggong.png") center center no-repeat;
    background-size: auto 100%;
}
</style>
