<template>
<div v-if="application">
  <img width="150px" height="150px" :src="application.gaiaProject.imageUrl"/>
  <div class="">
    <!-- <router-link class="mr-3" to="/admin-app"><b-icon icon="eye"></b-icon></router-link> -->
    <a href="#" @click.prevent="findByProjectId(application.projectAddress)">{{application.gaiaProject.title}}</a>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SideMenu',
  components: {
  },
  props: ['contractId'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.contractId)
      return (application && application.gaiaProject) ? application : null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
