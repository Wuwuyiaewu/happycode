import { retMsg } from '@m/views/retMsg'
import { Toast } from 'vant'
export default {
    methods: {
        // ws登录，和login.vue页面的wsLogin方法相同
        wsLogin (data, loginParams, callback) {
            const loadMsg = loginParams._loadMsg === undefined ? '正在登录...' : loginParams._loadMsg
            const loading = Toast.loading({
                mask: true,
                duration: 0,
                message: loadMsg
            })
            if (loginParams._loadMsg) delete loginParams._loadMsg
            const toKenCompanyInfoVo = data.toKenCompanyInfoVo
            const login_name = toKenCompanyInfoVo.accountType === 'real' ? toKenCompanyInfoVo.accountNo : toKenCompanyInfoVo.accountDemoNo
            const params = {
                login_name: login_name,
                password: loginParams.passWord,
                rawPassword: loginParams.passWord?.length !== 32,
                company_id: toKenCompanyInfoVo.companyId,
                user_type: toKenCompanyInfoVo.accountType === 'real' ? 0 : 1 // 数据是反的
            }
            const $ws = this.$ws
            if ($ws.ws.readyState !== 1) {
                return this.$alert('服务器无响应，请稍后再试(WebSocket 未连接)')
            }
            if ($ws.ws.ping) clearInterval($ws.ws.ping) // 登录成功之前先不发心跳，不然服务器会返回请登录
            window['GroupSymbolList'] = []
            this.$store.commit('ix_quote/EMPTY_data') // 清空产品数据
            $ws.ws.userLoginInfoResult = false
            $ws.ws.groupSymbolListResult = false
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
                    // this.$router.replace({ name: 'Home' })
                    callback && callback()
                    setTimeout(() => {
                        // 登录成功后延迟关闭loading效果
                        loading.clear()
                    }, 500)
                })
                .catch(error => {
                    console.log(error)
                    loading.clear()
                    if (error && error.errorData && error.errorData.ret === 88) {
                        this.$alert('服务器无响应，请稍后再试(88)')
                    } else if (error.errorType === 'TimeOut') {
                        this.$alert('登录超时')
                    } else {
                        this.$alert(error.remark || error.message)
                    }
                })
        }
    }
}
