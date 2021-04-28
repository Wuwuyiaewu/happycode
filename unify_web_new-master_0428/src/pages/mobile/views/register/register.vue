<template>
    <div class='register'>
        <FormAccount
            :class='{ isAPP: isAPP }'
            :show-back='backVisible'
            :show-close='closeVisible'
            :show-header='!isAPP'
            :show-header-right='headerRightVisible'
            :show-yk='ykVisible'
        >
            <template slot='title'>
                <a v-if='isPC && step===2' class='means-back' href='javascript:void(0)' @click='backReister'>
                    <i class='icon_icon_back'></i>
                </a>
                <template v-if='step === 1'>
                    <template
                        v-if="uiPageList && uiPageList.RegisterByEmail && $route.params.type ==='RegisterByEmail'"
                    >
                        {{ uiPageList.RegisterByEmail.title }}
                    </template>
                    <template
                        v-if="uiPageList && uiPageList.openRealAccount && $route.params.type ==='openRealAccount'"
                    >
                        {{ uiPageList.openRealAccount.title }}
                    </template>
                </template>
                <template v-else>
                    {{ $t('registerInfo.completeMaterial') }}
                </template>
                <router-link v-if='isPC && step===1' class='login-btn' :to="{ name: 'Login' }" @click.native="_collect(openTypeText+'_登录',true)">
                    {{ $t('registerInfo.accountLogin') }}
                </router-link>
                <changeLang />
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
                                <template v-if='country'>
                                    <!-- 国际号码 -->
                                    <FormIntlMobile
                                        v-model.trim='form[item.name]'
                                        clearable
                                        :intl-code.sync='mobilePhonePrefix'
                                        :placeholder="$t('pleaseEnter')+item.title"
                                        @change='handleValidateField(item.name, true)'
                                        @click.native="_collect(openTypeText+'_输入手机号',true)"
                                        @closed='onClosedIntlMobile'
                                        @open='onOpenIntlMobile'
                                    />
                                </template>
                                <template v-else>
                                    <!-- 手机号码 -->
                                    <FormInput
                                        v-model.trim='form[item.name]'
                                        clearable
                                        :label="$t('registerInfo.phoneNum')"
                                        :placeholder="$t('pleaseEnter')+item.title"
                                        @change='handleValidateField(item.name, true)'
                                        @click.native="_collect(openTypeText+'_输入手机号',true)"
                                    />
                                </template>
                            </template>

                            <template v-else-if="item.name === 'email'">
                                <!-- 邮箱 -->
                                <FormInput
                                    v-model.trim='form[item.name]'
                                    clearable
                                    :label='item.title'
                                    :placeholder="$t('pleaseEnter')+item.title"
                                    @change='handleValidateField(item.name, true)'
                                    @click.native="_collect(openTypeText+'_输入邮箱',true)"
                                />
                            </template>

                            <template v-else-if="item.name === 'checkCode'">
                                <!-- 验证码 -->
                                <FormInputCountdown
                                    v-model.trim='form[item.name]'
                                    clearable
                                    :label="$t('registerInfo.verifyCode')"
                                    name='account'
                                    :placeholder="$t('pleaseEnter')+item.title"
                                    @change='handleValidateField(item.name, true)'
                                    @click.native="_collect(openTypeText+'_短信验证码',true)"
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
                                    @click.native="_collect(openTypeText+'_设置密码',true)"
                                />
                            </template>

                            <template v-else-if="item.name === 'chineseName'">
                                <!-- 姓名 -->
                                <FormInput
                                    v-model.trim='form[item.name]'
                                    clearable
                                    :label='item.title'
                                    maxlength='32'
                                    :placeholder="$t('pleaseEnter')+item.title"
                                />
                            </template>

                            <!-- 注册2 -->

                            <template v-else-if="item.name === 'idCardNo'">
                                <!-- 身份证号 -->
                                <FormInput
                                    v-model.trim='form[item.name]'
                                    clearable
                                    :label='item.title'
                                    :placeholder="$t('pleaseEnter')+item.title"
                                    @change='handleValidateField(item.name, true)'
                                />
                            </template>

                            <template v-else-if="item.type === 'input'">
                                <FormInput
                                    v-model.trim='form[item.name]'
                                    clearable
                                    :label='item.title'
                                    :placeholder="$t('pleaseEnter')+item.title"
                                    @click.native="_collect(openTypeText+'_输入'+item.title,true)"
                                />
                            </template>
                        </FormItem>
                    </FormWrap>
                </div>
                <div v-if='protocolHTML && step===1' class='protocol'>
                    <van-checkbox v-model='form.protocol'>
                        <p class='protocolContent' @click='protocolClick' v-html='protocolHTML.content'></p>
                    </van-checkbox>
                </div>
                <div class='submitBox'>
                    <button
                        v-if='submitBtn'
                        v-prophet="
                            openType ==='openRealAccount'
                                ? (formList.length == step ? ['trackEvent', '注册', '手机注册', '手机注册_提交注册', 8] : ['trackEvent', '注册', '手机注册', '手机注册_下一步', 6])
                                : (['trackEvent', '注册', '邮箱注册', '邮箱注册_提交注册', 15])
                        "
                        class='submitBtn mainColorBg'
                        :disabled='loading'
                        @click='next'
                    >
                        {{ submitBtn.title }}
                    </button>
                </div>
                <p v-if='textTips' class='textTips'>
                    {{ textTips.title }}
                </p>
                <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
            </template>
            <div v-if='step === 1' class='registerByEmailWrapper'>
                <a
                    v-if="uiPageList && uiPageList.RegisterByEmail && $route.params.type!=='RegisterByEmail'"
                    v-prophet="['trackEvent', '注册', '手机注册', '邮箱开户', 7]"
                    class='mainColor'
                    href='javascript:;'
                    @click='registerByEmail'
                >
                    {{ uiPageList.RegisterByEmail.title }}
                </a>
                <a
                    v-else-if="uiPageList && uiPageList.openRealAccount && $route.params.type!=='openRealAccount'"
                    v-prophet="['trackEvent', '注册', '邮箱注册', '邮箱注册_真实开户', 16]"
                    class='mainColor'
                    href='javascript:;'
                    @click='registerByPhone'
                >
                    {{ uiPageList.openRealAccount.title }}
                </a>
            </div>
        </FormAccount>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { localSet, getLoginData, delayAwait, deviceType } from '@/utils/index.js'
