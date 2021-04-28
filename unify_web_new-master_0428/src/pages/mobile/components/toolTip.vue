<template>
    <span class='toolTip'>
        <slot></slot>
    </span>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.toolTip {
    position: relative;
    display: inline-block;
    min-width: 30px;
    min-height: rem(38px);
    line-height: rem(38px);
    padding: 6px 8px;
    color: #fff;
    font-size: 12px;
    text-decoration: none;
    word-wrap: break-word;
    background-color: #404040;
    text-align: center;
    border-radius: 2px;
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -4px;
        display: block;
        width: 0;
        height: 0;
        margin-left: -4px;
        border: 1px solid #404040;
        border-width: 7px 7px 0 7px;
        border-radius: 3px;
        border-color: #404040 transparent transparent transparent;
    }
}
</style>
