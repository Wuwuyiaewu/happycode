<template>
    <div class='orderPage' :class='{ pc:isPC }'>
        <Top />
        <div class='main'>
            <van-loading v-if='loading' class='m-loading' size='30px'>
                {{ $t('compLang.loading') }}
            </van-loading>
            <div v-else class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-1' @click='toDetail(baseInfo.code_id)'>
                        <div class='left'>
                            <div class='name'>
                                {{ baseInfo.simplified }}
                            </div>
                            <div v-if="language!=='en-US'" class='code'>
                                {{ baseInfo.short_name }}
                            </div>
                        </div>
                        <!-- <div class="right">
                            <span class="active">
                                <span
                                    :class="baseInfo.openDirection==='BUY'?'riseColor':'fallColor'"
                                >{{ baseInfo.openDirection =='BUY'?$t('trade.buy'):$t('trade.sell')}}</span>
                                {{ baseInfo.tradeVolume }}{{$t('trade.volumeUnit')}}
                            </span>
                        </div>-->
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub'>
                                <template v-if="language==='en-US'">
                                    <div>{{ $t('trade.netProfit') }}</div>
                                    <div>{{ symbolCode }}</div>
                                </template>
                                <template v-else>
                                    {{ $t('trade.netProfit') }}({{ symbolCode }})
                                </template>
                            </div>
                            <div
                                class='name'
                                :class="{ 'riseColor':baseInfo.profit+baseInfo.swap+baseInfo.commission>0,
                                          'fallColor':baseInfo.profit+baseInfo.swap+baseInfo.commission<0 }"
                            >
                                {{ baseInfo.profit+baseInfo.swap+baseInfo.commission | moneyAccuracy }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                <template v-if="language==='en-US'">
                                    <div>{{ $t('trade.profit') }}</div>
                                    <div>{{ symbolCode }}</div>
                                </template>
                                <template v-else>
                                    {{ $t('trade.profit') }}({{ symbolCode }})
                                </template>
                            </div>
                            <div
                                class='name'
                                :class="{ 'riseColor':baseInfo.profit>0,
                                          'fallColor':baseInfo.profit<0 }"
                            >
                                {{ baseInfo.profit | moneyAccuracy }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                <template v-if="language==='en-US'">
                                    <div>{{ $t('trade.swap_2') }}</div>
                                    <div>{{ symbolCode }}</div>
                                </template>
                                <template v-else>
                                    {{ $t('trade.swap_2') }}({{ symbolCode }})
                                </template>
                            </div>
                            <div class='name'>
                                {{ baseInfo.swap | moneyAccuracy }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                <template v-if="language==='en-US'">
                                    <div>{{ $t('trade.fee') }}</div>
                                    <div>{{ symbolCode }}</div>
                                </template>
                                <template v-else>
                                    {{ $t('trade.fee') }}({{ symbolCode }})
                                </template>
                            </div>
                            <div class='name'>
                                {{ baseInfo.commission | moneyAccuracy }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout layout-1'>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div
                                class='sub'
                                :class="baseInfo.openDirection==='BUY'?'riseColor':'fallColor'"
                            >
                                {{ baseInfo.openDirection =='BUY'?$t('trade.buy'):$t('trade.sell') }}
                            </div>
                            <div class='name'>
                                {{ baseInfo.tradeVolume }}{{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.positionPrice') }}
                            </div>
                            <div class='name'>
                                {{ baseInfo.openPrice }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.closedPrice') }}
                            </div>
                            <div class='name'>
                                {{ baseInfo.tradePrice }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('closed.closedType') }}
                            </div>
                            <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            {{ $t('dealReason.'+baseInfo.dealReason) }}
                        </div>
                    </div>
                    <!-- <div class="item van-hairline--bottom">
                        <div class="left">
                            <div class="title">{{$t('closed.closedNum')}}</div>
                        </div>
                        <div class="right">{{ baseInfo.tradeVolume }}</div>
                    </div>-->
                    <!-- <div class="item van-hairline&#45;&#45;bottom">
                        <div class="left">
                            <div class="title">订单初始保证金({{symbolCode}})</div>
                            <i data-type="1" class="van-icon van-icon-info-o"/>
                        </div>
                        <div class="right">{{ baseInfo.openmargin }}</div>
                    </div>-->
                    <!--  <div class="item van-hairline&#45;&#45;bottom">
                        <div class="left">
                            <div class="title">订单开仓价值($)</div>
                            <i data-type="1" class="van-icon van-icon-info-o"/>
                        </div>
                        <div class="right">50000</div>
                    </div>
                    <div class="item van-hairline&#45;&#45;bottom">
                        <div class="left">
                            <div class="title">订单平仓价值($)</div>
                            <i data-type="1" class="van-icon van-icon-info-o"/>
                        </div>
                        <div class="right">45000</div>
                    </div>-->
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('closed.openPositionTime') }}
                            </div>
                            <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            {{ baseInfo.openTime | zoneTime }}
                        </div>
                    </div>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('closed.closedTime') }}
                            </div>
                            <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            {{ baseInfo.tradeTime | zoneTime }}
                        </div>
                    </div>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('closed.orderId') }}
                            </div>
                            <!--                            <i data-type="1" class="van-icon van-icon-info-o"/>-->
                        </div>
                        <div class='right'>
                            ID : {{ $route.params.id }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PopupBottomTip from '@m/components/PopupBottomTip'
import { tradeInfo } from '@/api/base'
import Top from '@m/layout/top'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'BuyOrderInfo',
    components: {
        Top,
        PopupBottomTip
    },
    mixins: [pcMixin],
    computed: {
        ...mapGetters(['symbolCode']),
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
    },
    filters: {
        zoneTime (str) {
            if (str) {
                return dayjs(new Date(str)).format('YYYY/MM/DD HH:mm:ss')
            } else {
                return '--'
            }
        }
    },
    data () {
        return {
            loading: false,
            baseInfo: {}
        }
    },
    created () {
        this.getBaseData()
    },
    methods: {
        getBaseData () {
            this.loading = true
            tradeInfo({
                dealId: this.$route.params.id
            })
                .then(res => {
                    if (res.code !== 1) {
                        this.loading = false
                        this.$toast({
                            duration: 1000,
                            message: this.$te('retMsg.' + res.msgCode) ? this.$t('retMsg.' + res.msgCode) : res.msg
                        })
                        return
                    }
                    if (res.data.length > 0) {
                        const _baseInfo = this.$store.state.ix_quote.product_map[res.data[0].symbolName] || {}
                        this.baseInfo = Object.assign(res.data[0], {
                            simplified: _baseInfo.simplified,
                            short_name: _baseInfo.short_name,
                            display_name: _baseInfo.groupSymbol.display_name,
                            code_id: _baseInfo.code_id,
                            openPrice: parseFloat(res.data[0].openPrice).toFixed(_baseInfo.groupSymbol.digits),
                            tradePrice: parseFloat(res.data[0].tradePrice).toFixed(_baseInfo.groupSymbol.digits),
                            // tradeVolume: res.data[0].tradeVolume / _baseInfo.groupSymbol.contract_size
                        })
                    } else {
                        this.$dialog.alert({
                            message: this.$t('searchFail')
                        }).then(() => {
                            this.$router.go(-1)
                        })
                    }
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.log(error)
                })
        },
        toDetail (code) {
            this.$router.push({ name: 'ProductDetail', params: { id: code } })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.orderPage {
    position: relative;
    padding-top: rem(90px);
    font-size: rem(28px);
    &.pc{
        padding-top:0;
    }
    .main {
        height: 100%;
        padding-bottom: rem(90px);
        overflow: auto;
    }
}
.m-loading {
    text-align: center;
    padding-top: rem(60px);
}
.m-orderInfo {
    padding: rem(20px) rem(20px) rem(7px) rem(20px);
    .layout {
        border-radius: 10px;
        background-color: #fff;
        margin-bottom: rem(20px);
        .item {
            padding: rem(32px) rem(30px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.item-1 {
                padding-bottom: 0;
            }
        }
    }
    ::v-deep {
        .van-button {
            border-radius: rem(6px);
            &__text {
                color: #477fd3;
            }
            &--mini {
                font-size: rem(24px);
                width: rem(124px);
                height: rem(48px);
                line-height: rem(48px);
            }
        }
    }
    .layout-1 {
        .item-2 {
            .col {
                .name {
                    margin-bottom: rem(4px);
                }
                &:last-child {
                    text-align: right;
                }
            }
        }
        .name {
            color: #333333;
            font-size: rem(28px);
        }
        .code {
            color: #999999;
            font-size: rem(20px);
        }
        .sub {
            color: #999999;
            font-size: rem(24px);
        }
        .active {
            color: #333333;
            font-size: rem(28px);
        }
    }
    .layout-3 {
        font-size: rem(28px);
        .left {
            color: #999999;
            .title {
                margin-right: rem(20px);
                display: inline-block;
            }
            i {
                position: relative;
                top: rem(6px);
                font-size: rem(30px);
            }
        }
        .right {
            text-align: right;
        }
    }
}
</style>
