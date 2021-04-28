<template>
    <div class='topBar'>
        <h1 class='logo'>
            <template v-if="companyLogo.url.trim()===''">
                <a href='javascript:void(0)'>
                    <img alt :src='companyLogo.img' />
                </a>
            </template>
            <template v-else>
                <a :href='companyLogo.url' target='_blank'>
                    <img alt :src='companyLogo.img' />
                </a>
            </template>
        </h1>
        <div v-if='accountInfo.accountNo && accountInfo.accountDemoNo' class='user-type-change'>
            <template v-if="accountInfo.accountType === 'real'">
                <a
                    v-prophet="['trackEvent', '我的', '我的页面', '我的页面_切换账号', 36]"
                    href='javascript:void(0)'
                    @click.stop='changeAccountType(accountInfo.accountType)'
                >
                    <span v-if='isActivityUser'>
                        {{ $t('trade.toExperience') }}
                    </span>
                    <span v-else>
                        {{ $t('trade.toDemo') }}
                    </span>
                </a>
            </template>
            <template v-else-if="accountInfo.accountNo && accountInfo.accountType === 'demo'">
                <a
                    v-prophet="['trackEvent', '我的', '我的页面', '我的页面_切换账号', 36]"
                    href='javascript:void(0)'
                    @click.stop='changeAccountType(accountInfo.accountType)'
                >
                    {{ $t('trade.toReal') }}
                </a>
            </template>
        </div>

        <template v-if='accountCurrency'>
            <div v-tooltip.bottom="{ ref:'information', delay: 100,onshow:showInformation,onhide:hideInformation,offset: 5,class: 'tooltip-information',visible:accountInfo.accountType === 'real' }" class='user-bar' :class='{ active:informationVisible }'>
                <div class='account'>
                    <div
                        class='no'
                    >
                        {{ accountInfo.accountType === 'real' ? accountInfo.accountNo : accountInfo.accountType === 'demo' ? accountInfo.accountDemoNo : '' }}
                    </div>
                    <div
                        v-if='userStatus.infoApprovalStatus !=-1'
                        class='renzheng'
                        :class="'status'+userStatus.infoApprovalStatus"
                    >
                        <em>{{ accountTypeText }} </em>
                        <em v-if='accountInfo.accountType==="real"'>
                            ·
                        </em>
                        <span v-if='accountInfo.accountType==="real"'>
                            {{ $t('mine.renzhengStatus.'+userStatus.infoApprovalStatus) }}
                        </span>
                    </div>
                </div>
                <div class='face'>
                    <i class='icon-face'></i>
                </div>
                <div v-if='accountInfo.accountType==="real"' class='dropdown-caret'>
                    <van-icon name='arrow-down' />
                    <!-- <i class="iconfont icon_xiangxiajiantou-da"></i> -->
                </div>
            </div>
            <div id='information' ref='information' class='information'>
                <div class='face'>
                    <i class='icon-face'></i>
                </div>
                <div
                    class='no'
                >
                    {{ accountInfo.accountType === 'real' ? accountInfo.accountNo : accountInfo.accountType === 'demo' ? accountInfo.accountDemoNo : '' }}
                </div>
                <div
                    v-if='userStatus.infoApprovalStatus !=-1'
                    class='renzheng'
                    :class="'status'+userStatus.infoApprovalStatus"
                >
                    <i class='icon_icon_renzheng'></i>
                    <span class='tooltip-desc'>
                        {{ $t('mine.renzhengStatus.'+userStatus.infoApprovalStatus) }}
                    </span>
                </div>
                <div v-if="userInfo.id_document_status==='-6'" class='certified'>
                    <p>{{ $t('label.authenticatTip') }}</p>
                    <div class='verified-btn'>
                        <router-link :to="{ name:'Certified' }">
                            {{ $t('form.button.toVerified') }}
                        </router-link>
                    </div>
                </div>
                <div v-else class='certified'>
                    <van-cell-group>
                        <van-cell
                            :is-link="userInfo.id_document_status !=='2'"
                            style='display: flex;align-items: center;'
                            :title="$t('form.title.idDocumentFiles')"
                            @click='idCardHandle'
                        >
                            <div>
                                <div class='right'>
                                    <span>{{ status }}</span>
                                    <i v-if='idStatus' slot='right' class='rightIcon van-icon' :class='idStatus'></i>
                                </div>
                            </div>
                        </van-cell>
                        <van-cell
                            is-link
                            :title="$t('form.title.myBanks')"
                            @click="$router.push({ name:'BankList', query: $route.query })"
                        />
                    </van-cell-group>
                </div>
            </div>
        </template>

        <template v-else>
            <div class='visitor'>
                <router-link :to="{ name:'Login' }">
                    {{ $t('login') }}
                </router-link>
                <a
                    v-if='uiPageList && (uiPageList.openRealAccount || uiPageList.openDemoAccount || uiPageList.RegisterByEmail)'
                    class='register'
                    href='javascript:;'
                    @click='toRegister'
                >
                    {{ $t('register') }}
                </a>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { localSet, localGet, getLoginData, getBLen } from '@/utils/index'
