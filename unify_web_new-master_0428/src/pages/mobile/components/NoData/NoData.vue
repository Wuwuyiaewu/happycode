<template>
    <div class='no-data'>
        <div class='img'></div>
        <div class='name'>
            {{ name }}
        </div>
    </div>
</template>

<script>
import { i18n } from '@m/lang'
export default {
    name: 'NoData',
    props: {
        name: {
            type: String,
            default: i18n.t('dataEmpty')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.no-data {
    text-align: center;
    .img {
        margin: 0 auto;
        width: rem(230px);
        height: rem(230px);
        @include bg-image(
            "./img/newList_noneMsg_avatar",
            rem(230px),
            rem(230px)
        );
    }
    .name {
        margin-top: rem(46px);
        font-size: rem(30px);
        font-weight: 500;
        color: #99abba;
    }
}
</style>
