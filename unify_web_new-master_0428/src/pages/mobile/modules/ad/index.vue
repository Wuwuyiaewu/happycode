<template>
    <div v-if='data'>
        <NoticeBar v-if="data.moduless === 'text'" ref='notice' :data='data.uiComponent[0]' />
        <Banner
            v-else-if="data.moduless === 'image'"
            :data='data.uiComponent'
            :emit-click-enable='emitClickEnable'
            @emitClick='emitClick'
        />
        <HtmlComp v-else-if="data.moduless === 'UEditor'" :data='data.uiComponent[0]' />
    </div>
</template>

<script>
import Banner from '@m/components/banner'
import HtmlComp from './html'
import NoticeBar from './noticeBar'
export default {
    components: {
        Banner,
        HtmlComp,
        NoticeBar
    },
    props: {
        data: Object,
        target: String,
        emitClickEnable: Boolean,
    },
    computed: {
        adInfo () {
            if (Object.prototype.toString.call(this.data) === '[object Array]') {
                return this.data[0] || {}
            } else {
                return {}
            }
        }
    },
    created () {
        console.log('created')
    },
    methods: {
        emitClick (url, $event) {
            this.$emit('emitClick', url, $event)
        }
    },
}
</script>

<style lang="scss" scoped>
</style>
