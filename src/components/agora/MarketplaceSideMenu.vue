<template>
<div>
  <div class="">
    <div class="d-flex justify-content-between">
      <span class="text3">Applications</span>
      <span><b-icon class="text-info" icon="caret-down-fill"/></span>
    </div>
    <project-list :resultSet="resultSet" @set-filter="setProjectFilter"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ProjectList from '@/components/agora/ProjectList'

export default {
  name: 'MarketplaceSideMenu',
  components: {
    ProjectList
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
