<template>
    <div class='payInfo' :class='{ pc:isPC }'>
        <div class='content'>
            <FormWrap ref='formWrap' :model='form' :rules='rules'>
                <FormItem prop='first_name'>
                    <FormInput
                        v-model='form.first_name'
                        clearable
                        :label="$t('form.name')"
                        :placeholder="$t('form.placeholder.name')"
                    />
                </FormItem>

                <FormItem v-if="code !== 'otc'" prop='id_no'>
                    <FormInput
                        v-model='form.id_no'
                        clearable
                        :label="$t('form.title.idCard')"
                        :placeholder="$t('form.placeholder.idCard')"
                    />
                </FormItem>

                <FormItem prop='mobile_number'>
                    <FormInput
                        v-model='form.mobile_number'
                        clearable
                        :label="$t('form.title.mobilePhoneNumber')"
                        :placeholder='mobileholder'
                    />
                </FormItem>

                <!-- <template v-if="isPC && code !== 'otc'">
                    <VueSelect
                        v-model='formTemp.bankName'
                        :data='computedBankList'
                        :is-bank='true'
                        :label="$t('form.title.bankName')"
                        :placeholder="$t('form.placeholder.pleaseSelectYourBank')"
                        prop='bank'
                        z-index='103'
                        @change='onBankSelect'
                    />
                </template>
                <template v-else-if="code !== 'otc'">
                    <FormItem prop='bank'>
                        <FormInput
                            v-model='formTemp.bankName'
                            :label="$t('form.title.bankName')"
                            :placeholder="$t('form.placeholder.pleaseSelectYourBank')"
                            readonly
                            @click.native='showBankPicker = true'
                        >
                            <van-icon slot='append' name='arrow-down' />
                        </FormInput>
                    </FormItem>
                </template>

                <FormItem v-if="code !== 'otc'" prop='bank_account_number'>
                    <FormInput
                        v-model='formTemp.bank_account_number_temp'
                        clearable
                        :label="$t('form.title.bankCardNumber')"
                        :placeholder="$t('form.placeholder.pleaseEnterTheBankCardNumber')"
                        type='tel'
                        @input='changeBankAccountNumberTemp'
                    />
                </FormItem> -->

                <!-- <FormItem v-if="code !== 'otc'" prop='remark'>
                    <FormInput
                        v-model='form.remark'
                        clearable
                        :label="$t('form.title.remark')"
                        :placeholder="$t('pleaseEnter') + $t('form.title.remark') + '（' + $t('form.placeholder.optional')+ '）'"
                    />
                </FormItem> -->
            </FormWrap>

            <van-button class='submit' type='primary' @click='submit'>
                {{ $t('form.button.topUpNow') }}
            </van-button>
        </div>
        <van-popup v-model='showBankPicker' position='right' :style="{ height: '100%' }" @touchmove.stop>
            <div class='md-example-popup md-example-popup-right' @touchmove.stop>
                <div class='scroll'>
                    <template v-if='computedBankList.length>0'>
                        <div
                            v-for='(bank,index) in computedBankList'
                            :key='bank.code'
                            class='bank-item of-1px-bottom'
                            :class="{ 'active':index===selectBankIndex }"
                            @click='changeBankPicker(bank,index)'
                        >
                            <i class='bank-icons-sm' :class="'bk-'+bank.code"></i>
                            <span class='name'>
                                {{ bank.name }}
                            </span>
                        </div>
                    </template>
                    <div v-else style='margin-top: 80%'>
                        {{ $t('other.getBankListError') }}
                        <van-button
                            color='#4c6072'
                            size='small'
                            type='primary'
                            @click='getBaseBankList'
                        >
                            {{ $t('form.button.resubmit') }}
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Field, CellGroup, Picker } from 'vant'
import { depositApply, paymentApply } from '@/api/user/funds'
import { getBaseBankList } from '@/api/base/index.js'
import '@m/sass/bankImgSm.scss'
import { appOpenBrower, getCallbackUrl, sessionGet } from '@/utils/funds/index'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import pcMixin from '@m/mixins/pc'
import VueSelect from '@m/components/customSelect'

