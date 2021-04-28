<template>
    <div class='with-amount' :class="platform+(isPC?' pc':'')">
        <div class='header of-1px-bottom'>
            <div class='header-left'>
                {{ $t('form.title.maxWithrawalAmount') }}
                <span class='mainColor'>
                    {{ withdrawAmount | toFixed(2) }}
                </span>
                {{ currencyUnit }}
            </div>
            <div class='header-right'>
                <router-link
                    v-prophet="['trackEvent', '我的', '出金页面', '出金_提现记录', 48]"
                    class='primary'
                    :to="{ name:'CapitalFlow',params:{ type:2 },query: { ...$route.query,platform:platform } }"
                >
                    {{ $t('label.tixianRecord') }}
                </router-link>
            </div>
        </div>
        <FormWrap ref='formWrap' :model='form' :rules='rules'>
            <FormItem prop='amount'>
                <p class='withdrawalLab'>
                    {{ $t('form.title.tixianAmount') }}({{ currencyUnit }})
                </p>
                <FormInput
                    v-model='form.amount'
                    class='amount-input'
                    clearable
                    :placeholder="$t('form.placeholder.enterAmount')"
                    @input='inputMoneyHandle'
                >
                    <div slot='append' class='takeAll' @click='takeAll'>
                        {{ $t('form.button.withrawalAll') }}
                    </div>
                </FormInput>
            </FormItem>
            <FormItem prop='bankIndex' />
        </FormWrap>

        <div class='optionsList'>
            <van-row justify='space-between' type='flex'>
                <van-col span='12'>
                    {{ $t('form.title.feeWithrawal') }}：
                </van-col>
                <van-col class='alignRgiht' span='12'>
                    <span class='mainColor'>
                        {{ fee | toFixed(2) }}
                    </span>
                    {{ currencyUnit }}
                </van-col>
            </van-row>
            <van-row justify='space-between' type='flex'>
                <van-col span='12'>
                    {{ $t('form.title.finalWithdrawal') }}：
                </van-col>
                <van-col class='alignRgiht' span='12'>
                    <span class='mainColor'>
                        {{ (form.amount - fee) | toFixed(2) }}
                    </span>
                    {{ currencyUnit }}
                </van-col>
            </van-row>

            <template>
                <!-- 预计折合 -->
                <template v-if='bankCurrency'>
                    <van-row justify='space-between' type='flex'>
                        <van-col span='12'>
                            {{ $t('form.title.amountTo') }}：
                            <van-icon name='question' @click='dialogShow' />
                        </van-col>

                        <van-col class='alignRgiht' span='12'>
                            <span class='mainColor'>
                                <i class='mainColor'>
                                    {{ transAmount }}
                                </i>
                                {{ $te('trade.'+bankCurrency)?$t('trade.'+bankCurrency):bankCurrency }}
                            </span>
                        </van-col>
                    </van-row>
                </template>
                <template v-else>
                    <CurrencySelect
                        :currency='currency'
                        :currency-val='currencyVal'
                        :is-p-c='isPC'
                        :option-list='currencyList'
                        :trans-amount='transAmount'
                        @change='confirmCurrency'
                        @dialog='dialogShow'
                        @sheet='showSheet'
                    />
                </template>
            </template>
        </div>

        <div class='header' :class="{ 'of-1px-bottom': bankList.length<=0 }">
            <div class='header-left'>
                {{ $t('form.title.selectBankPlease') }}
            </div>
        </div>
        <div class='bank-list'>
            <template v-if='bankList.length<=0'>
                <NoBankCard
                    style='margin: 0 auto'
                    :v-prophet-value="['trackEvent', '我的', '出金页面', '出金_添加银行卡', 49]"
                />
            </template>
            <template v-else>
                <van-radio-group v-model='bankSelected'>
                    <van-radio
                        v-for='(item) in bankList'
                        :key='item.id'
                        class='bank-item'
                        :class='{ active: bankSelected === item.id }'
                        :disabled="item.approve_status !== '2'"
                        icon-size='16'
                        :name='item.id'
                    >
                        <div class='bank-item-content'>
                            <div slot='icon'>
                                <span class='bank-img' :class="['bk-' + item.bank]"></span>
                            </div>
                            <div class='info'>
                                <span class='bank_name'>
                                    {{ item.bank_name }}
                                </span>
                                <p>
                                    {{ item.account_no | bankNumFilter }}
                                </p>
                            </div>
                            <!-- <span v-if="lang==='zh-CN'" class='bank-num'>
                                {{ item.account_no | bankNumFilter }}
                            </span> -->

                            <span
                                v-if="item.approve_status !== '2'"
                                class='status'
                                :class="item.approve_status==='-1'?'clear':'warning'"
                            >
                                {{ item.approve_status ==='-1'? $t('form.title.failedApproval'):$t('form.title.approvaling') }}
                            </span>
                        </div>
                    </van-radio>
                </van-radio-group>

                <div
                    v-if='userInfo.withdraw_banks.length<3'
                    v-prophet="['trackEvent', '我的', '出金页面', '出金_添加银行卡', 49]"
                    class='addBankBtn'
                    is-link
                    :title="$t('form.title.addBank')"
                    @click="$router.push({ name:'AddBank', query: $route.query, params: { canReturn: true } })"
                >
                    +{{ $t('form.title.addBank') }}
                </div>
                <div
                    v-if='userInfo.withdraw_banks.length===3'
                    class='addBankBtn'
                    is-link
                    :title="$t('form.button.checkMyBank')"
                    @click="$router.push({ name:'BankList' })"
                >
                    {{ $t('form.button.checkMyBank') }}
                </div>
            </template>
        </div>
        <div class='operation'>
            <div
                class='desc'
            >
                {{ $t('other.withdrawalServiceTime') }} {{ cashoutStartTime }} {{ $t('form.title.to') }}{{ cashoutEndTime }}
            </div>
        </div>

        <div class='submitBox'>
            <van-button
                v-prophet="['trackEvent', '我的', '出金页面', '出金_提交', 50]"
                block
                :color='style.mainColor'
                :disabled='submitDisabled'
                type='primary'
                @click='onWithAmountApply'
            >
                {{ $t('submit') }}
            </van-button>
        </div>

        <van-dialog v-model='showDialog' class='dialog' :confirm-button-text="$t('iKnow')" :title="$t('label.explain')">
            <div class='content' v-html="$t('desc.amountToDesc')"></div>
        </van-dialog>

        <!-- 出金活动提示弹窗 -->
        <van-dialog
            v-model='withdrawalActivityVisible'
            :cancel-button-text="$t('compLang.close')"
            class='dialog'
            :confirm-button-text="$t('label.goonWithdrawal')"
            show-cancel-button
            :title="$t('tip')"
            @confirm='withdrawalActivityConfirm'
        >
            <div class='content'>
                <p class='withdrawalActivityTips'>
                    {{ $t('label.withdrawalActivityTips') }}
                </p>
                <div v-for='item in withdrawalActivityList' :key='item.activityPeriods' class='withdrawalActivityItem'>
                    <p>
                        <span class='van-ellipsis activityName'>
                            {{ $t('label.yinStart') + item.activityName }}
                        </span>
                        <span>{{ $t('label.yinEnd')+$t('label.activity') }}</span>
                    </p>
                    <p
                        v-html="$t('label.withdrawalActivityTips2',[(Number(item.delBonus).toFixed(2))+$t('trade.'+currency)])"
                    ></p>
                </div>
                <p class='mtop10'>
                    {{ $t('label.withdrawalActivityMark') }}
                </p>
            </div>
        </van-dialog>

        <!-- 选择折合币种 -->
        <van-action-sheet
            v-model='currencyListVisible'
            :actions='currencyListText'
            close-on-click-action
            @select='confirmCurrency'
        />

        <!-- 出金成功弹窗 -->
        <van-popup v-model='withdrawalSuccess' class='withdrawalSuccess' :close-on-click-overlay='false'>
            <div class='content'>
                <SuccessAnimation />
                <p class='tip'>
                    {{ $t('submitSuccess') }}
                </p>
                <p class='muted'>
                    {{ $t('other.applySuccess') }}
                </p>
            </div>
            <van-button
                block
                class='closeBtn'
                :color='style.mainColor'
                type='primary'
                @click='withdrawalSuccess=false'
            >
                {{ $t('compLang.OK') }}
            </van-button>
        </van-popup>
    </div>
