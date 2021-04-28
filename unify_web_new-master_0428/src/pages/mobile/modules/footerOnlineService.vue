<template>
    <div class='onlineService' :class='{ float:float }'>
        <a class='mainColor' href='javascript:;' @click='openService'>
            <i class='icon_icon_service'></i>
            {{ title || $t('onlineService') }}
        </a>
    </div>
</template>

<script>
import { isAPP, appGoCS } from '@m/base/appHybrid'
export default {
    name: 'FooterOnlineService',
    props: {
        title: String,
        url: String,
        float: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        openService () {
            this.$emit('serviceClick')
            if (isAPP) return appGoCS()
            this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.url, title: this.title } })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.onlineService {
    margin-top: rem(40px);
    width: 100%;
    text-align: center;
    &.float {
        position: absolute;
        bottom: rem(53px);
        left: 0;
        margin-top: 0;
    }
    a {
        font-size: rem(26px);
    }
    .icon_icon_service {
        font-size: rem(30px);
    }
}
</style>
