<template>
    <!-- 活动金额弹框 -->
    <div>
        <van-popup class='m-dialog transparent' :close-on-click-overlay='false' :value='show' @opened='opened'>
            <div class='m-bonusNews' :class='`status${status}`'>
                <div v-if='status === 3' class='item-2'>
                    <div class='img'>
                        <img alt='' src='./images/header_2.png' />
                    </div>
                    <div class='close' @click='close(3)'>
                        <van-icon name='cross' />
                    </div>
                    <div class='warp'></div>
                </div>
                <div v-else class='item-1'>
                    <img alt='' src='./images/header_1.png' />
                    <div v-if='status === 2' class='close' @click='close(2)'>
                        <van-icon name='cross' />
                    </div>
                </div>
                <div class='item-3'>
                    <div class='title'>
                        <template v-if='status === 1 || status === 3'>
                            {{ $t('activity.balance') }}
                        </template>
                    </div>
                    <div class='content'>
                        <div v-if='status === 2' class='data-2'>
                            <div class='item item-1'>
                                <div class='name'>
                                    {{ $t('activity.balance') }}
                                </div>
                                <div class='number'>
                                    <digit-roll :delay='0' :duration='800' :value='accInfo.maxAmount' />
                                </div>
                                <div class='unit'>
                                    {{ symbolCode }}
                                </div>
                            </div>
                            <div class='icon'>
                                <van-icon name='plus' />
                            </div>
                            <div class='item item-2'>
                                <div class='name'>
                                    {{ $t('activity.outBalance') }}
                                </div>
                                <div class='number'>
                                    <digit-roll :delay='500' :duration='800' :value='balance - accInfo.maxAmount' />
                                </div>
                                <div class='unit'>
                                    {{ symbolCode }}
                                </div>
                            </div>
                        </div>
                        <div v-else class='data-1'>
                            <span class='info'>
                                <digit-roll :delay='0' :duration='1000' :value='balance' />
                            </span>
                            <span class='info'>
                                {{ symbolCode }}
                            </span>
                        </div>
                    </div>
                    <div v-if='status === 1' class='sub'>
                        {{ $t('activity.getCash', { name: upgradeAccount }) }}
                        <span class='status-A'>
                            {{ balance | moneyAccuracy(false) }}{{ symbolCode }}
                        </span>
                    </div>
                    <div v-if='status === 2' class='sub'>
                        {{ $t('activity.balanceMax') }}<span class='status-B'>
                            {{ accInfo.maxAmount | moneyAccuracy(false) }}{{ symbolCode }}
                        </span class="info">{{ $t('activity.balanceMaxOut')
                        }}<span class='status-B'>
                            {{ (balance - accInfo.maxAmount) | moneyAccuracy(false) }}{{ symbolCode }}
                        </span>{{ $t('activity.balanceMaxOut2', { name: upgradeAccount }) }}
                    </div>
                    <div v-if='status === 3' class='sub'>
                        {{ $t('activity.tipReset') }}
                    </div>
                </div>
                <div class='animate'></div>
                <div class='dialog-footer'>
                    <van-button
                        v-if='status === 1'
                        v-prophet="['trackEvent', '体验活动', '平仓弹窗', '平仓弹窗_再多赚点', 88]"
                        plain
                        @click='cancel'
                    >
                        <div>{{ $t('activity.getMore') }}</div>
                        <div class='sub'>
                            {{ $t('activity.balanceMax2') }}{{ accInfo.singleMaxGive | moneyAccuracy(false) }}{{ symbolCode }}
                        </div>
                    </van-button>
                    <van-button
                        v-prophet="() => status === 3
                            ? ['trackEvent', '体验活动', '平仓弹窗', '平仓弹窗_重置账户', 86]
                            : ['trackEvent', '体验活动', '平仓弹窗', '平仓弹窗_升级账户', 87]
                        "
                        color='#477FD3'
                        :loading='submitLoading'
                        @click='submit'
                    >
                        <div>{{ status === 3 ? $t('activity.resetAccount') : upgradeAccount }}</div>
                        <div v-if='status === 1' class='sub'>
                            {{ $t('activity.getAll') }}
                        </div>
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addBonusFlowRecords, resetAccount, cancelPriceRecordReady, resetmaxAmountToAccount } from '@/api/mine'
import { moneyAccuracy } from '@/filters/index'
import lottie from 'lottie-web'
import DigitRoll from 'digit-roll'
import Vue from 'vue'
Vue.use(DigitRoll)
export default {
    name: 'BonusNews',
    data () {
        return {
            status: 1, // 1正常平仓，2余额超上限，3余额过低
            submitLoading: false,
            closeInfo: {},
            balance: 0,
        }
    },
    computed: {
        ...mapGetters(['symbolCode', 'hasRealAccount', 'activateTime']),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accInfo () {
            return this.$store.state.accInfo
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo
        },
        upgradeAccount () {
            if (this.activateTime) {
                return this.$t('trade.deposit')
            } else {
                return this.$t('activity.upgradeAccount')
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    mounted () {
        this.balance = moneyAccuracy((this.userLoginInfo.balance - Number(this.info.totalprofit)), false)
        if (this.userLoginInfo.balance < Number(this.accInfo.minAmount)) {
            // 小于最低额度
            this.status = 3
        } else if (this.userLoginInfo.balance > Number(this.accInfo.maxAmount)) {
            // 余额超上限
            this.status = 2
        } else {
            this.status = 1
        }
    },
    methods: {
        submit () {
            this.submitLoading = true
            if (this.status === 3) {
                this._collect('点击重置账户')
                resetAccount()
                    .then(res => {
                        this.submitLoading = false
                        if (res.code != 0) {
                            this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                            return
                        }
                        this.$toast({
                            onClose: () => {
                                this.$router.push({ name: 'Mine' })
                            },
                            message: this.$t('setting.resetAccountSuccess', { amount: this.accInfo.initAmount })
                        })
                        this.$store.dispatch('getAccPriceInfo')
                    })
                    .catch(error => {
                        this.submitLoading = false
                        console.log(error)
                    })
            } else {
                this._collect(this.status === 1 ? '平仓成功-点击升级账户' : '平仓成功-超过余额上限-点击升级账户')
                addBonusFlowRecords({
                    amount: this.userLoginInfo.balance
                })
                    .then(res => {
                        this.submitLoading = false
                        if (res.code != 0) {
                            this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                            return
                        }
                        this.$router.push({ name: 'UpgradeAccount' })
                        this.cancel()
                    })
                    .catch(error => {
                        this.submitLoading = false
                        this.cancel()
                        console.log(error)
                    })
            }
        },
        opened () {
            this.balance = moneyAccuracy(this.userLoginInfo.balance, false)
            if (Number(this.info.totalprofit) > 0) {
                this.initLottie()
            }
        },
        initLottie () {
            lottie.loadAnimation({
                container: document.querySelector('.m-bonusNews .animate'), // Required
                // path: 'upgrading_anim.json', // Required
                path: '/animJson/sellGold.json', // Required
                renderer: 'svg', // Required
                loop: false, // Optional
                autoplay: true, // Optional
            })
        },
        cancel () {
            this._collect('平仓成功-点击再多赚点')
            this.$emit('update:show', false)
        },
        close (status) {
            if (status === 2) {
                this.$dialog
                    .confirm({
                        title: '',
                        message: this.$t('activity.cancelOutBalance'),
                        confirmButtonText: this.activateTime ? this.$t('activity.receive') : this.$t('activity.upgradeAccount2'),
                        cancelButtonText: this.$t('activity.cancelBalance'),
                        cancelButtonColor: '#666'
                    })
                    .then(() => {
                        // on confirm
                        this.submit()
                        this.$emit('update:show', false)
                    })
                    .catch(() => {
                        // on cancel
                        // const baseData = this.$store.state.ix_user.info.toKenCompanyInfoVo || {}
                        this.$emit('update:show', false)
                        resetmaxAmountToAccount({
                            priceRecordReadyId: this.$route.params.id
                        })
                            .then(res => {
                                if (res.code != 0) {
                                    this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                                }
                                this.$store.dispatch('getAccPriceInfo')
                            })
                            .catch(error => {
                            })
                    })
            } else {
                this.$emit('update:show', false)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@m/sass/mixin.scss';
.m-bonusNews {
    width: rem(610px);
    border-radius: 0 0 rem(10px) rem(10px);
    overflow: hidden;
    .item-1 {
        position: relative;
        width: 100%;
        height: rem(300px);
        img {
            width: 100%;
            height: auto;
        }
        .close {
            position: absolute;
            right: 0;
            top: rem(160px);
            width: rem(80px);
            line-height: rem(60px);
            text-align: center;
            height: rem(60px);
            i {
                color: #fff;
                font-size: rem(34px);
            }
        }
    }
    .item-2 {
        position: relative;
        text-align: center;
        margin-bottom: rem(-90px);
        .img {
            display: inline-block;
            width: rem(181px);
            height: rem(181px);
            img {
                width: 100%;
                height: 100%;
                text-align: ce;
            }
        }
        .close {
            position: absolute;
            right: 0;
            bottom: 0;
            width: rem(80px);
            line-height: rem(100px);
            text-align: center;
            height: rem(100px);
            i {
                color: #20212a;
                font-size: rem(34px);
            }
        }
    }
    .item-3 {
        background-color: #fff;
        text-align: center;
        color: #333333;
        padding-bottom: rem(70px);
        .title {
            padding-top: rem(50px);
            font-size: rem(38px);
        }
        .sub {
            font-size: rem(28px);
            padding: 0 rem(40px);
            .status-A {
                color: #f39801;
            }
            .status-B {
                color: #477fd3;
            }
        }
        .content {
            .data-1 {
                width: rem(420px);
                height: rem(140px);
                background-image: url('./images/bg_1.png');
                background-size: contain;
                margin: rem(57px) auto rem(40px);
                overflow: hidden;
                .info {
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
            .data-2 {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 0 rem(40px);
                margin-bottom: rem(40px);
                .item {
                    width: rem(220px);
                    height: rem(170px);
                    padding: rem(20px);
                    text-align: center;
                    font-size: rem(20px);
                    background-size: cover;
                    .number {
                        font-size: rem(60px);
                    }
                    &.item-1 {
                        color: #c0843c;
                        background-image: url('./images/bg_3.png');
                    }
                    &.item-2 {
                        color: #c06b3c;
                        background-image: url('./images/bg_4.png');
                    }
                }
                .icon {
                    margin: 0 rem(22px);
                    line-height: rem(170px);
                    flex: 1;
                    text-align: center;
                    i {
                        font-size: rem(30px);
                        font-weight: bold;
                        color: #c06b3c;
                    }
                }
            }
        }
    }
    .animate{
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .dialog-footer {
        width: 100%;
        button {
            border-radius: 0 0 0 rem(10px);
            .sub {
                font-size: rem(20px);
                padding-top: rem(5px);
                line-height: 1.5;
            }
            &:nth-of-type(2) {
                border-radius: 0 0 rem(10px) 0;
            }
        }
    }
    &.status3 {
        .item-3 {
            border-radius: rem(10px) rem(10px) 0 0;
            .title {
                padding-top: rem(90px);
            }
            .content {
                .data-1 {
                    background-image: url('./images/bg_2.png');
                    span {
                        color: #e4535d;
                    }
                }
            }
        }
    }
}
</style>
