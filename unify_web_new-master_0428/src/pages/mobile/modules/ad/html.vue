<template>
    <div v-if='data.content' class='htmlModule' v-html='data.content'></div>
</template>

<script>
export default {
    name: 'Html',
    props: {
        'data': {
            type: Object,
            default: function () {
                return {}
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.htmlModule {
    padding: rem(20px);
    ::v-deep {
        .img {
            width: 360px;
            height: 86px;
        }
    }
}
</style>
