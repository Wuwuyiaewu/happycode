<template>
    <div v-if='!isLoading' class='deposit-funds' :class="platform+(isPC?' pc':'')">
        <div class='partition'></div>
        <!-- <div v-if='experienceGive.num>0 && !depositTick' class='real-gold-activities'>
            <div class='activities-text'>
                {{ $t('activity.depositTipA') }}{{ experienceGive.num }}{{ experienceGive.unit }}，{{ $t('activity.depositTipB') }}{{ tipAmount }}{{ experienceGive.unit }}{{ $t('activity.depositTipC') }}
            </div>
        </div> -->
        <template v-if='isExperience && experienceGive.num > 0 && !depositTick'>
            <div v-if='!activateTime' class='upgrade-give'>
                <span>{{ $t('upgrade.upgradeGive', { num: experienceGive.num, unit:experienceGive.unit, tipAmount: tipAmount }) }}</span>
            </div>
            <div v-else-if='activateTime' class='upgrade-give'>
                <span>{{ $t('upgrade.upgradeGive1', { num: experienceGive.num, unit:experienceGive.unit, tipAmount: tipAmount }) }}</span>
            </div>
        </template>

        <div class='header'>
            <div class='header-left'>
                {{ $t("form.placeholder.pleaseSelectTheRechargeAmount") }}
            </div>
            <div class='header-right'>
                <router-link
                    v-prophet="['trackEvent', '我的', '入金页面', '入金_充值记录', 45]"
                    class='detailed'
                    :to="{ name: 'CapitalFlow', params: { type: 1 }, query: { ...$route.query, platform: platform } }"
                >
                    {{ $t("label.rechargeRecord") }}
                </router-link>
            </div>
        </div>

        <div class='money-body'>
            <div
                v-for='(m,index) in money'
                :key='m'
                class='money-body-item'
                :class="{ 'active':index===moneyIndex }"
                @click='selectMoneyHandle(m,index)'
            >
                {{ m===OTHER ? m : m + currencyUnit }}
                <van-icon v-show='index===moneyIndex' class='icon' color='#fff' name='success' />
            </div>
        </div>
        <div v-show='otherMoneyStatus' class='input-price'>
            <FormWrap ref='formWrap' :model='form' :rules='rules'>
                <FormItem prop='amount'>
                    <FormInput
                        ref='amountInput'
                        v-model.trim='form.amount'
                        :label="`${$t('form.title.otherAmounts')}`"
                        :placeholder="$t('form.placeholder.pleaseEnterAnotherAmount')"
                        @input='inputMoneyHandle'
                    >
                        <span slot='append' class='currency'>
                            {{ currencyUnit }}
                        </span>
                    </FormInput>
                </FormItem>
                <FormItem prop='bankIndex' />
            </FormWrap>
        </div>
        <div v-if='currency !== payCurrency' class='expected'>
            <span>
                {{ $t('form.title.expectedToBeEquivalentToRmb') }}：
            </span>
            <span v-if='!depositRateCache.loading' class='rmb-price'>
                {{ trans_amount | toFixed(2) }}
            </span>
            <van-loading v-else type='spinner' />
            <span>{{ payCurrency }}</span>
        </div>
        <div class='partition'></div>
        <div class='bank-header' :class="{ 'of-1px-bottom': bankList.length<=0 }">
            <div class='header-left'>
                {{ $t('form.placeholder.pleaseSelectRechargeChannel') }}
            </div>
        </div>
        <div class='bank-body'>
            <NoData v-if='bankList.length<=0' :name="$t('other.noRechargeChannel')" />
            <template v-else>
                <van-radio-group v-model='form.bankIndex' @change='onChangBankIndexHandle'>
                    <template
                        v-for='(item) in computedBankList'
                    >
                        <div :key='item.gateway_code' class='bank-item'>
                            <van-radio
                                :class="{ 'active':form.bankIndex===item.gateway_code }"
                                icon-size='16'
                                :name='item.gateway_code'
                            >
                                <div class='bank-item-content'>
                                    <i v-show='item.gateway_code' class='icon' :class='item.gateway_code'></i>
                                    {{ item.gateway_name }}
                                    <i
                                        v-show='!item.gateway_code'
                                        class='icon icon1'
                                        :class='item.gateway_code'
                                    ></i>
                                    <span
                                        class='gateway-name'
                                    >
                                        {{ $te('enumeration.gateway.' + item.gateway_code) ? $t('enumeration.gateway.' + item.gateway_code) : item.gateway_code }}
                                    </span>
                                </div>
                            </van-radio>
                            <div
                                v-if="form.bankIndex === 'help2pay' && item.gateway_code === 'help2pay' && help2payList.length > 1 && !help2payMatchUserCurrency"
                                class='allHelp2pay'
                            >
                                <van-radio-group v-model='form.help2payCode' style @change='onChangehelp2payCode'>
                                    <div
                                        v-for='pay in help2payList'
                                        :key='pay.gateway_code'
                                        class='item van-hairline--top'
                                        @click='form.help2payCode = pay.gateway_code'
                                    >
                                        <van-radio icon-size='16' :name='pay.gateway_code'>
                                            <span class='label'>
                                                {{ pay.pay_currency }}
                                            </span>
                                        </van-radio>
                                    </div>
                                </van-radio-group>
                            </div>
                        </div>
                    </template>
                </van-radio-group>
            </template>
        </div>
        <div class='submitBox'>
            <van-button
                v-if='form.bankIndex==="help2pay"'
                v-prophet="['trackEvent', '我的', '入金页面', '入金_提交', 47]"
                class='confirm-btn'
                :disabled='disabled || submitDisabled'
                type='primary'
                @click='gotoSelectBank'
                @click.native="_collect('入金',true)"
            >
                {{ $t('form.button.topUpNow') }}
            </van-button>
            <van-button
                v-else-if='otcNext || toKyc'
                v-prophet="['trackEvent', '我的', '入金页面', '入金_下一步', 46]"
                class='confirm-btn'
                :disabled='disabled || submitDisabled'
                type='primary'
                @click='nextStep'
                @click.native="_collect('入金下一步',true)"
            >
                {{ $t('form.button.topUpNow') }}
            </van-button>
            <van-button
                v-else
                v-prophet="['trackEvent', '我的', '入金页面', '入金_提交', 47]"
                class='confirm-btn'
                :disabled='disabled || submitDisabled'
                type='primary'
                @click='rechargeHandle'
                @click.native="_collect('入金',true)"
            >
                {{ $t('form.button.topUpNow') }}
            </van-button>
        </div>
        <div
            v-if='isCashinLimit'
            class='deposit-time'
        >
            {{ $t('form.title.rechargeServiceTime') }}{{ cashinStartTime }} {{ $t('form.title.to') }} {{ cashinEndTime }}
        </div>
        <TokesTip :content='tokesTip.data' :show.sync='tokesTip.show' />
        <Upgrading v-if='upgradeEndTime' :end-time='upgradeEndTime' />
    </div>
