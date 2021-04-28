<template>
    <div>
        <section class='block'>
            <h2 class='title'>
                体验账户特点
            </h2>
            <div class='guide-content'>
                交易盈利及初始余额均可转成升级奖励，最高可领
                <span class='highlight'>
                    {{ $store.state.accInfo.singleMaxGive }}{{ symbolCode }}
                </span>
                <br />
                亏损过大，能“重置账户”继续下单<br />
                有最大余额上限控制，可“升级账户”领取全部余额
            </div>
        </section>

        <section class='block'>
            <h2 class='title'>
                案例
            </h2>
            <div class='guide-content'>
                <ol class='amountDescs'>
                    <li>初始余额：表示体验账户初始余额{{ accInfo.initAmount + symbolCode }}</li>
                    <li>余额上限：表示体验账户余额上限{{ accInfo.maxAmount + symbolCode }}</li>
                    <li>平仓盈利后，可通过“升级账户”领取奖励</li>
                    <li>平仓亏损后，可通过“重置账户”将体验账户余额重置为初始余额{{ accInfo.initAmount + symbolCode }}</li>
                    <li>平仓盈利后，账户余额已超过余额上限{{ accInfo.maxAmount + symbolCode }}，必须“升级账户”保留全部余额，“升级账户”可领取{{ plus(accInfo.maxAmount,100) + symbolCode }}奖励</li>
                </ol>
                <div class='guideImg'>
                    <img alt='' src='../images/playGuideImg1.png' srcset='' />
                    <span class='absolute amount1'>
                        平仓后，账户余额{{ plus(accInfo.maxAmount, 100) + symbolCode }}
                    </span>
                    <span class='absolute amount2'>
                        余额上限 <br /> {{ accInfo.maxAmount + symbolCode }}
                    </span>
                    <span class='absolute amount3'>
                        平仓后，盈利20{{ symbolCode }}
                    </span>
                    <span class='absolute amount4'>
                        初始余额 <br /> {{ accInfo.initAmount + symbolCode }}
                    </span>
                    <span class='absolute amount5'>
                        平仓后，亏损40{{ symbolCode }}
                    </span>
                </div>
            </div>
        </section>

        <section class='block'>
            <h2 class='title'>
                体验账户小知识
            </h2>
            <ul class='smallTips'>
                <li>
                    <p class='ask'>
                        1、体验账户所有账户余额都可以领取吗？
                    </p>
                    <p class='answer'>
                        体验账户单笔最高可领取{{ accInfo.singleMaxGive+symbolCode }}
                    </p>
                </li>
                <li>
                    <p class='ask'>
                        2、可以直接领取体验账户初始余额{{ accInfo.initAmount + symbolCode }}吗？
                    </p>
                    <p class='answer'>
                        可以的，只要您完成“升级账户”即可领取
                    </p>
                </li>
                <li>
                    <p class='ask'>
                        3、当体验账户余额低于初始余额{{ accInfo.initAmount + symbolCode }}时，可以领取吗？
                    </p>
                    <p class='answer'>
                        可以的，不论体验账户余额是多少，只要“升级账户”可领取，但建议您“重置账户”，至少可以领{{ accInfo.initAmount + symbolCode }}哦
                    </p>
                </li>
                <li>
                    <p class='ask'>
                        4、“重置账户会有什么影响”？
                    </p>
                    <p class='answer'>
                        会将账户余额重置{{ accInfo.initAmount + symbolCode }}，并且体验账户持仓全部强平
                    </p>
                </li>
                <li>
                    <p class='ask'>
                        5、“升级账户后会有什么变化”？
                    </p>
                    <p class='answer'>
                        升级账户成功后，体验账户余额恢复至{{ accInfo.initAmount + symbolCode }},并且为空仓状态，可继续使用体验账户交易
                    </p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { plus, minus } from '@/utils/calculation'
export default {
    name: 'PlayGuide',
    computed: {
        ...mapGetters(['symbolCode']),
        ...mapState(['accInfo']),
        balance () {
            return this.$store.state.ix_user.userLoginInfo?.balance
        }
    },
    methods: {
        plus,
        minus,
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.block{
    padding: rem(50px) rem(20px) 0;
    .title{
        padding: 00 rem(30px) rem(30px);
        font-size: rem(34px);
        font-weight: bold;
        color: #333333;
        line-height: 1;
    }
    .guide-content{
        background: #FFFFFF;
        border-radius: rem(10px);
        padding: rem(25px) rem(30px);
        font-size: rem(24px);
        font-weight: 500;
        color: #333333;
        line-height: rem(40px);

    }
    .highlight{
        color: #F39801;
    }
    .smallTips{
        li{
            margin-bottom: rem(20px);
            background: #FFFFFF;
            border-radius: rem(10px);
            padding: rem(25px) rem(30px);
            font-size: rem(24px);
            font-weight: 500;
            color: #333333;
            line-height: rem(40px);
        }
        .ask{
            font-weight: bold;
        }
    }
}
.amountDescs{
    line-height: rem(50px);
    li{
        position: relative;
        padding-left: rem(40px);
        &::before{
            content: "";
            position: absolute;
            left: 0;
            top:rem(12px);
            height: rem(24px);
            width: rem(24px);
            background: #FF6633;
            border-radius: 50%;
        }
    }

    $list: #FF6633 #477FD3 #FC9900 #CE1AE3 #21BE80; //定义颜色数组
    @for $i from 1 through 5 {
        li:nth-child(#{$i}){
            &::before{
                background: nth($list, $i); //数组取值
            }
        }
    }

}
.guideImg{
    margin-top: rem(20px);
    position: relative;
    img{
        width: 100%;
    }
    .absolute{
        position: absolute;
        font-size: rem(24px);
        // color: #21BE80;
        color: #666;
    }
    .amount1{
        top: rem(48px);
        right: rem(25px);
        // color: #21BE80;
    }
    .amount2{
        top: rem(103px);
        left: rem(30px);
        // color: #477FD3;
    }
    .amount3{
        top: rem(204px);
        left: rem(168px);
        // color: #FC9900;
    }
    .amount4{
        top: rem(253px);
        left: rem(30px);
        // color: #FF6633;
    }
    .amount5{
        top: rem(341px);
        right: rem(169px);
        // color: #CE1AE3;
    }
}
</style>
