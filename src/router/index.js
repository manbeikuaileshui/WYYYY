import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 一级路由
  {
    // 页面路径（根路径）
    path: '/',
    // 组件名称
    name: 'Index',
    // 页面路径
    component: ()=> import('../views/Index.vue'),
    // 二级路由
    children: [
      {
        path: 'newhome',
        name: 'NewHome',
        alias:'',
        component: ()=> import('../views/NewHome.vue')
      },
      {
        path: 'hot',
        name: 'Hot',
        component: ()=> import('../views/Hot.vue')
      },
      {
        path: 'search',
        name: 'Search',
        component: ()=> import('../views/Search.vue')
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
