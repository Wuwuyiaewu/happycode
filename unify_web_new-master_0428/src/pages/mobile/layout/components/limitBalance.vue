<template>
    <!-- 活动金额弹框 -->
    <div>
        <van-popup class='bonus-popup m-dialog' :close-on-click-overlay='false' :value='show'>
            <div v-if='show' class='m-bonus'>
                <!-- <div class='money_icon_b'></div>
                <div class='money_icon_m'></div>
                <div class='money_icon_s'></div> -->
                <div class='money-flower'></div>
                <div class='content'>
                    <div class='warp'>
                        <div class='title'>
                            {{ data.title }}
                        </div>
                        <ul>
                            <li>
                                <span>{{ data.amount | priceDigit }}</span>
                                <span>{{ symbolCode }}</span>
                            </li>
                        </ul>
                        <div class='no-activity' v-html='data.desc'></div>
                        <div class='dialog-footer'>
                            <van-button
                                plain
                                @click='confirmFn'
                            >
                                {{ data.btnText }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { resetAccount } from '@/api/mine'
export default {
    name: 'TokesTip',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        show: {
            type: Boolean
        }
    },
    computed: {
        ...mapGetters(['symbolCode']),
        accInfo () {
            return this.$store.state.accInfo
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        confirmFn () {
            this.close()
            if (this.data.type === 'iKnow') return
            this.resetDemoAccount()
        },
        // 重置账户
        resetDemoAccount () {
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
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.bonus-popup {
    animation: bounce 1s;
    transform: translate3d(0, 0, 0);
    margin-left: rem(-290px);
    margin-top: rem(-280px);
    border-radius: rem(10px);
    .m-bonus {
        // position: relative;
        height: rem(560px);
        width: rem(580px);
        .money_icon_m,
        .money_icon_s {
            background-image: url("./img/money.png");
            background-size: cover;
            z-index: 5;
        }
        .money_icon_b {
            position: absolute;
            left: 50%;
            margin-left: rem(-91px);
            top: rem(-91px);
            width: rem(180px);
            height: rem(182px);
            background-image: url("./img/money-light.png");
            background-size: cover;
            z-index: 5;
        }
        .money_icon_m {
            position: absolute;
            top: rem(-64px);
            right: rem(50px);
            width: rem(45px);
            height: rem(45px);
        }
        .money_icon_s {
            position: absolute;
            width: rem(35px);
            height: rem(35px);
            left: rem(-17.5px);
            bottom: rem(180px);
        }
        .money-flower {
            width: rem(568px);
            height: rem(275px);
            background: url("./img/money-flower.png") no-repeat;
            position: absolute;
            top: rem(69px);
            left: 50%;
            transform: translateX(-50%);
            background-size: contain;
        }
        .content {
            position: relative;
            z-index: 4;
            top: rem(60px);
            .title {
                text-align: center;
                font-size: rem(38px);
                color: #333;
            }
            .no-activity {
                padding: 0 rem(40px);
                text-align: center;
                color: #333333;
                font-size: rem(28px);
                margin-bottom: rem(10px);
            }
            ul {
                padding: 0 rem(40px);
                text-align: center;
                li {
                    width: rem(420px);
                    height: rem(140px);
                    background: url("./img/money-bg.png") no-repeat center center;
                    background-size: contain;
                    margin: rem(57px) auto rem(61px);

                    span {
                        display: inline-block;
                        line-height: rem(140px);
                        font-size: rem(90px);
                        color: #c0843c;
                        vertical-align: middle;
                        &:last-child {
                            font-size: rem(28px);
                            margin-left: rem(26px);
                            vertical-align: middle;
                        }
                    }
                }
            }
            .dialog-footer {
                margin-top: rem(70px);
                border-top: 1px solid #efefef;
                width: 100%;
                position: fixed;
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
