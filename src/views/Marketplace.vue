<template>
<div class="row">
  <div class="col-3">
    <h3>Projects</h3>
    <div v-for="(result, index) in projects" :key="index">
      <img width="150px" :src="result.assetUrl"/>
      <div class="">
        <!-- <router-link class="mr-3" to="/app-admin"><b-icon icon="eye"></b-icon></router-link> -->
        <a href="#" @click.prevent="findByProjectId(result.projectId)">{{result.title}}</a>
      </div>
    </div>
  </div>
  <div class="col-9">
    <h1>Marketplace</h1>
    <div class="row">
      <div class="col-3" v-for="(result, index) in resultSet" :key="index">
        <div v-if="result">
          <router-link :to="'/assets/' + result.assetHash"><img width="100%" :src="result.assetUrl"/></router-link>
          <div class="tagline"><span class="tagline1">{{result.title}}</span></div>
          <div class="tagline">{{created(result.created)}}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Marketplace',
  components: {
  },
  data () {
    return {
      results: null
    }
  },
  mounted () {
    this.loading = false
    this.findByProjectId('loopbomb')
  },
  methods: {
    findByProjectId (projectId) {
      this.$store.dispatch('searchStore/findByProjectId', projectId).then((results) => {
        this.results = results
      })
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
      return this.$store.getters[APP_CONSTANTS.KEY_PROJECTS]
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
