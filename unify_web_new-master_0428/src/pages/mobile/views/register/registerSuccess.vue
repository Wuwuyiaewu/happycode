<template>
    <div class='registerSuccess' :class='{ noTop: isAPP,pc:isPC }'>
        <div class='container'>
            <!-- <a href="javascript:void(0);" class="close" @click="$router.back()">
                <i class="icon_icon_close_big" />
            </a>-->
            <div v-if='!isAPP' class='close' @click="adClick('/home')">
                <i class='icon_icon_close_big'></i>
            </div>
            <!-- <p class="successIcon">
                <span class="icon_icon_success mainColor"></span>
            </p>-->
            <div class='successImg'></div>

            <p class='successTip'>
                {{ $t('registerInfo.openSuccess') }}
            </p>
            <p v-if='openAccount' class='text'>
                {{ $t('registerInfo.openSuccessTip') }}
                <span class='mainColor'>
                    {{ accountNo }}
                </span>
                {{ $t(openAccount.account.mobile ? 'registerInfo.useMobileLogin' : 'registerInfo.useEmailLogin') }}
            </p>
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
        <van-popup v-model='activityPopVisible' class='bonus-popup m-dialog' :close-on-click-overlay='false'>
            <div v-if='activityPopVisible' class='m-bonus'>
                <div class='content'>
                    <i class='icon_icon_close_big' @click='activityPopVisible=false'></i>
                    <img alt class='activityImg' :src='ad.title' />
                    <div class='dialog-footer'>
                        <template v-if='isPC'>
                            <van-button
                                :loading='cancelLoading'
                                plain
                                @click="clickTry('/home')"
                            >
                                {{ $t('activity.tradeStart') }}
                            </van-button>
                            <van-button v-if='!isPC' color='#477FD3' @click="clickTry('/home')">
                                {{ $t('activity.goAccount') }}
                            </van-button>
                        </template>
                        <template v-else>
                            <van-button
                                :loading='cancelLoading'
                                plain
                                @click="clickTry('/trade')"
                            >
                                {{ $t('activity.tradeStart') }}
                            </van-button>
                            <van-button color='#477FD3' @click="clickTry('/mine')">
                                {{ $t('activity.goAccount') }}
                            </van-button>
                        </template>
                    </div>
                </div>
            </div>
        </van-popup>
        <img :src='ad.title' style='visibility:hidden;width:1px;height:1px;' />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Top from '@m/layout/top'
