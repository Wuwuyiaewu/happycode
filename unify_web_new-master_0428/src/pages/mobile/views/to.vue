<template>
    <div>
    </div>
</template>

<script>

export default {
    created () {
        const _this = this
        this.$bus.$on('USER_AUTO_LOGIN_END', () => {
            const query = _this.$route.query
            if (query.path) {
                setTimeout(() => {
                    _this.$router.replace({ name: 'Mine' }).then(() => {
                        _this.$router.push(decodeURIComponent(query.path))
                    })
                }, 100)
            }
        })
    },
}
</script>

<style lang="scss" scoped>

</style>
