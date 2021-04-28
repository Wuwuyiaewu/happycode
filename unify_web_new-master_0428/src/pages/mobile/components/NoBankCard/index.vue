<template>
    <div class='no-bank-card'>
        <div class='img'></div>
        <div class='name'>
            {{ $t('form.title.bankEmpty') }}
        </div>
        <van-button
            v-prophet="$attrs['v-prophet-value']"
            :color='style.mainColor'
            @click="$router.push({ name:'AddBank', query: $route.query })"
        >
            {{ $t('form.title.addBank') }}
        </van-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'NoBankCard',
    computed: {
        ...mapGetters(['style']),
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.no-bank-card {
    width: rem(220px);
    text-align: center;
    .img {
        width: rem(220px);
        height: rem(220px);
        @include bg-image("./img/bank_default", rem(220px), rem(220px));
    }
    .name {
        margin-bottom: rem(30px);
        font-size: rem(26px);
    }
}
</style>
