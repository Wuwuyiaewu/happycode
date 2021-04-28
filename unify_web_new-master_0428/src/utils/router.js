
/**
 * pc端删除路由参数产品oid
 *
 * @export
 * @param {*} router 路由实例
 */

export function removeOid (router) {
    // 删除路由参数oid
    if (router.currentRoute.query.oid) {
        // 通过removeOid临时参数控制全局守卫beforeEach删除oid
        router.replace({
            params: {
                removeOid: true
            }
        })
    }
}
