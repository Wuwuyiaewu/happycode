<template>
    <div>
        <Html v-if="data.type=='text'" v-html='data.content' />
        <Banner v-else :data='data.uiComponent' />
    </div>
</template>

<script>
import Banner from '@m/components/banner'
import Html from '@m/components/html'
export default {
    components: {
        Banner,
        Html,
    },
    props: {
        data: Object,
    },
}
</script>

<style lang="scss" scoped>
</style>
