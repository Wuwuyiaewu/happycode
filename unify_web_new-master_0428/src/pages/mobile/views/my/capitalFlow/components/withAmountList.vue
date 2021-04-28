<template>
    <div class='detials'>
        <van-collapse v-model='activeNames' accordion>
            <van-collapse-item v-for='li in list' :key='li.pno' class='item' :name='li.pno'>
                <div slot='title' class='scroll-view-item of-1px-bottom'>
                    <div class='header'>
                        <div
                            class='header-left'
                            :class="{ 'muted':['c'].includes(li.agent_code_source),'green':['i','a','v'].includes(li.agent_code_source),'red':['r','f'].includes(li.agent_code_source) }"
                        >
                            {{ li | withrawalResultFilter }}
                        </div>
                        <div class='header-right'>
                            {{ li.pay_amount | toFixed(2) }} {{ li.pay_currency }}
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
                                {{ li.fee | toFixed(2) }}{{ ' ' + li.account_currency }}
                            </div>
                        </div>
                        <div class='body-item right'>
                            <div class='name'>
                                {{ $t('label.tixian') }}
                            </div>
                            <div class='desc'>
                                {{ li.trans_amount | toFixed(2) }}{{ ' ' + li.account_currency }}
                            </div>
                        </div>
                    </div>
                </div>
                <div slot='right-icon'></div>
                <div class='panel-content'>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.tixianStatus') }}
                        </span>
                        <span
                            :class="{ 'muted':['c'].includes(li.agent_code_source),'green':['i','a','v'].includes(li.agent_code_source),'red':['r','f'].includes(li.agent_code_source) }"
                        >
                            {{ li | withrawalResultFilter }}
                        </span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('form.title.tixianAmount') }}
                        </span>
                        <span>{{ li.trans_amount | toFixed(2) }}{{ ' ' + li.account_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('trade.fee') }}
                        </span>
                        <span>{{ li.fee | toFixed(2) }}{{ ' ' + li.account_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.lastReceipt') }}
                        </span>
                        <span>{{ li.pay_amount | toFixed(2) }}{{ ' ' + li.pay_currency }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('table.header.listNo') }}
                        </span>
                        <span>{{ li.pno }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('label.submitTime') }}
                        </span>
                        <span>{{ li.proposal_date * 1000 | dateFilter }}</span>
                    </div>
                    <div v-if="li.agent_code_source === 'c'" class='row'>
                        <span class='thLabel'>
                            {{ $t('label.cancelTime') }}
                        </span>
                        <span>{{ li.cancel_date * 1000 | dateFilter }}</span>
                    </div>
                    <div class='row'>
                        <span class='thLabel'>
                            {{ $t('form.title.remark') }}
                        </span>
                        <span>{{ li.remark || $t('wu') }}</span>
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
        proposalStatusFilter (value) {
            // 0-待确认；-1-已取消；1-待审批；-4-取款失败；2-已审批；-2-逾期 ；
            if (!value) return ''
            return i18n.t('enumeration.proposalStatus.' + value)
        },
        withrawalResultFilter (item) {
            // v-待出金；a-已出金；f-请求失败；i-待转账；c-已取消；r-已拒绝；
            if (!item || !item.proposal_status) return ''
            if (item.proposal_status === '-4') item.agent_code_source = 'f'
            return i18n.t('enumeration.withrawalResult.' + item.agent_code_source)
        },
        filterProposalStatusClsName (val) {
            // 0-待确认；-1-已取消；1-待审批；-4-取款失败；2-已审批；-2-逾期 ；
            let ClsName = ''
            switch (val) {
                case '2':
                    ClsName = 'green'
                    break
                case '0':
                case '1': {
                    ClsName = 'muted'
                    break
                }
                default: {
                    ClsName = 'red'
                    break
                }
            }
            return ClsName
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
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
@import "./list.scss";
</style>