import { Checkbox, Toast } from 'vant'
import { mapGetters } from 'vuex'
import * as openAccount from '@/api/register.js'
import { retMsg } from '../retMsg'
import { isAPP, appGoLogin } from '@m/base/appHybrid'
import { formRules } from './formRules'
import FormAccount from '@m/modules/formAccount'
import FormRadio from '@m/components/form/FormRadio.vue'
import FormInputCountdown from '@m/components/form/FormInputCountdown.vue'
import FormIntlMobile from '@m/components/form/FormIntlMobile.vue'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import { REGEXPDATA } from '@/utils/regExp'
import { debouncePromise } from '@/store/ix_utils'
import pcMixin from '@m/mixins/pc'
import resultMixin from './mixin'
import wsLogin from '@m/mixins/wsLogin'
import changeLang from '@m/components/changeLang'
import md5 from 'md5'
import { receive, mc888Key } from '@/api/mcUpload'
import dayjs from 'dayjs'
export default {
    name: 'Register',
    components: {
        Top,
        [Checkbox.name]: Checkbox,
        FormAccount,
        FormRadio,
        FormInputCountdown,
        FormIntlMobile,
        FormWrap,
        FormItem,
        FormInput,
        changeLang
    },
    mixins: [wsLogin, resultMixin, pcMixin],
    beforeRouteEnter: (to, from, next) => {
        if (window.vm.$store.state.ix_user.info?.toKenCompanyInfoVo?.accountNo) {
            return next({ name: 'Mine' })
        }
        delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
            // const registerRoute = { name: 'Register', params: { step: 1, type: to.type } }
            // next(to.params.step !== '1' && from.path === '/' ? registerRoute : true);
            const getAppProperties = JSON.parse(sessionStorage.getItem('getAppProperties'))
            const uiPageList = getAppProperties.uiPageList
            const openRealAccount = uiPageList.find(el => el.code === 'openRealAccount')
            const openDemoAccount = uiPageList.find(el => el.code === 'openDemoAccount')
            const RegisterByEmail = uiPageList.find(el => el.code === 'RegisterByEmail')
            let nextPath = true
            if (!openRealAccount && !RegisterByEmail) {
                nextPath = true
            } else if (to.params.type === 'openRealAccount' && !openRealAccount) {
                nextPath = { name: 'Register', params: { step: 1, type: 'RegisterByEmail' } }
            }

            if (openRealAccount && openRealAccount.other !== '1' && to.params.type !== 'RegisterByEmail' && RegisterByEmail && RegisterByEmail.other === '1') {
                // 邮箱注册
                nextPath = { name: 'Register', params: { step: 1, type: 'RegisterByEmail' } }
            }
            setTimeout(() => {
                if (nextPath !== true) {
                    next(vm => vm.$router.replace(nextPath))
                } else {
                    next(nextPath)
                }
            })
        })
    },
    data () {
        return {
            isAPP: isAPP,
            mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
            nationalCode: '', // 国家编码
            form: {
            }, // 表单字段
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
        ...mapGetters(['style', 'companyInfo']),
        backVisible () {
            if (this.isPC) {
                return false
            }
            return this.step !== 1
        },
        closeVisible () {
            if (this.isPC) {
                return !this.ykVisible
            }
            return this.step === 1
        },
        headerRightVisible () {
            return this.step === 1
        },
        ykVisible () {
            if (this.isPC) {
                return location.href.indexOf('url_source') > -1
            }
            return false
        },
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
        country () {
            const { uiPageList } = this
            return uiPageList?.country
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
            return (uiPageList && uiPageList[this.openType]) ? uiPageList[this.openType] : { top: [], bottom: [], uiModules: [] }
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
                        mobilePhonePrefix: this.mobilePhonePrefix,
                        sendType: 'SMS',
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
            result.mobilePhone && !result['mobilePhonePrefix'] && (result['mobilePhonePrefix'] = this.mobilePhonePrefix)
            return result
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
        },
        mobilePhonePrefix: {
            immediate: true,
            handler (val) {
                if (!val) {
                    return
                }

                const target = this.country?.uiModules.find(e => e.img === val)
                if (target) {
                    this.nationalCode = target.code
                } else if (val === '86') {
                    this.nationalCode = 'ISO_3166_156'
                }

                console.log({
                    nationalCode: this.nationalCode
                })
            }
        }
    },
    created () {
        this.initForm()
    },
    mounted () {
        const { query, params } = this.$route
        if (query.showtip && params.step === 1) {
            this.$toast(this.$t('activity.emptyAccount'))
        };
        // receive({ 'event_file': 'opendata', 'sign': 'A9C10BE71DE6D42795275A44941CA624', 'datalist': [{ 'plat': 8, 'dateday': '2021-01-07', 'type': 1, 'usertype': 8, 'phone': '14700001589', 'email': '123455454@ww.com', 'opentime': '2021-01-07 11:11:21', 'clientid': 'd0ca13cd351d14cb86fafd5b4997215d', 'appcode': 'yzkey', 'version': '2021-01-07 10:00', 'ip': '210.22.23.4' }] })
    },
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods: {
        // 给第三方送开户成功数据
        giveThirdData (data, defaultParams) {
            // 注册成功上报数据
            const account = data.account
            const usertype = {
                'H5_APP': 8,
                'WEBSITE': 1,
                'ANDROID': 13,
                'IOS': 12,
                'WEBSITE_ANDROID': 13,
                'WEBSITE_IOS': 12,
            }
            if (data.code === 'OK' && account && account.customerNumber) {
                const opentime = dayjs().format('YYYY-MM-DD HH:mm:ss')
                const params = {
                    event_file: 'opendata',
                    sign: md5(`opentime=${opentime}&key=${mc888Key}`).toLocaleUpperCase(),
                    datalist: [
                        {
                            plat: 8,
                            dateday: dayjs().format('YYYY-MM-DD'),
                            account: data.customerNumber,
                            type: account.openAccount ? 2 : 1,
                            usertype: usertype[defaultParams.openFrom],
                            phone: account.mobile,
                            email: account.email,
                            opentime: opentime,
                            clientid: this.$store.state.userRiskInfo.bhash,
                            appcode: defaultParams.utmcsr || window.htmlKey,
                            version: document.documentElement.getAttribute('data-buildtime'),
                            ip: sessionStorage.getItem('clientIp')
                        }
                    ]
                }
                receive(params)
            }
        },
        backReister () {
            this.$router.back()
        },
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
                rule = [{
                    type: 'string',
                    required: true,
                    message: pleaseEnter + el.title,
                    trigger: 'change'
                }].concat(rule)
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
                        this.$router.push({ name: 'Register', params: { step: nextStep }, query: Object.assign({}, this.$route.query) })
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
            const arr = document.cookie.split(';').map(el => el.trim()).filter(el => el.startsWith('__utm'))
            return '?' + arr.join('&')
        },
        getQueryVariable (variable, search) {
            var query = search.substring(1)
            var vars = query.split('&')
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=')
                if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
            }
            return undefined
        },
        // 提交开户数据
        submit (data) {
            const openFrom = deviceType()
            const defaultParams = {
                'openFrom': openFrom,
                'gaCookies': this.getUTM_params(),
            }

            if (data.mobilePhone) {
                defaultParams['mobilePhonePrefix'] = this.mobilePhonePrefix
                defaultParams['nationalCode'] = this.nationalCode
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
            const loginData = getLoginData()
            if (loginData && loginData.accountType === 'demo') {
                params.bindRealAccount = true
                params.customerNumber = this.$store.state.ix_user.userLoginInfo.account_no
            }
            openAccount.openRealAccount(params).then(res => {
                console.log(res)
                if (this.loading) this.loading.clear()
                this.loading = null
                if (res.code !== 1 || !res.data) {
                    // let msg = retMsg(res.msgCode) || res.msg || res.message || this.$t('registerInfo.openFailed');
                    // this.$toast(msg)
                    this.$router.push({ name: 'RegisterFail', params: { type: this.openType } })
                    return false
                }
                const resData = res.data
                sessionStorage.setItem('openAccount', JSON.stringify(resData))
                const dataCode = resData.code
                const account = resData.account
                const accountList = account.accountList || []
                const hasDemoAccount = accountList.find(el => el.currency === 'IXD')
                let routerName
                // 开户成功上报给mc888数据
                if (process.env.VUE_APP_project === 'MC900') {
                    this.giveThirdData(resData, defaultParams)
                }
                if (loginData?.passWord && params.passWord) {
                    loginData.passWord = params.passWord
                    localSet('loginData', JSON.stringify(loginData))
                }
                if (dataCode !== 'OK' || !account || !account.customerNumber) { // 注册失败
                    routerName = { name: 'RegisterFail', params: { type: this.openType } }
                } else if (account.openAccount && account.autoApprove && accountList.length === 2) { // 注册开户成功
                    routerName = { name: 'RegisterSuccess', params: { type: this.openType } }
                    this._collect('开立真实开户_成功', true)

                    if (this.openType === 'openRealAccount') {
                        this.$prophet(['trackEvent', '注册', '手机注册', '手机注册_真实开户后接口调用成功', 13])
                    } else {
                        this.$prophet(['trackEvent', '注册', '邮箱注册', '邮箱注册_真实开户后接口调用成功', 21])
                    }

                    if (params.customerNumber) return this.jumpToDeposit() // 直接跳转到入金页面
                } else if (account.openAccount && !account.autoApprove) { // 注册成功、人工审批
                    routerName = { name: 'RegisterManul', params: { type: this.openType } }
                } else if (!account.openAccount || hasDemoAccount) { //  注册成功、开户失败 account.openAccount为false，后台开不出来真实账户
                    routerName = { name: 'RegisterManul', params: { type: this.openType } }
                } else {
                    routerName = { name: 'RegisterFail', params: { type: this.openType } }
                }

                const userRiskInfoParams = {
                    type: 1
                }
                if (this.openType === 'RegisterByEmail') {
                    userRiskInfoParams['email'] = params.email
                } else {
                    userRiskInfoParams['mobilePhone'] = params.mobilePhone
                }
                this.$store.dispatch('sendUserRiskInfo', userRiskInfoParams) // 调用指纹采集接口

                this.$router.push(routerName)
            }).catch(err => {
                if (this.loading) this.loading.clear()
                this.loading = null
                this.$toast(typeof (err) === 'string' ? err : err.toString())
                console.log(err)
            })
        },
        // 去邮箱注册
        registerByEmail () {
            if (!this.uiPageList || !this.uiPageList.RegisterByEmail) return false
            this.$router.replace({ name: 'Register', params: { step: 1, type: 'RegisterByEmail' } })
        },
        // 去手机号注册
        registerByPhone () {
            if (!this.uiPageList || !this.uiPageList.openRealAccount) return false
            this.$router.replace({ name: 'Register', params: { step: 1, type: 'openRealAccount' } })
        },
        // 获取验证码
        getCheckCode (callback) {
            this.$prophet(this.openType === 'openRealAccount' ? ['trackEvent', '注册', '手机注册', '手机注册_获取验证码', 5] : ['trackEvent', '注册', '邮箱注册', '邮箱注册_获取验证码', 14])

            const openTypeObj = {
                openRealAccount: 'mobilePhone',
                RegisterByEmail: 'email',
            }
            const field = openTypeObj[this.openType]

            if (this.loading == true) return console.log('this.loading == true')
            this._collect(this.openTypeText + '_发送验证码', true)
            this.debounceValidateField('validateField', field, { related: true })
                .then(async () => {
                    this.loading = true

                    // 校验IP --start
                    if (['HH128key', 'YC6699key', 'JW666key', 'yzPre'].includes(window.htmlKey)) {
                        const ipAddress = await openAccount.getClientIpDistrict(this.companyInfo?.clientIp)
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
                    if (field === 'mobilePhone' && ['HH128key', 'YC6699key', 'JW666key', 'yzPre'].includes(window.htmlKey)) {
                        const mobileAddress = await openAccount.getMobileDistrict(this.form[field])
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

                    openAccount.sendVerifyRealCode(params).then((result) => {
                        this.loading = false
                        if (result.invalid()) {
                            return result.toast()
                        };
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
                    }).catch(err => {
                        this.loading = false
                        Toast({ message: this.$t('registerInfo.network'), duration: 1500 })
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
            this.debounceValidateField('validateField', name, { related })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },

        // 表单验证防抖(functionName: 'validateField' || 'validate')
        debounceValidateField: debouncePromise(function (functionName, ...rest) {
            return this.$refs.formWrap[functionName](...rest)
        }, 20),
        // 去入金
        goDeposit () {
            this.$router.replace({ name: 'DepositFunds' })
        },
        // 开户成功立即跳转到入金页面
        jumpToDeposit () {
            const userLoginInfo = this.$store.state.ix_user.userLoginInfo
            if (!userLoginInfo || !userLoginInfo.account_no) {
                this.clickTry('/deposit')
            } else {
                this.$mSocket.send('logout', {
                    company_id: userLoginInfo.company_id,
                    account_id: userLoginInfo.account_id,
                    account_no: userLoginInfo.account_no
                }).finally(() => {
                    this.clickTry('/deposit')
                })
            }
        },
        onOpenIntlMobile () {
            if (!this.isPC) {
                return
            }
            const mainElm = document.querySelector('.form-account-wrap > .main')
            mainElm.classList.add('overflow-hidden')
        },
        onClosedIntlMobile () {
            if (!this.isPC) {
                return
            }
            const mainElm = document.querySelector('.form-account-wrap > .main')
            mainElm.classList.remove('overflow-hidden')
        }
    },
}

</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.register {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    background: #fff;
    .means-back{
        position: absolute;
        left: -51px;
        color: #999;
        font-size: 22px;
        top: -18px;
    }
    .login-btn{
        position: absolute;
        top: 0;
        right: -45px;
        color: $primary;
        font-size: 14px;
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
}
</style>
