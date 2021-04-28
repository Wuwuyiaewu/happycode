<template>
    <div class='upgrade'>
        <div class='container'>
            <div id='bm'></div>
            <div>
                <p class='label'>
                    {{ $t('upgrading.dearCustomer') }}
                </p>
                <p class='labelContent'>
                    {{ $t('upgrading.content', [endTime]) }}
                </p>
            </div>
            <div class='back'>
                <a href='javascript:;' @click='$router.back()'>
                    {{ $t('payInfo.back') }} &gt;&gt;
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import lottie from 'lottie-web'
export default {
    props: ['endTime'],
    mounted () {
        this.initLottie()
    },
    methods: {
        initLottie () {
            var animation = lottie.loadAnimation({
                container: document.getElementById('bm'), // Required
                path: '/upgrading_anim.json', // Required
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
.upgrade {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: #fff;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    height: 100vh;
    -webkit-box-pack: center;
    justify-content: center;
}
.icon-wrap{
    position: relative;
}
.icon-wrap svg {
    -webkit-animation: loading-spinner 3s infinite linear;
    -moz-animation: loading-spinner 3s infinite linear;
    -o-animation: loading-spinner 3s infinite linear;
    animation: loading-spinner 3s infinite linear;
    position: absolute;
    display: inline-block;

}

.icon-wrap .icon-large {
    width: 0.54rem;
    height: 0.54rem;
    left: 50%;
    top: 50%;
    margin-left: -1rem;
    margin-top: -0.05rem;

}

.icon-wrap .icon-small {
    width: 0.4rem;
    height: 0.4rem;
    left: 50%;
    top: 50%;
    margin-left: -0.4rem;
    margin-top: 0.16rem;

}

@-webkit-keyframes loading-spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@-moz-keyframes loading-spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@-o-keyframes loading-spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@keyframes loading-spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg)
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

.container {
    position: relative;
    padding: 0 25px;
    max-width: 660px;
    margin: 0 auto;
}

.upgradingPic {
    display: block;
    width: 100%;
}

.label {
    padding-top: 30px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.labelContent {
    padding: 10px 20px;
    line-height: 1.7;
    font-size: 14px;
    color: #444;
    text-align: center;
}
.back{
    text-align: center;
    a{
        color: #477fd3;
        text-decoration: underline;
    }
}
</style>
