<template>
    <van-swipe v-if='data.length>0' :autoplay='3000'>
        <van-swipe-item v-for='(item, index) in data' :key='index'>
            <a v-if='item.url' :href='item.url' :target='target' @click='openUrl(item.url, $event)'>
                <img v-lazy='item.img' class='img' />
            </a>
            <img v-else v-lazy='item.img' class='img' />
        </van-swipe-item>
    </van-swipe>
</template>

<script>
import Vue from 'vue'
import { openAdUrl } from '@/utils/appHybrid'
import { Swipe, SwipeItem, Lazyload } from 'vant'
Vue.use(Swipe).use(SwipeItem).use(Lazyload)
export default {
    name: 'Banner',
    props: {
        'data': {
            type: Array,
            default: function () {
                return []
            }
        },
        target: {
            type: String,
            default: '_blank'
        },
        emitClickEnable: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 打开广告链接
        openUrl (url, $event) {
            if (!url) return false
            if (this.emitClickEnable) {
                $event.stopPropagation()
                $event.preventDefault()
                this.$emit('emitClick', url, $event)
            } else {
                openAdUrl(url, $event)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.img {
    max-width: 100%;
}
</style>
