<template>
    <van-popup v-model='showTips' class='m-tips' @opened='closeCallback'>
        <template v-if="type == 'giftTip'">
            <div class='tip'>
                <div class='contain'>
                    <div class='giftTip'>
                        <p class='frame'>
                            <img src='./Notify/tip_img.png' />
                        </p>
                        <div class='fadeIn2'>
                            <b>{{ $t('activity.cashGift',{ balance:$store.state.ix_user.userLoginInfo.balance }) }}</b>
                            <div>{{ $t('activity.toOrder') }}</div>
                        </div>
                    </div>

                    <van-button class='btn' @click='close'>
                        {{ $t('iKnow') }}
                    </van-button>
                </div>
            </div>
        </template>
        <template v-else>
            <div class='tip' :class='type'>
                <div class='arrow'></div>
                <div class='contain'>
                    <!-- <div v-if="type == 'resetDemo'" class='content'>
                        <div class='img img1'></div>
                        <div class='text'>
                            {{ $t('setting.resetAccountTip') }}
                        </div>
                    </div> -->
                    <div v-if="type == 'openBrowser'" class='content'>
                        <div class='img img2'></div>
                        <div class='text'>
                            {{ $t('setting.openBrowser') }}
                        </div>
                    </div>
                    <van-button class='btn' @click='close'>
                        {{ $t('iKnow') }}
                    </van-button>
                </div>
            </div>
        </template>
    </van-popup>
</template>

<script>
import { localSet, localGet, getQueryVariable } from '@/utils/index'
export default {
    name: 'Tips',
    data () {
        return {
            showTips: false,
            type: 'openBrowser', // openBrowser
            globalTip: {}
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accInfo () {
            return this.$store.state.accInfo
        }
    },
    watch: {
        accInfo () {
            this.showtip()
        },
        '$route.name' () {
            this.showtip()
        }
    },
    created () {
        // 获取本地保存的是否已经提示过的信息
        this.globalTip = JSON.parse(localGet('globalTip')) || {}
    },
    mounted () {
        this.showtip()
    },
    methods: {
        close () {
            this.showTips = false
        },
        closeCallback () {
            localSet('globalTip', JSON.stringify(Object.assign({ accountNo: this.accountInfo.accountNo || this.accountInfo.accountDemoNo }, this.globalTip)))
            // if (this.globalTip.type === 'resetDemo') {
            //     const resetAccountDom = document.querySelector('.resetAccount')
            //     if (resetAccountDom) {
            //         resetAccountDom.classList.remove('z-index-9999')
            //     }
            // }
        },
        showtip () {
            if(this.showTips) {
                return
            }
            const sourceParams = sessionStorage.getItem('sourceParams')
            if (this.$route.name === 'Mine') {
                if (!this.globalTip.giftTip && this.accountInfo.accountType === 'demo' && this.accInfo.maxAmount > 0 && getQueryVariable('minetipcash', sourceParams)) {
                    this.globalTip.giftTip = true
                    this.type = 'giftTip'
                    this.showTips = true
                }
                // else if (!this.globalTip.resetDemo && this.accountInfo.accountType === 'demo' && this.accInfo.maxAmount > 0) {
                //     const resetAccountDom = document.querySelector('.resetAccount')
                //     if (resetAccountDom) {
                //         resetAccountDom.classList.add('z-index-9999')
                //     }
                //     this.globalTip.resetDemo = true
                //     this.type = 'resetDemo'
                //     this.showTips = true
                // }
            } else if (['TradeIndex', 'OrderSuccess'].indexOf(this.$route.name) > -1) {
                if (!this.globalTip.openBrowser && sourceParams && getQueryVariable('openbrowser', sourceParams)) {
                    this.globalTip.openBrowser = true
                    this.type = 'openBrowser'
                    this.showTips = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// z-index-9999
@import '~@m/sass/mixin.scss';
.m-tips {
    top: 0;
    left: 0;
    transform: translate3d(0%, 0%, 0);
    width: 100%;
    background: transparent;
}
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.giftTip {
    font-size: 0.35rem;
    color: #fff;
    text-align: center;
    .frame {
        display: block;
        width: 3.3rem;
        margin: 1.4rem 0 -0.4rem 0;
        opacity: 0;
        animation: fadeIn 0.5s 1;
        animation-fill-mode: forwards;
        animation-delay: 0.3s;
    }
    .frame img {
        display: block;
        width: 100%;
    }

    .fadeIn2 {
        opacity: 0;
        animation: fadeIn 0.5s 1;
        animation-fill-mode: forwards;
        animation-delay: 0.7s;
        b {
            ddisplay: block;
            font-size: 0.45rem;
            color: #ffa903;
            padding: 0.1rem 0;
        }
    }
}
.tip {
    position: relative;
    padding-top: rem(100px);
    &.resetDemo {
        margin-top: rem(100px);
        .arrow {
            right: rem(260px);
        }
    }
    .arrow {
        position: absolute;
        top: rem(10px);
        right: rem(90px);
        background-image: url('../images/tips_1.png');
        background-size: cover;
        width: rem(30px);
        height: rem(84px);
    }
    .contain {
        padding: 0 rem(85px);
        text-align: center;
    }
    .content {
        display: flex;
        align-items: center;
        border: dashed 1px #fff;
        border-radius: rem(10px);
        padding: rem(26px) rem(50px);
        .img {
            flex-shrink: 1;
            background-size: cover;
            width: rem(70px);
            height: rem(68px);
            margin-right: rem(40px);
            &.img1 {
                background-image: url('../images/tips_2.png');
            }
            &.img2 {
                background-image: url('../images/tips_3.png');
            }
        }
        .text {
            flex: 1;
            word-break: break-all;
            text-align: left;
            font-size: rem(28px);
            line-height: rem(36px);
            color: #fff;
        }
    }
    .btn {
        color: #f39800;
        background-color: transparent;
        border: 1px solid #f39800;
        border-radius: rem(10px);
        width: rem(265px);
        height: rem(70px);
        margin-top: rem(40px);
        animation: fadeIn 0.5s 1;
    }
}
</style>
