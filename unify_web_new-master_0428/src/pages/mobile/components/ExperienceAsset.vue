<template>
    <div>
        <div class='m-experience'>
            <div class='item-1'>
                <div class='info info-1'>
                    <div class='sub'>
                        {{ $t('trade.balance') }}
                    </div>
                    <div>{{ $store.state.ix_user.userLoginInfo.balance | moneyAccuracy(false) }}</div>
                </div>
                <div class='center'>
                    /
                </div>
                <div class='info info-2' @click='showMaxTip'>
                    <div class='sub'>
                        {{ $t('activity.balanceMax') }}
                        <van-icon class='tip' name='question-o' />
                    </div>
                    <div>
                        {{ accInfo.maxAmount | moneyAccuracy(false) }}
                    </div>
                </div>
            </div>
            <div class='item-2'>
                <div class='scrollbars'>
                    <div ref='progress' class='content'>
                        <div
                            class='start'
                            :class='{
                                ltZero: assetAboutInfo.accountData.jz < 0
                            }'
                        >
                            0
                        </div>
                        <div
                            class='balance'
                            :class="{
                                'balance-left': $store.state.ix_user.userLoginInfo.balance < 0,
                                'balance-right': $store.state.ix_user.userLoginInfo.balance >= 0
                            }"
                            :style='{
                                transform: `translateX(${$store.state.ix_user.userLoginInfo.balance < 0 ? 5 : 0}px)`,
                                width: `${balanceWidth}px`
                            }'
                        >
                            <div class='txt'>
                                {{ $t('trade.balance') }} {{ $store.state.ix_user.userLoginInfo.balance | moneyAccuracy(false) }}
                            </div>
                        </div>
                        <div
                            class='net'
                            :class='{
                                rise: (assetAboutInfo.accountData.jz > 0 && userConfigInfo.type == 1) || (assetAboutInfo.accountData.jz <= 0 && userConfigInfo.type == 2),
                                fall: (assetAboutInfo.accountData.jz <= 0 && userConfigInfo.type == 1) || (assetAboutInfo.accountData.jz > 0 && userConfigInfo.type == 2)
                            }'
                            :style='{
                                transform: `translateX(${netPosition}px)`
                            }'
                        >
                            <div
                                class='txt'
                                :class='{
                                    riseColor: assetAboutInfo.accountData.jz >= 0,
                                    fallColor: assetAboutInfo.accountData.jz < 0
                                }'
                                :style="{
                                    transform: `translateX(${assetAboutInfo.accountData.jz/accInfo.maxAmount < 0.15 ? '125%' : 0})`
                                }"
                            >
                                {{ $t('trade.netAssets') }}{{ assetAboutInfo.accountData.jz.toFixed(2) }}
                            </div>
                        </div>
                        <div class='flg' :class='{ gtMax: assetAboutInfo.accountData.jz > accInfo.maxAmount }'></div>
                    </div>
                    <div class='right'>
                        <div>{{ accInfo.maxAmount | moneyAccuracy(false) }}</div>
                        <div>{{ $t('activity.balanceMax') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { resetmaxAmountToAccount, addBonusFlowRecords } from '@/api/mine'
export default {
    name: 'ExperienceAsset',
    data () {
        return {
            progressStart: 0,
            progressWidth: 0,
            netDom: null
        }
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo', 'accountData', 'activateTime']),
        accInfo () {
            return this.$store.state.accInfo
        },
        userConfigInfo () {
            return this.$store.state.userConfigInfo
        },
        balanceWidth () {
            let scale = this.$store.state.ix_user.userLoginInfo.balance / this.accInfo.maxAmount
            if (scale < 0) {
                return 5
            } else {
                if (this.assetAboutInfo.accountData.jz > this.accInfo.maxAmount) {
                    console.log(this.progressWidth)
                    const _width = this.progressWidth - 10
                    if (scale < 1) {
                        scale = scale > 1 ? 1 : scale
                        return parseInt(_width * scale)
                    } else if (scale === 1) {
                        return _width
                    } else if (scale > 1) {
                        return _width + 9
                    }
                } else {
                    scale = scale > 1 ? 0.999 : scale
                    return parseInt(this.progressWidth * scale)
                }
            }
        },
        netPosition () {
            let scale = this.assetAboutInfo.accountData.jz / this.accInfo.maxAmount
            let netStart = 0
            if (this.netDom) {
                netStart = parseInt(this.progressStart - this.netDom.clientWidth)
            } else {
                netStart = -41
            }

            if (scale < 0) {
                return netStart + 5
            } else {
                scale = scale > 1 ? 0.999 : scale
                return parseInt(netStart + this.progressWidth * scale)
            }
        }
    },
    mounted () {
        const _dom = this.$refs.progress
        this.progressWidth = this.$refs.progress.clientWidth
        this.netDom = _dom.querySelector('.net')
        if (this.$store.state.ix_user.userLoginInfo.balance > this.accInfo.maxAmount) {
            this.$dialog
                .confirm({
                    title: this.$t('tip'),
                    message: this.$t('activity.pendingBonusTip_3', { name: this.activateTime ? this.$t('activity.depositTipB') : this.$t('activity.upgradeAccount') }),
                    confirmButtonText: this.activateTime ? this.$t('activity.receive2') : this.$t('upgrade.continueUpgrade'),
                    cancelButtonText: this.$t('activity.giveupReceive')
                })
                .then(() => {
                    addBonusFlowRecords()
                        .then(res => {
                            if (res.invalid()) {
                                res.toast()
                                return
                            }
                            this.$router.push({ name: 'UpgradeAccount' })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
                .catch(() => {
                    resetmaxAmountToAccount().finally(() => {
                        this.$store.dispatch('getAccPriceInfo')
                    })
                })
        }
    },
    methods: {
        showMaxTip () {
            this.$dialog
                .confirm({
                    title: this.$t('tip'),
                    message: this.$t('activity.descriptionTip', { amount: this.accInfo.maxAmount }),
                    confirmButtonText: this.$t('activity.playTips'),
                    cancelButtonText: this.$t('iKnow')
                })
                .then(() => {
                    this.$prophet(['trackEvent', '体验活动', '我的页面弹窗', '我的弹窗_玩法指引', 90])
                    this.$router.push({ name: 'PlayGuide' })
                })
                .catch(() => {})
        },
        updateProgress () {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@m/sass/mixin.scss';
.m-experience {
    .item-1 {
        display: flex;
        font-size: rem(40px);
        align-items: flex-start;
        padding-top: rem(30px);
        color: #333333;
        .center {
            margin: 0 rem(40px);
            padding-top: rem(10px);
        }
        .sub {
            font-size: rem(24px);
            i {
                position: relative;
                top: rem(2px);
                color: #333333;
            }
        }
        .info {
            flex: 1;
            text-align: center;
        }
        .info-1 {
            text-align: right;
        }
        .info-2 {
            text-align: left;
        }
    }
    .item-2 {
        position: relative;
        padding-top: rem(75px);
        padding-bottom: rem(20px);
        align-items: flex-start;
        .scrollbars {
            display: flex;
            .right {
                position: relative;
                top: -4px;
                color: #666;
                font-size: rem(24px);
                text-align: right;
                margin-left: rem(10px);
            }
            .content {
                position: relative;
                flex: 1;
                background-color: #eaeaea;
                height: 10px;
                border-radius: 5px;

                .start {
                    position: absolute;
                    text-align: center;
                    top: 0;
                    margin-left: -1px;
                    background-color: #fff;
                    display: inline-block;
                    width: 0px;
                    height: 8px;
                    color: #999999;
                    font-size: rem(24px);
                    line-height: 34px;
                    &.ltZero {
                        width: 1px;
                        left: 10px;
                    }
                }
                .flg {
                    position: absolute;
                    right: 0;
                    margin-right: -14px;
                    z-index: 5;
                    bottom: 0;
                    background-image: url('../assets/asset_flg.png');
                    background-size: cover;
                    width: rem(32px);
                    height: rem(50px);
                    &.gtMax {
                        right: 10px;
                    }
                }
            }
            .balance {
                position: relative;
                height: 10px;
                width: 0;
                transform: translateX(0px);
                transition: width 500ms;
                background-color: #f39800;
                z-index: 3;
                &.balance-left {
                    border-radius: 5px 0 0 5px;
                }
                &.balance-right {
                    border-radius: 5px;
                }
                .txt {
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    margin-left: -50px;
                    height: 20px;
                    line-height: 20px;
                    background-color: #f39800;
                    color: #fff;
                    width: 110px;
                    font-size: 12px;
                    text-align: center;
                    border-radius: 10px;
                    &::after {
                        content: '';
                        position: absolute;
                        display: inline-block;
                        bottom: -3px;
                        left: 50%;
                        margin-left: -2px;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-width: 4px 4px 0 4px;
                        border-color: #f39800 transparent transparent transparent;
                    }
                }
            }
            .net {
                position: relative;
                display: inline-block;
                padding-right: 8px;
                padding-top: 10px;
                font-size: rem(24px);
                transform: translateX(0px);
                transition: all 400ms;
                z-index: 5;
                &::after {
                    content: '';
                    position: absolute;
                    display: inline-block;
                    top: 14px;
                    right: -3px;
                    margin-left: -2px;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 4px 4px 4px;
                }
                &::before {
                    content: '';
                    position: absolute;
                    display: inline-block;
                    top: -8px;
                    right: 0;
                    margin-left: -2px;
                    width: 2px;
                    height: 18px;
                }
                &.rise {
                    &::after {
                        border-color: transparent transparent #10b873 transparent;
                    }
                    &::before {
                        background-color: #10b873;
                    }
                }
                &.fall {
                    &::after {
                        border-color: transparent transparent #e3525c transparent;
                    }
                    &::before {
                        background-color: #e3525c;
                    }
                }
            }
        }
    }
}
</style>
