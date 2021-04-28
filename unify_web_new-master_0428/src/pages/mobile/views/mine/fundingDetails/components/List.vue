<template>
    <div class='list'>
        <van-pull-refresh
            ref='vanList'
            v-model='isRefreshLoading'
            :loading-text="$t('fundingDetails.loadingText')"
            :loosing-text="$t('fundingDetails.loosingText')"
            :pulling-text="$t('fundingDetails.pullingText')"
            :success-text="$t('fundingDetails.successText')"
            @refresh='onRefresh'
        >
            <van-list v-model='isGettingMoreLoading' :finished='isFinished' @load='onLoad'>
                <template v-if='data.length > 0'>
                    <div v-for='(item,i) in data' :key='i' class='item'>
                        <div class='time'>
                            {{ item.time | formatTimestamp }}
                        </div>
                        <div class='content'>
                            <div class='left'>
                                <div class='type'>
                                    {{ item.type | filterType }}
                                </div>
                                <div class='remark'>
                                    <template
                                        v-if="['4','5','6','7','8','9','11','17','19'].includes(item.type)"
                                    >
                                        {{ (item.symbolCode ? item.symbolCode : item.symbolName) + `，${$t('fundingDetails.orderId')} `+ item.orderId }}
                                    </template>
                                    <template v-else>
                                        {{ item.remark }}
                                    </template>
                                </div>
                            </div>
                            <div class='right'>
                                <div
                                    class='change'
                                    :class="{ 'riseColor': item.balance > 0, 'fallColor': item.balance < 0 }"
                                >
                                    {{ item.balance > 0 ? '+' : '' }}{{ item.balance | priceDigit }}
                                </div>
                                <div
                                    class='balance'
                                >
                                    {{ $t('fundingDetails.balance') }} {{ item.amountDst }} {{ item.accountCurrency }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if='data.length > 0 && isGettingMoreLoading == false'
                        slot='finished'
                        class='finished'
                    >
                        {{ $t('fundingDetails.noMore') }}
                    </div>
                </template>

                <ListEmpty
                    v-if='data.length <= 0 && isGettingMoreLoading === false'
                    icon='icon_icon_no'
                    :txt="$t('fundingDetails.noDetails')"
                />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>

import { ACCOUNTCAPITALTYPE } from '../constant.js'
import dayjs from 'dayjs'
import { PullRefresh, List } from 'vant'

import ListEmpty from '@m/components/ListEmpty'

export default {
    name: 'List',
    components: {
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        ListEmpty
    },
    filters: {
        filterType (type) {
            return ACCOUNTCAPITALTYPE[type]
        },
        formatTimestamp (str) {
            if (str) {
                return dayjs(new Date(parseInt(str.toString() + '000'))).format('YYYY-MM-DD HH:mm:ss')
            } else {
                return ''
            }
        },
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        isFinished: {
            type: Boolean,
            default: false
        },

    },
    data () {
        return {
            isRefreshLoading: false,
            isGettingMoreLoading: false,
            isRefreshing: false // 防止快速刷新且同时请求数据
        }
    },
    methods: {
        onRefresh () {
            if (this.isRefreshing) {
                return
            }
            const _this = this
            this.isRefreshing = true
            this.$emit('refresh', () => {
                _this.isRefreshLoading = false
                this.isRefreshing = false
            })
        },
        onLoad () {
            if (this.isRefreshLoading) {
                return
            }
            const _this = this
            this.$emit('load', () => {
                _this.isGettingMoreLoading = false
            }, () => {
                _this.$emit('update:isFinished', true)
            })
        },
        scrollTop () {
            this.$refs.vanList.$el.scrollTop = 0
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.list {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    height: 100%;
    box-sizing: border-box;
    ::v-deep {
        .van-pull-refresh {
            height: 100%;
            overflow: auto;
            overflow-x: hidden;
        }
    }
    .finished {
        padding: rem(30px) 0;
        text-align: center;
        font-size: rem(24px);
        color: #999;
    }
    .item {
        height: rem(170px);
        border-bottom: rem(1px) solid #efefef;
        box-sizing: border-box;
        padding: rem(17px) rem(30px) rem(25px);
        .time {
            font-size: rem(24px);
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: rem(24px);
        }
        .content {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin-top: rem(26px);
            .left {
                overflow: hidden;
                .type {
                    font-size: rem(30px);
                    font-weight: 500;
                    color: rgba(51, 51, 51, 1);
                    line-height: rem(32px);
                }
                .remark {
                    font-size: rem(24px);
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                    line-height: rem(26px);
                    margin-top: rem(22px);
                    box-sizing: border-box;
                    padding-right: rem(20px);
                    @include ellipsis();
                }
            }

            .right {
                text-align: right;
                white-space: nowrap;
                .change {
                    font-size: rem(34px);
                    font-weight: 500;
                    line-height: rem(36px);
                }
                .balance {
                    margin-top: rem(26px);
                    font-size: rem(24px);
                    font-weight: 400;
                    color: rgba(102, 102, 102, 1);
                    line-height: rem(26px);
                }
            }
        }
    }
}
</style>
