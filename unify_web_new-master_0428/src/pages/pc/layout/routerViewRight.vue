<template>
    <div>
        <router-view class='rightViewContainer' />
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.rightViewContainer {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate3d(0, -50%, 1px);
    background: #fff;
}
</style>
