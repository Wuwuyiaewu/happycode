<template>
    <div :class='{ pc:isPC }'>
        <!-- 活动金额弹框 -->
        <template v-if='isPC'>
            <ActivityBonus :have-can-get-gift='haveCanGetGift' :is-pc='true' :pending-bouns-list='pendingBounsList' :show-bonus='true' />
        </template>
        <template v-else>
            <div class='item-8'>
                <div class='item van-hairline--top'>
                    <div class='item-div' @click="showData('1')">
                        <span>{{ $t('activity.balanceMax') }}</span>
                        <span>{{ accInfo.maxAmount }}</span>
                        <van-icon class='tip' name='question-o' />
                    </div>
                    <div class='item-div' @click="showData('2')">
                        <span>{{ $t('activity.pendingBonus') }}</span>
                        <span>{{ accInfo.pendingAmount }}</span>
                        <van-icon class='tip' name='question-o' />
                    </div>
                </div>
            </div>
            <van-popup v-model='showBonus' class='m-dialog'>
                <ActivityBonus :have-can-get-gift='haveCanGetGift' :pending-bouns-list='pendingBounsList' :show-bonus='showBonus' @hidden='hideBonus' />
            </van-popup>
        </template>
        <!-- <van-popup v-model='showBonus' class='m-dialog'>
            <div v-if='showBonus' class='bonus'>
                <div class='bouns-title'>
                    {{ $t('activity.pendingBonus') }}
                </div>
                <div class='body'>
                    <div v-if="pendingBounsList.length > '0'" class='bouns-div'>
                        <template v-if='haveCanGetGift'>
                            {{ $t('activity.pendingBonusTip') }}
                        </template>
                        <template v-else>
                            {{ $t('activity.pendingBonusTip_2') }}
                        </template>
                    </div>
                    <ul v-if='pendingBounsList.length > 0'>
                        <li v-for='item in pendingBounsList' :key='item.id' :class="'status'+item.localStatus">
                            <div class='money'>
                                <span>{{ (item.giftAmount).toFixed(2) }}</span>
                                <span>{{ item.giftAmountUnit }}</span>
                            </div>
                            <div class='time'>
                                <span>{{ $t('activity.bounsTip1') }}{{ item.createDate|formatTimesZone }} {{ $t('activity.bounsTip2') }}</span>
                                <span>
                                    <template
                                        v-if="item.localStatus== 'A'"
                                    >
                                        {{ expireDate(item.attr2) }}{{ $t('activity.bounsTip3') }}
                                    </template>
                                    <template v-else-if="item.localStatus== 'B'">
                                        {{ $t('activity.status_B') }}
                                    </template>
                                    <template v-else-if="item.localStatus== 'C'">
                                        {{ $t('activity.status_C') }}
                                    </template>
                                </span>
                            </div>
                        </li>
                    </ul>
                    <img v-else src='../../images/noActivity.png' />
                    <div v-if="pendingBounsList.length == '0'" class='bouns-no-activity'>
                        {{ $t('activity.tip') }}
                    </div>
                    <div v-if="pendingBounsList.length == '0'" class='bouns-no-activity'>
                        {{ $t('activity.tipMessage') }}
                    </div>
                </div>
                <div class='dialog-footer'>
                    <template v-if='pendingBounsList.length>0' class='bouns-btn'>
                        <van-button plain @click='showBonus=false'>
                            {{ $t('activity.close') }}
                        </van-button>
                        <van-button
                            color='#477FD3'
                            :disabled='!haveCanGetGift'
                            @click="$router.push({ name: 'DepositFunds' })"
                        >
                            {{ $t('activity.receive') }}
                        </van-button>
                    </template>
                    <div v-else class='close-btn' @click='showBonus=false'>
                        {{ $t('activity.close') }}
                    </div>
                </div>
            </div>
        </van-popup> -->
    </div>
</template>

<script>
import { getPendingBounsList } from '@/api/mine'
import ActivityBonus from './ActivityBonus'
import pcMixin from '@m/mixins/pc'
// 登记时间 createDate

// 可使用-开始时间 useStartTime

