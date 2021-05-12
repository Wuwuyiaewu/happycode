<template>
    <div ref='loginWrapper' class='loginWrapper'>
        <FormAccount :show-close='closeVisible' :show-yk='ykVisible'>
            <template slot='title'>
                {{ loginType === 'password' ? $t("loginPage.pwdLogin") : (checkCodeLoginVisible ? $t("loginPage.codeLogin") : '') }}
                <changeLang />
            </template>
            <div v-if='isSupportPhone && isSupportEmail' class='account-type'>
                <span :class="{ active: accountType === 'phone' }" @click="handleAccountType('phone')">
                    {{ $t('loginPage.phone.label') }}
                </span>
                <span :class="{ active: accountType === 'email' }" @click="handleAccountType('email')">
                    {{ $t('loginPage.email.label') }}
                </span>
            </div>
            <div class='form'>
                <!-- <p class="legend">{{$t('login')}}</p> -->
                <div class='fieldset'>
                    <FormWrap ref='formWrap' :model='form' :rules='rules'>
                        <FormItem prop='accountNo'>
                            <template v-if="accountType === 'phone'">
                                <template v-if='country'>
                                    <!-- 国际号码 -->
                                    <FormIntlMobile
                                        v-model.trim='form.accountNo'
                                        clearable
                                        :intl-code.sync='mobilePhonePrefix'
                                        :placeholder='formPromptContent.placeholder'
                                        @click.native="
                                            openTypeText &&
                                                _collect(openTypeText + '_输入手机号', true)
                                        "
                                        @closed='onClosedIntlMobile'
                                        @open='onOpenIntlMobile'
                                    />
                                </template>
                                <template v-else>
                                    <FormInput
                                        v-model.trim='form.accountNo'
                                        clearable
                                        :label='formPromptContent.label'
                                        :placeholder='formPromptContent.placeholder'
                                    />
                                </template>
                            </template>
                            <template v-else-if="accountType === 'email'">
                                <FormInput
                                    v-model.trim='form.accountNo'
                                    clearable
                                    :label='formPromptContent.label'
                                    :placeholder='formPromptContent.placeholder'
                                />
                            </template>
                        </FormItem>

                        <FormItem v-if="loginType==='password'" prop='password'>
                            <FormInput
                                v-model.trim='form.password'
                                clearable
                                :label="$t('password')"
                                :placeholder="$t('loginPage.password.placeholder')"
                                show-password
                                type='password'
                            />
                        </FormItem>

                        <FormItem v-else-if="checkCodeLoginVisible && loginType==='checkCode'" prop='checkCode'>
                            <!-- 验证码 -->
                            <FormInputCountdown
                                v-model.trim='form.checkCode'
                                clearable
                                :label="$t('registerInfo.verifyCode')"
                                name='account'
                                :placeholder="$t('pleaseEnter')+$t('registerInfo.verifyCode')"
                                @change='handleValidateField("checkCode", true)'
                                @getCheckCode='getCheckCode'
                            />
                        </FormItem>
                    </FormWrap>
                </div>
                <div class='btnBox'>
                    <button class='blockBtn' type='button' @click='loginHandle'>
                        {{ $t('login') }}
                    </button>
                    <router-link
                        v-if="loginType === 'checkCode'"
                        v-prophet="['trackEvent', '登录', '登录页面', '账号密码登录', 2]"
                        class='blockBtn plain'
                        replace
                        tag='button'
                        :to="{ query:{ lntype:'1' } }"
                    >
                        {{ $t("loginPage.pwdLogin") }}
                    </router-link>
                    <router-link
                        v-if="checkCodeLoginVisible && loginType === 'password'"
                        v-prophet="['trackEvent', '登录', '登录页面', '验证码快捷登录', 1]"
                        class='blockBtn plain'
                        replace
                        tag='button'
                        :to="{ query:{ lntype:'2' } }"
                    >
                        {{ $t('loginPage.codeLogin') }}
                    </router-link>
                    <a
                        v-if='uiPageList && (uiPageList.openRealAccount || uiPageList.openDemoAccount || uiPageList.RegisterByEmail)'
                        v-prophet="['trackEvent', '登录', '登录页面', '登录_我要注册', 3]"
                        class='link mainColor'
                        href='javascript:;'
                        @click='toRegister'
                    >
                        {{ $t('welltoregister') }}
                    </a>
                    <span
                        v-if='uiPageList && (uiPageList.openRealAccount || uiPageList.openDemoAccount || uiPageList.RegisterByEmail)'
                        class='line'
                    >
                        |
                    </span>
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'external'"
                        v-prophet="['trackEvent', '登录', '登录页面', '登录_忘记密码', 4]"
                        class='link mainColor'
                        :to="{ name: 'Nest', params: { id: 'queryinfo' }, query: { url: ad.url, title: $t('forgetpassword') } }"
                    >
                        {{ $t('forgetpassword') }}
                    </router-link>
                    <!-- 找回密码 forgetEntry -->
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'interior'"
                        v-prophet="['trackEvent', '登录', '登录页面', '登录_忘记密码', 4]"
                        class='link mainColor'
                        :to="{
                            name: 'forgetCourse',
                            params: {
                                phone: 'empty',
                                email: 'default',
                                type: 'real',
                                account: 'empty'
                            }
                        }"
                    >
                        {{ $t('forgetpassword') }}
                    </router-link>
                </div>
            </div>
        </FormAccount>
        <!-- <a href="javascript:;" class="close" @click="goBack">
            <i class="icon_icon_close_big" />
        </a>-->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast, Icon } from 'vant'
