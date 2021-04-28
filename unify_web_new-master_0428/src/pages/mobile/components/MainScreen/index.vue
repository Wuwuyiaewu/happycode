<template>
    <div class='main-screen'>
        <div class='screen-overlay' @click.stop='closeMainScreen'>
        </div>
        <div class='main-screen-container' :class='brand'>
            <div class='main-screen-header'>
                <em @click='neverNotify'>
                    {{ $t("pwa.neverNotify") }}
                </em>
                <span @click.stop='closeMainScreen'>
                    <i class='icon_icon_close_big'></i>
                </span>
            </div>
            <div class='main-screen-body'>
                <div class='company-logo'>
                    <img alt='' src='/images/icon.png' />
                </div>
                <div class='company-name'>
                    {{ applyName }}
                </div>
                <div class='apply-intro'>
                    {{ $t("pwa.toDesktop") }}
                </div>
            </div>
            <div class='main-screen-footer'>
                <template v-if="brand==='iphone'">
                    <p>{{ $t("pwa.iphone.step1") }}<span class='icon iconfont icon_iOS_fenxiangtubiao'></span></p>
                    <p>{{ $t("pwa.iphone.step2") }}</p>
                </template>
                <template v-else-if="brand==='vivo'">
                    <p>{{ $t("pwa.vivo.step1") }}</p>
                    <p>{{ $t("pwa.vivo.step2") }} </p>
                </template>
                <template v-else-if="brand==='huawei'">
                    <p>{{ $t("pwa.huawei.step1") }}</p>
                    <p>{{ $t("pwa.huawei.step2") }}</p>
                </template>
                <template v-else-if="brand==='xiaomi'">
                    <p>{{ $t("pwa.xiaomi.step1") }}</p>
                    <p>{{ $t("pwa.xiaomi.step2") }}</p>
                </template>
                <template v-else-if="brand==='samsung'">
                    <p>{{ $t("pwa.samsung.step1") }}</p>
                    <p>{{ $t("pwa.samsung.step2") }}</p>
                </template>
                <template v-else>
                    <p>{{ $t("pwa.default.step1") }}</p>
                    <p>{{ $t("pwa.default.step2") }}</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { localSet } from '@/utils/index'
import { getMobileBrand } from '@/utils/phone'
export default {
    name: 'MainScreen',
    data () {
        return {
            brand: getMobileBrand(),
            applyName: ''
        }
    },
    mounted () {
        this.applyName = document.title
    },
    methods: {
        neverNotify () {
            localSet('viewScreen', 1)
            this.$emit('update:screen', false)
        },
        closeMainScreen () {
            this.$emit('update:screen', false)
        }
    }

}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.main-screen{
    height: 100%;
    width: 100%;
    .icon_iOS_fenxiangtubiao{
        color:#0279ff;
    }
    .screen-overlay{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index:99;
    }
    .main-screen-container{
        text-align: center;
        width: rem(680px);
        padding: 0 rem(24px);
        background: #FFFFFF;
        border-radius: rem(6px);
        box-shadow: 0px 0px rem(32px) 0px rgba(0, 0, 0, 0.4);
        position: fixed;
        left: 50%;
        bottom: 0;
        transform: translate3d(-50%,rem(-28px),0);
        z-index:100;
        &::after{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            content: " ";

            border-width: rem(24px);
            left: 50%;
            bottom: rem(-22px);
            margin-left: rem(-24px);
            border-top-color: #fff;
            border-bottom-width: 0;
        }
        &.iphone,&.vivo{
            &::after{
                left: 50%;
            }
        }
        &.samsung{
            &::after{
                left: 94%;
            }
        }
        &.xiaomi{
            &::after{
                left: 72%;
            }
        }
        &.huawei{
            &::after{
                left: 94%;
            }
        }

        .main-screen-header{
            position: relative;
            padding-top: rem(20px);
            padding-bottom: rem(4px);
            text-align: left;
            &:after {
                content: "";
                display: inline-block;
                vertical-align: middle;
                height: 100%;
            }
            em{
                font-style: normal;
                color: #989898;
                font-size: rem(24px);
            }
            span{
                position: absolute;
                right: 0;
                top: rem(20px);
            }
        }
        .company-logo{
            padding-bottom: rem(24px);
            img{
                width:rem(128px);
                height: rem(128px);
                box-shadow: 0px 0px rem(24px) 0px rgba(0, 0, 0, 0.08);
                border-radius: rem(24px);
            }
        }
        .company-name{
            font-size:rem(34px);
            color:#333;
            padding-bottom: rem(34px);
            padding-bottom: rem(48px);
        }
        .apply-intro{
            font-size:rem(24px);
            color:#989898;
            padding-bottom: rem(48px);
        }
        .main-screen-footer{
            border-top: 1px solid #EFEFEF;
            padding: rem(42px) 0;
            font-size:rem(24px);
            line-height: rem(36px);
            color:#989898;
        }
    }
}
</style>
