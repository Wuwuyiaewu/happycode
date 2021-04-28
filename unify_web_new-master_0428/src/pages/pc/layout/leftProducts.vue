<template>
    <div class='leftProducts'>
        <h2>
            产品列表
            <button class='subscriptBtn' @click='subscription'>
                开始订阅
            </button>
        </h2>
        <ul class='products'>
            <li v-for='product in products.list' :key='product.code_id' class='item'>
                <p class='name'>
                    {{ product.simplified }} {{ product.short_name }}
                </p>
                <span
                    class='btn'
                    :class="product.buy_color + 'Bg'"
                >
                    买：{{ !product.buy_price && product.buy_price != 0 ? '- -' : product.buy_price }}
                </span>
                <span
                    class='btn'
                    :class="product.sell_color + 'Bg'"
                >
                    卖：{{ !product.sell_price && product.sell_price != 0 ? '- -' : product.sell_price }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            product_category: state => state.ix_quote.product_category
        }),
        products () {
            return this.product_category[0] || { list: [] }
        }
    },
    methods: {
        subscription () {
            this.$ws.send_addSubscription_proList(this.products.code_ids)
        }
    }
}
</script>

<style lang="scss" scoped>
.subscriptBtn {
    font-size: 14px;
    border-radius: 4px;
    background: #ccc;
    padding: 2px 10px;
    font-weight: normal;
    cursor: pointer;
}
.leftProducts {
    padding: 15px;
}
.products {
    margin-top: 10px;
    .item {
        padding: 10px 0;
        border-bottom: 1px dashed #ccc;
    }
    .btn {
        margin-right: 5px;
        color: #fff;
        padding: 2px 10px;
        border-radius: 4px;
        background-color: #858c9a;
    }
}
</style>
