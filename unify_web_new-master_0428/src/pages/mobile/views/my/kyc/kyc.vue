<template>
    <div class='payInfo' :class='{ pc: isPC }'>
        <van-notice-bar background='transparent' class='photo-tips' color='#666' :scrollable='false' wrapable>
            {{ $t('other.identityRequirements2') }}
        </van-notice-bar>
        <div class='content'>
            <FormWrap ref='formWrap' :model='form' :rules='rules'>
                <FormItem prop='name'>
                    <FormInput v-model.trim='form.name' :clearable='!formDisabled.name' :disabled='formDisabled.name' :label="$t('form.name')" :placeholder="$t('form.placeholder.name')" />
                </FormItem>
                <FormItem prop='idCard'>
                    <FormInput v-model.trim='form.idCard' :clearable='!formDisabled.idCard' :disabled='formDisabled.idCard' :label="$t('form.title.idCard')" :placeholder="$t('form.placeholder.idCard')" />
                </FormItem>
                <FormItem prop='mobile'>
                    <FormInput v-model.trim='form.mobile' clearable :label="$t('form.title.bankPhone')" :placeholder="$t('form.placeholder.bankPhone')" />
                </FormItem>
                <FormItem prop='code'>
                    <FormInput
                        v-model='form.bankName'
                        :label="$t('form.title.bankName')"
                        :placeholder="$t('form.title.bankName')"
                        readonly
                        @click.native='showPopUp'
                    >
                        <van-icon
                            slot='append'
                            name='arrow-down'
                        />
                    </FormInput>
                </FormItem>
                <FormItem prop='bankNo'>
                    <FormInput
                        v-model.trim='form.bankNo'
                        :clearable='!formDisabled.bankNo'
                        :disabled='formDisabled.bankNo'
                        :label="$t('form.title.bankCardNumber')"
                        :placeholder="$t('form.placeholder.pleaseEnterTheBankCardNumber')"
                        type='tel'
                    />
                </FormItem>
            </FormWrap>
            <van-popup v-model='isPopupShow.right' position='right' @touchmove.stop>
                <div
                    class='md-example-popup md-example-popup-right'
                    @touchmove.stop
                >
                    <div class='scroll'>
                        <template v-if='computedBankList.length>0'>
                            <div
                                v-for='(bank,index) in computedBankList'
                                :key='bank.code'
                                class='bank-item of-1px-bottom'
                                :class="{ 'active':index===selectBankIndex }"
                                @click='onSelectBank(bank,index)'
                            >
                                <i
                                    class='bank-icons-sm'
                                    :class="'bk-'+bank.code"
                                ></i>
                                <span class='name'>
                                    {{ bank.name }}
                                </span>
                            </div>
                        </template>
                        <div
                            v-else
                            style='margin-top: 80%'
                        >
                            {{ $t("other.getBankListError") }}
                            <van-button
                                size='small'
                                type='primary'
                                @click='_getBaseBankList'
                            >
                                {{ $t("form.button.reLoad") }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </van-popup>
            <van-button class='submit' type='primary' @click='submit'>
                {{ $t('submit') }}
            </van-button>
        </div>
        <Tips :error-info='tipData.errorInfo' :show.sync='tipData.show' :status='tipData.status' @retry='retry' />
    </div>
</template>

<script>
import { userCustomerAuth } from '@/api/user/funds'
import '@m/sass/bankImgSm.scss'
import { getUserInfoParams } from '@/utils/funds/index'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import pcMixin from '@m/mixins/pc'
import Tips from './components/Tips'
import { verifyBlen } from '@/utils/index'
import { getBaseBankList } from '@/api/base/index.js'

export default {
    name: 'KYC',
    components: {
        FormWrap,
        FormItem,
        FormInput,
        Tips
    },
    mixins: [pcMixin],
    data () {
        const validateBlen = (rule, value, callback) => {
            const flg = verifyBlen(value, 32, 1)
            if (flg) {
                callback()
            } else {
                callback(new Error())
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
        const validateMobileNumber = (rule, value, callback) => {
            if (!value) return false
            var reg = /^(13|14|15|16|17|18|19)\d{9}$/
            if (!reg.test(value)) {
                callback(rule.message)
            } else {
                callback()
            }
        }

        return {
            isPopupShow: {
                right: false
            },
            selectBankIndex: -1,
            form: {
                name: '',
                idCard: '',
                bankNo: '',
                mobile: '',
                bankCode: '',
            },
            formDisabled: {
                name: false,
                idCard: false,
                bankNo: false,
            },
            tipData: {
                show: false,
                status: 1,
                errorInfo: ''
            },
            callbackUrl: '',
            device_type: '1',
            rules: {
                name: [
                    { required: true, message: this.$t('form.name') + this.$t('form.required'), trigger: 'input' },
                ],
                idCard: [
                    { required: true, message: this.$t('form.placeholder.inputIdCard'), trigger: 'input' },
                    {
                        pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                        message: this.$t('other.validIDNumber')
                        // trigger: 'change'
                    },
                    {
                        validator: isWithinEighteen,
                        message: this.$t('other.less18'),
                        trigger: 'change'
                    }
                ],
                mobile: [{ required: true, message: this.$t('registerInfo.phoneError'), validator: validateMobileNumber, trigger: 'input' }],
                bankNo: [
                    {
                        required: true,
                        message: this.$t('other.bankCardEmpty'),
                        trigger: 'input'
                    },
                    {
                        pattern: /^[0-9]{1,20}$/,
                        message: this.$t('other.bankCardError'),
                        trigger: 'change'
                    }
                ]
            },
            bankList: []
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        computedBankList () {
            const langMap = {
                'zh-CN': 'name_cn',
                'en-US': 'name_en',
            }
            const lang_code = langMap[this.language] || 'name_cn'
            const arr = []
            for (let i = 0; i < this.bankList.length; i++) {
                const item = this.bankList[i]
                if (item.code.indexOf('PCT') > -1) {
                    arr.push({ name: item[lang_code], code: item.code.substring(4) })
                }
            }
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i]
                if (item.code == 'BANK') {
                    arr.push(item)
                    arr.splice(i, 1)
                }
            }
            console.log('arr', arr)
            return arr
        }
    },
    created () {
        if (this.isPC) {
            this.device_type = '2'
        }
    },
    mounted () {
        this.setFormData()
        this._getBaseBankList()
    },
    methods: {
        showPopUp () {
            this.isPopupShow.right = true
        },
        hidePopUp () {
            this.isPopupShow.right = false
        },
        // 选择什么银行
        onSelectBank (bank, index) {
            this.selectBankIndex = index
            if (bank.code.indexOf('PCT') > -1) {
                this.form.bankCode = bank.code.substring(4)
            } else {
                this.form.bankCode = bank.code
            }
            this.form.bankName = bank.name
            this.hidePopUp()
        },
        _getBaseBankList () {
            getBaseBankList().then(res => {
                if (res.code === 1) {
                    this.bankList = res.data.data
                }
            })
        },
        // 初始化表单数据
        async setFormData () {
            if (this.userInfo) {
                this.form.mobile = this.userInfo.mobile_phone
                // 初始化手机号
                if (this.userInfo.id_document_status == 2) {
                    const _userInfo = await getUserInfoParams()
                    // this.form.mobile = _userInfo.mobile
                    this.form.name = _userInfo.name
                    this.form.idCard = _userInfo.cert.id
                    this.formDisabled.name = true
                    this.formDisabled.idCard = true
                }
                // 初始化银行卡号
                const bank = (this.userInfo.withdraw_banks || []).find(item => item.approve_status == 2)
                if (bank) {
                    this.form.bankNo = bank.account_no
                    // this.formDisabled.bankNo = true
                }
            }

            const objMap = {
                first_name: 'name',
                id_no: 'idCard',
                mobile_number: 'mobile'
            }

            Object.keys(this.$route.query).forEach((key) => {
                const value = this.$route.query[key]
                if (!value) {
                    return
                }

                if (objMap[key]) {
                    this.form[objMap[key]] = value
                }
            })
        },
        // 表单提交
        submit () {
            this.$refs.formWrap
                .validate()
                .then(() => {
                    if (this.form.bankCode == '') {
                        this.$toast(this.$t('registerInfo.bankEmpty'))
                        return
                    }
                    // 提交请求
                    this.tipData = {
                        show: true,
                        status: 1,
                        errorInfo: ''
                    }

                    userCustomerAuth(Object.assign({}, this.form, {
                        name: this.form.name.replace(/\s+/g, '')
                    }))
                        .then(res => {
                            if (res.code !== 1) {
                                this.tipData.status = 3
                                this.tipData.errorInfo = res.msg
                                return
                            }
                            this.tipData.status = 4
                            // 成功更新userInfo信息
                            this.$store.dispatch('funds/getUserInfo')
                            window.setTimeout(() => {
                                this.tipData.show = false
                                this.$router.replace({ name: 'DepositFunds', query: this.$route.query })
                            }, 2000)
                        })
                        .catch(error => {
                            this.tipData.status = 2
                            console.log(error)
                        })
                })
                .catch(({ errors, fileds }) => {
                    this.$toast(errors[0].message)
                })
        },
        // 重新提交
        retry () {
            this.submit()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@m/sass/mixin.scss';
.photo-tips {
    font-size: rem(24px);
    line-height: rem(36px);
    padding-top: rem(42px);
}
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
    &.pc {
        position: relative;
        padding-bottom: 80px;
        .content {
            .submit {
                position: absolute;
                left: 20px;
                bottom: 20px;
                right: 20px;
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
