<template>
    <div class='tipFixed'>
        <p>{{ $t('activity.tip3') }}</p>
        <a class='close icon_guanbi' href='javascript:;' @click='close'></a>
    </div>
</template>

<script>
export default {
    methods: {
        close () {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.tipFixed{
    position: fixed;
    height: rem(36px);
    line-height: rem(36px);
    background: #F39801;
    border-radius: 10px;
    font-size: rem(26px);
    color: #fff;
    padding: rem(10px) rem(50px) rem(9px) rem(20px);
    box-sizing: content-box;
    &::before{
        content: "";
        position: absolute;
        top: -5px;
        width: 0;
        height: 0;
        border: 6px solid #F39801;
        border-width: 0 6px 6px 6px;
        border-color: transparent transparent #F39801 transparent;
    }
    &.left{
        left: rem(30px);
        top: rem(100px);
        &::before{
            left: rem(60px);
        }
    }
    &.right{
        right: rem(30px);
        top: rem(130px);
        &::before{
            right: rem(60px);
        }
    }
}
.close{
    position: absolute;
    right: rem(13px);
    top: rem(10px);
    color: #fff;
    padding: 0 rem(5px);
    font-size: rem(18px);
}
</style>
