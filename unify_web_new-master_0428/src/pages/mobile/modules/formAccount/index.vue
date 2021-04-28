<template>
    <div class='form-account-wrap' :class='{ pc:isPC }'>
        <div v-if='showHeader' class='header'>
            <div class='left'>
                <template v-if='isPC'>
                    <template v-if="companyLogo.url.trim()===''">
                        <a href='javascript:void(0)'>
                            <img alt :src='companyLogo.img' />
                        </a>
                    </template>
                    <template v-else>
                        <a :href='companyLogo.url' target='_blank'>
                            <img alt :src='companyLogo.img' />
                        </a>
                    </template>
                </template>
                <template v-else>
                    <span v-if='showClose' class='close' @click='goBack'>
                        <i class='icon_icon_close_big'></i>
                    </span>
                    <span v-if='showBack' class='back' @click='goBack'>
                        <i class='icon_icon_back'></i>
                    </span>
                </template>
            </div>

            <div class='middle'></div>
            <div class='right'>
                <template v-if='isPC'>
                    <span v-if='showClose' class='close' @click='goHome'>
                        <i class='icon_icon_close_big'></i>
                    </span>
                    <span v-if='showBack' class='back' @click='goBack'>
                        <i class='icon_icon_back'></i>
                    </span>
                    <span v-if='showYk' class='yk' @click='goHome'>
                        游客体验
                    </span>
                </template>
                <template v-else>
                    <template v-if='showHeaderRight'>
                        <slot v-if='$slots.headerRight' name='headerRight'></slot>
                        <router-link v-else-if='!$store.state.ix_user.userLoginInfo.account_id' class='accountLogin' to='/login'>
                            {{ $t("registerInfo.accountLogin") }}
                        </router-link>
                    </template>
                </template>
            </div>
        </div>
        <div class='main'>
            <div class='title-wrap'>
                <div v-if='showContentBack' class='content-back'>
                    <span @click='goContentBack'>
                        <i class='icon_icon_back'></i>
                    </span>
                </div>
                <div class='title'>
                    <slot name='title'></slot>
                </div>
                <div class='desc'>
                    <slot name='desc'></slot>
                </div>
            </div>
            <div class='content'>
                <slot></slot>
                <div v-if='isPC && onlineService && onlineServiceUrl' class='service'>
                    <span @click='openService'>
                        <i class='icon_icon_service'></i>
                        {{ $t("onlineService") }}
                    </span>
                </div>
            </div>
            <template v-if='!isPC'>
                <FooterOnlineService v-if='onlineService && onlineServiceUrl' :float='true' :title="$t('onlineService')" :url='onlineServiceUrl' />
            </template>
        </div>
        <OnlineService v-if='isPC' :is-home='false' :service-show='serviceShow' @online='serviceShow = false' />
    </div>
</template>

<script>
import FooterOnlineService from '@m/modules/footerOnlineService'
import OnlineService from '@m/modules/onlineService'
import { mapGetters } from 'vuex'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'FormAccount',
    components: {
        FooterOnlineService,
        OnlineService,
    },
    mixins: [pcMixin],
    props: {
        showHeader: {
            type: Boolean,
            default: true,
        },
        showHeaderRight: {
            type: Boolean,
            default: false,
        },
        showClose: {
            type: Boolean,
            default: false,
        },
        showBack: {
            type: Boolean,
            default: false,
        },
        showContentBack: {
            type: Boolean,
            default: false,
        },
        showYk: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            serviceShow: false
        }
    },
    computed: {
        ...mapGetters(['companyInfo']),
        onlineService () {
            const companyInfo = this.companyInfo
            return companyInfo.transBaseConfigVo ? companyInfo.transBaseConfigVo.onlineService : ''
        },
        // 在线客服url
        onlineServiceUrl () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService
        },
        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },
        companyLogo () {
            try {
                return (this.uiPageList.FrontLog && this.uiPageList.FrontLog.uiModules[0].uiComponent[0]) || { url: '' }
            } catch (error) {
                return { url: '' }
            }
        }
    },
    created () {
        console.log(this.$route.params.type, this.$route.params.step)
    },
    methods: {
        openService () {
            window.open(this.onlineServiceUrl, '_blank')
        },
        // 返回页面
        goBack () {
            // debugger
            if (history.length <= 2) {
                this.$router.push({ name: 'Home' })
            } else {
                this.$router.back()
                // if (this.$route.params.type === 'RegisterByEmail' && this.$route.params.step === 2) {
                //     this.$router.replace({ name: 'Register', params: { step: 1, type: 'RegisterByEmail' } })
                // } else {
                //     this.$router.back()
                // }
            }
        },
        goContentBack () {
            this.$emit('content-back')
        },
        goHome () {
            this.$router.push({ name: 'Layout' })
        },
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.form-account-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-top: rem(90px);
    padding-bottom: rem(50px);
    &.pc{
        .header {
                height: 60px;
            .left {
                line-height: initial;
                padding-left: 15px;
                img {
                    height: 36px;
                }
                .close,
                .back {
                    margin-left: rem(30px);
                    i {
                        font-size: rem(35px);
                        color: #333333;
                    }
                }
                .icon-logo {
                    display: inline-block;
                    width: 158px;
                    height: 36px;
                    background: url(~@public/images/logo.png) no-repeat center
                        center;
                    background-size: 100%;
                    margin: rem(20px);
                }
            }
        }
        .main {
                width: 520px;
                box-shadow: 0px 0px 40px 0px #e6e6e6;
                border-radius: 6px;
                padding: 0 55px;
                z-index: 1000;
                position: fixed;
                top: 50%;
                left: 50%;
                -webkit-transform: translateY(-50%) translateX(-50%);
                -moz-transform: translateY(-50%) translateX(-50%);
                -ms-transform: translateY(-50%) translateX(-50%);
                transform: translateY(-50%) translateX(-50%);
                .title-wrap{
                    padding-top:20px;
                }
            }
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex: 0 0 rem(90px);
        line-height: rem(90px);
        background: #fff;
        z-index: 999;
        .left {
            .close,
            .back {
                margin-left: rem(30px);
                i {
                    font-size: rem(35px);
                    color: #333333;
                }
            }
        }

        .middle {
            flex: 1;
        }
        .right {
            margin-right: rem(30px);
            font-size: rem(28px);
            font-weight: 400;
            line-height: rem(36px);
            a {
                color: rgba(71, 127, 211, 1);
            }
            .close{
                cursor: pointer;
            }
        }
    }

    .main {
        flex: 1;
        width: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .title-wrap {
            flex: 1;
            width: 100%;
            position: relative;
            align-self: flex-start;
            padding: 0 rem(28px);
            margin-top: rem(25px);
            box-sizing: border-box;
            .title {
                font-size: rem(50px);
                line-height: rem(50px);
                color: rgba(51, 51, 51, 1);
                font-weight: 500;
            }
            .desc {
                // position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                // padding: 0 0 0 rem(28px);
                margin-top: rem(15px);
            }
        }
        .content {
            flex: 1;
            width: 100%;
            box-sizing: border-box;
            margin: 0 0 rem(80px) 0;
            overflow: hidden;
            .service {
                color: #477fd3;
                text-align: center;
                cursor: pointer;
                margin: 20px 0;
                font-size: 14px;
            }
        }
    }
}
.pc{
    .title-wrap {
        .title {
            position: relative;
            text-align: center;
            margin-bottom: 20px;
        }
    }
}
</style>
