<template>
    <div class='productEmpty'>
        <Top ref='top' class='nobg' />
        <ListEmpty :txt="'找不到产品'" />
    </div>
</template>

<script>
import ListEmpty from '@m/components/ListEmpty'
import Top from '@m/layout/top'
export default {
    components: {
        Top,
        ListEmpty,
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.productEmpty {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding: rem(350px) 0 rem(100px);
    ::v-deep {
        .m-listEmpty {
            padding-top: 0;
            line-height: 1.2;
        }
    }
}
</style>
