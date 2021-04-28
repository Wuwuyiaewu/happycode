<template>
    <div class='m-position'>
        <Top v-if='$route.meta.pageFull'>
            <div v-if='!accountInfo.accountType' slot='left'></div>
            <div>{{ $t($route.meta.title) }}</div>
            <!-- <div slot="right"></div> -->
        </Top>
        <template v-if='userLoginInfo.account_id'>
            <div class='m-subTab'>
                <Tab
                    v-model='subTabActive'
                    background='none'
                    :color='$store.state.ix_baseInfo.style.mainColor'
                    :list='subTabList'
                    title-active-color='#fff'
                    type='card'
                    @tabClick='tabClick'
                />
            </div>
            <template v-if='subTabActive===0 && addInfo'>
                <component :is="'ad'" v-for='ad in addInfo.top' :key='ad.id' :data='ad' />
            </template>
            <component :is='showListType' />
            <template v-if='subTabActive===0 && addInfo'>
                <component :is="'ad'" v-for='ad in addInfo.bottom' :key='ad.id' :data='ad' />
            </template>
        </template>
        <div v-else class='m-empty'>
            <template v-if='subTabActive===0 && addInfo'>
                <component :is="'ad'" v-for='ad in addInfo.top' :key='ad.id' :data='ad' />
            </template>
            <ListEmpty :txt="$t('trade.positionNotLogin')" />
            <template v-if='subTabActive===0 && addInfo'>
                <component :is="'ad'" v-for='ad in addInfo.bottom' :key='ad.id' :data='ad' />
            </template>
            <div class='links'>
                <router-link
                    class='blockBtn mainColorBg'
                    :to="{ name:'Login' }"
                    @click.native="_collect('登录/注册')"
                >
                    {{ $t('login') }}/{{ $t('register') }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Tab from '@m/modules/tab'
import PositionListA from './PositionListA'
import PositionListB from './PositionListB'
import PositionListC from './PositionListC'
import ListEmpty from '@m/components/ListEmpty'
import Top from '@m/layout/top'
import { localGet } from '@/utils/index'

export default {
    name: 'PositionList',
    components: {
        Tab,
        PositionListA,
        PositionListB,
        PositionListC,
        ListEmpty,
        Top
    },
    data () {
        return {
            subTabList: [
                { title: this.$t('router.positionList'), value: 'PositionListA' },
                { title: this.$t('router.pending'), value: 'PositionListB' },
                { title: this.$t('router.closed'), value: 'PositionListC' }
            ],
            subTabActive: parseInt(this.$route.query.tab) || 0,
            dataList: [],
        }
    },
    computed: {
        showListType () {
            return this.subTabList[this.subTabActive].value
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo || {}
        },
        addInfo () {
            return this.$store.state.ix_baseInfo.companyInfo.uiPageList ? this.$store.state.ix_baseInfo.companyInfo.uiPageList.Position : { top: [], bottom: [] }
        },
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
    },
    beforeDestroy () {
        delete this.$options.sockets.onmessage
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        const query = this.$route.query
        if (query.tab) {
            this.subTabActive = parseInt(query.tab)
        }
    },
    methods: {
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code, code } = JSON.parse(evt.data)
            if (code === '0000' && msg_code.toLowerCase() === 'UserLoginInfoRet'.toLowerCase()) {
                this.subTabActive = 0
            }
        },
        tabClick (item, index) {
            this.$router.push({ name: 'PositionIndex', query: { tab: index } })
            this._collect(item.title)
        }
    }
}
</script>

<style lang="scss">
@import "./style";
</style>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-position {
    height: 100%;
    overflow: auto;
    padding-top: rem(90px);
    padding-bottom: rem(98px);
    @include scroll();
}
.m-empty {
    position: relative;
    background-color: #f8f8f8;
    .links {
        padding: 0 rem(40px);
        .blockBtn {
            margin-top: rem(55px);
            display: block;
            width: 100%;
            height: rem(80px);
            line-height: rem(80px);
            border-radius: rem(40px);
            text-align: center;
            color: #fff;
            font-size: rem(34px);
            @include active();
        }
    }
}
</style>
