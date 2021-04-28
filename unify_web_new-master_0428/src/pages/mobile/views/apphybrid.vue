<template>
    <div class='page'>
        <Top>
            <div>APP 调试页面</div>
            <span slot='right'></span>
        </Top>
        <section class='pannel'>
            <h2>APP获取设备唯一码 OAID</h2>
            <p>OAID:{{ oaid }}</p>
            <van-button block class='btn' size='normal' type='primary' @click='appGetImei'>
                APP获取设备唯一码
            </van-button>
        </section>
        <section class='pannel'>
            <h2>关闭APP窗口</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appClose')">
                关闭APP窗口
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到浏览器</h2>
            <van-field v-model.trim='openURL' placeholder='请输入链接地址' />
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appOpenBrower',openURL)">
                跳转到浏览器
            </van-button>
        </section>
        <section class='pannel'>
            <h2>打开一个新页面</h2>
            <van-field v-model.trim='openURL2' placeholder='请输入链接地址' />
            <van-field v-model.trim='openURL2_title' placeholder='页面标题' />
            <van-button
                block
                class='btn'
                size='normal'
                type='primary'
                @click="appFunc('appOpenNewpage',openURL2,openURL2_title)"
            >
                打开一个新页面
            </van-button>
        </section>
        <section class='pannel'>
            <h2>设置网页标题</h2>
            <van-field v-model.trim='pageTitle' placeholder='页面标题' />
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appSetTitle',pageTitle)">
                设置网页标题
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转至APP首页</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoHome')">
                跳转至APP首页
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到行情页面</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoQuote')">
                跳转到行情页面
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到图表页</h2>
            <van-field v-model.trim='appGoChart_id' placeholder='产品ID' />
            <van-button
                block
                class='btn'
                size='normal'
                type='primary'
                @click="appFunc('appGoChart',appGoChart_id)"
            >
                跳转到图表页
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到下单页</h2>
            <van-field v-model.trim='appGoNewOrder_id' class='marBottom10' placeholder='产品ID' />
            <van-radio-group v-model='appGoNewOrder_direction' direction='horizontal'>
                <van-radio name='1'>
                    买入
                </van-radio>
                <van-radio name='2'>
                    卖出
                </van-radio>
            </van-radio-group>
            <van-button
                block
                class='btn'
                size='normal'
                type='primary'
                @click="appFunc('appGoNewOrder',appGoNewOrder_id, appGoNewOrder_direction)"
            >
                跳转到下单页
            </van-button>
        </section>
        <!-- <section class="pannel">
            <h2>查看持仓详情</h2>
            <van-field v-model.trim="appGoPosition_id" placeholder="持仓ID" />
            <van-button
                type="primary"
                class="btn"
                size="normal"
                block
                @click="appFunc('appGoPosition',appGoPosition_id)"
            >查看持仓详情</van-button>
        </section>
        <section class="pannel">
            <h2>查看挂单详情</h2>
            <van-field v-model.trim="appGoOrder_id" placeholder="挂单ID" />
            <van-button
                type="primary"
                class="btn"
                size="normal"
                block
                @click="appFunc('appGoOrder',appGoOrder_id)"
            >查看挂单详情</van-button>
        </section>
        <section class="pannel">
            <h2>查看已平仓详情</h2>
            <van-field v-model.trim="appGoDeal_id" placeholder="挂单ID" />
            <van-button
                type="primary"
                class="btn"
                size="normal"
                block
                @click="appFunc('appGoDeal',appGoDeal_id)"
            >查看已平仓详情</van-button>
        </section>-->
        <section class='pannel'>
            <h2>跳转到持仓列表</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoPositionList')">
                跳转到持仓列表
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到挂单列表</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoOrderList')">
                跳转到挂单列表
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到已平仓列表</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoDealList')">
                跳转到已平仓列表
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到我的</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoMine')">
                跳转到我的
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转至登录页</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoLogin')">
                跳转至登录页
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转至注册开户</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoRegister')">
                跳转至注册开户
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到客服</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoCS')">
                跳转到客服
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到入金</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoDeposit')">
                跳转到入金
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到出金</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoWithdrawal')">
                跳转到出金
            </van-button>
        </section>
        <section class='pannel'>
            <h2>跳转到资产页</h2>
            <van-button block class='btn' size='normal' type='primary' @click="appFunc('appGoAssets')">
                跳转到资产页
            </van-button>
        </section>
        <section class='pannel'>
            <h2>调用APP登录方法</h2>
            <!-- <van-field v-model.trim="appAccountLogin_code" placeholder="区号" /> -->
            <van-field v-model.trim='appAccountLogin_account' placeholder='账号' />
            <van-field v-model.trim='appAccountLogin_pwd' placeholder='密码' />
            <van-button
                block
                class='btn'
                size='normal'
                type='primary'
                @click="appFunc('appAccountLogin',appAccountLogin_code,appAccountLogin_account,appAccountLogin_pwd)"
            >
                调用APP登录方法
            </van-button>
            <van-button
                block
                class='btn'
                size='normal'
                type='primary'
                @click="appFunc('appAccountLogin',appAccountLogin_code,appAccountLogin_account,appAccountLogin_pwd,'appGoDeposit')"
            >
                APP登录后去入金
            </van-button>
        </section>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import * as appHybrid from '@m/base/appHybrid.js'
import { Field, RadioGroup, Radio } from 'vant'
export default {
    components: {
        Top,
        [Field.name]: Field,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
    data () {
        return {
            openURL: '',
            openURL2: '',
            openURL2_title: '',
            pageTitle: '',
            appGoChart_id: '',
            appGoNewOrder_id: '',
            appGoNewOrder_direction: '1',
            appGoPosition_id: '',
            appGoOrder_id: '',
            appGoDeal_id: '',
            appAccountLogin_code: '86',
            appAccountLogin_account: '',
            appAccountLogin_pwd: '',
            oaid: '',
        }
    },
    methods: {
        // 调用APP方法
        appFunc (name, ...args) {
            if (appHybrid[name]) {
                appHybrid[name](...args)
            }
        },
        appGetImei () {
            appHybrid.appGetImei().then(res => {
                console.log(res)
                this.oaid = res
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.page {
    position: relative;
    min-height: 100%;
    padding-bottom: rem(130px);
    box-sizing: border-box;
    padding-top: rem(90px);
    h2 {
        font-weight: normal;
        font-size: rem(30px);
        line-height: rem(60px);
    }
    .marBottom10 {
        margin-bottom: 10px;
    }
}
.pannel {
    padding: 20px;
    .btn {
        margin-top: rem(20px);
    }
}
</style>
