<template>
    <div class='add-bank' :class='{ pc:isPC }'>
        <van-notice-bar
            v-model='notifyShow'
            background='#fff'
            color='#c4c4c4'
            :duration='0'
            :message="$t('other.mustYouSelfBankCard')"
            :scrollable='false'
            style='z-index: 10'
            type='success'
            wrapable
        >
            <span>{{ $t('other.mustYouSelfBankCard') }}</span>
        </van-notice-bar>
        <FormWrap
            ref='formWrap'
            :model='form'
            :rules='rules'
        >
            <FormItem prop='account_name'>
                <FormInput
                    v-model='form.account_name'
                    :disabled='!!userInfoFrom.name'
                    :label="$t('form.title.payeeName')"
                    :placeholder="$t('form.placeholder.payeeName')"
                />
            </FormItem>

            <FormItem prop='account_no'>
                <FormInput
                    v-model='form.showAccountNo'
                    clearable
                    :label="$t('form.title.bankAccountId')"
                    :placeholder="$t('form.placeholder.bankAccountId')"
                    type='tel'
                    @blur='getBankInfoByCode'
                    @input='formatterCard'
                />
            </FormItem>
            <FormItem v-if='OtherCountry' prop='countryText'>
                <FormInput
                    v-model='form.countryText'
                    disabled
                    :label="$t('form.title.country')"
                    :placeholder="$t('form.title.country')"
                >
                    <!-- <van-icon
                        slot='append'
                        name='arrow-down'
                    /> -->
                </FormInput>
            </FormItem>
            <template v-if='isPC && !OtherCountry'>
                <VueSelect
                    v-model='form.bankName'
                    :data='computedBankList'
                    :is-bank='true'
                    :label="$t('form.title.bankName')"
                    :placeholder="$t('form.title.bankName')"
                    prop='bankName'
                    z-index='103'
                    @change='onBankSelect'
                />
                <VueSelect
                    v-model='form.provinceName'
                    :data='province'
                    :label="$t('form.title.selectedProvince')"
                    :placeholder="$t('other.selectedProvince')"
                    prop='province'
                    z-index='102'
                    @change='onProvinceSelect'
                />

                <VueSelect
                    v-model='form.cityName'
                    :data='cityData'
                    :disabled='!form.provinceName'
                    :label="$t('form.title.selectedCity')"
                    :placeholder="$t('form.placeholder.selectedCity')"
                    prop='city'
                    z-index='101'
                    @change='onCitySelect'
                />
            </template>
            <template v-else-if='!OtherCountry'>
                <FormItem prop='bankName'>
                    <FormInput
                        v-model='form.bankName'
                        :label="$t('form.title.bankName')"
                        :placeholder="$t('form.title.bankName')"
                        readonly
                        @click.native='showPopUp'
                    >
                        <van-icon
                            slot='append'
                            name='arrow-down'
                        />
                    </FormInput>
                </FormItem>
                <FormItem prop='province'>
                    <FormInput
                        v-model='form.provinceName'
                        :label="$t('form.title.selectedProvince')"
                        :placeholder="$t('other.selectedProvince')"
                        readonly
                        @click.native='openPickHandle'
                    >
                        <van-icon
                            slot='append'
                            name='arrow-down'
                        />
                    </FormInput>
                </FormItem>
                <FormItem prop='city'>
                    <FormInput
                        v-model='form.cityName'
                        :disabled='!form.provinceName'
                        :label="$t('form.title.selectedCity')"
                        :placeholder="$t('form.placeholder.selectedCity')"
                        readonly
                        @click.native='openPickCityHandle'
                    >
                        <van-icon
                            slot='append'
                            name='arrow-down'
                        />
                    </FormInput>
                </FormItem>
                <FormItem prop='branch'>
                    <FormInput
                        v-model='form.branch'
                        clearable
                        :label="$t(OtherCountry?'form.title.bankName':'form.title.bankAddress')"
                        maxlength='120'
                        :placeholder="$t(OtherCountry?'form.placeholder.bankName':'form.placeholder.bankAddress')"
                    />
                </FormItem>
            </template>

            <FormItem v-if='OtherCountry' prop='bankName'>
                <FormInput
                    v-model='form.bankName'
                    :label="$t('form.title.bankName')"
                    :placeholder="$t('form.title.bankName')"
                    readonly
                    @click.native='showPopUp'
                >
                    <van-icon
                        slot='append'
                        name='arrow-down'
                    />
                </FormInput>
            </FormItem>
            <!-- <FormItem v-if='OtherCountry' prop='international_remittance_code'>
                <FormInput
                    v-model='form.international_remittance_code'
                    clearable
                    :label="$t('form.title.international_remittance_code')"
                    maxlength='20'
                    :placeholder="$t('form.placeholder.international_remittance_code')"
                />
            </FormItem> -->
            <FormItem v-if='OtherCountry' prop='address'>
                <FormInput
                    v-model='form.address'
                    clearable
                    :label="$t('form.title.address')"
                    maxlength='120'
                    :placeholder="$t('form.placeholder.address')"
                />
            </FormItem>
            <FormItem prop='card_url'>
                <div class='upload-wrp'>
                    <span class='upload-title'>
                        {{ $t('other.uploadBankCardImg') }}
                    </span>
                    <Upload
                        :img-src='form.card_url'
                        :is-editor='!!form.card_url'
                        name='formCardUrl'
                        @onComplete='onComplete'
                    >
                        {{ $t('form.title.banCardImg') }}
                    </Upload>
                </div>
            </FormItem>
        </FormWrap>
        <!-- {{JSON.stringify(computedBankList)}} -->
        <!-- {{JSON.stringify(province)}} -->
        <!-- <div class="upload-wrp">
            <Upload name="formCardUrl" :img-src="form.card_url" @onComplete="onComplete"></Upload>
        </div>-->
        <van-popup
            v-model='isPopupShow.right'
            position='right'
            :style="{ 'min-height':'100%' }"
            @touchmove.stop
        >
            <div
                class='md-example-popup md-example-popup-right'
                @touchmove.stop
            >
                <div class='scroll'>
                    <template v-if='computedBankList.length>0'>
                        <div
                            v-for='(bank,index) in computedBankList'
                            :key='bank.code'
                            class='bank-item of-1px-bottom'
                            :class="{ 'active':index===selectBankIndex }"
                            @click='onSelectBank(bank,index)'
                        >
                            <i
                                v-if="bank.code.indexOf('INT')!==0 && bank.code.indexOf('H2P')!==0"
                                class='bank-icons-sm'
                                :class="'bk-'+bank.code"
                            ></i>
                            <span class='name'>
                                {{ bank.name }}
                            </span>
                        </div>
                    </template>
                    <div
                        v-else
                        style='margin-top: 80%'
                    >
                        {{ $t("other.getBankListError") }}
                        <van-button
                            size='small'
                            type='primary'
                            @click='_getBaseBankList'
                        >
                            {{ $t("form.button.reLoad") }}
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
        <div class='btn-submit'>
            <van-button
                block
                :color='style.mainColor'
                @click='onSubmit'
            >
                {{ $t("submit") }}
            </van-button>
        </div>

        <van-popup
            v-model='isPickerShow'
            position='bottom'
            @touchmove.stop
        >
            <van-picker
                v-show='isPickerShow'
                ref='picker'
                :cancel-button-text="$t('compLang.cancel')"
                :columns='province'
                :confirm-button-text="$t('compLang.OK')"
                show-toolbar
                :title="$t('other.selectedProvince')"
                @cancel='isPickerShow=false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
        <van-popup
            v-model='isPickerShowCity'
            position='bottom'
            @touchmove.stop
        >
            <van-picker
                v-show='isPickerShowCity'
                ref='picker'
                :cancel-button-text="$t('compLang.cancel')"
                :columns='cityData'
                :confirm-button-text="$t('compLang.OK')"
                show-toolbar
                :title="$t('form.title.selectedCity')"
                @cancel='isPickerShowCity=false'
                @confirm='onPickerConfirmCity'
            />
        </van-popup>
        <van-dialog
            v-model='showSuccess'
            :cancel-button-text="$t('trade.check')"
            :close-on-popstate='true'
            :confirm-button-color='style.mainColor'
            :confirm-button-text="$t('linkService')"
            show-cancel-button
            @cancel='addedClose'
            @confirm='goLiveService'
        >
            <div class='success'>
                <div class='title'>
                    <div class='successIcon'>
                        <SuccessAnimation :disabled-succ-animtion='disabledSuccAnimtion' />
                    </div>
                    <div class='title'>
                        {{ $t('other.submitSuccess') }}
                    </div>
                </div>

                <div class='tip'>
                    {{ $t('other.submitSuccessTip') }}
                </div>
            </div>
        </van-dialog>

        <!-- <van-action-sheet v-model='countryVisible' :actions='countryActions' class='countryActions' @select='countrySelect' /> -->
    </div>
