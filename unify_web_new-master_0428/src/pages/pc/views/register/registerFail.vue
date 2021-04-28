<template>
    <div class='registerFail'>
        <div class='container'>
            <a v-if='!isAPP' class='close' href='javascript:void(0);' @click='$router.back()'>
                <i class='icon_icon_close_big'></i>
            </a>
            <i class='failIcon'></i>
            <p class='failText'>
                {{ $t('registerInfo.failText') }}
            </p>
            <p class='failTextSub'>
                {{ $t('registerInfo.failTextSub') }}
            </p>
            <!-- <p class="errorText" v-if="msg">({{msg}})</p> -->
            <div class='submitBox'>
                <button class='submitBtn mainColorBg' @click='openService'>
                    {{ $t('linkService') }}
                </button>
                <!-- <button class="submitBtn general" @click="tryAgain">{{$t('tryAgain')}}</button> -->
            </div>
        </div>
        <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
        <!-- <OnlineService
            v-if="onlineService && onlineServiceUrl"
            :url="onlineServiceUrl"
            :float="true"
            :title="onlineService.uiComponent && onlineService.uiComponent.length>0? onlineService.uiComponent[0]['title']:null"
        />-->
    </div>
</template>

<script>
import { isAPP, appGoCS } from '@m/base/appHybrid'
import OnlineService from '@m/modules/footerOnlineService'
const openAccountMsg = JSON.parse(sessionStorage.getItem('openAccount'))
export default {
    components: {
        OnlineService,
    },
    data () {
        return {
            isAPP: isAPP,
            openTypeText: '真实开户',
            msg: openAccountMsg && openAccountMsg.error ? openAccountMsg.error.message : ''
        }
    },
    computed: {
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
        if (this.openType.startsWith('openDemoAccount')) {
            this.openTypeText = '模拟开户'
        }
    },
    methods: {
        tryAgain () {
            this._collect(this.openTypeText + '_再试试', true)
            this.$router.push({ name: 'Register', params: { type: this.openType, step: 1 } })
        },
        openService () {
            this._collect(this.openTypeText + '_联系客服', true)
            if (isAPP) return appGoCS()
            const onlineService = this.onlineService || {}
            const uiComponent = onlineService.uiComponent || []
            const title = uiComponent.length > 0 ? uiComponent[0]['title'] : this.$t('onlineService')
            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.onlineServiceUrl, title: title } })
        }
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
    padding-top: rem(48px);
    text-align: center;
    position: relative;

    .close {
        position: absolute;
        right: 0px;
        top: rem(-60px);
    }
    .icon_icon_close_big {
        font-size: rem(46px);
        color: $muted;
    }
    .failIcon {
        display: block;
        height: rem(112px);
        width: rem(112px);
        margin: 0 auto;
        background: url("~@m/images/bad.png") no-repeat center;
        background-size: contain;
    }
    .failText {
        margin: rem(31px) 20% 0;
        font-size: rem(40px);
        color: #333;
        line-height: 1.7;
    }
    .failTextSub {
        margin: rem(20px) 20%;
        font-size: rem(24px);
        color: $muted;
        line-height: 1.7;
    }
    .errorText {
        margin-top: rem(20px);
        color: $muted;
        font-size: rem(24px);
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
