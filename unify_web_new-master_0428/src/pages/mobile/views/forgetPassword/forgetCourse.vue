<template>
    <div ref='wrapper' class='container'>
        <!-- <top>
            <span></span>
        </top>-->
        <FormAccount :show-close='!isYk' :show-yk='isYk'>
            <template v-if='$route.query.title' slot='title'>
                {{ $route.query.title }}
            </template>
            <template v-else slot='title'>
                {{ curStep !== 2 ? $t("forgetpassword") : $t("router.updatePwd") }}
            </template>
            <div class='forget-main'>
                <div v-if='isSupportPhone && isSupportEmail && curStep === 1' class='account-type-wrap'>
                    <span class='label'>
                        {{ $t('forgetInfo.retrieveMethod') }}
                    </span>
                    <van-radio-group v-model='accountCategory' direction='horizontal'>
                        <van-radio name='phone'>
                            {{ $t('forgetInfo.mobile') }}
                        </van-radio>
                        <van-radio name='email'>
                            {{ $t('forgetInfo.email') }}
                        </van-radio>
                    </van-radio-group>
                    <div class='bottom-line'></div>
                </div>

                <!-- 2 -->
                <div v-show='curStep === 1' class='login-box pdt20'>
                    <!-- 手机号 -->
                    <template v-if="accountCategory === 'phone'">
                        <FormPhone :account-type='accountType' @goReset='goReset' />
                    </template>

                    <!-- 邮箱 -->
                    <template v-else-if="accountCategory === 'email'">
                        <FormEmail :account-type='accountType' @goReset='goReset' />
                    </template>
                </div>

                <!-- 3、设置密码 -->
                <div v-if='curStep === 2' class='login-box pdt20'>
                    <FormWrap ref='form' :model='pwdForm' :rules='pwdRules'>
                        <FormItem prop='password'>
                            <FormInput
                                v-model.trim='pwdForm.password'
                                clearable
                                :label="$t('forgetInfo.newPwd')"
                                :placeholder="$t('forgetInfo.newPwd')"
                                type='password'
                            />
                        </FormItem>

                        <FormItem prop='password1'>
                            <FormInput
                                v-model.trim='pwdForm.password1'
                                clearable
                                :label="$t('forgetInfo.enterAgain')"
                                :placeholder="$t('forgetInfo.enterAgain')"
                                type='password'
                            />
                            <PwdStrength class='boxSize' :value='pwdForm.password' />
                        </FormItem>
                    </FormWrap>
                    <div class='t_c'>
                        <van-button
                            v-prophet="accountCategory === 'phone'
                                ? ['trackEvent', '忘记密码', '手机找回密码', '手机找回_确认', 24]
                                : ['trackEvent', '忘记密码', '邮箱找回密码', '邮箱找回_确认', 27]
                            "
                            class='nextBtn'
                            type='info'
                            @click='confirm'
                        >
                            {{ $t('forgetInfo.confirm') }}
                        </van-button>
                    </div>
                </div>
            </div>
        </FormAccount>
    </div>
</template>

<script type="text/ecmascript-6">
import top from '../../layout/top'
import { Field, RadioGroup, Radio } from 'vant'
import { resetPassword } from '../../../../api/forget'
import { sendVerifyRealCode } from '../../../../api/register'
import inpOptimize from './inpOptimize'
import schema from 'async-validator'
import formRules from './formRules'
import FormAccount from '@m/modules/formAccount'
import PwdStrength from '@m/components/form/components/PwdStrength'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import FormPhone from './components/FormPhone'
import FormEmail from './components/FormEmail'

export default {
    name: 'ForgetCourse',
    components: {
        top,
        [Field.name]: Field,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        FormAccount,
        PwdStrength,
        FormWrap,
        FormItem,
        FormInput,
        FormPhone,
        FormEmail
    },
    extends: inpOptimize,
    data () {
        const passwordValidator = (rule, value, callback) => {
            // 二次密码直接判断 相等
            if (this.pwdForm.password !== this.pwdForm.password1) {
                callback(rule.message)
            } else {
                callback()
            }
        }
        return {
            email: '',
            accountType: this.$route.params.type, // 账号类型(demo real)
            curStep: 1, // 当前步数, 因邮箱不可配置，暂屏蔽邮箱方式，仅通过手机号找回，选择方式模块也屏蔽，起始 1
            seconds: 60, // 倒计时
            isCount: false,
            pwdForm: {
                password: '', // 新密码
                password1: '', // 再次输入的密码
            },
            pwdRules: {
                password: formRules.password,
                password1: [
                    ...formRules.password1,
                    { validator: passwordValidator, message: this.$t('forgetInfo.pwdDifference'), trigger: 'change' }
                ]
            },
            accountCategory: '',
            dataForm: {},
            isSubmitting: false,
            mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
        }
    },
    computed: {
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList || {}
        },
        isSupportPhone () {
            return this.uiPageList.openRealAccount && Array.isArray(this.uiPageList.openRealAccount.uiModules) && this.uiPageList.openRealAccount.uiModules.length > 0
        },
        isSupportEmail () {
            return this.uiPageList.RegisterByEmail && Array.isArray(this.uiPageList.RegisterByEmail.uiModules) && this.uiPageList.RegisterByEmail.uiModules.length > 0
        },
        defaultAccountType () {
            if (this.isSupportPhone) {
                return 'phone'
            } else if (this.isSupportEmail) {
                return 'email'
            }
        },
        isYk () {
            if (location.href.indexOf('url_source') > -1) {
                return true
            } else {
                return false
            }
        },
    },
    watch: {
        defaultAccountType: {
            immediate: true,
            handler (val) {
                if (val) {
                    this.accountCategory = val
                }
            }
        },
        '$route.query.step' (val) {
            this.curStep = val * 1 || 1
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
        initHeight () {
            const refs = this.$refs
            const wrapper = refs.wrapper
            wrapper.style.height = document.body.clientHeight + 'px'
        },
        confirm () {
            if (this.isSubmitting) {
                return
            }
            this.isSubmitting = true
            this.$refs.form.validate()
                .then(() => {
                    resetPassword({
                        ...this.dataForm,
                        newPassword: this.pwdForm.password
                    })
                        .then(res => {
                            this.isSubmitting = false
                            const state = res.code === 1 ? 1 : 0
                            this.$router.push({ name: 'forgetResult', params: { state } })
                        })
                        .catch(() => {
                            this.isSubmitting = false
                        })
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                    this.isSubmitting = false
                })
        },
        // 验证code并跳转
        goReset (dataForm) {
            this.curStep = 2
            this.isCount = false
            this.dataForm = dataForm
            this.$router.push({
                name: this.$route.name,
                query: {
                    step: 2
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.container {
    position: relative;
}
.forget-main {
    // position: absolute;
    // top: 0;
    // left: 0;
    // padding-top: rem(88px);
    height: 100%;
    width: 100%;
    background: #fff;
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
        margin-top: rem(63px);
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

.account-type-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: rem(50px) rem(28px) rem(30px);
    .label {
        font-size: rem(22px);
        font-weight: 300;
        color: rgba(196, 196, 196, 1);
        margin-bottom: rem(20px);
    }
    .van-radio-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: nowrap;
        white-space: nowrap;
        .van-radio {
            flex: 40%;
        }
    }
    .bottom-line {
        margin: 0 rem(28px);
        bottom: 0;
        @include borderline();
    }
}
</style>
