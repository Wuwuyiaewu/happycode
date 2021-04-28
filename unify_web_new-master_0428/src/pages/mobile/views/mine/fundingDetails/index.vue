<template>
    <div class='assetDetails' :class='{ inApp:inApp,pc:isPC }'>
        <Top v-if='!inApp'>
            <a v-if='isPC' slot='left' href='javascript:void(0);' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
        </Top>
        <div class='menu-wrap'>
            <van-dropdown-menu :close-on-click-outside='false'>
                <!-- 项目 -->
                <DropdownItem
                    v-model='tempData.projectModel'
                    class='menu-item'
                    :options='projectList'
                    @closed='onProjectClosed'
                    @confirm='onProjectConfirm'
                    @reset='onProjectReset'
                >
                    <div slot='title'>
                        {{ formatProjectTitle(form.projectModel) }}
                    </div>
                </DropdownItem>
                <!-- 日期 -->
                <DropdownItem
                    v-model='tempData.dateModel'
                    class='menu-item'
                    :options='dateList'
                    @change='onDateTypeChange'
                    @closed='onDateTypeClosed'
                    @confirm='onDateTypeConfirm'
                    @reset='onDateTypeReset'
                >
                    <div slot='title' v-html='formatDateTitle(form.dateModel, form.rangeDate)'></div>
                    <template slot='append_item_1'>
                        <div class='date-option' @click='calendarShowStatus = !calendarShowStatus'>
                            <div class='item'>
                                <template v-if='!tempData.rangeDate[0]'>
                                    {{ $t('fundingDetails.startStr') }}
                                </template>
                                <template v-else>
                                    {{ tempData.rangeDate[0] | formatDate }}
                                </template>
                            </div>
                            <span class='dividing-line'></span>
                            <div class='item'>
                                <template v-if='!tempData.rangeDate[1]'>
                                    {{ $t('fundingDetails.endStr') }}
                                </template>
                                <template v-else>
                                    {{ tempData.rangeDate[1] | formatDate }}
                                </template>
                            </div>
                        </div>
                    </template>
                </DropdownItem>
            </van-dropdown-menu>
        </div>

        <!-- 列表 -->
        <List ref='list' :data='list' :is-finished.sync='isFinished' @load='onLoad' @refresh='onRefresh' />
        <Calendar v-model='tempData.rangeDate' :show.sync='calendarShowStatus' @confirm='handleCalendarConfirm' />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import DropdownItem from './components/DropdownItem.vue'
