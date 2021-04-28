<template>
    <div>
        <Top @change-account='callbackMessage' />
        <Home ref='home' />
        <div
            v-if="transitName.endsWith('enter') || transitName.endsWith('right')"
            class='centerViewMask'
            :class="{ center: transitName.endsWith('center'), right: transitName.endsWith('right') }"
            :style="{ right: maskOffsetRight + 'px' }"
            @click='clickMask'
        ></div>
        <div v-if="$route.name!=='Layout'" v-bind='{ transitName:transitName }' class='popWrap' :class="{ right:transitName.endsWith('right') }" @click='clickCenterMask'>
            <router-view :class='routerViewClass' />
        </div>
        <!-- <transition mode='out-in' :name='transitName'>
            <router-view :class='routerViewClass' />
        </transition> -->
    </div>
</template>

<script>
import Top from './top'
import Home from '@pc/views/home'
export default {
    name: 'Layout',
    components: {
        Top,
        Home
    },
    data () {
        return {
            transitName: 'fade-center',
            routerViewClass: 'centerViewDialog',
            maskOffsetRight: 0
        }
    },
    watch: {
        '$route': {
            immediate: true,
            handler (newval, oldval) {
                const position = newval.meta?.position ?? ''
                // if (oldval?.meta?.position) {
                //     setTimeout(() => {
                //         this.setView(position)
                //     }, 300)
                // } else {
                this.setView(position)
                // }
            }
        }
    },
    methods: {
        callbackMessage () {
            this.$refs['home'].getPendings(true)
        },
        setView (position) {
            this.transitName = 'fade-' + position
            this.routerViewClass = position === 'center' ? 'centerViewDialog' : 'rightViewContainer'
            if (this.transitName === 'fade-right') {
                this.maskOffsetRight = 60
            } else {
                this.maskOffsetRight = 0
            }
            // fixed-menu-bar
        },
        clickMask (ev) {
            console.log(ev)
            if (this.transitName === 'fade-right') {
                this.$router.replace({ name: 'Layout' })
            }
        },
        clickCenterMask (ev) {
            if (this.transitName === 'fade-center') this.clickMask(ev)
        }
    }
}
</script>

<style lang="scss" scope>
@import '~@m/sass/mixin.scss';
.centerViewMask {
    position: absolute;
    z-index: 200;
    top: 0;
    width: 100%;
    height: 100%;
    &.center {
        background: rgba($color: #000000, $alpha: 0.5);
    }
    &.right {
        background: transparent;
    }
}
.popWrap {
    position: absolute;
    z-index: 202;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: auto;
    @include scroll();
    &.right{
        left: auto;
        width: 400px;
        right: 60px;
        top:60px;
        bottom:60px;
        height: initial;
        box-shadow: -1px 0px 0px 0px #D6D8E0;
    }
 }
.centerViewDialog {
    margin: auto 0;
    width: 400px;
    background: #fff;
    z-index: 201;
    border-radius: 6px;
    // min-height: 480px;
    // 实名弹窗样式
    .module-title {
        padding-top: 16px !important;
        .icon_icon_close_big {
            right: 12px !important;
            font-size: 17px;
            top: 10px;
        }
    }
    .module-content {
        flex: 1;
        // overflow: auto !important;
        // @include scroll();
        .authentication {
            .photo-tips {
                padding-top: 30px;
            }
            .back {
                margin-bottom: 80px;
            }
            .btn {
                bottom: -9px;
                background-color: #ffffff;
                height: 80px;
                box-shadow: 3px 0px 8px -3px #000;
                button {
                    margin-top: 18px;
                }
            }
        }
        .add-bank {
            .btn-submit {
                bottom: -9px;
            }
        }
    }
    .deposit-funds {
        .footer {
            height: 80px;
            background-color: #ffffff;
            position: absolute;
            left: 0;
            right: 0;
            bottom: -9px;
            box-shadow: 3px 0px 8px -3px #000;
            .confirm-btn {
                width: 360px;
                margin-bottom: 16px;
                margin-left: 20px;
            }
        }
    }
}
.m-msgList {
    height: auto !important;
    .content {
        height: auto !important;
    }
}
.rightViewContainer {
    position: absolute;
    margin: auto;
    top: 0 !important;
    right: 0;
    bottom: 0;
    width: 400px;
    background: #fff;
    z-index: 202;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    @include scroll();
    background-color: #f8f8f8;
    box-shadow: -2px 0px 2px 0px #d5d8e0;
    .module-content {
        max-height: none !important;
        height: 100%;
        .m-positionClose {
            height: auto !important;
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
        }
        .m-setting {
            .main {
                padding-top: 0;
            }
        }
        .assetDetails {
            .menu-wrap {
                top: 0px !important;
            }
            .list {
                position: absolute;
                top: 96px;
                bottom: 0;
                height: auto !important;
            }
        }
    }
    .content {
        margin-top: 0 !important;
    }
}
</style>
