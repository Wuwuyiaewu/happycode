<template>
    <div class='formItem'>
        <template v-if="config.name==='mobilePhone'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-icon v-if="value!=''" class='inputClear' name='clear' size='18' @click="$emit('input','')" />
            <van-row justify='end' type='flex'>
                <van-col class='label' span='6'>
                    {{ $t('registerInfo.phoneNum') }}
                </van-col>
                <van-col span='18'>
                    <input
                        class='input'
                        name='account'
                        :placeholder="$t('pleaseEnter')+config.title"
                        type='tel'
                        :value='value'
                        @blur="blurCheck('mobilePhone')"
                        @click="_collect(openTypeText+'_输入手机号',true)"
                        @input='inputEvent'
                    />
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.name==='captcha'">
            <!-- <i class="leftIcon captchaIcon" :class="[icon]"></i> -->
            <van-icon
                v-if="value!=''"
                class='inputClear captchaClear'
                name='clear'
                size='18'
                @click="$emit('input','')"
            />

            <van-row justify='end' type='flex'>
                <van-col class='label' span='6'>
                    {{ $t('registerInfo.captcha') }}
                </van-col>
                <van-col span='18'>
                    <!-- <img src="http://192.168.75.62:9010/account/open/captcha" class="captcha" /> -->
                    <img class='captchaImg' :src='imgSrc' @click='getValidateCode' />
                    <input
                        class='input'
                        maxlength='6'
                        :placeholder="$t('pleaseEnter')+config.title"
                        type='text'
                        :value='value'
                        @blur="blurCheck('captcha')"
                        @click="_collect(openTypeText+'_图形验证码',true)"
                        @input='inputEvent'
                    />
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.name==='checkCode'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-icon v-if="value!=''" class='inputClear checkCode' name='clear' size='18' @click="$emit('input','')" />

            <van-row class='checkCodeRow' justify='end' type='flex'>
                <van-col class='label' span='4'>
                    {{ $t('registerInfo.verifyCode') }}
                </van-col>
                <van-col span='18'>
                    <van-button
                        class='getVerifyCode'
                        :disabled='loading || !isNaN(verifyCodeBtn)'
                        :loading='loading'
                        type='default'
                        @click='getVerifyCode'
                    >
                        <span class='verticalLine'></span>
                        <span class='mainColor'>
                            {{ isNaN(verifyCodeBtn)? verifyCodeBtn:verifyCodeBtn+'s' }}
                        </span>
                    </van-button>
                    <input
                        class='input'
                        maxlength='6'
                        :placeholder="$t('pleaseEnter')+config.title"
                        type='tel'
                        :value='value'
                        @blur="blurCheck('checkCode')"
                        @click="_collect(openTypeText+'_短信验证码',true)"
                        @input='inputEvent'
                    />
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.name==='email'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-icon v-if="value!=''" class='inputClear' name='clear' size='18' @click="$emit('input','')" />

            <van-row justify='end' type='flex'>
                <van-col class='label' span='6'>
                    {{ $t('registerInfo.emailAddress') }}
                </van-col>
                <van-col span='18'>
                    <input
                        class='input'
                        :placeholder="$t('pleaseEnter')+config.title"
                        type='email'
                        :value='value'
                        @blur="blurCheck('email')"
                        @click="_collect(openTypeText+'_输入邮箱',true)"
                        @input='inputEvent'
                    />
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.name==='passWord'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-icon v-if="value!=''" class='inputClear passWord' name='clear' size='18' @click="$emit('input','')" />
            <a
                class='eyePwd'
                :class="{ 'icon_icon_pressed':eyePwd,'icon_icon_default':!eyePwd }"
                href='javascript:;'
                @click='eyePwd=!eyePwd'
            ></a>

            <van-row justify='end' type='flex'>
                <van-col class='label' span='6'>
                    {{ $t('registerInfo.setPwd') }}
                </van-col>
                <van-col span='18'>
                    <input
                        autocomplete='new-password'
                        class='input'
                        name='password'
                        :placeholder="$t('registerInfo.pwdPlaceholder')"
                        :type="eyePwd?'text':'password'"
                        :value='value'
                        @blur="blurCheck('passWord')"
                        @click="_collect(openTypeText+'_设置密码',true)"
                        @input='inputEvent'
                    />
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.name==='currency'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-row class='currency' justify='end' type='flex'>
                <van-col class='label' span='6'>
                    {{ $t('registerInfo.accountType') }}
                </van-col>
                <van-col class='accountTypeRadios' span='18'>
                    <van-radio-group
                        v-model='accountTypeVal'
                        direction='horizontal'
                        @change="$emit('input',accountTypeVal)"
                    >
                        <van-radio v-for=' radio in accountTypeList' :key='radio.code' :name='radio.code'>
                            {{ radio.title }}
                            <template #icon='props'>
                                <span class='radioIcon' :class="props.checked ? 'icon_xuanzhong' : 'icon_weixuanzhong'"></span>
                            </template>
                        </van-radio>
                    </van-radio-group>
                </van-col>
            </van-row>
        </template>
        <template v-else-if="config.type==='input'">
            <!-- <i class="leftIcon" :class="[icon]"></i> -->
            <van-icon v-if="value!=''" class='inputClear' name='clear' size='18' @click="$emit('input','')" />
            <input
                class='input'
                :name='config.name'
                :placeholder="$t('pleaseEnter')+config.title"
                type='text'
                :value='value'
                @blur='blurCheck(config.name)'
                @click="_collect(openTypeText+'_输入'+config.title,true)"
                @input='inputEvent'
            />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast, Icon, RadioGroup, Radio } from 'vant'
