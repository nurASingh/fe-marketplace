<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="" @click="$emit('toggle-off-navbar')">
      <div class="pl-4" v-if="myProjects.length > 0">
        <p class="text-17-500">Your Applications</p>
        <div v-for="(project, index) in myProjects" :key="index">
            <b-card no-body class="overflow-hidden" >
              <b-row no-gutters>
                <b-col md="4">
                  <b-card-img :src="project.imageUrl" alt="Image" class="rounded-0"></b-card-img>
                </b-col>
                <b-col md="8">
                  <b-card-body>
                    <div class="d-flex justify-content-between">
                      <p class="text-30-500">{{project.title}}</p>
                      <router-link :to="'/connect-app/' + project.projectId"><b-icon icon="pencil"/></router-link>
                    </div>
                    <b-card-text>
                      <div class="mb-2 contract-id">{{project.projectId}}</div>
                      <p class="text1">{{project.owner}}</p>
                      <p class="text1">{{project.description}}</p>
                      <div v-if="project.interface">
                        <div><span>Contract: Deployed</span></div>
                      </div>
                      <b-button variant="info"><router-link class="text-white" :to="'/my-app/' + project.projectId">open</router-link></b-button>
                    </b-card-text>
                  </b-card-body>
                </b-col>
              </b-row>
            </b-card>
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
.contract-id {
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0px;
  color: #5154A1;
}
</style>
