<template>
    <div ref="ifrmae_h5" class="ifrmae_h5_wrapper">
        <h1 class="title">domo首頁</h1>
        <ul class="product_nav">
            <li v-for="product of product_id" :key="product.name"><router-link :to="{ name: 'ProductDetail', params: { id: product.code_id } }">{{product.name}}</router-link></li>
        </ul>
    </div>
</template>
<script>

export default ({
    name: "ifrmae_h5",
    conponents: {

    },
    data(){
        return{
            product_id:[{
                code_id:573004,
                name:"黃金"
            },
            {
                code_id:573005,
                name:"白銀"
            },
            {
                code_id:573010,
                name:"美國peko"
            },
            {
                code_id:573014,
                name:"美國tech100"
            },]
        }
    }
})
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.ifrmae_h5_wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    // padding-top: rem(60px);
    box-sizing: border-box;
    color: #333;
    background: #fff;
    flex-wrap: wrap;
    .title {
        width: 100%;
        text-align: center;
    }
    .product_nav {
        display: flex;
        width: 5rem;
        justify-content: space-between;

    }
}
</style>