export default {
    data () {
        return {
            code: '',
            informationVisible: false
        }
    },
    computed: {
        ...mapState(['userStatus']),
        accountCurrency () {
            return this.$store.getters.accountCurrency
        },
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accInfo () {
            return this.$store.state.accInfo ? this.$store.state.accInfo : {}
        },
        isActivityUser () {
            // debugger
            return this.accInfo.maxAmount > 0
        },
        accountTypeText () {
            if (this.accountInfo) {
                if (this.accountInfo.accountType === 'demo') {
                    return this.isActivityUser ? this.$t('trade.experience') : this.$t('trade.demo')
                } else {
                    return this.$t('trade.real')
                }
            } else {
                return ''
            }
        },
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList || {}
        },
        companyLogo () {
            try {
                return (this.uiPageList.FrontLog && this.uiPageList.FrontLog.uiModules[0].uiComponent[0]) || { url: '' }
            } catch (error) {
                return { url: '' }
            }
        },
        userInfo () {
            // debugger
            return this.$store.state.funds.userInfo
        },
        bankList () {
            const banks = this.userInfo.withdraw_banks || []
            const successArr = []
            const failedArr = []
            const undoArr = []
            banks.forEach(el => {
                if (parseInt(el.approve_status) === 2) {
                    successArr.push(el)
                } else if (parseInt(el.approve_status) === -1) {
                    failedArr.push(el)
                } else {
                    undoArr.push(el)
                }
            })
            return successArr.concat(undoArr).concat(failedArr)
        },
        idStatus () {
            const code = parseInt(this.userInfo.id_document_status)
            if (code < 1) {
                return 'van-icon-warning'
            }
            if (code === 1) {
                return 'van-icon-underway'
            }
            if (code > 1) {
                return 'van-icon-checked'
            }
            return ''
        },
        status () {
            // debugger
            const code = this.userInfo.id_document_status
            return this.$t(`enumeration.idCartStatus.${code}`)
        }
    },
    mounted () {
        this.init()
        // console.log('information', this.$refs['information'])
    },
    created () {
        this.$store.dispatch('funds/getUserInfo').then(res => {
            // next()
        })
    },
    methods: {
        ...mapActions(['getUserStatus']),
        init () {
            const info = this.userInfo
            const bankList = this.bankList
            const withdrawalBankId = localGet('withdrawalBankId')
            if (withdrawalBankId && bankList.find(el => el.id == withdrawalBankId)) {
                this.bankSelected = Number(withdrawalBankId)
            } else if (bankList.length > 0) {
                this.bankSelected = bankList[0].id
            }
            if (this.accountCurrency) {
                this.queryUserStatus()
            }
        },
        showInformation () {
            if (this.accountInfo.accountType === 'real') this.informationVisible = true
            // console.log('showInformation')
        },
        hideInformation () {
            this.informationVisible = false
            // console.log('hideInformation')
        },
        toRegister () {
            const companyInfo = this.$store.getters.companyInfo
            const uiPageList = companyInfo.uiPageList
            const openRealAccount = uiPageList.openRealAccount
            const RegisterByEmail = uiPageList.RegisterByEmail
            const nextPath = { name: 'OpenAccount', params: { id: 'openreal' } }
            if (!openRealAccount && !RegisterByEmail) {
                return this.$toast({ message: this.$t('systemErrorTip'), duration: 1500 })
            }
            this.$router.push(nextPath)
        },
        changeAccountType (type) {
            const accountType = type === 'real' ? 'demo' : 'real'
            const loginData = getLoginData()
            if (loginData) {
                loginData.accountType = accountType
            }
            localSet('loginData', JSON.stringify(loginData))
            this.$toast.loading({
                mask: true,
                duration: 0,
                message: this.$t('accountSwitch')
            })
            location.reload()
            // this.$ws.send_switchAccount(() => {
            //     this.$emit('change-account')
            // })
        },
        // 获取用户文件审核状态
        queryUserStatus () {
            this.getUserStatus().then(res => {
                if (res.code === 1) {
                    const data = res.data
                    if (data.idDocumentStatus === '3' || data.bankInfoStatus == '3') {
                        let bankInfoRejectedReason = ''
                        let idDocumentRejectedReason = ''
                        // 认证失败
                        if (data.bankInfoRejectedReason && data.bankInfoStatus == '3') bankInfoRejectedReason = `“${data.bankInfoRejectedReason}”`
                        if (data.idDocumentRejectedReason && data.idDocumentStatus == '3') idDocumentRejectedReason = `“${data.idDocumentRejectedReason}”`
                        let msg = bankInfoRejectedReason || idDocumentRejectedReason
                        if (bankInfoRejectedReason && idDocumentRejectedReason) msg = idDocumentRejectedReason + ` ${this.$t('ji')} ` + bankInfoRejectedReason
                        const message = this.$t('label.authenticatError', [msg])
                        //    this.dialogGoAuthenticat(message)
                    } else if (data.idDocumentStatus == '0' || data.bankInfoStatus == '0') {
                        // 未认证
                        //   this.dialogGoAuthenticat(this.$t('label.authenticatTip'), 0);
                    } else if (data.idDocumentStatus === '1' && data.bankInfoStatus == '1') {
                        // 已认证
                    } else {
                        // 认证中
                        //  this.dialogAuthenticating(this.$t('label.authenticating'))
                    }
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        idCardHandle () {
            // if (this.userInfo.id_document_status === '1') {
            //   this.$toast.info('文件在审核中,请耐心等待!!!')
            //   return
            // }
            // debugger
            if (['0', '1', '2'].includes(this.userInfo.id_document_status)) {
                return
            }
            this.$router.push({ name: 'Authentication', query: this.$route.query })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@pc/sass/mixin.scss";
.topBar {
    position: relative;
    z-index: 105;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    background: #ecedf1;
    display: flex;
    align-items: center;
    ::v-deep {
        .van-icon {
            &.van-icon-arrow-down {
                font-size: 16px;
                color: #707080;
            }
        }
    }
    color: #fff;
    .logo {
        flex: 1;
        a {
            line-height: 1;
            display: inline-block;
        }
        img {
            max-height: 36px;
            vertical-align: middle;
        }
    }
    .user-type-change {
        padding-right: 33px;
        white-space: nowrap;
        a {
            display: inline-block;
            padding: 0 10px;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            background: #477fd2;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            &:hover {
                background-color: #2d6cc9;
            }
        }
    }
    .user-bar {
        display: flex;
        line-height: initial;
        position: relative;
        cursor: pointer;
        align-items: center;
        height: 50px;
        // width: 200px;
        &.active:hover,&.active {
            background-color: #d4d5d8;
        }
        & > div {
            display: table-cell;
            vertical-align: middle;
        }
        .dropdown-caret {
            padding: 0 10px 0 13px;
        }

        &:hover {
            .information {
                display: block;
            }
        }
        .account {
            color: #404040;
            text-align: right;
            padding-right: 8px;
            flex: 1;
            .no {
                font-size: 14px;
                .icon {
                    font-size: 24px;
                }
            }
            .renzheng {
                font-size: 12px;
                color: #787c86;
                em {
                    font-style: normal;
                }
                &.status0 {
                    span {
                        color: #fe654c;
                    }
                }
                &.status1 {
                    span {
                        color: #10b873;
                    }
                }
                &.status2 {
                    span {
                        color: #feb04c;
                    }
                }
                &.status3 {
                    span {
                        color: #fe654c;
                    }
                }
            }
        }

    }
        //     .information {
        //     width: 280px;
        //     height: 330px;
        //     background: rgba(255, 255, 255, 1);
        //     box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.3);
        //     border-radius: 6px;
        //     position: absolute;
        //     right: 0;
        //     top: 50px;
        //     display: none;
        //     .face,
        //     .no,
        //     .renzheng {
        //         text-align: center;
        //     }
        //     .face {
        //         padding: 40px 0 10px;
        //     }
        //     .icon-face {
        //         width: 60px;
        //         height: 60px;
        //     }
        //     .no {
        //         font-size: 14px;
        //         color: #404040;
        //     }
        //     .renzheng {
        //         padding: 6px 0 30px;
        //         span {
        //             color: #fff;
        //             font-size: 10px;
        //             vertical-align: top;
        //         }
        //         i {
        //             font-size: 18px;
        //         }
        //         &.status0 {
        //             i {
        //                 color: #fe654c;
        //             }
        //             span {
        //                 background-color: #fe654c;
        //             }
        //         }
        //         &.status1 {
        //             i {
        //                 color: #10b873;
        //             }
        //             span {
        //                 background-color: #10b873;
        //             }
        //         }
        //         &.status2 {
        //             i {
        //                 color: #feb04c;
        //             }
        //             span {
        //                 background-color: #feb04c;
        //             }
        //         }
        //         &.status3 {
        //             i {
        //                 color: #fe654c;
        //             }
        //             span {
        //                 background-color: #fe654c;
        //             }
        //         }
        //     }
        // }
    .visitor {
        a {
            display: inline-block;
            width: 100px;
            height: 30px;
            line-height: 30px;
            background-color: #477fd3;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            border-radius: 2px;
            margin: 0 10px;
            &.register {
                background-color: #f39801;
            }
        }
    }
    .icon-logo {
        display: inline-block;
        width: 158px;
        height: 36px;
        background: url(~@public/images/logo.png) no-repeat center center;
        background-size: 100%;
    }
    .icon-face {
        background-image: url(~@public/images/face.png);
        width: 40px;
        height: 40px;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    .icon-arrow-down {
        background-image: url(~@public/images/arrow-down.svg);
        width: 14px;
        height: 14px;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    // .certified {
    //     ::v-deep {
    //         .van-cell {
    //             &:hover {
    //                 background-color: #f2f2f2;
    //             }
    //         }
    //     }
    //     p {
    //         font-size: 13px;
    //         color: #ccc;
    //         padding: 0 28px;
    //     }
    //     .verified-btn {
    //         padding: 40px 28px 0;
    //         a {
    //             position: relative;
    //             display: inline-block;
    //             box-sizing: border-box;
    //             height: 44px;
    //             line-height: 44px;
    //             margin: 0;
    //             padding: 0;
    //             text-align: center;
    //             border-radius: 2px;
    //             cursor: pointer;
    //             transition: opacity 0.2s;
    //             display: inline-block;
    //             width: 100%;
    //             color: #fff;
    //             background-color: #477fd2;
    //             border: 1px solid #477fd2;
    //             padding: 0 15px;
    //             font-size: 14px;
    //             &:hover {
    //                 background-color: #2d6cc9;
    //                 border: 1px solid #2d6cc9;
    //             }
    //         }
    //     }
    //     .van-cell {
    //         padding: rem(30px) rem(30px);
    //         &:after {
    //             left: 0;
    //         }
    //     }
    //     .right {
    //         display: flex;
    //         flex-direction: row;
    //         align-items: center;
    //         justify-content: flex-end;
    //     }
    //     .rightIcon {
    //         position: relative;
    //         font-size: rem(40px);
    //         margin-left: rem(10px);
    //         &.van-icon-warning {
    //             color: #ef5762;
    //         }
    //         &.van-icon-checked {
    //             color: #0caf82;
    //         }
    //         &.van-icon-underway {
    //             color: #f39800;
    //         }
    //     }
    // }
}
.tooltip-desc{
    height: 14px;
    display: inline-block;
    line-height: 14px;
    margin-top: 3px;
    margin-left: -2px;
}
</style>