// 支付状态 attr1取值
/*
unpay     未支付
paid      已支付
pay_timeout 支付超时
*/

// 支付过期时间 attr2  yyyy/MM/dd HH:mm:ss

// 可使用-结束时间 useEndTime

// 领取状态 lotteryStatus
// false未完成
// true已完成

// 发放状态 isGived
// false 未发放
// true  已发放

// 结算状态  attr5
// UNTREATED(0, "未处理"),
// HAD_RELEASE(1, "已释放"),
// HAD_LIQUIDATION(2, "已清算");
export default {
    name: 'MineActivity',
    components: {
        ActivityBonus
    },
    mixins: [pcMixin],
    filters: {
        formatTimesZone (val) {
            if (val) {
                return dayjs(val).format('MM-DD HH:mm')
                // return dayjs(new Date(val)).format('YY MM DD HH:mm')
            } else {
                return '--'
            }
        }

    },
    data () {
        return {
            showBonus: false,
            haveCanGetGift: true,
            pendingBounsList: []
        }
    },
    computed: {
        accInfo () {
            return this.$store.state.accInfo ? this.$store.state.accInfo : {}
        }
    },
    created () {
        this.$store.dispatch('getAccPriceInfo') // 获取消息数据
        if (this.isPC) {
            this.getPendingBounsList()
        }
    },
    deactivated () {
        this.$store.dispatch('getAccPriceInfo') // 获取消息数据
    },
    methods: {
        expireDate (timestamp) {
            if (timestamp) {
                const timeChange = (timestamp - (new Date().valueOf())) / 1000
                if (parseInt(timeChange / 3600) > 0) {
                    return parseInt(timeChange / 3600) + this.$t('activity.bounsHour')
                } else if (parseInt(timeChange / 60) > 0) {
                    return parseInt(timeChange / 60) + this.$t('activity.bounsMinute')
                } else {
                    return parseInt(timeChange) + this.$t('activity.bounsSecond')
                }
            } else {
                return '--'
            }
        },
        hideBonus () {
            this.showBonus = false
        },
        showData (type) {
            if (type == '2') {
                this.getPendingBounsList()
            } else {
                this.$dialog.alert({
                    title: this.$t('activity.description'),
                    message: this.$t('activity.descriptionTip', { amount: this.accInfo.maxAmount }),
                    confirmButtonText: this.$t('activity.determine'),
                })
            }
        },
        getPendingBounsList () {
            // 获取待领取赠金列表
            getPendingBounsList().then(res => {
                if (res.code != 0) {
                    this.$toast(this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg || res.message)
                    return
                }
                const _data = {
                    dlq: [], // 待领取
                    ylq: [], // 已领取
                    ygq: [], // 已过期
                }

                console.log('res.data', res.data);

                (res.data || []).forEach(item => {
                    if (item.attr1 == 'paid') {
                        // 已领取
                        _data.ylq.push(Object.assign({ localStatus: 'B' }, item))
                    } else if (item.attr1 == 'unpay') {
                        // 未领取，判断是否已过期
                        const payEndTime = new Date(item.attr2).valueOf()
                        if (payEndTime > (new Date().valueOf())) {
                            // 未过期
                            _data.dlq.push(Object.assign({}, item, { attr2: payEndTime, localStatus: 'A' }))
                        } else {
                            // 已过期
                            _data.ygq.push(Object.assign({ localStatus: 'C' }, item))
                        }
                    } else if (item.attr1 == 'pay_timeout') {
                        // 支付超时
                        _data.ygq.push(Object.assign({ localStatus: 'C' }, item))
                    }
                })
                this.haveCanGetGift = _data.dlq.length > 0
                // if (_data.dlq.length <= 0) {
                //     this.haveCanGetGift = false
                // } else {
                //     this.haveCanGetGift = true
                // }

                // this.pendingBounsList = [].concat(_data.dlq, _data.ylq, _data.ygq)
                this.pendingBounsList = [].concat(_data.dlq)
                this.showBonus = true
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.pc{
    position: absolute;
    width: 340px;
    height: 440px;
    bottom: 60px;
    z-index: 2000;
    background-color: #fff;
    right:0;
    box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    ::v-deep{
        .dialog-footer{
            button{
                margin: 0 20px;
            }
        }
        .bonus{
            width: 340px;
        }
    }
}
.item-8 {
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-direction: column;
    background: #f9f9f9;
    width: 100%;
    .item {
        flex: 1;
        display: flex;
        justify-content: space-between;
        border-color: rgba(234, 234, 234, 1);
        margin: 0 rem(30px);
        .item-div {
            position: relative;
            display: flex;
            width: 45%;
            line-height: rem(80px);
            font-size: rem(24px);
            justify-content: space-between;
            span {
                color: #333;
                vertical-align: middle;
                &:nth-of-type(2) {
                    top: rem(-1px);
                    position: absolute;
                    right: rem(50px);
                    font-size: rem(28px);
                    font-weight: bold;
                }
            }
            .tip {
                position: relative;
                top: 50%;
                font-size: rem(28px);
                margin-top: rem(-13px);
            }
        }
    }
}

.m-dialog {
    border-radius: rem(10px);
    // .bonus {
    //     width: rem(610px);
    //     // min-height: rem(700px);
    //     text-align: center;

    //     .bouns-title {
    //         text-align: center;
    //         margin: rem(51px) 0 rem(34px);
    //         font-size: rem(34px);
    //         color: #333;
    //     }
    //     .bouns-div {
    //         text-align: center;
    //         color: #999;
    //         font-size: rem(24px);
    //         padding: 0 rem(60px);
    //         margin-bottom: rem(37px);
    //     }
    //     img {
    //         width: rem(172px);
    //         height: rem(175px);
    //         margin: rem(98px) 0 rem(62px);
    //     }
    //     .bouns-no-activity {
    //         color: #c4c4c4;
    //         font-size: rem(24px);
    //         margin-bottom: rem(10px);
    //     }
    //     ul {
    //         padding: 0 rem(40px);
    //         height: rem(380px);
    //         overflow-y: auto;
    //         li {
    //             width: 100%;
    //             height: rem(160px);
    //             background-size: contain;
    //             overflow: hidden;
    //             margin-bottom: rem(20px);
    //             text-align: left;
    //             &.statusA {
    //                 background-image: url("../../images/dlq.png");
    //                 color: #c0843c;
    //             }
    //             &.statusB {
    //                 background-image: url("../../images/ylq.png");
    //                 color: #bbcde8;
    //             }
    //             &.statusC {
    //                 background-image: url("../../images/ygq.png");
    //                 color: #dadada;
    //             }
    //             .money {
    //                 padding-left: rem(30px);
    //                 span {
    //                     font-size: rem(70px);
    //                     vertical-align: middle;
    //                     &:last-child {
    //                         font-size: rem(28px);
    //                         margin-left: rem(26px);
    //                         vertical-align: middle;
    //                     }
    //                 }
    //             }

    //             .time {
    //                 line-height: rem(62px);
    //                 padding: 0 rem(30px);
    //                 display: flex;
    //                 justify-content: space-between;
    //                 span {
    //                     font-size: rem(24px);
    //                     &:last-child {
    //                         text-align: right;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     .body {
    //         padding-bottom: rem(20px);
    //     }
    //     .dialog-footer {
    //         border-top: 1px solid #efefef;
    //         button {
    //             display: inline-block;
    //             line-height: rem(100px);
    //             text-align: center;
    //             background: #fff;
    //             color: #477fd3;
    //             font-size: rem(34px);
    //             width: 50%;
    //             border-radius: 0 0 0 rem(10px);
    //             &:last-child {
    //                 background: #477fd3;
    //                 color: #ffffff;
    //                 border-radius: 0 0 rem(10px) 0;
    //             }
    //         }
    //     }
    //     .close-btn {
    //         width: 100%;
    //         line-height: rem(100px);
    //         text-align: center;
    //         bottom: rem(34px);
    //         color: #477fd3;
    //         font-size: rem(34px);
    //     }
    // }
}
</style>
