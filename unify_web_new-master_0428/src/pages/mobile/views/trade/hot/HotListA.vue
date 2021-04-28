<template>
    <div class='m-zdfb'>
        <div class='m-chart'>
            <div class='title'>
                涨跌分布（单位 : 家）
            </div>
            <div class='content'>
                <div class='item up'>
                    <div class='column' style='height: 100%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item up'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item up'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item down'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item down'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
                <div class='item down'>
                    <div class='column' style='height: 20%'>
                        <div class='number'>
                            20
                        </div>
                    </div>
                </div>
            </div>
            <div class='groupName'>
                <div class='item'>
                    -1以下
                </div>
                <div class='item'>
                    -1至-0.5
                </div>
                <div class='item'>
                    -0.5至-0.2
                </div>
                <div class='item'>
                    -0.2至+0.2
                </div>
                <div class='item'>
                    +0.2至+0.5
                </div>
                <div class='item'>
                    +0.5至+1
                </div>
                <div class='item'>
                    +1以上
                </div>
            </div>
            <div class='unit'>
                %
            </div>
        </div>
        <div class='m-hotListTable'>
            <div class='header'>
                <div class='colA'>
                    名称
                </div>
                <div class='colB'>
                    最新
                </div>
                <div class='colC'>
                    涨跌幅
                </div>
            </div>
            <div class='body'>
                <router-link class='link van-hairline--top' :to="{ path:'/home/1234',params:{ id:'1234' } }">
                    <div class='item'>
                        <div class='colA'>
                            <div class='rankIcon'>
                                1
                            </div>
                            <div class='info'>
                                <div class='name'>
                                    澳元日元
                                </div>
                                <div class='code'>
                                    AUD/JPY
                                </div>
                            </div>
                        </div>
                        <div class='colB subColor'>
                            <div>1.1130</div>
                            <div>+0.65</div>
                        </div>
                        <div class='colC'>
                            <div class='btn subColorBg'>
                                +0.52%
                            </div>
                        </div>
                    </div>
                </router-link>
                <router-link class='link van-hairline--top' :to="{ path:'/home/1234',params:{ id:'1234' } }">
                    <div class='item'>
                        <div class='colA'>
                            <div class='rankIcon'>
                                2
                            </div>
                            <div class='info'>
                                <div class='name'>
                                    澳元日元
                                </div>
                                <div class='code'>
                                    AUD/JPY
                                </div>
                            </div>
                        </div>
                        <div class='colB subColor'>
                            <div>1.1130</div>
                            <div>+0.65</div>
                        </div>
                        <div class='colC'>
                            <div class='btn subColorBg'>
                                +0.52%
                            </div>
                        </div>
                    </div>
                </router-link>
                <router-link class='link van-hairline--top' :to="{ path:'/home/1234',params:{ id:'1234' } }">
                    <div class='item'>
                        <div class='colA'>
                            <div class='rankIcon'>
                                3
                            </div>
                            <div class='info'>
                                <div class='name'>
                                    澳元日元
                                </div>
                                <div class='code'>
                                    AUD/JPY
                                </div>
                            </div>
                        </div>
                        <div class='colB subColor'>
                            <div>1.1130</div>
                            <div>+0.65</div>
                        </div>
                        <div class='colC'>
                            <div class='btn subColorBg'>
                                +0.52%
                            </div>
                        </div>
                    </div>
                </router-link>
                <router-link class='link van-hairline--top' :to="{ path:'/home/1234',params:{ id:'1234' } }">
                    <div class='item'>
                        <div class='colA'>
                            <div class='rankIcon'>
                                4
                            </div>
                            <div class='info'>
                                <div class='name'>
                                    澳元日元
                                </div>
                                <div class='code'>
                                    AUD/JPY
                                </div>
                            </div>
                        </div>
                        <div class='colB subColor'>
                            <div>1.1130</div>
                            <div>+0.65</div>
                        </div>
                        <div class='colC'>
                            <div class='btn subColorBg'>
                                +0.52%
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class='body'>
                <router-link class='link van-hairline--top' :to="{ path:'/home/1234',params:{ id:'1234' } }">
                    <div class='item'>
                        <div class='colA'>
                            <div class='rankIcon'>
                                1
                            </div>
                            <div class='info'>
                                <div class='name'>
                                    澳元日元
                                </div>
                                <div class='code'>
                                    AUD/JPY
                                </div>
                            </div>
                        </div>
                        <div class='colB riseColor'>
                            <div>1.1130</div>
                            <div>+0.65</div>
                        </div>
                        <div class='colC'>
                            <div class='btn riseColorBg'>
                                +0.52%
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HotListA',
    data () {
        return {

        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-chart {
    border-bottom: rem(20px) solid #f9f9f9;
    padding: rem(36px) rem(30px);
    position: relative;
    .title {
        font-size: rem(24px);
        margin-bottom: rem(30px);
    }

    .groupName {
        margin-top: rem(10px);
        .item {
            display: inline-block;
            width: 14.28%;
            text-align: center;
            word-break: keep-all;
            font-size: rem(18px);
        }
    }
    .unit {
        position: absolute;
        bottom: rem(40px);
        right: rem(18px);
        font-size: rem(18px);
    }

    .content {
        padding-top: rem(20px);
        font-size: 0;
        .item {
            height: rem(220px);
            position: relative;
            bottom: 0;
            display: inline-block;
            width: 14.28%;
            text-align: center;
            .column {
                position: absolute;
                bottom: 0;
                margin-left: rem(-30px);
                display: inline-block;
                width: rem(60px);
                background-color: #999;
                .number {
                    width: rem(60px);
                    text-align: center;
                    position: absolute;
                    top: rem(-40px);
                    font-size: rem(28px);
                    color: #999999;
                }
            }
        }
        .up {
            .column {
                background-color: #e3525c;
            }
            .number {
                color: #e3525c;
            }
        }
        .down {
            .column {
                background-color: #10b873;
            }
            .number {
                color: #10b873;
            }
        }
    }
}
</style>
