<template>
    <div class='registerFail'>
        <Top class='nobg'>
            <span slot='right'></span>
        </Top>
        <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
        <div class='container'>
            <i class='failIcon'></i>
            <p class='failText'>
                {{ $t('registerInfo.failText') }}
            </p>
            <div class='submitBox'>
                <button v-if='onlineService' class='submitBtn mainColorBg' @click='openService'>
                    {{ $t('linkService') }}
                </button>
                <button class='submitBtn general' @click='tryAgain'>
                    {{ $t('tryAgain') }}
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
export default {
    components: {
        Top,
        OnlineService,
    },
    data () {
        return {
            openType: 'completeInfo',
            msg: ''
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
    methods: {
        tryAgain () {
            history.back()
        },
        openService () {
            const onlineService = this.onlineService || {}
            const uiComponent = onlineService.uiComponent
            let title = this.$t('onlineService')
            if (uiComponent && uiComponent.length) {
                title = uiComponent[0]['title'] || title
            };

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
    padding-bottom: rem(130px);
    box-sizing: border-box;
    padding-top: rem(90px);
}
.container {
    margin-top: rem(48px);
    text-align: center;
    .failIcon {
        display: block;
        height: rem(112px);
        width: rem(112px);
        margin: 0 auto;
        background: url("~@m/images/bad.png") no-repeat center;
        background-size: contain;
    }
    .failText {
        margin-top: rem(31px);
        font-size: rem(28px);
        color: #333;
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
