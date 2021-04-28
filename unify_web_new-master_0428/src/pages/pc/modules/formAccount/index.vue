<template>
    <div class='form-account-wrap'>
        <div v-if='showHeader' class='header'>
            <div class='left'>
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
            </div>

            <div class='middle'></div>
            <div class='right'>
                <span v-if='showClose' class='close' @click='goHome'>
                    <i class='icon_icon_close_big'></i>
                </span>
                <span v-if='showBack' class='back' @click='goBack'>
                    <i class='icon_icon_back'></i>
                </span>
                <span v-if='showYk' class='yk' @click='goHome'>
                    游客体验
                </span>
                <!-- <template v-if="showHeaderRight">
                    <slot name="headerRight" v-if="$slots.headerRight" />
                    <router-link to="/login" class="accountLogin" v-else>{{$t('registerInfo.accountLogin')}}</router-link>
                </template>-->
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
            </div>
            <!-- <OnlineService
        v-if="onlineService && onlineServiceUrl"
        :url="onlineServiceUrl"
        :float="true"
        :title="$t('onlineService')"
            />-->
        </div>
    </div>
</template>

<script>
import OnlineService from '@m/modules/footerOnlineService'
import { mapGetters } from 'vuex'

export default {
    name: 'FormAccount',
    components: {
        OnlineService,
    },
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
            return companyInfo.uiPageList || {}
        },
        companyLogo () {
            try {
                return (this.uiPageList.FrontLog && this.uiPageList.FrontLog.uiModules[0].uiComponent[0]) || { url: '' }
            } catch (error) {
                return { url: '' }
            }
        }
    },
    methods: {
        // 返回页面
        goBack () {
            if (history.length <= 2) {
                this.$router.push({ name: 'Home' })
            } else {
                this.$router.back()
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

        .middle {
            flex: 1;
        }
        .right {
            margin-right: rem(30px);
            font-size: rem(28px);
            font-weight: 400;
            line-height: rem(36px);
            cursor: pointer;
            a {
                color: rgba(71, 127, 211, 1);
            }
            .yk {
                color: rgba(71, 127, 211, 1);
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
        .title-wrap {
            flex: 1;
            width: 100%;
            position: relative;
            align-self: flex-start;
            padding: 0 rem(28px);
            margin-top: rem(25px);
            box-sizing: border-box;
            .content-back {
                text-align: left;
                position: relative;
                span {
                    position: absolute;
                    left: -65px;
                    color: #8c8c8c;
                    font-size: 20px;
                    display: inline-block;
                    width: 66px;
                    height: 50px;
                    text-align: center;
                    line-height: 50px;
                    top: -46px;
                    cursor: pointer;
                }
            }
            .title {
                text-align: center;
                font-size: rem(50px);
                line-height: rem(50px);
                color: rgba(51, 51, 51, 1);
                font-weight: 500;
                margin-top: rem(100px);
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
        }
    }
}
</style>
