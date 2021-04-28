<template>
    <div class='m-functionTest'>
        <h3 class='title'>
            功能测试
        </h3>
        <div class='m-global'>
            <van-collapse v-model='activeNames'>
                <van-collapse-item name='1' title='产品选择'>
                    <van-row class='row'>
                        <van-col span='24'>
                            选择产品:
                            <select v-model='global.code_id' class='m-select'>
                                <option
                                    v-for='item in product_list'
                                    :key='item.code_id'
                                    :value='item.code_id'
                                >
                                    {{ item.simplified }}
                                </option>
                            </select>
                        </van-col>
                        <!-- <van-col span="24">
                            <pre>
                                {{groupSymbol}}
                            </pre>
                        </van-col>-->
                    </van-row>
                </van-collapse-item>
                <van-collapse-item name='2' title='保证金'>
                    <van-row class='row'>
                        <van-col span='5'>
                            买卖方向:
                            <select v-model='calcOpenMargin.direction' class='m-select' style='width:100px;'>
                                <option :value='1'>
                                    买入
                                </option>
                                <option :value='2'>
                                    卖出
                                </option>
                            </select>
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='calcOpenMargin.volume' clearable label='手数' />
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='calcOpenMargin.usdcnyRate' clearable label='usdcny中间价' />
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='calcOpenMargin.usdhkdRate' clearable label='usdhkd中间价' />
                        </van-col>
                        <van-col span='2'>
                            <van-button type='info' @click='FnCalcOpenMargin'>
                                计算
                            </van-button>
                        </van-col>
                    </van-row>
                    <van-row class='bear'>
                        <van-col span='4'>
                            保证金:{{ result.calcOpenMargin.margin }}
                        </van-col>
                    </van-row>
                </van-collapse-item>
                <van-collapse-item name='3' title='保证金水平'>
                    <van-row class='row'>
                        <van-col span='5'>
                            <van-field v-model='marginLevel.csbzj' clearable label='保证金' />
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='marginLevel.jz' clearable label='净值' />
                        </van-col>
                        <van-col span='2'>
                            <van-button type='info' @click='FnMarginLevel'>
                                计算
                            </van-button>
                        </van-col>
                    </van-row>
                    <van-row class='bear'>
                        <van-col span='4'>
                            保证金水平:{{ result.marginLevel.value }}%
                        </van-col>
                    </van-row>
                </van-collapse-item>
                <van-collapse-item name='4' title='止盈止损'>
                    <van-row class='row'>
                        <van-col span='8'>
                            买卖方向:
                            <select v-model='stopProfitOrLoss.direction' class='m-select' style='width:100px;'>
                                <option :value='1'>
                                    买入
                                </option>
                                <option :value='2'>
                                    卖出
                                </option>
                            </select>
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='stopProfitOrLoss.buyPrice' clearable label='买入价格' />
                        </van-col>
                        <van-col span='5'>
                            <van-field v-model='stopProfitOrLoss.sellPrice' clearable label='卖出价格' />
                        </van-col>
                        <van-col span='2'>
                            <van-button type='info' @click='FnStopProfitOrLoss'>
                                计算
                            </van-button>
                        </van-col>
                    </van-row>
                    <van-row class='bear'>
                        <van-col span='4'>
                            止损范围最小值:{{ result.stopProfitOrLoss.minStop }}
                        </van-col>
                        <van-col span='4'>
                            止损范围最大值:{{ result.stopProfitOrLoss.maxStop }}
                        </van-col>
                        <van-col span='4'>
                            止盈范围最小值:{{ result.stopProfitOrLoss.minProfit }}
                        </van-col>
                        <van-col span='4'>
                            止盈范围最大值:{{ result.stopProfitOrLoss.maxProfit }}
                        </van-col>
                        <van-col span='4'>
                            止盈止损价格步长:{{ result.stopProfitOrLoss.profitStopStep }}
                        </van-col>
                        <br />
                        <van-col span='4'>
                            限价范围最小值:{{ result.stopProfitOrLoss.minLimit }}
                        </van-col>
                        <van-col span='4'>
                            限价范围最大值:{{ result.stopProfitOrLoss.maxLimit }}
                        </van-col>
                        <van-col span='4'>
                            停损范围最小值:{{ result.stopProfitOrLoss.minStopLimit }}
                        </van-col>
                        <van-col span='4'>
                            停损范围最大值:{{ result.stopProfitOrLoss.maxStopLimit }}
                        </van-col>
                        <van-col span='4'>
                            挂单价格步长:{{ result.stopProfitOrLoss.pendingOrderStep }}
                        </van-col>
                    </van-row>
                </van-collapse-item>
                <!-- <van-collapse-item title="盈亏" name="5">内容</van-collapse-item> -->
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { Cell, CellGroup, Button, Row, Col, Collapse, CollapseItem, Field } from 'vant'
import * as Utils from '@/store/ix_utils'
export default {
    name: 'FunctionTest',
    data () {
        return {
            activeNames: ['1', '2', '3', '4', '5'],
            global: {
                code_id: ''
            },
            calcOpenMargin: {
                direction: 1,
                volume: '',
                usdcnyRate: '',
                usdhkdRate: '',
            },
            stopProfitOrLoss: {
                direction: 1,
                buyPrice: '',
                sellPrice: '',
            },
            marginLevel: {
                csbzj: '',
                jz: ''
            },
            result: {
                stopProfitOrLoss: {
                    minStop: '',
                    maxStop: '',
                    minProfit: '',
                    maxProfit: '',
                    profitStopStep: '',
                    minLimit: '',
                    maxLimit: '',
                    minStopLimit: '',
                    maxStopLimit: '',
                    pendingOrderStep: '',
                },
                calcOpenMargin: {
                    margin: ''
                },
                marginLevel: {
                    value: ''
                }
            }
        }
    },
    computed: {
        ...mapState({
            product_list: state => state.ix_quote.product_list,
            product_map: state => state.ix_quote.product_map,
            groupGet: state => state.ix_user.groupGet,
        }),
        groupSymbol () {
            return this.global.code_id ? this.product_map[this.global.code_id] : {}
        },
        groupSymbolMarginLeveMap () {
            return this.$store.getters['ix_quote/groupSymbolMarginLeveMap'] || {}
        },
    },
    created () { },
    mounted () { },
    beforeDestroy () { },
    methods: {
        FnStopProfitOrLoss () {
            console.log(Utils)
            this.result.stopProfitOrLoss.minStop = Utils.minStop({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                price: this.stopProfitOrLoss.direction == 1 ? this.stopProfitOrLoss.buyPrice : this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.maxStop = Utils.maxStop({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                price: this.stopProfitOrLoss.direction == 1 ? this.stopProfitOrLoss.buyPrice : this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.minProfit = Utils.minProfit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                price: this.stopProfitOrLoss.direction == 1 ? this.stopProfitOrLoss.buyPrice : this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.maxProfit = Utils.maxProfit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                price: this.stopProfitOrLoss.direction == 1 ? this.stopProfitOrLoss.buyPrice : this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.profitStopStep = Utils.profitStopStep(this.groupSymbol.groupSymbol)

            this.result.stopProfitOrLoss.minLimit = Utils.minLimit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                buy_price: this.stopProfitOrLoss.buyPrice,
                sell_price: this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.maxLimit = Utils.maxLimit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                buy_price: this.stopProfitOrLoss.buyPrice,
                sell_price: this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.minStopLimit = Utils.minStopLimit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                buy_price: this.stopProfitOrLoss.buyPrice,
                sell_price: this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.maxStopLimit = Utils.maxStopLimit({
                groupSymbol: this.groupSymbol.groupSymbol,
                direction: this.stopProfitOrLoss.direction,
                buy_price: this.stopProfitOrLoss.buyPrice,
                sell_price: this.stopProfitOrLoss.sellPrice
            })
            this.result.stopProfitOrLoss.pendingOrderStep = Utils.pendingOrderStep(this.groupSymbol.groupSymbol)
        },
        FnCalcOpenMargin () {
            this.result.calcOpenMargin.margin = Utils.calcOpenMargin({
                product: this.groupSymbol,
                groupGet: this.groupGet,
                positionList: [],
                groupSymbolMarginLeveMap: this.groupSymbolMarginLeveMap,
                volume: this.calcOpenMargin.volume,
                direction: this.calcOpenMargin.direction,
                usdcnyRate: this.calcOpenMargin.usdcnyRate,
                usdhkdRate: this.calcOpenMargin.usdhkdRate
            })
        },
        FnMarginLevel () {
            this.result.marginLevel.value = Utils.marginLevel({
                assetAboutInfo: {
                    accountData: {
                        csbzj: this.marginLevel.csbzj,
                        jz: this.marginLevel.jz
                    }
                },
                openMargin: 0
            })
        }
    },
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Field.name]: Field,
    }
}
</script>

<style lang="scss" scoped>
.m-functionTest {
    position: fixed;
    user-select: text;
    padding: 15px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .title {
        margin-bottom: 10px;
        font-size: 24px;
    }
    ::v-deep {
        .van-cell__value {
            padding-left: 10px;
            border: solid 1px #ccc;
        }
    }
    .bear {
        border-top: solid 1px #ccc;
        color: #333;
        font-size: 20px;
    }
}
.m-select {
    border: solid 1px #ccc;
    width: 200px;
    height: 30px;
    line-height: 30px;
}
</style>
