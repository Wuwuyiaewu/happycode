<template>
    <div ref='loginWrapper' class='loginWrapper'>
        <FormAccount :show-close='!isYk' :show-yk='isYk'>
            <template slot='title'>
                {{ $t("login") }}
            </template>
            <div class='form'>
                <!-- <p class="legend">{{$t('login')}}</p> -->
                <div class='fieldset'>
                    <FormWrap ref='formWrap' :model='form' :rules='rules'>
                        <FormItem prop='accountNo'>
                            <FormInput
                                v-model.trim='form.accountNo'
                                clearable
                                :label="$t('phoneOrEmail')"
                                :placeholder="$t('phoneOrEmail')"
                            />
                        </FormItem>

                        <FormItem prop='password'>
                            <FormInput
                                v-model.trim='form.password'
                                clearable
                                :label="$t('password')"
                                :placeholder="$t('password')"
                                show-password
                                type='password'
                            />
                        </FormItem>
                    </FormWrap>
                </div>
                <div class='btnBox'>
                    <button class='blockBtn' type='button' @click='loginHandle'>
                        {{ $t("login") }}
                    </button>
                    <a
                        v-if='uiPageList && (uiPageList.openRealAccount || uiPageList.openDemoAccount || uiPageList.RegisterByEmail)'
                        class='link mainColor'
                        href='javascript:;'
                        @click='toRegister'
                    >
                        {{ $t("welltoregister") }}
                    </a>
                    <span
                        v-if='uiPageList && (uiPageList.openRealAccount || uiPageList.openDemoAccount || uiPageList.RegisterByEmail)'
                        class='line'
                    >
                        |
                    </span>
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'external'"
                        class='link mainColor'
                        :to="{
                            name: 'Nest',
                            params: { id: 'queryinfo' },
                            query: { url: ad.url, title: $t('forgetpassword') },
                        }"
                    >
                        {{ $t("forgetpassword") }}
                    </router-link>
                    <!-- 找回密码 forgetEntry -->
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'interior'"
                        class='link mainColor'
                        :to="{
                            name: 'forgetCourse',
                            params: {
                                phone: 'empty',
                                email: 'default',
                                type: 'real',
                                account: 'empty',
                            },
                        }"
                    >
                        {{ $t("forgetpassword") }}
                    </router-link>
                </div>
                <div class='service'>
                    <a @click='serviceShow = true'>
                        <i class='icon_icon_service'></i>
                        {{ $t("linkService") }}
                    </a>
                </div>
            </div>
        </FormAccount>
        <!-- <a href="javascript:;" class="close" @click="goBack">
            <i class="icon_icon_close_big" />
        </a>-->
        <OnlineService :is-home='false' :service-show='serviceShow' @online='serviceShow = false' />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast, Icon } from 'vant'
import { getRgsLoginInfo } from '@/api/base'
import { getLoginData, removeLoginData, localSet, localGet } from '@/utils/index'
import OnlineService from '@m/modules/onlineService'
import FormAccount from '@pc/modules/formAccount'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import { REGEXPDATA } from '@/utils/regExp'

