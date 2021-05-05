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
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/brazil',
        name: 'brazil',
        component: () =>
            import ('../views/Brazil.vue')
    },
    {
        path: '/panama',
        name: 'panama',
        component: () =>
            import ( /* webpackChunkName: "panama" */ '../views/Panama')
    },
    {
        path: '/jamaica',
        name: 'jamaica',
        component: () =>
            import ( /* webpackChunkName: "jamaica" */ '../views/Jamaica')
    },
    {
        path: '/hawaii',
        name: 'hawaii',
        component: () =>
            import ( /* webpackChunkName: "Hawaii" */ '../views/Hawaii')
    },
    {
        path: '/Detail',
        name: 'destinationDetail',
        component: () =>
            import ( /* webpackChunkName: "DestinationDetail" */ '../views/DestinationDetail')
    },
]

const router = new VueRouter({
    linkExactActiveClass: "router-act",
    routes
})

export default router