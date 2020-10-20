import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import ApplicationAdministration from '../views/ApplicationAdministration.vue'
import ConnectApplicationWithContract from '../views/ConnectApplicationWithContract.vue'
import ConnectApplicationWithoutContract from '../views/ConnectApplicationWithoutContract.vue'
import ConnectApplication from '../views/ConnectApplication.vue'
import AssetDetails from '../views/AssetDetails.vue'
import Marketplace from '../views/Marketplace.vue'
import MainNavbar from '@/components/layout/MainNavbar.vue'
import MainFooter from '@/components/layout/MainFooter.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'homepage',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/app-admin',
    name: 'app-admin',
    components: { default: ApplicationAdministration, footer: MainFooter }
  },
  {
    path: '/connect-app',
    name: 'connect-app',
    components: { default: ConnectApplication, header: MainNavbar }
  },
  {
    path: '/connect-app-with-contract',
    name: 'connect-app-with-contract',
    components: { default: ConnectApplicationWithContract, header: MainNavbar }
  },
  {
    path: '/connect-app-with-contract/:contractId',
    name: 'connect-app-with-contract-edit',
    components: { default: ConnectApplicationWithContract, header: MainNavbar }
  },
  {
    path: '/connect-app-without-contract',
    name: 'connect-app-without-contract',
    components: { default: ConnectApplicationWithoutContract, header: MainNavbar }
  },
  {
    path: '/assets/:assetHash',
    name: 'asset-details',
    components: { default: AssetDetails, header: MainNavbar }
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    components: { default: Marketplace, header: MainNavbar }
  },
  {
    path: '/marketplace1',
    name: 'marketplace',
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
