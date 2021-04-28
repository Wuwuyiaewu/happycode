<template>
    <div>
        <!-- <h2>postmessage</h2> -->
        <div style='background-color:#fff;'>
            {{ value }}
            <Dividing v-model='value' />
        </div>
        <iframe
            ref='contentIframe'
            class='contentIframe'
            height='100%'
            leftmargin='0'
            frameborder='0'
            marginheight='0'
            marginwidth='0'
            name='contentIframe'
            scrolling='auto'
            :src='iframeUrl'
            topmargin='0'
        ></iframe>
    </div>
</template>

<script>
import Dividing from '@m/components/Dividing/index'
export default {
    components: {
        Dividing
    },
    data () {
        return {
            iframeUrl: 'about:blank',
            value: 30
        }
    },
    mounted () {
        this.iframeUrl = 'http://localhost:8085/postmessage.html'
    }
}
</script>

<style lang="scss" scoped>
.contentIframe {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
