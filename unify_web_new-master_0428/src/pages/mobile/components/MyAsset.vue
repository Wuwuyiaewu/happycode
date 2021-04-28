<template>
    <div class='m-myAsset'>
        <div v-if='isExperience && showExperienceTip && showAsset' class='m-experienceTip'>
            <van-notice-bar class='content' mode='closeable' wrapable @close='closeNotice'>
                {{ $t('activity.upgradeAccountTip',[$t(activateTime?'activity.recharge':'activity.upgradeAccount')]) }}
            </van-notice-bar>
        </div>
        <div v-if='showAsset' class='showMore'>
            <template>
                <div class='header-wrap' @click="_collect('$资产');showMyAsset= true">
                    <span class='title'>
                        {{ $t('trade.accountOverview') }}({{ symbolCode }})
                    </span>
                    <i class='icon van-icon van-icon-arrow'></i>
                </div>
                <ExperienceAsset v-if='isExperience' />
                <div v-else class='flex-content'>
                    <div class='item'>
                        <div class='sub'>
                            {{ $t('trade.balance') }}
                        </div>
                        <div class='number'>
                            {{ $store.state.ix_user.userLoginInfo.balance | moneyAccuracy(false) }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='sub'>
                            {{ $t('trade.freeMargin') }}
                        </div>
                        <div class='number'>
                            {{ assetAboutInfo.accountData.kybzj | moneyAccuracy(false) }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <template v-else-if='userLoginInfo && userLoginInfo.account_no'>
            <div class='assetIcon' :class='[assetAboutInfo.colorClass]' @click="_collect('$资产');showMyAsset= true">
                <i class='icon_icon_assets'></i>
                <div class='other'>
                    <span>{{ $t('trade.asset') }}</span>
                </div>
            </div>
        </template>
        <van-popup v-model='showMyAsset' class='popup-myAsset' get-container='body' position='top'>
            <div v-if='showMyAsset' class='layout-1'>
                <div class='title'>
                    {{ language=='en-US'?$t('trade.asset'):$t('trade.my') }}
                </div>
                <div class='item-1'>
                    <AccountChange />
                </div>
                <template v-if='/^(\-|\+)?\d+(\.\d+)?$/.test(assetAboutInfo.accountData.jyk)'>
                    <!-- <error-tips
                        v-if="assetAboutInfo.colorClass == 'stopout' && assetAboutInfo.accountData.csbzj >=0 && accountData.positionList.length>0"
                        :type="assetAboutInfo.colorClass"
                        class="errorTips"
                    />-->
                    <div class='warp'>
                        <div v-if="accountInfo.accountType === 'real' && assetAboutInfo.accountData.jz ==0 && userLoginInfo.balance ==0" class='m-empty'>
                            <ListEmpty icon='icon_icon_blank_assets' :txt="$t('trade.marginEmpty')" />
                        </div>
                        <div v-else>
                            <div class='subTitle'>
                                {{ $t('trade.marginLevel') }}
                            </div>
                            <div class='item-3' :class='assetAboutInfo.colorClass'>
                                <div class='progress-base'>
                                    <div class='progress-color' :style="{ width: percent.all.position+'%' }"></div>
                                    <div class='number'>
                                        {{ percent.all.number }}
                                    </div>
                                    <!-- <div class="tipWords">
                                        <div v-if="accountData.positionList && accountData.positionList.length>0" class="tip tip-1" :style="{'left':percent.stopOut.position}">
                                            <div class="txt">触发强平</div>
                                        </div>
                                          <div v-if="marginLevel.marginWarn && accountData.positionList && accountData.positionList.length>0" class="tip tip-2" :style="{'left': percent.warn.position}">
                                            <div class="txt">部分持仓危急</div>
                                        </div>
                                        <div v-if="marginLevel.marginLess && accountData.positionList && accountData.positionList.length>0" class="tip tip-3" :style="{'left': percent.less.position}">
                                            <div class="txt">保证金不足,需追加</div>
                                        </div>
                                    </div>-->
                                </div>
                            </div>
                            <div class='subTitle'>
                                {{ $t('trade.assetDistribute') }}
                                <span>（{{ $t('trade.unit') }} : {{ symbolCode }}）</span>
                            </div>
                            <div class='percent'>
                                <SvgPercent v-if="assetAboutInfo.accountData.jz !== ''" :data-list='dataList' :jz='assetAboutInfo.accountData.jz' />
                            </div>
                            <div class='percent-info'>
                                <div class='item'>
                                    <div class='title'>
                                        {{ $t('trade.profit') }}
                                    </div>
                                    <div
                                        class='val'
                                        :class="{
                                            'riseColor':assetAboutInfo.accountData.jyk>0,
                                            'fallColor':assetAboutInfo.accountData.jyk<0 }"
                                    >
                                        {{ assetAboutInfo.accountData.jyk | moneyAccuracy }}
                                    </div>
                                </div>
                                <div class='item'>
                                    <div class='title'>
                                        {{ $t('trade.freeMargin') }}
                                    </div>
                                    <div class='val val2'>
                                        {{ assetAboutInfo.accountData.kybzj | moneyAccuracy(false) }}
                                    </div>
                                </div>
                                <div class='item'>
                                    <div class='title'>
                                        {{ $t('trade.originalMargin') }}
                                    </div>
                                    <div class='val val3'>
                                        {{ assetAboutInfo.accountData.csbzj | moneyAccuracy(false) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <van-button
                            v-if="accountInfo.accountType === 'real'"
                            v-prophet="['trackEvent', '交易', '资产', '资产_入金', 73]"
                            class='btn'
                            :color='style.mainColor'
                            size='large'
                            type='primary'
                            @click="toIframePage('deposit');_collect('我的资产_入金', true)"
                        >
                            {{ $t('trade.deposit') }}
                        </van-button>
                        <template v-else>
                            <van-button
                                v-if='accountInfo.accountNo && !(isExperience && !activateTime)'
                                class='btn'
                                :color='style.mainColor'
                                size='large'
                                type='primary'
                                @click='changeToReal'
                            >
                                {{ $t('trade.toReal') }}
                            </van-button>
                            <!-- 不需要显示开通真实账户按钮 -->
                            <!--<van-button
                                v-else
                                class="btn"
                                type="primary"
                                :color="style.mainColor"
                                size="large"
                                @click="toIframePage('openreal')"
                            >{{$t('trade.openReal')}}</van-button>-->
                        </template>
                    </div>
                </template>
                <div v-else class='m-loading'>
                    <van-loading size='30px'>
                        {{ $t('calculating') }}
                    </van-loading>
                </div>
            </div>
            <div class='layout-2' @click='showMyAsset=false'>
                <div class='close'>
                    <i class='van-icon van-icon-arrow-up'></i>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { localGet, localSet } from '@/utils/index'
import { mapGetters } from 'vuex'
import SvgPercent from '@m/components/SvgPercent.vue'
import AccountChange from '@m/components/AccountChange.vue'
// import ErrorTips from '@m/components/ErrorTips.vue'
import ListEmpty from '@m/components/ListEmpty'
import ExperienceAsset from '@m/components/ExperienceAsset'
export default {
    name: 'MyAsset',
    components: {
        SvgPercent,
        AccountChange,
        // ErrorTips,
        ListEmpty,
        ExperienceAsset
    },
    props: {
        showAsset: {
            type: Boolean,
            defaults: false
        }
    },
    data () {
        return {
            showMyAsset: false,
            localNoticeTipTime: 0
        }
    },
    created () {
        this.localNoticeTipTime = localGet('assetNotice') ? Number(localGet('assetNotice')) : 0
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo', 'symbolCode', 'accountData', 'isExperience', 'activateTime']),
        dataList () {
            return [
                {
                    color: '#477FD3',
                    value: Math.abs(this.assetAboutInfo.accountData.kybzj)
                },
                {
                    color: '#F39800',
                    value: Math.abs(this.assetAboutInfo.accountData.csbzj)
                },
                {
                    color: this.assetAboutInfo.accountData.jyk > 0 ? this.style.riseColor : this.style.fallColor,
                    value: Math.abs(this.assetAboutInfo.accountData.jyk)
                }
            ]
        },
        userLoginInfo () {
            return this.$store.state.ix_user.userLoginInfo
        },
        language () {
            const companyInfo = this.$store.state.ix_baseInfo.companyInfo
            return companyInfo.transBaseConfigVo ? companyInfo.transBaseConfigVo.language : 'zh-CN'
        },
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.toKenCompanyInfoVo : {}
        },
        marginLevel () {
            const transBaseConfigVo = this.$store.state.ix_user.info ? this.$store.state.ix_user.info.transBaseConfigVo : {}
            if (transBaseConfigVo.marginLevel) {
                return JSON.parse(transBaseConfigVo.marginLevel)
            } else {
                return {}
            }
        },
        accInfo () {
            return this.$store.state.accInfo
        },
        percent () {
            const stopOut = '10'
            const allPostion = (this.assetAboutInfo.accountData.jz / this.userLoginInfo.margin_stop_out * 10).toFixed(2)
            return {
                all: {
                    position: allPostion > 100 ? '100' : allPostion,
                    number: this.assetAboutInfo.accountData.csbzj <= 0 ? '--' : (this.assetAboutInfo.accountData.jz.toFixed(2) / this.assetAboutInfo.accountData.csbzj * 100).toFixed(2) + '%'
                },
                // less: {
                //     position: `calc(${stopOut * this.marginLevel.marginLess / 100}% - 4px)`
                // },
                // warn: {
                //     position: `calc(${stopOut * this.marginLevel.marginWarn / 100}% - 4px)`
                // },
                stopOut: {
                    position: `calc( ${stopOut}% - 4px )`
                }
            }
        },
        showExperienceTip () {
            if (Date.now() - this.localNoticeTipTime > 24 * 60 * 60 * 1000 > 0 && this.assetAboutInfo.accountData.jz > this.accInfo.upgradeAccountTipsStart) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        toIframePage (flg) {
            if (flg === 'deposit') {
                this.$router.push({ name: 'DepositFunds' })
            } else if (flg === 'drawings') {
                this.$router.push({ name: 'WithAmount' })
            } else if (flg === 'opendemo' || flg === 'openreal') {
                this.$router.push({ name: 'OpenAccount', params: { id: flg } })
            } else {
                this.$router.push({ name: 'Nest', params: { id: flg } })
            }

            this.showMyAsset = false
        },
        changeToReal () {
            this.$ws.send_switchAccount()
        },
        closeNotice () {
            this.localNoticeTipTime = Date.now()
            localSet('assetNotice', this.localNoticeTipTime)
        }
    }
}
</script>

<style scoped lang="scss">
@import "~@m/sass/mixin.scss";
.m-experienceTip {
    .content {
        background-color: #FEF8ED;
        color: #F39801;
        font-size: rem(24px);
        // height: rem(40px);
        border-radius: rem(10px);
        margin-bottom: rem(14px);
        padding: rem(16px) rem(20px);
        line-height: 1.4;
    }
}
.m-myAsset {
  width: 100%;
  .assetIcon {
    right: 0;
    bottom: 0;
    height: 100%;
    line-height: rem(90px);
    .other {
      position: relative;
      top: rem(-5px);
      display: inline-block;
      margin-left: rem(10px);
      font-size: rem(28px);
      line-height: rem(50px);
      i {
        font-size: rem(24px);
        margin-left: rem(10px);
      }
    }
    &.adequate {
      color: #11b873;
    }
    &.less {
      color: #f39800;
    }
    &.stopout {
      color: #e3525c;
    }
    i {
      font-size: rem(45px);
    }
  }
  .showMore {
    background-color: #f9f9f9;
    box-sizing: border-box;
    padding: rem(30px) rem(40px) rem(15px);

    .header-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title,
      .icon {
        line-height: rem(32px);
      }
      .title {
        font-size: rem(30px);
      }
      .icon {
        position: relative;
        right: rem(-4px);
      }
    }
    .flex-content {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: rem(20px) 0 0;
      border-radius: rem(5px);
      .item {
        flex: 1;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
      .sub {
        color: #333333;
        font-size: rem(24px);
        // margin-bottom: rem(10px);
      }
      .number {
        color: #477fd3;
        font-size: rem(46px);
      }
    }
  }
}
.popup-myAsset {
  background-color: transparent;
  .m-empty {
    padding: rem(100px) 0;
  }
  .layout-1 {
    background-color: #fff;
    color: #333333;
    .warp {
      max-height: 70vh;
      overflow-y: auto;
      padding: rem(40px) rem(30px);
      padding-top: 0;
      @include scroll();
    }
    .title {
      padding-top: rem(30px);
      text-align: center;
      font-size: rem(30px);
    }
    .subTitle {
      font-size: rem(28px);
      margin-bottom: rem(30px);
      span {
        padding-left: rem(10px);
        font-size: rem(20px);
      }
    }
    .percent {
      position: relative;
      text-align: center;
    }
    .errorTips {
      margin-bottom: rem(30px);
    }
    .item-1 {
      text-align: center;
      margin-top: rem(10px);
      margin-bottom: rem(40px);
    }
    .item-3 {
      position: relative;
      padding-bottom: rem(20px);
      /* .tipWords {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: inline-block;
                    width: 100%;
                    .txt {
                        position: absolute;
                        left: rem(-90px);
                        font-size: rem(20px);
                        width: rem(180px);
                        text-align: center;
                        color: #999999;
                    }
                    .tip {
                        position: absolute;
                        top: 0;
                        display: inline-block;
                        &::after {
                            content: '';
                            position: absolute;
                            left: 50%;
                            display: inline-block;
                            z-index: 20;
                            width: 1px;
                            background-color: #999999;
                        }
                        &::before {
                            content: '';
                            position: absolute;
                            left: 50%;
                            margin-left: -2px;
                            bottom: rem(30px);
                            display: inline-block;
                            z-index: 19;
                            width: 5px;
                            height: rem(10px);
                            top: 0;
                            background-color: #fff;
                        }
                        &.tip-1,&.tip-3{
                            &::after {
                                height: rem(35px);
                            }
                            .txt {
                                top: rem(35px);
                            }
                        }
                        &.tip-2{
                            &::after {
                                height: rem(65px);
                            }
                            .txt {
                                top: rem(65px);
                            }
                        }
                    }
                }*/
      .progress-base {
        position: relative;
        display: inline-block;
        width: 100%;
        height: rem(10px);
        background-color: #efefef;
        border-radius: rem(5px);
        .progress-color {
          position: absolute;
          left: 0;
          top: 0;
          height: rem(10px);
          border-radius: rem(5px);
          width: 50%;
        }
        .number {
          position: absolute;
          z-index: 20;
          right: 0;
          bottom: rem(38px);
          display: inline-block;
          font-size: rem(50px);
        }
      }
      &.adequate {
        .progress-base {
          .progress-color {
            background-color: #10b873;
          }
          .number {
            color: #10b873;
          }
        }
      }
      &.less {
        .progress-base {
          .progress-color {
            background-color: #f39800;
          }
          .number {
            color: #f39800;
          }
          .tip-2 {
            .txt {
              color: #f39800;
            }
          }
        }
      }
      &.stopout {
        .progress-base {
          .progress-color {
            background-color: #e3525c;
          }
          .number {
            color: #e3525c;
          }
          .tip-2 {
            .txt {
              color: #e3525c;
            }
          }
        }
      }
    }
    .percent-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      margin-top: rem(20px);
      padding: 0 rem(40px);
      .title {
        color: #333333;
        font-size: rem(24px);
        padding-bottom: rem(10px);
      }
      .val {
        font-size: rem(34px);
      }
      .val2 {
        color: #477fd3;
      }
      .val3 {
        color: #f39800;
      }
    }
    .btn {
      margin-top: rem(46px);
      height: rem(80px);
      font-size: rem(34px);
      line-height: rem(80px);
      border-radius: rem(40px);
    }
  }
  .layout-2 {
    text-align: center;
    .close {
      display: inline-block;
      width: rem(60px);
      height: rem(80px);
      text-align: center;
      line-height: rem(80px);
      color: #fff;
      font-size: rem(40px);
    }
  }
}
.m-loading {
  padding: rem(30px) 0;
  text-align: center;
}
</style>
