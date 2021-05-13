<template>
    <van-tabbar
        id='navBar'
        v-model='active'
        :active-color='style.mainColor'
        class='m-navBar'
    >
        <van-tabbar-item
            v-for='(item, i) in navList'
            :key='i'
            class='navItem'
            :dot="item.name == 'Mine' ? mineDot : false"
            replace
            @click="_collect('tabbar标签栏_' + item.title, true);navClick(item);"
        >
            <span>{{ item.title }}</span>
            <img
                v-if='item.img'
                slot='icon'
                slot-scope='props'
                class='imgIcon'
                :src='props.active ? item.img : item.img'
            />
            <i v-else-if='item.icon' slot='icon' :class='item.icon'></i>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
// 四个导航时，每个导航最多5个字
// 五个导航时，每个导航最多5个字
import { Tabbar, TabbarItem } from 'vant'
import { mapGetters } from 'vuex'
export default {
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
    },
    data () {
        return {
            active: 0,
            navList: [
                {
                    title: this.$t('router.index'),
                    icon: 'icon_icon_home',
                    name: 'Home',
                    baseUrl: '/home',
                },
                {
                    title: this.$t('router.demohome'),
                    icon: 'icon_icon_home',
                    name: 'demohome',
                    baseUrl: '/demohome',
                },
                {
                    title: this.$t('router.selfSymbol'),
                    icon: 'icon_zixuan',
                    name: 'SelfSymbolIndex',
                    baseUrl: '/selfSymbol',
                },
                {
                    title: this.$t('router.trade'),
                    icon: 'icon_icon_quotes',
                    name: 'TradeIndex',
                    baseUrl: '/trade',
                },
                {
                    title: this.$t('router.position'),
                    icon: 'icon_jiaoyi1',
                    name: 'PositionIndex',
                    baseUrl: '/position',
                },
                {
                    title: this.$t('router.mine'),
                    icon: 'icon_icon_mine',
                    name: 'Mine',
                    baseUrl: '/mine',
                },
            ],
        }
    },
    computed: {
        ...mapGetters(['style', 'companyInfo']),
        mineDot () {
            return this.$store.state.msgData.mineDot
        },
    // routerBaseUrl() {
    //     for (let i = 0; i < this.navList.length; i++) {
    //         if (this.$route.path.indexOf(this.navList[i].baseUrl) >= 0) {
    //             return this.navList[i].baseUrl
    //             break
    //         }
    //     }
    //     return ''
    // }
    },
    watch: {
        'companyInfo' (newval) {
            this.initNav()
        },
        '$route' (newval) {
            for (let i = 0; i < this.navList.length; i++) {
                if (this.$route.path.indexOf(this.navList[i].baseUrl) >= 0) {
                    this.active = i
                    break
                }
            }
        },
    },
    created () {
        this.initNav()
    },
    methods: {
        initNav () {
            const uiPageList =
                this.$store.state.ix_baseInfo.companyInfo.uiPageList || {}
            const navData = uiPageList.Nav || {}
            const menuData = navData.menu
            if (!menuData || menuData.length === 0) return this.setNavIndex()
            const newMenu = menuData.map((el) => {
                el.baseUrl = el.url
                const defaultNav = this.navList.find((o) => o.baseUrl === el.url) || {}
                return Object.assign({}, defaultNav, el, { name: defaultNav.name })
            })
            this.navList = newMenu
            this.setNavIndex()
            // console.log('newMenu', JSON.parse(JSON.stringify(newMenu)))
        },
        setNavIndex () {
            const curPath = this.$route.path.replace(/\/$/, '')
            const curIndex = this.navList.findIndex((el) => el.baseUrl === curPath)
            console.log('curIndex', curIndex)
            if (curIndex > -1) this.active = curIndex
        },
        navClick (item) {
            const experience = this.$route.query.experience
            let paramsStr = ''
            if (experience) {
                paramsStr = 'experience=true'
            }
            paramsStr = (item.baseUrl.includes('?') ? '&' : '?') + paramsStr
            this.$router.replace(item.baseUrl + paramsStr)
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-navBar {
  height: rem(98px);
  ::v-deep {
    .van-tabbar-item {
      color: #cacaca;
      .van-tabbar-item__icon {
        font-size: rem(46px);
      }
      .van-tabbar-item__text {
        font-size: rem(20px);
      }
    }
  }

  .imgIcon {
    filter: grayscale(1);
  }
  .van-tabbar-item--active .imgIcon {
    filter: grayscale(0);
  }
}
</style>
