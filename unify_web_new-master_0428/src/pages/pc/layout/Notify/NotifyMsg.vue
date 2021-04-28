<template>
    <div>
        <BonusNews ref='banus' />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { msgSign } from '@/api/msg'
import { replaceMsgContent } from '@/utils/index'
import BonusNews from '@m/layout/Notify/BonusNews'
export default {
    name: 'NotifyMsg',
    components: {
        BonusNews
    },
    data () {
        return {
            show: false,
            newMsg: 0,
            msgContent: {},
            timer: null,
            bonus: {}
        }
    },
    methods: {
        ...mapActions(['getMsgTotal']),
        clickMsg () {
            if (this.newMsg === 1 && this.msgContent.type !== 'DELAY_MESSAGE') {
                if (this.msgContent.redirect_type == 1) {
                    this.$router.push(this.msgContent.redirect_url)
                } else if (this.msgContent.redirect_type == 2) {
                    this.$router.push({ name: 'Nest', params: { id: 'queryinfo' }, query: { url: this.msgContent.redirect_url, title: this.msgContent.title } })
                } else {
                    this.$router.push({ name: 'MsgList' })
                }
            } else {
                this.$router.push({ name: 'MsgList' })
            }
            this.closeMsg()
        },
        showMsg () {
            this.notify()
            //  debugger
            if (this.newMsg == 1 && this.msgContent.type != 'DELAY_MESSAGE') {
                msgSign({ ids: this.msgContent.id })
                    .then(res => {
                        this.getMsgTotal([])
                    })
                    .catch(error => error)
            }
        },
        closeMsg () {
            this.newMsg = 0
            this.notifyVM.close()
        },
        wsMessage (evt) {
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) {
                return
            }
            const { msg_code, content } = JSON.parse(evt.data)
            if (msg_code === 'Notice' || msg_code === 'AccountUpdate') {
                this.getMsgTotal([])
            }
            if (msg_code === 'Notice') {
                //    console.log('我收到Notice', msg_code, content)
                //   debugger
                const ACTIVITY_REAL_TYPELIST = ['ACTIVITY_REAL_GOLDE_EXPERIENCE_RESET', 'ACTIVITY_REAL_GOLDE_EXPERIENCE_RESET_ACCEPT', 'ACTIVITY_REAL_GOLDE_EXPERIENCE_ACCEPT']
                if (ACTIVITY_REAL_TYPELIST.indexOf(content.type) >= 0) {
                    this.$refs.banus.newMsg(content)
                } else {
                    this.newMsg += 1
                    this.msgContent = Object.assign(content, {
                        content: replaceMsgContent(content.content)
                    })
                    this.showMsg()
                }
            }
        },
        notify () {
            const newMsg = this.newMsg
            const msgContent = this.msgContent
            let message = ''
            this.newMsg = 0
            if (newMsg === 1) {
                message = msgContent.content
            } else if (newMsg > 1) {
                message = this.$t('msg.msgTipContent', { newMsg: newMsg })
            }
            this.notifyVM = this.$notify.info({
                title: newMsg > 1 ? this.$t('msg.newMsgTip') : msgContent.title,
                message: message,
                onClick: () => {
                    this.clickMsg()
                },
                duration: 5000
            })
        }
    },
    mounted () {
        this.$options.sockets.onmessage = this.wsMessage
        // this.wsMessage({ "data": '{"code":"0000","content":{"extraData":{"reason":6,"symbolid":553002,"symbol":"Nifty50","orderid":7951473,"swap":0.0,"src_price":111.93,"execute_price":111.95,"type":6,"accountid":2812299,"execute_volume":100.0,"src_volume":100.0,"positionid":2786934,"execute_time":1598494567000,"commission":0.0,"id":4303816,"msg_id":494553715,"profit":2.0,"direction":1},"author":"system","id":1927795,"title":"止盈止损平仓通知","type":"POSITION_TAKE_PROFIT_STOP_LOSS_CLOSE","redirect_type":"0","content":"IXD账户2812299：止盈平仓 买入 100.00 手 Nifty50，成交价 111.950，订单号：7951473，成交时间：<time>1598494567000</time>。","redirect_url":"","notice":true},"msg_code":"Notice","trace":"65462959-0362-46a6-8da8-ab8d5823817c"}' })
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-notify {
    background-color: transparent;
    .content {
        box-shadow: 0px rem(5px) rem(10px) 0px rgba(65, 65, 65, 0.29);
        border-bottom: solid 1px rgba(65, 65, 65, 0.1);
        border-top: solid 1px rgba(65, 65, 65, 0.1);
        border-radius: rem(10px);
        background: #fff;
        margin: rem(5px) rem(20px) 0 rem(20px);
        position: relative;
        .close {
            text-align: center;
            line-height: rem(50px);
            position: absolute;
            right: rem(12px);
            top: rem(19px);
            width: rem(50px);
            height: rem(50px);
            color: #cacbcf;
            font-size: rem(20px);
        }
        .layout-1 {
            padding: rem(26px) rem(30px);
        }
        .title {
            font-size: rem(30px);
            color: #333;
            font-weight: 500;
            .icon {
                margin-right: rem(20px);
                color: #497fd3;
            }
        }
        .msg {
            margin-top: rem(26px);
            color: #666;
            font-size: rem(28px);
            line-height: rem(40px);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            a {
                color: #666;
            }
        }
    }
}
</style>
