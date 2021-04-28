<template>
    <div class='m-zdfb'>
        <div class='m-hotListTable'>
            <div class='header'>
                <div class='colA'>
                    名称
                </div>
                <div class='colB'>
                    最新
                </div>
                <div class='colC'>
                    涨跌速
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
                            <div class='colC-B'>
                                <div class='colC-B'>
                                    <Board :number='-2.04' />
                                    <div class='zds riseColor'>
                                        -2.04
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
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
                            <div class='colC-B'>
                                <Board :number='2.04' />
                                <div class='zds subColor'>
                                    +2.04
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Board from './Board'
export default {
    name: 'HotListB',
    components: {
        Board
    },
    data () {
        return {

        }
    },
    methods: {}
}
</script>
