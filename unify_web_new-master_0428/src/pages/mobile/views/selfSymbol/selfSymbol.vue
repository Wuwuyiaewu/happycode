<template>
    <div class='selfSymbol'>
        <Top v-if='$route.meta.pageFull'>
            <div slot='left' class='title'>
                {{ $t($route.meta.title) }}
            </div>
            <div></div>
            <router-link slot='right' class='searchIcon' tag='div' :to="{ name:'Search' }">
                <i class='icon_sousuo'></i>
            </router-link>
        </Top>
        <Optional :data='{ list:optinalList }' />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import Optional from '@m/modules/optional/optional'
import { mapState } from 'vuex'
export default {
    name: 'SelfSymbolIndex',
    components: {
        Optional,
        Top
    },
    computed: {
        ...mapState({
            positionList: state => state.ix_user.postionList,
            product_map: state => state.ix_quote.product_map,
            selfSymbolList: state => state.selfSymbolList,
        }),
        optinalList () { // 自选产品列表
            const defaultList = this.selfSymbolList.slice()
            if (defaultList.length === 0) return []

            const newList = []
            defaultList.forEach(el => {
                const item = this.product_map[String(el.symbolId)]
                if (!item) return false
                const inPosition = this.positionList.find(position => {
                    return parseInt(position.symbol) === parseInt(el.symbolId) || position.symbol === item.groupSymbol.name
                })
                el.inPosition = inPosition
                const newItem = Object.assign({}, item, { selfSymbol: el })
                if (item) newList.push(newItem)
            })
            return newList
        },
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.selfSymbol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding: rem(90px) 0 rem(98px) 0;
}
.title {
    font-size: rem(40px);
    font-weight: 700;
    color: rgba(51, 51, 51, 1);
}
.searchIcon {
    font-size: rem(35px);
}
</style>
