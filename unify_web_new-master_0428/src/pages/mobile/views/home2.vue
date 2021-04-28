<template>
    <div ref='home' class='home'>
        <!-- <div class="loadWrapper" v-if="modulesList.length===0">
            <van-loading />
        </div>-->
        <!-- <async-load-comp v-for="(item,index) in modulesList" :app="item.type" :key="index" :prop="item.data"></async-load-comp> -->
        <!-- <component :is="item.type" v-for="(item,i) of appModules" :key="i" :data="modulesList[i].data"></component> -->
        <!-- <component is="banner" :data="modulesList[0].data"></component> -->
        <!-- <component v-bind:is="banner"></component> -->
        <!-- <div>
            <van-button type="primary" @click="loadCompanyProperties">获取公司配置信息</van-button>
            <van-button type="primary" @click="$router.push('/login')">去登录</van-button>
            <van-button type="primary" @click="clearCacheView">清理登录页面的Keep-alive缓存</van-button>
        </div>-->
        <TVChartContainer />
        <!-- <iframe src="https://www.baidu.com" frameborder="0"></iframe> -->
    </div>
</template>

<script>
import SvgPercent from '@m/components/SvgPercent.vue'
import LightweightCharts from '@m/components/lightweightCharts.vue'
import { mapState, mapActions } from 'vuex'
import { Loading } from 'vant'
import Vue from 'vue'
import TVChartContainer from './productDetail/TVChartContainer'
Vue.use(Loading)

export default {
    name: 'Home',
    components: {
        LightweightCharts,
        TVChartContainer,
        SvgPercent
    },
    data () {
        return {
            modulesList: [],
            appModules: []
        }
    },
    computed: {
        ...mapState({
            loginInfo: (state) => state.websocket.loginInfo,
            companyInfo: (state) => state.ix_baseInfo.companyInfo
        })
    },
    mounted () {
        this.$toast('tradingview 的模拟数据')
        // this.initDemo();
        // this.init()
        // this.login()
    },
    methods: {
        ...mapActions(['getCompanyProperties']),
        loadCompanyProperties () {
            this.getCompanyProperties().then(res => {
                console.log(res)
            })
        },
        init () {
            this.$store.dispatch('STAFF_WEBSOCKET')
        },
        heartbeat () {
            const reqObj = {}
            const userLogin = {}
            userLogin.accountid = this.loginInfo.account.id
            userLogin.server_time = 30
            userLogin.token = this.loginInfo ? this.loginInfo.token : ''
            userLogin.header = {
                cmd: 4877,
                token: this.loginInfo ? this.loginInfo.token : ''
            }
            reqObj.cmd = 'CMD_USER_KEEPALIVE'
            reqObj.pb = userLogin
            this.$store.dispatch('STAFF_SEND', reqObj).then(res => {
                console.log('res', res)
            })
        },
        login () {
            const userLogin = {}
            const reqObj = {}
            userLogin.name = '100014198'
            userLogin.pwd = '84f0b5127b06cb247306f617030e3ce5'
            userLogin.session_type = 3
            userLogin.login_type = 1
            userLogin.companyid = 112010
            userLogin.company_token = 'yhyttest'
            reqObj.cmd = 'CMD_USER_LOGIN'
            reqObj.pb = userLogin
            // res_cmd 接收的命令
            this.$store.dispatch('STAFF_LOGIN', { reqObj, res_cmd: 'CMD_USER_LOGIN_INFO' }).then(res => {
                console.log('res', res)
                // this.getUserTotalData()
            })
        },
        getUserTotalData () {
            // 获取user_login_data,基础数据
            const pb = {}
            const header = {}
            const reqObj = {}
            header.token = this.loginInfo ? this.loginInfo.token : ''
            header.command = 0x1311 // 0x1311
            pb.header = header
            pb.data_version = {
                ver_accgroup: 0,
                ver_accgroup_symcata: 0,
                ver_company: 0,
                ver_eod_time: 0,
                ver_grpsym: 0,
                ver_grpsymcata: 0,
                ver_holiday: 0,
                ver_holiday_cata: 0,
                ver_holiday_margin: 0,
                ver_kline_repair: 0,
                ver_language: 0,
                ver_margin_set: 0,
                ver_quote_delay: 0,
                ver_schedule: 0,
                ver_schedule_cata: 0,
                ver_schedule_margin: 0,
                ver_secure_dev: 0,
                ver_sym: 0,
                ver_sym_label: 0,
                ver_symcata: 0,
                ver_symhot: 0,
                ver_symsub: 0,
                ver_symsubcata: 0
            }
            pb.accountid = this.loginInfo.account.id
            pb.userid = this.loginInfo.ix_user.id
            pb.companyid = 112010
            pb.version = 1 // 下发accountgroup type=8
            reqObj.cmd = 'CMD_USER_LOGIN_DATA' // ixprotocol.h CMD_USER_LOGIN 0x1311
            reqObj.pb = pb
            this.$store.dispatch('STAFF_SEND', { reqObj, res_cmd: 'CMD_USER_LOGIN_DATA_TOTAL' }).then(res => {
                console.log('res', res)
            })
        },
        registerComponent (name) {
            return import('@m/modules/' + name + '.vue')
        },
        initDemo () {
            const modules = [{
                type: 'banner',
                data: [{
                    img: 'https://testm.kyqymp.com/upload/2019/06-12/14-49-0805751041712492.png',
                    href: 'https://www.baidu.com',
                }, {
                    img: 'https://testm.kyqymp.com/upload/2019/06-12/11-29-0202481174359762.png',
                    href: 'https://www.qq.com',
                }]
            }, {
                type: 'banner',
                data: [{
                    img: 'https://testm.kyqymp.com/upload/2019/06-12/11-29-0202481174359762.png',
                    href: 'https://www.baidu.com',
                }, {
                    img: 'https://testm.kyqymp.com/upload/2019/06-12/11-29-0202481174359762.png',
                    href: 'https://www.qq.com',
                }]
            }]
            this.modulesList.push(...modules)
            modules.forEach(({ type }) => {
                this.appModules.push({ type: require(`@m/modules/${type}.vue`).default })
            })
        },
        clearCacheView () {
            this.$store.dispatch('tagsView/delView', { name: 'Login' })
        },
    }
}
</script>

<style lang="scss" scoped>
.loadWrapper {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
.home {
    height: 100%;
}
</style>
