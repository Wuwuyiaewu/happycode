<template>
    <div class='m-ccgd'>
        <Top>
            <div slot='right'></div>
        </Top>
        <div class='m-content'>
            <div class='groupBtn'>
                <van-button
                    :class="{ 'active': activeType===1,'mainColorBg': activeType ===1 }"
                    size='small'
                    @click='getTradeInfo(1)'
                >
                    {{ $t('trade.filterToday') }}
                </van-button>
                <van-button
                    :class="{ 'active': activeType===2,'mainColorBg': activeType ===2 }"
                    size='small'
                    @click='getTradeInfo(2)'
                >
                    {{ $t('trade.filterweek') }}
                </van-button>
                <van-button
                    :class="{ 'active': activeType===3,'mainColorBg': activeType ===3 }"
                    size='small'
                    @click='getTradeInfo(3)'
                >
                    {{ $t('trade.filterMonth') }}
                </van-button>
            </div>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <template v-else>
                <template v-if='dataList.length>0'>
                    <router-link
                        v-for='item in dataList'
                        :key='item.id'
                        class='link'
                        :to="{ name:'HistoryOrderDetail',params:{ id:item.dealId } }"
                    >
                        <div class='item'>
                            <div class='cell'>
                                <div class='th'>
                                    <span class='name'>
                                        {{ item.symbol }}
                                    </span>
                                    <span
                                        class='lot'
                                    >
                                        {{ item.orderType<=3?$t('historyOrder.open'):$t('historyOrder.close') }}{{ item.openDirection =='BUY'?$t('trade.buy'):$t('trade.sell') }}{{ item.tradeVolume }}{{ $t('trade.volumeUnit') }}
                                    </span>
                                    <p v-if="language!=='en-US'">
                                        {{ item.symbol }}
                                    </p>
                                </div>
                                <div class='right'>
                                    <div
                                        class='money'
                                        :class="{ 'riseColor':item.profit>0,
                                                  'fallColor':item.profit<0 }"
                                    >
                                        {{ item.profit | moneyAccuracy }}
                                    </div>
                                    <div class='time'>
                                        {{ item.tradeTime | formatTimesZone }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </template>
                <ListEmpty v-else :txt="$t('trade.historyEmpty')" />
            </template>
        </div>
    </div>
</template>

<script>
import ListEmpty from '@m/components/ListEmpty'
import { tradeInfo } from '@/api/base'
import Top from '@m/layout/top'
import dayjs from 'dayjs'
export default {
    name: 'PositionListC',
    components: {
        ListEmpty,
        Top
    },
    filters: {
        formatTimesZone (val) {
            if (val) {
                return dayjs(new Date(val)).format('YYYY/MM/DD HH:mm')
            } else {
                return '--'
            }
        }
    },
    data () {
        return {
            dataList: [],
            loading: false,
            activeType: 0
        }
    },
    computed: {
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
    },
    mounted () {
        this.getTradeInfo(1)
    },
    methods: {
        getTradeData (params) {
            this.loading = true
            tradeInfo(params)
                .then(res => {
                    if (res.code !== 1) {
                        this.loading = false
                        this.$toast({ duration: 1000, message: res.msg })
                        return
                    }
                    this.dataList = res.data || []
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.log('超时')
                    // this.$dialog.alert({
                    //     title: '超时提示',
                    //     message: '由于网络不稳定,获取平仓列表失败！',
                    //     confirmButtonText: '我知道了'
                    // })
                })
        },
        getTradeInfo (type) {
            if (type) { this.activeType = type }
            let beginTime = null
            if (type === 1) {
                beginTime = dayjs().format('YYYY-MM-DD')
            } else if (type === 2) {
                beginTime = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
            } else if (type === 3) {
                beginTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
            }
            this.getTradeData({
                tradeType: 'history',
                gmt: dayjs().utcOffset() / 60,
                endTime: dayjs().format('YYYY-MM-DD'),
                beginTime
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.m-content {
    padding: 0 rem(20px);
    background-color: #f9f9f9;
    .groupBtn {
        margin-bottom: rem(30px);
        padding-top: rem(120px);
        ::v-deep {
            .van-button {
                margin-right: rem(10px);
                color: #999999;
                height: rem(48px);
                line-height: rem(46px);
                border-radius: rem(6px);
            }
            .active {
                color: #fff;
            }
        }
    }
    .link {
        display: inline-block;
        width: 100%;
    }
    .item {
        position: relative;
        background: #fff;
        border-radius: rem(10px);
        margin-bottom: rem(20px);
        overflow: hidden;
        padding: rem(40px) rem(30px) 0;
        .cell {
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: rem(30px);
            color: $muted;
            line-height: 1.45;
            font-size: rem(20px);
            .name {
                font-size: rem(34px);
                color: $text;
            }
            .lot {
                margin-left: 0.5em;
            }
            .right {
                text-align: right;
                .time {
                    font-size: rem(20px);
                    color: #999999;
                    margin-top: rem(10px);
                }
                .money {
                    font-size: rem(34px);
                    font-weight: 500;
                    &.up {
                        color: #59b668;
                    }
                    &.down {
                        color: #e3525c;
                    }
                }
            }
        }
    }
    .m-loading {
        text-align: center;
        padding-top: rem(60px);
    }
}
</style>
