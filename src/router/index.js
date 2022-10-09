
import { createRouter, createWebHashHistory } from 'vue-router'
// import CesiumContainer from "../views/CesiumContainer.vue";
import CesiumContainer from '../components/views/CesiumContainer.vue'
import CesiumRadarScan from '../components/views/CesiumRadarScan.vue'
import AnimationGroup from '../components/views/misc_animation_groups'
import AnimationBinding from '../components/views/AnimationBinding'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Home/login.vue')
  },
  {
    path: '/animationgroup',
    name: 'Animationgroup',
    component: AnimationGroup
  },
  {
    path: '/register',
    component: () => import('../views/Home/register/index.vue'),
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/CesiumContainer',
    name: 'CesiumContainer',
    component: () => import('../components/views/CesiumContainer.vue')// 路由懒加载，直接在这里引入了CesiumContainer并且赋值给了component;
  },
  {
    path: '/radarscan',
    name: 'CesiumRadarScan',
    // component: CesiumRadarScan
    component: () => import('../components/views/CesiumRadarScan.vue')
  },
  {
    path: '/animationgroup',
    name: 'AnimationGroup',
    component: AnimationGroup
  },
  {
    path: '/animationbinding',
    name: 'AnimationBinding',
    component: AnimationBinding
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
