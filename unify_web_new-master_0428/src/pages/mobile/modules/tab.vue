<template>
    <van-tabs
        v-model='active'
        :background='background'
        :border='border'
        class='tabs'
        :color='color'
        :ellipsis='false'
        line-width='30'
        :title-active-color='titleActiveColor'
        :title-inactive-color='titleInactiveColor'
        :type='type'
        @change='updataActive'
    >
        <van-tab v-for='(item, index) in list' :key='index' class='tab'>
            <div slot='title' class='title' @click="$emit('tabClick',item,index)">
                <i v-if='item.icon' class='icon' :class='item.icon' :style="{ 'color':item.color }"></i>
                <div class='text'>
                    {{ item.title }}
                </div>
                <div v-if='dot' class='dot'></div>
            </div>
        </van-tab>
    </van-tabs>
</template>

<script>
export default {
    name: 'Tab',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        type: {
            type: String,
            default: 'line'
        },
        background: {
            type: String,
            default: '#fff'
        },
        color: {
            type: String,
            default: '#477FD3'
        },
        titleActiveColor: {
            type: String,
            default: '#477FD3'
        },
        titleInactiveColor: {
            type: String,
            default: '#333'
        },
        border: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: []
        },
        value: {
            type: [String, Number],
            default: 0
        },
        dot: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            active: 0
        }
    },
    watch: {
        value () {
            this.active = this.value
        }
    },
    created () {
        this.active = this.value
    },
    methods: {
        updataActive (data) {
            this.$emit('change', data)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.tabs ::v-deep .van-tab:first-child {
    margin-left: rem(20px);
}
.title {
    padding: 0 rem(20px);
    .icon {
        font-style: normal;
        font-size: rem(24px);
    }
}
</style>
