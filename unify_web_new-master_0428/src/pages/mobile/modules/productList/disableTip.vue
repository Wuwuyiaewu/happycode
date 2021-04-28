<template>
    <van-popup
        class='m-dialog'
        get-container='body'
        :round='true'
        :value='show'
        @click-overlay='close'
        @close='close'
        @open='open'
    >
        <div class='m-disableTip'>
            <div class='title'>
                {{ $t('tip') }}
                <div class='close' @click='close'>
                    <van-icon name='cross' />
                </div>
            </div>
            <div class='content'>
                <div class='sub'>
                    <span>“{{ $t('activity.upgradeAccount') }}”</span>{{ $t('activity.tradeMore') }}
                </div>
                <div class='img'>
                    <img alt='' src='./images/lock_bg.png' />
                </div>
            </div>
        </div>
        <div class='dialog-footer'>
            <van-button
                v-prophet="['trackEvent', '体验活动', '行情页面弹窗', '行情_升级账户', 91]"
                color='#477FD3'
                :loading='submitLoading'
                @click='submit'
            >
                {{ $t('activity.upgradeAccount') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { addBonusFlowRecords } from '@/api/mine'
export default {
    name: 'DisableTip',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            submitLoading: false
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        submit () {
            this.submitLoading = true
            this._collect('解锁产品-点击升级账户')
            addBonusFlowRecords()
                .then(res => {
                    this.close()
                    this.submitLoading = false
                    if (res.code != 0) {
                        this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                        return
                    }
                    this.$router.push({ name: 'UpgradeAccount' })
                })
                .catch(error => {
                    this.submitLoading = false
                    this.close()
                    console.log(error)
                })
        },
        open () {
            this._collect('行情-点击解锁')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@m/sass/mixin.scss';
.m-disableTip {
    width: rem(610px);
    .title {
        position: relative;
        text-align: center;
        color: #333333;
        font-size: rem(38px);
        padding: rem(45px) 0 rem(20px) 0;
         .close {
            position: absolute;
            right: 0;
            top: 0;
            width: rem(80px);
            line-height: rem(60px);
            text-align: center;
            height: rem(80px);
            padding-top: rem(20px);
            i {
                color: #20212a;
                font-size: rem(34px);
            }
        }
    }
    .content {
          text-align: center;
    }
    .sub {
        color: #333333;
        font-size: rem(30px);
        margin-bottom: rem(40px);
        span {
            color: #477FD3;
        }
    }
    .img {
        img {
            width: 100%;
            height: auto;
        }
        margin-bottom: rem(40px);
    }
}
</style>
