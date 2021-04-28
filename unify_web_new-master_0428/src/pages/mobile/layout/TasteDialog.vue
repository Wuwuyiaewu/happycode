<template>
    <van-dialog
        :before-close='beforeClose'
        cancel-button-text='已填，去登录'
        show-cancel-button
        title='提示'
        :value='value'
        @cancel='loginOut'
    >
        <div class='taste-form'>
            <div class='tipWord' :style='{ "font-size": isPC && "12px" }'>
                <!-- <div> -->
                继续体验请填写
                <!-- </div> -->
                <!-- <div class='link' @click='loginOut'>
                    已填，去登录
                </div> -->
            </div>
            <FormWrap ref='formWrap' :model='form' :rules='rules'>
                <FormItem prop='email'>
                    <FormInput
                        v-model.trim='form.email'
                        clearable
                        label='邮箱'
                        placeholder='请输入邮箱'
                        show-password
                        @change='handleValidateField("email", true)'
                    />
                </FormItem>
                <FormItem prop='checkCode'>
                    <!-- 验证码 -->
                    <FormInputCountdown
                        v-model.trim='form.checkCode'
                        clearable
                        label='验证码'
                        name='checkCode'
                        placeholder='请输入验证码'
                        @change='handleValidateField("checkCode", true)'
                        @getCheckCode='getCheckCode'
                    />
                </FormItem>
            </FormWrap>
        </div>
    </van-dialog>
</template>

<script>
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import FormInputCountdown from '@m/components/form/FormInputCountdown.vue'
import { removeLoginData, deviceType, getLoginData, localSet } from '@/utils/index'
import { REGEXPDATA } from '@/utils/regExp'
import { sendVerifyRealCode, openRealAccount } from '@/api/register.js'
import { debouncePromise } from '@/store/ix_utils'

export default {
    name: 'TasteDialog',
    components: {
        FormInputCountdown,
        FormWrap,
        FormItem,
        FormInput
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            form: {
                email: '',
                checkCode: ''
            },
            rules: {
                email: [
                    { required: true, trigger: 'input', message: '请输入邮箱' },
                    { pattern: REGEXPDATA.email, trigger: 'input', message: '请输入正确的邮箱' }
                ],
                checkCode: [
                    { required: true, trigger: 'input', message: '验证码不能为空' }
                ],
            }
        }
    },
    methods: {
        loginOut () {
            this.$mSocket
                .send('logout', {
                    company_id: this.$store.state.ix_user.userLoginInfo.company_id,
                    account_id: this.$store.state.ix_user.userLoginInfo.account_id,
                    account_no: this.$store.state.ix_user.userLoginInfo.account_no
                })
                .finally(() => {
                    this.$emit('change', false)
                    removeLoginData()
                    this.$router.replace({ name: 'Login' })
                })
        },
        getCheckCode (callback) {
            this.$refs.formWrap.validateField('email').then(res => {
                const params = {
                    email: this.form.email,
                    sendType: 'EMAIL',
                }
                sendVerifyRealCode(params)
                    .then(result => {
                        if (!result || result.code !== 1) {
                            const retMsgObj = this.$t('retMsg')
                            const msg = retMsgObj[result.msgCode] || result.msg || result.message
                            return this.$toast(msg)
                        };
                        this.$toast({ message: this.$t('registerInfo.validCodeSendedByEmail'), duration: 1500 })
                        callback()
                    })
                    .catch(err => {
                        console.log(err)
                        this.loading = false
                        this.$toast({ message: this.$t('registerInfo.network'), duration: 1500 })
                    })
            })
                .catch(({ errors }) => {
                    this.loading = false
                    this.$toast(errors[0].message)
                })
        },
        beforeClose (action, done) {
            if (action === 'confirm') {
                done(false)
                this.$refs.formWrap.validate().then(res => {
                    let pwd = ''
                    try {
                        pwd = getLoginData().passWord
                    } catch (error) {}

                    const params = {
                        openFrom: deviceType(),
                        bindRealAccount: true,
                        customerNumber: this.$store.state.ix_user.userLoginInfo.account_no,
                        passWord: pwd,
                        sendType: 'EMAIL',
                        ...this.form,
                    }
                    try {
                        const loginData = getLoginData()
                        if (params.passWord !== loginData.passWord) {
                            loginData.passWord = params.passWord
                            localSet('loginData', JSON.stringify(loginData))
                        }
                    } catch (error) {

                    }

                    openRealAccount(params)
                        .then((res) => {
                            this.loading = null
                            if (res.invalid()) {
                                return res.toast()
                            }
                            const loginData = getLoginData()
                            loginData.accountNo = params.email
                            localSet('loginData', JSON.stringify(loginData))
                            this.$emit('change', false)
                        })
                        .catch((err) => {
                            this.$toast(typeof err === 'string' ? err : err.toString())
                            console.log(err)
                        })
                })
            }
        },
        // 表单监听事件change/blur
        handleValidateField (name, related = false) {
            this.debounceValidateField('validateField', name, { related })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        debounceValidateField: debouncePromise(function (functionName, ...rest) {
            return this.$refs.formWrap[functionName](...rest)
        }, 20),
    }
}
</script>

<style lang="scss" scoped>
@import '~@m/sass/mixin.scss';
.taste-form {
    background: #fff;
    padding-bottom: rem(40px);
    .tipWord {
        padding: rem(20px) rem(24px) 0 rem(24px);
        display: flex;
        justify-content: space-between;
        font-size: rem(22px);
        color: #333;
        .link {
            color: #477fd2;
        }
    }
}
</style>
