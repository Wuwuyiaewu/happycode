<template>
    <div>
        <div class='centerViewMask'></div>
        <router-view class='centerViewDialog' />
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.centerViewMask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.5);
}
.centerViewDialog {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 1px);
    background: #fff;
}
</style>
