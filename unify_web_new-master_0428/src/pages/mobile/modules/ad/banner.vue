<template>
    <div>
        <a :href="data.url||'javascript:;'" target='_blank'>
            <img class='img' :src='data.img' />
        </a>
    </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Lazyload } from 'vant'
Vue.use(Swipe).use(SwipeItem).use(Lazyload)
export default {
    name: 'Banner',
    props: {
        'data': {
            type: Object,
            default: function () {
                return {}
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
