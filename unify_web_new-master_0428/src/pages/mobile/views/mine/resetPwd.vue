<template>
    <div ref='wrapper' class='m-positionClose resetpw-page' :class="{ 'pc':isPC }">
        <Top>
            <div v-if='isPC' slot='left'>
                <i class='icon_icon_close_big' @click='goBack'></i>
            </div>
        </Top>
        <FormAccount class='resetpwForm'>
            <template v-if='!isPC' slot='title'>
                {{ $t('router.updatePwd') }}
            </template>
            <div class='resetpw-main'>
                <FormWrap ref='formWrap' :model='dataForm' :rules='rules'>
                    <FormItem prop='password'>
                        <FormInput
                            v-model='dataForm.password'
                            clearable
                            :label="$t('resetPwd.oldPwd')"
                            :maxlength='16'
                            name='password'
                            :placeholder="$t('resetPwd.oldPwd')"
                            type='password'
                        />
                    </FormItem>

                    <FormItem prop='password1'>
                        <FormInput
                            v-model='dataForm.password1'
                            clearable
                            :label="$t('resetPwd.newPwd')"
                            :placeholder="$t('resetPwd.newPwd')"
                            type='password'
                            @input='inputpwd'
                        />
                    </FormItem>

                    <FormItem prop='password2'>
                        <FormInput
                            v-model='dataForm.password2'
                            clearable
                            :label="$t('resetPwd.repeatNewPwd')"
                            :placeholder="$t('resetPwd.repeatNewPwd')"
                            type='password'
                        />
                        <PwdStrength class='boxSize' :value='dataForm.password1' />
                    </FormItem>
                </FormWrap>
                <div class='layout-2'>
                    <div class='active'>
                        <van-button
                            v-prophet="['trackEvent', '我的', '修改密码', '修改密码_提交', 43]"
                            class='btn'
                            :loading='loading'
                            :loading-text="$t('submitimg')"
                            round
                            @click='submit'
                        >
                            {{ $t('submit') }}
                        </van-button>
                    </div>
                </div>
                <div class='layout-3'>
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'external'"
                        v-prophet="['trackEvent', '我的', '修改密码', '修改密码_忘记密码', 44]"
                        class='link mainColor'
                        :to="{ name: 'Nest', params: { id: 'queryinfo' }, query: { url: ad.url, title: $t('forgetpassword') } }"
                    >
                        {{ $t('setting.noPwd') }}
                    </router-link>
                    <!-- 找回密码 forgetEntry -->
                    <router-link
                        v-if="uiPageList && uiPageList.Login.type === 'interior'"
                        v-prophet="['trackEvent', '我的', '修改密码', '修改密码_忘记密码', 44]"
                        class='link mainColor'
                        :to="{
                            name: 'forgetCourse',
                            params: {
                                phone: 'empty',
                                email: 'default',
                                type: 'real',
                                account: 'empty'
                            },
                            query:{
                                title: $t('setting.noPwd')
                            }
                        }"
                    >
                        {{ $t('setting.noPwd') }}
                    </router-link>
                </div>
            </div>
        </FormAccount>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Top from '@m/layout/top'
import { updatePassword } from '@/api/base'
import { removeLoginData } from '@/utils/index'
import { Field } from 'vant'
import PwdStrength from '@m/components/form/components/PwdStrength'
import FormAccount from '@m/modules/formAccount'
import { FormWrap, FormItem, FormInput } from '@m/components/form'

