<template>
    <van-calendar
        ref='calendar'
        v-model='localShow'
        :allow-same-day='true'
        class='calendar'
        color='#497FD3'
        :default-date='value'
        :formatter='formatter'
        :max-date='maxDate'
        :max-range='maxRange'
        :min-date='minDate'
        :range-prompt='rangePrompt'
        :round='false'
        :row-height='isPC ? 48 : rowHeight'
        :show-mark='false'
        :show-title='false'
        type='range'
        @closed='onClosed'
        @confirm='onDateConfirm'
    />
</template>

<script>
import { Calendar } from 'vant'
import dayjs from 'dayjs'
import { i18n } from '@m/lang'
import pcMixin from '@m/mixins/pc'
const TODAY = dayjs().startOf('d')
export default {
    components: {
        [Calendar.name]: Calendar
    },
    mixins: [pcMixin],
    props: {
        value: {
            type: Array,
            default: () => [TODAY.subtract(1, 'day').toDate(), TODAY.toDate()]
        },
        show: {
            type: Boolean,
            default: false
        },
        minDate: {
            type: Date,
            default: () => TODAY.subtract(2, 'year').toDate()
        },
        maxDate: {
            type: Date,
            default: () => TODAY.toDate()
        },
        maxRange: {
            type: [String, Number],
            default: 92
        },
        rangePrompt: {
            type: String,
            default: i18n.t('fundingDetails.rangePrompt')
        }
    },
    data () {
        return {
            localShow: false,
            rowHeight: (window.innerWidth / 7).toFixed(0),
        }
    },
    watch: {
        localShow (bool) {
            this.$emit('update:show', bool)
        },
        show (bool) {
            this.localShow = bool
        }
    },
    methods: {
        onClosed () {
            this.$refs.calendar.reset()
        },
        onDateConfirm (date) {
            this.$emit('confirm', date)
            this.localShow = false
        },
        formatter (day) {
            switch (day.type) {
                case 'start-end': {
                    day.bottomInfo = ''
                }
                case 'start': {
                    day.bottomInfo = ''
                }
                case 'end': {
                    day.bottomInfo = ''
                }
            }
            return day
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.calendar {
    height: 500px;
    ::v-deep {
        .van-calendar__day--start-end {
            background-color: #497fd3;
        }
        .van-calendar__body{
            @include scroll();
        }
        .van-calendar__day--start + .van-calendar__day--end,
        .van-calendar__day--start + .van-calendar__day--middle {
            position: relative;
            &:before {
                content: "";
                position: absolute;
                left: -50%;
                top: 0;
                width: 50%;
                height: 100%;
                background: #497fd3;
                opacity: 0.1;
            }
        }

        .van-calendar__day--end {
            position: relative;
            z-index: 0;
            &:after {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                height: 100%;
                background: #497fd3;
                opacity: 0.1;
                z-index: -1;
            }
        }
    }
}
</style>
