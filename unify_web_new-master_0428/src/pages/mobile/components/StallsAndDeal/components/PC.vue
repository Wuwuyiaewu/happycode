<template>
    <div class='pc-wrap'>
        <div v-if='status.stalls' class='stalls-wrap'>
            <div class='title'>
                买卖五档
            </div>
            <!-- 卖五档 -->
            <div class='sell-wrap'>
                <template v-if='sellList.length'>
                    <div v-for='(item, i) in sellList' :key='i' class='item quantity'>
                        <span class='label'>
                            卖{{ 5-i }}
                        </span>
                        <span class='price' :style='{ color: style.fallColor }'>
                            {{ item[1] }}
                        </span>
                        <span class='quantity'>
                            {{ item[3].toFixed([0,1,2,9].includes(marketId) ? 0 : 2) }}
                        </span>
                        <span class='histogram' :style='{ width: getWidth(item[2], "sell"), background: style.fallColor }'></span>
                    </div>
                </template>
                <template v-else>
                    <div v-for='item in 5' :key='item' class='item'>
                        <span class='label'>
                            - -
                        </span>
                        <span class='price'>
                            - -
                        </span>
                        <span class='quantity'>
                            - -
                        </span>
                    </div>
                </template>
            </div>
            <!-- 成交量比 -->
            <div class='scale-wrap'>
                <div v-if='volumeRatioForSell>=0' class='scale-content'>
                    <span
                        class='left'
                        :style='{
                            flex: "0 0 " + volumeRatioForSell + "%",
                            background: style.fallColor
                        }'
                    >
                        {{ volumeRatioForSell.toFixed(2) }}%
                    </span>
                    <span
                        class='right'
                        :style='{
                            background: style.riseColor
                        }'
                    >
                        {{ (100-volumeRatioForSell).toFixed(2) }}%
                    </span>
                </div>
                <div v-else class='scale-content' style='opacity: 0.5'>
                    <span
                        class='left'
                        :style='{
                            flex: "0 0 50%",
                            background: style.fallColor
                        }'
                    >
                        - -%
                    </span>
                    <span
                        class='right'
                        :style='{
                            background: style.riseColor
                        }'
                    >
                        - -%
                    </span>
                </div>
            </div>
            <!-- 买五档 -->
            <div class='buy-wrap'>
                <template v-if='buyList.length'>
                    <div v-for='(item, i) in buyList' :key='i' class='item quantity'>
                        <span class='label'>
                            买{{ i + 1 }}
                        </span>
                        <span class='price' :style='{ color: style.riseColor }'>
                            {{ item[0] }}
                        </span>
                        <span class='quantity'>
                            {{ item[2].toFixed([0,1,2,9].includes(marketId) ? 0 : 2) }}
                        </span>
                        <span class='histogram' :style='{ width: getWidth(item[3], "buy"), background: style.riseColor }'></span>
                    </div>
                </template>
                <template v-else>
                    <div v-for='item in 5' :key='item' class='item'>
                        <span class='label'>
                            - -
                        </span>
                        <span class='price'>
                            - -
                        </span>
                        <span class='quantity'>
                            - -
                        </span>
                    </div>
                </template>
            </div>
        </div>

        <!-- 成交记录 -->
        <div v-if='status.deal' class='deal-wrap' :style="!status.stalls? 'margin-top: 0': ''">
            <div class='title'>
                成交数据
            </div>
            <div class='list-wrap'>
                <div class='col time-col'>
                    <span class='label'>
                        时间
                    </span>
                    <div class='vals-wrap'>
                        <div ref='timeColVals' class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val'>
                                {{ item[1] | filterTime('HH:mm:ss') }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class='col price-col'>
                    <span class='label'>
                        成交价
                    </span>
                    <!-- 用于占宽 -->
                    <span v-if='dealData.length' class='val forWide'>
                        <span>{{ dealData[0][2] }}</span>
                        <i class='icon_paixuxiaojiantou_xiangshang'></i>
                    </span>
                    <!-- 用于占宽 -->
                    <div class='vals-wrap'>
                        <div class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val'>
                                <span :style='{ color: item.color }'>
                                    {{ item[2] }}
                                </span>
                                <i v-if='item[5] === 1' class='icon_paixuxiaojiantou_xiangshang' :style='{ color:style.riseColor }'></i>
                                <i v-if='item[5] === 2' class='icon_paixuxiaojiantou_xiangxia' :style='{ color:style.fallColor }'></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div class='col volume-col'>
                    <span class='label'>
                        数量(手)
                    </span>
                    <!-- 用于占宽 -->
                    <span v-if='dealData.length' class='val forWide'>
                        {{ dealData[0][3] }}
                    </span>
                    <!-- 用于占宽 -->
                    <div class='vals-wrap'>
                        <div class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val'>
                                {{ item[3] }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class='col direction-col'>
                    <span class='label'>
                        方向
                    </span>
                    <div class='vals-wrap'>
                        <div class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val' :style='{ color: item.color }'>
                                {{ item[4] === 1 ? '买入' : '卖出' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
    filters: {
        filterTime (val, format) {
            return dayjs(val).format(format)
        }
    },
    props: {
        status: {
            type: Object,
            default: () => ({})
        },
        sellList: {
            type: Array,
            default: () => []
        },
        buyList: {
            type: Object,
            default: () => []
        },
        volumeRatioForSell: {
            type: Number,
            default: 0
        },
        sums: {
            type: Object,
            default: () => ({})
        },
        dealData: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        ...mapGetters(['style']),
    },
    mounted () {
        // this.getDeal()
    },
    methods: {
        getWidth (quantity, type) {
            const result = quantity * 100 / this.sums[type]
            return result + '%'
        },
        // getDeal () {
        //     const h = this.$refs['timeColVals'].offsetHeight
        //     console.log(h)
        //     return Math.floor(h / 20)
        // }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.pc-wrap{
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #dddee3;
}
.stalls-wrap, .deal-wrap{
    background: #fff;
    .title{
        height: rem(50px);
        line-height: rem(50px);
        font-size: 12px;
        border-bottom: 1px solid #ecedf2;
        color: #616567;
        text-indent: 10px;
        margin-bottom: 5px;
    }
}
.stalls-wrap{
    display: flex;
    flex-direction: column;
    // width: 300px;
    height: 100%;
    font-size: 12px;
    .sell-wrap, .buy-wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        color: $muted;
        .item{
            flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            white-space: nowrap;
            box-sizing: border-box;
            padding: 0 rem(10px);
            .label, .price, .quantity{
                position: relative;
                z-index: 1;
            }
            .label{
                width: rem(50px);
            }
            .price{
                flex: 1;
                text-align: left;
                padding-right: rem(10px);;
            }
            .quantity{
                flex: 1;
                text-align: right;
            }
        }
    }

    .scale-wrap{
        .scale-content{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            box-sizing: border-box;
            align-items: center;
            height: 16px;
            line-height: 16px;
            margin: 10px 0;
            font-size: 12px;
            color: #fff;
        }
        .left{
            display: block;
            flex: 0 0 50%;
            height: 100%;
            transition: flex 0.28s ease-in-out;
            text-align: left;
            padding-left: 10px;
        }
        .right{
            display: block;
            flex: 1;
            height: 100%;
            text-align: right;
            padding-right: 10px;
        }
    }

    .quantity {
        position: relative;
        z-index: 0;
        .histogram {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 100%;
            transition: width 0.28s ease-in-out;
            opacity: 0.2;
        }
    }
}

.deal-wrap{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 12px;
    line-height: rem(24px);
    margin-top: 5px;
    .list-wrap{
        flex: rem(300px); // 仅用于不撑开外层
        overflow: hidden;
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 0 rem(10px);
        flex-wrap: nowrap;
        .col{
            position: relative;
            display: flex;
            flex-direction: column;
            text-align: left;
            white-space: nowrap;
            margin-right: 5px;
            overflow: hidden;
            .label{
                position: relative;
                padding: 5px 0;
                background: #fff;
                z-index: 1;
            }
            .vals-wrap{
                position: relative;
                flex: 1;
                .vals{
                    position: absolute;
                    z-index: 0;
                    bottom: 0;
                    min-height: 100%;
                    .val{
                        display: block;
                        margin: 5px 0;
                    }
                }
            }
            .forWide{
                height: 0;
                overflow: hidden;
                color: #fff;
                opacity:0;
                margin: 0 0 0 2px;
            }
        }
        .time-col{
            min-width: 50px;
        }
        .price-col{
            min-width: 55px;
        }
        .volume-col{
            align-items: flex-end;
            min-width: 44px;
            text-align: right;
            .label{
                width: 100%;
            }
            .vals-wrap{
                width: 100%;
            }
            .vals{
                width: 100%;
            }

        }
    }
}
</style>
