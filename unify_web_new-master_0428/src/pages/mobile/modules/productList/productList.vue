<template>
    <SymbolList :data='data' :tab-title='tabTitle'>
        <template v-if='activeTab===index' name='top'>
            <component :is="'ad'" v-for='ad in addInfo.top' :key='ad.id' :data='ad' />
        </template>
        <template v-if='activeTab===index' name='bottom'>
            <component :is="'ad'" v-for='ad in addInfo.bottom' :key='ad.id' :data='ad' />
        </template>
    </SymbolList>
</template>

<script>
import { mapActions } from 'vuex'
import SymbolList from './SymbolList'
export default {
    name: 'ProductList',
    components: {
        SymbolList
    },
    props: {
        data: {
            type: Object,
            default () {
                return {
                    tagsList: [],
                    code_ids: []
                }
            }
        },
        activeTab: {
            type: Number
        },
        index: {
            type: Number
        },
        tabTitle: {
            type: String
        }
    },
    data () {
        return {
            activeNames: ['0']
        }
    },
    computed: {
        addInfo () {
            return this.$store.state.ix_baseInfo.companyInfo.uiPageList
                ? this.$store.state.ix_baseInfo.companyInfo.uiPageList.ProductList : { top: [], bottom: [] }
        },
    },
    created () {
        console.log('0000000000')
    },
}
</script>

<style lang="scss" scoped>
</style>
