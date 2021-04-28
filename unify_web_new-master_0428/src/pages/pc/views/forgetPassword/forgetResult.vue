<template>
    <div class='container'>
        <FormAccount>
            <div class='main-result'>
                <!-- 成功 -->
                <div v-if='state' class='tips-box success'>
                    <i class='icon iconfont icon_icon_success icon_success'></i>
                    <!-- <p class="state">{{$t('forgetInfo.congratulation')}}</p> -->
                    <p class='tips-txt'>
                        {{ $t("forgetInfo.pwdSuccess") }}
                    </p>
                    <van-button class='nextBtn' :to="{ name: 'Login', query: { cb: encodeURIComponent('/home') } }" type='info'>
                        {{
                            $t("forgetInfo.loginNow")
                        }}
                    </van-button>
                </div>
                <!-- 失败 -->
                <div v-else class='tips-box fail'>
                    <i class='icon iconfont icon_shibaiicon'></i>
                    <!-- <p class="state">{{$t('forgetInfo.bad')}}</p> -->
                    <p class='tips-txt'>
                        {{ $t("forgetInfo.pwdFail") }}
                    </p>
                    <van-button class='nextBtn' type='info' @click='goRetry'>
                        {{ $t("tryAgain") }}
                    </van-button>
                </div>
            </div>
        </FormAccount>
    </div>
</template>

<script type="text/ecmascript-6">
import FormAccount from '@pc/modules/formAccount'

export default {
    name: 'ForgetResult',
    components: {
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
        }
    },
    created () {
        this.state = this.$route.params.state * 1
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
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #ffffff;
		width: 100%;
	}
	.main-result {
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
