<template>
    <div class='registerFail'>
        <Top class='nobg'>
            <span slot='right'></span>
        </Top>
        <component :is="'ad'" v-for='ad in ad.top' :key='ad.id' :data='ad' />
        <div v-if='activeForm && activeForm.uiComponent' class='form'>
            <!-- <input type="password" class="fakePwd" /> -->
            <template v-for='item in activeForm.uiComponent'>
                <FormItem
                    v-if="item.type==='input'"
                    v-model='form[item.name]'
                    :config='item'
                    :form='form'
                    :name='item.name'
                    open-type='completeInfo'
                />
            </template>
        </div>
        <div class='submitBox'>
            <button v-if='submitBtn' class='submitBtn mainColorBg' :disabled='loading' @click='next'>
                {{ submitBtn.title }}
            </button>
        </div>
        <p v-if='textTips' class='textTips'>
            {{ textTips.title }}
        </p>
        <component :is="'ad'" v-for='ad in ad.bottom' :key='ad.id' :data='ad' />
        <OnlineService
            v-if='onlineService && onlineServiceUrl'
            :title="onlineService.uiComponent && onlineService.uiComponent.length>0? onlineService.uiComponent[0]['title']:null"
            :url='onlineServiceUrl'
            @serviceClick='serviceClick'
        />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import OnlineService from '@m/modules/footerOnlineService'
import { getLoginData, delayAwait } from '@/utils/index.js'
import { openRealAccountByUuid } from '@/api/register.js'
import FormItem from '@m/modules/formItem'
import formRules from '@m/views/register/formRules'
import schema from 'async-validator'
import { retMsg } from '../retMsg'
export default {
    components: {
        Top,
        FormItem,
        OnlineService,
    },
    data () {
        return {
            form: {}, // 表单字段
            eyePwd: false,
            loading: false,
            protocolHTML: null, // 协议内容
            rules: {} // 表单验证规则
        }
    },
    computed: {
        formList () {
            const ad = this.ad
            if (!ad) return null
            const uiModules = ad['uiModules']
            if (!uiModules) return []
            const arr = uiModules.filter(el => {
                return el.moduless === 'form'
            })
            return arr.sort((a, b) => a.sort - b.sort)
        },
        activeForm () {
            return this.formList ? this.formList[0] : null
        },
        submitBtn () {
            const activeForm = this.activeForm
            if (!activeForm || !activeForm.uiComponent) return []
            return activeForm.uiComponent.find(el => {
                return el.type === 'button'
            })
        },
        // 在线客服
        onlineService () {
            const ad = this.ad
            if (!ad) return null
            const uiModules = ad['uiModules']
            if (!uiModules) return null
            const item = uiModules.find(el => el.locating === 'bottom' && el.moduless === 'menu')
            return item
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        textTips () {
            const activeForm = this.activeForm
            if (!activeForm || !activeForm.uiComponent) return ''
            return activeForm.uiComponent.find(el => el.type === 'textarea')
        }
    },
    watch: {
        activeForm (newval) {
            if (newval) {
                this.initForm()
            }
        }
    },
    created () {
        window['complateInfo'] = this
        this.initForm()
    },
    methods: {
        // 根据后台配置初始化表单项
        initForm () {
            const activeForm = this.activeForm
            if (!activeForm) return false
            const uiComponent = activeForm.uiComponent || []
            const rules = this.rules
            const newForm = {}
            uiComponent.forEach(el => {
                const name = el.name
                if (!name) return false
                newForm[name] = ''
                let rule = formRules[name] || []
                rule = [{
                    type: 'string',
                    required: true,
                    message: this.$t('pleaseEnter') + el.title,
                }].concat(rule)
                rules[name] = rule
            })
            if (this.protocolHTML) {
                newForm.protocol = true
                this.rules['protocol'] = formRules.protocol
            }
            this.form = newForm
        },
        // 效验字段，FormItem组件调用
        checkForm (data, field) {
            let validateField = this.rules
            if (field) {
                validateField = {
                    [field]: this.rules[field]
                }
            }
            return new schema(validateField).validate(data, { first: true })
        },
        // 点击提交
        next () {
            this.loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            const validateData = Object.assign({}, this.form)
            new schema(this.rules).validate(validateData, { first: true }).then(res => {
                sessionStorage.setItem('complateInfoForm', JSON.stringify(validateData))

                this.submit(validateData)
            }).catch(err => {
                console.log(err)
                if (this.loading) this.loading.clear()
                this.loading = null
                if (err.errors.length) {
                    const msg = err.errors[0]
                    this.$toast({ message: msg.message, duration: 1500 })
                }
            })
        },
        // 提交开户数据
        submit (data) {
            const companyInfo = this.$store.state.ix_baseInfo.companyInfo
            const defaultParams = {
                'mobilePhonePrefix': '86',
                'uuid': companyInfo.toKenCompanyInfoVo.uuid,
            }
            const params = Object.assign({}, defaultParams, data)
            this.loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            openRealAccountByUuid(params).then(res => {
                if (this.loading) this.loading.clear()
                this.loading = null
                if (res.code !== 1) {
                    const msg = retMsg(res.msgCode) || res.msg || res.message
                    this.$alert(msg)
                    return false
                }
                const resData = res.data
                sessionStorage.setItem('complateInfoRes', JSON.stringify(resData))
                const dataCode = resData.code
                let routerName
                if (dataCode === 'OK') {
                    routerName = { name: 'completeSuccess', params: { type: this.openType } }
                } else if (dataCode === 'ManulApprove') {
                    routerName = { name: 'completeManul', params: { type: this.openType } }
                } else {
                    routerName = { name: 'completeFail', params: { type: this.openType } }
                }
                this.$router.replace(routerName)
            }).catch(err => {
                if (this.loading) this.loading.clear()
                this.loading = null
                this.$alert(typeof (err) === 'string' ? err : err.toString())
                console.log(err)
            })
        },
        serviceClick () {
            this._collect('补充资料开真实_在线客服', true)
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.registerFail {
    position: relative;
    min-height: 100%;
    padding-bottom: rem(130px);
    box-sizing: border-box;
    padding-top: rem(90px);
}
.form {
    background: #fff;
    margin: rem(32px) rem(10px);
    border-radius: rem(10px);
}
.textTips {
    margin-top: rem(40px);
    padding: 0 rem(30px);
    text-align: center;
    color: $muted;
}
.submitBox {
    margin-top: rem(85px);
    text-align: center;
    .submitBtn {
        display: block;
        margin: 0 auto;
        width: rem(440px);
        height: rem(80px);
        line-height: rem(80px);
        text-align: center;
        font-size: rem(34px);
        border-radius: rem(40px);
        color: #fff;
        @include active();

        &.general {
            margin-top: rem(40px);
            border: 1px solid rgba(191, 191, 191, 0.6);
            background-color: #fff;
            color: #666;
        }
    }
    .loginLink {
        display: inline-block;
        margin-top: rem(50px);
        font-size: rem(28px);
    }
}
</style>
