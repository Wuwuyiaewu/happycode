<template>
    <div class='m-msgList' :class='{ pc:isPC }'>
        <Top>
            <div class='m-accountChange' :class='{ open: changeType.show }'>
                <div ref='activeBtn' class='btn' @click='showMemu'>
                    {{ msgData.msgTypeList[activeTypeIndex] ? msgData.msgTypeList[activeTypeIndex].name : '' }}
                    <span v-if='msgData.msgTypeList[activeTypeIndex] && msgData.msgTypeList[activeTypeIndex].msgNum > 0' class='flg'>
                        {{ msgData.msgTypeList[activeTypeIndex].msgNum | showMsgNum }}
                    </span>
                </div>
                <van-popup v-model='changeType.show' class='m-accountMenu' :overlay='false' @click='changeType.show = false'>
                    <div class='menus' :style="{ top: changeType.btnPosition.y + 'px', left: changeType.btnPosition.x + 'px' }">
                        <div v-for='(item, index) in msgData.msgTypeList' :key='index' class='item' @click.stop='changeShowList(index)'>
                            <div>{{ item.name }}</div>
                            <div v-if='item.msgNum > 0' class='flg'>
                                {{ item.msgNum | showMsgNum }}
                            </div>
                        </div>
                    </div>
                </van-popup>
            </div>
            <a v-if='isPC' slot='left' href='javascript:void(0);' @click='goBackHome'>
                <i class='icon_icon_close_big'></i>
            </a>
            <div slot='right' class='rightBtn' @click="msgSign({ id: '' })">
                {{ $t('msg.allRead') }}
            </div>
        </Top>
        <div class='content'>
            <van-pull-refresh v-model='refreshing' :loading-text="$t('loading')" @refresh='onRefresh'>
                <van-list
                    v-model='loading'
                    class='m-list'
                    :error-text="$t('msg.error')"
                    :finished='finished'
                    loading-text
                    @load='onLoad'
                >
                    <div v-if='list.length > 0'>
                        <div v-for='(item, index) in list' :key='index' class='item' :class="{ ready: item.status == 'YES' }" @click='toRead(item)'>
                            <div class='title'>
                                {{ item.title }}
                            </div>
                            <div class='body' :class='{ hidden: item.hiddenMore == 1, show: item.hiddenMore == 2, noLink: item.hiddenMore != 2 }'>
                                {{ item.content }}
                                <div v-if='item.hiddenMore == 1 || item.hiddenMore == 2' class='showMore' @click.stop='item.hiddenMore == 1 ? (item.hiddenMore = 2) : (item.hiddenMore = 1)'>
                                    <template v-if='item.hiddenMore == 1'>
                                        <span v-if='item.hiddenMore == 1'>
                                            ...
                                        </span>
                                        {{ $t('msg.showMore') }}
                                    </template>
                                    <template v-else-if='item.hiddenMore == 2'>
                                        {{ $t('msg.hidden') }}
                                    </template>
                                </div>
                            </div>
                            <div class='other'>
                                <div class='time'>
                                    {{ item.create_date | timeStmpToString }}
                                </div>
                                <div v-if='(item.redirect_type != 0 && !isPC) || (isPC && item.redirect_type ==="2")' class='more'>
                                    {{ $t('msg.readDetail') }}
                                    <van-icon name='arrow' />
                                </div>
                            </div>
                        </div>
                        <div v-if='list.length > 0 && loading == false' slot='finished' class='finished'>
                            {{ $t('msg.showAll') }}
                        </div>
                    </div>
                    <ListEmpty v-if='list.length <= 0 && loading == false' icon='icon_icon_no' :txt="$t('msg.empty')" />
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import ListEmpty from '@m/components/ListEmpty'
import { mapMutations, mapActions } from 'vuex'
import { List, PullRefresh, Icon } from 'vant'
import { getElementPagePosition, replaceMsgContent } from '@/utils/index'
import { msgPages, msgSign } from '@/api/msg'
import dayjs from 'dayjs'
import Top from '@m/layout/top'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'MsgList',
    components: {
        ListEmpty,
        Top,
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        [Icon.name]: Icon
    },
    mixins: [pcMixin],
    filters: {
        timeStmpToString (str) {
            if (str) {
                return dayjs(new Date(parseInt(str.toString()))).format('YYYY-MM-DD HH:mm:ss')
            } else {
                return ''
            }
        }
    },
    data () {
        return {
            loading: false,
            error: false,
            changeType: {
                show: false,
                btnPosition: {
                    x: 0,
                    y: 0
                }
            },
            list: [],
            finished: false,
            refreshing: false,
            activeTypeIndex: 0,
            ajaxData: {
                page_no: 1,
                page_size: 20
            }
        }
    },
    computed: {
        msgData () {
            return this.$store.state.msgData
        }
    },
    mounted () {
        this.updateMineDot(false)
        if (this.isPC) {
            this.getMsgTotal([])
        }
    },
    methods: {
        ...mapMutations({
            updateMineDot: 'UPDATE_msgDataMineDot',
            updateMsgList: 'UPDATE_msgTypeList'
        }),
        ...mapActions(['getMsgTotal']),
        changeShowList (index) {
            this.activeTypeIndex = index
            this.changeType.show = false
            this.onRefresh()
        },
        showMemu () {
            const position = getElementPagePosition(this.$refs.activeBtn)
            this.changeType.btnPosition = {
                x: position.x - 50,
                y: position.y + this.$refs.activeBtn.offsetHeight + 20
            }
            this.changeType.show = true
        },
        msgSign (params) {
            msgSign({
                ids: params.id
            })
                .then(res => {
                    if (res.code === 1 && res.data) {
                        const msgTypeList = JSON.parse(JSON.stringify(this.msgData.msgTypeList))
                        if (params.id) {
                            params.status = 'YES'
                            msgTypeList.forEach(typeItem => {
                                if (typeItem.code === 'all') {
                                    typeItem.msgNum -= 1
                                }
                                if (typeItem.code === params.type) {
                                    typeItem.msgNum -= 1
                                }
                            })
                            this.updateMsgList(msgTypeList)
                        } else {
                            this.getMsgTotal(msgTypeList).then(res => {
                                if (res.code === 1) {
                                    this.list.forEach(item2 => {
                                        item2.status = 'YES'
                                    })
                                }
                            })
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        toRead (item) {
            if (item.status === 'NO') {
                this.msgSign(item)
            }
            if (this.isPC) {
                if (item.redirect_type === '2') {
                    window.open(item.redirect_url, '_blank')
                }
                return
            }
            if (item.redirect_type === '1') {
                // 内部地址
                this.$router.push(item.redirect_url)
            } else if (item.redirect_type === '2') {
                // 外部地址

                this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: item.redirect_url, title: item.title } })
            }
        },
        onLoad () {
            if (this.refreshing) {
                this.list = []
                this.refreshing = false
            }
            msgPages(
                Object.assign(
                    {
                        types: this.activeTypeIndex === 0 ? '' : this.msgData.msgTypeList[this.activeTypeIndex].code
                    },
                    this.ajaxData
                )
            )
                .then(res => {
                    if (res.code !== 1) {
                        this.loading = false
                        this.finished = true
                        return
                    }
                    const dataList = res.data
                    dataList.data.forEach(item => {
                        item.content = replaceMsgContent(item.content)
                        // debugger
                        if (item.content.length > 100 && item.redirect_type === '0') {
                            item.hiddenMore = 1
                        }
                    })
                    if (this.ajaxData.page_no <= 1) {
                        this.list = dataList.data
                    } else {
                        this.list = this.list.concat(dataList.data || [])
                    }
                    this.ajaxData.page_no += 1
                    if (dataList.page_no >= dataList.page_total) {
                        this.finished = true
                    }
                    this.loading = false
                })

                .catch(error => {
                    this.loading = false
                    this.finished = true
                    console.log(error)
                })
        },
        onRefresh () {
            this.finished = false
            this.loading = true
            this.list = []
            this.ajaxData = {
                page_no: 1,
                page_size: 20
            }
            this.onLoad()
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@m/sass/mixin.scss';
.m-msgList {
    height: 80%;
    &.pc{
        padding-top:36px;
        .topNav{
            position: fixed !important;
            top: 60px;
            width: 400px;
            right: 60px;
            left: initial;
        }
    }
    .content {
        height: 100%;
        margin-top: rem(90px);
    }
    .finished {
        padding: rem(30px) 0;
        text-align: center;
        font-size: rem(24px);
        color: #999;
    }
    .m-accountMenu {
        .menus {
            width: rem(360px);
            padding: rem(10px) rem(30px);
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #333;
                font-size: rem(30px);
                padding: rem(24px) 0;
            }
        }
    }
    .m-accountChange {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            margin-top: -0.0533333333rem;
            right: rem(-30px);
            width: 0;
            height: 0;
            border-style: solid;
            border-width: rem(10px) rem(10px) 0 rem(10px);
            border-color: #000000 transparent transparent transparent;
        }
        &.open {
            &::after {
                transform: rotate(180deg);
            }
        }
    }
    .rightBtn {
        color: #666;
        font-size: rem(28px);
    }
    .flg {
        display: inline-block;
        position: relative;
        top: rem(-3px);
        vertical-align: middle;
        width: rem(72px);
        height: rem(40px);
        border-radius: rem(20px);
        background-color: #e95a5a;
        overflow: hidden;
        color: #fff;
        font-size: rem(24px);
        text-align: center;
        line-height: rem(40px);
    }
    .m-list {
        min-height: 100%;
        .item {
            padding: rem(20px) rem(30px);
            background-color: #fff;
            margin-top: rem(20px);
            &.ready {
                .title,
                .body,
                .other {
                    color: #cdcdcd;
                }
                .body {
                    .showMore {
                        span {
                            color: #cdcdcd;
                        }
                    }
                }
            }
            .title {
                font-size: rem(30px);
                color: #333;
                font-weight: 500;
                margin-bottom: rem(20px);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .body {
                position: relative;
                font-size: rem(28px);
                color: #666;
                font-weight: 500;
                margin-bottom: rem(20px);
                line-height: rem(40px);
                word-break: break-all;
                &.noLink {
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &.hidden {
                    overflow: hidden;
                }
                &.show {
                    padding-bottom: rem(60px);
                }
                .showMore {
                    position: absolute;
                    right: 0;
                    bottom: rem(-5px);
                    line-height: rem(40px);
                    background-color: #fff;
                    color: #606e86;
                    padding: rem(5px);
                    cursor: pointer;
                    span {
                        color: #666;
                        padding-right: rem(8px);
                    }
                }
            }
            .other {
                display: flex;
                justify-content: space-between;
                color: #9999;
                font-size: rem(24px);
                .more {
                    cursor: pointer;
                    color: #606e86;
                    i {
                        position: relative;
                        top: rem(5px);
                    }
                }
            }
        }
    }
}
</style>
