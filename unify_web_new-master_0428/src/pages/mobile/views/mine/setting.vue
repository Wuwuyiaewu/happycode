<template>
    <div class='m-setting'>
        <Top>
            <a v-if='isPC' slot='left' href='javascript:void(0);' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
            <div slot='right'></div>
        </Top>
        <div class='main'>
            <div class='layout-1'>
                <van-cell
                    v-if="!isExperience && accountInfo.accountType === 'demo' || accountInfo.accountType === 'real'"
                    v-prophet="['trackEvent', '我的', '设置', '设置_登录密码', 40]"
                    is-link
                    :title="$t('setting.updatePwd')"
                    :to="{ name:'ResetPwd' }"
                />
                <van-cell
                    v-prophet="['trackEvent', '我的', '设置', '设置_涨跌颜色', 41]"
                    is-link
                    :title="$t('router.tradeColor')"
                    :value="$t('setting.orColor'+ userConfigInfo.type)"
                    @click='orColorSetting.show = true'
                >
                    <!-- <img slot="icon" class="icon_icon" :src="item.img" /> -->
                </van-cell>
                <van-cell
                    v-if='langList.length==2'
                    v-prophet="['trackEvent', '我的', '设置', '设置_语言', 42]"
                    :title="$t('router.language')"
                >
                    <changeLang />
                </van-cell>
            </div>
            <div
                v-if="!isExperience && accountInfo.accountType === 'demo' || accountInfo.accountType === 'real'"
                class='layout-2'
                @click='showLoginOut = true'
            >
                {{ $t('loginout') }}
            </div>
        </div>
        <van-popup v-model='showLoginOut' class='m-loginOut' get-container='body' overlay-class='loginout-mask' position='bottom'>
            <div class='layout-1'>
                <div class='item out' @click='logout'>
                    {{ $t('loginout') }}
                </div>
                <div class='item' @click='showLoginOut = false'>
                    {{ $t('compLang.cancel') }}
                </div>
            </div>
        </van-popup>
        <van-popup v-model='orColorSetting.show' get-container='body' position='bottom'>
            <div class='m-setingOrColor m-dialog'>
                <div class='dialog-header'>
                    <div class='title'>
                        {{ $t('setting.orColor') }}
                    </div>
                </div>
                <div class='dialog-body'>
                    <div class='list'>
                        <div
                            v-for='item in orColorSetting.list'
                            :key='item.value'
                            class='item'
                            :class='{ active:item.value == userConfigInfo.type }'
                            @click='changeOrColor(item)'
                        >
                            {{ $t('setting.orColor'+item.text) }}
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Top from '@m/layout/top'
import { removeLoginData, localSet } from '@/utils/index'

import { setData } from '@/api/userConfiInfo'
import { setORColor } from '@/config'
import pcMixin from '@m/mixins/pc'
import changeLang from '@m/components/changeLang'
export default {
    name: 'Setting',
    components: {
        Top,
        changeLang
    },
    mixins: [pcMixin],
    data () {
        return {
            showLoginOut: false,
            orColorSetting: {
                show: false,
                list: [
                    {
                        text: '2',
                        value: '2'
                    },
                    {
                        text: '1',
                        value: '1'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['isExperience']),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        userConfigInfo () {
            return this.$store.state.userConfigInfo
        },
        langList () {
            return JSON.parse(localStorage['langList'] || '[]')
        },
    },
    methods: {
        ...mapMutations({
            loginReload: 'UPDATE_loginReload'
        }),
        logout () {
            this.showLoginOut = false
            this.$mSocket
                .send('logout', {
                    company_id: this.$store.state.ix_user.userLoginInfo.company_id,
                    account_id: this.$store.state.ix_user.userLoginInfo.account_id,
                    account_no: this.$store.state.ix_user.userLoginInfo.account_no
                })
                .then(() => {
                    removeLoginData()
                    this.$toast({
                        duration: 1000,
                        message: `${this.$t('loginout')}${this.language == 'en-US' ? ' ' : ''}${this.$t('success')}!`,
                        onClose: () => {
                            this.loginReload(true)
                            this.$router.replace({ name: 'Login' })
                        }
                    })
                })
                .catch(() => {
                    removeLoginData()
                    this.$toast({
                        duration: 1000,
                        message: `${this.$t('loginout')}${this.language == 'en-US' ? ' ' : ''}${this.$t('success')}!`,
                        onClose: () => {
                            this.loginReload(true)
                            this.$router.replace({ name: 'Login' })
                        }
                    })
                })
        },
        changeOrColor (item) {
            if (item.value == this.userConfigInfo.type) {
                return
            }
            const loading = this.$loading({ mask: true, duration: 0 })
            this.orColorSetting.show = false
            if (this.accountInfo && this.accountInfo.accountType) {
                setData({
                    type: parseInt(item.value)
                })
                    .then(res => {
                        if (res.code != 1) {
                            this.$toast(res.errMsg || res.msg || res.message)
                            loading.clear()
                            return
                        }
                        setORColor(this.$store.commit, item.value)
                        this.$toast(this.$t('setting.settingSuccess'))
                        loading.clear()
                    })
                    .catch(error => {
                        loading.clear()
                        console.log(error)
                    })
            } else {
                localSet('orColorSetting', item.value)
                setORColor(this.$store.commit, item.value)
                this.$toast(this.$t('setting.settingSuccess'))
                loading.clear()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~@m/sass/mixin.scss';
    .m-setting {
        .main {
            padding-top: rem(90px);
        }
        .layout-1 {
            margin-top: rem(20px);
            ::v-deep {
                .van-cell {
                    padding: rem(20px) rem(30px);
                    &::after {
                        left: 0;
                    }
                    .icon_icon {
                        color: #477fd3;
                        font-size: rem(40px);
                    }
                    .van-cell__title {
                        font-size: rem(28px);
                        color: #333333;
                        margin-left: rem(28px);
                    }
                    .van-cell__value {
                        font-size: rem(24px);
                        color: #999;
                    }
                    .van-cell__right-icon {
                        margin-left: rem(20px);
                        color: #c4c4c4;
                        font-size: rem(16px);
                    }
                }
            }
            .languageDiv{
                border:none;
            }
        }
        .layout-2 {
            margin: rem(60px) 0 rem(140px);
            height: rem(100px);
            line-height: rem(100px);
            text-align: center;
            color: #e3525c;
            font-size: rem(34px);
            background-color: #fff;
            cursor: pointer;
        }
    }
    .m-loginOut {
        background-color: transparent;
        .layout-1 {
            margin: 0 rem(20px);
            .item {
                height: rem(100px);
                line-height: rem(100px);
                text-align: center;
                font-size: rem(34px);
                background-color: #fff;
                margin-bottom: rem(20px);
                border-radius: rem(10px);
                cursor: pointer;
                &.out {
                    color: #e3525c;
                    cursor: pointer;
                }
                &.cancel {
                    cursor: pointer;
                }
            }
        }
    }
    .m-setingOrColor {
        .list {
            text-align: center;
            padding-bottom: rem(30px);
            .item {
                padding: rem(20px) 0;
                color: #333333;
                font-size: rem(28px);
                border-top: solid 1px #ebedf0;
                &.active {
                    color: #477fd3;
                }
            }
        }
    }
</style>
