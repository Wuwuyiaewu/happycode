<template>
    <div id='app'>
        <!-- <keep-alive :include="cachedViews"> -->
        <router-view class='pageRouter' />
        <!-- </keep-alive> -->
        <notify-msg />
        <TasteDialog v-model='showRegister' />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getLoginData, localGet, localRemove, autoLoginKey, getQueryVariable, localSet, guid, deviceType } from '@/utils/index'
import { openRealGoldExperienceAccount } from '@/api/user/accountApi'
import { configSystem } from '@/api/base'
import notifyMsg from '@pc/layout/Notify/NotifyMsg'
import CryptoJS from 'crypto-js'
import { autoLoginKeyCodeList } from '@/config'
import TasteDialog from '@m/layout/TasteDialog'
let loadedGuestToken = false // 获取游客token
let connectedWS = false // 连接websocket （获取到游客token和连接websocket之后，开始登陆游客模式）
checkLoginTime() // 先检测登录有效时间
// 检查登录有效时间
function checkLoginTime () {
    const loginTime = localGet('loginTime') || 0 // 登录有效时间
    const loginData = getLoginData()
    if (!loginData) return
    if (Date.now() - loginData.lastActivityTime > loginTime * 1) {
        localRemove('loginData')
    }
}
// 被app内嵌，不需要链接ws的页面列表

