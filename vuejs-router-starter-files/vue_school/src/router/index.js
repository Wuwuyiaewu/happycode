import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/detail/:sl',
        name: 'DestinationDetails',
        component: () =>
            import ( /* webpackChunkName: "DestinationDetails" */ '../views/DestinationDetail')
    },
]

const router = new VueRouter({
    linkExactActiveClass: "router-act",
    routes
})

export default router