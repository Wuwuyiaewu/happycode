<template>
    <div>
        <component
            :is="'ad'"
            v-for='ad in pageConfig.top'
            :key='ad.id'
            class='ueditor'
            :data='ad'
        />

        <FormWrap ref='formWrap' :model='FormModelData' :rules='rules'>
            <FormItem
                v-for='item in formList'
                :key='item.name'
                :prop='item.name'
            >
                <template v-if="item.name === 'mobilePhone'">
                    <template v-if='country'>
                        <!-- 国际号码 -->
                        <FormIntlMobile
                            v-model.trim='form[item.name]'
                            clearable
                            :intl-code.sync='mobilePhonePrefix'
                            :placeholder="$t('pleaseEnter') + item.title"
                            @change='handleValidateField(item.name, true)'
                            @click.native="
                                openTypeText &&
                                    _collect(openTypeText + '_输入手机号', true)
                            "
                        />
                    </template>
                    <template v-else>
                        <!-- 手机号码 -->
                        <FormInput
                            v-model.trim='form[item.name]'
                            clearable
                            :label="$t('registerInfo.phoneNum')"
                            :placeholder="$t('pleaseEnter') + item.title"
                            @change='handleValidateField(item.name, true)'
                            @click.native="
                                openTypeText &&
                                    _collect(openTypeText + '_输入手机号', true)
                            "
                        />
                    </template>
                </template>

                <template v-else-if="item.name === 'email'">
                    <!-- 邮箱 -->
                    <FormInput
                        v-model.trim='form[item.name]'
                        clearable
                        :label='item.title'
                        :placeholder="$t('pleaseEnter') + item.title"
                        @change='handleValidateField(item.name, true)'
                        @click.native="
                            openTypeText &&
                                _collect(openTypeText + '_输入邮箱', true)
                        "
                    />
                </template>
                <template v-else-if="item.name === 'checkCode'">
                    <!-- 验证码 -->
                    <FormInputCountdown
                        v-model.trim='form[item.name]'
                        clearable
                        :label="$t('registerInfo.verifyCode')"
                        name='account'
                        :placeholder="$t('pleaseEnter') + item.title"
                        @change='handleValidateField(item.name, true)'
                        @click.native="
                            openTypeText &&
                                _collect(openTypeText + '_短信验证码', true)
                        "
                        @getCheckCode='getCheckCode'
                    />
                </template>

                <template v-else-if="item.name === 'currency'">
                    <!-- 货币 -->
                    <FormRadio
                        v-model.trim='form[item.name]'
                        clearable
                        :label="$t('registerInfo.accountType')"
                        :name='item.name'
                        :options='getAccountTypeList(item.dataJson)'
                    />
                </template>

                <template v-else-if="item.name === 'passWord'">
                    <!-- 密码 -->
                    <FormInput
                        v-model.trim='form[item.name]'
                        clearable
                        :label="$t('registerInfo.setPwd')"
                        :maxlength='16'
                        :placeholder="$t('registerInfo.pwdPlaceholder')"
                        show-password
                        type='password'
                        @click.native="
                            openTypeText &&
                                _collect(openTypeText + '_设置密码', true)
                        "
                    />
                </template>

                <template v-else-if="item.name === 'chineseName'">
                    <!-- 姓名 -->
                    <FormInput
                        v-model.trim='form[item.name]'
                        clearable
                        :label='item.title'
                        maxlength='32'
                        :placeholder="$t('pleaseEnter') + item.title"
                    />
                </template>

                <!-- 注册2 -->

                <template v-else-if="item.name === 'idCardNo'">
                    <!-- 身份证号 -->
                    <FormInput
                        v-model.trim='form[item.name]'
                        clearable
                        :label='item.title'
                        :placeholder="$t('pleaseEnter') + item.title"
                        @change='handleValidateField(item.name, true)'
                    />
                </template>

                <template v-else-if="item.type === 'input'">
                    <FormInput
                        v-model.trim='form[item.name]'
                        clearable
                        :label='item.title'
                        :placeholder="$t('pleaseEnter') + item.title"
                        @click.native="
                            openTypeText &&
                                _collect(
                                    openTypeText + '_输入' + item.title,
                                    true
                                )
                        "
                    />
                </template>
            </FormItem>
        </FormWrap>

        <div v-if='protocolHTML' class='protocol'>
            <van-checkbox v-model='form.protocol'>
                <p
                    class='protocolContent'
                    @click='protocolClick'
                    v-html='protocolHTML.content'
                ></p>
            </van-checkbox>
        </div>

        <div v-if='submitBtn' class='submitBox'>
            <van-button
                v-prophet="['trackEvent', '体验活动', '升级账户', '升级账户_下一步', 84]"
                class='submitBtn mainColorBg'
                :disabled='loading'
                type='info'
                @click='next'
                @click.native="_collect(openTypeText+'补充手机号',true)"
            >
                {{ submitBtn.title }}
            </van-button>
        </div>
        <p v-if='textTips' class='textTips'>
            {{ textTips.title }}
        </p>
        <component
            :is="'ad'"
            v-for='ad in pageConfig.bottom'
            :key='ad.id'
            :data='ad'
        />

        <FooterOnlineService
            v-if='onlineServiceUrl'
            :float='true'
            :title="$t('onlineService')"
            :url='onlineServiceUrl'
        />
    </div>
