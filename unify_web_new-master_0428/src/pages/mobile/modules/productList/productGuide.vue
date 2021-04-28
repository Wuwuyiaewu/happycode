<template>
    <div>
        <van-popup v-model='visible' class='productGuide' :code-id='productId' get-container='body'>
            <div class='productItemWrapper'>
                <ProductItem
                    v-if='productId'
                    :code-id='productId'
                    :data-symbolid='productId'
                    :style='{ marginTop: productItemTop+"px" }'
                    :tab-title='tabTitle'
                />
            </div>
            <span class='iconArrow'></span>
            <div class='tipContent' v-html='tipContent'></div>
            <div class='btnBox'>
                <van-button type='primary' @click='visible=false'>
                    {{ $t('activity.dealNow') }}
                </van-button>
                <van-button
                    v-prophet="['trackEvent', '体验活动', '我的页面弹窗', '我的弹窗_玩法指引', 90]"
                    plain
                    type='info'
                    @click='toPlayGuide'
                >
                    {{ $t('activity.playTips') }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductItem from './productItem'
export default {
    components: {
        ProductItem,
    },
    data () {
        return {
            visible: true,
            productItemTop: 0,
        }
    },
    computed: {
        ...mapState({
            product_category: state => state.ix_quote.product_category,
            product_map: state => state.ix_quote.product_map,
        }),
        productId () {
            if (!this.product_category || this.product_category.length === 0) return null
            const first = this.product_category[0] || {}
            return first.tagDiplay === '3' ? first.code_ids[1] : first.tagsList[0]?.code_ids[0]
        },
        tipContent () {
            const balance = this.$store.state.ix_user.userLoginInfo.balance
            const symbolCode = this.$store.getters.symbolCode
            return this.$t('activity.tip2', [`<span style='color:#F39800;'> ${balance + symbolCode} </span>`])
        }
    },
    mounted () {
        const scrollListEl = document.querySelector('.scrollList')
        const productItemEl = scrollListEl.querySelectorAll('.productItem').item(1)
        this.productItemTop = productItemEl ? productItemEl.getBoundingClientRect().top : 0
    },
    methods: {
        toPlayGuide () {
            this.visible = false
            this.$router.push({ name: 'PlayGuide' })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productGuide{
    background: none;
    width: 100%;
    height: 100%;
}
.productItemWrapper{
    position: relative;
    background-color: #fff;
    &::before{
        content: '';
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        opacity: 0;
    }
}
.iconArrow{
    display: block;
    margin: rem(10px) auto;
    width: rem(32px);
    height: rem(83px);
    background: url(../../images/activityGuideImg3.png) no-repeat;
    background-size: 100%;
}
.btnBox{
    margin: rem(40px) rem(85px);
    display: flex;
    justify-content: space-between;
    .van-button{
        width: 45%;
        background: #F39800;
        border-color: #F39800;
        &:last-child{
            background: none;
            color: #F39800;
        }
    }
}
.tipContent{
    position: relative;
    margin: 0 rem(85px) 0;
    padding: rem(18px) 0  rem(18px) rem(172px);
    color: #FFFFFF;
    font-size: rem(28px);
    line-height: 1.5;
    font-weight: normal;
    border: 1px dashed #fff;
    border-radius: rem(10px);
    &::before{
        content: '';
        position: absolute;
        top: rem(26px);
        left: rem(30px);
        width: rem(216px);
        height: rem(204px);
        border: 1px dashed #fff;
        transform-origin:0 0;
        transform: scale(.5);
        background: url(../../images/activityGuideImg2.png) no-repeat;
        background-size: rem(216px);
    }
}
</style>
