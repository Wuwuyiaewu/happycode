<template>
    <van-popup
        :close-on-click-overlay='false'
        closeable
        round
        :value='isShow'
        @click-close-icon='onClose'
    >
        <div class='account-info-dialog'>
            <span class='title'>
                体验账户权益
            </span>
            <div class='item'>
                <span class='label'>
                    体验账户有多少资金？
                </span>
                <div class='desc'>
                    初始余额{{ accInfo.initAmount | moneyAccuracy(false) }}{{ symbolCode }},亏了可以<span class='primary'>
                        “重置账户”
                    </span>
                </div>
            </div>
            <div class='item'>
                <span class='label'>
                    它能做什么？
                </span>
                <div class='desc'>
                    可下单交易，交易盈利及初始余额均可转成升级奖励，最高可领
                    <span class='yellow'>
                        {{ accInfo.singleMaxGive | moneyAccuracy(false) }}{{ symbolCode }}
                    </span>
                </div>
            </div>
            <div class='item'>
                <span class='label'>
                    它的余额可以领走吗？
                </span>
                <div class='desc'>
                    通过<span class='primary'>
                        “升级账户”
                    </span>可领取体验账户全部余额
                </div>
            </div>
            <div class='item'>
                <span class='label'>
                    它的余额有上限吗
                </span>
                <div class='desc'>
                    余额上限{{ accInfo.maxAmount | moneyAccuracy(false) }}{{ symbolCode }},这意味着超过时需要<span class='primary'>
                        ”升级账户“
                    </span>保留全部余额
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapGetters(['symbolCode']),
        accInfo () {
            return this.$store.state.accInfo
        }
    },
    methods: {
        onClose () {
            this.$emit('update:isShow', false)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.van-popup {
  width: 73%;
  ::v-deep {
    .account-info-dialog {
      padding: rem(33px) rem(38px) rem(43px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: center;
      .title {
        font-size: rem(34px);
        font-weight: 500;
        color: #333333;
        line-height: rem(38px);
        text-align: center;
        margin-bottom: rem(32px);
      }
      .item {
        font-size: rem(24px);
        margin-bottom: rem(28px);
        &:last-child {
          margin-bottom: 0;
        }
        .label,
        .desc {
          padding: 0 0 0 rem(20px);
        }
        .label {
          display: block;
          position: relative;
          line-height: rem(40px);
          &:before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            display: block;
            width: rem(6px);
            height: rem(6px);
            background: #333333;
            border-radius: 100%;
            transform: translate(0, -50%);
          }
        }
        .desc {
          line-height: rem(36px);
        }
      }

      .primary{
          color: $primary
      }
      .yellow{
          color: #F39801
      }
    }
  }
}
</style>
