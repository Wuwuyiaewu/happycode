<template>
    <div>
        <van-popup
            v-model='showTip'
            class='m-popupBottomTip'
            get-container='body'
            :overlay-style="{ 'background':'transparent' }"
            :position="isPC?'center':'bottom'"
            @close='close'
            @open='open'
        >
            <div class='body'>
                <div class='title'>
                    {{ content.title }}
                </div>
                <div class='content'>
                    {{ content.txt }}
                </div>
                <div class='closeIcon' @click='close'>
                    <i class='van-icon van-icon-cross'></i>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import pcMixin from '@m/mixins/pc'
export default {
    name: 'PopupBottomTip',
    mixins: [pcMixin],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        content: {
            type: Object,
            default () {
                return {
                    title: '',
                    txt: ''
                }
            }
        }
    },
    data () {
        return {
            showTip: false,
            timer: null
        }
    },
    watch: {
        'show' (val) {
            this.showTip = val
        }
    },
    destroyed () {
        this.close()
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            if (this.timer) {
                window.clearTimeout(this.timer)
            }
        },
        open () {
            this.timer = window.setTimeout(() => {
                this.showTip = false
            }, 5000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-popupBottomTip {
    .body {
        position: relative;
        background-color: #333333;
        color: #fff;
        font-size: rem(24px);
        padding: rem(30px);
        .title {
            font-size: rem(28px);
        }
        .content {
            padding-right: rem(60px);
            word-break: break-all;
        }
        .closeIcon {
            text-align: center;
            position: absolute;
            right: rem(30px);
            top: rem(30px);
            display: inline-block;
            width: rem(60px);
            height: rem(60px);
            line-height: rem(60px);
        }
    }
}
</style>
