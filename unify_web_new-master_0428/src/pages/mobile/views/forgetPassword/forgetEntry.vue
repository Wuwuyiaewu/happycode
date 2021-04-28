<template>
    <div ref='wrapper' class='container'>
        <top />
        <div class='main'>
            <div class='login-box'>
                <van-cell-group class='inp-wrap'>
                    <van-field
                        v-model.trim='account'
                        class='bor-radius-1'
                        clearable
                        :placeholder="$t('forgetInfo.account')"
                    />
                    <van-field
                        v-model.trim='verifyCode'
                        class='bor-radius-1'
                        clearable
                        :placeholder="$t('forgetInfo.verifyCode')"
                    >
                        <img slot='button' alt class='codeImg' :src='imgSrc' @click='refreshCode' />
                    </van-field>
                </van-cell-group>
                <div class='t_c'>
                    <van-button class='nextBtn' type='info' @click='goNext'>
                        {{ $t('forgetInfo.next') }}
                    </van-button>
                </div>
            </div>
            <div v-if='onlineServiceUrl' class='foot-custom'>
                <router-link
                    class='customBtn'
                    :to="{ name: 'Nest', params: { id: 'queryinfo' }, query: { url: onlineServiceUrl, title: $t('onlineService') } }"
                >
                    <i class='icon iconfont icon_icon_service'></i>
                    {{ $t('onlineService') }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import top from '../../layout/top'
import { Field } from 'vant'
import { getImgCode, getAccountInfo } from '../../../../api/forget'
import inpOptimize from './inpOptimize'
import { httpUrl } from '@/config'
export default {
    name: 'ForgetEntry',
    components: {
        top,
        [Field.name]: Field
    },
    extends: inpOptimize,
    data () {
        return {
            account: '',
            verifyCode: '',
            imgSrc: '',
            uuid: '', // 接口传递唯一id 验证码用
            isPass: false // 账号验证码是否正确
        }
    },
    computed: {
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo &&
                this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo &&
                this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        }
    },
    created () {
        this.$router.replace({
            name: 'forgetCourse',
            params: {
                phone: 'empty',
                email: 'default',
                type: 'real',
                account: 'empty'
            }
        })
    },
    mounted () {
        const refs = this.$refs
        const wrapper = refs.wrapper
        wrapper.style.height = document.body.clientHeight + 'px'
    },
    methods: {
        refreshCode () {
            // 添加随机数拼接图片地址 便于图片刷新
            const t = Math.random()
            let token = window['authorization'] || sessionStorage.getItem('authorization__' + window.htmlKey)
            token = token ? token.split(' ')[1] : ''
            this.imgSrc = `${httpUrl}/account/open/captcha?uuid=${token}&t=${t}`
        },
        // 获取账号信息
        async getAccountInfo (param) {
            try {
                const res = await getAccountInfo(param)
                if (res.code * 1 === 1) {
                    // 成功
                    this.isPass = true
                    const { mobilePhone, email, groupActionType, customerNumber, demoCustomerNumber } = res.data
                    this.$router.push({
                        name: 'forgetCourse',
                        params: {
                            phone: mobilePhone,
                            email: email || 'default',
                            type: groupActionType,
                            account: groupActionType === 'real' ? customerNumber : demoCustomerNumber || customerNumber
                        }
                    })
                } else {
                    this.$toast({
                        duration: 2000,
                        message: this.$te('retMsg.' + res.msgCode)
                            ? this.$t('retMsg.' + res.msgCode)
                            : res.msg
                    })
                    this.refreshCode()
                }
            } catch (error) {
                console.log(error)
            }
        },
        // 下一步查询用户信息
        goNext () {
            // 校验
            if (!this.account.length) {
                this.$toast({
                    duration: 2000,
                    message: this.$t('forgetInfo.enterAccount')
                })
                return
            }
            if (!this.verifyCode.length) {
                this.$toast({
                    duration: 2000,
                    message: this.$t('forgetInfo.enterCode')
                })
                return
            }
            if (this.isPass) return
            this.getAccountInfo({
                accountOrPhone: this.account,
                code: this.verifyCode,
                uuid: this.uuid
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.main {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: rem(88px);
    height: 100%;
    width: 100%;
}
.icon-status {
    display: inline-block;
    width: rem(48px);
    height: rem(48px);
    border-radius: 50%;
    background-color: #c4c4c4;
    text-align: center;
    line-height: rem(48px);
    font-size: rem(28px);
    color: #fff;
    margin-right: rem(10px);
}
.login-flow {
    padding: 0 rem(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: rem(128px);
    .step {
        font-size: rem(24px);
    }
    .step.on {
        color: #19b275;
        .icon-status {
            background-color: #19b275;
        }
    }
}
.login-box {
    padding: rem(20px) rem(20px) 0 rem(20px);
    ::v-deep {
        .van-cell:not(:last-child)::after {
            left: 0;
        }
        .cC4C4C4 {
            color: #c4c4c4;
            font-size: rem(28px);
        }
        .van-cell__value {
            font-size: rem(28px);
        }
        .van-field__control:disabled {
            color: #333;
            -webkit-text-fill-color: #333;
        }
        .inp-wrap,
        .bor-radius-1 {
            border-radius: rem(10px);
        }
    }
    .sendBtn {
        font-size: rem(28px);
        color: #477fd3;
        cursor: pointer;
    }
    .nextBtn {
        height: rem(80px);
        font-size: rem(34px);
        color: #fff;
        width: rem(440px);
        line-height: rem(80px);
        background-color: #477fd3;
        border-color: #477fd3;
        border-radius: rem(40px);
        margin-top: rem(80px);
    }
    .van-cell {
        display: flex;
        align-items: center;
        height: rem(100px);
    }
    .codeImg {
        display: inline-block;
        width: rem(154px);
        height: rem(64px);
        vertical-align: top;
        background-color: #ccc;
    }
}
.icon-arr-right {
    display: inline-block;
    width: rem(49px);
    height: rem(20px);
    background: url("../../images/icon_arr_r.png") no-repeat;
    background-size: contain;
    margin: 0 rem(20px);
}
.t_c {
    text-align: center;
}
.foot-custom {
    position: absolute;
    left: 0;
    bottom: rem(70px);
    width: 100%;
    text-align: center;
    font-size: rem(26px);
    .icon_icon_service {
        margin-right: rem(10px);
    }
    .customBtn {
        color: #477fd3;
    }
}
</style>