export default {
    name: 'PayInfo',
    components: {
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
        [Picker.name]: Picker,
        FormWrap,
        FormItem,
        FormInput,
        VueSelect
    },
    mixins: [pcMixin],
    data () {
        const validateMobileNumber = (rule, value, callback) => {
            if (!value) return false
            var reg = /^(13|14|15|16|17|18|19)\d{9}$/
            if (!reg.test(value)) {
                callback(rule.message)
            } else {
                callback()
            }
        }

        const isWithinEighteen = (rule, value, callback) => {
            const myDate = new Date()
            const month = myDate.getMonth() + 1
            const day = myDate.getDate()
            let age = myDate.getFullYear() - value.substring(6, 10) - 1
            if (value.substring(10, 12) * 1 < month || (value.substring(10, 12) * 1 === month && value.substring(12, 14) * 1 <= day)) {
                age++
            }
            if (age >= 18) {
                callback()
            } else {
                callback(rule.message)
            }
        }

        return {
            form: {
                first_name: '',
                // bank: '',
                // bank_account_number: '',
                mobile_number: '',
                remark: '',
                id_no: ''
            },
            formTemp: {
                bank_account_number_temp: '',
                bankName: '',
            },
            bankList: [],
            showBankPicker: false,
            selectBankIndex: -1,
            callbackUrl: '',
            device_type: '1',
            rules: {
                first_name: [{ required: true, message: this.$t('form.placeholder.name'), trigger: 'input' }],
                // bank: [{ required: true, message: this.$t('form.placeholder.pleaseSelectYourBank'), trigger: 'input' }],
                // bank_account_number: [{ required: true, message: this.$t('form.placeholder.pleaseEnterTheBankCardNumber'), trigger: 'input' }],
                mobile_number: [{ required: true, message: this.$t('registerInfo.phoneError'), validator: validateMobileNumber, trigger: 'input' }],
                id_no: [
                    { required: true, message: this.$t('form.placeholder.inputIdCard'), trigger: 'input' },
                    {
                        pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                        message: this.$t('other.validIDNumber'),
                        // trigger: 'change'
                    },
                    {
                        validator: isWithinEighteen,
                        message: this.$t('other.less18'),
                        trigger: 'change'
                    }
                ],
            },
            mobileholder: this.$t('pleaseEnter') + this.$t('form.title.mobilePhoneNumber')
        }
    },
    computed: {
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        computedBankList () {
            const langMap = {
                'zh-CN': 'name_cn',
                'en-US': 'name_en',
            }
            const lang_code = langMap[this.language] || 'name_cn'
            return this.bankList.map((item) => ({
                name: item[lang_code],
                code: item.code,
            }))
        },
        platform () {
            return this.$route.query.platform
        },
        code () {
            return this.$route.query.code
        },
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        userInfoMobile () {
            return this.userInfo.mobile_phone
        },
        ifNewPay () {
            return this.$store.state.ix_baseInfo.companyInfo?.transBaseConfigVo?.otherConfigJ?.newPay || false
        },
        ip () {
            return sessionStorage.getItem('clientIp')
        },
        openId () {
            return this.$store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo.openId
        },
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
        userInfoMobile: {
            immediate: true,
            handler (val, oldVal) {
                if (!oldVal && val) {
                    this.form.mobile_number = val
                }
            }
        }
    },
    created () {
        if (this.code === 'otc') {
            this.mobileholder = this.$t('form.placeholder.mobile')
            this.rules = {
                first_name: [{ required: true, message: this.$t('form.placeholder.name'), trigger: 'input' }],
                mobile_number: [{ required: true, message: this.$t('form.placeholder.mobile'), trigger: 'input' }],
            }
        }
        this.getBaseBankList()
        getCallbackUrl().then((url) => (this.callbackUrl = url))
        if (this.isPC) {
            this.device_type = '2'
        }
        this.initForm()
    },
    methods: {
        initForm () {
            Object.keys(this.$route.query).forEach((key) => {
                const value = this.$route.query[key]
                if (!value) {
                    return
                }
                switch (key) {
                    case 'first_name':
                    case 'id_no':
                    case 'mobile_number': {
                        this.form[key] = value
                        break
                    }
                }
            })
        },
        // 表单提交
        submit () {
            this.$refs.formWrap
                .validate()
                .then((result) => {
                    const {
                        form,
                        $route: {
                            query: { pay_method, amount, currency },
                        },
                    } = this

                    const newForm = {}
                    Object.keys(form).forEach(key => {
                        form[key] !== '' && (newForm[key] = form[key])
                    })

                    const params = {
                        ...newForm,
                        last_name: '',
                        mobile_number_prefix: '86',
                        device_type: this.device_type,
                        pay_method: pay_method,
                        amount: amount,
                        remark: '',
                        currency: currency,
                        callback_url: this.callbackUrl,
                        platform: this.platform,
                        open_id: this.openId
                    }
                    this.$toast.loading(this.$t('other.loading') + '...')
                    let applyFunc = depositApply

                    if (this.ifNewPay) {
                        applyFunc = paymentApply
                        Object.keys(params).forEach(key => {
                            if (/_/.test(key)) {
                                const newKey = key.replace(/_([^_])/g, (match, target) => target.toUpperCase())
                                params[newKey] = params[key]
                                delete params[key]
                            }
                        })
                        params.cvv = this.ip
                    }

                    applyFunc(params, this.$store)
                        .then((res) => {
                            if (res.code !== 1) {
                                this.$toast(res.msg)
                                return
                            }

                            this.$toast.clear()

                            let openUrl = res.data.url
                            if (this.ifNewPay) {
                                openUrl = res.data.data.jump_url
                            }
                            appOpenBrower(openUrl)
                        })
                        .catch(() => {
                            this.$toast(this.$t('other.networkTimeout'))
                        })
                })
                .catch(({ errors, fileds }) => {
                    this.$toast(errors[0].message)
                })
        },
        // 验证(表单提交前) 验证通过: true
        // beforeSubmit() {
        //     const { form } = this
        //     const checkEnum = {
        //         first_name: this.$t('form.placeholder.name'),
        //         bank: this.$t('form.placeholder.pleaseSelectYourBank'),
        //         bank_account_number: this.$t('form.placeholder.pleaseEnterTheBankCardNumber')
        //     }

        //     const result = !Object.keys(checkEnum).some(key => {
        //         if (!form[key]) {
        //             this.$toast(checkEnum[key])
        //             return true
        //         }
        //     })

        //     return result
        // },

        // onChange(银行卡号)
        changeBankAccountNumberTemp (val) {
            this.form.bank_account_number = val.replace(/\s/g, '')
            this.formTemp.bank_account_number_temp = val
                .replace(/\s/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 ')
        },

        // 获取银行卡列表
        getBaseBankList () {
            const {
                $route: {
                    query: { pay_method },
                },
            } = this
            const params = {
                pay_method,
                type: 'M',
            }
            getBaseBankList(params).then((res) => {
                if (res.code !== 1) {
                    return
                }
                this.bankList = []
                for (let i = 0; i < res.data.data.length; i++) {
                    const item = res.data.data[i]
                    if (item.code.indexOf('PCT') == -1) {
                        this.bankList.push(item)
                    }
                }
            })
        },
        onBankSelect (value) {
            // debugger
            this.changeBankPicker(value)
        },
        // onPicker(所属银行)
        changeBankPicker (bank, index) {
            this.form.bank = bank.code
            this.formTemp.bankName = bank.name
            this.showBankPicker = false
        },
        // 支付确认
        confirmPaymentDialog () {
            if (!this.depositTick) {
                return
            }
            if (document.visibilityState !== 'visible') {
                return
            }

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
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.payInfo {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding-bottom: rem(50px);
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;

        .submit {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #477fd3;
            border: 0;
        }

    }
    &.pc{
            position: relative;
            padding-bottom: 80px;
        .content {
            .submit {
                position: absolute;
                left:20px;
                bottom:20px;
                right:20px;
                width: 360px;
            }
        }
    }
    .md-example-popup {
        position: relative;
        top: 0;
        bottom: 0;
        font-size: rem(28px);
        background-color: #fff;
    }

    .md-example-popup-right {
        overflow-y: auto;
        min-width: rem(200px);
        padding: 0 rem(30px);
        height: 100%;

        .bank-item {
            padding: rem(20px) 0;
            max-width: rem(320px);
            line-height: rem(40px);

            &.active {
                color: $color-red;
            }

            .name {
                margin-left: rem(10px);
                width: 100%;
            }
        }
    }

    .scroll {
        padding: rem(20px) 0 rem(60px);
    }
}
</style>