</template>

<script>
import { formRules } from '../formRules'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import FormInputCountdown from '@m/components/form/FormInputCountdown.vue'
import { Checkbox } from 'vant'
import { debouncePromise } from '@/store/ix_utils'
import FooterOnlineService from '@m/modules/footerOnlineService'
import { sendVerifyRealCode, openRealAccount, getMobileDistrict, getClientIpDistrict } from '@/api/register.js'
import { deviceType, localGet, localSet, getLoginData } from '@/utils/index.js'
import { mapGetters } from 'vuex'
import { retMsg } from '../../retMsg'
import FormIntlMobile from '@m/components/form/FormIntlMobile.vue'

export default {
    components: {
        FormWrap,
        FormItem,
        FormInput,
        FormInputCountdown,
        [Checkbox.name]: Checkbox,
        FooterOnlineService,
        FormIntlMobile
    },
    data () {
        return {
            moduleName: 'completeInfo',
            mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
            form: {},
            rules: {},
            loading: false,
            FormModelData: {},
            openTypeText: 'upgradeAccount'
        }
    },
    computed: {
        ...mapGetters(['companyInfo']),
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },

        country () {
            const { uiPageList } = this
            return uiPageList?.country
        },

        // 页面的配置数据
        pageConfig () {
            const { uiPageList = {}, moduleName } = this
            return uiPageList[moduleName] || { top: [], bottom: [], uiModules: [] }
        },
        // 表单
        formList () {
            const { pageConfig } = this
            if (!pageConfig || !pageConfig.uiModules) return []
            const arr = pageConfig.uiModules.filter((el) => {
                return el.moduless === 'form'
            })
            if (arr.length) {
                return arr.sort((a, b) => a.sort - b.sort)[0].uiComponent
            }
            return []
        },
        // 按钮
        submitBtn () {
            return this.formList.find((el) => {
                return el.type === 'button'
            })
        },
        // 协议
        protocolHTML () {
            const { pageConfig } = this
            if (Array.isArray(pageConfig.uiModules)) {
                const agreement = pageConfig.uiModules.find(
                    (e) => e.locating === 'agreement'
                )
                if (agreement && Array.isArray(agreement.uiComponent)) {
                    return agreement.uiComponent[0]
                }
                return null
            }
            return null
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo?.onlineService
        },
        textTips () {
            return this.formList.find((el) => el.type === 'textarea') || null
        },
        sendType () {
            const uiModules = this.companyInfo?.uiPageList?.completeInfo?.uiModules ?? []
            const formUiModule = uiModules.find(el => el.moduless === 'form') || { uiComponent: [] }
            const type = formUiModule.uiComponent.find(el => el.name === 'mobilePhone') ? 'mobilePhone' : 'email'
            return type
        },
        formWrapModel () {
            const result = {
                ...this.form,
                rules: this.rules,
                isDemo: false,
                sendType: this.sendType === 'mobilePhone' ? 'SMS' : 'EMAIL',
                hasRegisteredTip: this.$t('upgrade.hasRegisteredTip')
            }
            result.sendType === 'SMS' && (result.mobilePhonePrefix = this.mobilePhonePrefix)
            return result
        },
        nationalCode () {
            if (!this.mobilePhonePrefix || !this.form.mobilePhone) {
                return ''
            }

            const target = this.country?.uiModules.find(e => e.img === this.mobilePhonePrefix)
            if (target) {
                return target.code
            } else if (this.mobilePhonePrefix === '86') {
                return 'ISO_3166_156'
            }

            return ''
        }
    },
    watch: {
        'formList.length': {
            immediate: true,
            handler (val) {
                val && this.initForm()
            },
        },
        formWrapModel: {
            deep: true,
            immediate: true,
            handler (newval) {
                const oldKeys = Object.keys(this.FormModelData)
                const newKeys = Object.keys(newval)

                oldKeys.forEach((key) => {
                    if (!newKeys.includes(key)) {
                        delete this.FormModelData[key]
                    }
                })

                newKeys.forEach((key) => {
                    this.$set(this.FormModelData, key, newval[key])
                })

                console.log(this.FormModelData)
            },
        }
    },
    methods: {
        initForm () {
            // this.initCaptcha()
            const rules = this.rules
            const newForm = {}
            const query = this.$route.query
            const defaultMobile = query.mobile
            const defaultEmail = query.email
            this.formList.forEach((el) => {
                const name = el.name
                if (!name) return false
                let rule = formRules[name] || []
                const pleaseEnter = this.$t('pleaseEnter')
                rule = [
                    {
                        type: 'string',
                        required: true,
                        message: pleaseEnter + el.title,
                        trigger: 'change',
                    },
                ].concat(rule)
                rules[name] = rule

                // 表单默认值
                if (name === 'currency') {
                    const list = this.getAccountTypeList(el.dataJson)
                    newForm[name] = list.length > 0 ? list[0].code : ''
                } else if (name === 'mobilePhone' && defaultMobile) {
                    newForm[name] = defaultMobile
                } else if (name === 'email' && defaultEmail) {
                    newForm[name] = decodeURIComponent(defaultEmail)
                } else {
                    newForm[name] = ''
                }
            })

            if (this.protocolHTML) {
                newForm.protocol = true
                this.rules['protocol'] = formRules.protocol
            }
            this.form = newForm
        },

        // 账户类型列表 美元账户/人民币账户
        getAccountTypeList (dataJson) {
            try {
                return JSON.parse(dataJson)
            } catch (error) {
                console.log('账户类型数据格式配置错误', error)
                return []
            }
        },

        // 协议内的链接点击时，不改变复选框状态
        protocolClick ($event) {
            if ($event.target.tagName.toLowerCase() === 'a') {
                $event.stopPropagation()
            }
        },
        next () {
            const timer = setTimeout(() => {
                this.loading = this.$toast.loading({
                    mask: false,
                    duration: 0,
                    message: '',
                })
            }, 200)
            this.debounceValidateField('validate', { related: true })
                .then(() => {
                    clearTimeout(timer)
                    if (this.protocolHTML && !this.form.protocol) {
                        if (this.loading) this.loading.clear()
                        this.loading = null
                        return this.$toast(this.$t('registerInfo.protocolError'))
                    }
                    this.submit()
                })
                .catch(({ errors }) => {
                    clearTimeout(timer)
                    if (this.loading) this.loading.clear()
                    this.loading = null
                    this.$toast(errors[0].message)
                })
        },

        submit () {
            this._collect(this.openTypeText + '_' + this.submitBtn.title, true)
            const type = this.sendType
            let pwd = ''
            try {
                pwd = getLoginData().passWord
            } catch (error) {}

            const params = {
                openFrom: deviceType(),
                bindRealAccount: true,
                customerNumber: this.$store.state.ix_user.userLoginInfo.account_no,
                passWord: pwd,
                sendType: type === 'mobilePhone' ? 'SMS' : 'EMAIL',
                nationalCode: this.nationalCode,
                ...this.form,
            }

            params.sendType === 'SMS' && (params.mobilePhonePrefix = this.mobilePhonePrefix)

            try {
                const loginData = getLoginData()
                if (params.passWord !== loginData.passWord) {
                    loginData.passWord = params.passWord
                    localSet('loginData', JSON.stringify(loginData))
                }
            } catch (error) {

            }

            openRealAccount(params)
                .then((res) => {
                    if (this.loading) this.loading.clear()
                    this.loading = null
                    if (res.invalid()) {
                        return res.toast()
                    }
                    const loginData = getLoginData()
                    if (params.email && loginData.accountNo.includes('@')) {
                        loginData.accountNo = params.email
                        localSet('loginData', JSON.stringify(loginData))
                    }
                    this.$emit('complete', this.form)
                })
                .catch((err) => {
                    this.$toast(typeof err === 'string' ? err : err.toString())
                    console.log(err)
                    if (this.loading) this.loading.clear()
                    this.loading = null
                })
        },

        // 获取验证码
        getCheckCode (callback) {
            this.$prophet(['trackEvent', '体验活动', '升级账户', '升级账户_获取验证码', 83])

            const type = this.sendType
            this.debounceValidateField('validateField', type, { related: true })
                .then(async () => {
                    this.loading = true
                    const { mobilePhone, email } = this.form

                    // 校验IP --start
                    if (['HH128key', 'YC6699key', 'JW666key', 'yzPre'].includes(window.htmlKey)) {
                        const ipAddress = await getClientIpDistrict(this.companyInfo?.clientIp)
                        if (ipAddress && ipAddress.check && ipAddress.check() && ipAddress.data?.Province) {
                            const province = ipAddress.data?.Province ?? ''
                            const city = ipAddress.data?.City ?? ''
                            const provinceCity = province + city

                            const isHUBEI = provinceCity.includes('湖北')
                            const isSX = provinceCity.includes('山西')
                            const isJZ = provinceCity.includes('焦作')
                            const isCZ = provinceCity.includes('郴州')

                            if (window['isPRD'] && ((isHUBEI && [].includes(window.htmlKey)) || (isSX && ['HH128key', 'YC6699key', 'JW666key'].includes(window.htmlKey)))) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            } else if (window['isPRD'] && (isJZ && [].includes(window.htmlKey))) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            } else if (window['isPRD'] && (isCZ && ['YC6699key'].includes(window.htmlKey))) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            }
                        }
                    }
                    // 校验IP --end

                    // 校验归属地 --start
                    if (type === 'mobilePhone' && ['HH128key', 'YC6699key', 'JW666key', 'yzPre'].includes(window.htmlKey)) {
                        const mobileAddress = await getMobileDistrict(mobilePhone)
                        if (mobileAddress && mobileAddress.check && mobileAddress.check() && mobileAddress.data?.province) {
                            const province = mobileAddress.data?.province ?? ''
                            const city = mobileAddress.data?.city ?? ''
                            const provinceCity = province + city
                            const matchSX = provinceCity.includes('山西')
                            const matchHB = provinceCity.includes('湖北')
                            const matchJZ = provinceCity.includes('焦作')
                            const matchCZ = provinceCity.includes('郴州')

                            if ((matchHB && [].includes(window.htmlKey)) || (matchSX && ['HH128key', 'YC6699key', 'JW666key'].includes(window.htmlKey))) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            } else if (matchJZ && [].includes(window.htmlKey)) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            } else if (matchCZ && ['YC6699key'].includes(window.htmlKey)) {
                                this.loading = false
                                return this.$toast('当前地区不提供服务')
                            }
                        }
                    }
                    // 校验归属地 --end

                    let params = {
                        mobilePhone,
                        mobilePhonePrefix: this.mobilePhonePrefix,
                        sendType: 'SMS',
                    }
                    if (type === 'email') {
                        params = {
                            email: email,
                            sendType: 'EMAIL',
                        }
                    }
                    const msg = this.$t(type === 'email' ? 'registerInfo.validCodeSendedByEmail' : 'registerInfo.validCodeSendedByPhone')

                    sendVerifyRealCode(params)
                        .then((result) => {
                            this.loading = false
                            if (!result || result.code !== 1) {
                                const resMsg =
                                    retMsg(result.msgCode) || result.msg || result.message
                                return this.$toast(resMsg)
                            }
                            this.$toast({ message: msg, duration: 1500 })
                            callback()
                        })
                        .catch((err) => {
                            this.loading = false
                            this.$toast({
                                message: this.$t('registerInfo.network'),
                                duration: 1500,
                            })
                        })
                })
                .catch(({ errors }) => {
                    this.loading = false
                    this.$toast(errors[0].message)
                })
        },
        // 表单监听事件change/blur
        handleValidateField (name, related = false) {
            this.debounceValidateField('validateField', name, { related }).catch(
                ({ errors }) => {
                    this.$toast(errors[0].message)
                }
            )
        },
        // 表单验证防抖(functionName: 'validateField' || 'validate')
        debounceValidateField: debouncePromise(function (functionName, ...rest) {
            return this.$refs.formWrap[functionName](...rest)
        }, 20),
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.btn-wrap {
    width: 100%;
    margin: rem(94px) auto rem(60px);
    padding: 0 rem(45px);
    text-align: center;
    .next {
        margin-bottom: rem(55px);
        display: block;
        width: 100%;
        height: rem(80px);
        line-height: rem(80px);
        border-radius: rem(40px);
        text-align: center;
        color: #fff;
        font-size: rem(34px);
        background-color: #477fd3;
        @include active();
        cursor: pointer;
        &:disabled {
            background: #f0f0f0 !important;
            color: #bdbdbd;
        }
    }
}
.protocol {
    padding: rem(40px) rem(50px) 0 rem(50px);
    ::v-deep {
        .van-checkbox__icon {
            font-size: rem(26px);
        }
    }
}

.submitBox {
    margin-top: rem(60px);
    text-align: center;
    box-sizing: border-box;
    padding: 0 rem(45px);
    cursor: pointer;
    .submitBtn {
        display: block;
        margin: 0 auto;
        width: 100%;
        height: rem(80px);
        line-height: rem(80px);
        text-align: center;
        font-size: rem(34px);
        border-radius: rem(40px);
        color: #fff;
        @include active();
        cursor: pointer;
        &:disabled {
            opacity: 0.8;
        }
    }
    .loginLink {
        display: inline-block;
        margin-top: rem(50px);
        font-size: rem(28px);
    }
}
.textTips {
    margin-top: rem(40px);
    padding: 0 rem(30px);
    text-align: center;
    color: $muted;
}
</style>
