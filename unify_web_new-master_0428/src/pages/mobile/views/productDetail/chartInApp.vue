<template>
    <div class='productDetail'>
        <TVChart v-if='productId && product' :height='chartHeight' :isapp='true' :product-id='productId' />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import TVChart from '@m/components/tradingview/tv'
import { appGroupSymbolList } from '@m/base/appHybrid'
export default {
    name: 'ProductDetail',
    data () {
        return {
            chartHeight: (document.documentElement.clientHeight) || 450,
        }
    },
    computed: {
        ...mapState({
            product_map: state => state.ix_quote.product_map,
            product_list: state => state.ix_quote.product_list
        }),
        productId () {
            const id = this.$route.params.id
            if (isNaN(id)) {
                const item = this.product_list.find(el => el.short_name === id)
                return item ? item.code_id : 0
            } else {
                return id
            }
        },
        product () {
            return this.product_map[this.productId]
        },
    },
    components: {
        TVChart
    },
    created () {
        if (!this.product) {
            this.getAppProduct()
        }
        this.init()
    },
    mounted () {
        this.$ws.send_addSubscription_proList([this.productId])
    },
    methods: {
        init () {
            this.$store.commit('ix_quote/UPDATE_PRODUCT_ACTIVATED_ID', this.productId)
        },
        getAppProduct () {
            appGroupSymbolList().then(data => {
                const product = data.find(el => el.id == this.productId)
                console.log(product)
                if (product) {
                    product.digits = product.dt
                    product.groupSymbol = {
                        id: this.productId,
                        digits: product.digits
                    }
                    this.$store.commit('ix_quote/ADD_Product', product)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productDetail {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    .productDetailChart {
        //min-height: 450px;
        height: 100%;
    }
}
</style>
