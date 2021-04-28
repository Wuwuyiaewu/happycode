<template>
    <div class='category'>
        <top>{{ title }}</top>
    </div>
</template>

<script>
import Top from '@m/layout/top'
export default {
    data () {
        return {
            title: ''
        }
    },
    computed: {
        name () {
            return this.data
        }
    },
    created () {
        this.title = this.$route.query.title
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
</style>
