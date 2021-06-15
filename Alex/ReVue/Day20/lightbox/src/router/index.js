import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Pic from '../views/Pic.vue'
import PicList from '../views/PicList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pic',
    name: 'PicList',
    component: PicList,
    meta:{
      type:"container",
    }
  },
  {
    path: '/pic/:id',
    name: 'Pic',
    component: Pic,
    meta:{
      type:"content",
      lightbox:false
    }
  },
  
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  let fromMatch = from.matched[0]
  let toMatch = to.matched[0]
  let defaultComponent = null

  if(from.meta.type ==="container" && to.meta.type === "content"){
    defaultComponent = fromMatch.components.default
  }else if(fromMatch.components.lightbox){
    defaultComponent = fromMatch.components.default
    fromMatch.components.default = fromMatch.components.lightbox
    fromMatch.components.lightbox = null
    from.meta.lightbox = false
  }

  if(from.matched.length){
    if(defaultComponent && to.meta.type === "content"){
      toMatch.components.lightbox = toMatch.components.default
      toMatch.components.default = defaultComponent
      to.meta.lightbox = true
    }
  }

next()
})
export default router
