const viewPath = '@/pages/mobile/views'
export default [
    {
        path: '',
        name: 'MineIndex',
        component: () => import(viewPath + '/mine/index.vue'),
        meta: { title: '我的', cache: true, pageFull: true, haveNav: true },
        children: [
            {
                path: 'setting',
                name: 'Setting',
                component: () => import(viewPath + '/mine/setting.vue'),
                meta: { title: '设置' }
            },
            {
                path: 'warning',
                name: 'Warning',
                component: () => import(viewPath + '/mine/warning.vue'),
                meta: { title: '指标预警' }
            },
            {
                path: 'positionClose',
                name: 'PositionClose',
                component: () => import(viewPath + '/mine/positionClose.vue'),
                meta: { title: '平仓设置' }
            },
            {
                path: 'messages',
                name: 'Messages',
                component: () => import(viewPath + '/mine/messages.vue'),
                meta: { title: '消息中心' }
            }
        ]
    }
]
