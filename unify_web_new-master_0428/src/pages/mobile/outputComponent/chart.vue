<template>
    <div id='app'>
        <TVChart
            v-if='companyInfo.clientIp && product_map[productId] '
            :height='chartHeight'
            :isapp='false'
            :product-id='productId'
        />
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { wsParams, getLoginData, localGet, localSet, localRemove, keyInUrlPath } from '@/utils/index'
import { isAPP } from '@m/base/appHybrid'
import TVChart from '@m/components/tradingview/tv'
let loadedGuestToken = false // 获取游客token
let connectedWS = false // 连接websocket （获取到游客token和连接websocket之后，开始登陆游客模式）
const notLinkWs = keyInUrlPath()
checkLoginTime() // 先检测登录有效时间
// 检查登录有效时间
function checkLoginTime () {
    if (isAPP) {
        if (notLinkWs) {
            localSet('loginData', '{"accountNo": "real", "passWord": "***","accountType":"***"}')
        } else {
            localRemove('loginData')
        }
    } else {
        const loginTime = localGet('loginTime') || 0 // 登录有效时间
        const loginData = getLoginData()
        if (!loginData) return
        if (Date.now() - loginData.lastActivityTime > loginTime * 1) {
            localRemove('loginData')
        }
    }
}
// 被app内嵌，不需要链接ws的页面列表

export default {
    name: 'App',
    data () {
        return {
            chartHeight: window['IxMiddleChart_height'] || 400,
            productId: window['IxMiddleChart_productId'],
        }
    },
    computed: {
        ...mapGetters(['companyInfo', 'userInfo', 'userType']),
        ...mapState({
            product_category: state => state.ix_quote.product_category,
            product_map: state => state.ix_quote.product_map,
            userLoginInfo: state => state.ix_user.userLoginInfo
        }),
        cachedViews () {
            return this.$store.state.tagsView.cachedViews
        }
    },
    components: {
        TVChart
    },
    watch: {
        $route () {
            this.addTags()
        }
    },
    created () {
        window.vm = this
        this.getAppInfo()
        if (this.$socket && (!isAPP || isAPP && !notLinkWs)) {
            this.$socket.onopen = () => {
                connectedWS = true
                if (loadedGuestToken) this.$ws.send_wsLogin()
            }
        }
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        this.initEvent()
    },
    beforeDestroy () {
        clearInterval(this.$socket.ping)
        delete this.$options.sockets.onmessage
    },
    methods: {
        getAppInfo () {
            const loginData = getLoginData()
            let loginParams
            if (loginData) {
                loginParams = {
                    accountNo: loginData.accountNo,
                    passWord: loginData.passWord,
                    accountType: loginData.accountType
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
                this.loginHandle(loginData)
            }
        },
        // 登录
        loginHandle (params) {
            this.$ws.httpLogin(params).then(result => {
                // 获取语言文件包
                loadedGuestToken = true

                if (result && connectedWS && (!isAPP || isAPP && !notLinkWs)) this.$ws.send_wsLogin()
            })
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }

            let { msg_code, code, content, remark } = JSON.parse(evt.data)
            if (content && typeof content === 'string') content = JSON.parse(content)
            if (msg_code && msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()) {
                this.$bus.$emit('USER_AUTO_LOGIN_END')
                if (code !== '0000') {
                    this.$toast(this.$t('loginFailure') + remark)
                }
            }
        },
        initEvent () {
            // 禁用Safari双击放大
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                document.addEventListener('touchstart', function (event) {
                    if (event.touches.length > 1) {
                        event.preventDefault()
                    }
                })
                var lastTouchEnd = 0
                document.addEventListener(
                    'touchend',
                    function (event) {
                        var now = new Date().getTime()
                        if (now - lastTouchEnd <= 300) {
                            event.preventDefault()
                        }
                        lastTouchEnd = now
                    },
                    false
                )
            }
        }
    }
}
</script>

<style lang="scss">
@import "~@m/sass/global.scss";
@import "~@/fonts/iconfont.css";
// 横屏提示
@media screen and (orientation: portrait) {
    .lock_wrp {
        display: none !important;
    }
}
.lock_wrp {
    background: #000;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 100vh;
    z-index: 9999;
}
</style>
