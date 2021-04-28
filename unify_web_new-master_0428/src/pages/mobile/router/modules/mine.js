export default [
    {
        path: '',
        name: 'MineIndex',
        component: () => import('@m/views/mine/index.vue'),
        meta: { title: '我的', cache: true, pageFull: true, haveNav: true },
        children: [
            {
                path: 'setting',
                name: 'Setting',
                component: () => import('@m/views/mine/setting.vue'),
                meta: { title: '设置' }
            },
            {
                path: 'warning',
                name: 'Warning',
                component: () => import('@m/views/mine/warning.vue'),
                meta: { title: '指标预警' }
            },
            {
                path: 'positionClose',
                name: 'PositionClose',
                component: () => import('@m/views/mine/positionClose.vue'),
                meta: { title: '平仓设置' }
            },
            {
                path: 'messages',
                name: 'Messages',
                component: () => import('@m/views/mine/messages.vue'),
                meta: { title: '消息中心' }
            }
        ]
    }
]
