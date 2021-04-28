<template>
    <div class='bank-list' :class='{ pc:isPC }'>
        <div class='bank-wrap'>
            <div v-if='bankList.length<=0'>
                <NoBankCard style='margin: 30% auto' />
            </div>
            <!--bank.bank_name-->
            <fieldset v-else class='m-field'>
                <div class='m-field-content'>
                    <div v-for='bank in bankList' :key='bank.id' class='m-cell-item'>
                        <div class='warp'>
                            <div class='m-cell-item-body'>
                                <div class='m-cell-item-left'>
                                    <span class='bank-img ml' :class='[bank.bankClass]'></span>
                                </div>
                                <div class='m-cell-item-content'>
                                    <p class='m-cell-item-title'>
                                        {{ bank.bank_name }}
                                    </p>
                                    <p class='m-cell-item-brief'>
                                        {{ bank.account_no | bankNumFilter }}
                                    </p>
                                    <!---1是不通过-->
                                </div>
                                <div class='m-cell-item-right'>
                                    <div>
                                        <div
                                            v-if="bank.approve_status!=='2'"
                                            class='error-tips'
                                            :class="bank.approve_status==='-1'?'clear':'warning'"
                                        >
                                            {{ bank.approve_status==='-1'? $t('form.title.failedApproval'):$t('form.title.approvaling') }}
                                        </div>
                                        <!-- <span v-if="lang==='zh-CN'" class='bank-num'>
                                            {{ bank.account_no | bankNumFilter }}
                                        </span> -->
                                    </div>
                                </div>
                            </div>
                            <div v-if="bank.approve_status==='-1'" class='errorMsg'>
                                {{ bank.canel_reason }}
                            </div>
                            <div class='actionBtn'>
                                <van-button
                                    v-if="bank.approve_status==='-1'"
                                    block
                                    plain
                                    size='small'
                                    @click="$router.push({ name:'AddBank',query:{ id:bank.id, ...$route.query }, params: { canReturn: true } })"
                                >
                                    {{ $t("form.button.resubmit") }}
                                </van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
        <div v-if='bankList.length>0 && bankList.length<3' class='addBtn'>
            <van-button
                v-prophet="['trackEvent', '我的', '个人信息', '个人信息_添加银行卡' , 39]"
                block
                :color='style.mainColor'
                @click="$router.push({ name:'AddBank', query: $route.query, params: { canReturn: true } })"
            >
                {{ $t('form.title.addBank') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import '@m/sass/bankImg.scss'
import NoBankCard from '@m/components/NoBankCard'
import { mapGetters } from 'vuex'

export default {
    name: 'BankList',
    components: {
        NoBankCard
    },
    computed: {
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        ...mapGetters(['style']),
        bankList () {
            const banks = this.userInfo.withdraw_banks || []
            banks.map(item => {
                item.bankClass = 'bk-' + item.bank
                item.brief = this.$t('form.title.payee:') + item.account_name
                return item
            })
            return banks
        },
        lang () {
            return this.$store.getters.companyInfo?.transBaseConfigVo?.language
        },
    }
}

</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";
.bank-list {
    margin-top: 1px;
    ::v-deep .m-cell-item-brief {
        color: #4c6072;
    }
    &.pc{
        .addBtn{
                margin-bottom: 20px;
        }
    }
    .bank-num {
        color: #000;
        font-weight: bold;
    }

    .button {
        margin-top: rem(10px);
    }

    .error-tips {
        position: absolute;
        right: 0;
        top: 0;
        font-size: rem(20px);
        color: #fff;
        padding: rem(5px) rem(10px);
        border-radius: 0 rem(5px) 0 0;
        &.warning {
            background-color: #f39800;
        }
        &.clear {
            background-color: #ef5762;
        }
    }
    .m-field {
        padding: rem(29px) rem(30px);
        border: none;
        background-color: #fff;
        .warp {
            border: solid 1px #d9d9d9;
            border-radius: rem(5px);
        }
        .m-cell-item {
            position: relative;
            margin-bottom: rem(20px);
            border-radius: rem(5px);
            .m-cell-item-body {
                padding: rem(20px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: rem(100px);

                box-sizing: border-box;

                .m-cell-item-left {
                    flex-shrink: 0;
                    margin-right: 0.42667rem;
                }
                .m-cell-item-content {
                    flex: 1 1 0%;
                    color: #4c6072;
                    font-size: 0.42667rem;
                    line-height: 1.2;
                    .m-cell-item-title {
                        line-height: 1.2;
                    }
                    .m-cell-item-brief {
                        font-size: 0.32rem;
                        line-height: 1.4;
                        margin-top: 0.10667rem;
                        color: #4c6072;
                    }
                }
                .m-cell-item-right {
                    flex-shrink: 0;
                    margin-left: 0.16rem;
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-end;
                    color: #999;
                    font-size: 0.4rem;
                }
            }
        }
    }
    .addBtn {
        margin-top: rem(20px);
        padding: 0 rem(32px);
    }
    .errorMsg {
        padding: rem(5px) rem(20px);
        color: #ef5762;
    }
    .actionBtn {
        color: #ef5762;
        ::v-deep {
            .van-button {
                border-radius: none;
                color: #477fd3;
                border-color: #d9d9d9;
                border-left: none;
                border-right: none;
                border-bottom: none;
            }
        }
    }
}
</style>