</template>

<script>
import Upload from '@m/components/Upload'
import { mapGetters, mapActions } from 'vuex'
import '@m/sass/bankImgSm.scss'
import { getUserInfoParams } from '@/utils/funds/index'
import { getBaseBankList, getClientCountries, getBankInfoByCode } from '@/api/base/index.js'
import { getUserInfo } from '@/utils/funds/auth'
import { modifyUserInfo } from '@/api/user/accountApi'
import { Field, Picker, NoticeBar } from 'vant'
import { FormWrap, FormItem, FormInput } from '@m/components/form'
import SuccessAnimation from '@m/components/successAnimation'
import VueSelect from '@m/components/customSelect'
import { verifyBlen } from '@/utils/index'
import { appGoCS, appClose } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
import { AREACODEMAP } from '@/utils/funds/constant.js'

const validateBlen = (rule, value, callback) => {
    const flg = verifyBlen(value, 120, 1)
    if (flg) {
        callback()
    } else {
        callback(new Error())
    }
}
export default {
    name: 'AddBank',
    components: {
        Upload,
        [Field.name]: Field,
        [Picker.name]: Picker,
        [NoticeBar.name]: NoticeBar,
        FormWrap,
        FormItem,
        FormInput,
        VueSelect,
        SuccessAnimation
    },
    mixins: [pcMixin],
    data () {
        return {
            showSuccess: false,
            disabledSuccAnimtion: false,
            isPopupShow: {
                right: false
            },
            userBankList: [],
            notifyShow: true,
            imgSrc: '',
            userInfoFrom: {},
            isPickerShow: false,
            isPickerShowCity: false,
            pickerData: [],
            proviceDefaultValue: [],
            cityData: [],
            cityDefaultValue: [],
            form: {
                id: '',
                showAccountNo: '',
                account_name: '',
                account_no: '',
                bank: '',
                bankName: '',
                country: '',
                countryText: '',
                province: '',
                city: '',
                card_url: '',
                branch: '', // 银行名称
                provinceName: '',
                cityName: '',
                international_remittance_code: '',
                address: '',
            },
            bankList: [],
            selectBankIndex: -1,
            // countryVisible: false,
            // countryActions: [],
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        ...mapGetters(['style']),
        province () {
            // debugger
            return this.$store.state.funds.province
        },
        isPC () {
            return window['isPC']
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        onlineService () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        computedBankList () {
            const langMap = {
                'zh-CN': 'name_cn',
                'en-US': 'name_en',
            }
            const lang_code = langMap[this.language] || 'name_cn'

            return this.bankList.map(item => ({
                name: item[lang_code],
                code: item.code,
            }))
        },
        OtherCountry () {
            const id_document = this.$store.state.funds.userInfo?.id_document ?? ''
            return id_document !== '0111'
        },
        rules () {
            const rule = {
                account_no: [{
                                 required: true,
                                 message: this.$t('other.bankCardEmpty'),
                                 trigger: 'input'
                             },
                             {
                                 pattern: /^[0-9]{1,20}$/,
                                 message: this.$t('other.bankCardError'),
                                 trigger: 'change'
                             },
                ],
                bankName: [{
                    required: true,
                    message: this.$t('other.bankCardBankEmpty'),
                    trigger: 'change'
                }],
                province: [{
                    required: true,
                    message: this.$t('other.provinceEmpty'),
                    trigger: 'input'
                }],
                city: [{
                    required: true,
                    message: this.$t('other.cityEmpty'),
                    trigger: 'change'
                }],
                card_url: [{
                    required: true,
                    message: this.$t('other.uploadBankCardImg'),
                    trigger: 'input'
                }]
            }
            if (this.OtherCountry) {
                Object.assign(rule, {
                    countryText: [{
                        required: true,
                        message: this.$t('other.countryEmpty')
                    }],
                    branch: [{
                        required: true,
                        message: this.$t('other.bankNameEmpty'),
                        trigger: 'input'
                    }],
                    international_remittance_code: [{
                        required: false,
                        message: this.$t('other.internationalEmpty'),
                        trigger: 'input'
                    }],
                    address: [{
                        required: true,
                        message: this.$t('other.addressEmpty'),
                        trigger: 'input'
                    }],
                })
            } else {
                Object.assign(rule, {
                    branch: [{
                                 required: true,
                                 message: this.$t('other.bankAddressEmpty'),
                                 trigger: 'input'
                             },
                             {
                                 pattern: /^[\u4e00-\u9fa5_a-zA-Z\s]*$/,
                                 message: this.$t('other.bankAddressError')
                             },
                             {
                                 validator: validateBlen,
                                 message: this.$t('other.bankAddressError')
                             }
                    ],
                })
            }
            return rule
        },

        country () {
            return this.$store.state.ix_baseInfo.companyInfo?.uiPageList?.country || []
        },
        countries () {
            const { uiModules = [] } = this.country || {}
            const langMap = {
                'zh-CN': 'title',
                'en-US': 'name',
            }
            return uiModules.map(e => {
                const name = e[langMap[this.language]]
                return {
                    name: `${name}`,
                    code: e.code,
                    img: e.img
                }
            })
        },
        nationality () {
            return this.userInfo.nationality
        },
        matchAreacode () {
            return this.countries.find(e => e.code === this.nationality) || {}
        }
    },
    watch: {
        nationality: {
            immediate: true,
            handler (val) {
                if (val) {
                    this.form.country = val
                    this.form.countryText = this.matchAreacode.name
                }
            }
        }
    },
    created () {
        const bankId = this.form.id = Number(this.$route.query.id) // 银行卡id
        console.log(bankId)

        // this.validatIdCard()
        this._getBaseBankList()
        this.userInfoFrom = getUserInfoParams()
        this.form.account_name = this.userInfoFrom.name

        this.modifyDataInit(bankId)

        // if (this.province.length === 0) {
        this.$store.dispatch('funds/getProvince')
        // }
        getClientCountries().then(res => {
            if (res.check()) this.countryActions = res.data
        })
    },

    methods: {
        ...mapActions(['getUserStatus']),
        // 验证是否身份证是否通过了
        getBankInfoByCode (id) {
            getBankInfoByCode({
                code: this.form.account_no
            })
                .then(res => {
                    if (res.code === 1) {
                        if (res.data) {
                            this.form.bank = res.data.code
                            this.form.bankName = res.data.name
                        }
                    }
                })
        },
        onBankSelect (value) {
            this.onSelectBank(value)
        },
        onProvinceSelect (value) {
            // this.form.provinceName = value.text
            this.onPickerConfirm(value)
            this.form.city = ''
            this.form.cityName = ''
        },
        onCitySelect (value) {
            // this.form.cityName = value.text
            // debugger
            this.onPickerConfirmCity(value)
        },
        // 修改基础数据渲染
        modifyDataInit (bankId) {
            // debugger
            //   document.title = this.$t('form.title.modifyBankCard')

            const bankList = getUserInfo().withdraw_banks
            this.userBankList = bankList
            console.log(bankList, 'bankList')
            console.log(bankId, 'bankId')
            if (bankId) {
                let bank
                bankList.forEach(item => {
                    console.log(item)
                    if (item.id === bankId) {
                        bank = item
                    }
                })
                if (bank) {
                    console.log('bank.province', bank.province)
                    this.form.id = bank.id
                    this.form.province = bank.province
                    this.form.city = bank.city
                    this.form.bank = bank.bank
                    this.form.bankName = bank.bank_name
                    this.form.account_no = bank.account_no
                    this.form.showAccountNo = bank.account_no.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
                    this.form.branch = bank.branch || ''
                    this.form.card_url = bank.card_url
                    if (bank.country) this.form.country = bank.country
                    if (bank.country_name) this.form.countryText = bank.country_name
                    if (bank.international_remittance_code) this.form.international_remittance_code = bank.international_remittance_code
                    if (bank.address) this.form.address = bank.address
                    this.form.cityName = bank.city_name
                    this.form.provinceName = bank.province_name
                    this.proviceDefaultValue.push(bank.province)
                    this.cityDefaultValue.push(bank.city)
                }
            }
        },

        _getBaseBankList () {
            const OtherCountry = this.OtherCountry
            // const bankList = getBankList()
            // if (bankList.length === 0) {
            getBaseBankList().then(res => {
                // debugger
                if (res.code === 1) {
                    this.bankList = []
                    for (let i = 0; i < res.data.data.length; i++) {
                        const item = res.data.data[i]
                        if (!OtherCountry && item.code.indexOf('PCT') === -1 && item.code.indexOf('INT') === -1 && item.code.indexOf('H2P') === -1) {
                            this.bankList.push(item)
                        } else if ((OtherCountry && (item.code.indexOf('INT') === 0 || item.code.indexOf('H2P') === 0))) {
                            const _currency = AREACODEMAP[this.matchAreacode.img]
                            if (_currency && item.code.indexOf(`-${_currency}-`) >= 0) {
                                this.bankList.push(item)
                            }
                        }
                    }
                    // setBankList(this.bankList)
                }
            })
            // } else {
            //   this.bankList = bankList
            // }
        },
        // 选择什么银行
        onSelectBank (bank, index) {
            this.selectBankIndex = index
            this.form.bank = bank.code
            this.form.bankName = bank.name
            this.hidePopUp()
        },
        // 上传银行卡
        onComplete ({
            name,
            url,
            success
        }) {
            if (success) {
                this.form.card_url = url
            }
        },
        openPickHandle () {
            this.isPickerShow = true
        },
        async openPickCityHandle () {
            if (!this.form.province) {
                this.$toast(this.$t('other.selectedProvince'))
                return
            }

            await this.getCity()
            if (this.cityData.length > 0) {
                this.isPickerShowCity = true
            } else {
                this.$toast(this.$t('other.cityListEmpty'))
            }
        },
        onPickerConfirm (val, i) {
            this.form.province = val.value
            this.form.provinceName = val.text
            this.cityData = []
            this.isPickerShow = false
            this.getCity()
        },

        onPickerConfirmCity (val) {
            console.log(val)
            this.form.city = val.value
            this.form.cityName = val.text
            this.isPickerShowCity = false
        },
        async getCity () {
            return new Promise(resolve => {
                this.$store.dispatch('funds/getCity', this.form.province).then(res => {
                    this.cityData = res
                    // debugger
                    console.log(res)
                    resolve(resolve)
                })
            })
        },
        onReaderComplete ({
            name,
            dataUrl,
            file
        }) {
            this.imgSrc = dataUrl
        },
        showPopUp () {
            this.isPopupShow.right = true
        },
        hidePopUp () {
            this.isPopupShow.right = false
        },
        onSubmit () {
            this.$refs.formWrap.validate()
                .then(result => {
                    if ((this.userBankList.filter(item => (item.account_no == this.form.account_no && item.id != this.form.id))).length > 0) {
                        this.$toast(this.$t('other.inputBankCardRepeat'))
                        return
                    }
                    this.$toast.loading(this.$t('submitimg'), 10000)
                    console.log(JSON.stringify({
                        withdrawalBanks: [this.form]
                    }))
                    modifyUserInfo({
                        withdrawalBanks: [{
                            ...this.form,
                            currency: this.OtherCountry ? AREACODEMAP[this.matchAreacode.img] : AREACODEMAP[86]
                        }]
                    })
                        .then(res => {
                            if (res.code === 1) {
                                this.$store.dispatch('funds/getUserInfo')
                                this.getUserStatus()
                                this.$toast.clear()
                                this.showSuccess = true
                                this.disabledSuccAnimtion = true
                                // 弹窗
                            } else {
                                if (res.msgCode === 'A_OTHER_ERRER') {
                                    this.$toast(this.$t('other.submitFailTip'))
                                } else {
                                    this.$toast({
                                        duration: 1000,
                                        message: this.$te('retMsg.' + res.msgCode)
                                            ? this.$t('retMsg.' + res.msgCode) : res.msg
                                    })
                                }
                            }
                        })
                        .catch(() => {
                            this.$toast(this.$t('other.submitFailTip'))
                        })
                })
                .catch(({
                    errors,
                    fileds
                }) => {
                    this.$toast(errors[0].message)
                })
        },
        goLiveService () {
            if (this.$store.state.inApp) {
                appClose()
                appGoCS()
            } else {
                this.isPC ? window.open(this.onlineService, '_blank') : this.$router.push({
                    name: 'Nest',
                    params: {
                        id: 'queryinfo'
                    },
                    query: {
                        url: this.onlineService,
                        title: this.$t('linkService')
                    }
                })
            }
        },
        addedClose () {
            if (this.$route.params.canReturn) {
                this.$router.go(-1)
            } else {
                this.$router.push({
                    name: 'Certified'
                })
            }
        },
        formatterCard (val) {
            this.form.showAccountNo = val.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
            this.form.account_no = this.form.showAccountNo.replace(/\s/g, '')
        },
        // 选择国家
        // countrySelect (data) {
        //     this.form.country = data.code
        //     this.form.countryText = data.name
        //     this.countryVisible = false
        // }
    }
}
</script>

<style lang="scss"
       scoped>
    @import "@m/sass/mixin.scss";

    .add-bank {
        position: relative;
        height: 100%;
        padding-bottom: rem(90px);
        overflow: auto;
        &.pc{
                padding-bottom: 72px;
            .btn-submit{
                position: absolute;
                left: 20px;
                right: 20px;
                width: initial;
                bottom: 20px;
            }
            .countryActions{
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
        ::v-deep {
            .md-picker-column-item {
                .column-list {
                    .column-item {
                        &.active {
                            color: #2f86f6;
                            font-weight: 500;
                        }
                    }
                }
            }
        }

        ::v-deep .md-field-item-title {
            width: rem(180px);
        }

        .fixed-picker {
            position: fixed;
            left: 0;
            width: 100vw;
            bottom: 0;
            z-index: 10000;
        }

        fieldset {
            border: none;
            background-color: #fff;
        }

        .success {
            .successIcon {
                display: block;
                position: relative;
                width: rem(118px);
                height: rem(118px);
                line-height: rem(110px);
                margin: rem(60px) auto 0;
                border-radius: 100%;
                text-align: center;
                color: #fff;
                font-size: rem(70px);
            }

            .title {
                text-align: center;
                margin-top: rem(5px);
                color: #333333;
                font-size: rem(30px);
            }

            .tip {
                padding: rem(30px);
                color: #8f8f8f;
                font-size: rem(30px);
            }
        }

        .btn-submit {
            position: fixed;
            z-index: 200;
            left: 0;
            bottom: 0;
            width: 100%;

            ::v-deep {
                .van-button {
                    border-radius: 0;
                }
            }
        }

        .upload-wrp {
            padding: rem(30px);
            background-color: #fff;

            .upload-title {
                color: $text;
            }
        }

        .md-example-popup {
            position: relative;
            top: 0;
            bottom: 0;
            font-size: rem(28px);
            background-color: #fff;
        }

        .md-example-popup-right {
            overflow-y: auto;
            min-width: rem(200px);
            padding: 0 30px;
            height: 100%;

            .bank-item {
                padding: rem(20px) 0;
                max-width: rem(320px);
                line-height: rem(40px);

                &.active {
                    color: $color-red;
                }

                .name {
                    margin-left: rem(10px);
                    width: 100%;
                }
            }
        }

        .scroll {
            padding: rem(20px) 0 rem(60px);
        }

        .m-field {
            ::v-deep {
                .van-cell__title {
                    font-size: rem(28px);
                    color: #4c6072;
                    width: auto;
                    white-space: nowrap;
                    padding-right: rem(20px);
                }

                .van-cell {
                    &:after {
                        left: 0;
                    }
                }
            }
        }
    }
</style>
