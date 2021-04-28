<template>
    <div class='intlMobile-wrap'>
        <van-cell arrow-direction='down' is-link :title='title' title-class='title' @click='show = true' />
        <van-action-sheet
            v-model='show'
            :actions='actions'
            :cancel-text='$t("compLang.cancel")'
            close-on-click-action
            @closed='onClosed'
            @open='onOpen'
            @select='onSelect'
        />
    </div>
</template>

<script>
import { ActionSheet } from 'vant'
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'IntlMobile',
    components: {
        [ActionSheet.name]: ActionSheet
    },
    data () {
        return {
            show: false,
            title: '',
        }
    },
    computed: {
        ...mapState(['mobilePhonePrefix']),
        actions () {
            return this.countryCodes.map(e => ({
                ...e,
                name: `${e.label}(+${e.code})`
            }))
        },

        uiPageList () {
            const companyInfo = this.$store.getters.companyInfo || {}
            return companyInfo.uiPageList
        },
        country () {
            const { uiPageList } = this
            return uiPageList?.country
        },
        // 区号列表
        countryCodes () {
            const { uiModules = [] } = this.country || {}
            const langMap = {
                'zh-CN': 'title',
                'en-US': 'name',
            }
            return uiModules.map(e => {
                const name = e[langMap[this.language]]
                return {
                    label: name,
                    code: e.img,
                }
            })
        },
        language () {
            return this.$store.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        },
    },
    mounted () {
        if (this.countryCodes.length) {
            const currentItem = this.countryCodes.find(e => e.code === this.mobilePhonePrefix)
            if (currentItem) {
                this.onSelect(currentItem)
            } else {
                this.onSelect(this.countryCodes[0])
            }
        }
    },
    methods: {
        ...mapMutations(['UPDATE_mobilePhonePrefix']),
        onSelect (item) {
            const { code } = item
            this.title = `+${code}`
            this.$emit('change', code)
            this.mobilePhonePrefix !== code && this.UPDATE_mobilePhonePrefix(code)
        },
        onOpen () {
            this.$emit('open')
        },
        onClosed () {
            this.$emit('closed')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.intlMobile-wrap {
    .van-cell{
        padding-left: rem(10px);
        text-align: center;
        .title{
            min-width: rem(70px);
            max-width: rem(170px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333333;
            font-size: rem(28px);
        }
        &:after{
            display: none;
        }
    }

    ::v-deep .van-action-sheet{
        max-height: 50%;
    }
}
</style>