export default {
    name: 'Login',
    components: {
        [Icon.name]: Icon,
        OnlineService,
        FormAccount,
        FormWrap,
        FormItem,
        FormInput,
    },
    // 未登录状态才进入
    beforeRouteEnter (to, from, next) {
        console.log('getLoginData()', getLoginData())
        next(getLoginData() ? { name: 'Home' } : true)
    },
    data () {
        const accountNoValidator = (() => {
            if (window.uatService !== 'testapi.ixmiddle.com') {
                return (rule, value, callback) => {
                    if (!REGEXPDATA.phone.test(value)) {
                        return callback(this.$t('form.rule.phoneFormat'))
                    }
                    return callback()
                }
            } else {
                return (rule, value, callback) => {
                    if (REGEXPDATA.phone.test(value) || REGEXPDATA.email.test(value)) {
                        return callback()
                    }
                    if (!REGEXPDATA.phone.test(value)) {
                        return callback(this.$t('form.rule.phoneFormat'))
                    }
                    if (!REGEXPDATA.email.test(value)) {
                        return callback(this.$t('form.rule.emailFormat'))
                    }
                }
            }
        })()

        return {
            disabled: false,
            form: {
                accountNo: '',
                password: '',
            },
            rules: {
                accountNo: [
                    { required: true, message: this.$t('phoneEmpty'), trigger: 'input' },
                    { validator: accountNoValidator, trigger: 'change' },
                ],
                password: [
                    {
                        required: true,
                        message: this.$t('passwordEmpty'),
                        trigger: 'input',
                    },
                    {
                        max: 16,
                        message: this.$t('retMsg.A_PASSWORD_RULE_ERRER'),
                        trigger: 'input',
                    },
                ],
            },
            serviceShow: false,
        }
    },
    computed: {
        ...mapGetters(['companyInfo']),
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
        isYk () {
            if (location.href.indexOf('url_source') > -1) {
                return true
            } else {
                return false
            }
        },
    },
    created () {
        this.$options.sockets.onmessage = this.wsLoginResult
        if (this.loginReload) {
            location.reload()
        }
        if (this.$route.query.phone) {
            this.form.accountNo = this.$route.query.phone
        }
    },
    mounted () {
        this.initForm()
        const query = this.$route.query
        if (query.token) this.getRgsLoginInfo(query.token)
        const _this = this
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
                this.form.accountNo = latelyAccount.accountNo
            }
        },
        // 联系客服
        openService () {
            this.$router.push({
                name: 'Nest',
                params: { id: 'queryinfo' },
                query: { url: this.onlineService, title: this.$t('linkService') },
            })
        },
        // 登录
        loginHandle () {
            this.$refs.formWrap
                .validate()
                .then(() => {
                    this.disabled = true
                    this.login({
                        accountNo: this.form.accountNo,
                        passWord: this.form.password,
                        accountType: 'real',
                    })
                        .then((res) => {
                            this.disabled = false
                            if (parseInt(res.code) === 1) {
                                this.wsLogin(res.data)
                                
                            } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40003' && res.errMsg.errMsg) {
                                const msg =
                                    res.errMsg.errMsg.retry <= 2
                                        ? this.$t('loginTip.pwdError', {
                                            retry: res.errMsg.errMsg.retry,
                                        })
                                        : this.$t('loginTip.matchingError')
                                this.$alert(msg)
                            } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40042' && res.errMsg.errMsg) {
                                let unlockTime = res.errMsg.errMsg.unlock_time - Date.now()
                                unlockTime = unlockTime / 1000 / 60
                                this.$dialog
                                    .confirm({
                                        title: '',
                                        message: this.$t('loginTip.accountLock', {
                                            time: Math.ceil(unlockTime),
                                        }),
                                        confirmButtonText: this.$t('linkService'), // 联系客服
                                        cancelButtonText: this.$t('compLang.OK'), // 确定
                                    })
                                    .then(() => {
                                        this.openService()
                                    })
                                    .catch(() => {
                                        console.log(this.$t('compLang.close')) // 关闭
                                    })
                            } else if (res.code === 2 && res.errMsg && res.errMsg.ret === '40005') {
                                const msg = this.$t('retMsg.ret_40005')
                                this.$alert(msg)
                            } else {
                                let msg = ''
                                if (this.$te('retMsg.' + res.msgCode)) {
                                    msg = this.$t('retMsg.' + res.msgCode)
                                } else {
                                    msg = res.msg || res.message
                                }
                                msg = msg == this.$t('loginFailure') ? '' : '，' + msg
                                this.$alert(this.$t('loginFailure') + msg)
                            }
                        })
                        .catch((err) => {
                            this.disabled = false
                            console.log(err)
                            this.$alert(typeof err === 'string' ? err : err.toString())
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
                message: this.$t('logining'),
            })
            const toKenCompanyInfoVo = data.toKenCompanyInfoVo
            const login_name = toKenCompanyInfoVo.accountType === 'real' ? toKenCompanyInfoVo.accountNo : toKenCompanyInfoVo.accountDemoNo
            const params = {
                login_name: login_name,
                password: this.form.password,
                company_id: toKenCompanyInfoVo.companyId,
                user_type: toKenCompanyInfoVo.accountType === 'real' ? 0 : 1, // 数据是反的
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
            this.$mSocket
                .send('login', params)
                .then((res) => {
                    if (res.errorType) {
                        loading.clear()
                        this.$alert(this.$te('retMsg.' + res.errorData.ret) ? this.$t('retMsg.' + res.errorData.ret) : res.remark)
                    }
                    localSet('latelyAccount', JSON.stringify({ accountNo: this.form.accountNo })) // 缓存最近登录的账号
                    const language = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
                    let routerPath = process.env.NODE_ENV === 'development' || language === 'en-US' ? '/home' : '/home'
                    const routeFrom = sessionStorage.getItem('routeFrom')
                    if (this.$route.query.cb) {
                        routerPath = decodeURIComponent(this.$route.query.cb)
                    } else if (routeFrom && routeFrom != '/') {
                        routerPath = routeFrom
                    }
                    
                    localStorage["loginData"] = {
                        accountNo: login_name,
                        accountType: toKenCompanyInfoVo.accountType,
                        passWord: this.form.password,
                    }
                    this.$store.commit('ix_user/UPDATE_LOGINDATA', {
                        accountNo: login_name,
                        accountType: toKenCompanyInfoVo.accountType,
                        passWord: this.form.password,
                    })
                    // this.$router.replace({ path: routerPath })
                    this.$router.push({ name: 'Layout' })
                    setTimeout(() => {
                        // 登录成功后延迟关闭loading效果
                        loading.clear()
                    }, 500)
                })
                .catch((error) => {
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
            getRgsLoginInfo({ loginParams: token }).then((res) => {
                const data = res.data
                if (data.appKey !== window['htmlKey'] || !data.loginName || !data.password) return
                this.accountNo = data.loginName
                this.password = data.password
                this.loginHandle()
            })
        },
        toRegister () {
            const companyInfo = this.$store.getters.companyInfo
            const uiPageList = companyInfo.uiPageList
            const openRealAccount = uiPageList.openRealAccount
            const RegisterByEmail = uiPageList.RegisterByEmail
            const nextPath = { name: 'OpenAccount', params: { id: 'openreal' } }
            // if (!openRealAccount && !RegisterByEmail) {
            //   return this.$toast({
            //     message: this.$t("systemErrorTip"),
            //     duration: 1500,
            //   })
            // }
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
        closeService () {
            this.serviceShow = false
        },
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
    .service {
        color: #477fd3;
        text-align: center;
        cursor: pointer;
    }
}
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
            cursor: pointer;
            @include active();

            &:disabled {
                background: #f0f0f0 !important;
                color: #bdbdbd;
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
