<template>
<div>
  <div class="container">
    <h1>Application Setup</h1>
  </div>
  <div class="container" v-if="projectOption === 0 && myProjects.length > 0">
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
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ApplicationAdministration',
  components: {
  },
  data () {
    return {
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
    myProjects () {
      const projects = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECTS]
      return projects
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
