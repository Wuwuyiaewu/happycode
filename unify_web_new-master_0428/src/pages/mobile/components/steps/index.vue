<template>
    <div class='steps'>
        <template v-for='(item, i) in list'>
            <div
                :key='item.index'
                class='item inactive'
                :class='{
                    finish: active > item.index,
                    active: active === item.index,
                }'
            >
                <div class='index-wrap'>
                    <span class='line' :class="active >= item.index ? 'highlight': ''" :style='{ opacity: i === 0 ? 0 : 1 }'></span>
                    <div class='index'>
                        <template v-if='item.iconType'>
                            <van-icon name='success' />
                        </template>
                        <template v-else>
                            <span>
                                {{ item.index }}
                            </span>
                        </template>
                    </div>
                    <span class='line' :class="active > item.index ? 'highlight': ''" :style='{ opacity: i === list.length - 1 ? 0 : 1 }'></span>
                </div>
                <span class='label'>
                    {{ item.label }}
                </span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: [Number],
            default: 1,
        },
        list: {
            type: Array,
            default: () => [],
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.steps {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: rem(30px) 0;
    background: #FAFAFA;
    .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .index-wrap {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            .index {
                z-index: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                flex: 0 0 rem(32px);
                height: rem(32px);
                border-radius: 100%;
                color: #fff;
                font-size: rem(18px);
                line-height: rem(32px);
                text-align: center;
                margin: 0 rem(20px);
            }
            .line {
                position: relative;
                top: 50%;
                flex: 0 0 50%;
                height: 1px;
                background: #efefef;
                &.highlight{
                    background: #477fd2;
                }
            }
        }

        .label {
            font-size: rem(24px);
            font-weight: 500;
            line-height: rem(26px);
            margin-top: rem(12px);
        }
        &.inactive {
            .index {
                background: #c5c5c5;
            }
            .label {
                color: #c5c5c5;
            }
        }
        &.finish,
        &.active {
            .index {
                background: #477fd2;
            }
            .label {
                color: #477fd2;
            }
        }
    }
}
</style>
