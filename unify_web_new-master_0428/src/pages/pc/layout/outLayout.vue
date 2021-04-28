<template>
    <div>
        <router-view :key='$route.path' class='outLayout' />
    </div>
</template>

<script>
export default {
    name: 'OutLayout',
    data () {
        return {}
    },
}
</script>

<style lang="scss" scope>
	.outLayout{
        width: 600px;

    }
</style>