export default {
    name: 'App',
    components: {
        notifyMsg,
        TasteDialog
    },
    data () {
        return {
            isMobile: window.isIPhone || window.isAndroid,
            showRegister: false,
            tasteTimer: null
        }
    },
    computed: {
        ...mapGetters(['companyInfo', 'userInfo', 'userType']),
        ...mapState({
            product_category: (state) => state.ix_quote.product_category,
            product_map: (state) => state.ix_quote.product_map,
            userLoginInfo: (state) => state.ix_user.userLoginInfo,
        }),
        cachedViews () {
            return this.$store.state.tagsView.cachedViews
        },
    },
    watch: {
        $route () {
            this.addTags()
        },
    },
    created () {
        window.vm = this
        configSystem().then(res => {
            if (res && res.maintenance === true && window.htmlKey !== 'yzkey') location.href = `/upgrading.html?back=${encodeURIComponent(location.href)}`
        })
        if (this.$socket) {
            this.$socket.onopen = () => {
                connectedWS = true
                if (loadedGuestToken) this.$ws.send_wsLogin()
            }
        }
        const pwd = guid().slice(0, 8) // uuid随机生成8位数的密码
        this.openRealGoldExperienceAccount({ pwd })
            .then(res => {
                this.addTags(this.$route)
                this.getAccountParams() // 优先获取账号信息
                this.getAppInfo()
            })
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
    },
    beforeDestroy () {
        clearInterval(this.$socket.ping)
        delete this.$options.sockets.onmessage
    },
    methods: {
        addTags () {
            const { name } = this.$route
            if (name) {
                this.$store.dispatch('tagsView/addView', this.$route)
            }
            return false
        },
        showTasteDialog () {
            if (this.tasteTimer) {
                window.clearTimeout(this.tasteTimer)
            }
            this.showRegister = true
        },
        getAppInfo () {
            const loginData = getLoginData()
            let loginParams
            if (loginData && loginData.accountNo !== 'real') {
                loginParams = {
                    accountNo: loginData.accountNo,
                    passWord: loginData.passWord,
                    accountType: loginData.accountType,
                    rawPassword: loginData.passWord?.length !== 32,
                }
                if (loginData.accountNo && !loginData.accountNo.includes('@') && loginData.mobilePhonePrefix) {
                    loginParams.mobilePhonePrefix = loginData.mobilePhonePrefix
                }
            }
            this.loginHandle(loginParams)
        },
        /** 手动调用登录
         *  如果是刷新页面，则先登录http接口，然后登陆websocket
         *  否则，则直接登陆websocket
         */
        handleLogin () {
            // const guest = this.$route.meta && this.$route.meta.roles && this.$route.meta.roles.includes('Guest');
            if (!connectedWS || !loadedGuestToken) return
            const loginData = getLoginData()
            if (loginData) {
                // 真实账号登录
                this.autoLogin()
            } else {
                // 游客登录websocket
                this.$ws.send_wsLogin()
            }
        },
        // 刷新页面时，自动登陆
        autoLogin () {
            const loginData = getLoginData()
            if (loginData) {
                loginData.rawPassword = loginData.passWord.length !== 32
                this.loginHandle(loginData)
            }
        },
        // 登录
        loginHandle (params) {
            this.$ws.httpLogin(params).then((result) => {
                // 获取语言文件包
                loadedGuestToken = true

                if (result && connectedWS) this.$ws.send_wsLogin()
            })
        },
        wsMessage (evt) {
            // debugger
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }

            let { msg_code, code, content, remark } = JSON.parse(evt.data)
            if (content && typeof content === 'string') content = JSON.parse(content)
            if (
                msg_code &&
                msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()
            ) {
                this.$bus.$emit('USER_AUTO_LOGIN_END')
                if (code !== '0000') {
                    this.$toast(this.$t('loginFailure') + remark)
                }
            }
        },
        openRealGoldExperienceAccount (data) {
            return new Promise((resolve, reject) => {
                const sourceParams = window.location.search
                const loginData = getLoginData()

                // if (!loginData || (loginData && loginData.accountType !== 'real')) {
                //     const storageKey = 'tasteTime__' + window.htmlKey
                //     // 如果url有传入taste为cats,并且当前没有真实账号信息
                //     if (getQueryVariable('taste', sourceParams) === 'cats') {
                //         sessionStorage.setItem(storageKey, Date.now())
                //         this.tasteTimer = window.setTimeout(() => {
                //             sessionStorage.removeItem(storageKey)
                //             this.showTasteDialog()
                //         }, 5 * 60 * 1000)
                //     } else if (sessionStorage.getItem(storageKey)) {
                //         const remainingTime = Date.now() - sessionStorage.getItem(storageKey)
                //         const isValid = remainingTime < 5 * 60 * 1000
                //         if (isValid) {
                //             sessionStorage.setItem(storageKey, Date.now())
                //             this.tasteTimer = window.setTimeout(() => {
                //                 sessionStorage.removeItem(storageKey)
                //                 this.showTasteDialog()
                //             }, 5 * 60 * 1000)
                //         } else {
                //             sessionStorage.removeItem(storageKey)
                //         }
                //     }
                // }
                // 如果url有传入taste为cats,并且当前没有真实账号信息
                // if (getQueryVariable('taste', sourceParams) === 'cats' &&
                //     (!loginData || (loginData && loginData.accountType !== 'real'))) {
                //     this.tasteTimer = window.setTimeout(() => {
                //         this.showTasteDialog()
                //     }, 5 * 60 * 1000)
                // }

                if (getQueryVariable('experience', sourceParams)) {
                    if (loginData) {
                        loginData.accountType = 'demo'
                        localSet('loginData', JSON.stringify(loginData))
                        resolve()
                        return
                    }
                } else {
                    resolve()
                    return
                }

                // const openAccountLoading = this.$toast.loading({
                //     forbidClick: true,
                //     message: this.$t('activity.creatAccount')
                // })
                // const sourceParams = sessionStorage.getItem('sourceParams')
                const params = {
                    openFrom: getQueryVariable('taste', sourceParams) === 'cats' ? 'office_website' : deviceType()
                }
                if (sourceParams && sourceParams.includes('utm')) {
                    params.utmcsr = getQueryVariable('utm_source', sourceParams)
                    params.utmcmd = getQueryVariable('utm_medium', sourceParams)
                    params.utmccn = getQueryVariable('utm_campaign', sourceParams)
                    params.utmcct = getQueryVariable('utm_content', sourceParams)
                    params.utmctr = getQueryVariable('utm_term', sourceParams)
                }
                openRealGoldExperienceAccount(Object.assign({ pwd: data.pwd }, params))
                    .then(res => {
                        if (res.code != 1) {
                            this.$toast({
                                duration: 1000,
                                message: this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg,
                            })
                            resolve()
                            // openAccountLoading.clear()
                            return
                        }
                        localSet('loginData', JSON.stringify({ accountNo: res.data.email, passWord: data.pwd, accountType: 'demo' }))
                        // openAccountLoading.clear()
                        window.setTimeout(resolve(), 500)
                    })
                    .catch(error => {
                        console.log(error)
                        // openAccountLoading.clear()
                        resolve()
                    })
            })
        },
        // 获取url上加密的账号信息
        getAccountParams () {
            const sourceParams = window.location.search
            let t = getQueryVariable('t', sourceParams)
            if (!t) return null
            t = decodeURIComponent(t)
            const key = autoLoginKey(autoLoginKeyCodeList)
            let bytes = CryptoJS.AES.decrypt(decodeURIComponent(t), key)
            try {
                bytes = bytes.toString(CryptoJS.enc.Utf8)
            } catch (error) {
                bytes = null
                console.log(error)
            }
            console.log(bytes)
            if (!bytes) return null
            const params = JSON.parse(bytes)
            const loginData = getLoginData() || {}
            loginData.accountNo = params.username
            loginData.passWord = params.pwd
            loginData.accountType = 'real'
            localSet('loginData', JSON.stringify(loginData))
        }
    },
}
</script>

<style lang="scss">
@import "~@pc/sass/global.scss";
@import "~@/fonts/iconfont.css";
@import "~@/fonts/iconfont-pc.css";
html {
    font-size: 40px;
}
body {
    font-size: 12px;
}
.pageRouter {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
