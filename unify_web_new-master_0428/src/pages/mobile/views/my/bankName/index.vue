<template>
    <div ref='bankName' class='bankName van-hairline--top' :class='{ pc: isPC, isAPP: isAPP }'>
        <div class='otherCurrencies van-hairline--surround'>
            <div class='content'>
                <span class='title'>
                    {{ $t("bankName.selectBank") }}
                </span>
                <span v-if='currencies.length > 1' class='btn' @click='showActions = !showActions'>
                    {{ $t("bankName.otherBanks") }}
                </span>
            </div>
        </div>
        <div ref='bankList' class='bankList'>
            <van-radio-group v-model='bankCode'>
                <van-radio
                    v-for='item in bankList'
                    :key='item.id'
                    class='item'
                    :class="bankCode === item.code && 'active'"
                    icon-size='16'
                    :name='item.code'
                >
                    <div class='bank-item-content'>
                        {{ item.name_cn }}
                    </div>
                </van-radio>
            </van-radio-group>
        </div>
        <div class='submitBox'>
            <van-button
                class='confirm-btn'
                :color='style.mainColor'
                :disabled='!bankCode'
                type='primary'
                @click='submit'
            >
                {{ $t("form.button.topUpNow") }}
            </van-button>
        </div>

        <van-action-sheet
            v-model='showActions'
            :actions='currencies'
            :cancel-text='$t("compLang.cancel")'
            class='action-sheet'
            close-on-click-action
            :description='$t("bankName.selectCurrency")'
            :get-container='() => $refs.bankName'
            @select='onSelectCurrency'
        />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getBaseBankList } from '@/api/base/index.js'
import { RadioGroup, Radio } from 'vant'
import { paymentApply } from '@/api/user/funds'
import { appOpenBrower, debounce } from '@/utils/funds/index'
import { isAPP } from '@m/base/appHybrid'

