<template>
    <van-notice-bar
        background='#FFF0E2'
        class='itemNotice'
        left-icon='info-o'
        mode='closeable'
        :scrollable='false'
        @close='close'
    >
        <span>{{ txt }}</span>
        <a
            v-if="accountInfo.accountType === 'real'"
            class='mainColor'
            href='javascript:;'
            @click='toDeposit'
        >
            {{ $t('trade.clickDeposit') }}
        </a>
    </van-notice-bar>
</template>

<script>
export default {
    name: 'ErrorTips',
    props: {
        type: {
            type: String,
            default: ''
        },
        from: {
            type: String,
            default: 'Other'
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        txt () {
            if (this.from === 'position') {
                if (this.type === 'less') {
                    return this.$t('positionWarn.itemLess')
                } else if (this.type === 'stopout') {
                    return this.$t('positionWarn.itemStopout')
                } else {
                    return ''
                }
            } else {
                if (this.type === 'less') {
                    return this.$t('positionWarn.accountLess')
                } else if (this.type === 'stopout') {
                    return this.$t('positionWarn.accountStopout')
                } else {
                    return ''
                }
            }
        }
    },
    methods: {
        close () {
            this.$emit('close', true)
        },
        toDeposit () {
            this.$router.push({ name: 'DepositFunds' })
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.itemNotice {
    height: rem(50px);
    color: #e3525c;
    font-size: rem(24px);
    ::v-deep {
        .van-tag {
            position: relative;
            top: -2px;
            padding: rem(4px) rem(6px);
            line-height: 1;
            font-size: rem(20px);
            &--danger {
                position: relative;
                margin-left: rem(20px);
                background-color: $red;
                &:after {
                    position: absolute;
                    right: 99%;
                    top: 50%;
                    margin-top: rem(-4px);
                    content: "";
                    @include triangle(left, rem(4px), rem(8px), $red);
                }
            }
        }
    }
}
</style>
