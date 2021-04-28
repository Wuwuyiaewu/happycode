<template>
    <div class='capital-flow'>
        <div v-if='apiError' class='no-record' @click='getData'>
            <div class='icon-area'>
                <i></i>
            </div>
            <p>{{ $t('apiError') }}</p>
        </div>
        <capitalFlowContent
            v-else
            ref='list'
            class='scroll'
            :data='list'
            :is-finished.sync='isFinished'
            :type='type'
            @load='onLoad'
            @refresh='onRefresh'
        />
    </div>
</template>

<script>
import { getDepositDetalis, getWithFuncDetalis } from '@/api/user/funds'
import request from '@/utils/request'
import capitalFlowContent from './components/capitalFlowContent.vue'
import Top from '@m/layout/top'
import { i18n } from '@m/lang'
export default {
    name: 'CapitalFlow',
    components: {
        capitalFlowContent,
        Top
    },
    filters: {
        proposalStatusFilter (value) {
            if (!value) return ''
            let str = ''
            const obj = {
                fail: '失败',
                wait: '待审核',
                success: '成功',
                wait_pay: '待支付',
                cancel: '已取消'
            }

            str = obj[value] || '失败'
            return str
        },
        filterProposalStatusClsName (val) {
            let ClsName = ''
            switch (val) {
                case 'success': {
                    ClsName = 'success'
                    break
                }
                case 'wait_pay':
                case 'wait': {
                    ClsName = 'approval'
                    break
                }
                default: {
                    // [fail, cancel]
                    ClsName = 'fail'
                    break
                }
            }
            return ClsName
        }
    },
    data () {
        return {
            type: Number(this.$route.params.type) || 1, // 1 是充值 2是提现
            page: 0,
            pageSize: 20,
            list: [],
            isFinished: false,
            apiError: false,
        }
    },
    beforeRouteEnter (to, from, next) {
        const type = Number(to.params.type) || 1 // 1 是充值 2是提现
        to.meta.title = type == 1 ? i18n.t('label.rechargeRecord') : i18n.t('label.tixianRecord')
        next()
    },
    methods: {
        getData () {
            if (this.type === 1) {
                return this._getData(this.page, this.pageSize, getDepositDetalis())
            } else {
                return this._getData(this.page, this.pageSize, getWithFuncDetalis())
            }
        },
        _getData (page_no, page_size, url) {
            return new Promise((resolve, reject) => {
                this.apiError = false
                return request({
                    url,
                    method: 'post',
                    data: {
                        data: {
                            page_no,
                            page_size,
                            agent_code: '',
                            platform: this.$route.query.platform || 'ix'
                        }
                    },
                    timeout: 30000
                }).then(res => {
                    if (res.code === 1) {
                        if (res.data.data) {
                            if (res.data.page_no >= res.data.page_total) {
                                this.isFinished = true
                            } else {
                                this.isFinished = false
                            }

                            if (res.data.page_no === 1) {
                                this.$refs.list.scrollTop()
                                this.list = res.data.data
                            } else {
                                this.list = this.list.concat(res.data.data)
                            }
                            resolve(res)
                        }
                    } else {
                        this.apiError = true
                        setTimeout(() => {
                            this.$toast({
                                duration: 1000, message: this.$t(`retMsg.${res.msg}`)
                            })
                            reject(res)
                        }, 500)
                    }
                }).catch(err => {
                    this.apiError = true
                    console.log({ err })
                })
            })
        },

        onRefresh (callback) {
            console.log('下拉刷新')
            this.page = 1
            this.getData()
                .then(() => {
                    callback()
                })
                .catch(() => {
                    callback()
                })
        },

        // 上拉加载
        onLoad (loaded, finished) {
            console.log('上拉加载')
            this.page++
            this.getData()
                .then(res => {
                    loaded()
                    if (this.page >= res.data.page_total) {
                        finished()
                    }
                })
                // eslint-disable-next-line handle-callback-err
                .catch((err) => {
                    finished()
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";
.capital-flow {
    width: 100%;
    height: 100%;
    background: #fafcfe;
    .pc{
        ::v-deep{
            .van-collapse-item{
                &:first-child{
                    .of-1px-bottom{
                        &::after{
                            border-width: 0;
                        }
                    }
                }
            }
        }
    }
}
.no-record {
    text-align: center;
    font-size: rem(28px);
    color: #ccc;
    padding: rem(138px) 0 0;
    p {
        padding-top: rem(34px);
    }
    i {
        display: inline-block;
        width: rem(172px);
        height: rem(185px);
        background: url(~@m/images/no_data.png) no-repeat center center;
        background-size: 100%;
    }
}
</style>
