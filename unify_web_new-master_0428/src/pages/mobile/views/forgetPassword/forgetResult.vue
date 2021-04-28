<template>
    <div class='container'>
        <FormAccount :show-close='!isYk' :show-yk='isYk'>
            <div class='forget-main'>
                <!-- 成功 -->
                <div v-if='state' class='tips-box success'>
                    <i class='icon iconfont icon_icon_success icon_success'></i>
                    <!-- <p class="state">{{$t('forgetInfo.congratulation')}}</p> -->
                    <p class='tips-txt'>
                        {{ $t('forgetInfo.pwdSuccess') }}
                    </p>
                    <van-button class='nextBtn' :to="{ name:'Login',query:{ cb:encodeURIComponent('/home') } }" type='info'>
                        {{ $t('forgetInfo.loginNow') }}
                    </van-button>
                </div>
                <!-- 失败 -->
                <div v-else class='tips-box fail'>
                    <i class='icon iconfont icon_shibaiicon'></i>
                    <!-- <p class="state">{{$t('forgetInfo.bad')}}</p> -->
                    <p class='tips-txt'>
                        {{ $t('forgetInfo.pwdFail') }}
                    </p>
                    <van-button class='nextBtn' type='info' @click='goRetry'>
                        {{ $t('tryAgain') }}
                    </van-button>
                </div>
            </div>
        </FormAccount>
    </div>
</template>

<script type="text/ecmascript-6">
import top from '../../layout/top'
import FormAccount from '@m/modules/formAccount'
import { removeLoginData } from '@/utils/index'

export default {
    name: 'ForgetResult',
    components: {
        top,
        FormAccount
    },
    data () {
        return {
            state: '' // 1 成功 0 失败
        }
    },
    computed: {
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo &&
                this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo &&
                this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        isYk () {
            if (location.href.indexOf('url_source') > -1) {
                return true
            } else {
                return false
            }
        },
    },
    created () {
        this.state = this.$route.params.state * 1
        // 清空本地信息
        if (this.state) {
            removeLoginData()
        }
    },
    methods: {
        goRetry () {
            this.$router.go(-2)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.container {
    height: 100%;
}
.forget-main {
    padding: rem(90px) rem(85px) 0 rem(85px);
    height: 100%;
    width: 100%;
    background: #fff;
    .nextBtn {
        // position: absolute;
        // bottom: rem(70px);
        // left: 50%;
        // transform: translateX(-50%);
        margin-top: rem(140px);
        height: rem(80px);
        width: rem(440px);
        line-height: rem(80px);
        font-size: rem(34px);
        color: #fff;
        background-color: #477fd3;
        border-color: #477fd3;
        border-radius: rem(40px);
    }
}
.tips-box {
    // margin-top: rem(85px);
    text-align: center;
    height: rem(640px);
    border-radius: rem(10px);
    padding-top: rem(45px);
    position: relative;
    .state {
        font-size: rem(34px);
        color: #11b873;
        line-height: rem(34px);
        margin-bottom: rem(24px);
    }
    .tips-txt {
        font-size: rem(34px);
        color: #333;
        line-height: rem(34px);
        font-weight: 400;
    }
    &.fail {
        .tips-txt {
            width: rem(334px);
            line-height: rem(36px);
            margin: 0 auto;
        }
        .state {
            color: #e0535b;
        }
    }
    .icon_success {
        font-size: 58px;
        color: #19b275;
    }
    .icon_shibaiicon {
        font-size: 50px;
        color: #e0535b;
    }
}
.t_c {
    text-align: center;
}
.foot-custom {
    position: absolute;
    left: 0;
    bottom: rem(70px);
    width: 100%;
    text-align: center;
    font-size: rem(26px);
    color: #477fd3;
    .icon_icon_service {
        margin-right: rem(10px);
    }
    .customBtn {
        color: #477fd3;
    }
}
</style>
