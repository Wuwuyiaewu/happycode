<template>
    <div class='register'>
        <FormAccount :class='{ isAPP: isAPP }' :show-close='!isYk' :show-header='!isAPP' :show-header-right='step === 1' :show-yk='isYk'>
            <template slot='title'>
                <template v-if='step === 1'>
                    <template v-if="uiPageList && uiPageList.RegisterByEmail && $route.params.type === 'RegisterByEmail'">
                        {{ uiPageList.RegisterByEmail.title }}
                    </template>
                    <template v-if="uiPageList && uiPageList.openRealAccount && $route.params.type === 'openRealAccount'">
                        {{ uiPageList.openRealAccount.title }}
                    </template>
                    <a class='toLogin' @click="$router.push({ name: 'Login' })">
                        账号登录
                    </a>
                </template>
                <template v-else>
                    {{ $t('registerInfo.completeMaterial') }}
                </template>
            </template>
            <template slot='desc'>
                <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' class='ueditor' :data='ad' />
            </template>
            <div v-if='!pageConfig' class='disabledOpenTips'>
                {{ $t('systemErrorTip') }}
            </div>
            <template v-else>
                <div v-if='activeForm && activeForm.uiComponent' class='registerForm'>
                    <FormWrap ref='formWrap' :model='FormModelData' :rules='rules'>
                        <FormItem v-for='item in activeForm.uiComponent' :key='item.name' :prop='item.name'>
                            <template v-if="item.name === 'mobilePhone'">
                                <!-- 手机号码 -->
                                <FormInput v-model.trim='form[item.name]' clearable :label="$t('registerInfo.phoneNum')" :placeholder="$t('pleaseEnter') + item.title" @change='handleValidateField(item.name, true)' />
                            </template>

                            <template v-else-if="item.name === 'email'">
                                <!-- 邮箱 -->
                                <FormInput v-model.trim='form[item.name]' clearable :label='item.title' :placeholder="$t('pleaseEnter') + item.title" @change='handleValidateField(item.name, true)' />
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
                                    @getCheckCode='getCheckCode'
                                />
                            </template>

                            <template v-else-if="item.name === 'currency'">
                                <!-- 货币 -->
                                <FormRadio v-model.trim='form[item.name]' clearable :label="$t('registerInfo.accountType')" :name='item.name' :options='getAccountTypeList(item.dataJson)' />
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
                                />
                            </template>

                            <template v-else-if="item.name === 'chineseName'">
                                <!-- 姓名 -->
                                <FormInput v-model.trim='form[item.name]' clearable :label='item.title' maxlength='32' :placeholder="$t('pleaseEnter') + item.title" />
                            </template>

                            <!-- 注册2 -->

                            <template v-else-if="item.name === 'idCardNo'">
                                <!-- 身份证号 -->
                                <FormInput v-model.trim='form[item.name]' clearable :label='item.title' :placeholder="$t('pleaseEnter') + item.title" @change='handleValidateField(item.name, true)' />
                            </template>

                            <template v-else-if="item.type === 'input'">
                                <FormInput v-model.trim='form[item.name]' clearable :label='item.title' :placeholder="$t('pleaseEnter') + item.title" />
                            </template>
                        </FormItem>
                    </FormWrap>
                    <span v-if='step !== 1' class='backToStep1' @click='toStep1'>
                        <i class='icon_icon_back'></i>
                        <span class='backStep1Text'>
                            返回
                        </span>
                    </span>
                </div>
                <div v-if='protocolHTML && step === 1' class='protocol'>
                    <van-checkbox v-model='form.protocol'>
                        <p class='protocolContent' @click='protocolClick' v-html='protocolHTML.content'></p>
                    </van-checkbox>
                </div>
                <div class='submitBox'>
                    <button v-if='submitBtn' class='submitBtn mainColorBg' :disabled='loading' @click='next'>
                        {{ submitBtn.title }}
                    </button>
                </div>
                <p v-if='textTips' class='textTips'>
                    {{ textTips.title }}
                </p>
                <!--<component :is="'ac'" v-for="ad in ad.bottom" :data="ad" :key="ad.id"></component>-->
                <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
            </template>
            <div v-if='step === 1' class='registerByEmailWrapper'>
                <a v-if="uiPageList && uiPageList.RegisterByEmail && $route.params.type !== 'RegisterByEmail'" class='mainColor' href='javascript:;' @click='registerByEmail'>
                    {{ uiPageList.RegisterByEmail.title }}
                </a>
                <a v-else-if="uiPageList && uiPageList.openRealAccount && $route.params.type !== 'openRealAccount'" class='mainColor' href='javascript:;' @click='registerByPhone'>
                    {{ uiPageList.openRealAccount.title }}
                </a>
            </div>
        </FormAccount>
    </div>