import { getRgsLoginInfo, relateCustomerNumber, saveImei } from '@/api/base'
import { getLoginData, removeLoginData, localSet, localGet, setLocalCustomer, getLocalCustomer, delayAwait } from '@/utils/index'
import OnlineService from '@m/modules/footerOnlineService'
import FormAccount from '@m/modules/formAccount'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import FormInputCountdown from '@m/components/form/FormInputCountdown.vue'
import { REGEXPDATA } from '@/utils/regExp'
import { appGetImei } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
import changeLang from '@m/components/changeLang'
import { checkLoginVerifyCode } from '@/api/login.js'
import { sendVerifyRealCode } from '@/api/register.js'
import { checkMobileIsExit, checkEmail } from '@/utils/formValidator.js'
import { debouncePromise } from '@/store/ix_utils'
import FormIntlMobile from '@m/components/form/FormIntlMobile.vue'

let fromRouteName = ''
export default {
    name: 'Login',
    components: {
        [Icon.name]: Icon,
        OnlineService,
        FormAccount,
        FormInputCountdown,
        FormWrap,
        FormItem,
        FormInput,
        changeLang,
        FormIntlMobile
    },
    mixins: [pcMixin],
    // 未登录状态才进入
    beforeRouteEnter (to, from, next) {
        fromRouteName = from.name
        next(getLoginData() ? { name: window.isPC ? 'Layout' : 'Home' } : true)
    },
    data () {
        const accountNoValidator = (() => {
            // if (window.uatService !== 'testapi.ixmiddle.com') {
            //     return (rule, value, callback) => {
            //         if (!REGEXPDATA.phone.test(value)) {
            //             return callback(this.$t('form.rule.phoneFormat'))
            //         }
            //         return callback()
            //     }
            // } else {
            return (rule, value, callback, a) => {
                // if (REGEXPDATA.phone.test(value) || REGEXPDATA.email.test(value)) {
                //     return callback()
                // }
                if (this.mobilePhonePrefix !== '86') {
                    return callback()
                }
                if (this.isSupportPhone && this.accountType === 'phone' && !REGEXPDATA.phone.test(value)) {
                    return callback(this.formPromptContent.formatError)
                }
                if (this.isSupportEmail && this.accountType === 'email' && !REGEXPDATA.email.test(value)) {
                    return callback(this.formPromptContent.formatError)
                }
                callback()
            }
            // }
        })()

        const accountNoOnInputValidator = (() => {
            return (rule, value, callback, a) => {
                if (!value) {
                    return callback(this.formPromptContent.placeholder)
                }
                callback()
            }
        })()
        const checkCodeValidator = (() => {
            return (rule, value, callback, a) => {
                if (!value && this.loginType === 'checkCode') {
                    return callback(this.$t('retMsg.ACCOUNT_CODE_NULL'))
                }
                callback()
            }
        })()

        return {
            disabled: false,
            loading: false,
            mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
            form: {
                accountNo: '',
                password: '',
                checkCode: '',
            },
            rules: {
                accountNo: [
                    { validator: accountNoOnInputValidator, trigger: 'input' },
                    { validator: accountNoValidator, trigger: 'change' }
                ],
                password: [
                    { required: true, message: this.$t('passwordEmpty'), trigger: 'input' },
                    { max: 16, message: this.$t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'input' }
                ],
                checkCode: [
                    // { required: true, message: this.$t('retMsg.ACCOUNT_CODE_NULL'), trigger: 'input' },
                    { validator: checkCodeValidator, trigger: 'input' }
                ]
            },
            langList: [
                { value: 'zh-CN', text: '中文' },
                { value: 'en-US', text: '中文' }
            ],
            lang: 'zh-CN',
            langShow: false,
            accountType: '',
            oldAccountNo: { // 缓存过/或刚编辑过的账号
                phone: '',
                email: ''
            }
        }
    },
    computed: {
        ...mapGetters(['companyInfo']),
        closeVisible () {
            if (this.isPC) {
                return !this.ykVisible
            }
            return true
        },
        ykVisible () {
            if (this.isPC) {
                return location.href.indexOf('url_source') > -1
            }
            return false
        },
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },
        onlineService () {
            const companyInfo = this.companyInfo
            return companyInfo.transBaseConfigVo ? companyInfo.transBaseConfigVo.onlineService : ''
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        loginReload () {
            return this.$store.state.loginReload
        },
        isSupportPhone () {
            return this.uiPageList && this.uiPageList.openRealAccount
        },
        isSupportEmail () {
            return this.uiPageList && this.uiPageList.RegisterByEmail
        },
        formPromptContent () {
            const result = {
                nonexistentAccount: this.$t('loginPage.tips.noAccount')
            }
            // if (this.isSupportPhone && this.isSupportEmail) {
            //     Object.assign(result, {
            //         label: this.$t('loginPage.phoneAndEmail.label'),
            //         placeholder: this.$t('loginPage.phoneAndEmail.placeholder'),
            //         formatError: this.$t('loginPage.phoneAndEmail.formatError')
            //     })
            // } else if (this.isSupportPhone) {
            //     Object.assign(result, {
            //         label: this.$t('loginPage.phone.label'),
            //         placeholder: this.$t('loginPage.phone.placeholder'),
            //         formatError: this.$t('loginPage.phone.formatError')
            //     })
            // } else if (this.isSupportEmail) {
            //     Object.assign(result, {
            //         label: this.$t('loginPage.email.label'),
            //         placeholder: this.$t('loginPage.email.placeholder'),
            //         formatError: this.$t('loginPage.email.formatError')
            //     })
            // }
            if (this.accountType === 'phone') {
                Object.assign(result, {
                    label: this.$t('loginPage.phone.label'),
                    placeholder: this.$t('loginPage.phone.placeholder'),
                    formatError: this.$t('loginPage.phone.formatError')
                })
            } else if (this.accountType === 'email') {
                Object.assign(result, {
                    label: this.$t('loginPage.email.label'),
                    placeholder: this.$t('loginPage.email.placeholder'),
                    formatError: this.$t('loginPage.email.formatError')
                })
            }

            return result
        },
        // 是否显示验证码登录
        checkCodeLoginVisible () {
            return this.companyInfo.transBaseConfigVo?.otherConfigJ?.verifyCodeLogin
        },
        country () {
            const { uiPageList } = this
            return uiPageList?.country
        },

        loginType () {
            return ['password', 'checkCode'][this.$route.query.lntype - 1]
        },
    },
    watch: {
        isSupportPhone: {
            immediate: true,
            handler (val) {
                if (val) {
                    this.accountType = 'phone'
                }
            }
        },
        isSupportEmail: {
            immediate: true,
            handler (val) {
                if (val && !this.isSupportPhone) {
                    this.accountType = 'email'
                }
            }
        },
        loginType: {
            immediate: true,
            handler (val, oldVal) {
                if (val && oldVal && val !== oldVal && this.$refs.formWrap) {
                    const temp = this.form.accountNo
                    this.$refs.formWrap.resetFields()
                    this.form.accountNo = temp
                }
            }
        },
        'form.accountNo' (val = '') {
            if (this.accountType === 'email') {
                this.oldAccountNo.email = val
            } else if (this.accountType === 'phone') {
                this.oldAccountNo.phone = val
            }
        }
    },
    created () {
        this.$options.sockets.onmessage = this.wsLoginResult
        if (this.loginReload) {
            location.reload()
        }
        if (this.$route.query.phone) {
            this.form.accountNo = this.$route.query.phone
        }

        delayAwait(() => this.isSupportEmail || this.isSupportPhone, true)
            .then(() => {
                console.log(this.isSupportEmail || this.isSupportPhone)
                if (!['password', 'checkCode'].includes(this.loginType)) {
                    // 非密码或者验证码登录的，默认重定向到密码登录
                    this.$router.replace({
                        params: this.$route.params,
                        query: {
                            ...this.$route.query,
                            lntype: '1'
                        },
                    })
                } else if (!this.checkCodeLoginVisible && this.loginType === 'checkCode') {
                    // 验证码登录，却没有对应配置，默认重定向到密码登录
                    this.$router.replace({
                        params: this.$route.params,
                        query: {
                            ...this.$route.query,
                            lntype: '1'
                        },
                    })
                }
            })
    },
    mounted () {
        this.initForm()
        const query = this.$route.query
        if (query.token) this.getRgsLoginInfo(query.token)
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
    },
    methods: {
        ...mapActions(['login']),
        initForm () {
            const refs = this.$refs
            const loginWrapper = refs.loginWrapper
            loginWrapper.style.height = loginWrapper.clientHeight + 'px'

            const latelyAccount = JSON.parse(localGet('latelyAccount'))
            if (latelyAccount) {
                if (latelyAccount.accountNo.includes('@')) {
                    this.oldAccountNo.email = latelyAccount.accountNo
                } else {
                    this.oldAccountNo.phone = latelyAccount.accountNo
                }
                if (this.accountType === 'email') {
                    this.form.accountNo = this.oldAccountNo.email
                } else {
                    this.form.accountNo = this.oldAccountNo.phone
                }
            }
        },
        // 联系客服
        openService () {
            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.onlineService, title: this.$t('linkService') } })
        },
        // 验证登录验证码
        checkLoginVerifyCode () {
            return new Promise(resolve => {
                const { accountNo } = this.form
                if (this.loginType === 'password') return resolve(true)

                const params = {
                    'checkCode': this.form.checkCode,
                    'type': 'real'
                }

                if (accountNo.includes('@')) {
                    Object.assign(params, {
                        email: accountNo,
                        sendType: 'EMAIL',
                    })
                } else {
                    Object.assign(params, {
                        mobilePhone: accountNo,
                        mobilePhonePrefix: this.mobilePhonePrefix,
                        sendType: 'SMS',
                    })
                }

                checkLoginVerifyCode(params).then(res => {
                    if (res.check()) {
                        this.form.password = res.data.enPassword
                        resolve(true)
                    } else {
                        res.toast()
                        resolve(false)
                    }
                }).catch(err => {
                    console.log(err)
                    resolve(false)
                })
            })
        },
        // 登录
        loginHandle () {
            this.$refs.formWrap.validate()
                .then(async () => {
                    const checkCodeResult = await this.checkLoginVerifyCode()
                    return checkCodeResult
                })
                .then((res) => {
                    if (!res) return false
                    this.disabled = true
                    const latelyAccount = JSON.parse(localGet('latelyAccount'))
                    this.login({
                        'accountNo': this.form.accountNo,
                        'passWord': this.form.password,
                        'accountType': latelyAccount && latelyAccount.accountType ? latelyAccount.accountType : 'real',
                        'rawPassword': this.form.password.length !== 32,
                        'mobilePhonePrefix': this.mobilePhonePrefix
                    }).then(res => {
                        this.disabled = false
                        if (parseInt(res.code) === 1) {
                            this.wsLogin(res.data)

                            const infoVo = res.data.toKenCompanyInfoVo

                            relateCustomerNumber({
                                needRelatedCustomerNumbers: getLocalCustomer(infoVo.companyId)
                            })
                                .then(res => {
                                    console.log({ res })
                                })
                                .catch(error => {
                                    console.error(error)
                                })
                            setLocalCustomer(infoVo.accountNo || infoVo.accountDemoNo, infoVo.companyId)

                            // 保存设备唯一码
                            appGetImei().then(res => {
                                if (res) saveImei({ 'imei': res })
                            })

                            const userRiskInfoParams = {
                                accountNo: this.form.accountNo,
                                type: 2,
                                isLogin: 1
                            }
                            this.$store.dispatch('sendUserRiskInfo', userRiskInfoParams) // 调用指纹采集接口
                        } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40003' && res.errMsg.errMsg) {
                            const msg = res.errMsg.errMsg.retry <= 2 ? this.$t('loginTip.pwdError', { retry: res.errMsg.errMsg.retry }) : this.$t('loginTip.matchingError')
                            this.$alert(msg)
                        } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40042' && res.errMsg.errMsg) {
                            let unlockTime = res.errMsg.errMsg.unlock_time - Date.now()
                            unlockTime = unlockTime / 1000 / 60
                            this.$dialog.confirm({
                                title: '',
                                message: this.$t('loginTip.accountLock', { time: Math.ceil(unlockTime) }),
                                confirmButtonText: this.$t('linkService'), // 联系客服
                                cancelButtonText: this.$t('compLang.OK'), // 确定
                            }).then(() => {
                                this.openService()
                            }).catch(() => {
                                console.log(this.$t('compLang.close')) // 关闭
                            })
                        } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40005') {
                            const msg = this.$t('retMsg.ret_40005')
                            this.$alert(msg)
                        } else {
                            let msg = ''
                            if (this.$te('retMsg.' + res.msgCode)) {
                                msg = this.$t('retMsg.' + res.msgCode, { count: res.data })
                            } else {
                                msg = res.msg || res.message
                            }
                            msg = (msg == this.$t('loginFailure') ? '' : '，' + msg)
                            this.$alert(this.$t('loginFailure') + msg)
                        }
                    }).catch(err => {
                        this.disabled = false
                        console.log(err)
                        this.$alert(typeof (err) === 'string' ? err : err.toString())
                    })
                })
                .catch(({ errors, fileds }) => {
                    this.$toast(errors[0].message)
                })
        },
        wsLogin (data) {
            const loading = Toast.loading({
                mask: true,
                duration: 0,
                message: this.$t('logining')
            })
            const toKenCompanyInfoVo = data.toKenCompanyInfoVo
            const login_name = toKenCompanyInfoVo.accountType === 'real' ? toKenCompanyInfoVo.accountNo : toKenCompanyInfoVo.accountDemoNo
            const params = {
                login_name: login_name,
                password: this.form.password,
                rawPassword: this.form.password.length !== 32,
                company_id: toKenCompanyInfoVo.companyId,
                user_type: toKenCompanyInfoVo.accountType === 'real' ? 0 : 1 // 数据是反的
            }
            const $ws = this.$ws
            if ($ws.ws.readyState !== 1) {
                return this.$alert(this.$t('websocket.close'))
            }
            if ($ws.ws && $ws.ws.ping) clearInterval($ws.ws.ping) // 登录成功之前先不发心跳，不然服务器会返回请登录
            window['GroupSymbolList'] = []
            this.$store.commit('ix_quote/EMPTY_data') // 清空产品数据
            $ws.ws.userLoginInfoResult = false
            $ws.ws.groupSymbolListResult = false
            this.$mSocket.send('login', params).then(res => {
                if (res.errorType) {
                    loading.clear()
                    this.$alert(this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark)
                }
                localSet('latelyAccount', JSON.stringify({ accountNo: this.form.accountNo, accountType: toKenCompanyInfoVo.accountType })) // 缓存最近登录的账号
                const language = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
                let routerPath = process.env.NODE_ENV === 'development' || language === 'en-US' ? '/trade' : '/home'
                const routeFrom = sessionStorage.getItem('routeFrom')
                console.log(fromRouteName)
                if (this.$route.query.cb) {
                    routerPath = decodeURIComponent(this.$route.query.cb)
                } else if (routeFrom && routeFrom !== '/' && ['forgetCourse', 'Nest'].indexOf < 0) {
                    routerPath = routeFrom
                }
                this.$store.commit('ix_user/UPDATE_LOGINDATA', { accountNo: login_name, accountType: toKenCompanyInfoVo.accountType, passWord: this.form.password })
                if (this.isPC) {
                    this.$router.replace({ name: 'Layout' })
                } else {
                    this.$router.replace({ path: routerPath })
                }

                setTimeout(() => { // 登录成功后延迟关闭loading效果
                    loading.clear()
                }, 500)
            }).catch(error => {
                loading.clear()
                if (error && error.errorData && error.errorData.ret === 88) {
                    this.$alert(this.$t('websocket.linkError', { code: error.errorData.ret }))
                } else if (error.errorType === 'TimeOut') {
                    removeLoginData()
                    this.$alert(this.$t('loginTimeOut')).then(() => {
                        location.reload()
                    })
                } else {
                    console.log(error)
                }
            })
        },
        // 根据token获取登录信息，自动登录
        getRgsLoginInfo (token) {
            getRgsLoginInfo({ loginParams: token }).then(res => {
                const data = res.data
                if (data.appKey !== window['htmlKey'] || !data.loginName || !data.password) return
                this.accountNo = data.loginName
                this.password = data.password
                this.loginHandle()
            })
        },
        toRegister () {
            const companyInfo = this.$store.getters.companyInfo
            const uiPageList = companyInfo.uiPageList || {}
            const openRealAccount = uiPageList.openRealAccount
            const RegisterByEmail = uiPageList.RegisterByEmail
            const nextPath = { name: 'OpenAccount', params: { id: 'openreal' } }
            if (!openRealAccount && !RegisterByEmail) {
                return this.$toast({ message: this.$t('systemErrorTip'), duration: 1500 })
            }
            this.$router.push(nextPath)
        },
        // 返回页面
        goBack () {
            let routerPath = '/mine'
            const routeFrom = sessionStorage.getItem('routeFrom')
            if (routeFrom && routeFrom != '/') {
                routerPath = routeFrom
            }
            this.$router.push({ path: routerPath })
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
        getCheckCode (callback) {
            const isEmail = this.form.accountNo.includes('@')
            this.$refs.formWrap.validateField('accountNo').then(res => {
                return isEmail ? this.checkEmailIsExit() : this.checkRealMobileIsExit()
            }).then(res => {
                if (res === true) this.sendVerifyCode(callback)
                else if (typeof (res) === 'string') this.$toast(res)
            }).catch(({ errors, fileds }) => {
                this.$toast(errors[0].message)
            })
        },
        // 检查手机号是否存在
        checkRealMobileIsExit () {
            return checkMobileIsExit({ mobilePhone: this.form.accountNo, mobilePhonePrefix: this.mobilePhonePrefix })
                .then((bool) => {
                    if (bool) {
                        return true
                    } else {
                        this.$toast(this.$t('retMsg.ret_40005'))
                        return false
                    }
                })
                .catch((err) => err)
        },
        // 检查邮箱是否存在
        checkEmailIsExit () {
            return checkEmail(this.form.accountNo)
                .then((bool) => {
                    console.log(bool)
                    if (bool) {
                        return true
                    } else {
                        this.$toast(this.$t('retMsg.ret_40005'))
                        return false
                    }
                })
                .catch((err) => err)
        },
        // 发送短信验证码
        sendVerifyCode (callback) {
            const accountNo = this.form.accountNo
            let params = {
                mobilePhone: accountNo,
                mobilePhonePrefix: this.mobilePhonePrefix,
                sendType: 'SMS',
            }
            if (accountNo.includes('@')) {
                params = {
                    email: accountNo,
                    sendType: 'EMAIL',
                }
            }
            sendVerifyRealCode(params).then(result => {
                this.loading = false
                if (!result || result.code !== 1) {
                    const retMsgObj = this.$t('retMsg')
                    const msg = retMsgObj[result.msgCode] || result.msg || result.message
                    return this.$toast(msg)
                };
                const toastMsg = this.$t(accountNo.includes('@') ? 'registerInfo.validCodeSendedByEmail' : 'registerInfo.validCodeSendedByPhone')
                this.$toast({ message: this.$t(toastMsg), duration: 1500 })
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
                console.log(err)
                this.loading = false
                Toast({ message: this.$t('registerInfo.network'), duration: 1500 })
            })
        },
        handleAccountType (type) {
            if (this.accountType === type) {
                return
            }
            this.accountType = type
            this.$refs.formWrap.resetFields()
            this.form.accountNo = this.oldAccountNo[type]
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
.loginWrapper {
    position: relative;
    // padding-top: rem(60px);
    box-sizing: border-box;
    color: #333;
    background: #fff;
    .lang{
        float:right;
        font-size:14px;
        color:#888888;
        .lang-icon{
            width:23px;
            height:15px;
            display:inline-block;
            background-repeat: no-repeat;
            background-size:100%;
            position: relative;
            top: 2px;
            margin-left: 6px;
        }
        .cn{
            background-image:url(~@public/images/cn.png);
        }
        .en{
            background-image:url(~@public/images/en.png);
        }
    }
    .close {
        position: absolute;
        left: rem(20px);
        top: rem(18px);
        padding: 0 rem(10px);
        color: #333;
        font-size: rem(35px);
        @include active();
    }
    .floatBottom {
        position: absolute;
        bottom: rem(50px);
        left: 0;
        width: 100%;
        text-align: center;
        .icon_icon_service {
            font-size: rem(30px);
        }
    }
    ::v-deep{
        .pc{
            .form{
                .btnBox{
                    margin-bottom: 0;
                }
            }
        }
    }

    .account-type{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        margin: rem(60px) 0 0;
        font-size: rem(28px);
        >span{
            margin: 0 rem(28px);
            cursor: pointer;
            &:last-child{
                position: relative;
                &::before{
                    display: block;
                    position: absolute;
                    left: rem(-28px);
                    top: 50%;
                    width: 0;
                    height: rem(24px);
                    content: '';
                    border-left: 1px solid #EBEDF0;
                    transform: translate(0,-50%);
                    cursor: default;
                }
            }

            &.active{
                color: #477FD2;
            }
        }
    }
}
// .loginTypeWrapper{
//     margin: rem(74px) auto rem(50px);
//     width: rem(580px);
//     ::v-deep {
//         .van-tabs__nav,.van-tabs__wrap{
//             height: rem(60px);
//             line-height: rem(60px);
//             border: 0;
//             border-radius: rem(60px);
//             overflow: hidden;
//         }
//         .van-tab{
//             height: rem(60px);
//             line-height: rem(60px);
//             font-size: rem(28px);
//         }
//     }
// }
.flexRow {
    position: relative;
    display: flex;
    width: 100%;
    // border-bottom: 1px solid #f5f5f5;
    // height: rem(120px);
    font-size: 0;
    align-items: center;
    // margin: rem(50px) 0;
    .hd {
        width: rem(58px);
        text-align: center;
        color: #999;
        font-size: rem(26px);
    }
    .bd {
        flex: 1;
        position: relative;
    }
    .inputClear {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -17%);
        opacity: 0.5;
    }
    .label {
        display: block;
        font-size: rem(20px);
        font-weight: 300;
        color: rgba(196, 196, 196, 1);
        line-height: rem(20px);
    }
}
.form {
    font-size: rem(26px);
    .legend {
        padding-top: rem(50px);
        padding-left: rem(28px);
        font-size: rem(50px);
        line-height: 1;
        font-weight: 500;
    }
    .fieldset {
        // margin-top: rem(58px);
        background: #fff;
        border-radius: rem(10px);
    }
    .input {
        width: 100%;
        border: 0;
        height: rem(75px);
        line-height: rem(40px);
        font-size: rem(28px);
        color: #333;
        text-indent: 0;
        font-size: rem(28px);
        box-shadow: 0 0 999px #fff inset;
    }
    .btnBox {
        width: 100%;
        margin: rem(94px) auto rem(60px);
        padding: 0 rem(45px);
        text-align: center;
        .blockBtn {
            margin-bottom: rem(40px);
            display: block;
            width: 100%;
            height: rem(80px);
            line-height: rem(80px);
            border-radius: rem(40px);
            text-align: center;
            color: #fff;
            font-size: rem(34px);
            background-color: #477fd3;
            box-sizing: border-box;
            @include active();
            cursor: pointer;
            &:disabled {
                background: #f0f0f0 !important;
                color: #bdbdbd;
            }

            &.plain{
                background: #fff;
                border: 1px solid #477fd3;
                color: #477fd3;
            }
        }
        .link {
            display: inline-block;
            vertical-align: middle;
            font-size: rem(28px);
        }
        .line {
            display: inline-block;
            color: #e3e3e3;
            padding: 0 rem(36px);
        }
    }
}
</style>