export default {
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
    data () {
        return {
            bankList: [],
            bankCode: '',
            showActions: false,
            pay_method: '',
            requestForBankList: {
                pay_method: '',
            },
        }
    },
    computed: {
        ...mapState(['mobilePhonePrefix']),
        ...mapGetters({
            style: 'style',
            getAccount: 'funds/getAccount',
        }),
        // otherCountry () {
        //     const id_document = this.$store.state.funds.userInfo?.id_document ?? ''
        //     return id_document !== '0111'
        // },
        formData () {
            let data = null
            try {
                data = JSON.parse(sessionStorage.getItem('depositFormForBank')) || {}
            } catch (error) {
                console.error(error)
            }
            return data
        },
        currencies () {
            let list = []
            try {
                list = JSON.parse(sessionStorage.getItem('depositcurrenciesForBank')) || []
            } catch (error) {
                console.error(error)
            }
            return list.map((e) => ({
                ...e,
                name: e.pay_currency,
            }))
        },
        openId () {
            return this.$store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo
                .openId
        },
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        ip () {
            return sessionStorage.getItem('clientIp')
        },
        isPC () {
            return window['isPC']
        },
        currency () {
            return this.getAccount.currency || 'USD'
        },
        deviceType () {
            return this.isPC ? '2' : '1'
        },
        bankDeviceType () {
            return this.isPC ? 'P' : 'M'
        },
        isAPP () {
            return isAPP
        }

    },
    beforeRouteLeave (to, from, next) {
        this.beforeLeave()
        next()
    },
    created () {
        if (!this.formData) {
            return this.$router.back()
        }
        this.getBankList()
    },
    methods: {
        getBankList () {
            const params = {
                payMethod: this.requestForBankList.pay_method || this.formData.pay_method,
                type: this.bankDeviceType
            }

            this.$toast.loading(this.$t('other.loading') + '...')
            return getBaseBankList(params)
                .then((res) => {
                    this.$toast.clear()
                    if (res.code === 1) {
                        this.bankList = res.data.data.filter(e => e.code.indexOf('H2P') === 0)
                        this.$refs.bankList && (this.$refs.bankList.scrollTop = 0)
                    } else {
                        this.bankList = []
                    }
                })
                .catch(() => {
                    this.$toast.clear()
                    this.bankList = []
                })
        },
        onSelectCurrency (item) {
            this.bankCode = ''
            this.requestForBankList.pay_method = item.pay_method
            this.getBankList()
        },
        submit: debounce(function () {
            this.deposit()
        }, 500),

        deposit () {
            const params = {
                bank: this.bankCode,
                last_name: '',
                mobile_number_prefix: this.mobilePhonePrefix,
                mobile_number: this.userInfo.mobile_phone,
                id_no: this.userInfo.id_document_number,
                currency: this.currency,
                open_id: this.openId,
                first_name: this.userInfo.chinese_name,
                cvv: this.ip,
                deviceType: this.deviceType,
                callback_url: location.href.replace(this.$route.fullPath, '')
            };

            ['amount', 'platform', 'remark', 'pay_method'].forEach((key) => {
                this.formData[key] !== '' && (params[key] = this.formData[key])
            })

            if (this.requestForBankList.pay_method) {
                params['pay_method'] = this.requestForBankList.pay_method
            }

            // 字段名: 下划线 => 小驼峰
            Object.keys(params).forEach((key) => {
                if (/_/.test(key)) {
                    const newKey = key.replace(/_([^_])/g, (match, target) =>
                        target.toUpperCase()
                    )
                    params[newKey] = params[key]
                    delete params[key]
                }
            })

            this.$toast.loading(this.$t('other.loading') + '...')
            paymentApply(params, this.$store)
                .then((res) => {
                    if (res.code !== 1) {
                        this.$toast(res.msg)
                        return
                    }

                    this.$toast.clear()

                    // let openUrl = res.data.url
                    // if (this.ifNewPay) {
                    const openUrl = res.data.data.jump_url
                    // }
                    if (res.data.data.request_param) {
                        this.makeForm(res.data.data.request_param)
                    } else {
                        appOpenBrower(openUrl)
                    }
                })
                .catch(() => {
                    this.$toast(this.$t('other.networkTimeout'))
                })
        },
        beforeLeave () {
            sessionStorage.removeItem('depositFormForBank')
            sessionStorage.removeItem('depositcurrenciesForBank')
        },
        makeForm (data) {
            // 创建一个 form
            var form1 = document.createElement('form')
            // 添加到 body 中
            document.body.appendChild(form1)
            // form 的提交方式
            form1.method = 'POST'
            // form 提交路径
            if (data.submitUrl) {
                form1.action = data.submitUrl
                delete data.submitUrl
            } else if (data.jump_url) {
                form1.action = data.jump_url
            }
            if (data.txnAmt) {
                data.txnAmt = data.txnAmt.toString()
            }
            // 将该输入框插入到 form 中
            for (const x in data) {
                const newElement = document.createElement('input')
                newElement.setAttribute('type', 'hidden')
                newElement.name = x
                newElement.value = data[x]
                // alert(newElement.name);
                form1.appendChild(newElement)
            }
            // 对该 form 执行提交
            form1.submit()
            // 删除该 form
            document.body.removeChild(form1)
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.bankName {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    padding: rem(30px) 0 rem(130px);
    background: #fff;
    &.pc{
        min-height: 600px;
        .otherCurrencies{
            position: absolute;
            top: 0;
        }
        .submitBox {
            .confirm-btn {
                position: absolute;
            }
        }
        .action-sheet{
            position: absolute;
            left: 0;
            bottom: 0;
        }
        .bankList {
            max-height: 600px;
            overflow-y: auto;
        }
    }

    &.isAPP{
        .otherCurrencies{
            top: 0;
        }
    }

    .otherCurrencies {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: rem(89px);
        left: 0;
        z-index: 99;
        width: 100%;
        height: rem(102px);
        background: #f9f9f9;
        box-shadow: #9e9e9e1a 0px 2px 5px 0px;
        .content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 0 rem(28px);
            margin-top: rem(20px);
            box-sizing: border-box;
            .title {
                font-size: rem(28px);
                font-weight: 500;
                color: #333333;
            }
            .btn {
                font-size: rem(28px);
                font-weight: 500;
                color: #477fd3;
            }
        }
    }
    .bankList {
        width: 100%;
        margin-top: rem(100px);
        padding: 0 rem(28px);
        background: #fff;
        ::v-deep {
            .van-radio {
                box-sizing: border-box;
                padding: rem(30px) 0 rem(30px) rem(80px);
                margin: rem(20px) 0;
                &.van-radio--disabled.item {
                    opacity: 0.6;
                }
            }
        }
        .item {
            width: 100%;
            height: rem(130px);
            line-height: rem(130px);
            font-size: rem(30px);
            border-radius: rem(10px);
            border: 1px solid #dddddd;
            margin: rem(30px) 0;
            &.active {
                border-color: $primary;
            }
            .bank-item-content {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                white-space: nowrap;
                margin-left: rem(30px);
                font-size: rem(28px);
                font-weight: 500;
                color: #333333;
                white-space: pre-wrap;
            }
        }
    }

    .submitBox {
        .confirm-btn {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            font-size: rem(30px);
            background: #477fd3;
            border: 0;
        }
    }
}
</style>
