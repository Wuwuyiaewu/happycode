<template>
    <div class='m-tradeHotList'>
        <div class='m-subTab'>
            <Tab v-model='subTabActive' background='none' :list='subTabList' title-active-color='#fff' type='card' />
        </div>
        <component :is='showListType' />
    </div>
</template>

<script>
import Tab from '@m/modules/tab'
import HotListA from './HotListA'
import HotListB from './HotListB'
import HotListC from './HotListC'
export default {
    name: 'HotList',
    components: {
        Tab,
        HotListA,
        HotListB,
        HotListC
    },
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            subTabList: [
                { title: '涨跌幅榜', value: 'HotListA', icon: 'icon_icon_updown', color: '#e3525c' },
                { title: '涨跌速榜', value: 'HotListB', icon: 'icon_icon_speed', color: '#ec801f' },
                { title: '振幅榜', value: 'HotListC', icon: 'icon_icon_amplitude', color: '#477fd3' }
            ],
            subTabActive: 0
        }
    },
    computed: {
        showListType () {
            return this.subTabList[this.subTabActive].value
        }
    },
    watch: {
    },
    methods: {
        subscription (val) {
            console.log(val)
        }
    }
}
</script>

<style lang="scss" scoped>
.m-subTab {
    ::v-deep {
        .van-tabs {
            .van-tab--active {
                .icon {
                    color: #fff !important;
                }
            }
        }
    }
}
</style>

<style lang="scss">
@import "./style";
</style>
