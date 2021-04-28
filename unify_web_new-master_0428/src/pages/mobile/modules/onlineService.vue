<template>
    <div v-show='serviceShow' class='online-service' :class='{ servicehome:isHome }'>
        <div class='title'>
            <span>{{ $t('onlineService') }}</span>
            <a href='javascript:void(0)' @click.stop='close'>
                <i class='icon_icon_close_big'></i>
            </a>
        </div>
        <div class='iframe'>
            <iframe
                data-v-3712f014
                frameborder='0'
                height='100%'
                leftmargin='0'
                marginheight='0'
                marginwidth='0'
                scrolling='auto'
                :src='onlineService'
                topmargin='0'
                width='400px'
            ></iframe>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'OnlineService',
    model: {
        prop: 'serviceShow',
        event: 'online'
    },
    props: {
        serviceShow: {
            type: Boolean,
            default: false
        },
        isHome: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        ...mapGetters(['companyInfo']),
        onlineService () {
            const companyInfo = this.companyInfo
            return companyInfo.transBaseConfigVo ? companyInfo.transBaseConfigVo.onlineService : ''
        }
    },
    methods: {
        close () {
            this.$emit('online', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.online-service {
    position: fixed;
    z-index: 2000;
    right: 20px;
    bottom: 20px;
    width: 400px;
    height: 500px;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    border: 1px solid #d5d8e0;
    box-shadow: 0px 0px 40px 0px #e6e6e6;
    &.servicehome {
        right: 60px;
        bottom: 60px;
    }
    .title {
        position: relative;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        a {
            position: absolute;
            right: 15px;
            color: #6f6f7f;
        }
    }
    .iframe {
        flex: 1;
    }
}
</style>