</template>

<script>
import NoData from '@m/components/NoData/NoData'
import TokesTip from './TokesTip'
import Upgrading from '@m/components/upgrading'
import { getCompanyConfig } from '@/api/base/index.js'
import { depositApply, ivDepositApply, depositRate, getDepostChannelList, getDepostChannelListNew, getDepositOrder, getDepostChannelConfig, paymentApply } from '@/api/user/funds'
import { debounce, isAPP, isFakeAPP, appOpenBrower, getCallbackUrl, isPC, gotoOnlineService, sessionSet, sessionGet, sessionRemove } from '@/utils/funds/index'
import { getUserAuthority } from '@/api/user/accountApi'
import { i18n } from '@m/lang'
import { mapGetters, mapActions, mapState } from 'vuex'
import dayjs from 'dayjs'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import { toFixed, divide } from '@/utils/calculation'
import { getPriceRecordReady } from '@/api/mine'
import { RadioGroup, Radio } from 'vant'
import pcMixin from '@m/mixins/pc'
import { appClose } from '@m/base/appHybrid'
import { configSystem } from '@/api/base'
import { AREACODEMAP, COUNTRTOAREACODE } from '@/utils/funds/constant.js'

const OTHER = i18n.t('form.title.otherAmounts')

export default {
    name: 'DepositFunds',
    components: {
        NoData,
        TokesTip,
        FormWrap,
        FormItem,
        FormInput,
        Upgrading,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
    mixins: [pcMixin],
    filters: {
        toFixed,
    },
    data () {
        const amountValidator = (rule, value, callback) => {
            const bank = this.bankList.find(({ gateway_code }) => gateway_code === this.form.bankIndex)
            let { min_payamount, max_payamount } = bank

            // 针对help2pay特殊处理
            if (this.form.bankIndex === 'help2pay') {
                const target = this.help2payList.find(e => e.gateway_code === this.form.help2payCode)
                min_payamount = target.min_payamount
                max_payamount = target.max_payamount
                console.log(target)
            }
            if (value < min_payamount) {
                callback(this.$t('other.depositMin', { num: min_payamount, unit: this.currency }))
            } else if (value > max_payamount) {
                callback(this.$t('other.depositMax', { num: max_payamount, unit: this.currency }))
            } else {
                callback()
            }
        }

        return {
            insurants: ['100'],
            money: [],
            moneyIndex: '',
            OTHER: OTHER,
            isCashinLimit: true,
            otherMoneyStatus: false, // 其它金额状态
            cashinEndTime: '--',
            cashinStartTime: '--',
            device_type: '1',
            disabled: true,
            trans_amount: '0.00',
            bankList: [],
            form: {
                amount: '',
                remark: '备注',
                pay_method: '58',
                bankIndex: '',
                help2payCode: '', // 当form.bankIndex=== 'help2pay'时候， 以help2payCode的值为准
            },
            callbackUrl: '',
            depositTick: '',
            channelConfig: {},
            rules: {
                amount: [
                    { required: true, message: () => this.$t('form.title.otherAmounts') + this.$t('form.required'), trigger: 'input' },
                    { pattern: /^\d+(\.\d{1,2})?$/, message: this.$t('form.rule.decimal', { num: 2 }), trigger: 'input' },
                    { validator: amountValidator, trigger: 'input' },
                ],
                bankIndex: [{ required: true, message: this.$t('form.placeholder.pleaseSelectRechargeChannel'), trigger: 'input' }],
            },
            otcNext: false,
            isLoading: true,
            hasConfirmPaymentDialog: false,
            experienceGive: {
                num: 0,
                unit: ''
            },
            tokesTip: {
                show: false,
                data: {},
            },
            payApiType: 0,
            promiseUserStatus: this.queryUserStatus(),
            payCurrency: '', // 支付渠道的币种
            depositRateCache: {}, // 存储汇率接口的promise实例和取消方法
            upgradeEndTime: '', // 升级结束时间
            help2payList: [] // help2pay相关支付通道的列表数据
        }
    },
    computed: {
        ...mapState(['mobilePhonePrefix']),
        ...mapGetters({
            getNewAccount: 'funds/getNewAccount',
            isExperience: 'isExperience',
            activateTime: 'activateTime',
            symbolCode: 'symbolCode'
        }),
        userCurrencyForHelp2pay () {
            if (this.userInfo.mobile_phone_prefix) {
                return AREACODEMAP[this.userInfo.mobile_phone_prefix]
            } else if (this.userInfo.nationality) {
                const areaCode = COUNTRTOAREACODE[this.userInfo.nationality]
                return AREACODEMAP[areaCode]
            }
            return ''
        },
        help2payMatchUserCurrency () {
            return !!this.help2payList.find(e => e.pay_currency === this.userCurrencyForHelp2pay)
        },
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        tipAmount () {
            const bank = this.bankList.find(({ gateway_code }) => gateway_code === this.form.bankIndex)
            if (bank) {
                return Math.max(this.experienceGive.num, bank.min_payamount)
            } else {
                return this.experienceGive.num
            }
        },
        currency () {
            return this.getNewAccount.currency || 'USD'
        },
        currencyUnit () {
            const units = {
                USD: this.$t('form.title.usDollar'),
                CNY: this.$t('form.title.yuan'),
                USDT: 'USDT'
            }
            return units[this.currency] || units['USD']
        },
        computedBankList () {
            const {
                bankList,
                channelConfig,
                userInfo: { first_deposit_date, mt4_first_deposit_date },
            } = this
            let result = bankList
            const first_deposit = this.platform === 'mt4' ? mt4_first_deposit_date : first_deposit_date
            const configData = first_deposit ? channelConfig.deposited : channelConfig.unDeposited || {}

            if (Object.prototype.toString.call(configData) === '[object Object]' && Array.isArray(configData.hideList)) {
                result = result.filter((item) => !configData.hideList.includes(item.gateway_code))
            }

            const targetCode = !first_deposit_date ? 'micrpay' : 'micrpay-bankcard'
            const targetIndex = result.findIndex((item) => item.gateway_code === targetCode)
            if (targetIndex > -1) {
                const target = result.splice(targetIndex, 1)[0]
                result.unshift(target)
            }
            // TokesTip.vuelet finalRes = [];

            // for(let i=0;i<result.length;i++){
            //     if(result[i].gateway_code=="ivmarketpay"){
            //          //finalRes.push(result[i])
            //          this.payApiType=1;
            //         break;
            //     }
            // }
            // if(finalRes.length>0){
            //     this.payApiType=1;
            // }else{
            //     finalRes = result;
            //     this.payApiType=0;
            // }
            console.log('bankList', bankList)
            return result
        },
        submitDisabled () {
            return !this.form.amount || !this.form.bankIndex
        },
        platform () {
            return this.$route.name === 'MT4Depositfunds' ? 'mt4' : 'ix'
        },
        openId () {
            return this.$store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo.openId
        },
        tradeAccountId () {
            return this.$store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo.tradeAccountId
        },
        toKyc () {
            if (['micrpay-bankcard', 'micrpay', 'micrpay-crypto'].includes(this.form.bankIndex)) {
                return true
            } else {
                return false
            }
        },
        ifNewPay () {
            return this.$store.state.ix_baseInfo.companyInfo?.transBaseConfigVo?.otherConfigJ?.newPay || false
        },
        ip () {
            return sessionStorage.getItem('clientIp')
        }
    },
    watch: {
        userInfo: {
            immediate: true,
            handler (val) {
                if (val && val.customer_number && !this.depositTick) {
                    this.depositTick = sessionGet('depositTick' + this.platform, val.customer_number)
                    this.confirmPaymentDialog()
                }
            },
        },
        activateTime: {
            immediate: true,
            handler (val) {
                if (val === null) {
                    sessionSet('activateTime', null, this.userInfo.customer_number)
                }
            }
        }
    },
    created () {
        configSystem().then(res => {
            if (res && res.deposit_maintenance === true && window.htmlKey !== 'yzkey') this.upgradeEndTime = res.deposit_endTime
        })
        window.a = this
        console.log('userInfo', this.userInfo)
        console.log('userInfo', this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo)
        if (isPC()) {
            this.device_type = '2'
        }
        this.$bus.$on('USER_AUTO_LOGIN_END', () => {
            // 用于重连后的回调，可能会触发两次(可能不需要服务端再配置清空缓存）
            if (!this.depositTick) {
                this.depositTick = sessionGet('depositTick' + this.platform, this.userInfo.customer_number)
                this.confirmPaymentDialog()
            }
        })
        const loading = this.$toast.loading({
            forbidClick: true,
            loadingType: 'spinner',
            overlay: true,
            duration: 0
        })
        this.isDepositMoney()
        this.getConfigHandle()
            .then(() => {
                this.getDepostChannelConfig().finally(() => {
                    this.getDepostChannelList()
                        .finally(() => {
                            if (this.money.length > 0) {
                                this.selectMoneyHandle(this.money[0], 0)
                            }

                            const micrpayCashie = this.bankList.find(item => item.gateway_code === 'micrpay-cashier')
                            if (micrpayCashie) {
                                // pc端聚合支付不显示标题
                                this.$route.meta.showTitle = !isPC()

                                if (sessionGet('depositTick' + this.platform, this.userInfo.customer_number)) {
                                    // 聚合支付时，有tick缓存，不作后续请求
                                    loading.clear()
                                    return
                                }

                                if (!this.depositTick) {
                                    let gotoPay = null
                                    const param = {
                                        currency: this.currency,
                                        platform: this.platform
                                    }
                                    if (this.ifNewPay) {
                                        gotoPay = paymentApply
                                        param.payMethod = micrpayCashie.pay_method
                                        param.cvv = this.ip
                                    } else {
                                        gotoPay = depositApply
                                        param.pay_method = micrpayCashie.pay_method
                                    }
                                    gotoPay(param, this.$store)
                                        .then(res => {
                                            let resData = res.data
                                            if (this.ifNewPay) {
                                                resData = res.data.data
                                            }
                                            loading.clear()
                                            if (this.hasConfirmPaymentDialog) {
                                                // 如果已弹窗，停止支付跳转
                                                this.hasConfirmPaymentDialog = false
                                                return
                                            }

                                            if (res.code === 1) {
                                                this.setDepositTick(resData.tick)
                                                this.addVisibilitychangeEvent()
                                                appOpenBrower(this.ifNewPay ? resData.jump_url : resData.url)
                                            } else {
                                                this.$dialog
                                                    .alert({
                                                        title: this.$t('form.title.prompt'),
                                                        message: res.msg,
                                                        // confirmButtonText: this.$t("form.button.goToAddBankCard"),
                                                    })
                                                    .then(() => {
                                                        this.goMine()
                                                    })
                                            }
                                        })
                                        .catch(() => {
                                            loading.clear()
                                            this.goMine()
                                        })
                                } else {
                                    loading.clear()
                                }
                            } else {
                                loading.clear()
                                this.isLoading = false
                            }
                        })
                })
            })

        getCallbackUrl().then((url) => (this.callbackUrl = url))
    },
    beforeDestroy () {
        this.removeVisibilitychangeEvent()
    },
    methods: {
        ...mapActions(['getUserStatus']),
        // 获取身份证和银行卡状态(KYC状态)
        queryUserStatus () {
            return new Promise((resolve, reject) => {
                this.getUserStatus()
                    .then(res => {
                        if (res.code === 1) {
                            const data = res.data
                            if (data.idDocumentStatus === '1' && data.bankInfoStatus === '1') {
                                // 已认证
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        }
                        reject()
                    })
                    .catch(() => {
                        reject()
                    })
            })
        },
        // 校验入金渠道-四要素/出金/身份证
        async checkKYCChannel ({ v4ControlFlag, gateway_code }) {
            const KYCstatus = await this.promiseUserStatus // KYC状态
            const v4Status = this.userInfo.v4_status // 四要素状态
            const bankcard_flag = this.userInfo.bankcard_flag // 人头卡是否成功过
            const { chinese_name, id_document_number, mobile_phone, mobile_phone_prefix, reserve_mobile } = this.userInfo
            const _mobile = reserve_mobile || mobile_phone // 预留手机号或注册手机号

            // 公共参数，传入入金接口/子组件
            const params = {
                first_name: chinese_name, // 姓名
                id_no: id_document_number // 身份证号
            }
            if (_mobile) {
                params['mobile_number'] = _mobile
                params['mobileNumberPrefix'] = mobile_phone_prefix
            }

            if (KYCstatus) {
                // KYC审核已通过
                console.log('KYC审核通过')
                this.rechargeHandle(params)
            } else {
                if (v4Status === '1') {
                    // 四要素已通过
                    console.log('四要素通过')
                    this.rechargeHandle(params)
                } else {
                    if (v4ControlFlag) {
                        // 四要素已开启
                        // 无论人头卡是否成功过
                        this.$router.push({
                            name: 'KYC',
                            query: {
                                ...this.form,
                                ...params
                            },
                        })
                    } else {
                        if (bankcard_flag) {
                            // 人头卡成功过
                            this.rechargeHandle(params)
                        } else {
                            // 只有micrpay-bankcard（人头卡）才有中间页
                            if (gateway_code === 'micrpay-bankcard') {
                                const bank = this.bankList.find((item) => item.gateway_code === this.form.bankIndex)
                                const pay_method = bank.pay_method
                                const queryData = {
                                    pay_method,
                                    amount: this.form.amount,
                                    currency: this.currency,
                                    remark: '',
                                    callback_url: this.callbackUrl,
                                    platform: this.platform,
                                    ...params,
                                    ...this.$route.query,
                                }
                                console.log({ queryData })

                                this.$router.push({
                                    name: 'PayInfo',
                                    query: queryData,
                                })
                            } else {
                                this.rechargeHandle(params)
                            }
                        }
                    }
                }
            }

            // 开启了四要素验证
            /**
            if (v4ControlFlag) {
                this.$router.push({
                    name: 'KYC',
                    query: this.form,
                })
            } else {
                // 关闭四要素验证
                // 用户资料审核状态(身份证/出金银行卡)
                const status = await this.promiseUserStatus
                if (status) {
                    // 身份证和银行卡状态ok
                    // 携带身份证/银行卡信息到入金接口
                    // 初始化银行卡号
                    const bank = (this.userInfo.withdraw_banks || []).find(item => item.approve_status + '' === '2')
                    let userParams = {}

                    if (gateway_code === 'micrpay-bankcard') {
                        if (this.ifNewPay) {
                            userParams = {
                                // mobileNumberPrefix: '86',
                                // firstName: this.userInfo.chinese_name,
                                // mobileNumber: this.userInfo.mobile_phone,
                                bankAccountNumber: bank.account_no,
                                bank: bank.bank,
                                idNo: this.userInfo.id_document_number,
                            }
                        } else {
                            userParams = {
                                // mobile_number_prefix: '86',
                                // first_name: this.userInfo.chinese_name,
                                // mobile_number: this.userInfo.mobile_phone,
                                bank_account_number: bank.account_no,
                                bank: bank.bank,
                                id_no: this.userInfo.id_document_number,
                            }
                        }
                    }

                    this.rechargeHandle(userParams)
                } else {
                    if (gateway_code === 'micrpay-bankcard') {
                        const bank = this.bankList.find(({ gateway_code }) => gateway_code === this.form.bankIndex)
                        const pay_method = bank.pay_method
                        this.$router.push({
                            name: 'PayInfo',
                            query: {
                                pay_method,
                                amount: this.form.amount,
                                currency: this.currency,
                                remark: '',
                                callback_url: this.callbackUrl,
                                platform: this.platform,
                                ...this.$route.query,
                            },
                        })
                    } else {
                        this.rechargeHandle()
                    }
                }
            }
            */
        },
        // 获取代领赠金
        getPriceRecordReady () {
            getPriceRecordReady()
                .then(res => {
                    if (res.code + '' !== '0') {
                        return
                    }
                    this.experienceGive = {
                        num: res.data.amount,
                        unit: this.symbolCode
                    }
                    if (this.experienceGive.num > 0) {
                        this.tokesTip.data = {
                            num: this.experienceGive.num,
                            tipAmount: this.tipAmount,
                            unit: this.experienceGive.unit

                        }
                        if (this.isExperience && !this.depositTick) {
                            this.tokesTip.show = true
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 判断是否可以入金
        isDepositMoney () {
            getUserAuthority().then((res) => {
                if (res.code === 1) {
                    const code = res.data.can_deposit
                    if (code !== 1) {
                        if (code === 2 || code === 4) {
                            this.$dialog
                                .alert({
                                    title: this.$t('form.title.prompt'),
                                    message: res.data.deposit_error_msg,
                                    confirmButtonText: this.$t('form.button.verified'),
                                    closeOnPopstate: true,
                                })
                                .then(() => {
                                    this.$router.replace({
                                        name: 'Authentication',
                                        query: this.$route.query,
                                    })
                                })
                        } else {
                            this.$dialog
                                .alert({
                                    title: this.$t('form.title.prompt'),
                                    message: res.data.deposit_error_msg,
                                    confirmButtonText: this.$t('form.button.goToAddBankCard'),
                                    closeOnPopstate: true,
                                })
                                .then(() => {
                                    this.$router.replace({
                                        name: 'BankList',
                                        query: this.$route.query,
                                    })
                                })
                        }
                    }
                }
            })
        },
        getConfigHandle () {
            const {
                userInfo: { first_deposit_date, mt4_first_deposit_date },
            } = this
            const first_deposit = this.platform === 'mt4' ? mt4_first_deposit_date : first_deposit_date
            return getCompanyConfig('cashinSetting').then((res) => {
                if (res.code === 1) {
                    const data = res.data
                    if (!first_deposit) {
                        // 首次入金用户
                        this.money = data.firstCashinAmounts.value ? data.firstCashinAmounts.value.split(',') : []
                    } else {
                        // 非首次
                        this.money = data.cashinAmounts.value ? data.cashinAmounts.value.split(',') : []
                    }
                    this.money.push(OTHER)
                    this.cashinStartTime = data.cashinStartTime.value
                    this.cashinEndTime = data.cashinEndTime.value
                    const cur = dayjs().format('YYYY-MM-DD HH:mm:ss')
                    const curDate = dayjs().format('YYYY-MM-DD')
                    var before = dayjs(cur).isBefore(curDate + ' ' + this.cashinStartTime)
                    var after = dayjs(cur).isAfter(curDate + ' ' + this.cashinEndTime)
                    //
                    if (data.cashinStartTime.value === '00:00:00' && data.cashinEndTime.value === '23:59:59') {
                        this.isCashinLimit = false
                    }

                    if (before || after) {
                        this.disabled = true
                    } else {
                        this.disabled = false
                    }
                }
            })
        },
        // 获取充值渠道列表
        getDepostChannelList () {
            let getList = null
            if (false) { // todo 暂时不用新得渠道获取方式
                getList = getDepostChannelListNew
            } else {
                getList = getDepostChannelList
            }
            return getList({
                currency: this.currency, // 默认usd
                platform: this.platform,
            }).then((res) => {
                if (res.code) {
                    if (false) { // todo 暂时不用新得渠道获取方式
                        this.bankList = res.data.data || []
                    } else {
                        this.bankList = res.data || []
                    }

                    const firstHelp2pay = this.bankList.findIndex(e => e.gateway_code.includes('help2pay'))

                    if (firstHelp2pay >= 0) {
                        this.help2payList = this.bankList.filter(e => e.gateway_code.includes('help2pay'))
                        const newList = this.bankList.filter(e => !e.gateway_code.includes('help2pay'))
                        const newBankData = {
                            gateway_code: 'help2pay'
                        }

                        newList.splice(firstHelp2pay, 0, newBankData)
                        this.bankList = newList
                    }
                    if (this.computedBankList.length > 0) {
                        this.form.bankIndex = this.computedBankList[0].gateway_code
                        if (this.form.bankIndex === 'help2pay') {
                            if (this.help2payMatchUserCurrency) {
                                const target = this.help2payList.find(e => e.pay_currency === this.userCurrencyForHelp2pay)
                                this.payCurrency = target ? target.pay_currency : this.help2payList[0].pay_currency
                                this.form.help2payCode = target && target.gateway_code
                            } else {
                                this.payCurrency = this.help2payList[0].pay_currency
                                this.form.help2payCode = this.help2payList[0].gateway_code
                            }
                        } else {
                            this.payCurrency = this.computedBankList[0].pay_currency
                        }
                        if (this.form.bankIndex == 'otc' || this.form.bankIndex == 'QuickdueCashier') {
                            if (!this.userInfo.chinese_name || this.userInfo.chinese_name == '' || this.userInfo.id_document_status !== '2' || !this.userInfo.mobile_phone || this.userInfo.mobile_phone == '') {
                                this.otcNext = true
                            }
                        }
                    }
                    this.getPriceRecordReady()
                }
            })
        },
        // 获取充值渠道配置
        getDepostChannelConfig () {
            return getDepostChannelConfig().then((res) => {
                if (res && res.data && res.data.code === 1 && res.data.data) {
                    this.channelConfig = res.data.data || {}
                }
            })
        },
        selectMoneyHandle (item, index) {
            // console.log(item, 'xixi')
            //
            this.moneyIndex = index
            if (item === OTHER) {
                this.otherMoneyStatus = true
                this.form.amount = ''
                this.trans_amount = 0
                // this.$nextTick(() => {
                //     this.$refs.amountInput.focus()
                // })
            } else {
                this.otherMoneyStatus = false
                this.form.amount = item
            }
            this.form.amount && this._depositRate()
        },

        inputMoneyHandle (num) {
            const decimal = num.split('.')[1]
            if (decimal && typeof decimal === 'string' && decimal.length > 2) {
                this.form.amount = this.form.amount.replace(`.${decimal}`, `.${decimal.substring(0, 2)}`)
            } else {
                this.$refs.formWrap.validateField('amount')
                this.debounceDepositRate()
            }
        },

        debounceDepositRate: debounce(function () {
            this._depositRate()
        }, 500),

        // 表单提交前的校验
        async beforeSubmit () {
            return this.$refs.formWrap.validate()
                .catch(({ errors, fileds }) => {
                    this.$toast(errors[0].message)
                })
        },

        // 添加事件:visibilitychange
        addVisibilitychangeEvent () {
            document.addEventListener('visibilitychange', this.onVisibilitychange)
        },
        // 移除事件:visibilitychange
        removeVisibilitychangeEvent () {
            document.removeEventListener('visibilitychange', this.onVisibilitychange)
        },

        onVisibilitychange () {
            this.depositTick = sessionGet('depositTick' + this.platform, this.userInfo.customer_number)
            this.confirmPaymentDialog()
        },

        // 支付确认
        confirmPaymentDialog () {
            if (!this.depositTick) {
                return
            }
            if (document.visibilityState !== 'visible') {
                return
            }

            this.hasConfirmPaymentDialog = true
            const tick = this.depositTick
            // 清空本地缓存/变量
            this.setDepositTick()
            this.$dialog
                .confirm({
                    title: this.$t('form.title.paymentConfirmation'),
                    message: this.$t('other.haveYouCompletedTheRechargePayment'),
                    cancelButtonText: this.$t('form.button.noClose'),
                    confirmButtonText: this.$t('form.button.yesPaid'),
                    closeOnPopstate: true,
                })
                .then(() => {
                    // 查询是否成功
                    this.getDepositOrder(tick)
                })
                .catch(() => {
                    // 通知查询资产
                    this.sendQueryAccountInfo()
                    this.goMine()
                })
        },

        // 查询充值状态
        getDepositOrder (tick = '') {
            const params = {
                tick: tick,
                platform: this.platform,
            }
            if (!params.tick) {
                return
            }
            return getDepositOrder(params)
                .then((res) => {
                    // 通知查询资产
                    this.sendQueryAccountInfo()
                    console.log({ getDepositOrder: res })
                    if (res.code === 1) {
                        this.handleSearchResult(res)
                    } else {
                        // this.$toast(res.msg)
                        this.$dialog
                            .alert({
                                title: this.$t('form.title.prompt'),
                                message: res.msg,
                                confirmButtonText: this.$t('compLang.OK'),
                            })
                            .then(() => {
                                this.goMine()
                            })
                    }
                })
                .catch(() => {
                    // 通知查询资产
                    this.sendQueryAccountInfo()
                    this.$dialog
                        .confirm({
                            title: this.$t('form.title.prompt'),
                            message: this.$t('other.sorryNetworkError'),
                            cancelButtonText: this.$t('form.button.viewRechargeHistory'),
                            confirmButtonText: this.$t('form.button.contactCustomerService'),
                            closeOnPopstate: true,
                        })
                        .then(() => {
                            console.log('联系客服')
                            gotoOnlineService(this.$router)
                        })
                        .catch(() => {
                            this.$router.replace({
                                name: 'CapitalFlow',
                                params: {
                                    type: 1,
                                },
                                query: { ...this.$route.query, platform: this.platform },
                            })
                        })
                })
        },

        // 处理充值查询结果
        handleSearchResult (res) {
            // 请求接口
            const { agent_code } = res.data || {}
            // agent_code: fail-失败；wait–待审核；success-成功；wait_pay-待支付；cancel-已取消

            switch (agent_code) {
                case 'success': {
                    const msg = this.$t(this.platform === 'mt4' ? 'other.depositSuccessMt4' : 'other.depositSuccessfully')
                    // this.$toast(msg, 1200)
                    this.$dialog
                        .alert({
                            title: this.$t('form.title.prompt'),
                            message: msg,
                            confirmButtonText: this.$t('compLang.OK'),
                        })
                        .then(async () => {
                            const activateTime = sessionGet('activateTime', this.userInfo.customer_number)
                            if (this.isExperience && activateTime === 'null') {
                                sessionRemove('activateTime', this.userInfo.customer_number)
                                const timeDiff = 3300 - (Date.now() - window['UserLoginInfoRet']['loginTime'])
                                if (timeDiff > 0) {
                                    this.$toast.loading(this.$t('other.loading') + '...', 10000)
                                    await new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            this.$toast.clear()
                                            resolve()
                                        }, timeDiff)
                                    })
                                }
                                this.$ws.send_switchAccount()
                                this.goMine({
                                    params: {
                                        activated: true
                                    }
                                })
                            } else {
                                this.goMine()
                            }
                        })
                    break
                }
                case 'wait': {
                    this.$dialog
                        .confirm({
                            title: this.$t('form.title.prompt'),
                            message: this.$t('other.orderPending'),
                            cancelButtonText: this.$t('form.button.close'),
                            confirmButtonText: this.$t('form.button.contactCustomerService'),
                            closeOnPopstate: true,
                        })
                        .then(() => {
                            console.log('联系客服')
                            gotoOnlineService(this.$router)
                        })
                        .catch(() => this.goMine())
                    break
                }
                case 'wait_pay': {
                    this.$dialog
                        .confirm({
                            title: this.$t('form.title.prompt'),
                            message: this.$t('other.sorryNetworkError'),
                            cancelButtonText: this.$t('form.button.viewRechargeHistory'),
                            confirmButtonText: this.$t('form.button.contactCustomerService'),
                            closeOnPopstate: true,
                        })
                        .then(() => {
                            console.log('联系客服')
                            gotoOnlineService(this.$router)
                        })
                        .catch(() => {
                            this.$router.replace({
                                name: 'CapitalFlow',
                                params: {
                                    type: 1,
                                },
                                query: { ...this.$route.query, platform: this.platform },
                            })
                        })
                    break
                }
            }
        },

        setDepositTick (tick = '') {
            sessionSet('depositTick' + this.platform, tick, this.userInfo.customer_number)
        },
        makeForm (data) {
            // 创建一个 form
            var form1 = document.createElement('form')
            // 添加到 body 中
            document.body.appendChild(form1)
            // form 的提交方式
            form1.method = 'POST'
            // form 提交路径
            if (data.submitUrl) {
                form1.action = data.submitUrl
                delete data.submitUrl
            } else if (data.jump_url) {
                form1.action = data.jump_url
            }
            if (data.txnAmt) {
                data.txnAmt = data.txnAmt.toString()
            }
            // 将该输入框插入到 form 中
            for (const x in data) {
                const newElement = document.createElement('input')
                newElement.setAttribute('type', 'hidden')
                newElement.name = x
                newElement.value = data[x]
                // alert(newElement.name);
                form1.appendChild(newElement)
            }
            // 对该 form 执行提交
            form1.submit()
            // 删除该 form
            document.body.removeChild(form1)
        },
        // 充值
        async rechargeHandle (userParams = {}) {
            if (!(await this.beforeSubmit())) {
                return
            }
            const {
                bankList,
                form: { amount, bankIndex },
            } = this
            const bank = bankList.find(({ gateway_code }) => gateway_code === bankIndex)
            console.log('bank', bank)
            const pay_method = bank.pay_method
            this.$toast.loading(this.$t('other.loading') + '...', 10000)
            let depositHandle = null
            let param = {}
            if (bank.gateway_code == 'ivmarketpay') {
                this.payApiType = 1
            } else {
                this.payApiType = 0
            }
            if (this.payApiType == 0) {
                if (this.ifNewPay && this.form.bankIndex != 'otc') {
                    depositHandle = paymentApply
                    param = {
                        payMethod: pay_method,
                        amount: amount,
                        remark: '',
                        currency: this.currency,
                        deviceType: this.device_type,
                        callbackUrl: this.callbackUrl,
                        platform: this.platform,
                        mobileNumber: this.userInfo.mobile_phone,
                        firstName: this.userInfo.chinese_name,
                        openId: this.openId,
                        cvv: this.ip,
                        ...userParams
                    }
                } else {
                    depositHandle = depositApply
                    param = {
                        pay_method: pay_method,
                        amount: amount,
                        remark: '',
                        currency: this.currency,
                        device_type: this.device_type,
                        callback_url: this.callbackUrl,
                        platform: this.platform,
                        mobile_number: this.userInfo.mobile_phone,
                        first_name: this.userInfo.chinese_name,
                        open_id: this.openId,
                        ...userParams
                    }
                }
            } else {
                depositHandle = ivDepositApply
                param = {
                    pay_method: pay_method,
                    amount: amount,
                    customer_number: this.userInfo.customer_number,
                    currency: this.currency,
                    platform: this.platform,
                    open_id: this.openId,
                    trade_account_id: this.tradeAccountId, // this.tradeAccountId,
                }
            }
            depositHandle(param, this.$store)
                .then((res) => {
                    if (this.payApiType == 0) { // 新老两种方式共存
                        this.$toast.clear()
                        if (this.ifNewPay && this.form.bankIndex != 'otc') {
                            if (res.code === 1) {
                                this.setDepositTick(res.data.data.tick)
                                this.addVisibilitychangeEvent()
                                if (res.data.data.request_param) {
                                    this.makeForm(res.data.data.request_param)
                                } else {
                                    if (this.form.bankIndex === 'coin-bridge') {
                                        appOpenBrower(res.data.data.jump_url)
                                    } else {
                                        window.location.href = res.data.data.jump_url
                                    }
                                }
                            } else {
                                this.$toast(res.msg)
                            }
                        } else { // 老的支付方式
                            if (res.code === 1) {
                                this.setDepositTick(res.data.tick)
                                this.addVisibilitychangeEvent()

                                if (this.form.bankIndex === 'coin-bridge') {
                                    appOpenBrower(res.data.url)
                                } else {
                                    appOpenBrower(res.data.url)
                                }
                            } else {
                                this.$toast(res.msg)
                            }
                        }
                    } else { // iv支付
                        this.$toast.clear()
                        if (res.data.code === '0') {
                            this.makeForm(res.data.data)
                        } else {
                            this.$toast(res.data.msg)
                        }
                    }
                })
                .catch(error => {
                    this.$toast.clear()
                })
        },

        async gotoSelectBank () {
            if (!(await this.beforeSubmit())) {
                return
            }

            const { help2payList } = this
            let currency = ''
            let gateway_code = ''
            let pay_method = ''

            const target = (help2payList.find(e => e.gateway_code === this.form.help2payCode) || {})
            currency = target.pay_currency
            gateway_code = target.gateway_code
            pay_method = target.pay_method

            // 缓存入金表单
            sessionStorage.setItem('depositFormForBank', JSON.stringify({
                ...this.form,
                platform: this.platform,
                currency,
                gateway_code,
                pay_method
            }))

            // 缓存其他银行
            sessionStorage.setItem('depositcurrenciesForBank', JSON.stringify(help2payList.map(e => ({
                pay_method: e.pay_method,
                pay_currency: e.pay_currency,
                gateway_code: e.gateway_code
            }))))

            this.$router.push({
                name: 'BankName'
            })
        },

        async nextStep () {
            if (!await this.beforeSubmit()) {
                return
            }

            const {
                bankList,
                form: { amount, bankIndex },
            } = this

            const bank = bankList.find(({ gateway_code }) => gateway_code === bankIndex)
            const pay_method = bank.pay_method
            if (this.toKyc) {
                this.checkKYCChannel(bank)
                return
            } else if (this.otcNext) {
                this.$router.push({
                    name: 'PayInfo',
                    query: {
                        pay_method,
                        amount,
                        currency: this.currency,
                        remark: '',
                        callback_url: this.callbackUrl,
                        platform: this.platform,
                        ...this.$route.query,
                        code: 'otc',
                    },
                })
                return
            }
            if (this.userInfo.chinese_name && this.userInfo.chinese_name !== '' && this.userInfo.id_document_status === '2') {
                const params = {
                    mobile_number_prefix: '86',
                    device_type: this.device_type,
                    first_name: this.userInfo.chinese_name,
                    pay_method: pay_method,
                    amount: amount,
                    remark: '',
                    currency: this.currency,
                    callback_url: this.callbackUrl,
                    platform: this.platform,
                    mobile_number: this.userInfo.mobile_phone,
                    open_id: this.openId
                }

                this.$toast.loading(this.$t('other.loading') + '...', 10000)

                paymentApply(params)
                    .then((res) => {
                        if (res.code !== 1) {
                            this.$toast(res.msg)
                            return
                        }
                        this.$toast.clear()
                        // window.location.href = res.data.url
                        // this.setDepositTick(res.data.tick)
                        // this.addVisibilitychangeEvent()
                        // appOpenBrower(res.data.url)
                        if (res.data.code == '0') {
                            if (res.data.data.request_param) {
                                this.makeForm(res.data.data.request_param)
                            } else {
                                window.location.href = res.data.data.jump_url
                            }
                        } else {
                            this.$toast(res.data.msg)
                        }
                    })
                    .catch(() => {
                        this.$toast(this.$t('other.networkTimeout'))
                    })
                // this.$router.push({
                //   name: 'PayInfo',
                //   query: {
                //     pay_method,
                //     amount,
                //     currency:this.currency,
                //     remark: '入金',
                //     callback_url: this.callbackUrl
                //   }
                // })
            } else {
                this.$router.push({
                    name: 'PayInfo',
                    query: {
                        pay_method,
                        amount,
                        currency: this.currency,
                        remark: '',
                        callback_url: this.callbackUrl,
                        platform: this.platform,
                        ...this.$route.query,
                    },
                })
            }
        },

        // 获取汇率
        _depositRate () {
            if (this.currency === this.payCurrency) {
                return
            }

            if (isNaN(this.form.amount * 1)) {
                this.form.amount = ''
                return
            }

            const pId = Date.now()

            const promise = new Promise((resolve, reject) => {
                this.depositRateCache.pId = pId

                return depositRate({
                    amount: this.form.amount || 0,
                    src: this.currency,
                    dest: this.payCurrency,
                    platform: this.platform,
                }).then((res) => {
                    resolve(res)
                })
            }).then((res) => {
                if (this.depositRateCache.pId !== pId) {
                    return
                }
                if (res.code === 1) {
                    if (res.data) {
                        this.trans_amount = res.data.trans_amount
                    }
                } else {
                    this.$toast(res.msg)
                }
            }).finally(() => {
                this.depositRateCache.pId === pId && this.$set(this.depositRateCache, 'loading', false)
            })

            this.$set(this.depositRateCache, 'promise', promise)
            this.$set(this.depositRateCache, 'loading', true)
        },
        onChangBankIndexHandle (name) {
            const item = this.computedBankList.find(e => e.gateway_code === name)
            if (!item) {
                return
            }

            const { gateway_code, pay_currency } = item
            this.payCurrency = pay_currency

            if (gateway_code === 'help2pay') {
                const match = this.help2payList.find(e => e.pay_currency === this.userCurrencyForHelp2pay) || this.help2payList[0]
                if (match) {
                    this.form.help2payCode = match.gateway_code
                    this.payCurrency = match.pay_currency
                }
            } else {
                this.form.help2payCode = ''
            }

            if (this.form.amount >= 0) {
                this._depositRate()
            }

            this.otcNext = false
            if (gateway_code === 'otc' || gateway_code === 'QuickdueCashier') {
                if (!this.userInfo.chinese_name || this.userInfo.chinese_name == '' || this.userInfo.id_document_status !== '2' || !this.userInfo.mobile_phone || this.userInfo.mobile_phone == '') {
                    this.otcNext = true
                }
            }
        },
        onChangehelp2payCode (name) {
            const gateway = this.help2payList.find(e => e.gateway_code === name)
            if (!gateway) {
                return
            }
            this.payCurrency = gateway.pay_currency
            if (this.form.amount >= 0) {
                this._depositRate()
            }
            this.otcNext = false
        },
        // 查询账户资产
        sendQueryAccountInfo () {
            if (!isAPP) this.$ws.send('Accounts')
        },

        // 回到Mine页面
        goMine (options = {}) {
            if (isAPP) {
                appClose()
            } else {
                let routeName = ''
                if (this.isPC) {
                    routeName = 'Layout'
                } else {
                    routeName = 'Mine'
                }
                this.$router.replace({
                    name: routeName,
                    ...options
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";
.deposit-funds {
    position: relative;
    background: #ffffff;
    padding: 0 0 rem(150px);
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
    .header,
    .money-body,
    .expected,
    .bank-header,
    .real-gold-activities {
        padding-left: rem(28px);
        padding-right: rem(28px);
    }
    .real-gold-activities{
        margin-top:rem(20px);
        .activities-text{
            text-align: left;
            background-color: #FEF0F1;
            color:#E4545E;
            font-size:rem(28px);

            line-height: rem(36px);
            text-align: left;
            border-radius: rem(10px);
            padding:rem(10px) rem(28px);
            &:after {
                content: "";
                display: inline-block;
                vertical-align: middle;
                height: 100%;
            }

        }
    }
    .header {
        padding-top: rem(42px);
        // padding-bottom: rem(42px);
        display: flex;
        flex-wrap: nowrap;
        font-size: rem(28px);
        line-height: rem(30px);
        white-space: nowrap;
        .header-left {
            flex: 1;
            color: $text;
        }
        .header-right {
            flex: 1;
            text-align: right;
            .detailed {
                color: $primary;
            }
        }
    }
    .money-body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: hidden;
        box-sizing: border-box;
        margin-top: rem(10px);
        .money-body-item {
            position: relative;
            margin-top: rem(32px);
            flex: 0 0 47%;
            font-weight: 500;
            text-align: center;
            font-size: rem(28px);
            height: rem(80px);
            line-height: rem(80px);
            color: #333;
            box-sizing: border-box;
            border-radius: rem(5px);
            border: solid 1px #d9d9d9;
            &.active {
                border-color: transparent;
                background: $primary;
                color: #fff;
            }
            .icon {
                position: absolute;
                top: 50%;
                right: rem(20px);
                transform: translateY(-50%);
                font-size: rem(30px);
            }
            .desc {
                position: absolute;
                bottom: rem(8px);
                left: rem(0px);
                width: 100%;
                padding: 0;
                margin-top: rem(10px);
                text-align: center;
                font-size: rem(20px);
                line-height: rem(20px);
                white-space: nowrap;
                color: $color-red;
            }
        }
    }
    .input-price {
        .currency {
            color: $text;
        }
        ::v-deep {
            .bottom-line {
                margin-right: 0;
            }
        }
        & + .expected {
            margin-top: rem(38px);
        }
    }
    .expected {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        font-size: rem(24px);
        line-height: rem(26px);
        margin: rem(62px) 0 rem(34px);
        color: $text;
        white-space: nowrap;
        .rmb-price {
            color: $primary;
        }
        .van-loading__spinner{
            width: rem(24px);
            height: rem(24px);
            margin-right: rem(10px);
        }
    }
    .partition {
        width: 100%;
        height: rem(20px);
        background: #f9f9f9;
    }
    .bank-header {
        padding-top: rem(42px);
        padding-bottom: rem(32px);
        font-size: rem(28px);
        line-height: rem(30px);
        color: $text;
    }
    .bank-body {
        padding: 0 rem(28px);
        box-sizing: border-box;
        ::v-deep {
            .van-radio {
                box-sizing: border-box;
                padding: rem(32px) rem(50px);
                .van-radio__label {
                    width: 100%;
                    height: 100%;
                }
                &.van-radio--disabled {
                    .bank-item {
                        opacity: 0.6;
                    }
                    .bank-num {
                        color: inherit;
                    }
                }
            }
        }
        .bank-item {
            border: solid 1px #d9d9d9;
            border-radius: rem(5px);
            margin: rem(10px) 0 rem(30px);
            &.active {
                border-color: $primary;
            }
            .bank-item-content {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                box-sizing: border-box;
                .icon {
                    flex: 0 0 rem(63px);
                    height: rem(63px);
                    display: block;
                    margin-left: rem(19px);
                    background-size: rem(63px) auto;
                    background-repeat: no-repeat;
                    background-position-y: center;
                    &.micrpay {
                        background-image: url("./img/micrpay.png");
                    }
                    &.micrpay-bankcard {
                        background-image: url("./img/micrpay-bankcard.png");
                    }
                    &.otc {
                        background-image: url("./img/micrpay-bankcard.png");
                    }
                    &.ivmarketpay {
                        background-image: url("./img/micrpay-bankcard.png");
                    }
                    &.micrpay-crypto {
                        background-image: url("./img/micrpay-crypto.png");
                    }
                    &.icon1 {
                        background-image: url("./img/pay-icon1.png");
                    }
                    &.icon2 {
                        background-image: url("./img/pay-icon2.png");
                    }
                    &.micrpay {
                        background-image: url("./img/micrpay.png");
                    }
                    &.QuickdueCashier {
                        background-image: url("./img/QuickdueCashier.png");
                    }
                    &.micrpay-bankcard {
                        background-image: url("./img/micrpay-bankcard.png");
                    }
                    &.micrpay-crypto {
                        background-image: url("./img/micrpay-crypto.png");
                    }
                    &.coin-bridge{
                        background-image: url("./img/coin-bridge.png");
                    }
                    &.help2pay{
                        background-image: url("./img/help2pay.png");
                    }
                }
                .gateway-name {
                    font-size: rem(30px);
                    margin-left: rem(30px);
                    color: $text;
                }
            }
        }
        .allHelp2pay{
            width: 100%;
            box-sizing: border-box;
            padding: 0 rem(22px);
            .van-cell__title{
                display: flex;
                align-items: center;
            }
            .van-radio{
                padding: 0 rem(20px);
                margin: rem(10px);
            }

            .item{
                overflow: hidden;
                padding: rem(25px) 0;
                .label{
                    margin-left: rem(40px);
                    font-size: rem(28px);
                    font-weight: 500;
                    color: #333333;
                    line-height: rem(36px);
                }
            }
        }
    }

    .deposit-time {
        padding: rem(20px) 0;
        text-align: center;
        font-size: rem(30px);
        color: $color-red;
    }

    .confirm-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        // height: rem(100px);
        // line-height: rem(30px);
        font-size: rem(30px);
        background: #477fd3;
        border: 0;
    }
}
@media screen and (min-width: 750px) {
    .deposit-funds {
        .confirm-btn {
            position: absolute;
        }
    }
}
.upgrade-give{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: rem(37px) 0 0;
    text-align: center;
    span{
        font-size: rem(28px);
        font-weight: 500;
        color: #F39801;
        line-height: rem(44px);
        padding: 0 rem(16px);
        background: #FEF8ED;
        border-radius: rem(10px);
    }
}
</style>
