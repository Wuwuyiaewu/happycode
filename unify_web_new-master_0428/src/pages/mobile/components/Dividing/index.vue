<template>
    <div
        ref='container'
        class='container'
        @mousedown='active=true'
        @mouseup='up'
        @touchend='up'
        @touchstart='active=true'
    >
        <div class='content'>
            <slot name='content'>
                {{ value }}{{ $t('optional.pip') }}
            </slot>
        </div>
    </div>
</template>

<script>
import scale from './scale'
export default {
    props: {
        min: {
            type: Number,
            default: -100
        },
        max: {
            type: Number,
            default: 150
        },
        shownumber: {
            type: Boolean,
            default: false
        },
        interval: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            myScale: null,
            active: false,
        }
    },
    watch: {
        'value' (val) {
            if (!this.active) {
                // 更新刻度尺
                // 更新刻度尺位置
                this.updateDividing()
            }
        }
    },
    mounted () {
        this.updateDividing('init')
    },
    methods: {
        up () {
            this.active = false
            this.updateDividing()
        },
        updateDividing (type) {
            let showMin = this.value - 300
            if (showMin < this.min) {
                showMin = this.min
            }
            if (showMin > this.max) {
                showMin = this.max - 600
            }
            let showMax = showMin + 600
            if (showMax > this.max) {
                showMax = this.max
            }
            const opt = {
                height: 30,
                scaleLineColor: '#666',
                capacity: this.interval,
                start: showMin,
                end: showMax
            }
            if (this.myScale) {
                this.myScale.clear()
            }
            this.myScale = scale.init(this.$refs.container, opt, (val) => {
                if (this.active) {
                    this.$emit('valueChange', val)
                }
            })
            this.myScale.update(this.value)
        }

    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.container {
    position: relative;
    .content {
        pointer-events: none;
        position: absolute;
        left: 50%;
        top: 0;
        z-index: 3;
        background-color: #000;
        transform: translateX(-50%);
        color: #fff;
        font-size: rem(18px);
        padding: 0 2px;
    }
}
</style>
