<template>
    <van-tabs
        ref='tabs'
        v-model='tabActive'
        class='tabs'
        :color='style.mainColor'
        line-height='2'
        line-width='20'
        :style='{
            "min-width": tabMinWidth + "px"
        }'
        :title-active-color='style.mainColor'
        @change='onChangeTab'
    >
        <van-tab v-if='status.stalls' name='stalls' title='五档'>
            <div class='stalls-wrap'>
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
                    <template v-if='volumeRatioForSell>=0'>
                        <span
                            class='left'
                            :style='{
                                flex: "0 0 " + volumeRatioForSell + "%",
                                background: "linear-gradient(-60deg, transparent 0.06667rem, " + style.fallColor + " 0)"
                            }'
                        ></span>
                        <span
                            class='right'
                            :style='{
                                background: "linear-gradient(127deg, transparent 0.06667rem, " + style.riseColor + " 0)"
                            }'
                        ></span>
                    </template>
                    <template v-else>
                        <span
                            class='left'
                            :style='{
                                flex: "0 0 50%",
                                background: "linear-gradient(-60deg, transparent 0.06667rem, " + style.fallColor + " 0)"
                            }'
                        ></span>
                        <span
                            class='right'
                            :style='{
                                background: "linear-gradient(127deg, transparent 0.06667rem, " + style.riseColor + " 0)"
                            }'
                        ></span>
                    </template>
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
        </van-tab>
        <van-tab v-if='status.deal' name='deal' title='成交'>
            <!-- 成交记录 -->
            <div class='deal-wrap'>
                <div class='list-wrap'>
                    <div class='col time-col'>
                        <span class='label'>
                            时间
                        </span>
                        <!-- 用于占宽 -->
                        <span v-if='dealData.length' class='val forWide'>
                            {{ dealData[0][1] | filterTime('HH:mm:ss') }}
                        </span>
                        <div ref='timeColVals' class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val'>
                                {{ item[1] | filterTime('HH:mm:ss') }}
                            </span>
                        </div>
                    </div>

                    <div class='col price-col'>
                        <span class='label'>
                            成交价
                        </span>
                        <!-- 用于占宽 -->
                        <span v-if='dealData.length' class='val forWide'>
                            {{ dealData[0][2] }}
                        </span>
                        <!-- 用于占宽 -->
                        <div class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val' :style='{ color: item.color }'>
                                {{ item[2] }}
                            </span>
                        </div>
                    </div>

                    <div class='col volume-col'>
                        <span class='label'>
                            成交量
                        </span>
                        <!-- 用于占宽 -->
                        <span v-if='dealData.length' class='val forWide'>
                            {{ dealData[0][3] }}
                            'B'
                        </span>
                        <!-- 用于占宽 -->
                        <div class='vals'>
                            <span v-for='(item, i) in dealData' :key='i' class='val' :style='{ color: item.color }'>
                                {{ item[3] }}
                                {{ item[4] === 1 ? 'B' : 'S' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </van-tab>
    </van-tabs>
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
    data () {
        return {
            tabMinWidth: 0
        }
    },
    computed: {
        ...mapGetters(['style']),
    },
    watch: {
        sellList: {
            immediate: true,
            handler () {
                this.$refs['tabs'] && this.$refs['tabs'].resize()
            }
        }
    },
    methods: {
        getWidth (quantity, type) {
            const result = quantity * 100 / this.sums[type]
            return result + '%'
        },
        onChangeTab () {
            const tabW = this.$refs['tabs'].$el.offsetWidth
            console.log(tabW, typeof tabW)
            tabW > this.tabMinWidth && (this.tabMinWidth = tabW)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
    .tabs{
        display: flex;
        flex-direction: column;
        height: 100%;
        ::v-deep {
            .van-tab {
                font-size: rem(24px);
                line-height: rem(50px);
            }
            .van-tabs__wrap{
                height: rem(50px);
            }
            .van-tabs__content{
                flex: 1;
                box-sizing: border-box;
                padding-top: rem(10px);
                background: #fff;
                .van-tab__pane{
                    height: 100%;
                }
            }
        }
    }
    .stalls-wrap{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .sell-wrap, .buy-wrap{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            flex: 1;
            color: $muted;
            font-size: rem(22px);
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
                    margin-right: rem(10px);;
                }
                .quantity{
                    flex: 1;
                    text-align: right;
                }
            }
        }

        .scale-wrap{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            box-sizing: border-box;
            align-items: center;
            padding: 0 rem(10px);
            height: rem(50px);
            .left{
                display: block;
                flex: 0 0 50%;
                height: rem(10px);
                // background: linear-gradient(-60deg, transparent rem(5px), rgb(15, 52, 255) 0);
                transition: flex 0.28s ease-in-out;
            }
            .right{
                display: block;
                flex: 1;
                height: rem(10px);
                // background: linear-gradient(127deg, transparent rem(5px), rgb(247, 75, 33) 0);
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
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        font-size: rem(20px);
        line-height: rem(24px);
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
                margin-right: rem(6px);
                overflow: hidden;
                &:last-child{
                    margin-right: 0;
                }
                .label{
                    position: relative;
                    padding: rem(5px) 0;
                    background: #fff;
                    z-index: 1;
                    width: 100%;
                }
                .vals{
                    position: absolute;
                    z-index: 0;
                    bottom: 0;
                    min-height: 100%;
                    .val{
                        display: block;
                        margin: rem(5px) 0;
                    }
                }
                .forWide{
                    height: 0;
                    overflow: hidden;
                    color: #fff;
                    opacity:0;
                    margin:0 0 0 rem(8px);
                }
            }
            .time-col{
                min-width: rem(90px);
            }
            .price-col{
                min-width: rem(70px);
                text-align: right;
                align-items: flex-end;
            }
            .volume-col{
                align-items: flex-end;
                min-width: rem(44px);
                text-align: right;
                align-items: flex-end;
                flex: 1;
            }
        }
    }
</style>
