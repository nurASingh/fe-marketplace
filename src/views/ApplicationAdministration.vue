<template>
<div class="">
  <main-navbar @blur="showNavbar = !showNavbar" v-if="showNavbar" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
  <div class="">
  <div class="row">
    <div class="col-3 pt-5">
      <div class="pl-5"><p class="text-sm">My Dashboard</p></div>
      <div class="pl-5"><p class="text-sm"><b-icon icon="person-fill"></b-icon> Account</p></div>
      <div class="pl-5 pb-5 mb-5 border-bottom">
        <p class="text-sm"><b-icon icon="wallet2"></b-icon> Wallet</p>
        <div class="ml-4 d-flex justify-content-between">
          <div class="text-light">Balance:</div>
          <div><span class="text-light">STX </span> <span class="text-info">{{ balance }}</span></div>
        </div>
      </div>
      <div class="pl-5 pt-5"><p class="text-sm"><b-icon icon="heart"/> Favourites</p></div>
      <div class="pl-5"><p class="text-sm"><b-icon icon="bookmarks"/> My Collections</p></div>
      <div class="pl-5 pb-5"><p class="text-sm"><b-icon icon="bookmarks"/> My Collections</p></div>
      <div class="pl-5 pt-5 border-top"><p class="text-sm"><b-icon icon="calculator"/> Developers</p></div>
    </div>
    <div class="col-9 pt-5" style="background: #F5F5F5; min-height: 100vh;">
      <div class="container">
        <div class="d-flex justify-content-between">
          <h1>For Developers</h1>
          <div class="account-menu"><b-icon @click="showNavbar = !showNavbar" icon="list"/></div>
        </div>
        <div @click="showNavbar = false" class="container" v-if="projectOption === 0 && myProjects.length > 0">
          <h3>Connected Applications</h3>
          <div v-for="(result, index) in myProjects" :key="index">
            <div class="row my-5">
              <div class="col-3">
                <img width="150px" :src="result.logo"/>
              </div>
              <div class="col-8">
                <!-- <router-link class="mr-3" to="/app-admin"><b-icon icon="eye"></b-icon></router-link> -->
                <p><a :href="'/connect-app-with-contract/' + result.contractAddress + '-' + result.contractName">{{result.contractName}}</a></p>
                <p>Administrator: {{result.owner}}</p>
                <p>{{result.description}}</p>
                <p style="font-size: 14px;">Lookup contract: <a href="#" @click.prevent="lookupContract(result.contractName)">{{result.contractAddress}}-{{result.contractName}}</a></p>
              </div>
            </div>
          </div>
          <p><router-link to="/connect-app" class="text-info">Connect a new application</router-link></p>
        </div>
        <div class="container" v-else-if="projectOption === 0">
          <h3>Connected Applications</h3>
          <div>
            <p>No applications - <router-link to="/connect-app" class="text-info">connect a new application</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import MainNavbar from '@/components/layout/MainNavbar.vue'

export default {
  name: 'ApplicationAdministration',
  components: {
    MainNavbar
  },
  data () {
    return {
      showNavbar: false,
      projectOption: 0
    }
  },
  mounted () {
    this.loading = false
    this.$store.dispatch('projectStore/fetchProjects')
  },
  methods: {
    editProject (contractName) {
      console.log(contractName)
    },
    lookupContract (contractName) {
      console.log(contractName)
    }
  },
  computed: {
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    },
    myProjects () {
      const projects = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECTS]
      return projects
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/custom.scss";
.account-menu {
  padding: 10px 13px;
  background: $secondary;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  font-size: 1.2rem;
  width: 46px;
  height: 46px;
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}</style>
