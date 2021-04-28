<template>
    <div class='upgrade-account'>
        <Top v-if="origin !== 'miniTrade'">
            <template #left>
                <a class='backIcon' href='javascript:void(0);' @click='goBack'>
                    <i class='icon_icon_back'></i>
                </a>
            </template>

            <span>{{ $t($route.meta.title) }}-{{ stepList[active-1].label }}</span>
        </Top>
        <div v-if="origin !== 'miniTrade'" class='placeholder'></div>
        <Steps :active='active' :list='stepList' />
        <div v-if='active === 1'>
            <CompleteInfo @complete='complete' />
        </div>
        <div v-else-if='active === 2'>
            <DepositFunds v-if='isShowDepositFunds' />
        </div>
        <div v-else-if='active === 3'>
        </div>
    </div>
</template>

<script>
import Steps from '@m/components/steps/index'
import CompleteInfo from './components/CompleteInfo'
import Top from '@m/layout/top'
import { mapGetters, mapMutations } from 'vuex'
import store from '@m/store'
import { delayAwait } from '@/utils/index'
import { resetmaxAmountToAccount } from '@/api/mine'
const DepositFunds = () => import(/* webpackChunkName: "depositFunds" */ '@m/views/my/depositFunds')

export default {
    components: {
        Steps,
        CompleteInfo,
        DepositFunds,
        Top
    },
    data () {
        return {
            stepList: [
                { label: this.$t('upgrade.addMobile'), index: 1 },
                { label: this.$t('upgrade.intoGold'), index: 2 },
                { label: this.$t('upgrade.upgradeSuccessful'), index: '✔️', iconType: 'success' },
            ],
            form: {},
            isShowDepositFunds: false
        }
    },
    computed: {
        ...mapGetters({
            isExperience: 'isExperience',
            activateTime: 'activateTime'
        }),
        active () {
            return this.$route.params.step * 1
        },
        maxAmount () {
            return this.$store.state.accInfo.maxAmount
        },
        balance () {
            return this.$store.state.ix_user.userLoginInfo.balance
        }
    },
    watch: {
        active: {
            immediate: true,
            handler (val) {
                if (val === 2 && !this.isShowDepositFunds) {
                    delayAwait(() => {
                        return store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo
                    }, true).then(() => {
                        store.dispatch('funds/getUserInfo').then(res => {
                            this.isShowDepositFunds = true
                        })
                    })
                }
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        delayAwait(() => store.state.accInfo.hasOwnProperty('maxAmount'), true)
            .then(res => {
                console.log(store.state.accInfo.maxAmount)
                if (store.state.accInfo.maxAmount > 0) {
                    next()
                } else {
                    next(false)
                }
            })
    },
    methods: {
        ...mapMutations({
            UPDATE_ACCOUNTNO: 'ix_user/UPDATE_ACCOUNTNO'
        }),
        complete (data) {
            let loading = this.$loading()

            // 手动赋值
            this.UPDATE_ACCOUNTNO()

            const params = {
                mobilePhone: data.mobilePhone,
                type: 1
            }
            this.$store.dispatch('sendUserRiskInfo', params) // 调用指纹采集接口

            this.$store.dispatch('funds/getUserInfo').then(res => {
                loading.clear()
                loading = null
                this.nextStep(2)
            })
        },
        nextStep (step) {
            this.$router.replace({
                params: {
                    step
                }
            })
        },
        // 左上角返回
        goBack () {
            if (this.isExperience && !this.activateTime) {
                let message = this.$t('upgrade.noUpgrade')
                let cancleFn = () => {
                    this.$store.dispatch('getAccPriceInfo')
                    this.$router.back()
                }
                if (this.balance > this.maxAmount) {
                    message = this.$t('upgrade.noUpgrade2')
                    cancleFn = () => {
                        const loading = this.$toast.loading({
                            forbidClick: true,
                            loadingType: 'spinner',
                            duration: 0
                        })
                        resetmaxAmountToAccount()
                            .then(res => {
                                loading.clear()
                                if (res.code !== '0') {
                                    this.$toast(res.msg || this.$t('registerInfo.network'))
                                    return
                                }
                                this.$store.dispatch('getAccPriceInfo')
                                this.$router.back()
                            })
                            .catch(error => {
                                loading.clear()
                                console.log(error)
                            })
                    }
                }
                this.$dialog
                    .confirm({
                        message: message,
                        cancelButtonText: this.$t('upgrade.giveUp'),
                        confirmButtonText: this.$t('upgrade.continueUpgrade'),
                        closeOnPopstate: false,
                    })
                    .catch(cancleFn)
            } else {
                this.$router.back()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.upgrade-account {
    display: flex;
    flex-direction: column;
    background: #fff;
    min-height: 100%;
    ::v-deep{
        .partition{
            display: none;
        }
    }
    .placeholder{
        flex: 0 0 rem(90px);
    }
}
</style>
