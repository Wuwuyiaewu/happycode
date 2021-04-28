<template>
    <div :id='containerId' class='TVChartContainer'></div>
</template>

<script>
import TVjsApi from './TVjsApi'
export default {
    name: 'TVChartContainer',
    tvWidget: null,
    data () {
        return {
            containerId: 'tv_chart_container'
        }
    },
    mounted () {
        this.TVjsApi = new TVjsApi('btcusdt')
        this.TVjsApi.init()
    },
    destroyed () {
        // if (this.tvWidget !== null) {
        //     this.tvWidget.remove();
        //     this.tvWidget = null;
        // }
    }
}
</script>

<style lang="scss" scoped>
.TVChartContainer {
    height: 100%;
}
</style>
