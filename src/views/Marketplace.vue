<template>
<div class="mx-2">
  <div class="" :style="sectionDimensions">
    <div class="">
      <div class="container">
        <h1>Marketplace</h1>
        <div class="row">
          <div class="col-3" v-for="(result, index) in resultSet" :key="index">
            <img width="100%" :src="result.assetUrl"/>
            <div class="tagline"><span class="tagline1">{{result.title}}</span></div>
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
    this.$store.dispatch('searchStore/findByProjectId', 'loopbomb').then((results) => {
      this.results = results
    })
    // this.$store.dispatch('searchStore/findByProjectId').then((results) => {
    //  this.results = results
    // })
  },
  methods: {
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    resultSet () {
      return this.$store.getters['searchStore/getResultSet']
    },
    sectionDimensions () {
      // const height = this.$store.getters['searchStore/getResultSet']
      return 'min-height: 100vh; width: auto;'
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
