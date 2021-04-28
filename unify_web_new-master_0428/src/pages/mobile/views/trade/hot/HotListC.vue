<template>
    <div class='m-zfb'>
        <div class='m-hotListTable'>
            <div class='header'>
                <div class='colA'>
                    名称
                </div>
                <div class='colB'>
                    最新
                </div>
                <div class='colC colC_zfb'>
                    振幅
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
                            1.1130
                        </div>
                        <div class='colC'>
                            <div class='colC-C'>
                                <div class='number'>
                                    19.25%
                                </div>
                                <div class='chart'>
                                    <div class='percent' style='width: 19.25%'></div>
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
                            1.1130
                        </div>
                        <div class='colC'>
                            <div class='colC-C'>
                                <div class='number'>
                                    50.00%
                                </div>
                                <div class='chart'>
                                    <div class='percent' style='width: 50.00%'></div>
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
export default {
    name: 'HotListC',
    data () {
        return {

        }
    },
    methods: {}
}
</script>
