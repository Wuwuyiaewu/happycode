<!--
被嵌套页面必须在body，html标签设置宽度为具体的像素值，不然在iOS上可能会出现排版错乱
-->
<template>
    <div class='iframeWrapper'>
        <Top v-if='!$route.query.hidehead' class='test' :title='pagetitle' @back='back'>
            <a v-if='isPC' slot='left' href='javascript:void(0);' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
            <div slot='right'>
                <van-loading v-if='loading' :color='style.mainColor' size='20px' />
            </div>
        </Top>
        <my-iframe
            ref='contentIframe'
            :class="{ 'hasheader': !$route.query.hidehead }"
            page-url='about:blank'
            @onerror='pageOnLoad'
            @onload='pageOnLoad'
        />
        <div v-if='!iframeUrl' class='m-error'>
            <ListEmpty v-if='errorType === 1' txt='您访问的页面不存在！' />
            <div v-else-if='errorType === 2' class='m-reload' @click='getShowPageUrl'>
                <div>页面加载失败,点击重试！</div>
            </div>
        </div>
    </div>
</template>

<!--
openreal 开真实户
opendemo 开模拟户
forgetpwd 忘记密码

-->
<script>
import * as getUrl from '@/api/getUrl'
import ListEmpty from '@m/components/ListEmpty'
import { mapGetters } from 'vuex'
import Top from '@m/layout/top'
import iframe from '@m/components/iframe'
import { localSet, localGet, localRemove } from '@/utils'
import pcMixin from '@m/mixins/pc'
export default {
    components: {
        Top,
        ListEmpty,
        myIframe: iframe
    },
    mixins: [pcMixin],
    data () {
        return {
            iframeUrl: '',
            pagetitle: this.$t('compLang.loading'),
            timer: null,
            loading: false,
            // isAddSecond: false,
            errorType: 0, // 1、没有拿到访问页面标识 2、从服务端获取访问url失败
            loginShowPageList: [
                {
                    title: this.$t('trade.deposit'), // 入金
                    id: 'deposit'
                },
                {
                    title: this.$t('trade.drawings'), // 出金
                    id: 'drawings'
                },
                {
                    title: this.$t('router.userinfo'), // 个人信息
                    id: 'userinfo'
                }
            ],
            historyLength: -1,
            pageRefresh: false
        }
    },
    created () {
        this.historyLength = window.history.length
    },
    mounted () {
        this.getShowPageUrl()
            .then(res => {
                this.loading = true
                this.timer = window.setTimeout(() => {
                    this.loading = false
                }, 8000)
            })
        this.$bus.$on('USER_AUTO_LOGIN_END', () => {
            if (this.$route.params.id != 'queryinfo') {
                this.getShowPageUrl()
            }
        })
    },
    computed: {
        ...mapGetters(['style'])
    },
    beforeDestroy () {
        if (document.documentElement.dataset.deviceType !== 'iphone') {
            localRemove('iframeUrl')
        }

        if (this.timer) {
            window.clearTimeout(this.timer)
        }
    },
    methods: {
        back () {
            if (this.pageRefresh && this.$route.params.id != 'queryinfo') {
                localRemove('iframeUrl')
                this.pageRefresh = false
                this.$router.push({ name: 'Mine' })
            } else {
                this.$router.go(this.historyLength - window.history.length - 1)
            }
        },
        getShowPageUrl () {
            return new Promise((resolve, reject) => {
                let id = this.$route.params.id
                if (this.$route.params.id) {
                    id = this.$route.params.id.toString().toLowerCase()
                }
                if (id === 'queryinfo') {
                    this.pagetitle = this.$route.query.title
                    this.iframeUrl = this.$route.query.url
                    this.$refs.contentIframe.setIframeUrl(this.iframeUrl)
                    return resolve()
                } else if (id === 'service') {
                    this.pagetitle = this.$t('onlineService')
                    this.iframeUrl = this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo ? this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.onlineService : ''
                    this.$refs.contentIframe.setIframeUrl(this.iframeUrl)
                    return resolve()
                } else {
                    const _localData = this.loginShowPageList.filter(item => (item.id == id))[0]
                    if (_localData && getUrl[_localData.id]) {
                        if (this.$store.state.ix_baseInfo.companyInfo && this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo) {
                            getUrl[_localData.id]()
                                .then(res => {
                                    if (res.data && res.data.url) {
                                        // this.isAddSecond = true
                                        if (localGet('iframeUrl') && localGet('iframeUrl').length > 5) {
                                            this.pageRefresh = true
                                        } else {
                                            // 从中间层第一次进入入金时，清空缓存，避免入金结果查询弹层
                                            _localData.id === 'deposit' && sessionStorage.removeItem('depositTick')
                                        }
                                        this.pagetitle = _localData.title
                                        this.iframeUrl = res.data.url
                                        this.$refs.contentIframe.setIframeUrl(this.iframeUrl)
                                        localSet('iframeUrl', res.data.url)
                                        return resolve()
                                    } else {
                                        this.$toast({ duration: 2000, message: this.$t('getSettingError') })
                                        return reject()
                                    }
                                })
                                .catch(error => {
                                    this.errorType = 1
                                    this.pagetitle = '404'
                                    return reject()
                                })
                        } else {
                            return reject()
                        }
                    }
                }
                if (!id || !getUrl[id]) {
                    this.errorType = 1
                    this.pagetitle = '404'
                    return reject()
                }
            })
        },
        pageOnLoad () {
            if (this.timer) {
                window.clearTimeout(this.timer)
            }
            this.loading = false
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.iframeWrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    min-height: initial;
    overflow-x: hidden;
    overflow-y: auto;
    top: 0;
    @include scroll();
    .hasheader {
        padding-top: rem(90px);
    }
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
</style>
