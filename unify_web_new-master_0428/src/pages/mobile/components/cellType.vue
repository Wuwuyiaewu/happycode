<template>
    <!-- 订单类型 -->
    <div class='typeBar'>
        <van-row class='cellBar' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ title }}
                </p>
            </van-col>
            <van-col class='radioGroup'>
                <button
                    v-for='(btn,i) in btnList'
                    v-prophet="$attrs['v-prophet-value']"
                    class='btn'
                    :class="{ 'mainColorBg':value==btn.val }"
                    @click='setType(btn.val)'
                >
                    {{ btn.title }}
                </button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
export default {
    props: ['title', 'value', 'btnList'],
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
}
.btn {
    min-width: rem(160px);
    height: rem(70px);
    line-height: rem(70px);
    text-align: center;
    color: #333;
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
