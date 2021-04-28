<!-- 结算时间 -->
<template>
    <div class='end_of_day'>
        <p v-for='(item,i) in eod' :key='i'>
            <span>{{ $t('week.' + item.weekday) }} &nbsp;</span>
            <span>{{ minusToTime(item.start_time) }}</span>
        </p>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    props: ['eod_time'],
    data () {
        return {
            eod: []
        }
    },
    created () {
        this.eodFormat()
    },
    methods: {
        eodFormat () {
            const timeZone = dayjs().utcOffset()
            this.eod = JSON.parse(JSON.stringify(this.eod_time)).map(item => {
                item.start_time = item.start_time + timeZone
                const w = parseInt(item.start_time / 1440)
                item.start_time = item.start_time % 1440
                item.weekday = (item.weekday + w) % 7
                return item
            }).sort((a, b) => a.weekday - b.weekday)
        },
        minusToTime (number) {
            const hours = (Math.floor(number / 60) > 9 ? '' : '0') + Math.floor(number / 60).toString()
            const minute = (number % 60 > 9 ? '' : '0') + (number % 60).toString()
            return hours + ':' + minute
        },
    },
}
</script>

<style lang="scss" scoped>
.end_of_day {
    display: block;
}
</style>
