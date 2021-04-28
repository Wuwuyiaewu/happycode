<template>
    <div class='paymentDetails'>
        <div class='meta'>
            <span class='status' :class='statusClass'>
            </span>
            <span class='desc' :class='statusClass'>
                {{ statusDesc }}
            </span>
        </div>

        <div class='info'>
            <div class='title'>
                {{ $t("paymentDetails.orderInfo") }}
            </div>
            <div class='details'>
                <div v-for='(item, i) in list' :key='i' class='item'>
                    <span class='label'>
                        {{ item.label }}
                    </span>
                    <span class='value'>
                        {{ item.value }}
                    </span>
                </div>
            </div>
            <div class='btn' @click='goBack'>
                {{ $t("payInfo.back") }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { appClose } from '@m/base/appHybrid'
import { isAPP } from '@/utils/funds/index'

export default {
    data () {
        return {
            infoKeys: {
                pno: this.$t('paymentDetails.infoKeys.pno'),
                gatewayCode: this.$t('paymentDetails.infoKeys.gatewayCode'),
                amount: this.$t('paymentDetails.infoKeys.amount'),
                remark: this.$t('paymentDetails.infoKeys.remark'),
            }
        }
    },
    computed: {
        ...mapGetters(['style']),
        query () {
            return this.$route.query
        },
        list () {
            const { query, infoKeys } = this
            return ['pno', 'gatewayCode', 'amount', 'remark'].map(key => ({
                label: infoKeys[key],
                value: query[key],
            }))
        },
        statusDesc () {
            const key = 'paymentDetails.statusMap.' + this.query.status
            return this.$te(key) ? this.$t(key) : ''
        },
        statusClass () {
            return (['0', '006'].includes(this.query.status) ? 'success' : 'fail')
        },
        isPC () {
            return window['isPC']
        },
    },
    created () {

    },
    methods: {
        goBack () {
            if (isAPP) {
                appClose()
            } else if (this.isPC) {
                this.$router.push({
                    name: 'Layout'
                })
            } else {
                this.$router.push({
                    name: 'Mine'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.paymentDetails {
  width: 100%;
  background: #f9f9f9;
  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: rem(167px) 0 rem(117px) 0;
    .status {
      display: block;
      width: rem(90px);
      height: rem(90px);
      border-radius: 50%;
      &.success{
          background: url("~@m/images/success.png") center center no-repeat;
          background-size: 100% 100%;
      }
      &.fail{
          background: url("~@m/images/fail.png") center center no-repeat;
          background-size: 100% 100%;
      }
    }
    .desc {
      display: block;
      font-size: rem(34px);
      font-weight: 500;
      color: #333333;
      line-height: rem(42px);
      margin-top: rem(20px);
      &.success{
          color:#11B873;
      }
      &.fail{
          color: #E2535D
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: rem(580px);
    background: #ffffff;
    border-radius: rem(10px);
    margin: 0 auto;
    box-sizing: border-box;
    padding: rem(47px) rem(40px);
    .title {
      font-size: rem(32px);
      font-weight: 500;
      color: #333333;
      line-height: rem(34px);
    }
    .details {
      width: 100%;
      margin-top: rem(56px);
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: rem(30px) 0;
        .label {
          font-size: rem(24px);
          font-weight: 500;
          color: #989898;
        }
        .value {
          font-size: rem(24px);
          font-weight: bold;
          color: #333333;
          line-height: rem(24px);
        }
      }
    }
  }
  .btn {
    width: rem(500px);
    height: rem(80px);
    background: #477fd3;
    border-radius: 6px;
    font-size: rem(30px);
    font-weight: 500;
    color: #ffffff;
    line-height: rem(80px);
    text-align: center;
    margin-top: rem(53px);
  }
}
</style>