import Calendar from './components/Calendar'
import List from './components/List.vue'
import { PROJECTOPTIONS, FLOWOPTIONS, DATEOPTIONS } from './constant'
import { accountCapitalList } from '@/api/base.js'
import { isAPP } from '@m/base/appHybrid'
import pcMixin from '@m/mixins/pc'
import dayjs from 'dayjs'
export default {
    name: 'FundingDetails',
    components: {
        Top,
        DropdownItem,
        Calendar,
        List
    },
    mixins: [pcMixin],
    filters: {
        formatDate (date) {
            if (Object.prototype.toString.call(date) !== '[object Date]') {
                return ''
            }
            return dayjs(date).format('YYYY-MM-DD')
        }
    },
    data () {
        return {
            projectList: [
                {
                    label: this.$t('fundingDetails.project'),
                    child: PROJECTOPTIONS
                },
                {
                    label: this.$t('fundingDetails.flow'),
                    child: FLOWOPTIONS
                }
            ],
            dateList: [
                {
                    label: '',
                    child: DATEOPTIONS
                },
            ],
            calendarShowStatus: false, // 日历显示状态
            form: { // 最终数据
                projectModel: ['0', '0'], // 项目下拉框选择
                dateModel: [1], // 日期下拉框选择
                rangeDate: [], // 日期范围
                page_no: 0 // 首次进入页面自动触发上拉加载(设置0方便+1)
            },
            tempData: {}, // 临时数据
            initialValues: {}, // 备份初始化数据
            list: [],
            isFinished: false,
            inApp: isAPP
        }
    },
    computed: {
        computedParams () {
            const { projectModel, rangeDate, page_no } = this.form
            const result = {
                page_no,
                page_size: 20,
                type: projectModel[0],
                direction: projectModel[1],
                start_time: rangeDate[0] ? dayjs(rangeDate[0]).unix() : 0,
                end_time: rangeDate[1] ? dayjs(rangeDate[1]).endOf('day').unix() : 0
            }
            return result
        }
    },
    created () {
        this.initialValues = JSON.stringify(this.form)
        this.tempData = JSON.parse(this.initialValues)
    },
    methods: {
        // 确定项目 && 搜索
        onProjectConfirm () {
            this.form.projectModel = JSON.parse(JSON.stringify(this.tempData.projectModel))
            this.form.page_no = 1
            const toast = this.$toast.loading({
                duration: 0,
                message: ''
            })
            console.log(toast)
            this.getlist()
                .then(() => {
                    toast.clear()
                    console.log(toast)
                })
                .catch(() => {
                    toast.clear()
                })
        },
        // 确定日期 && 搜索
        onDateTypeConfirm () {
            this.form.dateModel = JSON.parse(JSON.stringify(this.tempData.dateModel))
            this.form.rangeDate = JSON.parse(JSON.stringify(this.tempData.rangeDate))
            this.form.page_no = 1
            const toast = this.$toast.loading({
                duration: 0,
                message: ''
            })
            this.getlist()
                .then(() => {
                    toast.clear()
                })
                .catch(() => {
                    toast.clear()
                })
        },

        // 列表请求
        getlist () {
            const params = {
                ...this.computedParams,
                account_id: this.$store.state.ix_user.userLoginInfo.account_id
            }

            return new Promise((resolve, reject) => {
                accountCapitalList(params)
                    .then(res => {
                        if (res.code === 1) {
                            if (res.data.data) {
                                if (res.data.pageNo >= res.data.pageTotal) {
                                    this.isFinished = true
                                } else {
                                    this.isFinished = false
                                }

                                if (res.data.pageNo === 1) {
                                    this.$refs.list.scrollTop()
                                    this.list = res.data.data
                                } else {
                                    this.list = this.list.concat(res.data.data)
                                }
                                resolve(res)
                            }
                        } else {
                            setTimeout(() => {
                                this.$toast({
                                    duration: 1000, message: this.$t(`retMsg.${res.msgCode}`)
                                })
                                reject(res)
                            }, 500)
                        }
                    })
                    .catch(err => {
                        console.log({ err })
                    })
            })
        },

        // 下拉刷新
        onRefresh (callback) {
            console.log('下拉刷新')
            this.form.page_no = 1
            this.getlist()
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
            this.form.page_no++
            this.getlist()
                .then(res => {
                    loaded()
                    if (this.form.page_no >= res.data.pageTotal) {
                        finished()
                    }
                })
                .catch((err) => {
                    finished()
                })
        },

        // 项目下拉框重置
        onProjectReset () {
            const { projectModel } = JSON.parse(this.initialValues)
            this.tempData.projectModel.splice(0, this.tempData.projectModel.length, ...projectModel)
        },

        // 项目下拉框关闭后
        onProjectClosed () {
            const { projectModel } = JSON.parse(JSON.stringify(this.form))
            this.tempData.projectModel.splice(0, this.tempData.projectModel.length, ...projectModel)
        },

        // 日期下拉框重置
        onDateTypeReset () {
            const { dateModel, rangeDate: [start, end] } = JSON.parse(this.initialValues)
            const tempStart = start ? dayjs(start).toDate() : ''
            const tempEnd = end ? dayjs(end).toDate() : ''
            this.tempData.rangeDate = [tempStart, tempEnd]
            this.tempData.dateModel.splice(0, this.tempData.dateModel.length, ...dateModel)
        },
        // 日期下拉框关闭后
        onDateTypeClosed () {
            const { dateModel, rangeDate: [start, end] } = JSON.parse(JSON.stringify(this.form))
            const tempStart = start ? dayjs(start).toDate() : ''
            const tempEnd = end ? dayjs(end).toDate() : ''
            this.tempData.rangeDate = [tempStart, tempEnd]
            this.tempData.dateModel = dateModel
        },

        // 选择日期类型(更新临时变量tempData)
        onDateTypeChange (option = {}) {
            const { start, end } = option
            this.handleCalendarConfirm([start, end])
        },

        // 选择时间范围(更新临时变量tempData)
        handleCalendarConfirm (date) {
            const [start, end] = JSON.parse(JSON.stringify(date))
            if (start) {
                this.tempData.rangeDate = [dayjs(start).toDate(), dayjs(end).toDate()]
            } else {
                this.tempData.rangeDate = ['', '']
            }
            const startStr = dayjs(start).format('YYYY-MM-DD')
            const endStr = dayjs(end).format('YYYY-MM-DD')
            const MatchDateModel = DATEOPTIONS.find(item => {
                const itemStartStr = dayjs(item.start).format('YYYY-MM-DD')
                const itemEndStr = dayjs(item.end).format('YYYY-MM-DD')
                return itemStartStr === startStr && itemEndStr === endStr
            })

            if (MatchDateModel) {
                this.tempData.dateModel.splice(0, 1, MatchDateModel.value)
            } else {
                this.tempData.dateModel.splice(0, 1, '')
            }
        },

        formatProjectTitle (arr) {
            if (arr[0] === PROJECTOPTIONS[0].value && arr[1] === FLOWOPTIONS[0].value) {
                return PROJECTOPTIONS[0].text
            }
            return this.$t('fundingDetails.filterResults')
        },

        formatDateTitle (type, range = []) {
            if (type[0]) {
                const MatchDateModel = DATEOPTIONS.find(item => {
                    return item.value === type[0]
                })
                return MatchDateModel ? MatchDateModel.text : ''
            } else {
                const startStr = dayjs(range[0]).format('YYYY-MM-DD')
                const endStr = dayjs(range[1]).format('YYYY-MM-DD')
                return `<div class="date-title"><span>${startStr}</span><span>${endStr}</span></div>`
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.assetDetails {
    width: 100%;
    height: 100%;
    padding-top: rem(186px);
    &.inApp {
        padding-top: rem(90px);
        .menu-wrap {
            top: 0;
        }
    }
    &.pc{
        ::v-deep{
            .list{
                .time{
                    padding-bottom: 10px;
                }
                .van-pull-refresh{
                    @include scroll();
                }
            }

        }
    }
    .menu-wrap {
        position: fixed;
        top: rem(90px);
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        background: #fff;
        z-index: 1;
        .van-dropdown-menu {
            width: 100%;
            ::v-deep {
                .van-dropdown-menu__bar {
                    box-shadow: none;
                }
                .date-title {
                    font-size: rem(24px);
                    line-height: rem(24px);
                    span {
                        display: block;
                        &:first-child {
                            margin-bottom: rem(8px);
                        }
                    }
                }
                // .van-dropdown-menu__item {
                //     border-bottom: rem(1px) solid #f9f9f9;
                // }
                .van-dropdown-menu__title--active {
                    color: #497fd3;
                }
            }
        }
        .menu-item {
            flex: 0 0 50%;
        }
    }

    .date-option {
        display: flex;
        flex-direction: row;
        .item {
            display: block;
            width: rem(245px);
            height: rem(60px);
            line-height: rem(60px);
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(204, 204, 204, 1);
            border-radius: 5px;
            box-sizing: border-box;
            text-align: center;
            color: rgba(204, 204, 204, 1);
        }

        .dividing-line {
            position: relative;
            display: block;
            width: rem(20px);
            margin: 0 rem(14px);
            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                width: rem(20px);
                height: rem(4px);
                transform: translateY(-50%);
                background: rgba(153, 153, 153, 1);
            }
        }
    }

    .calendar {
        ::v-deep {
            .van-calendar__day {
                height: 60px;
                border-radius: 50%;
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .assetDetails {
        width: 400px;
        height: 100%;
        padding-top: 0;
        .menu-wrap {
            position: relative;
        }
        ::v-deep {
            .van-dropdown-item {
                position: fixed;
                right: 60px;
                left: inherit;
                z-index: 10;
                overflow: hidden;
                width: 400px;
            }
        }
    }
}
</style>
