<template>
    <div>
        <van-popup
            v-model='showDialog'
            class='m-dialog m-dialogTips'
            :class='{ pc:isPC }'
            get-container='body'
            :position="isPC?'center':'bottom'"
            @closed='close'
        >
            <div class='dialog-header'>
                <div class='title'>
                    {{ title }}
                </div>
            </div>
            <div class='dialog-body'>
                <div class='words'>
                    {{ tips }}
                </div>
            </div>
            <div class='dialog-footer'>
                <van-button plain @click='close'>
                    {{ cancelTxt }}
                </van-button>
                <van-button color='#477FD3' @click='submit'>
                    {{ confirmTxt }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { i18n } from '@m/lang'
import pcMixin from '@m/mixins/pc'
export default {
    name: 'DialogBottomTip',
    mixins: [pcMixin],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: i18n.t('tip')
        },
        cancelTxt: {
            type: String,
            default: i18n.t('compLang.cancel')
        },
        confirmTxt: {
            type: String,
            default: i18n.t('compLang.confirm')
        },
        tips: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showDialog: false
        }
    },
    watch: {
        'show' (val) {
            this.showDialog = val
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        submit () {
            this.$emit('submit')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.m-dialogTips {
    &.pc{
        width: 400px;
        border-radius: 6px;
            height: 192px;
        .dialog-footer{
            padding-bottom: 20px;
            .van-button{
                margin:0 10px;
                border-radius: 2px;
                &:first-child{
                        background: #F4F7FC;
                        margin-left: 20px;
                }
                &:last-child{
                   margin-right: 20px;
                }
            }
        }
    }
    .dialog-body {
        overflow-y: auto;
        padding-bottom: rem(60px);
        .words {
            font-size: rem(28px);
            text-align: center;
            color: #333;
        }
    }
}
</style>
