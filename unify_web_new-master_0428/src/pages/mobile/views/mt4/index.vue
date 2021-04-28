<template>
    <div class='m-mt4Index' :class='{ pc:isPC }'>
        <Top class='mt4Top'>
            <a v-if="isPC && $route.name === 'mt4'" slot='left' href='javascript:void(0);' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
            <a v-if='isAPP' slot='left' href='javascript:void(0);' @click='back'>
                <i class='icon_icon_back'></i>
            </a>
            <span>{{ $t($route.meta.title) }}</span>
            <!-- <van-tabs v-model='activeTab' class='headerTabs' :color='style.mainColor' @click='jump'>
                <van-tab name='MT4Depositfunds' :title="$t('router.MT4deposit')" />
                <van-tab name='MT4WithAmount' :title="$t('router.MT4withdraw')" />
            </van-tabs> -->
        </Top>
        <div v-if="activeTab === 'mt4'" class='content'>
            <!-- 入金 -->
            <router-link class='link' tag='div' :to="{ name: 'MT4Depositfunds' }">
                <span class='icon iconfont'>
                    &#xe676;
                </span>
                <span class='label'>
                    {{ $t('router.MT4deposit') }}
                </span>
                <div class='more'>
                    <span class='icon iconfont'>
                        &#xe63a;
                    </span>
                </div>
            </router-link>

            <!-- 出金 -->
            <router-link class='link' tag='div' :to="{ name: 'MT4WithAmount' }">
                <span class='icon iconfont'>
                    &#xe677;
                </span>
                <span class='label'>
                    {{ $t('router.MT4withdraw') }}
                </span>
                <div class='more'>
                    <span class='icon iconfont'>
                        &#xe63a;
                    </span>
                </div>
            </router-link>
        </div>
        <router-view />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Top from '@m/layout/top'
// import { Tab, Tabs } from 'vant'
import { appClose, isAPP } from '@m/base/appHybrid'
import { boolMt4Account } from '@/api/user/accountApi'
import pcMixin from '@m/mixins/pc'

export default {
    name: 'MT4Index',
    components: {
        Top
    },
    mixins: [pcMixin],
    data () {
        return {
            activeTab: this.$route.name
        }
    },
    computed: {
        ...mapGetters(['style']),
        isAPP () {
            return isAPP
        }
    },
    watch: {
        '$route.name' (val) {
            console.log(val)
            this.activeTab = val
        }
    },
    mounted () {
        if (isAPP) {
            this.APPboolMt4Account()
        } else if (this.$store.state.ix_user.info.toKenCompanyInfoVo.openMt4Account === false) {
            this.pageClose()
        };
    },
    methods: {
        goBackHome () {
            this.$router.replace({ name: 'Layout' })
        },
        back () {
            if (isAPP) {
                appClose()
            } else {
                this.$router.back()
                // this.$router.push({ name: 'Mine' })
            }
        },
        jump (val) {
            if (this.$route.name != val) {
                this.$router.push({ name: val })
            }
        },
        // app内判断账户是否为MT4账户
        APPboolMt4Account () {
            boolMt4Account().then(res => {
                // code 为 1 data为true就是 mt4账号
                if (!(res.code === 1 && res.data === true)) {
                    this.pageClose()
                }
            }).catch(err => {
                console.log(err)
                this.pageClose()
            })
        },
        pageClose () {
            this.$alert('您当前无MT4交易账户，无法进入MT4出入金。').then(() => {
                isAPP ? appClose() : this.$router.back()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-mt4Index {
    padding-top: rem(90px);
    .headerTabs {
        ::v-deep {
            .van-tab {
                padding: 0 rem(30px);
                font-size: rem(30px);
                font-weight: normal;
            }
            .van-tabs__wrap {
                &::after {
                    display: none;
                }
            }
        }
    }
    &.pc{
        padding-top: 48px;
        .topNav{
            position: fixed !important;
            top: 60px;
            width: 400px;
            right: 60px;
            left: initial;
        }
    }
}
.mt4Top {
    ::v-deep .main {
        max-width: 80%;
    }
}
.content{
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding: 0 rem(20px);
    .link{
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        width: 100%;
        height: rem(100px);
        text-align: left;
        box-sizing: border-box;
        margin-top: rem(20px);
        padding:0 rem(20px) 0 rem(40px);
        background: #fff;
        border-radius: rem(10px);
        cursor: pointer;
        .label{
            font-size: rem(28px);
            font-weight: 500;
            color: #333333;
            padding-left: rem(30px);
        }
        .more{
            flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-end;
        }
    }
}

</style>