import { sendVerifyRealCode } from '@/api/register.js'
import * as sendVerifyCode from '@/api/register.js'
import { retMsg } from '@m/views/retMsg'
import { getImgCode } from '@/api/forget'
const icons = {
    'mobilePhone': 'icon_icon',
    'checkCode': 'icon_shoujiyanzhengma',
    'captchaIcon': 'icon_icon4',
    'passWord': 'icon_icon1',
    'chineseName': 'icon_icon2',
    'certificateNumber': 'icon_icon6',
    'email': 'icon_icon3',
    'currency': 'icon_zhanghuleixing',
}
const token = sessionStorage.getItem('authorization__' + htmlKey) || ''
export default {
    name: 'FormItem',
    props: ['config', 'value', 'form', 'name', 'openType', 'checkFormAll'],
    data () {
        return {
            eyePwd: false,
            loading: false,
            accountTypeVal: '',
            imgSrc: `//${window['serviceUrl']}/account/open/captcha?uuid=${token.slice(7)}`,
            verifyCodeBtn: this.$t('registerInfo.getValidCode')
        }
    },
    computed: {
        ...mapGetters(['style']),
        /* 是否手机号开户 */
        byPhone () {
            return this.openType && this.openType.startsWith('openRealAccount')
        },
        // 开户类型
        openTypeText () {
            let txt = '真实开户'
            const openType = this.openType
            if (openType === 'completeInfo') {
                txt = '补充资料开真实'
            } else if (openType.startsWith('openDemoAccount')) {
                txt = '模拟开户'
            }
            return txt
        },
        // 账户类型列表 美元账户/人民币账户
        accountTypeList () {
            try {
                return JSON.parse(this.config.dataJson)
            } catch (error) {
                console.log('账户类型数据格式配置错误', error)
                return []
            }
        },
        icon () {
            return icons[this.config.name] || 'icon_icon4'
        }
    },
    watch: {
        config () {
            this.initCurrency()
        }
    },
    created () {
        this.initCurrency()
    },
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods: {
        inputEvent ($event) {
            const val = $event.target.value.trim()
            // console.log(val, $event);
            this.$emit('input', val)
            if (/^\s|\s$/.test(val)) $event.target.value = val
        },
        // 离开焦点时验证字段
        blurCheck (field) {
            setTimeout(() => {
                if (this.form[field] && !this.checkFormAll) this.checkField(field)
            }, 20)
        },
        // 效验字段的有效性
        checkField (field, callback) {
            if (this.form[field] == '') return false
            const fieldInfo = { [field]: this.form[field] }
            if (field === 'checkCode' && this.openType === 'RegisterByEmail') {
                fieldInfo['email'] = this.form.email
                fieldInfo['byEmail'] = true
            } else if (field === 'checkCode' && this.openType === 'openRealAccount') {
                fieldInfo['mobilePhone'] = this.form.mobilePhone
                fieldInfo['mobilePhonePrefix'] = '86'
                fieldInfo['byPhone'] = true
            } else if (field === 'mobilePhone') {
                fieldInfo['mobilePhonePrefix'] = '86'
                fieldInfo['byPhone'] = this.byPhone
            }
            // 防止点击发送验证码时对手机号重复检查
            const checkFieldTimer = this.$root[field + '_Timer'] || 0
            if (Date.now() - checkFieldTimer < 500) {
                callback && callback(false)
                return false
            }
            this.$root[field + '_Timer'] = Date.now()

            this.$parent.checkForm(fieldInfo, field).then(() => {
                // 验证通过
                callback && callback(true)
            }).catch((err) => {
                console.log(err)
                const item = err.errors.find(el => el.field === field)
                if (item) {
                    Toast({ message: item.message, duration: 1500 })
                }
                callback && callback(false)
                this.loading = false
            })
        },
        // 获取验证码
        getVerifyCode () {
            const field = this.form.hasOwnProperty('email') ? 'email' : 'mobilePhone'
            if (this.form.hasOwnProperty('email') && this.form.email == '') {
                const msg = this.$t('emailEmpty')
                return Toast({ message: msg, duration: 1500 })
            } if (this.form.hasOwnProperty('mobilePhone') && this.form.mobilePhone == '') {
                const msg = this.$t('phoneEmpty')
                return Toast({ message: msg, duration: 1500 })
            }
            if (this.loading == true) return console.log('this.loading == true')
            this.loading = true
            this._collect(this.openTypeText + '_发送验证码', true)
            this.checkField(field, result => {
                if (!result) return this.loading = false
                let verifyParams = {
                    mobilePhone: this.form.mobilePhone + '',
                    mobilePhonePrefix: this.$store.state.mobilePhonePrefix,
                    sendType: 'SMS'
                }
                if (this.openType === 'RegisterByEmail') {
                    verifyParams = {
                        email: this.form.email,
                        sendType: 'EMAIL'
                    }
                }
                sendVerifyCode.sendVerifyRealCode(verifyParams).then((result) => {
                    this.loading = false
                    if (!result || result.code !== 1) {
                        const msg = retMsg(result.msgCode) || result.msg || result.message
                        return this.$toast(msg)
                    };
                    Toast({ message: this.$t('registerInfo.validCodeSended'), duration: 1500 })
                    this.verifyCodeBtn = 60
                    this.interval = setInterval(() => {
                        if (this.verifyCodeBtn == 0) {
                            clearInterval(this.interval)
                            this.verifyCodeBtn = this.$t('registerInfo.getValidCode')
                            this.interval = null
                            return false
                        }
                        this.verifyCodeBtn--
                    }, 1000)
                }).catch(err => {
                    this.loading = false
                })
            })
        },
        // 获图形取验证码
        getValidateCode () {
            this.imgSrc = `//${window['serviceUrl']}/account/open/captcha?uuid=${token.slice(7)}&_t=${Date.now()}`
        },
        initCurrency () {
            if (this.config.name === 'currency' && this.accountTypeList.length) {
                this.accountTypeVal = this.accountTypeList[0]['code']
                this.$emit('input', this.accountTypeVal)
            }
        }
    },
    components: {
        [Icon.name]: Icon,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    }

}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.formItem {
    position: relative;
    padding-left: rem(30px);
    height: rem(98px);
    line-height: rem(98px);
    box-sizing: content-box;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    &:last-child {
        border: 0;
    }
    .input {
        width: 100%;
        font-size: rem(28px);
        height: rem(98px);
        line-height: rem(48px);
        padding: rem(25px) 0;
        &::placeholder {
            color: #c4c4c4;
        }
    }
    .eyePwd {
        position: absolute;
        right: rem(30px);
        top: rem(35px);
        width: rem(46px);
        height: rem(46px);
        text-align: center;
        line-height: rem(46px);
        color: #afafaf;
        font-size: rem(46px);
    }
    // .leftIcon {
    //     position: absolute;
    //     left: rem(30px);
    //     top: rem(35px);
    //     width: rem(30px);
    //     height: rem(30px);
    //     font-size: rem(30px);
    //     color: #c4c4c4;
    //     line-height: 1;
    // }
    .inputClear {
        position: absolute;
        right: rem(26px);
        top: 50%;
        transform: translate(0, -50%);
        opacity: 0.5;
        &.checkCode {
            right: rem(300px);
        }
        &.passWord {
            right: rem(100px);
        }
        &.captchaClear {
            right: rem(180px);
        }
    }
    .getVerifyCode,
    .captchaImg {
        position: absolute;
        background: none;
        right: 0;
        top: 0;
        width: rem(170px);
        height: rem(98px);
        text-align: center;
        font-size: rem(28px);
        border: 0;
        padding: 0;
        &:disabled {
            opacity: 0.8;
        }
    }
    .getVerifyCode {
        width: auto;
        padding: 0 rem(68px);
        margin-left: rem(30px);
        .verticalLine {
            position: absolute;
            left: 0;
            top: 50%;
            display: block;
            width: rem(2px);
            height: rem(23px);
            background: #e3e3e3;
            transform: translateY(-50%);
        }
    }
    .label {
        font-size: rem(28px);
        color: #323233;
    }
    .accountTypeRadios {
        text-align: right;
        padding-top: rem(30px);
        font-size: rem(28px);
        .van-radio-group {
            justify-content: flex-start;
            width: auto;
        }
        ::v-deep .van-radio__icon {
            padding-left: 1px;
        }
        .van-radio--horizontal {
            margin-right: 0;
        }
        .van-radio:last-child {
            margin-left: rem(100px);
        }
        .radioIcon {
            font-size: rem(28px);
            vertical-align: 1px;
            &.icon_xuanzhong {
                color: $primary;
            }
        }
    }

    .checkCodeRow {
        ::v-deep {
            justify-content: space-between;
            .label {
                text-align: justify;
                text-align-last: justify;
            }
        }
    }
}
</style>
