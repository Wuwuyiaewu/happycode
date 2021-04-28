<template>
    <div class='option' :class='{ active: isActive }' @click='onClick'>
        <span>{{ option.text }}</span>
    </div>
</template>

<script>
export default {
    name: 'DropdownOption',
    props: {
        option: {
            type: Object,
            default: () => ({})
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick () {
            this.$emit('clicked', this.option)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.option {
    padding: rem(10px);
    height: rem(60px);
    line-height: rem(40px);
    min-width: rem(150px);
    border: rem(1px) solid #cccccc;
    border-radius: rem(5px);
    box-sizing: border-box;
    text-align: center;
    &.active {
        background: #497fd3;
        border: 0;
        span {
            color: #fff;
        }
    }
    span {
        font-size: rem(24px);
        color: #666;
    }
}
</style>