</template>

<script>
import Top from '@m/layout/top'

import { getLoginData, delayAwait } from '@/utils/index.js'
import { Checkbox, Toast } from 'vant'
import { mapGetters } from 'vuex'
import * as openAccount from '@/api/register.js'
import { retMsg } from '../../../mobile/views/retMsg'
import { isAPP, appGoLogin } from '@m/base/appHybrid'
import { formRules } from './formRules'
import FormAccount from '@pc/modules/formAccount'
import FormRadio from '@m/components/form/FormRadio.vue'
import FormInputCountdown from '@m/components/form/FormInputCountdown.vue'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import { REGEXPDATA } from '@/utils/regExp'
import { debouncePromise } from '@/store/ix_utils'

export default {
    name: 'Register',
    components: {
        Top,
        [Checkbox.name]: Checkbox,
        FormAccount,
        FormRadio,
        FormInputCountdown,
        FormWrap,
        FormItem,
        FormInput
    },
    beforeRouteEnter: (to, from, next) => {
        if (getLoginData()) {
            return next({ name: 'Home' })
        }
        delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
            const registerRoute = {
                name: 'Register',
                params: { step: 1, type: to.type }
            }
            // next(to.params.step !== '1' && from.path === '/' ? registerRoute : true);
            const getAppProperties = JSON.parse(sessionStorage.getItem('getAppProperties'))
            const uiPageList = getAppProperties.uiPageList
            const openRealAccount = uiPageList.find(el => el.code === 'openRealAccount')
            const openDemoAccount = uiPageList.find(el => el.code === 'openDemoAccount')
            const RegisterByEmail = uiPageList.find(el => el.code === 'RegisterByEmail')
            let nextPath = true
            if (!openRealAccount && !openDemoAccount) {
                nextPath = true
            } else if (to.params.type === 'openRealAccount' && !openRealAccount) {
                nextPath = {
                    name: 'Register',
                    params: { step: 1, type: 'RegisterByEmail' }
                }
            }

            if (openRealAccount && openRealAccount.other !== '1' && to.params.type !== 'RegisterByEmail' && RegisterByEmail && RegisterByEmail.other === '1') {
                // 邮箱注册
                nextPath = {
                    name: 'Register',
                    params: { step: 1, type: 'RegisterByEmail' }
                }
            }
            setTimeout(() => {
                next(nextPath)
            })
        })
    },
    data () {
        return {
            isAPP: isAPP,
            form: {}, // 表单字段
            loading: false,
            openTypeText: '真实开户',
            protocolHTML: null, // 协议内容
            rules: {}, // 表单验证规则
            interval: null,
            stepForm_temp_1: {}, // 缓存注册1的数据
            FormModelData: {}
        }
    },
    computed: {
        ...mapGetters(['style']),
        // 开户类型
        openType () {
            return this.$route.params.type
        },
        /* 是否开立Demo账户 */
        isDemo () {
            return this.openType.startsWith('openDemoAccount')
        },
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },
        topTabVisible () {
            const uiPageList = this.uiPageList || {}
            return uiPageList['openRealAccount'] && uiPageList['openDemoAccount']
        },
        // 页面的配置数据
        pageConfig () {
            const uiPageList = this.uiPageList
            return uiPageList ? uiPageList[this.openType] : { top: [], bottom: [], uiModules: [] }
        },
        formList () {
            const pageConfig = this.pageConfig
            if (!pageConfig || !pageConfig.uiModules) return []
            const arr = pageConfig.uiModules.filter(el => {
                return el.moduless === 'form'
            })
            return arr.sort((a, b) => a.sort - b.sort)
        },
        step () {
            return this.$route.params.step * 1 || 1
        },
        activeForm () {
            return this.formList[this.step - 1]
        },
        submitBtn () {
            const activeForm = this.activeForm
            if (!activeForm || !activeForm.uiComponent) return []
            return activeForm.uiComponent.find(el => {
                return el.type === 'button'
            })
        },
        // 广告
        ad () {
            const uiPageList = this.$store.state.ix_baseInfo.companyInfo.uiPageList
            return uiPageList && uiPageList[this.openType] ? uiPageList[this.openType] : { top: [], bottom: [], uiModules: [] }
        },
        textTips () {
            const activeForm = this.activeForm
            if (!activeForm || !activeForm.uiComponent) return ''
            return activeForm.uiComponent.find(el => el.type === 'textarea')
        },
        computedForm () {
            const { openType } = this
            let result = {}

            switch (openType) {
                case 'openRealAccount': {
                    result = {
                        mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
                        sendType: 'SMS'
                    }
                    break
                }
                case 'RegisterByEmail': {
                    result = {
                        sendType: 'EMAIL'
                    }
                    break
                }
                default: {
                }
            }

            return result
        },
        formWrapModel () {
            const result = {
                ...this.form,
                ...this.computedForm,
                rules: this.rules,
                isDemo: this.isDemo
            }
            return result
        },
        isYk () {
            if (location.href.indexOf('url_source') > -1) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        $route (newVal, oldVal) {
            if (oldVal.name === 'Register' && newVal.name === 'Register') {
                if (oldVal.params.type && newVal.params.type && oldVal.params.type !== newVal.params.type) {
                    // 当前路由下，手机号/邮箱来回切换
                    this.rules = {}
                    this.form = {}
                    this.stepForm_temp_1 = {}
                    sessionStorage.setItem('registerStep1', JSON.stringify(this.stepForm_temp_1))
                    // 滚动至顶部
                    const appMain = document.getElementById('appMain')
                    console.log(document, appMain)
                    appMain && (appMain.scrollTop = 0)
                }
                if (oldVal.params.step * 1 === 2 && newVal.params.step * 1 === 1) {
                    // 注册2返回至注册1时
                    this.rules = {}
                    this.stepForm_temp_1 = JSON.parse(sessionStorage.getItem('registerStep1')) || {}
                }

                if (oldVal.params.step * 1 === 1 && newVal.params.step * 1 === 2) {
                    // 注册1跳至注册2时
                    this.rules = {}
                }
            }
        },
        activeForm (newval, oldVal) {
            if (newval) {
                this.initForm()
            }
        },
        formWrapModel: {
            deep: true,
            immediate: true,
            handler (newval) {
                const oldKeys = Object.keys(this.FormModelData)
                const newKeys = Object.keys(newval)

                oldKeys.forEach(key => {
                    if (!newKeys.includes(key)) {
                        delete this.FormModelData[key]
                    }
                })

                newKeys.forEach(key => {
                    this.$set(this.FormModelData, key, newval[key])
                })

                console.log(this.FormModelData)
            }
        }
    },
    created () {
        this.initForm()
    },
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods: {
        // 初始化图形验证码配置
        initCaptcha () {
            const activeForm = this.activeForm
            if (!activeForm) return false
            const uiComponent = activeForm.uiComponent || []
            const checkCodeIndex = uiComponent.findIndex(el => el.name === 'checkCode')
            const checkCode = uiComponent.find(el => el.name === 'checkCode')
            const captcha = uiComponent.find(el => el.name === 'captcha')
            if (checkCode && checkCode.checkCodeType === '1' && !captcha) {
                uiComponent.splice(checkCodeIndex, 0, {
                    type: 'input',
                    url: '',
                    name: 'captcha',
                    title: '图形验证码'
                })
            }
        },
        // 根据后台配置初始化表单项
        initForm () {
            this.initCaptcha()
            const activeForm = this.activeForm
            if (!activeForm) return false
            this.initProtocolHTML()
            const uiComponent = activeForm.uiComponent || []
            const rules = this.rules
            const newForm = {}
            const query = this.$route.query
            const defaultMobile = query.mobile
            const defaultEmail = query.email
            uiComponent.forEach(el => {
                const name = el.name
                if (!name) return false
                let rule = formRules[name] || []
                const pleaseEnter = this.$t('pleaseEnter')
                rule = [
                    {
                        type: 'string',
                        required: true,
                        message: pleaseEnter + el.title,
                        trigger: 'change'
                    }
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
            if (this.step === 1) {
                this.form = {
                    ...this.form,
                    ...this.stepForm_temp_1
                }
            }
            const openType = this.openType
            if (openType && openType.startsWith('openDemoAccount')) {
                this.openTypeText = '模拟开户'
            }
        },
        // 获取协议内容
        initProtocolHTML () {
            const pageConfig = this.pageConfig
            if (!pageConfig.uiModules) return []
            const agreement = pageConfig.uiModules.find(el => {
                return el.locating === 'agreement'
            })
            this.protocolHTML = agreement && agreement.uiComponent && agreement.uiComponent.length ? agreement.uiComponent[0] : null
        },
        // 协议内的链接点击时，不改变复选框状态
        protocolClick ($event) {
            if ($event.target.tagName.toLowerCase() === 'a') {
                $event.stopPropagation()
            }
        },
        sessionSave () {
            sessionStorage.setItem('registerStep1', JSON.stringify(this.form))
        },
        // 下一步
        next () {
            const timer = setTimeout(() => {
                this.loading = this.$toast.loading({
                    mask: false,
                    duration: 0,
                    message: ''
                })
            }, 200)
            this.debounceValidateField('validate', { related: true })
                .then(() => {
                    clearTimeout(timer)
                    if (this.protocolHTML && this.step === 1 && !this.form.protocol) {
                        if (this.loading) this.loading.clear()
                        this.loading = null
                        return this.$toast(this.$t('registerInfo.protocolError'))
                    }
                    this._collect(this.openTypeText + '_' + this.submitBtn.title, true)
                    if (this.step === 1) this.sessionSave()
                    if (this.formList.length == this.step) {
                        const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1')) || {}
                        this.submit(Object.assign({}, registerStep1, this.form))
                    } else {
                        if (this.loading) this.loading.clear()
                        this.loading = null
                        const nextStep = this.step + 1
                        this.$router.push({
                            name: 'Register',
                            params: { step: nextStep },
                            query: Object.assign({}, this.$route.query)
                        })
                    }
                })
                .catch(({ errors }) => {
                    clearTimeout(timer)
                    if (this.loading) this.loading.clear()
                    this.loading = null
                    this.$toast(errors[0].message)
                })
        },
        // 获取渠道广告参数
        getUTM_params () {
            const arr = document.cookie
                .split(';')
                .map(el => el.trim())
                .filter(el => el.startsWith('__utm'))
            return '?' + arr.join('&')
        },
        getQueryVariable (variable, search) {
            var query = search.substring(1)
            var vars = query.split('&')
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=')
                if (pair[0] == variable) {
                    return decodeURIComponent(pair[1])
                }
            }
            return undefined
        },
        // 提交开户数据
        submit (data) {
            let openFrom = 'H5_APP' // h5
            if (window.JsHook && window.JsHook.appGoDeposit) {
                openFrom = 'ANDROID' // 原生Android
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
                openFrom = 'IOS' // 原生IOS
            } else if (window.JsHook && JsHook.appOpenBrower) {
                openFrom = 'WEBSITE_ANDROID' // 壳包Android
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
                openFrom = 'WEBSITE_IOS' // 壳包IOS
            }
            const defaultParams = {
                mobilePhonePrefix: this.computedForm.mobilePhonePrefix,
                openFrom: openFrom,
                gaCookies: this.getUTM_params()
            }
            // 处理广告来源字段
            const sourceParams = sessionStorage.getItem('sourceParams')
            const getQueryVariable = this.getQueryVariable
            if (sourceParams && sourceParams.includes('utm')) {
                defaultParams.utmcsr = getQueryVariable('utm_source', sourceParams)
                defaultParams.utmcmd = getQueryVariable('utm_medium', sourceParams)
                defaultParams.utmccn = getQueryVariable('utm_campaign', sourceParams)
                defaultParams.utmcct = getQueryVariable('utm_content', sourceParams)
                defaultParams.utmctr = getQueryVariable('utm_term', sourceParams)
            }
            // 推荐人注册账号
            if (sourceParams && sourceParams.includes('code')) {
                defaultParams.recommenderId = getQueryVariable('code', sourceParams)
            }
            // 代理账号
            if (sourceParams && sourceParams.includes('b_superiorAgent')) {
                defaultParams.superiorAgent = getQueryVariable('b_superiorAgent', sourceParams)
            }
            data.sendType = this.computedForm.sendType
            const params = Object.assign({}, defaultParams, data)
            this.loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            openAccount
                .openRealAccount(params)
                .then(res => {
                    if (this.loading) this.loading.clear()
                    this.loading = null
                    if (res.code !== 1 || !res.data) {
                        // let msg = retMsg(res.msgCode) || res.msg || res.message || this.$t('registerInfo.openFailed');
                        // this.$toast(msg)
                        this.$router.push({
                            name: 'RegisterFail',
                            params: { type: this.openType }
                        })
                        return false
                    }
                    const resData = res.data
                    sessionStorage.setItem('openAccount', JSON.stringify(resData))
                    const dataCode = resData.code
                    const account = resData.account
                    const accountList = account.accountList || []
                    const hasDemoAccount = accountList.find(el => el.currency === 'IXD')
                    let routerName
                    if (dataCode !== 'OK' || !account || !account.customerNumber) {
                        // 注册失败
                        routerName = {
                            name: 'RegisterFail',
                            params: { type: this.openType }
                        }
                    } else if (account.openAccount && account.autoApprove && accountList.length === 2) {
                        // 注册开户成功
                        routerName = {
                            name: 'RegisterSuccess',
                            params: { type: this.openType }
                        }
                    } else if (account.openAccount && !account.autoApprove) {
                        // 注册成功、人工审批
                        routerName = {
                            name: 'RegisterManul',
                            params: { type: this.openType }
                        }
                    } else if (!account.openAccount || hasDemoAccount) {
                        //  注册成功、开户失败 account.openAccount为false，后台开不出来真实账户
                        routerName = {
                            name: 'RegisterManul',
                            params: { type: this.openType }
                        }
                    } else {
                        routerName = {
                            name: 'RegisterFail',
                            params: { type: this.openType }
                        }
                    }
                    this.$router.push(routerName)
                })
                .catch(err => {
                    if (this.loading) this.loading.clear()
                    this.loading = null
                    this.$toast(typeof err === 'string' ? err : err.toString())
                    console.log(err)
                })
        },
        // 去邮箱注册
        registerByEmail () {
            if (!this.uiPageList || !this.uiPageList.RegisterByEmail) return false
            this.$router.replace({
                name: 'Register',
                params: { step: 1, type: 'RegisterByEmail' }
            })
        },
        // 去手机号注册
        registerByPhone () {
            if (!this.uiPageList || !this.uiPageList.openRealAccount) return false
            this.$router.replace({
                name: 'Register',
                params: { step: 1, type: 'openRealAccount' }
            })
        },
        // 获取验证码
        getCheckCode (callback) {
            const field = this.form.hasOwnProperty('email') ? 'email' : 'mobilePhone'
            if (this.loading == true) return console.log('this.loading == true')
            this._collect(this.openTypeText + '_发送验证码', true)
            this.debounceValidateField('validateField', field, true)
                .then(() => {
                    this.loading = true
                    const params = {
                        ...this.computedForm
                    }
                    let msg = ''

                    switch (this.openType) {
                        case 'openRealAccount': {
                            params['mobilePhone'] = this.form.mobilePhone + ''
                            msg = this.$t('registerInfo.validCodeSendedByPhone')
                            break
                        }
                        case 'RegisterByEmail': {
                            params['email'] = this.form.email
                            msg = this.$t('registerInfo.validCodeSendedByEmail')
                            break
                        }
                        default: {
                            msg = this.$t('registerInfo.validCodeSended')
                        }
                    }

                    openAccount
                        .sendVerifyRealCode(params)
                        .then(result => {
                            this.loading = false
                            if (!result || result.code !== 1) {
                                const msg = retMsg(result.msgCode) || result.msg || result.message
                                return this.$toast(msg)
                            }
                            this.$toast({ message: msg, duration: 1500 })
                            this.verifyCodeBtn = 60
                            callback()
                            this.interval = setInterval(() => {
                                if (this.verifyCodeBtn == 0) {
                                    clearInterval(this.interval)
                                    this.verifyCodeBtn = this.$t('registerInfo.getValidCode')
                                    this.interval = null
                                    return false
                                }
                                this.verifyCodeBtn--
                            }, 1000)
                        })
                        .catch(err => {
                            this.loading = false
                            Toast({
                                message: this.$t('registerInfo.network'),
                                duration: 1500
                            })
                        })
                })
                .catch(({ errors }) => {
                    this.loading = false
                    this.$toast(errors[0].message)
                })
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

        // 表单监听事件change/blur
        handleValidateField (name, related = false) {
            this.debounceValidateField('validateField', name, { related }).catch(({ errors }) => {
                this.$toast(errors[0].message)
            })
        },

        // 表单验证防抖(functionName: 'validateField' || 'validate')
        debounceValidateField: debouncePromise(function (functionName, ...rest) {
            return this.$refs.formWrap[functionName](...rest)
        }, 20),

        toStep1 () {
            const nextStep = this.step - 1
            this.$router.push({
                name: 'Register',
                params: { step: nextStep },
                query: Object.assign({}, this.$route.query)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
	@import '~@m/sass/mixin.scss';
	.rightViewContainer {
		box-shadow: none;
	}
	.register {
		position: relative;
		min-height: 100%;
		box-sizing: border-box;
		background: #fff;
		width: 13rem;
		.toLogin {
			position: absolute;
			right: 18px;
			font-size: 15px;
			color: #477fd3;
			cursor: pointer;
		}
		.isAPP {
			padding-top: rem(20px);
		}
		.accountLogin {
			font-size: rem(28px);
			color: $primary;
		}
		.registerTop {
			margin: rem(100px) rem(50px) rem(34px);
			h2 {
				font-size: rem(40px);
				line-height: 1;
				padding-bottom: rem(8px);
				color: #333333;
			}
		}
	}
	.rightViewContainer {
		top: -2.1rem;
		overflow: visible;
	}
	.getVerifyCode {
		position: absolute;
		right: rem(20px);
		top: 0;
		font-size: rem(28px);
	}
	.fakePwd {
		height: 0;
		overflow: hidden;
		position: absolute;
		top: -999px;
	}
	.registerForm {
		background: #fff;
		// margin: rem(50px) rem(20px);
		border-radius: rem(10px);
		.backToStep1 {
			position: absolute;
			top: 20px;
			left: 20px;
			font-size: 14px;
			cursor: pointer;
			.icon_icon_back {
				font-size: 18px;
			}
			.backStep1Text {
				position: relative;
				bottom: 2px;
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
	.textTips {
		margin-top: rem(40px);
		padding: 0 rem(30px);
		text-align: center;
		color: $muted;
	}
	.disabledOpenTips {
		padding-top: rem(50px);
		text-align: center;
		color: $muted;
	}
	.submitBox {
		margin-top: rem(60px);
		text-align: center;
		box-sizing: border-box;
		padding: 0 rem(45px);
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
	.registerByEmailWrapper {
		margin-top: rem(40px);
		text-align: center;
		font-size: rem(28px);
	}
	.title {
		width: rem(320px);
		height: rem(60px);
		margin: 0 auto;
		font-size: 0;
		border-radius: rem(10px);
		.item {
			display: inline-block;
			height: 100%;
			width: 50%;
			line-height: rem(60px);
			color: #fff;
			font-size: rem(30px);
			text-align: center;
			&.mainColor {
				background-color: #fff;
			}
		}
	}
	.ueditor ::v-deep {
		.htmlModule {
			padding: 0;
			color: #999999;
		}
		.img {
			width: 360px;
			height: 86px;
		}
	}
</style>
