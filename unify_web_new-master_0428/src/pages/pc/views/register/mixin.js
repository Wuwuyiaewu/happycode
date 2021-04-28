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
            const params = {
                accountNo: account.mobile || account.email,
                passWord: registerStep1.passWord,
                accountType: 'real'
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
                appAccountLogin('86', account.mobile || account.email, registerStep1.passWord, toNext) // APP登录
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
        adClick (url) {
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
