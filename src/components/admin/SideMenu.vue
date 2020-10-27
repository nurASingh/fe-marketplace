<template>
<div>
    <div class="px-5"><p class="text-sm">My Dashboard</p></div>
    <div class="px-5"><p class="text-sm"><b-icon icon="person-fill"></b-icon> Account</p></div>
    <div class="px-5 pb-4 border-bottom">
      <p class="text-sm"><b-icon icon="wallet2"></b-icon> Wallet</p>
      <div class="ml-4 d-flex justify-content-between">
        <div class="text-light">Balance:</div>
        <div><span class="text-light">STX </span> <span class="text-info">{{ balance }}</span></div>
      </div>
    </div>
    <div class="px-5 pt-4"><p class="text-sm"><b-icon icon="heart"/> Favourites</p></div>
    <div class="px-5"><p class="text-sm"><b-icon icon="bookmarks"/> My Collections</p></div>
    <div class="px-5 pt-4 border-top">
      <p class="text-sm"><router-link to="/admin-app"><b-icon icon="code"/> Connect Application</router-link></p>
    </div>
    <div class="px-5">
      <p class="text-sm" v-if="myProjects.length > 0"><router-link to="/my-apps"><b-icon icon="code-slash"/> My Applications</router-link></p>
    </div>
    <div class="px-5">
      <p class="text-sm" v-if="showSysLink"><p class="text-sm"><router-link to="/my-app-settings"><b-icon icon="code"></b-icon> System Settings</router-link></p>
    </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SideMenu',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    myProjects () {
      const projects = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECTS]
      return projects
    },
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    },
    showSysLink () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile) ? profile.superAdmin : false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
