<template>
    <div>
        <FormWrap key='email' ref='form' :model='formModelData' :rules='rules'>
            <FormItem prop='form.email'>
                <FormInput
                    v-model.trim='dataForm.email'
                    clearable
                    :label="$t('forgetInfo.email')"
                    :placeholder="$t('forgetInfo.emailEmpty')"
                />
            </FormItem>

            <FormItem prop='form.verifyCode'>
                <FormInput
                    v-model.trim='dataForm.verifyCode'
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
            <van-button v-prophet="['trackEvent', '忘记密码', '邮箱找回密码', '邮箱找回_下一步', 26]" class='nextBtn' type='info' @click='goReset'>
                {{ $t('forgetInfo.next') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import formRules from '../formRules'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import countDown from '../countDown'
import { sendVerifyRealCode } from '@/api/register'
import { checkReceive } from '@/api/forget'

export default {
    components: {
        FormWrap, FormItem, FormInput, countDown
    },
    props: {
        accountType: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            dataForm: {
                email: '',
                verifyCode: '',
            },
            rules: {
                'form.email': formRules.email,
                'form.verifyCode': formRules.verifyCode
            },
            formModelData: {},
            isCount: false,
            sendLoading: null,
            isSubmitting: false
        }
    },
    computed: {
        formWrapModel2 () {
            const result = {
                form: this.dataForm,
                rules: this.rules
            }
            return result
        },
    },
    watch: {
        formWrapModel2: {
            immediate: true,
            deep: true,
            handler (newval) {
                const oldKeys = Object.keys(this.formModelData)
                const newKeys = Object.keys(newval)

                oldKeys.forEach(key => {
                    if (!newKeys.includes(key)) {
                        delete this.formModelData[key]
                    }
                })

                newKeys.forEach(key => {
                    this.$set(this.formModelData, key, newval[key])
                })

                console.log(this.formModelData)
            }
        },
    },
    methods: {
        goReset (type) {
            if (this.isSubmitting) {
                return
            }
            this.isSubmitting = true
            this.$refs.form.validate({ related: true })
                .then(() => {
                    checkReceive({
                        email: this.dataForm.email,
                        checkCode: this.dataForm.verifyCode,
                        sendType: 'EMAIL'
                        // customerNumber: this.dataForm.email,
                        // type: this.accountType,
                    })
                        .then(res => {
                            this.isSubmitting = false
                            if (res.code * 1 === 1) {
                                this.$emit('goReset', {
                                    checkCode: this.dataForm.verifyCode,
                                    mobilePhone: this.dataForm.email,
                                    customerNo: this.dataForm.email,
                                    type: this.accountType,
                                })
                            } else {
                                this.$toast({
                                    duration: 2000,
                                    message: this.$te('retMsg.' + res.msgCode)
                                        ? this.$t('retMsg.' + res.msgCode)
                                        : res.msg
                                })
                            }
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
        // 监听事件：获取验证码
        handleGetCode () {
            if (this.isCount) return
            this.$refs.form.validateField(['form.email'], { related: true })
                .then(() => {
                    this.$prophet(['trackEvent', '忘记密码', '邮箱找回密码', '邮箱找回_获取验证码', 25])
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
            if (this.sendLoading) return
            this.sendLoading = this.$loading({ duration: 0 })
            const params = {
                type: 'forgot',
                email: this.dataForm.email,
                customerNumber: this.dataForm.email,
                channel: 'EMAIL',
                sendType: 'EMAIL'
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
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.t_c {
    text-align: center;
    box-sizing: border-box;
    padding: 0 rem(45px);
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
}
</style>
