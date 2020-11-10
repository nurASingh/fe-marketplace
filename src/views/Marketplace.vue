<template>
<div class="container" style="position: relative; top: 150px;">
  <div class="row p-3">
    <div class="col-3 border p-3">
      <h3>Projects</h3>
      <div v-for="(project, index) in projects" :key="index">
        <project-list :contractId="project.contractId" />
      </div>
    </div>
    <div class="col-9 p-3 border">
      <h1>Marketplace</h1>
      <result-grid :resultSet="resultSet" />
      <div class="row">
        <div class="col-3" v-for="(result, index) in resultSet" :key="index">
          <div v-if="result">
            <router-link :to="'/assets/' + result.assetHash"><img width="100%" :src="result.assetUrl"/></router-link>
            <div class="tagline"><span class="tagline1">{{result.title}}</span></div>
            <div class="tagline"><span class="tagline1">{{truncateAssetHash(result.assetHash)}}</span></div>
            <div class="tagline"><span class="tagline1">{{owner(result.artist)}}</span></div>
            <div class="tagline"><span class="tagline1">{{truncateProjectId(result.projectId)}}</span></div>
            <div class="tagline">{{created(result.created)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import ProjectList from '@/components/agora/ProjectList'
import ResultGrid from '@/components/agora/ResultGrid'

export default {
  name: 'Marketplace',
  components: {
    ProjectList,
    ResultGrid
  },
  data () {
    return {
      results: null
    }
  },
  mounted () {
    this.loading = false
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('searchStore/findBySearchTerm').then((results) => {
        this.results = results
      })
    },
    truncateProjectId (projectId) {
      if (projectId.indexOf('.') > -1) {
        let addr = projectId.split('.')[0]
        addr = addr.substring(addr.length - 5)
        return addr + '.' + projectId.split('.')[1]
      }
      return projectId
    },
    truncateAssetHash (assetHash) {
      const addr = assetHash.substring(0, 4)
      return addr + '...' + assetHash.substring(assetHash.length - 4)
    },
    // 91208c24998e8e264f5a8be992d80538b5e8bab9874863f816d603c6df0dca0d
    // b696f04cb51e99953f792703bfabd353b197643f024e7309b27074099ef69eab
    owner (id) {
      return id.split('.')[0]
    },
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    resultSet () {
      return this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
    },
    projects () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP]
      if (appmap) return appmap.apps
      return []
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/custom.scss";
.video-container {
  max-width: 768px;
  max-height: 432px;
  margin: 0 auto;
}
.tagline {
  font-size: 14px;
  font-weight: 300;
}
.tagline1 {
  font-weight: 600;
  color: $yellow;
}
.level1 {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
}
.level2 {
  font-size: 16px;
  font-weight: 300;
  margin-top: 20px;
}
.button1 {
  width: 158px;
  height: 40px;
  font-weight: 600;
  background: #50B1B5 0% 0% no-repeat padding-box;
  border-radius: 22px !important;
}
.button2 {
  width: 158px;
  height: 40px;
  background: #323131 0% 0% no-repeat padding-box !important;
  border: 0px solid #50B1B5 !important;
  border-radius: 22px !important;
  font-weight: 600;
}
.button2:hover {
  color: #fff !important;
}
</style>
