<template>
    <div class='m-tags' :class='{ pc:isPC }'>
        <Top :title='showData.name'>
            <div slot='right'></div>
        </Top>
        <SymbolList class='groupList' :data='showData' :tab-title='showData.name' />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import SymbolList from '@m/modules/productList/SymbolList'
import pcMixin from '@m/mixins/pc'
// import ProductItem from '@m/modules/productList/productItem'
export default {
    name: 'Tag',
    components: {
        Top,
        SymbolList,
        // ProductItem
    },
    mixins: [pcMixin],
    computed: {
        showData () {
            if (this.$route.query.tagid && this.$route.query.mid) {
                let _data = {
                    code_ids: [],
                    tagDiplay: 3,
                    id: this.$route.query.mid,
                    name: '传入参数有误'
                }
                const categoryArr = this.$store.state.ix_quote.product_category.filter(item => (item.id == this.$route.query.mid))
                if (categoryArr[0]) {
                    const tags = categoryArr[0].tagsList.filter(item => (item.id == this.$route.query.tagid))
                    if (tags[0]) {
                        _data = {
                            name: tags[0].name,
                            id: this.$route.query.mid,
                            code_ids: tags[0].code_ids,
                            tagDiplay: 3
                        }
                    }
                }
                return _data
            } else {
                console.error('请传入tagid，mid')
                return {
                    tagDiplay: 3,
                    id: this.$route.query.mid,
                    code_ids: [],
                    name: '传入参数有误'
                }
            }
        },
    },
    watch: {
        '$store.state.ix_quote.product_activatedId' (val) {
            if (this.isPC && this.$route.name === 'Tag') {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-tags {
    height: 100%;
    &.pc{
        .groupList{
            padding-top: 0;
        }
    }
}
.groupList {
    padding-top: rem(90px);
}
</style>
