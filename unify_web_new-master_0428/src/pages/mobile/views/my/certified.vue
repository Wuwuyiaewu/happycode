<template>
    <div :class="$store.state.inApp?'':'certified'">
        <div v-if='!$store.state.inApp && !isPC' class='header'>
            <router-link class='left' :to="{ name: 'Mine' }">
                <i class='icon_icon_back'></i>
            </router-link>
            <div class='main'>
                <slot>{{ $t($route.meta.title) }}</slot>
            </div>
        </div>
        <van-cell-group>
            <van-cell
                :is-link="userInfo.id_document_status !=='2'"
                :title="$t('form.title.idDocumentFiles')"
                @click='idCardHandle'
            >
                <div class='right'>
                    <span>{{ status }}</span>
                    <i v-if='idStatus' slot='right' class='rightIcon van-icon' :class='idStatus'></i>
                </div>
            </van-cell>
            <van-cell
                is-link
                :title="$t('form.title.myBanks')"
                @click="$router.push({ name:'BankList', query: $route.query })"
            />
        </van-cell-group>
    </div>
</template>

<script>
import { isAPP, appClose } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'Certified',
    mixins: [pcMixin],
    data () {
        return {
            code: ''
        }
    },
    computed: {
        idStatus () {
            const code = parseInt(this.userInfo.id_document_status)
            if (code < 1) {
                return 'van-icon-warning'
            }
            if (code === 1) {
                return 'van-icon-underway'
            }
            if (code > 1) {
                return 'van-icon-checked'
            }
            return ''
        },
        userInfo () {
            return this.$store.state.funds.userInfo
        },
        status () {
            const code = this.userInfo.id_document_status
            return this.$t(`enumeration.idCartStatus.${code}`)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const userStatus = vm.$store.state.userStatus
            if (from.name == 'Authentication') {
                if (userStatus.infoApprovalStatus <= 0) {
                    isAPP ? appClose() : history.go(-1)
                    next()
                } else {
                    next()
                }
            } else if (userStatus.infoApprovalStatus === -1) {
                vm.$store.dispatch('getUserStatus').then(res => {
                    if (res && res.data && res.data.infoApprovalStatus <= 0) {
                        next({ name: 'Authentication' })
                    } else {
                        next()
                    }
                }).catch(() => {
                    next()
                })
            } else {
                if (userStatus.infoApprovalStatus <= 0) {
                    next({ name: 'Authentication' })
                } else {
                    next()
                }
            }
        })
    },
    created () {
        this.code = this.userInfo.id_document_status
    },
    methods: {
        idCardHandle () {
            // if (this.userInfo.id_document_status === '1') {
            //   this.$toast.info('文件在审核中,请耐心等待!!!')
            //   return
            // }
            // debugger
            if (['0', '1', '2'].includes(this.userInfo.id_document_status)) {
                return
            }
            this.$router.push({ name: 'Authentication', query: this.$route.query })
        }
    }
}
</script>

<style scoped lang="scss">
@import "@m/sass/mixin.scss";
.certified {
    padding-top: rem(90px);
    .header {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: rem(90px);
        display: flex;
        align-items: center;
        font-size: rem(34px);
        color: #333333;
        background: #fff;
        .left {
            position: absolute;
            height: 100%;
            line-height: rem(90px);
            padding: 0 rem(30px);
            left: 0;
            bottom: 0;
        }
        .main {
            text-align: center;
            max-width: 60%;
            margin: 0 auto;
        }
    }
    .van-cell {
        padding: rem(30px) rem(30px);
        &:after {
            left: 0;
        }
    }
    .right {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .rightIcon {
        position: relative;
        font-size: rem(40px);
        margin-left: rem(10px);
        &.van-icon-warning {
            color: #ef5762;
        }
        &.van-icon-checked {
            color: #0caf82;
        }
        &.van-icon-underway {
            color: #f39800;
        }
    }
}
</style>
