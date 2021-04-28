<template>
    <div class='m-positionClose'>
        <Top>
            <div slot='right'></div>
        </Top>
        <div class='main'>
            <div class='layout-1'>
                <div class='item' @click="selectConfirm('common')">
                    <div class='left'>
                        <div class='title'>
                            {{ $t('setting.commonClose') }}
                        </div>
                        <div class='content'>
                            {{ $t('setting.commonCloseTip') }}
                        </div>
                    </div>
                    <div class='right'>
                        <div class='icon'>
                            <i class='van-icon van-icon-success'></i>
                        </div>
                    </div>
                </div>
                <div class='item active' @click="selectConfirm('first')">
                    <div class='left'>
                        <div class='title'>
                            {{ $t('setting.fastClose') }}
                        </div>
                        <div class='content'>
                            {{ $t('setting.fastCloseTip') }}
                        </div>
                    </div>
                    <div class='right'>
                        <div class='icon'>
                            <i class='van-icon van-icon-success'></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
export default {
    name: 'PositionClose',
    components: {
        Top
    },
    data () {
        return {
            showLoginOut: false
        }
    },
    methods: {
        selectConfirm (type) {
            this.$dialog.confirm({
                title: this.$t('setting.confirmClose'),
                message: `${type === 'common' ? this.$t('setting.changeCloseTypeTipOne') : this.$t('setting.changeCloseTypeTipTwo')}`
            }).then(() => {

            }).catch(() => {
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-positionClose {
    .main {
        padding-top: rem(90px);
    }
    .layout-1 {
        margin: rem(20px);
        .item {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            border-radius: rem(10px);
            padding: rem(45px) rem(30px);
            margin-bottom: rem(20px);
            &.active {
                background-color: #477fd3;
                .icon {
                    background-color: #fff;
                    i {
                        color: #477fd3;
                    }
                }
                .title {
                    color: #fff;
                }
                .content {
                    color: #bfd9ff;
                }
                &::after {
                    content: "当前模式";
                    position: absolute;
                    top: -4px;
                    left: rem(30px);
                    border-radius: 3px;
                    background-color: #f39800;
                    color: #fff;
                    font-size: rem(20px);
                    line-height: rem(28px);
                    height: rem(28px);
                    padding: 0 rem(6px);
                }
            }
            .left {
                margin-right: rem(50px);
            }
            .title {
                color: #333333;
                font-size: rem(28px);
                margin-bottom: rem(10px);
            }
            .content {
                color: #999999;
                font-size: rem(24px);
                line-height: rem(34px);
            }
            .icon {
                display: inline-block;
                text-align: center;
                line-height: rem(40px);
                width: rem(40px);
                height: rem(40px);
                border-radius: 50%;
                overflow: hidden;
                background-color: #c4c4c4;
                i {
                    color: #fff;
                    line-height: rem(40px);
                }
            }
        }
    }
}
</style>
