<template>
    <div class='count-box'>
        <span :class="{ 'enable': !isCount }">
            {{ isCount ? $t('forgetInfo.sendAgain') + '(' + num + ')' : tips }}
        </span>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'CountDown',
    props: {
        seconds: {
            type: Number,
            default: 60
        },
        tips: {
            type: String,
            default: function () {
                return this.$t('forgetInfo.getCode')
            }
        },
        isCount: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            num: this.seconds,
            timer: null
        }
    },
    watch: {
        isCount (v) { // 重置倒计时
            this.num = this.seconds
            return v ? this.count() : clearTimeout(this.timer)
        }
    },
    methods: {
        count () {
            if (this.num > 0) {
                this.timer = setTimeout(() => {
                    this.num -= 1
                    clearTimeout(this.timer)
                    this.count()
                }, 1000)
            } else {
                this.$emit('update', false) // 更新计时状态
                clearTimeout(this.timer)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.count-box {
    min-width: rem(150px);
    font-size: rem(24px);
    color: #c4c4c4;
    .enable {
        color: #477fd3;
    }
}
</style>
