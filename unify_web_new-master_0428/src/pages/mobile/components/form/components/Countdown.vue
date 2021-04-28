<template>
    <div class='countdown-wrap' @click='handleOnClick'>
        <span v-if='isCount'>
            {{ $t('forgetInfo.sendAgain') + '(' + num + ')' }}
        </span>
        <span v-else class='enable' :class='{ wait: isWait }'>
            {{ tips }}
        </span>
    </div>
</template>

<script>
export default {
    name: 'Countdown',
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
        }
    },
    data () {
        return {
            num: this.seconds,
            timer: null,
            isCount: false,
            isWait: false
        }
    },
    methods: {
        handleOnClick () {
            if (this.isCount || this.isWait) {
                return
            }

            this.isWait = true
            setTimeout(() => {
                this.isWait = false
            }, 2000)

            this.$emit('click', () => {
                this.openCountdown()
            })
        },
        openCountdown () {
            this.isCount = true
            this.timer = setTimeout(() => {
                this.num -= 1
                clearTimeout(this.timer)
                this.openCountdown()
                if (this.num < 0) {
                    this.countdownEnd()
                }
            }, 1000)
        },
        countdownEnd () {
            clearTimeout(this.timer)
            this.isCount = false
            this.num = this.seconds
        }
    }
}
</script>

<style lang="scss" scoped>
	@import '~@m/sass/mixin.scss';

	.countdown-wrap {
		min-width: rem(150px);
		text-align: center;
		font-size: rem(24px);
		color: #c4c4c4;
		.enable {
			color: #477fd3;
			cursor: pointer;
            &.wait{
                color: $muted;
            }
		}
	}
</style>
