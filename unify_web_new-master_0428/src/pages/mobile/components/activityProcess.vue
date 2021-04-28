<template>
    <div class='activityProcess'>
        <div id='activityProcessContent' class='activityContent'>
            <!-- <p>即将进入全屏体验场......</p>
            <div class='progress'></div> -->
        </div>
        <p class='text'>
            {{ $t('activity.tip7') }}...
        </p>
    </div>
</template>

<script>
import lottie from 'lottie-web'
export default {
    mounted () {
        this.initLottie()
    },
    methods: {
        initLottie () {
            var animation = lottie.loadAnimation({
                container: document.getElementById('activityProcessContent'), // Required
                // path: 'upgrading_anim.json', // Required
                path: '/animJson/fullScreenLoading.json', // Required
                renderer: 'svg', // Required
                loop: false, // Optional
                autoplay: true, // Optional
            })
            animation.addEventListener('complete', function () {
                animation.goToAndPlay(3400)
            }, false)
        },
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
@import "~@m/sass/animations.scss";
.activityProcess{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 11;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .activityContent{
        width: rem(400px);
        margin: 0 auto;
        text-align: center;
        padding: 0 rem(40px);
        color: #777;
    }
    .text{
        margin-top: rem(10px);
        font-size: rem(28px);
    }
}
.progress{
    height: rem(40px);
    overflow: visible;
    border-radius: rem(20px);
    margin-top: 10px;
    animation: progress-bar-stripes 0.30s linear infinite;
    background-color: #0387e4;
    position: relative;
    background-image: linear-gradient(-45deg,rgba(255,255,255,.40) 25%,transparent 25%, transparent 50%,rgba(255,255,255,.40) 50%,rgba(255,255,255,.40) 75%,transparent 75%,transparent 100%);
    background-size: rem(40px) rem(40px);
}
</style>
