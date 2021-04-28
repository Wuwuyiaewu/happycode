<template>
    <div class='iframe'>
        <iframe
            ref='iframe'
            frameborder='0'
            height='100%'
            leftmargin='0'
            marginheight='0'
            marginwidth='0'
            :name='name'
            scrolling='auto'
            topmargin='0'
        ></iframe>
    </div>
</template>

<script>
import { encrypt } from '@/utils/index'
export default {
    name: 'Iframe',
    props: {
        pageName: {
            default: '',
            type: String
        },
        pageUrl: {
            default: '',
            type: String
        }
    },
    data () {
        return {
            name: 'iframe' + new Date().getTime(),
            iframeDom: null,
            historyLength: -1,
            pageWidth: 0,
            appScheme: '',
            loginSuccessCallback: []
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.transBaseConfigVo : {}
        },
    },
    created () {
        this.pageWidth = document.body.clientWidth
        window['appScheme'] = (data) => {
            this.appScheme = data
        }
        if (window.JsHook && window.JsHook.appScheme) {
            this.appScheme = window.JsHook.appScheme()
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appScheme) {
            return window.webkit.messageHandlers.appScheme.postMessage('')
        }
    },
    mounted () {
        this.historyLength = window.history.length
        this.iframeDom = this.$refs.iframe
        this.iframeDom.width = this.pageWidth + 'px'
        this.iframeDom.src = this.showUrl(this.pageUrl)
        if (this.pageName === 'homePage') {
            window.addEventListener('message', (ev) => (this.fnPostMessage(ev, this.pageName)))
        } else {
            window.onmessage = (ev) => (this.fnPostMessage(ev, this.pageName))
        }
        if (this.pageName === 'homePage') {
            window.setTimeout(() => { this.routerChange(this.$route.name) }, 3000)
        }

        if (this.iframeDom.attachEvent) {
            this.iframeDom.attachEvent('onload', (ev) => {
                this.$emit('onload')
                if (this.pageName === 'homePage') {
                    this.routerChange(this.$route.name)
                }
            })
            this.iframeDom.attachEvent('onerror', (ev) => {
                this.$emit('onerror')
            })
        } else {
            this.iframeDom.onload = (ev) => {
                this.$emit('onload')
                if (this.pageName === 'homePage') {
                    this.routerChange(this.$route.name)
                }
            }
            this.iframeDom.onerror = (ev) => {
                this.$emit('onerror')
            }
        }

        this.$bus.$on('USER_AUTO_LOGIN_END', () => {
            console.log('USER_AUTO_LOGIN_END')
            if (this.loginSuccessCallback.length > 0) {
                this.loginSuccessCallback.forEach(item => {
                    window.setTimeout(() => {
                        item.fn(item.params)
                    }, 0)
                })
            }
            this.loginSuccessCallback = []
        })
    },
    beforeDestroy () {
        if (this.pageName === 'homePage') {
            window.removeEventListener('message', (ev) => (this.fnPostMessage(ev, this.pageName)))
        }
    },
    methods: {
        getURLPara (name, url) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var rev = url.match(reg)
            if (rev != null) {
                return decodeURI(rev[2])
            }
            return null
        },
        // ws登录，和login.vue页面的wsLogin方法相同
        wsLogin (data, loginParams) {
            const loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: this.$t('logining')
            })
            const toKenCompanyInfoVo = data.toKenCompanyInfoVo
            const login_name = toKenCompanyInfoVo.accountType === 'real' ? toKenCompanyInfoVo.accountNo : toKenCompanyInfoVo.accountDemoNo
            const params = {
                login_name: login_name,
                password: loginParams.passWord,
                company_id: toKenCompanyInfoVo.companyId,
                user_type: toKenCompanyInfoVo.accountType === 'real' ? 0 : 1 // 数据是反的
            }
            const $ws = this.$ws
            if ($ws.ws.readyState !== 1) {
                return this.$alert(this.$t('websocket.close'))
            }
            if ($ws.ws.ping) clearInterval($ws.ws.ping) // 登录成功之前先不发心跳，不然服务器会返回请登录
            this.$mSocket
                .send('login', params)
                .then(res => {
                    console.log(res)
                    if (res.errorType) {
                        loading.clear()
                        const msg = retMsg(res.errorData.ret)
                        return this.$alert(msg || res.remark)
                    }
                    this.$store.commit('ix_user/UPDATE_LOGINDATA', { accountNo: login_name, accountType: toKenCompanyInfoVo.accountType, passWord: loginParams.passWord })
                    this.$router.replace({ name: 'Home' })
                    setTimeout(() => {
                        // 登录成功后延迟关闭loading效果
                        loading.clear()
                    }, 500)
                })
                .catch(error => {
                    loading.clear()
                    if (error && error.errorData && error.errorData.ret === 88) {
                        this.$alert(this.$t('websocket.linkError', { code: error.errorData.ret }))
                    } else if (error.errorType === 'TimeOut') {
                        this.$alert(this.$t('loginTimeOut'))
                    } else {
                        console.log(error)
                    }
                })
        },
        updateUserInfo (accountNo) {
            const userInfo = this.$store.getters.userInfo
            const newUserInfo = JSON.parse(JSON.stringify(userInfo))
            newUserInfo.toKenCompanyInfoVo.accountNo = accountNo
            this.$store.commit('ix_user/UPDATE_INFO', newUserInfo)
        },
        setIframeUrl (url) {
            // this.iframeDom.setAttribut('src', this.showUrl(url))
            this.iframeDom.src = this.showUrl(url)
        },
        showUrl (url) {
            let sourceParams = window.sessionStorage.getItem('sourceParams') ? window.sessionStorage.getItem('sourceParams').substring(1) : ''
            sourceParams = sourceParams.replace('pagewidth', 'pagewidth11') // 废弃缓存里面sourceParams中的pagewidth字段，使用下面新的字段
            const lang = localStorage['lang']
            if (url && url != 'about:blank') {
                return `${url}${url.indexOf('?') > 0 ? '&' : '?'}pagewidth=${this.pageWidth}&isprd=${isPRD}&${sourceParams}&lang=${lang}`
            } else {
                return url
            }
        },
        routerChange (name) {
            this.iframeDom.contentWindow.postMessage({ type: 'routerChange', data: { name: name } }, '*')
        },
        configChange (data) {
            this.iframeDom.contentWindow.postMessage({ type: 'configChange', data: data }, '*')
        },
        fnPostMessage (ev, pageName) {
            const data = ev.data || {}
            if (['getDeviceInfo', 'getAppToken'].indexOf(data.type) < 0 && pageName === 'homePage' && this.$route.name != 'Home') {
                return
            }
            if (data.type === 'toPage') {
                if (data.data.name === 'NestAccess') {
                    if (data.data.params && data.data.params.id) {
                        if (data.data.params.id == 'deposit') {
                            this.$router.push({ name: 'DepositFunds' })
                        } else if (data.data.params.id == 'drawings') {
                            this.$router.push({ name: 'WithAmount' })
                        } else {
                            this.$router.push({ name: 'Nest', params: { id: data.data.params.id } })
                        }
                    }
                } else {
                    this.$router.push(data.data)
                }
            } else if (data.type === 'getDeviceInfo') {
                try {
                    this.iframeDom.contentWindow.postMessage({
                        type: 'deviceInfo',
                        data: { key: this.getURLPara('encrypName', this.pageUrl) }
                    }, '*')
                } catch (e) { console.log(e) }
            } else if (data.type === 'getAppToken') {
                try {
                    if (!this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo) {
                        // 还没登陆成功
                        this.loginSuccessCallback.push({ fn: this.fnPostMessage, params: ev })
                        return
                    }
                    const transBaseConfigVo = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo || {}
                    const toKenCompanyInfoVo = this.$store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo || {}
                    let _data = {
                        authorization: window.sessionStorage.getItem('authorization__' + htmlKey),
                        sourceParams: window.sessionStorage.getItem('sourceParams'),
                        appKey: transBaseConfigVo.appKey,
                        apiToken: toKenCompanyInfoVo.apiToken,
                        openId: toKenCompanyInfoVo.openId,
                        loginName: toKenCompanyInfoVo.loginName,
                        mobilePhone: toKenCompanyInfoVo.mobilePhone,
                        accountType: toKenCompanyInfoVo.accountType,
                        accountNo: toKenCompanyInfoVo.customerId,
                        userId: toKenCompanyInfoVo.accountNo,
                        companyId: transBaseConfigVo.companyId,
                        origin: window.location.origin,
                        serviceUrl: window.serviceUrl,
                        appScheme: this.appScheme,
                        orColorType: this.$store.state.userConfigInfo.type // 1 绿涨红跌，2 红涨绿跌
                    }
                    if (data.data && data.data.encrypt) {
                        _data = {
                            mobilePhone: encrypt(toKenCompanyInfoVo.mobilePhone),
                            accountNo: encrypt(toKenCompanyInfoVo.customerId),
                        }
                    }
                    this.iframeDom.contentWindow.postMessage({
                        type: 'appToken',
                        data: _data
                    }, '*')
                } catch (e) { console.log(e) }
            } else if (data.type === 'fullpage') {
                if (data.data && data.data.url) {
                    window.location.href = data.data.url
                }
            } else if (data.type === 'back') {
                this.$router.go(this.historyLength - window.history.length - 1)
            } else if (data.type === 'addAccountNo') {
                /* window.top.postMessage({type:'addAccountNo',data:{accountNo:账号}},'*')
                *  "accountNo": 账号,
                *
                * */
                if (data.data && data.data.accountNo) {
                    this.updateUserInfo(data.data.accountNo)
                    this.$router.replace({ name: 'TradeIndex' })
                    this.$ws.send_switchAccount()
                }
            } else if (data.type === 'autoLogin') {
                /* window.top.postMessage({type:'autoLogin',data:{accountNo:账号，passWord：密码}},'*')
               *  "accountNo": 账号,
               *  "passWord": 密码
               *
               * */
                if (data.data && data.data.accountNo) {
                    this.$ws.httpLogin(data.data).then(result => {
                        if (result) this.wsLogin(result, data.data)
                    })
                }
            } else if (data.type === 'onlineService') {
                if (this.accountInfo.onlineService) {
                    this.$router.replace({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.accountInfo.onlineService, title: this.$t('linkService') } })
                }
            } else if (data.type === 'queryAccountInfo') {
                this.$ws.send('Accounts')
            } else if (data.type === 'getGroupSymbolList') {
                var groupSymbolList = JSON.parse(sessionStorage.getItem('GroupSymbolList') || '[]')
                this.iframeDom.contentWindow.postMessage({
                    type: 'groupSymbolList',
                    data: groupSymbolList.map(item => ({
                        code_id: item.code_id,
                        short_name: item.short_name,
                        simplified: item.simplified,
                        digit: item.digit,
                    }))
                }, '*')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.iframe {
    height: 100%;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