</template>

<script>
import '@m/sass/bankImg.scss'
import NoBankCard from '@m/components/NoBankCard'
import { getCompanyConfig } from '@/api/base/index.js'
import { getUserAuthority, getWithAmountApi, getUserStatLimit, getCompanyCurrencys } from '@/api/user/accountApi'
import { withAmountApi, withdrawRate } from '@/api/user/funds'
import { debounce } from '@/utils/funds/index'
import { mapGetters, mapState, mapActions } from 'vuex'
import { Field, RadioGroup, Radio, ActionSheet } from 'vant'
import dayjs from 'dayjs'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import { localSet, localGet, getBLen } from '@/utils/index'
import SuccessAnimation from '@m/components/successAnimation'
import CurrencySelect from '@m/components/currencySelect'
import { toFixed } from '@/utils/calculation'
import { isAPP, appGoCS, appClose } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
import { i18n } from '@m/lang'

export default {
    name: 'WithAmount',
    components: {
        NoBankCard,
        [Field.name]: Field,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [ActionSheet.name]: ActionSheet,
        FormWrap,
        FormItem,
        SuccessAnimation,
        FormInput,
        CurrencySelect
    },
    mixins: [pcMixin],
    filters: {
        toFixed,
    },
    data () {
        const amountValidator = (rule, value, callback) => {
            if (value > this.withdrawAmount) {
                callback(this.$t('other.outOfMaxAmount'))
            } else {
                callback()
            }
        }
        return {
            withdrawAmount: 0, // 提现金额
            transAmount: '0.00',
            fee: 0,
            cashoutStartTime: '',
            cashoutEndTime: '',
            disabled: '',
            bankSelected: '', // 选择列表银行卡索引
            showDialog: false,
            withdrawalActivityVisible: false,
            withdrawalActivityList: [],
            form: {
                amount: ''
            },
            rules: {
                amount: [
                    { required: true, message: this.$t('other.withrawalAmountError'), trigger: 'input' },
                    // { min: 0, max: this.withdrawAmount, message: '长度在 3 到 5 个字符', trigger: 'input' }
                    { validator: amountValidator, trigger: 'input' }
                ],
                bankSelected: [
                    { required: true, message: this.$t('form.title.selectBankPlease'), trigger: 'input' },
                ]
            },
            currencyList: [],
            currencyVal: '',
            currencyListVisible: false,
            submitLoading: false,
            withdrawalSuccess: false,
        }
    },
    computed: {
        ...mapState(['userStatus']),
        ...mapState({
            groupGet: (state) => state.ix_user.groupGet
        }),
        ...mapGetters(['style']),
        ...mapGetters('funds', ['getNewAccount']),
        size () {
            return 'normal'
        },
        lang () {
            return this.$store.getters.companyInfo?.transBaseConfigVo?.language
        },
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        bankList () {
            const banks = this.userInfo.withdraw_banks || []
            const successArr = []
            const failedArr = []
            const undoArr = []
            banks.forEach(el => {
                if (parseInt(el.approve_status) === 2) {
                    successArr.push(el)
                } else if (parseInt(el.approve_status) === -1) {
                    failedArr.push(el)
                } else {
                    undoArr.push(el)
                }
            })
            return successArr.concat(undoArr).concat(failedArr)
        },
        bankNameClass: function () {
            return {
                'text-danger': this.error && this.error.type === 'fatal'
            }
        },
        // accountInfo () {
        //     return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        // },
        currency () {
            return this.getNewAccount.currency || 'USD'
        },
        currencyUnit () {
            const units = {
                'USD': this.$t('form.title.usDollar'),
                'CNY': this.$t('form.title.yuan'),
                USDT: 'USDT'
            }
            return units[this.currency] || units['USD']
        },
        currencyListText () {
            return this.currencyList.map(el => ({ name: this.$te('trade.' + el) ? this.$t('trade.' + el) : el }))
        },
        submitDisabled () {
            return !this.form.amount || this.submitLoading || !this.bankSelected || this.disabled
        },
        platform () {
            return this.$route.name === 'MT4WithAmount' ? 'mt4' : 'ix'
        },
        bankCurrency () {
            return (this.bankList.find(e => e.id === this.bankSelected) || {}).currency || ''
        }
    },
    watch: {
        getNewAccount: {
            immediate: true,
            handler (val) {
                if (val && val.id) {
                    this.getWithAmount()
                    this.getConfigHandle()
                }
            }
        }
    },
    mounted () {
        this.init()
        this._getCompanyCurrencys()
        window['withrawal'] = this
    },
    methods: {
        ...mapActions(['getUserStatus']),
        init () {
            const info = this.userInfo
            const bankList = this.bankList
            const withdrawalBankId = localGet('withdrawalBankId')
            if (withdrawalBankId && bankList.find(el => el.id == withdrawalBankId)) {
                this.bankSelected = Number(withdrawalBankId)
            } else if (bankList.length > 0) {
                this.bankSelected = bankList[0].id
            }
            this.queryUserStatus()
        },
        dialogShow () {
            this.showDialog = true
        },
        showSheet () {
            this.currencyListVisible = this.currencyList.length !== 2
        },
        // 获取用户文件审核状态
        queryUserStatus () {
            this.getUserStatus().then(res => {
                if (res.code === 1) {
                    const data = res.data
                    if (data.idDocumentStatus === '3' || data.bankInfoStatus == '3') {
                        let bankInfoRejectedReason = ''
                        let idDocumentRejectedReason = ''
                        // 认证失败
                        if (data.bankInfoRejectedReason && data.bankInfoStatus == '3') bankInfoRejectedReason = `“${data.bankInfoRejectedReason}”`
                        if (data.idDocumentRejectedReason && data.idDocumentStatus == '3') idDocumentRejectedReason = `“${data.idDocumentRejectedReason}”`
                        let msg = bankInfoRejectedReason || idDocumentRejectedReason
                        if (bankInfoRejectedReason && idDocumentRejectedReason) msg = idDocumentRejectedReason + ` ${this.$t('ji')} ` + bankInfoRejectedReason
                        const message = this.$t('label.authenticatError', [msg])
                        this.isPC ? this.dialogGoAuthenticat(message, null, 1) : this.dialogGoAuthenticat(message, null)
                        // this.dialogGoAuthenticat(message, null, 1)
                    } else if (data.idDocumentStatus == '0' || data.bankInfoStatus == '0') {
                        // 未认证
                        //  this.dialogGoAuthenticat(this.$t('label.authenticatTip'), 0, 1)
                        this.isPC ? this.dialogGoAuthenticat(this.$t('label.authenticatTip'), 0, 1) : this.dialogGoAuthenticat(this.$t('label.authenticatTip'), 0)
                    } else if (data.idDocumentStatus === '1' && data.bankInfoStatus == '1') {
                        // 已认证
                    } else {
                        // 认证中
                        this.dialogAuthenticating(this.$t('label.authenticating'))
                    }
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        // 去认证弹窗， 重新认证弹窗
        dialogGoAuthenticat (message, type, unauthorized) {
            this.$dialog.confirm({
                title: this.$t('tip'),
                message: message,
                showCancelButton: unauthorized,
                cancelButtonText: this.$t('label.noWithdrawal'),
                confirmButtonText: this.$t(type === 0 ? 'label.goAuthenticate' : 'label.reAuthenticate'),
                cancelButtonText: this.$t('label.noWithdrawal'),
                closeOnPopstate: true,
            }).then(() => {
                this.$router.replace({ name: 'Authentication' })
            }).catch(() => {
                if (this.$store.state.inApp) {
                    appClose()
                } else {
                    unauthorized ? this.$router.replace({ name: 'Layout' }) : this.$router.back()
                }
            })
        },
        // 认证中
        dialogAuthenticating (message) {
            this.$dialog.confirm({
                title: this.$t('tip'),
                message: message,
                confirmButtonText: this.$t('linkService'),
                closeOnPopstate: true,
                cancelButtonText: this.$t('compLang.OK'),
                beforeClose: (action, done) => {
                    //   console.log('action',action)
                    if (action === 'confirm' && this.isPC) {
                        done(false)
                        this.goLiveService()
                    } else {
                        done()
                    }
                }
            }).then(() => {
                this.goLiveService()
            }).catch(() => {
                if (this.$store.state.inApp) {
                    appClose()
                } else {
                    this.$router.back()
                }
            })
        },
        // 获取可提现金额
        getWithAmount () {
            if (!this.getNewAccount.id) {
                return
            }
            getWithAmountApi({
                account_id: this.getNewAccount.id,
                platform: this.platform
            }).then(res => {
                if (res.check()) {
                    this.withdrawAmount = res.data.withdraw_amount
                } else {
                    res.toast()
                }
            })
        },

        // 全部提取
        takeAll () {
            this.form.amount = this.withdrawAmount
            this.computedRate(this.form.amount)
            // this.getCNYAmount(this.form.amount)
        },
        inputMoneyHandle: debounce(function () {
            if (this.withdrawAmount < 0) {
                this.form.amount = 0
                return
            }
            if (isNaN(this.form.amount * 1)) {
                this.form.amount = ''
                return
            }
            this.computedRate(this.form.amount)
            // this.getCNYAmount(this.form.amount)
        }, 300),
        // 计算手续费
        computedRate (money) {
            if (money <= 0) {
                this.fee = 0
                this.transAmount = '0.00'
                return
            }
            const dest = this.bankCurrency || this.currencyVal || 'USD'

            withdrawRate(
                {
                    amount: money,
                    src: this.currency,
                    dest: dest,
                    platform: this.platform
                }
            ).then(res => {
                if (res.code === 1) {
                    this.fee = res.data.fee
                    this.transAmount = res.data.final_amount.toFixed(2)
                } else {
                    this.fee = 0
                    this.transAmount = '0.00'
                    this.$toast(res.msg || res.message)
                }
            }).catch((err) => {
                this.fee = 0
                this.transAmount = '0.00'
                this.$toast(this.$t('other.ErrorRateReEnter'))
            })
        },

        getConfigHandle () {
            getCompanyConfig('cashoutSetting').then(res => {
                if (res.code === 1) {
                    const data = res.data
                    this.cashoutStartTime = data.cashoutStartTime.value
                    this.cashoutEndTime = data.cashoutEndTime.value

                    const cur = dayjs().format('YYYY-MM-DD HH:mm:ss')
                    const curDate = dayjs().format('YYYY-MM-DD')
                    var before = dayjs(cur).isBefore(curDate + ' ' + this.cashoutStartTime)
                    var after = dayjs(cur).isAfter(curDate + ' ' + this.cashoutEndTime)
                    if ([0, 6].includes(dayjs().day())) {
                        // 周末一律不能取款
                        this.disabled = true
                        return
                    }

                    if (before || after) {
                        this.disabled = true
                    } else {
                        this.disabled = false
                    }
                }
            })
        },
        // 出金申请
        onWithAmountApply () {
            this.$refs.formWrap.validate()
                .then(() => {
                    if (!this.transAmount || this.transAmount <= 0) {
                        this.$toast(this.$t('other.withrawalAmountError'))
                        return
                    } else if (!this.bankCurrency && !this.currencyVal && (this.currency != 'CNY' && this.currencyList.length > 1)) {
                        this.$alert(this.$t('other.checkInBankCurrency'))
                        return
                    } else if (!this.bankSelected) {
                        this.$toast(this.$t('form.title.selectBankPlease'))
                        return
                    }

                    this._getUserStatLimit()
                })
                .catch(({ errors, fields }) => {
                    this.$toast(this.$t(errors[0].message))
                })
        },
        _withAmount () {
            const bank = this.bankList.find(item => item.id === this.bankSelected)
            this.$toast.loading(this.$t('other.applying') + '...', 10000)
            this.submitLoading = true
            withAmountApi({
                bank: bank.bank,
                account_name: bank.account_name,
                account_no: bank.account_no,
                trans_amount: this.form.amount,
                trans_currency: this.bankCurrency || this.currencyVal || this.currency,
                platform: this.platform
            }, this.$store).then(res => {
                if (res.check()) {
                    this.withdrawalSuccess = true
                    localSet('withdrawalBankId', bank.id)
                    this.reset()
                } else {
                    if (['ERROR_80024'].includes(res.msgCode)) {
                        let msg = res.msg || res.errMsg || res.message
                        if (i18n.te('retMsg.' + res.msgCode)) {
                            msg = i18n.t('retMsg.' + res.msgCode, res.data.concat(this.currency))
                        }
                        this.$dialog.alert({
                            title: i18n.t('tip'),
                            message: msg,
                            confirmButtonText: i18n.t('compLang.OK'),
                        })
                    } else {
                        res.alert()
                    }
                }
            }).finally(() => {
                this.submitLoading = false
                this.$toast.clear()
            })
        },
        // 重置数据
        reset () {
            this.transAmount = '0.00'
            this.fee = 0
            this.form.amount = ''
            this.bankSelected = ''
            this.getWithAmount()
        },
        // 获取用户活动信息
        _getUserStatLimit () {
            this.submitLoading = true
            if (this.platform === 'mt4') {
                return this._withAmount()
            }
            getUserStatLimit().then(res => {
                this.submitLoading = false
                // res.data = [{ activityName: '解析消耗的时间解析消耗的时间解析消耗的时间解析消耗的时间', delBonus: '222', activityPeriods: Date.now() }]
                if (res.code === 1 && res.data && res.data.length) {
                    this.withdrawalActivityList = res.data
                    this.withdrawalActivityVisible = true
                    return
                }
                this._withAmount()
            }).catch(error => {
                this.submitLoading = false
                this._withAmount()
            })
        },
        // 继续提现
        withdrawalActivityConfirm () {
            this._withAmount()
        },
        // 选择币种
        confirmCurrency (val, i) {
            this.currencyVal = this.currencyList[i]
            this.computedRate(this.form.amount)
            localSet('withdrawalcurrencyVal', this.currencyVal)
        },
        // 联系客服
        goLiveService () {
            if (this.$store.state.inApp) {
                appClose()
                appGoCS()
            } else {
                const onlineService = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService

                if (this.isPC) {
                    // debugger
                    window.open(onlineService, '_blank')
                } else {
                    this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: onlineService, title: this.$t('linkService') } })
                }
            }
        },
        // 获取公司支持汇率币种
        _getCompanyCurrencys () {
            return getCompanyCurrencys().then(res => {
                if (res.code === 1) {
                    this.currencyList = res.data.target_currency_list

                    if (this.currency === 'CNY') {
                        this.currencyVal = 'CNY'
                    } else if (this.currencyList.includes(localGet('withdrawalcurrencyVal'))) {
                        this.currencyVal = localGet('withdrawalcurrencyVal')
                    } else if (this.currencyList.length === 2) {
                        this.currencyVal = this.currencyList.find(el => el !== this.currency)
                    }
                }
            })
        },

        // getCNYAmount (money) {
        //     if (money <= 0) {
        //         return
        //     }

        //     this.isBeingCNYAmount = true
        //     withdrawRate(
        //         {
        //             amount: money,
        //             src: this.currency,
        //             dest: 'CNY',
        //             platform: this.platform
        //         }
        //     ).then(res => {
        //         if (res.code === 1) {
        //             this.CNYAmount = res.data.final_amount.toFixed(2)
        //         } else {
        //             this.CNYAmount = 0
        //         }
        //         this.isBeingCNYAmount = false
        //     }).catch((err) => {
        //         this.CNYAmount = 0
        //         this.isBeingCNYAmount = false
        //     })
        // }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.with-amount {
    position: relative;
    margin-top: 1px;
    padding-bottom: rem(100px);
    min-height: 100%;
    background: #ffffff;
    &.pc{
            padding-bottom: 64px;
            .header{
                &::after{
                        border-bottom-width: 0;
                }
            }
        .submitBox {
            position: absolute;
            left: 20px;
            right: 20px;
            width: initial;
            bottom: 20px;
            .van-button{
                border-radius: 2px;
            }
        }
    }
    &.mt4 {
        // padding-top: rem(100px);
    }

    .station {
        background-color: $login-bg-color;
    }
    .van-icon-arrow-down {
        vertical-align: middle;
        line-height: 1.1;
    }
    .header {
        padding: rem(19px) rem(30px);
        display: flex;
        font-size: rem(28px);

        .header-left {
            flex: 1;
        }

        .header-right {
            text-align: right;
            &.red {
                color: $color-red;
            }

            .primary {
                color: $primary;
            }
        }
    }
    .amount-input {
        ::v-deep {
            .label,
            .input {
                font-size: rem(40px) !important;
            }
        }
    }
    .takeAll {
        color: $primary;
        font-size: rem(28px);
    }
    .withdrawalLab {
        padding: rem(30px) rem(30px) 0;
        margin-bottom: rem(-15px);
        font-size: rem(28px);
        position: relative;
        z-index: 1;
    }
    .optionsList {
        line-height: 2.4;
        color: $text;
        padding: rem(30px) rem(30px);
        border-bottom: rem(20px) solid #f9f9f9;
        .van-icon-question {
            color: #d0d0d0;
            margin-left: rem(-10px);
            font-size: rem(28px);
            vertical-align: middle;
        }
        .estimated-currency {
            position: relative;
            .van-col {
                width: auto;
                float: none;
                &:first-child {
                    white-space: nowrap;
                }
            }
        }
    }

    .bank-list {
        padding: 0 rem(28px);
        box-sizing: border-box;
        ::v-deep {
            .van-radio {
                box-sizing: border-box;
                padding: rem(32px) rem(50px);
                margin: rem(10px) 0 rem(30px);
                .van-radio__label {
                    width: 100%;
                    height: 100%;
                }
                &.van-radio--disabled.bank-item {
                    opacity: 0.6;
                }
            }
        }
        .bank-item {
            position: relative;
            border: solid 1px #d9d9d9;
            border-radius: rem(5px);
            &:last-child.van-radio {
                margin: 0;
            }
            &.active {
                border-color: $primary;
            }
            .bank-item-content {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                white-space: nowrap;
                .info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    padding-left: rem(20px);
                    .account_name {
                        font-size: rem(22px);
                    }
                }
                .bank-num {
                    flex: 1;
                    text-align: right;
                    color: #000;
                    font-weight: bold;
                }

                .status {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0 rem(5px);
                    font-size: rem(20px);
                    color: #fff;
                    &.warning {
                        background-color: #f39800;
                    }
                    &.clear {
                        background-color: #ef5762;
                    }
                }
            }
        }
    }

    .operation {
        margin-top: rem(10px);
        padding: 0 rem(30px);
        .confirm-btn {
            width: 100%;
            font-size: rem(36px);
            height: 1.33333rem;
            line-height: 1.33333rem;
        }
        .desc {
            padding: rem(20px);
            font-size: rem(24px);
            text-align: center;
            line-height: rem(28px);
            color: #ccc;
            margin-bottom: rem(30px);
        }
    }
    .dialog {
        will-change: transform;
        .content {
            padding: rem(30px) rem(30px);
            font-size: rem(26px);
            text-align: center;
        }
        .withdrawalActivityItem {
            padding-top: rem(36px);
            span {
                vertical-align: middle;
            }
            .activityName {
                display: inline-block;
                max-width: 80%;
            }
        }
    }
    .addBankBtn {
        padding: 10px;
        text-align: center;
        color: $primary;
        border-bottom: 1px solid #ebedf0;
    }

    .submitBox {
        position: fixed;
        z-index: 1;
        left: 0;
        bottom: 0;
        width: 100%;
        .van-button {
            // height: rem(100px);
            font-size: rem(30px);
            border: 0;
        }
    }
}
.withdrawalSuccess {
    min-width: rem(640px);
    max-width: 80%;
    border-radius: rem(10px);
    padding: rem(40px);
    text-align: center;
    .content {
        margin-bottom: rem(40px);
    }
    .tip {
        padding: rem(20px) 0;
    }
    .closeBtn {
        height: rem(80px);
    }
}
</style>
