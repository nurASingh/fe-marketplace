import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import Marketplace from '../views/Marketplace.vue'
import MainNavbar from '@/components/layout/MainNavbar.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Homepage',
    components: { default: Homepage, header: MainNavbar }
  },
  {
    path: '/marketplace',
    name: 'Marketplace',
    components: { default: Marketplace, header: MainNavbar }
  },
  {
    path: '/marketplace1',
    name: 'Marketplace',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Marketplace.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
