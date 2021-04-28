<template>
    <div class='m-myAsset'>
        <!-- <van-popup
            v-model="showMyAsset"
            @click-overlay="visibleChange"
            position="bottom"
            class="popup-myAsset"
            get-container="#mainContainter"
        >-->
        <div class='layout-1'>
            <template v-if='/^(\-|\+)?\d+(\.\d+)?$/.test(assetAboutInfo.accountData.jyk)'>
                <div class='warp'>
                    <div
                        v-if="accountInfo.accountType === 'real' && assetAboutInfo.accountData.jz ==0 && userLoginInfo.balance ==0"
                        class='m-empty'
                    >
                        <ListEmpty icon='icon_icon_blank_assets' :txt="$t('trade.marginEmpty')" />
                    </div>
                    <div v-else>
                        <div class='subTitle level-title'>
                            {{ $t('trade.marginLevel') }}
                        </div>
                        <div class='item-3' :class='assetAboutInfo.colorClass'>
                            <div class='progress-base'>
                                <div class='progress-color' :style="{ width: percent.all.position+'%' }"></div>
                                <div class='number'>
                                    {{ percent.all.number }}
                                </div>
                            </div>
                        </div>
                        <div class='subTitle'>
                            {{ $t('trade.assetDistribute') }}
                            <span>（{{ $t('trade.unit') }} : {{ symbolCode }}）</span>
                        </div>
                        <div class='percent'>
                            <SvgPercent
                                v-if="assetAboutInfo.accountData.jz !== ''"
                                :data-list='dataList'
                                :jz='assetAboutInfo.accountData.jz'
                            />
                        </div>
                        <div class='percent-info'>
                            <div class='item'>
                                <div class='title'>
                                    {{ $t('trade.netProfit') }}
                                </div>
                                <div
                                    class='val'
                                    :class="{
                                        'riseColor':assetAboutInfo.accountData.jyk>0,
                                        'fallColor':assetAboutInfo.accountData.jyk<0 }"
                                >
                                    {{ assetAboutInfo.accountData.jyk | moneyAccuracy }}
                                </div>
                            </div>
                            <div class='item'>
                                <div class='title'>
                                    {{ $t('trade.freeMargin') }}
                                </div>
                                <div class='val val2'>
                                    {{ assetAboutInfo.accountData.kybzj | moneyAccuracy(false) }}
                                </div>
                            </div>
                            <div class='item'>
                                <div class='title'>
                                    {{ $t('trade.originalMargin') }}
                                </div>
                                <div class='val val3'>
                                    {{ assetAboutInfo.accountData.csbzj | moneyAccuracy(false) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <template v-if="accountInfo.accountType === 'real'"> -->
                    <div class='btn-group'>
                        <template v-if="accountInfo.accountType==='demo'">
                            <template v-if='accountInfo.accountNo'>
                                <van-button
                                    block
                                    class='btn'
                                    type='primary'
                                    @click='changeAccountType(accountInfo.accountType)'
                                >
                                    {{ $t('trade.toReal') }}
                                </van-button>
                            </template>
                        </template>
                        <template v-else>
                            <van-button
                                v-prophet="['trackEvent', '交易', '资产', '资产_出金', 74]"
                                class='btn'
                                :color='style.mainColor'
                                size='small'
                                type='primary'
                                @click="toIframePage('drawings');_collect('我的资产_出金', true)"
                            >
                                {{ $t('trade.drawings') }}
                            </van-button>
                            <van-button
                                v-prophet="['trackEvent', '交易', '资产', '资产_入金', 73]"
                                class='btn'
                                size='small'
                                type='warning'
                                @click="toIframePage('deposit');_collect('我的资产_入金', true)"
                            >
                                {{ $t('trade.deposit') }}
                            </van-button>
                        </template>
                    </div>
                    <!-- </template> -->

                    <!-- <template v-else>
                            <van-button
                                v-if="accountInfo.accountNo"
                                class="btn"
                                type="primary"
                                :color="style.mainColor"
                                size="large"
                                @click="changeToReal"
                            >{{$t('trade.toReal')}}</van-button>
                    </template>-->
                </div>
            </template>
            <div v-else class='m-loading'>
                <van-loading size='30px'>
                    {{ $t('calculating') }}
                </van-loading>
            </div>
        </div>
        <!-- <div class="layout-2" @click="showMyAsset=false">
                <div class="close">
                    <i class="van-icon van-icon-arrow-up" />
                </div>
        </div>-->
        <!-- </van-popup> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SvgPercent from '@m/components/SvgPercent.vue'
import AccountChange from '@m/components/AccountChange.vue'
import ErrorTips from '@m/components/ErrorTips.vue'
import ListEmpty from '@m/components/ListEmpty'
import * as getUrl from '@/api/getUrl'
import { localSet, getLoginData } from '@/utils/index'
export default {
    name: 'MyAsset',
    components: {
        SvgPercent,
        AccountChange,
        ErrorTips,
        ListEmpty
    },
    // model: {
    //     prop: "showMyAsset",
    //     event: "childToParent"
    // },
    props: {
        showAsset: {
            type: Boolean,
            defaults: false
        }
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo', 'symbolCode', 'accountData']),
        dataList () {
            return [
                {
                    color: '#477FD3',
                    value: Math.abs(this.assetAboutInfo.accountData.kybzj)
                },
                {
                    color: '#F39800',
                    value: Math.abs(this.assetAboutInfo.accountData.csbzj)
                },
                {
                    color: this.assetAboutInfo.accountData.jyk > 0 ? this.style.riseColor : this.style.fallColor,
                    value: Math.abs(this.assetAboutInfo.accountData.jyk)
                }
            ]
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        marginLevel () {
            const transBaseConfigVo = this.$store.state.ix_user.info ? this.$store.state.ix_user.info.transBaseConfigVo : {}
            if (transBaseConfigVo.marginLevel) {
                return JSON.parse(transBaseConfigVo.marginLevel)
            } else {
                return {}
            }
        },
        percent () {
            const stopOut = '10'
            const allPostion = (this.assetAboutInfo.accountData.jz / this.userLoginInfo.margin_stop_out * 10).toFixed(2)
            return {
                all: {
                    position: allPostion > 100 ? '100' : allPostion,
                    number: this.assetAboutInfo.accountData.csbzj <= 0 ? '--' : (this.assetAboutInfo.accountData.jz.toFixed(2) / this.assetAboutInfo.accountData.csbzj * 100).toFixed(2) + '%'
                },
                // less: {
                //     position: `calc(${stopOut * this.marginLevel.marginLess / 100}% - 4px)`
                // },
                // warn: {
                //     position: `calc(${stopOut * this.marginLevel.marginWarn / 100}% - 4px)`
                // },
                stopOut: {
                    position: `calc( ${stopOut}% - 4px )`
                }
            }
        }
    },
    created () {
        // this.$emit('provide', {
        //     sp: this.percent.all.number,
        //     jz: this.assetAboutInfo.accountData.jz,
        //     yk: this.assetAboutInfo.accountData.jyk,
        //     kybzj: this.assetAboutInfo.accountData.kybzj,
        //     zybzj: this.assetAboutInfo.accountData.csbzj
        // })
    },
    methods: {
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
        },
        visibleChange (val) {
            this.$emit('childToParent', false)
        },
        toIframePage (flg) {
            if (flg === 'deposit') {
                this.$router.push({ name: 'DepositFunds' })
            } else if (flg === 'drawings') {
                this.$router.push({ name: 'WithAmount' })
            } else if (flg === 'opendemo' || flg === 'openreal') {
                this.$router.push({ name: 'OpenAccount', params: { id: flg } })
            } else {
                this.$router.push({ name: 'Nest', params: { id: flg } })
            }
            this.$emit('childToParent', false)
            // this.showMyAsset = false
        },
        changeToReal () {
            this.$ws.send_switchAccount()
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";

.m-myAsset {
    position: absolute;
    min-width: 300px;
    max-width: 400px;
    z-index: 10000;
    background: #ffffff;
    box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    right: 0;
    bottom: 60px;
    overflow: hidden;
    .assetIcon {
        right: 0;
        bottom: 0;
        height: 100%;
        line-height: rem(90px);
        .other {
            position: relative;
            top: rem(-5px);
            display: inline-block;
            margin-left: rem(10px);
            font-size: rem(28px);
            line-height: rem(50px);
            i {
                font-size: rem(24px);
                margin-left: rem(10px);
            }
        }
        &.adequate {
            color: #11b873;
        }
        &.less {
            color: #f39800;
        }
        &.stopout {
            color: #e3525c;
        }
        i {
            font-size: rem(45px);
        }
    }
    .showMore {
        background-color: #f9f9f9;
        box-sizing: border-box;
        padding: rem(30px) rem(40px) rem(15px);
        .header-wrap {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .title,
            .icon {
                line-height: rem(32px);
            }
            .title {
                font-size: rem(30px);
            }
            .icon {
                position: relative;
                right: rem(-4px);
            }
        }
        .flex-content {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-content: center;
            padding: rem(20px) 0 0;
            border-radius: rem(5px);
            .item {
                flex: 1;
                &:first-child {
                    text-align: left;
                }
                &:last-child {
                    text-align: right;
                }
            }
            .sub {
                color: #333333;
                font-size: rem(24px);
                // margin-bottom: rem(10px);
            }
            .number {
                color: #477fd3;
                font-size: rem(46px);
            }
        }
    }
    .m-empty {
        padding: rem(100px) 0;
    }
    .layout-1 {
        background-color: #fff;
        color: #333333;
        .btn-group {
            padding-top: 8px;
            .btn {
                width: 46%;
                height: 40px;
                border-radius: 2px;
                font-size: 14px;
                line-height: 40px;
                margin: 0 5px;
                &.van-button--primary {
                    background-color: #477fd2 !important;
                    &:hover {
                        background-color: #2d6cc9 !important;
                    }
                }
                &.van-button--warning {
                    background-color: #f39800;
                    &:hover {
                        background-color: #dd8a00;
                    }
                }
                &.van-button--block {
                    width: 100%;
                    border-color: transparent;
                }
            }
        }
        .warp {
            max-height: 70vh;
            overflow-y: auto;
            padding: rem(40px) rem(30px);
            padding-top: 0;
            @include scroll();
        }
        .title {
            padding-top: rem(30px);
            text-align: center;
            font-size: rem(30px);
        }
        .subTitle {
            font-size: 14px;
            padding-top: 0;
            &.level-title {
                padding-top: 24px;
                padding-bottom: 16px;
            }
            span {
                padding-left: rem(10px);
                font-size: rem(20px);
            }
        }
        .percent {
            position: relative;
            text-align: center;
        }
        .errorTips {
            margin-bottom: rem(30px);
        }
        .item-1 {
            text-align: center;
            margin-top: rem(10px);
            margin-bottom: rem(40px);
        }
        .item-3 {
            position: relative;
            padding-bottom: rem(20px);
            .progress-base {
                position: relative;
                display: inline-block;
                width: 100%;
                height: rem(10px);
                background-color: #efefef;
                border-radius: rem(5px);
                .progress-color {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: rem(10px);
                    border-radius: rem(5px);
                    width: 50%;
                }
                .number {
                    position: absolute;
                    z-index: 20;
                    right: 0;
                    bottom: rem(38px);
                    display: inline-block;
                    font-size: rem(50px);
                }
            }
            &.adequate {
                .progress-base {
                    .progress-color {
                        background-color: #10b873;
                    }
                    .number {
                        color: #10b873;
                    }
                }
            }
            &.less {
                .progress-base {
                    .progress-color {
                        background-color: #f39800;
                    }
                    .number {
                        color: #f39800;
                    }
                    .tip-2 {
                        .txt {
                            color: #f39800;
                        }
                    }
                }
            }
            &.stopout {
                .progress-base {
                    .progress-color {
                        background-color: #e3525c;
                    }
                    .number {
                        color: #e3525c;
                    }
                    .tip-2 {
                        .txt {
                            color: #e3525c;
                        }
                    }
                }
            }
        }
        .percent-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            padding: 0 rem(40px);
            .title {
                color: #333333;
                font-size: rem(24px);
                padding-bottom: rem(10px);
            }
            .val {
                font-size: rem(34px);
            }
            .val2 {
                color: #477fd3;
            }
            .val3 {
                color: #f39800;
            }
        }
        .btn {
            margin-top: rem(46px);
            height: rem(80px);
            font-size: rem(34px);
            line-height: rem(80px);
            border-radius: rem(40px);
        }
    }
    .layout-2 {
        text-align: center;
        .close {
            display: inline-block;
            width: rem(60px);
            height: rem(80px);
            text-align: center;
            line-height: rem(80px);
            color: #fff;
            font-size: rem(40px);
        }
    }
}
.popup-myAsset {
    background-color: transparent;
}
.m-loading {
    padding: rem(30px) 0;
    text-align: center;
}
</style>
