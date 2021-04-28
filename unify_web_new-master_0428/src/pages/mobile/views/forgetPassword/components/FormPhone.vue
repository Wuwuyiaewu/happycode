<template>
    <div>
        <FormWrap key='phone' ref='form' :model='formModelData' :rules='rules'>
            <FormItem prop='form.phone'>
                <template v-if='country'>
                    <!-- 国际号码 -->
                    <FormIntlMobile
                        v-model.trim='dataForm.phone'
                        clearable
                        :intl-code.sync='mobilePhonePrefix'
                        :placeholder="$t('forgetInfo.userAccountPlaceholder')"
                        @closed='onClosedIntlMobile'
                        @open='onOpenIntlMobile'
                    />
                </template>
                <template v-else>
                    <FormInput
                        v-model.trim='dataForm.phone'
                        clearable
                        :label="$t('forgetInfo.mobile')"
                        :placeholder="$t('forgetInfo.userAccountPlaceholder')"
                    />
                </template>
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
            <van-button v-prophet="['trackEvent', '忘记密码', '手机找回密码', '手机找回_下一步', 23]" class='nextBtn' type='info' @click='goReset'>
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
import FormIntlMobile from '@m/components/form/FormIntlMobile.vue'

export default {
    components: {
        FormWrap, FormItem, FormInput, countDown, FormIntlMobile
    },
    props: {
        accountType: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
            dataForm: {
                phone: '',
                verifyCode: '',
            },
            rules: {
                'form.phone': formRules.phone,
                'form.verifyCode': formRules.verifyCode
            },
            formModelData: {},
            isCount: false,
            sendLoading: null,
            isSubmitting: false
        }
    },
    computed: {
        formWrapModel1 () {
            const result = {
                form: this.dataForm,
                rules: this.rules,
                mobilePhonePrefix: this.mobilePhonePrefix
            }
            return result
        },

        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },

        country () {
            const { uiPageList } = this
            return uiPageList?.country
        },
    },
    watch: {
        formWrapModel1: {
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
        }
    },
    methods: {
        goReset () {
            if (this.isSubmitting) {
                return
            }
            this.isSubmitting = true
            this.$refs.form.validate({ related: true })
                .then(() => {
                    checkReceive({
                        mobilePhone: this.dataForm.phone,
                        customerNumber: this.dataForm.phone,
                        type: this.accountType,
                        checkCode: this.dataForm.verifyCode,
                        mobilePhonePrefix: this.mobilePhonePrefix
                    })
                        .then(res => {
                            this.isSubmitting = false
                            if (res.code * 1 === 1) {
                                this.$emit('goReset', {
                                    checkCode: this.dataForm.verifyCode,
                                    mobilePhone: this.dataForm.phone,
                                    customerNo: this.dataForm.phone,
                                    type: this.accountType,
                                    mobilePhonePrefix: this.mobilePhonePrefix
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
                mobilePhone: this.dataForm.phone,
                mobilePhonePrefix: this.mobilePhonePrefix
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
        },
        // 监听事件：获取验证码
        handleGetCode () {
            if (this.isCount) return

            this.$refs.form.validateField(['form.phone'], { related: true })
                .then(() => {
                    this.$prophet(['trackEvent', '忘记密码', '手机找回密码', '手机找回_获取验证码', 22])
                    this.sendVerifyRealCode()
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        onOpenIntlMobile () {
            if (!this.isPC) {
                return
            }
            const mainElm = document.querySelector('.form-account-wrap > .main')
            mainElm.classList.add('overflow-hidden')
        },
        onClosedIntlMobile () {
            if (!this.isPC) {
                return
            }
            const mainElm = document.querySelector('.form-account-wrap > .main')
            mainElm.classList.remove('overflow-hidden')
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
