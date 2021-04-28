<template>
    <div class='m-listEmpty'>
        <div>
            <i :class='icon' :style="{ 'font-size':iconSize }"></i>
        </div>
        <div class='txt'>
            {{ txt }}
        </div>
    </div>
</template>

<script>
import { i18n } from '@m/lang'
export default {
    name: 'ListEmpty',
    props: {
        icon: {
            type: String,
            default: 'icon_icon_blank_order'
        },
        iconSize: {
            type: String,
            default: '100px'
        },
        txt: {
            type: String,
            default: () => {
                return i18n.t('dataEmpty')
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.m-listEmpty {
    padding-top: rem(60px);
    text-align: center;
    color: #999;
    i {
        font-size: rem(200px);
        color: #dbdbdb;
    }
    .txt {
        width: rem(400px);
        line-height: rem(40px);
        margin: 0 auto;
    }
}
</style>
