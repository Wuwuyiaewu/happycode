<template>
    <div class='detials'>
        <van-collapse v-model='activeNames' accordion :border='false'>
            <van-collapse-item v-for='li in list' :key='li.pno' :border='false' class='item' :name='li.pno'>
                <div slot='title' class='scroll-view-item of-1px-bottom'>
                    <div class='header'>
                        <div class='header-left' :class='getDepositStatus(li).clsName'>
                            {{ getDepositStatus(li).text }}
                        </div>
                        <div class='header-right'>
                            {{ (li.adjusted_actual_pay_amount||li.final_amount) | toFixed(2) }}{{ ' ' + li.account_currency }}
                        </div>
                    </div>
                    <div class='body'>
                        <div class='body-item left'>
                            <div class='name'>
                                {{ $t('trade.sortTime') }}
                            </div>
                            <div class='desc'>
                                {{ li.proposal_date*1000 | dateFilter }}
                            </div>
                        </div>
                        <div class='body-item'>
                            <div class='name'>
                                {{ $t('trade.fee') }}
                            </div>
                            <div class='desc'>
                                {{ li.deposit_fee | toFixed(2) }}{{ ' ' + li.account_currency }}
                            </div>
                        </div>
                        <div class='body-item right'>
                            <div class='name'>
                                {{ $t('table.header.topUp') }}
                            </div>
                            <div class='desc'>
                                {{ li.pay_amount | toFixed(2) }}{{ ' ' + li.account_currency }}
                            </div>
                        </div>
                    </div>
                </div>
                <div slot='right-icon'></div>
                <div class='panel-content'>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.rechargeStatus') }}
                        </span>
                        <span :class='getDepositStatus(li).clsName'>
                            {{ getDepositStatus(li).text }}
                        </span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.rechargeAmount') }}
                        </span>
                        <span>{{ li.pay_amount | toFixed(2) }}{{ ' ' + li.account_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('trade.fee') }}
                        </span>
                        <span>{{ li.deposit_fee | toFixed(2) }}{{ ' ' + li.account_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.actualAccount') }}
                        </span>
                        <span>{{ (li.adjusted_actual_pay_amount||li.final_amount) | toFixed(2) }}{{ ' ' + li.account_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.proposalNumber') }}
                        </span>
                        <span>{{ li.pno }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.submitTime') }}
                        </span>
                        <span>{{ li.proposal_date * 1000 | dateFilter }}</span>
                    </div>
                    <div v-if="li.proposal_status === '-1'" class='row'>
                        <span class='thLabel'>
                            {{ $t('label.cancellationTime') }}
                        </span>
                        <span>{{ li.cancel_date * 1000 | dateFilter }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.recordedTime') }}
                        </span>
                        <span>
                            <template v-if='li.approve_date'>
                                {{ li.approve_date * 1000 | dateFilter }}
                            </template>
                            <template v-else>
                                - -
                            </template>
                        </span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('form.title.remark') }}
                        </span>
                        <span>{{ li.remark || $t('label.none') }}</span>
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant'
import { toFixed } from '@/utils/calculation.js'
import { i18n } from '@m/lang'

export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
    },
    filters: {
        toFixed,
        dateFilter (value, format = 'YYYY-MM-DD HH:mm:ss') {
            if (!value) return ''
            return dayjs(Number(value)).format(format)
        },
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            activeNames: ''
        }
    },
    methods: {
        getDepositStatus (data) {
            const { pay_result, proposal_status, agent_code } = data
            // pay_result	string	支付状态 success为支付成功 ;空为未知
            // proposal_status	string	提案状态。0-待确认 ； 2-已审批 ； -1-已取消 ；1-待审批；
            // agent_code	String	入金状态，fail-失败；wait–待审核；success-成功；wait_pay-待支付；cancel-已取消；
            let clsName = ''
            let text = '- -'
            if (agent_code === 'success') {
                text = this.$t('enumeration.depositStatus.depositSuccessfully')
                clsName = 'green'
            } else if (agent_code === 'fail') {
                text = this.$t('enumeration.depositStatus.rechargeFailed')
                clsName = 'red'
            } else if (proposal_status === '-1') {
                text = this.$t('enumeration.depositStatus.cancelled')
                clsName = 'muted'
            } else if (pay_result === 'success') {
                text = this.$t('enumeration.depositStatus.underReview')
                clsName = 'green'
            } else if (!pay_result) {
                text = this.$t('enumeration.depositStatus.toBePaid')
                clsName = 'red'
            }

            return {
                text,
                clsName
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
@import "./list.scss";
</style>
