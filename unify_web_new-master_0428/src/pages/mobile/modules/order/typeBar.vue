<template>
    <!-- 订单类型 -->
    <div class='typeBar'>
        <van-row class='cellBar' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ $t('trade.orderType') }}
                </p>
            </van-col>
            <van-col class='radioGroup'>
                <button class='btn' :class="{ 'mainColorBg':value==1 }" @click='setType(1)'>
                    {{ $t('trade.marketPrice') }}
                </button>
                <button class='btn' :class="{ 'mainColorBg':value==2 }" @click='setType(2)'>
                    {{ $t('trade.pending') }}
                </button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
export default {
    props: ['value'],
    methods: {
        setType (val) {
            this.$emit('input', val)
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.cellBar {
    align-items: center;
    padding: 0 0 rem(40px);
}
.btn {
    min-width: rem(160px);
    padding: 0 rem(10px);
    height: rem(70px);
    line-height: rem(70px);
    text-align: center;
    color: #333;
    font-size: rem(28px);
    border-radius: rem(6px);
    &.mainColorBg {
        color: #fff;
    }
    & + .btn {
        margin-left: rem(20px);
    }
    &:disabled {
        opacity: 0.5;
    }
}
</style>
