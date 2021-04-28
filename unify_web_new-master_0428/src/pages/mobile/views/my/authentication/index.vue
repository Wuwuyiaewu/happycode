<template>
    <div class='authentication' :class='{ pc:isPC,inApp:$store.state.inApp }'>
        <a v-if='(isPC || $store.state.inApp) && switchOtherCountry && userInfo.id_document_status=="-6"' slot='right' class='switchOtherCountry' href='javascript:;' @click='switchCountry'>
            {{ $t(countryType==='china'?'other.otherCountry':'other.china') }}
        </a>
        <span v-else-if='$store.state.inApp'></span>
        <Top v-else>
            <a v-if='switchOtherCountry && userInfo.id_document_status=="-6"' slot='right' class='switchOtherCountry' href='javascript:;' @click='switchCountry'>
                {{ $t(countryType==='china'?'other.otherCountry':'other.china') }}
            </a>
        </Top>
        <van-notice-bar
            v-if='userInfo.id_document_status != 2 && !isAuth'
            background='transparent'
            class='photo-tips'
            color='#666'
            :scrollable='false'
            wrapable
        >
            {{ $t('other.identityRequirements') }}
        </van-notice-bar>

        <FormWrap v-if="countryType==='china'" ref='formWrap' :model='userInfoFrom' :rules='rules'>
            <FormItem prop='name'>
                <FormInput
                    v-model.trim='userInfoFrom.name'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.name')"
                    name='accountNo'
                    :placeholder="$t('form.placeholder.name')"
                />
            </FormItem>
            <FormItem prop='cert.id'>
                <FormInput
                    v-model='userInfoFrom.showAccountNo'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.idCard')"
                    name='accountNo'
                    :placeholder="$t('form.placeholder.idCard')"
                    @input='formatterCard'
                />
            </FormItem>
        </FormWrap>
        <FormWrap v-else ref='formWrap' :model='userInfoFrom' :rules='rules'>
            <FormItem prop='firstname'>
                <FormInput
                    v-model.trim='userInfoFrom.firstname'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.firstname')"
                    name='firstname'
                    :placeholder="$t('form.placeholder.firstname')"
                />
            </FormItem>
            <FormItem prop='middlename'>
                <FormInput
                    v-model.trim='userInfoFrom.middlename'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.middlename')"
                    name='middlename'
                    :placeholder="$t('form.placeholder.middlename')"
                />
            </FormItem>
            <FormItem prop='surname'>
                <FormInput
                    v-model.trim='userInfoFrom.surname'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.surname')"
                    name='surname'
                    :placeholder="$t('form.placeholder.surname')"
                />
            </FormItem>

            <FormItem prop='national_code'>
                <!-- 国家编码 -->
                <FormInput
                    v-model.trim='userInfoFrom.national_code'
                    :disabled='isAuth || userCountry || nationality'
                    :format-value='formatCountry'
                    :label="$t('form.title.country')"
                    name='national_code'
                    :placeholder="$t('form.placeholder.country')"
                    readonly
                    @click.native='!(isAuth || userCountry || nationality) && countryClick()'
                />
            </FormItem>

            <FormItem prop='idType'>
                <FormInput
                    v-model.trim='idTypeText'
                    :disabled='isAuth'
                    :label="$t('form.title.idType')"
                    name='idType'
                    :placeholder="$t('form.placeholder.idType')"
                    readonly
                    @click.native='idTypeClick'
                />
            </FormItem>
            <FormItem prop='idCode'>
                <FormInput
                    v-model='userInfoFrom.idCode'
                    :clearable='!isAuth'
                    :disabled='isAuth'
                    :label="$t('form.title.idCode')"
                    name='idCode'
                    :placeholder="$t('form.placeholder.idCode')"
                    @input='formatterCard'
                />
            </FormItem>
        </FormWrap>

        <van-notice-bar
            v-if='!isAuth'
            background='transparent'
            class='photo-tips'
            color='#ccc'
            :scrollable='false'
            :text="$t('other.photoTip')"
            wrapable
        />

        <div class='upload-wrp'>
            <Upload
                :default-img='z'
                :disabled='isAuth'
                :img-src='positiveSrc'
                :is-editor='!!positiveSrc'
                name='positiveSrc'
                @onComplete='onComplete'
            >
                {{ countryType==='china'?$t('form.title.idCardFront'):'' }}
            </Upload>
        </div>
        <div v-if="countryType==='china'" class='upload-wrp'>
            <Upload
                :default-img='r'
                :disabled='isAuth'
                :img-src='reverseSrc'
                :is-editor='!!reverseSrc'
                name='reverseSrc'
                @onComplete='onComplete'
            >
                {{ $t('form.title.idCardEeverse') }}
            </Upload>
        </div>

        <div class='btn'>
            <van-button
                v-prophet="[0,3].indexOf(bankValue)>-1
                    ? ['trackEvent', '我的', '个人信息', '个人信息_下一步', 37]
                    : ['trackEvent', '我的', '个人信息', '个人信息_提交', 38]
                "
                block
                :disabled='isDisabled'
                type='primary'
                @click='onSubmitHandle'
            >
                {{ [0,3].indexOf(bankValue)>-1 ? $t('form.button.next') : $t('submit') }}
            </van-button>
            <!-- <van-button
                v-if="!isAuth"
                type="primary"
                color="#4c6072"
                block
                @click="onSubmitHandle"
            >{{ $t('form.button.next') }}</van-button>-->
        </div>
        <van-dialog
            v-model='showSuccess'
            :cancel-button-text="$t('trade.check')"
            :close-on-popstate='true'
            :confirm-button-text="$t('linkService')"
            show-cancel-button
            @cancel='$router.go(-1)'
            @confirm='goLiveService'
        >
            <div class='success'>
                <div class='title'>
                    <div class='successIcon'>
                        <SuccessAnimation :disabled-succ-animtion='disabledSuccAnimtion' />
                    </div>
                    <div class='title'>
                        {{ $t('other.submitSuccess') }}
                    </div>
                </div>

                <div class='tip'>
                    {{ $t('other.submitSuccessTip') }}
                </div>
            </div>
        </van-dialog>

        <van-action-sheet v-model='idTypeActionSheet' :actions='idTypeActions' class='idTypeActions' @select='idTypeActionOnSelect' />

        <van-action-sheet v-model='countryActionSheet' :actions='countryActions' class='idTypeActions' @select='countryActionOnSelect' />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import Upload from '@m/components/Upload'
