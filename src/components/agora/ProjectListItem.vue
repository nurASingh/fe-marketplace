<template>
<div v-if="application">
  <div v-if="application.gaiaProject">
    <img width="150px" height="150px" :src="application.gaiaProject.imageUrl"/>
    <!-- <router-link class="mr-3" to="/admin-app"><b-icon icon="eye"></b-icon></router-link> -->
    <a href="#" @click.prevent="$emit('set-filter', contractId)">{{application.gaiaProject.title}}</a>
  </div>
  <div v-else>
    <!-- <router-link class="mr-3" to="/admin-app"><b-icon icon="eye"></b-icon></router-link> -->
    <a href="#" @click.prevent="$emit('set-filter', contractId)">{{projectName()}}</a>
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
    projectName () {
      return this.contractId.split('.')[1]
    }
  },
  computed: {
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.contractId)
      return application
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
