<template>
    <div>
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
                            <span v-if="language=== 'zh-CN'">
                                {{ $t('activity.bounsGet', { time: formatTimesZone(item.createDate) }) }}
                            </span>
                            <span v-else>
                                {{ $t('activity.bounsGet', { time: getEnTime(item.createDate) }) }}
                            </span>
                            <span>
                                <template v-if="item.localStatus== 'A'">
                                    {{ $t('activity.bounsExpire', { time: expireDate(item.attr2) }) }}
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
                <template v-if='isPC'>
                    <template v-if='pendingBounsList.length>0' class='bouns-btn'>
                        <van-button
                            color='#477FD3'
                            :disabled='!haveCanGetGift'
                            @click='toDepositFunds'
                        >
                            {{ $t('activity.receive') }}
                        </van-button>
                    </template>
                </template>
                <template v-else>
                    <template v-if='pendingBounsList.length>0' class='bouns-btn'>
                        <van-button plain @click='closeBonus'>
                            {{ $t('activity.close') }}
                        </van-button>
                        <van-button
                            color='#477FD3'
                            :disabled='!haveCanGetGift'
                            @click='toDepositFunds'
                        >
                            {{ $t('activity.receive') }}
                        </van-button>
                    </template>
                    <div v-else class='close-btn' @click='closeBonus'>
                        {{ $t('activity.close') }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    name: 'ActivityBonus',
    props: {
        pendingBounsList: {
            type: Array,
            default: () => ([])
        },
        showBonus: {
            type: Boolean,
            default: false
        },
        haveCanGetGift: {
            type: Boolean,
            default: true
        },
        isPC: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
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
        closeBonus () {
            this.$emit('hidden', false)
        },
        toDepositFunds () {
            if (this.accountInfo.accountNo) {
                this.$router.push({ name: 'DepositFunds' })
            } else {
                this.$router.push({ name: 'OpenAccount', params: { id: 'openreal' }, query: { showtip: true } })
            }
        },
        formatTimesZone (val) {
            if (val) {
                return dayjs(val).format('MM-DD HH:mm')
            } else {
                return '--'
            }
        },
        getEnTime (val) {
            if (val) {
                return `at ${dayjs(val).format('HH:mm')} on ${dayjs(val).format('MMM DD')}`
            } else {
                return '--'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

    .bonus {
         width: rem(610px);
        // min-height: rem(700px);
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
            -webkit-overflow-scrolling: touch;
            @include scroll();
            li {
                width: 100%;
                height: rem(160px);
                background-size: contain;
                overflow: hidden;
                margin-bottom: rem(20px);
                text-align: left;
                &.statusA {
                    background-image: url("../../images/dlq.png");
                    color: #c0843c;
                }
                &.statusB {
                    background-image: url("../../images/ylq.png");
                    color: #bbcde8;
                }
                &.statusC {
                    background-image: url("../../images/ygq.png");
                    color: #dadada;
                }
                .money {
                    padding-left: rem(30px);
                    span {
                        font-size: rem(70px);
                        vertical-align: middle;
                        &:last-child {
                            font-size: rem(28px);
                            margin-left: rem(26px);
                            vertical-align: middle;
                        }
                    }
                }

                .time {
                    line-height: rem(62px);
                    padding: 0 rem(30px);
                    display: flex;
                    justify-content: space-between;
                        white-space: nowrap;
                    span {
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
            line-height: rem(100px);
            text-align: center;
            bottom: rem(34px);
            color: #477fd3;
            font-size: rem(34px);
        }
    }
</style>