import r from './img/r.png'
import z from './img/z.png'
import { getUserInfoParams } from '@/utils/funds/index'
import { modifyUserInfo } from '@/api/user/accountApi'
import { Field } from 'vant'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import SuccessAnimation from '@m/components/successAnimation'
import { verifyBlen } from '@/utils/index'
import { appGoCS } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'Authentication',
    components: {
        Upload,
        [Field.name]: Field,
        FormWrap,
        FormItem,
        FormInput,
        Top,
        SuccessAnimation
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
        return {
            showSuccess: false,
            disabledSuccAnimtion: false,
            z: z,
            r: r,
            userInfoFrom: {
                showAccountNo: '',
                name: '',
                firstname: '',
                middlename: '',
                surname: '',
                idCode: '',
                idType: '',
                cert: {
                    id: ''
                },
                national_code: ''
            },
            positiveSrc: '',
            reverseSrc: '',
            idTypeText: '',
            rules: {
                name: [
                    { required: true, message: this.$t('form.name') + this.$t('form.required'), trigger: 'input' },
                ],
                'cert.id': [
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
                ]
            },
            countryType: 'china', // china 中国  other 其他国家
            idTypeActionSheet: false,
            idTypeSelected: '',
            countryActionSheet: false
        }
    },
    computed: {
        userInfo () {
            console.log('this.$store.state.funds.userInfo', this.$store.state.funds.userInfo)
            return this.$store.state.funds.userInfo
        },
        bankValue () {
            // debugger
            if (this.userInfo.withdraw_banks.length === 0) {
                return 0
            }
            let invalidBankNum = 0
            let approvedBankNum = 0
            this.userInfo.withdraw_banks.forEach(bank => {
                if (bank.approve_status === '-1') {
                    invalidBankNum += 1
                }
                if (bank.approve_status === '2') {
                    approvedBankNum += 1
                }
            })
            if (approvedBankNum > 0) {
                return 1
            }
            if (this.userInfo.withdraw_banks.length === invalidBankNum) {
                return 3
            }
            return 2
        },
        isDisabled () {
            const userInfoFrom = this.userInfoFrom
            if (this.countryType === 'china' && userInfoFrom.name && this.positiveSrc && this.reverseSrc && userInfoFrom.cert.id) {
                return false
            } else if (this.countryType === 'other' && userInfoFrom.firstname && userInfoFrom.surname && this.positiveSrc && userInfoFrom.idType && userInfoFrom.idCode && userInfoFrom.national_code) {
                return false
            } else {
                return true
            }
        },
        isEditor () {
            return this.userInfo.id_document_status === '-1'
        },
        isAuth () {
            // 是否认证， 大于等于0已经提交资料 不能再提交了
            if (typeof this.userInfo.id_document_status === 'string') {
                return Number(this.userInfo.id_document_status) >= 0
            } else {
                return false
            }

            // if (typeof this.userInfo.id_document_status === 'string') {
            //     return Number(this.userInfo.id_document_status) >= 0
            // } else {
            //     return false
            // }
        },
        onlineService () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        switchOtherCountry () {
            return this.$store.state.ix_user.info?.transBaseConfigVo?.otherConfigJ?.otherCountry
        },
        idTypeActions () {
            return [{ name: this.$t('other.jiazhao'), value: '0115' }, { name: this.$t('other.huzhao'), value: '0112' }, { name: this.$t('form.id_card'), value: '0116' }]
        },
        country () {
            return this.$store.state.ix_baseInfo.companyInfo?.uiPageList?.country || {}
        },
        // 区号列表
        countryActions () {
            const { uiModules = [] } = this.country || {}
            const langMap = {
                'zh-CN': 'title',
                'en-US': 'name',
            }
            return uiModules.map(e => {
                const name = e[langMap[this.language]]
                return {
                    // name: `${name}(+${e.img})`,
                    name: `${name}`,
                    value: e.code,
                    rawName: name,
                    img: e.img
                }
            })
        },
        userCountry () {
            return this.countryActions.find(e => e.img === this.userInfo.mobile_phone_prefix)
        },
        nationality () {
            return this.userInfo.nationality
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
    },

    watch: {
        userInfo: {
            immediate: true,
            handler (val) {
                if (JSON.stringify(val) !== '{}') {
                    this.userInfoFrom = getUserInfoParams()
                    console.log('userInfoFrom', this.userInfoFrom)
                    this.positiveSrc = this.userInfoFrom.cert.id_url1
                    this.reverseSrc = this.userInfoFrom.cert.id_url2
                    const id_document = this.$store.state.funds.userInfo?.id_document ?? ''
                    const id_document_status = this.$store.state.funds.userInfo?.id_document_status ?? ''
                    const mobile_phone_prefix = this.$store.state.funds.userInfo?.mobile_phone_prefix ?? ''
                    if (id_document_status === '-6' && mobile_phone_prefix !== '86') {
                        this.countryType = 'other'
                    } else if (id_document !== '0111' && id_document_status !== '-6') {
                        this.countryType = 'other'
                        this.idTypeText = this.idTypeActions.find(el => el.value === this.userInfoFrom.idType)?.name
                    }
                    // this.formatterCard(this.userInfoFrom.cert.id)
                }
            }
        },
        userCountry: {
            immediate: true,
            handler (val) {
                if (this.countryType === 'china') {
                    return
                }

                if (val && !this.nationality) {
                    // 用户资料没有国家
                    this.userInfoFrom.national_code = val.value
                }
            }
        },
        nationality: {
            immediate: true,
            handler (val) {
                if (this.countryType === 'china') {
                    this.userInfoFrom.national_code = 'ISO_3166_156'
                    return
                }

                if (val) {
                    // 用户资料已经存在国家
                    this.userInfoFrom.national_code = val
                }
            }
        }
    },
    created () {
        if (this.userInfoFrom.cert.id) {
            this.formatterCard(this.userInfoFrom.cert.id)
        }
    },
    mounted () {
        window.cert = this
        if (this.userInfoFrom.cert.id) {
            this.formatterCard(this.userInfoFrom.cert.id)
        }
    },
    methods: {
        formatterCard (val) {
            let aliasVal = ''
            if (val.length > 6) {
                aliasVal = val.slice(0, 6) + ' '
                aliasVal += val.slice(6).replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
            } else {
                aliasVal = val
            }
            this.$set(this.userInfoFrom, 'showAccountNo', aliasVal)
            this.userInfoFrom.cert.id = aliasVal.replace(/\s/g, '')
            console.log('aliasVal', aliasVal)
            console.log('this.userInfoFrom.cert.id,', this.userInfoFrom.cert.id)
        },
        goLiveService () {
            if (this.$store.state.inApp) {
                appGoCS()
            } else {
                this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.onlineService, title: this.$t('linkService') } })
            }
        },
        onComplete ({ name, url, success }) {
            if (success) {
                this[name] = url
            }
        },
        onSubmitHandle () {
            this.$refs.formWrap.validate()
                .then((result) => {
                    if (!result) {
                        return
                    }

                    const failBanks = this.userInfo.withdraw_banks.filter(item => item.approve_status === '-1')
                    const query = {}
                    if (failBanks.length > 0 && failBanks.length === this.userInfo.withdraw_banks.length) {
                        // 银行卡全部审核失败
                        query.id = failBanks[0].id
                    }

                    if (Number(this.userInfo.id_document_status) >= 0) {
                        if ([0, 3].indexOf(this.bankValue) > -1) {
                            this.$router.push({ name: 'AddBank', query })
                        } else {
                            this.$toast.clear()
                            this.showSuccess = true
                            this.disabledSuccAnimtion = true
                        }
                    } else {
                        this.$toast.loading(this.$t('other.modifyimg') + '...', 10000)
                        const userInfoFrom = this.userInfoFrom
                        userInfoFrom.cert.id_url1 = this.positiveSrc
                        userInfoFrom.cert.id_url2 = this.reverseSrc
                        userInfoFrom.cert.id_type = 'identity'
                        const params = Object.assign({}, this.userInfoFrom, { name: this.userInfoFrom.name.replace(/\s+/g, '') })
                        // 其他国家个人资料修改
                        if (this.countryType === 'other') {
                            params.name = `${params.firstname}.${params.middlename || ''}.${params.surname}`.replace('..', '.')
                            params.cert.id_type = params.idType
                            params.cert.id = params.idCode
                            delete params.firstname
                            delete params.middlename
                            delete params.surname
                            delete params.idCode
                            delete params.idType
                        }
                        // return console.log(params)
                        modifyUserInfo({
                            userInfo: params
                        })
                            .then(res => {
                                this.$toast.clear()
                                if (res.code === 1) {
                                    this.$store.dispatch('funds/getUserInfo')
                                        .then(() => {
                                            if ([0, 3].indexOf(this.bankValue) > -1) {
                                                this.$router.push({ name: 'AddBank', query })
                                            } else {
                                                this.showSuccess = true
                                                this.disabledSuccAnimtion = true
                                            }
                                        })
                                    this.$store.dispatch('sendUserRiskInfo', { type: 7 }) // 调用指纹采集接口
                                } else {
                                    if (res.msgCode === 'A_OTHER_ERRER') {
                                        this.$toast(this.$t('other.submitFailTip'))
                                    } else {
                                        this.$toast({
                                            duration: 1000,
                                            message: this.$te('retMsg.' + res.msgCode)
                                                ? this.$t('retMsg.' + res.msgCode)
                                                : res.msg
                                        })
                                    }
                                }
                            })
                            .catch(() => {
                                this.$toast(this.$t('other.submitFailTip'))
                            })
                    }
                })
                .catch(({ errors, fields }) => {
                    console.log({ errors, fields })
                    this.$toast(errors[0].message)
                })
        },
        // 切换国家
        switchCountry () {
            this.countryType = this.countryType === 'china' ? 'other' : 'china'
        },
        idTypeActionOnSelect (action, index) {
            console.log(action, index)
            this.userInfoFrom.idType = action.value
            this.idTypeText = action.name
            this.idTypeSelected = index
            this.idTypeActionSheet = false
        },
        idTypeClick () {
            if (this.isAuth) return false
            this.idTypeActionSheet = true
        },
        countryClick () {
            if (this.isAuth) return false
            this.countryActionSheet = true
        },
        countryActionOnSelect (action, index) {
            this.$set(this.userInfoFrom, 'national_code', action.value)
            this.countryActionSheet = false
        },
        formatCountry (value) {
            const target = this.countryActions.find(e => e.value === value)
            return target ? target.rawName : value
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.authentication {
    padding-top: rem(90px);
    padding-bottom: rem(130px);
    background-color: #fff;
    &.inApp{
        padding-top: rem(20px);
    }
    &.pc{
        max-height: 700px;
        position: relative;
        padding-top: 20px;
        padding-bottom: 30px;
        overflow-x: hidden;
        overflow-y: auto;
        .switchOtherCountry{
            color: inherit;
            position: absolute;
            right: 10px;
            top: 10px;
        }
        .idTypeActions{
            position: absolute;
            left: 10px;
            bottom: 0;
            width: calc(100% - 20px);
        }
        .btn{
            position: relative;
            left: 0;
            bottom: 0;
            width: 95%;
            height: auto;
            box-shadow: none;
            margin: 0 auto;
            button {
                margin-top:0;
                border-radius: 2;
            }
        }
    }
    .success {
        .successIcon {
            display: block;
            position: relative;
            width: rem(118px);
            height: rem(118px);
            line-height: rem(110px);
            margin: rem(60px) auto 0;
            border-radius: 100%;
            text-align: center;
            color: #fff;
            font-size: rem(70px);
        }
        .title {
            text-align: center;
            margin-top: rem(5px);
            color: #333333;
            font-size: rem(30px);
        }
        .tip {
            padding: rem(30px);
            color: #8f8f8f;
            font-size: rem(30px);
        }
    }
    .upload-wrp {
        position: relative;
    }
    ::v-deep {
        .van-notice-bar {
            font-size: rem(18px);
            line-height: rem(30px);
            padding: rem(22px) rem(23px) rem(26px) rem(27px);
        }
    }
    .btn {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        // height: rem(100px);
        z-index: 999;
        ::v-deep {
            .van-button {
                width: 100%;
                // height: rem(100px);
                font-size: rem(30px);
                background: #477fd3;
                border: 0;
            }
            .van-button--disabled {
                background: #a8c5f1;
                border-color: #a8c5f1;
                opacity: 1;
            }
        }
    }
    .photo-tips {
        font-size: rem(24px);
        line-height: rem(36px);
        padding-top: rem(42px);
        padding-bottom: 0;
    }
    fieldset {
        border: none;
        background-color: #fff;
    }
}
.switchOtherCountry{
    font-size: rem(26px);
}
</style>
