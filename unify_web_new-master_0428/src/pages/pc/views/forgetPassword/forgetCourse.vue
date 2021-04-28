<template>
    <div ref='wrapper' class='container'>
        <!-- <top>
            <span></span>
        </top>-->
        <FormAccount show-close show-content-back @content-back='evtContentBack'>
            <template slot='title'>
                {{ curStep !== 2 ? $t("forgetpassword") : $t("router.updatePwd") }}
            </template>
            <div class='main-forget'>
                <!-- 1、找回方式 -->
                <div v-show='curStep === 0' class='login-box pdt20'>
                    <ul class='chose-box aaaa'>
                        <li @click="goCheck('S')">
                            <i class='icon iconfont icon_zhaohuimimashouji'></i>
                            <div class='ways'>
                                <p class='title'>
                                    {{ $t("forgetInfo.byPhone") }}
                                </p>
                                <p class='number'>
                                    {{ phoneTxt }}
                                </p>
                            </div>
                            <i class='icon iconfont icon_icon_arrow_small'></i>
                        </li>
                        <!-- 暂屏蔽邮箱入口 -->
                        <li v-if='email' @click="goCheck('E')">
                            <i class='icon iconfont icon_zhaohuimimayouxiang'></i>
                            <div class='ways'>
                                <p class='title'>
                                    {{ $t("forgetInfo.byMail") }}
                                </p>
                                <p class='number'>
                                    {{ emailTxt }}
                                </p>
                            </div>
                            <i class='icon iconfont icon_icon_arrow_small'></i>
                        </li>
                    </ul>
                </div>
                <!-- 2、手机号验证 -->
                <div v-show="curStep === 1 && choseType === 'S'" class='login-box pdt20'>
                    <FormWrap ref='formWrap1' :model='formModelData1' :rules='rules1'>
                        <FormItem prop='phone'>
                            <FormInput
                                v-model.trim='form1.phone'
                                clearable
                                :label="$t('forgetInfo.mobile')"
                                :placeholder="$t('forgetInfo.userAccountPlaceholder')"
                            />
                        </FormItem>

                        <FormItem prop='verifyCode'>
                            <FormInput
                                v-model.trim='form1.verifyCode'
                                autocomplete='off'
                                clearable
                                :label="$t('forgetInfo.verifyCode')"
                                :placeholder="$t('forgetInfo.enterCode')"
                            >
                                <count-down
                                    slot='append'
                                    class='bor-l'
                                    :is-count.sync='isCount'
                                    @click.native='handleGetCode'
                                    @update='resetCount'
                                />
                            </FormInput>
                        </FormItem>
                    </FormWrap>
                    <div class='t_c'>
                        <van-button class='nextBtn' type='info' @click='goReset'>
                            {{ $t("forgetInfo.next") }}
                        </van-button>
                    </div>
                </div>

                <!-- 3、设置密码 -->
                <div v-if='curStep === 2' class='login-box pdt20'>
                    <FormWrap ref='formWrap2' :model='form2' :rules='rules2'>
                        <FormItem prop='password'>
                            <FormInput
                                v-model.trim='form2.password'
                                clearable
                                :label="$t('forgetInfo.newPwd')"
                                :placeholder="$t('forgetInfo.newPwd')"
                                type='password'
                            />
                        </FormItem>

                        <FormItem prop='password1'>
                            <FormInput
                                v-model.trim='form2.password1'
                                clearable
                                :label="$t('forgetInfo.enterAgain')"
                                :placeholder="$t('forgetInfo.enterAgain')"
                                type='password'
                            />
                            <PwdStrength class='boxSize' :value='form2.password' />
                        </FormItem>
                    </FormWrap>
                    <div class='t_c'>
                        <van-button class='nextBtn' type='info' @click='confirm'>
                            {{ $t("forgetInfo.confirm") }}
                        </van-button>
                    </div>
                </div>
                <div class='service'>
                    <a @click='serviceShow = true'>
                        <i class='icon_icon_service'></i>
                        {{ $t("linkService") }}
                    </a>
                </div>
            </div>
        </FormAccount>
        <OnlineService :is-home='false' :service-show='serviceShow' @online='serviceShow = false' />
    </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import top from '../../layout/top'
import { Field } from 'vant'
import countDown from './countDown'
import { resetValidate, checkReceive, resetPassword } from '../../../../api/forget'
import { sendVerifyRealCode } from '../../../../api/register'
import inpOptimize from './inpOptimize'
import schema from 'async-validator'
import formRules from './formRules'
import FormAccount from '@pc/modules/formAccount'
import PwdStrength from '@m/components/form/components/PwdStrength'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import OnlineService from '@m/modules/onlineService'

