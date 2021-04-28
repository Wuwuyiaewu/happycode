<template>
    <div class='fullGuideDialog'>
        <van-dialog
            v-model='visible'
            :cancel-button-color='mainColor'
            :cancel-button-text='$t("iKnow")'
            :confirm-button-text='$t("router.playGuide")'
            show-cancel-button
            title=''
            @confirm='confirm'
            @open='open'
        >
            <img class='fullGuideImg' src='../../images/fullGuideImg1.png' />
            <p class='title'>
                {{ $t('activity.fullEntered') }}
            </p>
            <div class='highlightTip'>
                {{ $t('activity.initAmount')+ accInfo.initAmount + $store.getters.symbolCode }} + {{ $t('activity.tradeYL') }} = {{ $t('activity.yourReward') }}
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { localSet } from '@/utils/index'
export default {
    data () {
        return {
            visible: true
        }
    },
    computed: {
        mainColor () {
            return this.$store.getters.style.mainColor
        },
        accInfo () {
            return this.$store.state.accInfo || {}
        }
    },
    created () {
        setTimeout(() => {
            localSet('fullEntered', 'true')
        }, 1000)
    },
    methods: {
        confirm () {
            this.$router.push({ name: 'PlayGuide' })
            this._collect('点击玩法指引', true)
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.fullGuideDialog{
    position: relative;
    z-index: 2111;
    .fullGuideImg{
        display: block;
        padding-top: rem(63px);
        width: rem(160px);
        margin: 0 auto;
    }
    .title{
        font-size: rem(28px);
        padding-top: rem(30px);
        text-align: center;
        color: #333;
    }
    .highlightTip{
        margin: rem(40px) rem(30px);
        border: rem(3px) solid #F39801;
        border-radius: rem(20px);
        text-align: center;
        color: #F39801;
        height: rem(105px);
        line-height: rem(105px);
        font-size: rem(26px);
        font-weight: normal;
    }
    ::v-deep .van-dialog__confirm {
        background: $primary;
        .van-button__text{
            color: #fff !important;
        }
    }
}
</style>
