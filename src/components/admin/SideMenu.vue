<template>
<div>
    <div class="px-5"><p class="text-sm">My Dashboard</p></div>
    <div class="px-5"><p class="text-sm"><b-icon icon="person-fill"></b-icon> Account</p></div>
    <div class="px-5" v-if="showSysLink"><p class="text-sm"><router-link to="/my-app-settings"><b-icon icon="code"></b-icon> System Settings</router-link></p></div>
    <div class="px-5 pb-4 mb-4 border-bottom">
      <p class="text-sm"><b-icon icon="wallet2"></b-icon> Wallet</p>
      <div class="ml-4 d-flex justify-content-between">
        <div class="text-light">Balance:</div>
        <div><span class="text-light">STX </span> <span class="text-info">{{ balance }}</span></div>
      </div>
    </div>
    <div class="px-5 pt-4"><p class="text-sm"><b-icon icon="heart"/> Favourites</p></div>
    <div class="px-5"><p class="text-sm"><b-icon icon="bookmarks"/> My Collections</p></div>
    <div class="px-5 py-4 mb-5 border-top">
      <p class="text-sm"><router-link to="/admin-app"><b-icon icon="code"/> Connect Application</router-link></p>
      <p class="text-sm" v-if="myProjects.length > 0"><router-link to="/my-apps"><b-icon icon="code-slash"/> My Applications</router-link></p>
          <!--
      <div class="pl-4" v-if="myProjects.length > 0">
        <p class="text-light">My Applications</p>
        <div v-for="(result, index) in myProjects" :key="index">
          <p><a :href="'/connect-app/' + result.contractAddress + '.' + result.contractName">{{result.contractName}}</a></p>
          <div class="row my-5">
            <div class="col-3">
              <img width="150px" :src="result.imageUrl"/>
            </div>
            <div class="col-8">
              <p><a :href="'/connect-app/' + result.contractAddress + '.' + result.contractName">{{result.contractName}}</a></p>
              <p>Administrator: {{result.owner}}</p>
              <p>{{result.description}}</p>
              <p style="font-size: 14px;">Lookup contract: <a href="#" @click.prevent="lookupContract(result.contractName)">{{result.contractAddress}}.{{result.contractName}}</a></p>
            </div>
          </div>
        </div>
      </div>
          -->
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