import OnlineService from '@m/modules/footerOnlineService'
import wsLogin from '@m/mixins/wsLogin'
import resultMixin from './mixin'
import { getLoginData, delayAwait } from '@/utils/index'
import { isAPP, appGoDeposit, appAccountLogin } from '@m/base/appHybrid'
import { getJoinResult } from '@/api/mine'
import pcMixin from '@m/mixins/pc'
let fromPath = '/'
export default {
    mixins: [wsLogin, resultMixin, pcMixin],
    beforeRouteEnter: (to, from, next) => {
        const registerRoute = { name: 'Register', params: { step: 1, type: 'openRealAccount' } }
        if (from.name !== 'Register') return next(registerRoute)
        fromPath = from.path
        return delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
            // next(to.params.step !== '1' && from.path === '/' ? registerRoute : true);
            setTimeout(() => {
                next(true)
            })
        })
    },
    data () {
        return {
            isAPP: isAPP,
            loading: false,
            openTypeText: '真实开户',
            accountNo: '', // openAccount.account.customerNumber
            openAccount: '',
            activityPopVisible: false,
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
        // ad() {
        //   const companyInfo = this.$store.state.ix_baseInfo.companyInfo || {}
        //   const uiPageList = companyInfo.uiPageList;
        //   console.log(uiPageList, "000")
        //   return uiPageList ? uiPageList[this.openType] : { top: [], bottom: [], uiModules: [] };
        // },
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
        Top,
        OnlineService,
    },
    created () {
        const openAccount = JSON.parse(sessionStorage.getItem('openAccount'))
        this.openAccount = openAccount
        if (openAccount) {
            this.accountNo = openAccount.account.customerNumber
        } else {
            this.$router.back()
        }
        // const loginData = getLoginData();
        // if (!loginData) this.autoLogin()
        if (this.openType.startsWith('openDemoAccount')) {
            this.openTypeText = '模拟开户'
        }
    },
    mounted () {
        // 检测是否要弹窗
        window.setTimeout(() => {
            this.showActiveDialog()
        }, 500)
    },
    methods: {
        // 去入金
        goDeposit () {
            this._collect(this.openTypeText + '_入金激活', true)
            this.$router.push({ name: 'DepositFunds' })
        },
        showActiveDialog () {
            if (isAPP) return
            const account = this.openAccount.account
            const demo = account.accountList.find(el => el.currency === 'IXD')
            getJoinResult({
                demoAccountId: demo.trade_account_id,
                accountNo: account.customerNumber
            })
                .then(res => {
                    if (res.code === '0' && res.data === 'OK') {
                        this.activityPopVisible = true
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
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
        //         accountType: 'real'
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
        // clickTry(url) {
        //     const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1'));
        //     const openAccount = JSON.parse(sessionStorage.getItem('openAccount'));
        //     const account = openAccount.account
        //     if (isAPP) {
        //         let toNext = '';   // APP登录后跳转的地址
        //         switch (url) {
        //             case '/home':
        //                 toNext = 'appGoDeposit'
        //                 break;
        //             case '/trade':
        //                 toNext = 'appGoQuote'
        //                 break;
        //             default:
        //                 toNext = '';
        //                 break;
        //         }
        //         appAccountLogin('86', account.mobile, registerStep1.passWord, toNext); //APP登录
        //         return false;
        //     }
        //     if (this.userLoginInfo && this.userLoginInfo.account_id) {
        //         this.goNext(url);
        //     } else {
        //         // this.autoLogin(this.goHome.bind(this));
        //         this.autoLogin(() => {
        //             this.goNext(url);
        //         });
        //     }
        // },
        // goNext(url) {
        //     if (url === '/deposit') {
        //         this.goDeposit();
        //     } else {
        //         this.$router.replace({ path: url });
        //     }
        // },
        // serviceClick() {
        //     this._collect(this.openTypeText + '_联系客服', true);
        // },
        // adClick(url) {
        //     if (['/home', '/trade', '/deposit'].includes(url)) {
        //         this.clickTry(url)
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
.registerSuccess {
    position: relative;
    overflow: auto;
    height: 100%;
    padding: rem(90px) rem(20px) rem(130px);
    box-sizing: border-box;
    background: #fff;
    &.noTop {
        padding-top: 0;
    }
    &.pc{
        width:100%;
        .adWrapper {
            margin-left: auto;
            margin-right: auto;
            width: 600px;
        }
    }

}
.container {
    padding-top: rem(20px);
    padding-bottom: rem(40px);
    text-align: center;
    position: relative;
    .close {
        position: absolute;
        right: rem(20px);
        top: rem(-60px);
    }
    .icon_icon_close_big {
        font-size: rem(35px);
        color: #333333;
    }
    .successTip {
        font-size: rem(40px);
        color: rgb(51, 51, 51);
        font-weight: 500;
        margin-top: rem(10px);
    }
    .account {
        font-size: rem(44px);
        margin-top: rem(31px);
        font-weight: 500;
    }
    .text {
        margin-top: rem(34px);
        font-size: rem(24px);
        color: #666;
    }
    .icon_icon_success {
        font-size: rem(120px);
    }

    .successImg {
        height: rem(220px);
        background: url("../../images/icon_chenggong.png") center center
            no-repeat;
        background-size: auto 100%;
    }
}
.adWrapper {
    margin-top: rem(20px);
}
.submitBox {
    margin-top: rem(75px);
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

.bonus-popup {
    animation: bounce 1s;
    transform: translate3d(0, 0, 0);
    margin-left: rem(-310px);
    margin-top: rem(-330px);
    border-radius: rem(10px);
    .activityImg {
        width: 100%;
    }
    .m-bonus {
        width: rem(620px);

        .content {
            position: relative;
            z-index: 4;
            border-radius: 5px;
            // overflow: hidden;
            .icon_icon_close_big {
                position: absolute;
                top: rem(-16px);
                right: rem(-16px);
                font-size: rem(21px);
                width: rem(40px);
                text-align: center;
                height: rem(40px);
                line-height: rem(40px);
                border-radius: 50%;
                color: #fff;
                background: rgba($color: #000, $alpha: 0.9);
            }
            .dialog-footer {
                // margin-top: rem(70px);
                border-top: 1px solid #efefef;
                width: 100%;
                bottom: 0;
                button {
                    border-radius: 0 0 0 rem(10px);
                    &:nth-of-type(2) {
                        border-radius: 0 0 rem(10px) 0;
                    }
                }
            }
        }
    }
}
.van-popup {
    overflow-y: initial;
}

@keyframes bounce {
    0% {
        transform: scale(1.1);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
    20% {
        transform: scale(0.9);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
    40% {
        transform: scale(1.06);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
    60% {
        transform: scale(0.94);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
    80% {
        transform: scale(1.02);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
    100% {
        transform: scale(1);
        -webkit-transform-style: preserve-3d;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
    }
}
</style>
