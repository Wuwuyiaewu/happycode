<template>
    <van-popup
        :close-on-click-overlay='false'
        closeable
        :get-container='getContainer'
        round
        :value='show'
        @click-close-icon='onClose'
        @closed='closed'
    >
        <div class='content'>
            <span class='type'>
                {{ $t('productInfo.mainStudy') }}
            </span>
            <!-- :style="{ 'font-size': (1/item.label.length/6) + 24/75+'rem' }" -->
            <div class='list'>
                <span
                    v-for='(item, i) in MAINSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': mainStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >=6 ? '0.28rem': '' } ]"
                    @touchend='onClick("main", item.name)'
                >
                    {{ item.label }}
                </span>
            </div>

            <span class='type'>
                {{ $t('productInfo.subStudy') }}
            </span>
            <div class='list'>
                <span
                    v-for='(item, i) in SUBSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': subStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >6 ? '0.28rem': '' } ]"
                    @touchend='onClick("sub", item.name)'
                >
                    {{ item.label }}
                </span>
            </div>

            <div class='submit' @click='onSubmit'>
                {{ $t('compLang.confirm') }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '../constant'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        propMainStudy: {
            type: String,
            default: ''
        },
        propSubStudy: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            MAINSTUDIES,
            SUBSTUDIES,
            list: [],
            mainStudy: '',
            subStudy: '',
        }
    },
    watch: {
        propMainStudy: {
            immediate: true,
            handler (val) {
                const study = this.MAINSTUDIES.find(e => e.name === val)
                this.mainStudy = study ? val : null
            }
        },
        propSubStudy: {
            immediate: true,
            handler (val) {
                const study = this.SUBSTUDIES.find(e => e.name === val)
                this.subStudy = study ? val : null
            }
        }
    },
    methods: {
        onSubmit () {
            if (this.mainStudy !== this.propMainStudy) {
                this.$emit('removeStudy', 'main')
                this.$emit('createStudy', 'main', this.mainStudy)
            }

            if (this.subStudy !== this.propSubStudy) {
                this.$emit('removeStudy', 'sub')
                this.$emit('createStudy', 'sub', this.subStudy)
            }

            this.onClose()
        },
        onClose () {
            this.$emit('update:show', false)
        },
        closed () {
            this.mainStudy = this.propMainStudy
            this.subStudy = this.propSubStudy
        },
        onClick (type, name) {
            switch (type) {
                case 'main': {
                    this.mainStudy = this.mainStudy === name ? '' : name
                    break
                }
                case 'sub': {
                    this.subStudy = this.subStudy === name ? '' : name
                    break
                }
            }
        },
        getContainer () {
            return document.body
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.van-popup {
    width: 90%;
    max-width: rem(736px);
    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: rem(50px) 0 0;
        .type{
            margin: rem(10px) 0;
            padding: 0 rem(30px);
            font-size: rem(28px);
        }
        .list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: rem(20px);
            padding: 0 rem(25px);
            .item {
                flex: 0 0 rem(112px);
                line-height: rem(40px);
                box-sizing: border-box;
                margin: rem(10px) rem(5px);
                border: 1px solid #d7d7d7;
                font-size: rem(24px);
                font-weight: normal;
                text-align: center;
                &.active{
                    color: #fff;
                    background: $primary;
                    border-color: $primary;
                }
            }
        }

        .submit{
            width: 100%;
            height: rem(70px);
            line-height: rem(70px);
            margin-top: rem(30px);
            text-align: center;
            background: $primary;
            color:#fff;
            box-sizing: border-box;
        }
    }
}
</style>
