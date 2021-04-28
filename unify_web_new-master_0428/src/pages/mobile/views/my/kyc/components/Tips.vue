<template>
    <van-dialog
        :cancel-button-text='dialogInfo.cancelText'
        :confirm-button-text='dialogInfo.confirmText'
        :show-cancel-button='dialogInfo.showConfirm'
        :show-confirm-button='dialogInfo.showCancel'
        :title="$t('tip')"
        :value='show'
        @cancel='cancel'
        @confirm='confirm'
    >
        <div class='tipContent'>
            <div class='icon'>
                <van-loading v-if='status===1' class='loading' color='#477fd3' size='20' />
                <SuccessAnimation v-else-if='status===4' />
            </div>
            <div>{{ $t('payInfo.tip_'+status,{ info:errorInfo }) }}</div>
        </div>
    </van-dialog>
</template>

<script>
import SuccessAnimation from '@m/components/successAnimation'
import { gotoOnlineService } from '@/utils/funds/index'
export default {
    name: 'Tips',
    components: {
        SuccessAnimation,
    },
    props: {
        status: {
            type: Number, // 1、提交中 2、超时 3、失败 4、成功
            default: 1
        },
        errorInfo: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            timeOutSumbitNum: 1,
            timeOutSubmitMax: 2, // 超时重试次数
            failSumbitNum: 1,
            failSubmitMax: 1, // 失败重试次数

            timer: null
        }
    },
    computed: {
        dialogInfo () {
            if (this.status === 1 || this.status === 4) {
                return {
                    showConfirm: false,
                    showCancel: false
                }
            } else if (this.status === 2) {
                if (this.timeOutSumbitNum < this.timeOutSubmitMax) {
                    return {
                        showConfirm: true,
                        confirmText: this.$t('payInfo.retry'),
                        showCancel: true,
                        cancelText: this.$t('payInfo.back')
                    }
                } else {
                    return {
                        showConfirm: true,
                        confirmText: this.$t('linkService'),
                        showCancel: true,
                        cancelText: this.$t('payInfo.back')
                    }
                }
            } else if (this.status === 3) {
                if (this.failSumbitNum < this.failSubmitMax) {
                    return {
                        showConfirm: true,
                        confirmText: this.$t('linkService'),
                        showCancel: false,
                        cancelText: this.$t('payInfo.reInput')
                    }
                } else {
                    return {
                        showConfirm: true,
                        confirmText: this.$t('linkService'),
                        showCancel: true,
                        cancelText: this.$t('payInfo.back')
                    }
                }
            } else {
                return {}
            }
        },
        onlineService () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
    },
    methods: {
        confirm () {
            if (this.status === 2) {
                if (this.timeOutSumbitNum < this.timeOutSubmitMax) {
                    this.timeOutSumbitNum += 1
                    this.$emit('update:show', false)
                    this.$emit('retry')
                } else {
                    gotoOnlineService(this.$router)
                    this.$emit('update:show', false)
                }
            } else if (this.status === 3) {
                gotoOnlineService(this.$router)
                this.$emit('update:show', false)
            }
        },
        cancel () {
            // this.$router.go(-1)
            if (this.status === 3) {
                this.failSumbitNum += 1
            }
            this.$emit('update:show', false)
        },
        open () {
            // this.timeOutSumbitNum = 1
            // this.failSumbitNum = 1
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";
    .tipContent {
        padding: rem(20px);
        text-align: center;
        font-size: rem(24px);
        padding-bottom: rem(30px);
        color: #666;
        .icon {
            margin-bottom: rem(20px);
        }
        .loading{
            position: absolute;
            right: rem(20px);
            top:26px
        }
    }

</style>
