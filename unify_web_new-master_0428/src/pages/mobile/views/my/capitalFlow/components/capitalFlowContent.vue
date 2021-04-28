<template>
    <div class='list' :class='{ pc:isPC }'>
        <van-pull-refresh
            ref='vanList'
            v-model='isRefreshLoading'
            :loading-text="$t('fundingDetails.loadingText')"
            :loosing-text="$t('fundingDetails.loosingText')"
            :pulling-text="$t('fundingDetails.pullingText')"
            :success-text="$t('fundingDetails.successText')"
            @refresh='onRefresh'
        >
            <van-list v-model='isGettingMoreLoading' :finished='isFinished' @load='onLoad'>
                <template v-if='data.length > 0'>
                    <!-- 入金明细 -->
                    <depositList v-if='type ===1' :list='data' />
                    <!-- 出金明细 -->
                    <withAmountList v-if='type ===2' :list='data' />
                    <div
                        v-if='data.length > 0 && isGettingMoreLoading == false'
                        slot='finished'
                        class='finished'
                    >
                        {{ $t('fundingDetails.noMore') }}
                    </div>
                </template>

                <ListEmpty
                    v-if='data.length <= 0 && isGettingMoreLoading === false'
                    icon='icon_icon_no'
                    :txt="type ===1 ? $t('other.noDeposit') : $t('other.noWithAmount')"
                />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { PullRefresh, List } from 'vant'
import ListEmpty from '@m/components/ListEmpty'
import dayjs from 'dayjs'
import depositList from './depositList.vue'
import withAmountList from './withAmountList.vue'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'List',
    components: {
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        ListEmpty,
        depositList,
        withAmountList
    },
    mixins: [pcMixin],
    props: {
        data: {
            type: Array,
            default: () => []
        },
        isFinished: {
            type: Boolean,
            default: false
        },

        type: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            isRefreshLoading: false,
            isGettingMoreLoading: false,
            isRefreshing: false, // 防止快速刷新且同时请求数据
        }
    },
    methods: {
        onRefresh () {
            if (this.isRefreshing) {
                return
            }
            const _this = this
            this.isRefreshing = true
            this.$emit('refresh', () => {
                _this.isRefreshLoading = false
                this.isRefreshing = false
            })
        },
        onLoad () {
            if (this.isRefreshLoading) {
                return
            }
            const _this = this
            this.$emit('load', () => {
                _this.isGettingMoreLoading = false
                console.log({
                    isGettingMoreLoading: this.isGettingMoreLoading
                })
            }, () => {
                _this.$emit('update:isFinished', true)
            })
        },
        scrollTop () {
            this.$refs.vanList.$el.scrollTop = 0
        },

    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";

.list {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    ::v-deep {
        .van-pull-refresh {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            @include scroll();
        }
    }

    .finished {
        padding: rem(30px) 0;
        text-align: center;
        font-size: rem(24px);
        color: #999;
    }
}
</style>