export default {
    name: 'ForgetCourse',
    components: {
        top,
        countDown,
        [Field.name]: Field,
        FormAccount,
        PwdStrength,
        FormWrap,
        FormItem,
        FormInput,
        OnlineService
    },
    extends: inpOptimize,
    data () {
        const passwordValidator = (rule, value, callback) => {
            // 二次密码直接判断 相等
            if (this.form2.password !== this.form2.password1) {
                callback(rule.message)
            } else {
                callback()
            }
        }
        return {
            from: null,
            email: '',
            choseType: 'S', // 按手机号、邮箱 (暂写死，仅通过邮箱)
            accountType: this.$route.params.type, // 账号类型(demo real)
            curStep: 1, // 当前步数, 因邮箱不可配置，暂屏蔽邮箱方式，仅通过手机号找回，选择方式模块也屏蔽，起始 1
            seconds: 60, // 倒计时
            isCount: false,
            form1: {
                phone: '',
                verifyCode: '',
            },
            rules1: {
                phone: formRules.phone,
                verifyCode: formRules.verifyCode
            },
            form2: {
                password: '', // 新密码
                password1: '', // 再次输入的密码
            },
            rules2: {
                password: formRules.password,
                password1: [
                    ...formRules.password1,
                    { validator: passwordValidator, message: this.$t('forgetInfo.pwdDifference'), trigger: 'change' }
                ]
            },
            formModelData1: {},
            serviceShow: false,
        }
    },
    watch: {
        curStep (pre, next) {
            if (pre === 1) {
                this.isCount = false
            }
        },
        formWrapModel1: {
            immediate: true,
            deep: true,
            handler (newval) {
                const oldKeys = Object.keys(this.formModelData1)
                const newKeys = Object.keys(newval)

                oldKeys.forEach(key => {
                    if (!newKeys.includes(key)) {
                        delete this.formModelData1[key]
                    }
                })

                newKeys.forEach(key => {
                    this.$set(this.formModelData1, key, newval[key])
                })

                console.log(this.formModelData1)
            }
        }
    },
    computed: {
        ...mapGetters(['companyInfo']),
        onlineService () {
            const companyInfo = this.companyInfo
            return companyInfo.transBaseConfigVo ? companyInfo.transBaseConfigVo.onlineService : ''
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        phoneTxt () {
            return ''
        },
        emailTxt () {
            const arr = this.email && this.email.split('')
            arr && arr.splice(3, 3, '*', '*', '*')
            return arr ? arr.join('') : ''
        },

        formWrapModel1 () {
            const result = {
                ...this.form1,
                rules: this.rules1,
                mobilePhonePrefix: this.$store.state.mobilePhonePrefix
            }
            return result
        }
    },
    beforeRouteLeave (to, from, next) {
        // 回退至 找回方式时才会返回上一页，否则仅返回上一步 (暂屏蔽第一步)
        if (this.curStep >= 2 && to.name === 'forgetEntry') {
            next(false)
            this.curStep -= 1
        } else {
            next()
        }
    },
    mounted () {
        this.initHeight()
    },
    methods: {
        evtContentBack () {
            if (this.curStep > 1) {
                this.reset()
                this.curStep -= 1
            } else {
                this.$router.back()
            }
        },
        reset () {
            this.form1 = { phone: '', phone: '', }
            this.form2 = { password: '', password1: '', }
        },
        initHeight () {
            const refs = this.$refs
            const wrapper = refs.wrapper
            wrapper.style.height = document.body.clientHeight + 'px'
        },
        confirm () {
            this.$refs.formWrap2.validate()
                .then(() => {
                    resetPassword({
                        checkCode: this.form1.verifyCode,
                        mobilePhone: this.form1.phone,
                        customerNo: this.form1.phone,
                        newPassword: this.form2.password,
                        type: this.accountType
                    }).then(res => {
                        const state = res.code === 1 ? 1 : 0
                        this.$router.push({ name: 'forgetResult', params: { state } })
                    })
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        // 选择按手机还是邮箱
        goCheck (type) {
            this.curStep = 1
            this.choseType = type
            this.form1.verifyCode = ''
        },
        // 验证code并跳转
        goReset () {
            this.$refs.formWrap1.validate({ related: true })
                .then(() => {
                    checkReceive({
                        mobilePhone: this.form1.phone,
                        customerNumber: this.form1.phone,
                        type: this.accountType,
                        checkCode: this.form1.verifyCode
                    }).then(res => {
                        if (res.code * 1 === 1) {
                            this.curStep = 2
                            this.isCount = false
                        } else {
                            this.$toast({
                                duration: 2000,
                                message: this.$te('retMsg.' + res.msgCode)
                                    ? this.$t('retMsg.' + res.msgCode)
                                    : res.msg
                            })
                        }
                    })
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        // 监听事件：获取验证码
        handleGetCode () {
            if (this.isCount) return
            this.$refs.formWrap1.validateField(['phone'], { related: true })
                .then(() => {
                    this.sendVerifyRealCode()
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        // 计时完成更新计时状态
        resetCount (v) {
            this.isCount = v
        },

        // 请求验证码
        sendVerifyRealCode () {
            const phone = this.form1.phone.trim()

            if (this.sendLoading) return
            this.sendLoading = this.$loading({ duration: 0 })
            const params = {
                type: 'forgot',
                mobilePhone: phone,
                mobilePhonePrefix: this.$store.state.mobilePhonePrefix
            }

            return sendVerifyRealCode(params)
                .then(res => {
                    this.isCount = true
                    this.sendLoading.close()
                    this.sendLoading = null
                }).catch(err => {
                    console.log(err)
                    this.sendLoading.close()
                    this.sendLoading = null
                    const item = err.errors && err.errors[0]
                    if (item) {
                        setTimeout(() => {
                            this.$toast({ message: item.message, duration: 1500 })
                        }, 300)
                    }
                })
        }
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            vm.from = from
        })
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    width: 100%;
}
.main-forget {
    // position: absolute;
    // top: 0;
    // left: 0;
    // padding-top: rem(88px);
    // height: 100%;
    // width: 100%;
    // background: #fff;
    width: auto !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin-top: 30px !important;
}
.icon-status {
    display: inline-block;
    width: rem(34px);
    height: rem(34px);
    border-radius: 50%;
    background-color: #c4c4c4;
    text-align: center;
    line-height: rem(34px);
    font-size: rem(24px);
    color: #fff;
    margin-right: rem(10px);
}
.login-flow {
    padding: 0 rem(20px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: rem(175px);
    .flow-step {
        font-size: rem(28px);
        line-height: rem(34px);
        color: #c4c4c4;
        .icon_icon_arrow_small {
            color: #c4c4c4;
        }
    }
    .flow-step.on {
        color: #19b275;
        .icon-status {
            background-color: #19b275;
        }
        & + .icon_icon_arrow_small {
            color: #19b275;
        }
    }
    .icon_icon_arrow_small {
        font-size: 10px;
        margin: 0 rem(50px);
    }
}
.login-box {
    overflow: hidden;
    &.pdt20 {
        // padding-top: rem(20px);
    }
    ::v-deep {
        .van-cell:not(:last-child)::after {
            left: 0;
        }
        .labLeft {
            color: #c4c4c4;
            font-size: rem(28px);
            width: rem(140px);
        }
        .van-cell__value {
            font-size: rem(28px);
        }
        .van-field__control:disabled {
            color: #999;
            -webkit-text-fill-color: #999;
        }
    }
    .bor-l {
        position: relative;
        // &::before {
        //     content: "";
        //     width: 1px;
        //     height: rem(23px);
        //     background-color: #e3e3e3;
        //     position: absolute;
        //     left: 0;
        //     top: 50%;
        //     transform: translateY(-50%);
        // }
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
        width: 100%;
        line-height: rem(80px);
        background-color: #477fd3;
        border-color: #477fd3;
        border-radius: rem(40px);
        margin-top: rem(90px);
    }
    .van-cell {
        display: flex;
        align-items: center;
        height: rem(100px);
    }
    .chose-box {
        li {
            display: flex;
            align-items: center;
            height: rem(160px);
            padding: 0 rem(50px) 0 rem(68px);
            border-radius: rem(10px);
            box-shadow: 0px 0px rem(18px) 0px rgba(243, 243, 243, 1);
            overflow: hidden;
            margin-bottom: rem(32px);
            background-color: #fff;
            .ways {
                flex: 1;
                font-size: rem(28px);
                line-height: rem(34px);
                color: #333;
                padding-left: rem(56px);
                overflow: hidden;
                .number {
                    @include ellipsis;
                }
            }
            .icon_zhaohuimimashouji {
                font-size: 33px;
                color: #11b873;
            }
            .icon_icon_arrow_small {
                color: #c4c4c4;
                font-size: 12px;
            }
            .icon_zhaohuimimayouxiang {
                font-size: 28px;
                color: #11b873;
            }
        }
    }
    .chose-way {
        font-size: rem(24px);
        color: #477fd3;
        line-height: rem(24px);
    }
    .word-tips {
        font-size: rem(24px);
        color: #333;
        line-height: rem(24px);
    }
}
.service {
    color: #477fd3;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
}
.icon_arr_r {
    font-size: rem(20px);
    color: #19b275;
    margin: 0 rem(20px);
}
.t_c {
    text-align: center;
    box-sizing: border-box;
    padding: 0 rem(45px);
}
.foot-custom {
    position: absolute;
    left: 0;
    bottom: rem(70px);
    width: 100%;
    text-align: center;
    font-size: rem(26px);
    color: #477fd3;
    .icon_icon_service {
        margin-right: rem(10px);
    }
    .customBtn {
        color: #477fd3;
    }
}
.chose-wrap {
    padding: 0 rem(30px) 0 rem(30px);
    display: flex;
    justify-content: space-between;
    .retry {
        font-size: rem(24px);
        color: #c4c4c4;
        line-height: rem(24px);
        .count-wrap {
            display: inline-block;
        }
    }
}
.boxSize {
    margin-left: rem(28px);
    margin-top: rem(20px);
}
</style>
