<template>
    <div id='topNav' class='topNav'>
        <div class='left'>
            <slot name='left'>
                <AccountChange v-if='isDropdownMenu' />
                <a v-else class='backIcon' href='javascript:void(0);' @click='back'>
                    <i class='icon_icon_back'></i>
                </a>
            </slot>
        </div>
        <div class='main'>
            <slot>{{ title?title:$t($route.meta.title) }}</slot>
        </div>
        <div class='right'>
            <slot name='right'>
                <MyAsset v-if="['TradeIndex','PositionIndex','Mine'].includes($route.name)" />
            </slot>
        </div>
    </div>
</template>

<script>
import AccountChange from '@m/components/AccountChange.vue'
import MyAsset from '@m/components/MyAsset'
export default {
    name: 'Top',
    components: {
        AccountChange,
        MyAsset
    },
    props: ['title'],
    data () {
        return {
            iframePage: ['OpenAccount'],
            historyLength: -1
        }
    },
    computed: {
        isDropdownMenu () {
            return ['TradeIndex', 'PositionIndex', 'SelfSymbolIndex'].includes(this.$route.name)
        }
    },
    mounted () {
        if (this.iframePage.indexOf(this.$route.name) >= 0) {
            this.historyLength = window.history.length
        }
    },
    methods: {
        back () {
            if (this.$route.name == 'Nest') {
                this.$emit('back')
            } else {
                this.$emit('back')
                if (this.iframePage.indexOf(this.$route.name) >= 0) {
                    this.$router.go(this.historyLength - window.history.length - 1)
                } else {
                    this.$router.go(-1)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.topNav {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: rem(90px);
    display: flex;
    align-items: center;
    font-size: rem(34px);
    color: #333333;
    background: #fff;
    &.mainColorBg {
        color: #fff;
    }
    &.nobg {
        background: none;
    }
    .left,
    .right {
        position: absolute;
        height: 100%;
        line-height: rem(90px);
        padding: 0 rem(30px);
        cursor: pointer;
    }
    .left {
        left: 0;
        bottom: 0;
    }
    .right {
        right: 0;
        bottom: 0;
        i {
            font-size: rem(40px);
        }
    }
    .main {
        text-align: center;
        max-width: 60%;
        margin: 0 auto;
    }
    a {
        color: inherit;
        &:active {
            opacity: 0.7;
            box-shadow: 0 0 999px rgba(0, 0, 0, 0.05) inset;
        }
    }
    .backIcon{
        margin-left: rem(-10px);
        padding: rem(10px);
    }
}
</style>

<style lang="scss">
@import "~@m/sass/mixin.scss";
.m-dropDownChangeAccount {
    display: inline-block;
    height: rem(48px);
    padding: rem(5px) rem(30px) rem(5px) rem(10px);
    background-color: #f9f9f9;
    border-radius: rem(24px);
    .van-dropdown-menu__item {
        height: 100%;
    }
    .van-dropdown-menu__title {
        color: #333333;
        font-size: rem(24px);
        line-height: rem(24px);
        &::after {
            border-width: rem(4px);
            right: -2px;
        }
    }
    &:after {
        border: none;
    }
}
@media screen and (min-width: 750px) {
    .topNav {
        position: relative !important;
    }
    .van-popup--bottom {
        bottom: 60px;
        right: 60px;
        left: inherit;
        width: 400px;
        z-index: 100000 !important;
    }
    .dialog-header {
        position: relative;
        padding: rem(43px) 0 rem(45px) 0;
        color: #333333;
        font-size: rem(34px);

        .title {
            text-align: center;
        }

        .right {
            position: absolute;
            height: 100%;
            padding: rem(45px) rem(30px);
            right: 0;
            bottom: 0;

            i {
                font-size: rem(40px);
            }
        }
    }
}
</style>
