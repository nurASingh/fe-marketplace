<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <div class="pl-4" v-if="myProjects.length > 0">
        <p class="text-40-300">My Application</p>
        <div v-for="(project, index) in myProjects" :key="index">
          <div class="row my-5">
            <div class="col-4">
              <img width="250px" height="250px" :src="project.imageUrl"/>
            </div>
            <div class="col-8">
              <p>App Name: <router-link :to="'/my-app/' + project.projectId">{{project.title}}</router-link></p>
              <p>Contract Id: <br/><span style="font-size: 12px;">{{project.projectId}}</span></p>
              <p>Owner: {{project.owner}}</p>
              <p>Description: {{project.description}}</p>
              <div v-if="project.interface">
                <div><span>Contract: Deployed</span></div>
              </div>
              <p>
                <router-link class="mr-3" :to="'/my-app/' + project.projectId">open</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MyApplications',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loading: true,
      showContractData: false
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    deleteApp (project) {
      this.$store.dispatch('projectStore/deleteProject', project.projectId).then((results) => {
        this.results = results
      })
    },
    deployed (project) {
      return project.info || project.interface
    },
    openApp (project) {
      if (project.projectId) {
        this.$router.push('/connect-app/' + project.projectId)
      } else {
        this.$notify({ type: 'error', title: 'Project', text: 'Unable to open project - no project id.' })
      }
    }
  },
  computed: {
    myProjects () {
      const projects = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECTS]
      return projects
    },
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    }
  }
}
</script>
<style lang="scss">
.source-code {
  background: #c3dee0;
  border: 2pt solid #342343;
  padding: 25px;
}
</style>
