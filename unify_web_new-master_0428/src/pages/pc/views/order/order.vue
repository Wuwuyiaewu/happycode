<template>
    <div>
        <h2>下单页面</h2>
        <p>
            <a href='javascript:;' @click="$router.push({ name: 'Layout' })">
                首页
            </a>
        </p>
        <div>
            <a href='javascript:;' @click="$router.push({ name: 'MsgList' })">
                消息中心
            </a>
        </div>
        <a href='javascript:;' @click='$router.back()'>
            返回
        </a>
    </div>
</template>

<script>
export default {
    name: 'Order'
}
</script>

<style lang="scss" scoped>
</style>
