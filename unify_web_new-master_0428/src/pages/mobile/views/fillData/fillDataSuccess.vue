<template>
    <div class='registerSuccess'>
        <Top class='nobg'>
            <span slot>
                {{ $t('registerInfo.openSuccess') }}
            </span>
            <span slot='right'></span>
        </Top>
        <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
        <div class='container'>
            <p class='successTip'>
                {{ $t('registerInfo.openSuccessTip') }}
            </p>
            <p class='account mainColor'>
                {{ accountNo }}
            </p>
            <p class='text'>
                {{ $t('registerInfo.useAccountLogin') }}
            </p>

            <div class='submitBox'>
                <button
                    class='submitBtn mainColorBg'
                    :disabled='loading'
                    @click='switchAndDeposit'
                >
                    {{ $t('registerInfo.toDeposit') }}
                </button>
            </div>
        </div>
        <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
        <OnlineService
            v-if='onlineService && onlineServiceUrl'
            :title="onlineService.uiComponent && onlineService.uiComponent.length>0? onlineService.uiComponent[0]['title']:null"
            :url='onlineServiceUrl'
        />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import OnlineService from '@m/modules/footerOnlineService'
import wsLogin from '@m/mixins/wsLogin'
import { getLoginData, delayAwait } from '@/utils/index'
const openAccount = JSON.parse(sessionStorage.getItem('complateInfoRes'))
const fromPath = '/'
export default {
    components: {
        Top,
        OnlineService,
    },
    mixins: [wsLogin],
    data () {
        return {
            loading: false,
            openType: 'completeInfo',
            accountNo: openAccount.account.customerNumber
        }
    },
    computed: {
        // 广告
        ad () {
            const companyInfo = this.$store.state.ix_baseInfo.companyInfo || {}
            const uiPageList = companyInfo.uiPageList
            return uiPageList ? uiPageList[this.openType] : { top: [], bottom: [], uiModules: [] }
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
    created () {
        this.autoLogin()
    },
    methods: {
        // 去入金
        goDeposit () {
            this.$ws.send_switchAccount(() => {
                this.$router.push({ name: 'DepositFunds' })
            })
        },
        // 登录
        autoLogin (callback) {
            const loginData = getLoginData()
            this.loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            this.$store.dispatch('login', {
                accountNo: loginData.accountNo,
                passWord: loginData.passWord
            }).then(res => {
                if (this.loading) this.loading.clear()
                this.loading = null
                console.log('login', res)
                if (res.code === 1 && callback) callback()
            })
        },
        // 切换账号并跳转入金
        switchAndDeposit () {
            this._collect('补充资料开真实_入金激活', true)
            this.goDeposit()
        },
        // 立即体验
        goHome () {
            this.$router.push({ name: 'Home' })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.registerSuccess {
    position: relative;
    min-height: 100%;
    padding-bottom: rem(130px);
    box-sizing: border-box;
    padding-top: rem(90px);
}
.container {
    padding-top: rem(90px);
    text-align: center;
    .successTip {
        font-size: rem(28px);
        color: #333;
    }
    .account {
        font-size: rem(44px);
        margin-top: rem(31px);
        font-weight: 500;
    }
    .text {
        margin-top: rem(47px);
        font-size: rem(24px);
        color: $muted;
    }
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
</style>
