<template>
    <!-- 活动金额弹框 -->
    <div>
        <van-popup v-model='showBonus' class='bonus-popup m-dialog' :close-on-click-overlay='false' @close='closeActivity'>
            <div v-if='showBonus' class='m-bonus'>
                <div class='money_icon_b'></div>
                <div class='money_icon_m'></div>
                <div class='money_icon_s'></div>
                <div class='money-flower'></div>
                <div class='content'>
                    <div class='warp'>
                        <div class='title'>
                            {{ $t('activity.msgTip.' + msgContent.content.title) }}
                        </div>
                        <ul>
                            <li>
                                <span>{{ msgContent.content.amount }}</span>
                                <span>{{ msgContent.content.amountUnit }}</span>
                            </li>
                        </ul>
                        <div class='no-activity'>
                            {{ $t('activity.msgTip.' + msgContent.content.content) }}
                        </div>
                        <div class='dialog-footer'>
                            <van-button
                                :loading='cancelLoading'
                                plain
                                @click='cancel(msgContent.content,msgContent.type)'
                            >
                                {{ msgContent.type=='ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT'?$t('activity.notReceive'):$t('activity.giveupReceive') }}
                            </van-button>
                            <van-button
                                color='#477FD3'
                                :loading='submitLoading'
                                @click='submit(msgContent.content,msgContent.type)'
                            >
                                {{ msgContent.type=='ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT'?$t('activity.receive'):(accountInfo.accountNo?$t('activity.receive'):$t('activity.upgradeAccount')) }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { resetAccount, acceptPriceRecordReady, cancelPriceRecordReady } from '@/api/mine'
import { mapActions } from 'vuex'
import CustomEvent from '@/utils/custom-event'
export default {
    name: 'BonusNews',
    data () {
        return {
            showBonus: false,
            submitLoading: false,
            cancelLoading: false,
            msgContent: {
                content: {}
            },
        }
    },
    methods: {
        ...mapActions(['getAccPriceInfo']),
        newMsg (msg) {
            this.msgContent = Object.assign({}, msg, { content: JSON.parse(msg.content) })
            if (this.msgContent.type == 'ACTIVITY_REAL_GOLDE_EXPERIENCE_RESET') {
                let loading = null
                this.$dialog.confirm({
                    title: this.$t('activity.msgTip.' + this.msgContent.content.title),
                    message: this.$t('activity.msgTip.' + this.msgContent.content.content, { amount: this.msgContent.content.amount, amountUnit: this.msgContent.content.amountUnit }),
                    cancelButtonText: this.$t('compLang.close'),
                    confirmButtonText: this.$t('activity.resetAccount'),
                    closeOnPopstate: true
                }).then(() => {
                    // 重置账户
                    this._collect('账户重置-确认重置')
                    loading = this.$toast.loading({
                        message: this.$t('activity.reseting'),
                        forbidClick: true,
                        loadingType: 'spinner',
                        duration: 0
                    })
                    resetAccount()
                        .then(res => {
                            loading.clear()
                            if (res.code != 0) {
                                this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                            }
                            CustomEvent.dispatch('resetDemoAccount', { name: 'BonusNews' })
                        })
                        .catch(error => {
                            loading.clear()
                            console.log(error)
                        })
                }).catch(() => {
                    this._collect('账户重置-关闭')
                })
            } else {
                this.showBonus = true
            }
        },
        submit (data, type) {
            this.submitLoading = true
            if (type === 'ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT') {
                this._collect('未超过最高额度-入金领取')
            } else {
                if (this.accountInfo.accountNo) {
                    this._collect('超过最高额度-已绑定真实账户-入金领取')
                } else {
                    this._collect('超过最高额度-未绑定真实账户-升级账户')
                }
            }
            acceptPriceRecordReady({
                priceRecordReadyId: data.acceptRecordId,
                type: this.msgContent.type == 'ACTIVITY_REAL_GOLDE_EXPERIENCE_RESET_ACCEPT' ? 2 : 1
            })
                .then(res => {
                    this.showBonus = false
                    this.submitLoading = false
                    if (res.code != 0) {
                        this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                        return
                    }
                    if (this.accountInfo.accountNo) {
                        this.$router.push({ name: 'DepositFunds' })
                    } else {
                        this.$router.push({ name: 'OpenAccount', params: { id: 'openreal' }, query: { showtip: true } })
                    }

                    this.getAccPriceInfo()
                })
                .catch(error => {
                    console.log(error)
                    this.showBonus = false
                    this.submitLoading = false
                })
        },
        closeActivity () {
            CustomEvent.dispatch('resetDemoAccount', { name: 'BonusNews' })
        },
        cancel (data, type) {
            this.cancelLoading = true
            if (type === 'ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT') {
                // 下次领取
                this._collect('未超过最高额度-下次领取')
            } else {
                if (this.accountInfo.accountNo) {
                    this._collect('超过最高额度-已绑定真实账户-放弃领取')
                } else {
                    this._collect('超过最高额度-未绑定真实账户-放弃领取')
                }
            }
            cancelPriceRecordReady({
                priceRecordReadyId: data.acceptRecordId
            })
                .then(res => {
                    this.showBonus = false
                    this.cancelLoading = false
                    if (res.code != 0) {
                        this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.showBonus = false
                    this.cancelLoading = false
                })
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        }
    },
    // mounted () {
    //     this.newMsg({
    //         type: 'ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT',
    //         content: '{"amountUnit":"USD","amount":"10","content":"act_real_gold_3_cotent_code"}'
    //     })
    // }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.bonus-popup {
    animation: bounce 1s;
    transform: translate3d(0, 0, 0);
    margin-left: rem(-310px);
    margin-top: rem(-330px);
    border-radius: rem(10px);
    .m-bonus {
        // position: relative;
        height: rem(660px);
        width: rem(620px);
        .money_icon_m,
        .money_icon_s {
            background-image: url("./money.png");
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
            background-image: url("./money-light.png");
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
            background: url("./money-flower.png") no-repeat;
            position: absolute;
            top: rem(69px);
            left: 50%;
            transform: translateX(-50%);
            background-size: contain;
        }
        .content {
            position: relative;
            z-index: 4;
            top: rem(110px);
            .title {
                text-align: center;
                font-size: rem(38px);
                color: #333;
            }
            .no-activity {
                padding: 0 rem(40px);
                text-align: center;
                color: #999;
                font-size: rem(24px);
                margin-bottom: rem(10px);
            }
            ul {
                padding: 0 rem(40px);
                text-align: center;
                li {
                    width: rem(420px);
                    height: rem(140px);
                    background: url("./money-bg.png") no-repeat center center;
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
