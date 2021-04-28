import { isAPP, appGoHome, appGoLogin, appGoDeposit, appAccountLogin } from '@m/base/appHybrid'
export default {
    methods: {
        // 登录
        autoLogin (callback) {
            const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1'))
            const openAccount = JSON.parse(sessionStorage.getItem('openAccount'))
            if (!registerStep1 || !openAccount) {
                return this.$router.push({ name: 'Login' })
            }
            this.loading = true
            const account = openAccount.account
            const passWord = registerStep1.passWord || account.enPassword
            const params = {
                accountNo: account.mobile || account.email,
                passWord: passWord,
                rawPassword: passWord?.length !== 32,
                accountType: 'real'
            }

            if (account.mobile) {
                params.mobilePhonePrefix = this.$store.state.mobilePhonePrefix
            }
            this.$ws.httpLogin(params).then(result => {
                this.loading = false
                if (result) {
                    params._loadMsg = ''
                    this.wsLogin(result, params, () => {
                        if (callback) {
                            callback()
                        }
                    })

                    const userRiskInfoParams = {
                        accountNo: params.accountNo,
                        type: 2
                    }
                    this.$store.dispatch('sendUserRiskInfo', userRiskInfoParams) // 调用指纹采集接口
                }
            }).catch((err) => {
                console.log('err', err)
                this.loading = false
            })
        },
        // 点击立即体验按钮
        clickTry (url) {
            const registerStep1 = JSON.parse(sessionStorage.getItem('registerStep1'))
            const openAccount = JSON.parse(sessionStorage.getItem('openAccount'))
            const account = openAccount.account
            const passWord = registerStep1.passWord || account.enPassword
            if (isAPP) {
                let toNext = '' // APP登录后跳转的地址
                switch (url) {
                case '/deposit':
                    toNext = 'appGoDeposit'
                    break
                case '/trade':
                    toNext = 'appGoQuote'
                    break
                case '/onlineService':
                    toNext = 'appGoCS'
                    break
                default:
                    toNext = ''
                    break
                }
                appAccountLogin(this.$store.state.mobilePhonePrefix, account.mobile || account.email, passWord, toNext) // APP登录
                return false
            }
            if (this.userLoginInfo && this.userLoginInfo.account_id) {
                this.goNext(url)
            } else {
                // this.autoLogin(this.goHome.bind(this));
                this.autoLogin(() => {
                    this.goNext(url)
                })
            }
        },
        goNext (url) {
            if (url === '/deposit') {
                this.goDeposit()
            } else if (url === '/onlineService') {
                this.openService()
            } else {
                this.$router.replace({ path: url })
            }
        },
        adClick (url, openType) {
            if (openType === 'openRealAccount') {
                const prophetObj = {
                    '/trade': ['trackEvent', '注册', '手机注册', '手机注册_立即体验', 9],
                    '/deposit': ['trackEvent', '注册', '手机注册', '手机注册_去存款', 10],
                    '/onlineService': ['trackEvent', '注册', '手机注册', '手机注册_在线客服', 11],
                }
                prophetObj[url] && this.$prophet(prophetObj[url])
            } else if (openType === 'RegisterByEmail') {
                const prophetObj = {
                    '/trade': ['trackEvent', '注册', '邮箱注册', '邮箱注册_立即体验', 17],
                    '/deposit': ['trackEvent', '注册', '邮箱注册', '邮箱注册_去存款', 18],
                    '/onlineService': ['trackEvent', '注册', '邮箱注册', '邮箱注册_在线客服', 19],
                }
                prophetObj[url] && this.$prophet(prophetObj[url])
            }

            if (['/home', '/trade', '/deposit', '/onlineService'].includes(url)) {
                this.clickTry(url)
            } else if (url.startsWith('http')) {
                window.open(url)
            } else {
                if (this.userLoginInfo && this.userLoginInfo.account_id) {
                    this.$router.push(url)
                } else {
                    this.autoLogin(() => {
                        this.$router.push(url)
                    })
                }
            }
        },
        openService () {
            if (isAPP) return appGoCS()
            const onlineService = this.onlineService || {}
            const uiComponent = onlineService.uiComponent
            let title = this.$t('onlineService')
            if (uiComponent && uiComponent.length) {
                title = uiComponent[0]['title'] || title
            };
            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.onlineServiceUrl, title: title } })
        },
    }
}
