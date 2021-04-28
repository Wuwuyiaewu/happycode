<template>
    <div v-if='dataList.length>0' class='groupList'>
        <div v-if="display == '1'" class='titlleName'>
            {{ data.name }}
            <div v-if='index>0' class='toTop' @click='toTop'>
                <i class='icon_zhiding'></i>
            </div>
        </div>
        <div class='titleBar'>
            <span class='item'>
                {{ $t('trade.nameCode') }}
            </span>
            <span class='item'>
                {{ $t('trade.sellPrice') }}
            </span>
            <span class='item'>
                {{ $t('trade.buyPrice') }}
            </span>
        </div>
        <ProductItem
            v-for='(item,index) in dataList'
            :key='moduleId+item+index'
            :code-id='item'
            :data-symbolid='item'
            @disableTip="showDisableTip=true"
            :tab-title='tabTitle'
        />
        <router-link
            v-if='data.code_ids.length>5'
            class='showMore'
            tag='div'
            :to="{ name:'Tag',query:{ tagid:data.id,mid: moduleId } }"
        >
            {{ $t('showMore') }}
            <i class='icon_gengduo'></i>
        </router-link>
        <DisableTip :show.sync='showDisableTip' />
    </div>
</template>

<script>
import ProductItem from './productItem'
import { localSet, localGet } from '@/utils/index'
import { mapMutations } from 'vuex'
import DisableTip from './disableTip'
export default {
    name: 'ProductModule',
    components: {
        ProductItem,
        DisableTip
    },
    props: {
        data: {
            type: Object,
            default () {
                return {
                    title: '',
                    code_id: []
                }
            }
        },
        tabTitle: {
            type: String
        },
        display: {
            type: String
        },
        index: {
            type: Number,
            default: -1
        },
        moduleId: {
            default: ''
        }
    },
    data () {
        return {
            showDisableTip: false
        }
    },
    computed: {
        dataList () {
            if (this.data.code_ids && this.data.code_ids.length > 0) {
                const _showList = [].concat(this.data.code_ids).splice(0, 5)
                return _showList
            } else {
                return []
            }
        }
    },
    methods: {
        ...mapMutations({
            dataToTop: 'ix_quote/UPDARE_PRODUCT_CATEGORY_TAGTOTOP'
        }),
        toTop () {
            let baseData = localGet('moduleTop')
            baseData = baseData ? JSON.parse(baseData) : {}
            baseData[this.moduleId] = this.data.id
            this.dataToTop({
                moduleId: this.moduleId,
                tagId: this.data.id,
                index: this.index
            })
            localSet('moduleTop', baseData)
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.groupList {
    margin-bottom: rem(15px);
    background-color: #fff;
    .titlleName {
        position: relative;
        padding: 0 rem(30px);
        color: #333;
        font-size: rem(34px);
        font-weight: 700;
        margin-bottom: rem(17px);
        padding-top: rem(28px);
        .toTop {
            position: absolute;
            color: #595959;
            padding: rem(28px) rem(32px) 0 rem(32px);
            right: 0;
            top: 0;
        }
    }
    .titleBar {
        color: $muted;
        height: rem(60px);
        line-height: rem(60px);
        padding: 0 rem(30px);
        font-size: rem(20px);
        display: flex;
        justify-content: space-between;
    }
    .showMore {
        cursor: pointer;
        text-align: center;
        color: #999999;
        font-size: rem(24px);
        padding: rem(22px) 0;
    }
}
</style>
