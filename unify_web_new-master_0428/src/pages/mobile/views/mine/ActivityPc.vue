<template>
    <div>
        <!-- <div class="item-8">
            <div class="item van-hairline--top">
                <div class="item-div" @click="showData('1')">
                    <span>{{$t('activity.balanceMax')}}</span>
                    <span>{{accInfo.maxAmount}}</span>
                    <van-icon class="tip" name="question-o" />
                </div>
                <div class="item-div" @click="showData('2')">
                    <span>{{$t('activity.pendingBonus')}}</span>
                    <span>{{accInfo.pendingAmount}}</span>
                    <van-icon class="tip" name="question-o" />
                </div>
            </div>
        </div>-->
        <!-- 活动金额弹框 -->
        <!-- <van-popup v-model="showMyBonus" :class="{active:!showMyBonus}" class="m-dialog" @click-overlay="visibleChange"> -->
        <div class='bonus'>
            <div class='bouns-title'>
                {{ $t('activity.pendingBonus') }}
            </div>
            <div class='body'>
                <div v-if="pendingBounsList.length > '0'" class='bouns-div'>
                    {{ $t('activity.pendingBonusTip') }}
                </div>
                <ul v-if='pendingBounsList.length > 0'>
                    <li v-for='item in pendingBounsList' :key='item.id'>
                        <template v-if="item.attr1=='unpay' && ((item.attr2)-(new Date().valueOf()))>0">
                            <div class='money'>
                                <span>{{ (item.giftAmount).toFixed(2) }}</span>
                                <span>{{ item.giftAmountUnit }}</span>
                            </div>
                            <div class='time'>
                                <span v-if="language=== 'zh-CN'">
                                    {{ $t('activity.bounsGet', { time: formatTimesZone(item.createDate) }) }}
                                </span>
                                <span v-else>
                                    {{ $t('activity.bounsGet', { time: getEnTime(item.createDate) }) }}
                                </span>
                                <span>{{ $t('activity.bounsExpire', { time: expireDate(item.attr2) }) }}</span>
                            </div>
                        </template>
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
                    <!-- <van-button plain @click='hideBonus'>
                        {{ $t('activity.close') }}
                    </van-button> -->
                    <van-button color='#477FD3' @click="$router.push({ name: 'DepositFunds' })">
                        {{ $t('activity.receive') }}
                    </van-button>
                </template>
                <!-- <div v-else class='close-btn' @click='hideBonus'>
                    {{ $t('activity.close') }}
                </div> -->
            </div>
        </div>
        <!-- </van-popup> -->
    </div>
</template>

<script>
import { getPendingBounsList } from '@/api/mine'
import dayjs from 'dayjs'
export default {
    name: 'MineActivityPc',
    model: {
        prop: 'showMyBonus',
        event: 'show'
    },
    props: {
        showMyBonus: {
            type: Boolean,
            defaults: false
        }
    },
    data () {
        return {
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
        this.getPendingBounsList()
    },
    deactivated () {
        this.$store.dispatch('getAccPriceInfo') // 获取消息数据
    },
    methods: {
        visibleChange (val) {
            this.$emit('show', false)
        },
        hideBonus (flag) {
            this.$emit('show', false)
        },
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
        showData (type) {
            if (type == '2') {
                this.hideBonus(true)
                // this.showBonus = true;
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
                this.pendingBounsList = (res.data || []).map(item => (Object.assign(item, { attr2: new Date(item.attr2).valueOf() })))
            })
        },
        formatTimesZone (val) {
            if (val) {
                return dayjs(val).format('MM-DD HH:mm')
            } else {
                return '--'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
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

.bonus {
    width: 100%;
    position: absolute;
    width: 300px;
    z-index: 10000;
    background: #ffffff;
    box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    right: 0;
    bottom: 60px;
    text-align: center;

    .bouns-title {
        text-align: center;
        margin: rem(51px) 0 rem(34px);
        font-size: rem(34px);
        color: #333;
    }
    .bouns-div {
        text-align: center;
        color: #999;
        font-size: rem(24px);
        padding: 0 rem(60px);
        margin-bottom: rem(37px);
    }
    img {
        width: rem(172px);
        height: rem(175px);
        margin: rem(98px) 0 rem(62px);
    }
    .bouns-no-activity {
        color: #c4c4c4;
        font-size: rem(24px);
        margin-bottom: rem(10px);
    }
    ul {
        padding: 0 rem(40px);
        height: rem(380px);
        overflow-y: auto;
        li {
            width: 100%;
            height: rem(160px);
            background: url("../../images/bg.png") no-repeat center center;
            background-size: contain;
            margin-bottom: rem(20px);
            text-align: left;
            .money {
                padding-left: rem(30px);
                span {
                    font-size: rem(70px);
                    color: #e4535d;
                    vertical-align: middle;
                    &:last-child {
                        font-size: rem(28px);
                        margin-left: rem(26px);
                        vertical-align: middle;
                    }
                }
            }

            .time {
                line-height: rem(66px);
                padding: 0 rem(30px);
                display: flex;
                justify-content: space-between;
                span {
                    color: #e4535d;
                    font-size: rem(24px);
                    &:last-child {
                        text-align: right;
                    }
                }
            }
        }
    }
    .body {
        padding-bottom: rem(20px);
    }
    .dialog-footer {
        border-top: 1px solid #efefef;
        button {
            display: inline-block;
            line-height: rem(100px);
            text-align: center;
            background: #fff;
            color: #477fd3;
            font-size: rem(34px);
            width: 50%;
            border-radius: 0 0 0 rem(10px);
            &:last-child {
                background: #477fd3;
                color: #ffffff;
                border-radius: 0 0 rem(10px) 0;
            }
        }
    }
    .close-btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        bottom: 20px;
        background-color: #4880D4;
        color: #fff;
        font-size: rem(34px);
        font-size:14px;
        cursor: pointer;
    }
}

.active {
    display: none;
}

// @keyframes bounce {
//     0% {
//         transform: scale(1.1);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
//     20% {
//         transform: scale(0.9);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
//     40% {
//         transform: scale(1.06);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
//     60% {
//         transform: scale(0.94);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
//     80% {
//         transform: scale(1.02);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
//     100% {
//         transform: scale(1);
//         -webkit-transform-style: preserve-3d;
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -ms-backface-visibility: hidden;
//     }
// }
</style>
