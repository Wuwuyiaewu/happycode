<template>
    <van-notice-bar ref='vanNotice' class='notice' left-icon='volume-o icon_tongzhi' mode='closeable' @close='close'>
        <a v-if='data.url' :href='data.url' target='_blank'>
            {{ data.title }}
        </a>
        <div v-else>
            {{ data.title }}
        </div>
    </van-notice-bar>
</template>

<script>
export default {
    name: 'NoticeBar',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            timer: null
        }
    },
    mounted () {
        // this.timer = window.setTimeout(() => {
        //     this.$refs.vanNotice.onClickIcon()
        //     this.close()
        // }, 2000)
    },
    destroyed () {
        this.close()
    },
    methods: {
        start () {
            this.$refs.vanNotice.start()
        },
        close () {
            if (this.timer) {
                window.clearTimeout(this.timer)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.notice {
    height: rem(50px);
    color: #477fd3;
    background-color: #edf4ff;
    ::v-deep {
        .van-notice-bar__right-icon {
            color: #a5b5cd;
        }
        .van-notice-bar__content {
            color: #477fd3;
            font-size: rem(24px);
            a {
                color: #477fd3;
                font-size: rem(24px);
            }
        }
    }
}
</style>
