<template>
    <div class='m-accountChange'>
        <div
            v-if='accountInfo.accountType'
            ref='activeBtn'
            class='btn'
            :class="{ 'downIcon':showList.length>0 }"
            @click='_collect(accountTypeText);showMemu()'
        >
            {{ accountTypeText }}
        </div>
        <div v-else ref='activeBtn' class='btnEmpty' @click="_collect('游客');showMemu()">
            {{ $t('pleaselogin') }}
        </div>
        <van-popup v-model='show' class='m-accountMenu' get-container='body' :overlay='false' @click='show=false'>
            <div class='menus' :style="{ top:btnPosition.y+'px',left:btnPosition.x+'px' }">
                <div
                    v-for='item in showList'
                    :key='item.type'
                    v-prophet="['trackEvent', '我的', '我的页面', '我的页面_切换账号', 36]"
                    class='item'
                    @click.stop='_collect(item.txt);changeAccountType(item.type)'
                >
                    {{ item.txt }}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { openDemoByReal } from '@/api/base'
import { getElementPagePosition } from '@/utils/index'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'AccountChange',
    data () {
        return {
            show: false,
            loading: null,
            btnPosition: {
                x: 0,
                y: 0
            },
            toast: null
        }
    },
    computed: {
        ...mapGetters(['isExperience', 'activateTime']),
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        accountTypeText () {
            if (this.accountInfo) {
                return this.accountInfo.accountType === 'real' ? this.$t('trade.real') : this.demoText
            } else {
                return ''
            }
        },
        accInfo () {
            return this.$store.state.accInfo
        },
        demoText () {
            return this.$t(this.accInfo.maxAmount > 0 ? 'trade.experi' : 'trade.demo')
        },
        showList () {
            const _arr = []
            if (this.accountInfo.accountType === 'real') {
                if (this.accountInfo.accountDemoNo) {
                    _arr.push({
                        type: 'demo',
                        txt: this.demoText,
                        accountNo: this.accountInfo.accountDemoNo
                    })
                } else if (this.accountInfo.uuid) {
                    _arr.push({
                        type: 'openDemo',
                        txt: this.$t('trade.openDemo'),
                        accountNo: ''
                    })
                }
            } else if (this.isExperience) {
                if (this.activateTime) { // 体验账号需要激活后才能切换真实账号
                    _arr.push({
                        type: 'real',
                        txt: this.$t('trade.real'),
                        accountNo: this.accountInfo.accountNo
                    })
                }
            } else if (this.accountInfo.accountType === 'demo') {
                if (this.accountInfo.accountNo) {
                    _arr.push({
                        type: 'real',
                        txt: this.$t('trade.real'),
                        accountNo: this.accountInfo.accountNo
                    })
                }
            }
            return _arr
        }
    },
    methods: {
        ...mapMutations({
            updateDemoNo: 'ix_user/UPDATE_DEMONO'
        }),
        showMemu () {
            // debugger
            if (this.showList.length <= 0) {
                if (!this.accountInfo.accountNo && !this.accountInfo.accountDemoNo) {
                    this.$router.push({ name: 'Login' })
                }
                return
            }
            const position = getElementPagePosition(this.$refs.activeBtn)
            this.btnPosition = {
                x: position.x - 6,
                y: position.y + this.$refs.activeBtn.offsetHeight + 10
            }
            this.show = true
        },
        changeAccountType (type) {
            const pageAds = this.$store.state.ix_baseInfo.companyInfo.uiPageList || {}
            console.log(pageAds.completeInfo && pageAds.completeInfo.url)
            this.show = false
            if (type === 'openReal') {
                const pageAds = this.$store.state.ix_baseInfo.companyInfo.uiPageList || {}
                if (!pageAds.completeInfo) {
                    return this.$toast('系统出了点小问题，请联系在线客服！')
                }
                const completeInfo = pageAds.completeInfo || {}
                const subPage = { name: 'Nest', params: { id: 'queryinfo' }, query: { url: completeInfo.url, title: this.$t('router.addData') } }
                const subPageInterior = { name: 'completeInfo' }
                this.$router.push(completeInfo.type === 'interior' ? subPageInterior : subPage)
            } else if (type === 'openDemo') {
                if (this.accountInfo.uuid) {
                    this.loading = this.$toast.loading({
                        message: this.$t('trade.openDemoing'),
                        forbidClick: true,
                        loadingType: 'spinner',
                        duration: 0
                    })
                    openDemoByReal({ uuid: this.accountInfo.uuid })
                        .then(res => {
                            this.loading.clear()
                            if (res.code != 1) {
                                this.$router.push({ name: 'OpenAccount', params: { id: 'opendemo' } })
                                return
                            }
                            this.updateDemoNo({
                                demoNo: res.msg
                            })
                            this.$ws.send_switchAccount()
                        })
                        .catch(error => {
                            console.log(error)
                            this.loading.clear()
                        })
                } else {
                    this.$router.push({ name: 'OpenAccount', params: { id: 'opendemo' } })
                }
            } else {
                this.$ws.send_switchAccount()
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.m-accountChange {
    position: relative;
    display: inline-block;
    font-size: rem(24px);
    color: #333333;
    .btn {
        position: relative;
        display: inline-block;
        padding: 0 rem(20px);
        height: rem(48px);
        line-height: rem(48px);
        border-radius: rem(24px);
        background: #f9f9f9;
        &.downIcon {
            padding-right: rem(40px);
            &::after {
            content: "";
                position: absolute;
                top: 50%;
                margin-top: rem(-4px);
                right: rem(20px);
                width: 0;
                height: 0;
                border-style: solid;
                border-width: rem(6px) rem(6px) 0 rem(6px);
                border-color: #000000 transparent transparent transparent;
            }
        }
    }
    .btnEmpty {
        position: relative;
        display: inline-block;
        font-size: rem(24px);
        color: #333333;
        padding-left: rem(20px);
    }
}
</style>

<style lang="scss">
@import "~@m/sass/mixin.scss";
.m-accountMenu {
    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    .menus {
        position: absolute;
        z-index: 99999;
        background-color: #fff;
        border-radius: rem(10px);
        .item {
            text-align: center;
            font-size: rem(28px);
            padding: rem(28px) rem(28px);
            line-height: rem(35px);
            border-bottom: solid 1px #efefef;
            &:last-child {
                border-bottom: none;
            }
        }
        &::after {
            content: "";
            position: absolute;
            top: rem(-10px);
            right: 50%;
            margin-left: rem(-5px);
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 rem(10px) rem(10px) rem(10px);
            border-color: transparent transparent #fff transparent;
            transform: translateX(rem(5px));
        }
    }
}
</style>
