import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import ApplicationAdministration from '../views/ApplicationAdministration.vue'
import MyApplications from '../views/MyApplications.vue'
import SystemSettings from '../views/SystemSettings.vue'
import MyApplication from '../views/MyApplication.vue'
import ConnectApplication from '../views/ConnectApplication.vue'
import CustomiseContract from '../views/CustomiseContract.vue'
import UploadContract from '../views/UploadContract.vue'
import AssetDetails from '../views/AssetDetails.vue'
import Marketplace from '../views/Marketplace.vue'
import FourOFour from '../views/FourOFour.vue'
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
    path: '/admin-app',
    name: 'admin-app',
    components: { default: ApplicationAdministration, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/my-app-settings',
    name: 'my-app-settings',
    components: { default: SystemSettings, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/my-apps',
    name: 'my-apps',
    components: { default: MyApplications, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/my-app/:projectId',
    name: 'my-app',
    components: { default: MyApplication, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/connect-app',
    name: 'connect-app-create',
    components: { default: ConnectApplication, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/connect-app/:projectId',
    name: 'connect-app-edit',
    components: { default: ConnectApplication, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/customise-contract/:projectId',
    name: 'customise-app-contract',
    components: { default: CustomiseContract, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/upload-contract/:projectId',
    name: 'upload-app-contract',
    components: { default: UploadContract, header: MainNavbar, footer: MainFooter }
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
  },
  {
    path: '/404',
    name: '404',
    components: { default: FourOFour, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '*',
    redirect: { path: '/404' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
