<template>
    <div class='upgrade'>
        <div class='container'>
            <div id='bm'></div>
            <div>
                <p class='label'>
                    尊敬的客户
                </p>
                <p class='labelContent'>
                    我司系统升级中，届时暂停服务，预计今天<span id='endTime'></span>前恢复，给您带来不便敬请见谅！
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { getQueryVariable } from '@/utils/index'
import { httpUrl } from '@/config'
import axios from 'axios'
import lottie from 'lottie-web'
export default {
    mounted () {
        this.initLottie()
        this.getConfigSystem()
    },
    methods: {
        initLottie () {
            var animation = lottie.loadAnimation({
                container: document.getElementById('bm'), // Required
                path: 'upgrading_anim.json', // Required
                // path: 'animJson/fullScreenLoading.json', // Required
                renderer: 'svg', // Required
                loop: false, // Optional
                autoplay: true, // Optional
            })
            animation.addEventListener('complete', function () {
                animation.goToAndPlay(3400)
            }, false)
        },
        getConfigSystem () {
            var backUrl = getQueryVariable('back', location.search)
            var navigatorType = 0
            try {
                navigatorType = performance.navigation.type // 点击刷新页面按钮或者通过Location.reload()方法显示的页面，type值为1
            } catch (error) { }

            axios.get(`${httpUrl}/json/configSystem.json`, {
                params: {
                    timestamp: Date.now()
                }
            }).then(({ data }) => {
                if (data && data.maintenance === false && navigatorType === 1 && backUrl) location.replace(backUrl)
                var endTimeEl = document.querySelector('#endTime')
                endTimeEl.innerHTML = data.endTime
            })
        }
    },
}
</script>

<style lang="scss">
@import './style.scss';
</style>

<style lang="scss" scoped>
.upgrade {
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
</style>
