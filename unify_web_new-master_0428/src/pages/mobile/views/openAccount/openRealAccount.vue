<template>
    <div class='iframeWrapper'>
        <Top>
            <div class='title mainColorBg'>
                <div
                    v-if='iframeUrl.openreal'
                    class='item'
                    :class="{ 'mainColor': active !== 'openreal' }"
                    @click='toOpenReal'
                >
                    真实开户
                </div>
                <div
                    v-if='iframeUrl.opendemo'
                    class='item'
                    :class="{ 'mainColor': active !== 'opendemo' }"
                    @click='toOpenDemo'
                >
                    模拟开户
                </div>
            </div>
            <div slot='right'>
                <van-loading v-if='loading' :color='style.mainColor' size='20px' />
            </div>
        </Top>
        <!-- <div class="scroll-wrapper">
            <iframe
                ref="openAccount"
                leftmargin="0"
                topmargin="0"
                marginwidth="0"
                marginheight="0"
                scrolling="auto"
                name="openreal"
                class="mainContent"
                frameborder="0"
                width="100%"
                height="100%"
            />
        </div>-->
        <my-iframe ref='contentIframe' page-url='about:blank' @onerror='hiddenLoading' @onload='hiddenLoading' />
    </div>
</template>

<!--
openreal 开真实户
opendemo 开模拟户

-->
<script>
import { mapGetters } from 'vuex'
import Top from '@m/layout/top'
import { Toast } from 'vant'
import { delayAwait } from '@/utils/index.js'
import iframe from '@m/components/iframe'
export default {
    name: 'OpenAccount',
    beforeRouteEnter: (to, from, next) => {
        delayAwait(() => JSON.parse(sessionStorage.getItem('getAppProperties')), true).then(res => {
            if (!res) next()
            const uiPageList = res.uiPageList
            const type = to.params.id === 'opendemo' ? 'openDemoAccount' : 'openRealAccount'
            const openAccount = uiPageList.find(el => el.code === type) || uiPageList.find(el => el.code === 'RegisterByEmail')
            next(openAccount.type === 'interior' ? { name: 'Register', params: { type: openAccount.code, step: 1 }, query: to.query } : true)
        })
    },
    components: {
        Top,
        myIframe: iframe
    },
    data () {
        return {
            timer: null,
            loading: true,
            active: ''
        }
    },
    computed: {
        ...mapGetters(['style']),
        iframeUrl () {
            const data = this.$store.state.ix_baseInfo.companyInfo.uiPageList || { openRealAccount: {}, openDemoAccount: {} }
            return {
                openreal: data.openRealAccount.url,
                opendemo: data.openDemoAccount.url
            }
        }
    },
    watch: {
        iframeUrl: {
            deep: true,
            handler () {
                this.changeShowPage(this.active)
            },
        }
    },
    mounted () {
        this.timer = window.setTimeout(() => {
            this.loading = false
        }, 8000)
        this.changeShowPage(this.$route.params.id)
    },
    methods: {
        changeShowPage (type) {
            this.active = type
            if (this.iframeUrl[type]) {
                this.$refs.contentIframe.setIframeUrl(this.iframeUrl[type])
            } else {
                this.$refs.contentIframe.setIframeUrl('about:black')
            }
        },
        hiddenLoading () {
            this.loading = false
        },
        toOpenReal () {
            this.$router.replace({ name: 'OpenAccount', params: { id: 'openreal' } })
        },
        toOpenDemo () {
            this.$router.replace({ name: 'OpenDemoAccount', params: { id: 'opendemo' } })
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.iframeWrapper {
    position: absolute;
    left: 0;
    top: rem(90px);
    right: 0;
    bottom: 0;
    width: 100%;
    min-height: initial;
    overflow-x: hidden;
    overflow-y: auto;
    .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .m-error {
        height: 100%;
    }
    .m-reload {
        padding-top: rem(60px);
        height: 100%;
        text-align: center;
        color: #666;
        font-size: rem(28px);
    }
}
.title {
    width: rem(320px);
    height: rem(60px);
    margin: 0 auto;
    font-size: 0;
    border-radius: rem(10px);
    .item {
        display: inline-block;
        height: 100%;
        width: 50%;
        line-height: rem(60px);
        color: #fff;
        font-size: rem(30px);
        text-align: center;
        &.mainColor {
            background-color: #fff;
        }
    }
}
</style>