export default {
    name: 'ResetPwd',
    components: {
        Top,
        [Field.name]: Field,
        FormAccount,
        PwdStrength,
        FormWrap,
        FormItem,
        FormInput
    },
    data () {
        const passwordValidator = (rule, value, callback) => {
            // 二次密码直接判断 相等
            if (this.dataForm.password1 !== this.dataForm.password2) {
                callback(rule.message)
            } else {
                callback()
            }
        }

        return {
            dataForm: {
                password: '',
                password1: '',
                password2: ''
            },
            pwdStatus: '',
            loading: false,
            rules: {
                password: [
                    { required: true, message: this.$t('pleaseEnter') + this.$t('resetPwd.oldPwd'), trigger: 'input' },
                ],
                password1: [
                    { required: true, message: this.$t('pleaseEnter') + this.$t('resetPwd.newPwd'), trigger: 'input' },
                    { max: 16, message: this.$t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'input' },
                    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: this.$t('resetPwd.pwdNotAllow'), trigger: 'change' },
                ],
                password2: [
                    { required: true, message: this.$t('pleaseEnter') + this.$t('resetPwd.repeatNewPwd'), trigger: 'input' },
                    { max: 16, message: this.$t('retMsg.A_PASSWORD_RULE_ERRER'), trigger: 'input' },
                    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: this.$t('resetPwd.pwdNotAllow'), trigger: 'change' },
                    { validator: passwordValidator, message: this.$t('resetPwd.pwdNotUniform'), trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },
    },
    mounted () {
        this.initHeight()
    },
    methods: {
        ...mapMutations({
            loginReload: 'UPDATE_loginReload'
        }),
        goBack () {
            this.$router.back()
        },
        submit () {
            this.$refs.formWrap.validate()
                .then(() => {
                    this.loading = true
                    updatePassword(this.dataForm)
                        .then(res => {
                            this.loading = false
                            if (res.code != 1) {
                                this.$toast({ duration: 1000, message: this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg })
                                return
                            }
                            removeLoginData()
                            this.$dialog.alert({
                                message: this.$t('resetPwd.updateSuccess')
                            }).then(() => {
                                this.loginReload(true)
                                this.$router.replace({ name: 'Login' })
                            })
                        })
                        .catch(() => {
                            this.loading = false
                            console.log('超时')
                        })
                })
                .catch(({ errors }) => this.$toast(errors[0].message))
        },
        inputpwd (val) {
            // 密码强度规则：
            // 单字符（大写字母或小写字母或数字），6<=长度<=16———低；
            // 双字符（大写字母、小写字母、数字两两组合），
            // 6<=长度<=16———中；三字符（大写字母+小写字母+数字），6<=长度<=16———高

            if (/^[0-9]{6,16}$/.test(val) || /^[a-z]{6,16}$/.test(val) || /^[A-Z]{6,16}$/.test(val)) {
                this.pwdStatus = 'statusA'
            } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val)) {
                if (/^[0-9a-z]{6,16}$/.test(val) || /^[0-9A-Z]{6,16}$/.test(val) || /^[A-Za-z]{6,16}$/.test(val)) {
                    this.pwdStatus = 'statusB'
                } else {
                    this.pwdStatus = 'statusC'
                }
            } else {
                this.pwdStatus = ''
            }
        },
        initHeight () {
            const refs = this.$refs
            const wrapper = refs.wrapper
            wrapper.style.height = document.body.clientHeight + 'px'
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.resetpw-page {
    &.pc {
        .form-account-wrap{
            &.pc {
              .main {
                position: static;
                box-shadow: none;
                padding: 0;
                left: initial;
                top: initial;
                transform: none;
                width: 100%;
                @include scroll();
              }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.resetpw-page{
    &.pc ::v-deep{
        .form-account-wrap{
            padding-top: 0;
                height: initial;
            &>.header{
                display: none;
            }
        }
    }
    ::v-deep{
        .title-wrap{
            display: none;
        }
        .pc.resetpwForm{
            .main{
                position: static;
                box-shadow: none;
                padding: 0;
                left: initial;
                top: initial;
                transform: none;
                width: 100%;
                @include scroll();
            }
        }

    }
}
.m-positionClose {
    background: #fff;
    min-height: 100%;
    .resetpw-main {
    }
    .layout-1 {
        margin-top: rem(20px);
        ::v-deep {
            .van-cell {
                padding: rem(20px) rem(30px);
                line-height: rem(60px);
                &::after {
                    left: 0;
                }
                .van-cell__title {
                    font-size: rem(28px);
                    color: #c4c4c4;
                    width: auto;
                    padding-right: rem(20px);
                }
            }
        }
    }
    .layout-2 {
        padding: rem(20px) rem(45px);
        .active {
            margin-top: rem(80px);
            text-align: center;
            .btn {
                width: 100%;
                font-size: rem(34px);
                color: #fff;
                background-color: #477fd3;
                border-color: #477fd3;
            }
        }
    }
    .layout-3 {
        text-align: center;
       font-size: rem(24px);
            color: #477fd3;
    }
}
.boxSize {
    margin-left: rem(28px);
    margin-top: rem(20px);
}
</style>
